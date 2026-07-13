import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { verifyAdmin } from '@/lib/auth';
import { readFileSync } from 'fs';
import { join } from 'path';

const GAME_OPERATOR_MAP = {
  'Free Fire': 1,
  'Mobile Legends': 2,
  'Genshin Impact': 19,
  'Valorant': 92,
};

const MARKUP = 1.30;

function categorizeProduct(name, gameTitle) {
  const lower = name.toLowerCase();

  if (gameTitle === 'Free Fire') {
    if (lower.includes('member mingguan') || lower.includes('member bulanan')) return 'Member';
    if (lower.includes('card')) return 'Card';
    return 'Diamonds';
  }

  if (gameTitle === 'Mobile Legends') {
    if (lower.includes('twilight')) return 'Twilight Pass';
    if (lower.includes('weekly pass') || lower.includes('weekly diamond')) return 'Weekly Pass';
    if (lower.includes('passe de grande valor') || lower.includes('first top up')) return 'First Top Up';
    return 'Diamonds';
  }

  if (gameTitle === 'Genshin Impact') {
    if (lower.includes('welkin')) return 'Welkin';
    return 'Genesis Crystals';
  }

  if (gameTitle === 'Valorant') {
    return 'Valorant Points';
  }

  return 'Default';
}

function extractBonus(name) {
  const match = name.match(/\((\d+\s*\+\s*\d+)\)/);
  return match ? match[1] : null;
}

function extractDiamondQty(name) {
  const match = name.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

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

    const operatorId = GAME_OPERATOR_MAP[game.title];
    if (!operatorId) {
      return NextResponse.json({ error: `Game "${game.title}" tidak didukung untuk sync` }, { status: 400 });
    }

    let products;
    try {
      const jsonPath = join(process.cwd(), 'data-produk-13-07-26.json');
      const rawData = readFileSync(jsonPath, 'utf-8');
      products = JSON.parse(rawData);
    } catch (err) {
      return NextResponse.json({ error: `Gagal membaca file produk: ${err.message}` }, { status: 500 });
    }

    const filteredProducts = products.filter(p =>
      p.operator_id === operatorId && p.status === 'aktif'
    );

    let synced = 0;
    let updated = 0;

    const rows = filteredProducts.map(product => {
      const basePrice = product.harga_rupiah;
      const sellPrice = Math.ceil(basePrice * MARKUP / 100) * 100;

      const category = categorizeProduct(product.nama, game.title);
      const bonus = extractBonus(product.nama);
      const diamondQty = extractDiamondQty(product.nama);

      return {
        game_id: gameId,
        name: product.nama,
        price: sellPrice,
        category,
        sku: product.kode_produk,
        apigames_price: basePrice,
        bonus,
        _sort: diamondQty,
      };
    });

    rows.sort((a, b) => a._sort - b._sort);

    if (rows.length > 0) {
      const { data: existingItems } = await supabaseServer
        .from('game_items')
        .select('sku')
        .eq('game_id', gameId);

      const existingSkus = new Set((existingItems || []).map(i => i.sku));
      const toInsert = rows.filter(r => !existingSkus.has(r.sku)).map(({ _sort, ...rest }) => rest);
      const toUpdate = rows.filter(r => existingSkus.has(r.sku)).map(({ _sort, ...rest }) => rest);

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
      message: `Sync selesai: ${synced} produk baru, ${updated} diperbarui dari ${filteredProducts.length} produk ${game.title}`,
      stats: { synced, updated, total_products: products.length, filtered: filteredProducts.length },
    });
  } catch (error) {
    console.error('Sync products error:', error.message, error.stack);
    return NextResponse.json({ error: `Gagal sync: ${error.message}` }, { status: 500 });
  }
}
