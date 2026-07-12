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

    const mlIndonesia = products.filter(p =>
      p.brand === 'Mobile Legends Indonesia' && p.status === 'Tersedia'
    );

    let synced = 0;
    let updated = 0;

    const rows = mlIndonesia.map(product => {
      const celestialPrice = product.harga;
      const markup = 1.30;
      const sellPrice = Math.ceil(celestialPrice * markup / 100) * 100;

      let category = 'Diamonds';
      if (product.nama_produk.toLowerCase().includes('weekly')) {
        category = 'Weekly Diamond Pass';
      } else if (product.nama_produk.toLowerCase().includes('first top up') || product.nama_produk.toLowerCase().includes('bonus')) {
        category = 'First Top Up';
      }

      const bonusMatch = product.nama_produk.match(/\((\d+\s*\+\s*\d+)\)/);

      return {
        game_id: gameId,
        name: product.nama_produk,
        price: sellPrice,
        category,
        sku: product.sku,
        celestial_price: celestialPrice,
        bonus: bonusMatch ? bonusMatch[1] : null,
      };
    });

    if (rows.length > 0) {
      const { data: existingItems } = await supabaseServer
        .from('game_items')
        .select('sku')
        .eq('game_id', gameId);

      const existingSkus = new Set((existingItems || []).map(i => i.sku));
      const toInsert = rows.filter(r => !existingSkus.has(r.sku));
      const toUpdate = rows.filter(r => existingSkus.has(r.sku));

      if (toInsert.length > 0) {
        const { error } = await supabaseServer.from('game_items').insert(toInsert);
        if (error) {
          console.error('Insert error:', error);
          return NextResponse.json({ error: `Gagal insert: ${error.message}` }, { status: 500 });
        }
        synced = toInsert.length;
      }

      for (const row of toUpdate) {
        const { sku, game_id, ...updates } = row;
        await supabaseServer
          .from('game_items')
          .update(updates)
          .eq('game_id', game_id)
          .eq('sku', sku);
        updated++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sync selesai: ${synced} produk baru, ${updated} diperbarui dari ${mlIndonesia.length} produk ML Indonesia`,
      stats: { synced, updated, total_products: products.length, ml_indonesia: mlIndonesia.length },
    });
  } catch (error) {
    console.error('Sync products error:', error.message, error.stack);
    return NextResponse.json({ error: `Gagal sync: ${error.message}` }, { status: 500 });
  }
}
