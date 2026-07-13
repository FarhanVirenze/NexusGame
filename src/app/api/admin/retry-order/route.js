import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { verifyAdmin } from '@/lib/auth';
import { createOrder, getSkuForItem } from '@/lib/apigames';

export async function POST(request) {
  const auth = await verifyAdmin(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json({ error: 'Missing transactionId' }, { status: 400 });
    }

    const { data: transaction, error: fetchError } = await supabaseServer
      .from('transactions')
      .select('*, game_items(name, sku), games(title)')
      .eq('id', transactionId)
      .single();

    if (fetchError || !transaction) {
      return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
    }

    if (!transaction.player_info) {
      return NextResponse.json({ error: 'Tidak ada player_info' }, { status: 400 });
    }

    const playerMatch = transaction.player_info.match(/^(\d+)\s*(?:\((\d+)\))?\s*-\s*(.+)$/);
    if (!playerMatch) {
      return NextResponse.json({ error: 'Gagal parse player_info: ' + transaction.player_info }, { status: 400 });
    }

    const userId = playerMatch[1];
    const zoneId = playerMatch[2] || null;

    let sku = transaction.game_items?.sku || null;

    if (!sku && transaction.item_id) {
      const { data: item } = await supabaseServer
        .from('game_items')
        .select('name, sku')
        .eq('id', transaction.item_id)
        .single();
      if (item) {
        const gameTitle = transaction.games?.title || '';
        sku = item.sku || getSkuForItem(item.name, gameTitle);
      }
    }

    if (!sku) {
      return NextResponse.json({ error: 'Tidak ada SKU untuk transaksi ini' }, { status: 400 });
    }

    const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/apigames/webhook`;

    console.log('[Retry] Sending order | SKU:', sku, '| Target:', userId, '| Zone:', zoneId, '| RefId:', transactionId);

    const result = await createOrder({
      refId: transactionId,
      sku,
      target: userId,
      zoneId,
      callbackUrl,
    });

    console.log('[Retry] Result:', JSON.stringify(result, null, 2));

    const orderSuccess = result.success === true || result.data?.status === 'success';

    if (orderSuccess) {
      await supabaseServer
        .from('transactions')
        .update({
          apigames_trx_id: result.data?.data?.ref_id || result.data?.ref_id || transactionId,
          fulfillment_status: 'processing',
          delivery_sn: null,
        })
        .eq('id', transactionId);

      return NextResponse.json({ success: true, message: 'Order berhasil dikirim ulang' });
    } else {
      const failMsg = result.error || result.raw?.message || result.raw?.error || 'Order failed';
      await supabaseServer
        .from('transactions')
        .update({ delivery_sn: failMsg })
        .eq('id', transactionId);

      return NextResponse.json({ success: false, error: failMsg, raw: result.raw });
    }

  } catch (error) {
    console.error('[Retry] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
