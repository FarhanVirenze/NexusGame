import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { verifyAdmin } from '@/lib/auth';
import { fetchProducts } from '@/lib/celestial';

export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json().catch(() => ({}));
    const { gameId } = body;

    if (!gameId) {
      return NextResponse.json({ error: 'gameId wajib diisi' }, { status: 400 });
    }

    const { data: game, error: gameError } = await supabaseServer
      .from('games')
      .select('id, title')
      .eq('id', gameId)
      .single();

    if (gameError || !game) {
      return NextResponse.json({ error: 'Game tidak ditemukan' }, { status: 404 });
    }

    const celestialResult = await fetchProducts();
    if (!celestialResult.success) {
      const errMsg = celestialResult.error || celestialResult.message || JSON.stringify(celestialResult);
      console.error('Celestial fetch failed:', errMsg);
      return NextResponse.json({ error: `Gagal fetch dari Celestial: ${errMsg}` }, { status: 500 });
    }

    const products = celestialResult.data;
    let synced = 0;
    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      const sku = product.sku;
      const celestialPrice = product.harga;

      const diamondMatch = product.nama_produk.match(/(\d+)\s*(?:\+\s*\d+\s*)?Diamond/i);
      const diamonds = diamondMatch ? parseInt(diamondMatch[1]) : 0;

      let category = 'Diamonds';
      if (product.nama_produk.toLowerCase().includes('weekly')) {
        category = 'Weekly Diamond Pass';
      } else if (product.nama_produk.toLowerCase().includes('bonus')) {
        category = 'First Top Up';
      }

      const markup = 1.30;
      const sellPrice = Math.ceil(celestialPrice * markup / 100) * 100;

      const { data: existing } = await supabaseServer
        .from('game_items')
        .select('id, sku')
        .eq('game_id', gameId)
        .eq('sku', sku)
        .single();

      if (existing) {
        const { error: updateError } = await supabaseServer
          .from('game_items')
          .update({
            name: product.nama_produk,
            price: sellPrice,
            category,
            celestial_price: celestialPrice,
          })
          .eq('id', existing.id);

        if (!updateError) updated++;
      } else {
        const bonusMatch = product.nama_produk.match(/\((\d+\s*\+\s*\d+)\)/);
        const { error: insertError } = await supabaseServer
          .from('game_items')
          .insert({
            game_id: gameId,
            name: product.nama_produk,
            price: sellPrice,
            category,
            sku,
            celestial_price: celestialPrice,
            bonus: bonusMatch ? bonusMatch[1] : null,
          });

        if (!insertError) synced++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sync selesai: ${synced} produk baru, ${updated} diperbarui, ${skipped} dilewati`,
      stats: { synced, updated, skipped, total: products.length },
    });
  } catch (error) {
    console.error('Sync products error:', error);
    return NextResponse.json({ error: 'Gagal sync produk' }, { status: 500 });
  }
}
