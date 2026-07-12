import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import crypto from 'crypto';
import { createOrder, getSkuForItem } from '@/lib/celestial';

// Midtrans will call this endpoint when payment status changes
// URL: https://yourdomain.com/api/midtrans/notification

export async function POST(request) {
  try {
    const body = await request.json();

    const { order_id, transaction_status, fraud_status, payment_type, gross_amount, signature_key, status_code } = body;

    if (!order_id || !transaction_status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify signature — REQUIRED for security
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      console.error('[Midtrans Notification] Server key not configured');
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    if (!signature_key) {
      console.error('[Midtrans Notification] Missing signature for order:', order_id);
      return NextResponse.json({ error: 'Missing signature' }, { status: 403 });
    }

    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');

    if (signature_key !== expectedSignature) {
      console.error('[Midtrans Notification] Invalid signature for order:', order_id);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    console.log(`[Midtrans Notification] Order ${order_id} status: ${transaction_status} (fraud: ${fraud_status || 'N/A'})`);

    let newStatus;
    switch (transaction_status) {
      case 'capture':
        newStatus = 'completed';
        break;
      case 'settlement':
        newStatus = 'completed';
        break;
      case 'pending':
        newStatus = 'pending';
        break;
      case 'deny':
        newStatus = 'failed';
        break;
      case 'expire':
        newStatus = 'expired';
        break;
      case 'cancel':
        newStatus = 'failed';
        break;
      default:
        newStatus = 'pending';
    }

    if (transaction_status === 'capture' && fraud_status === 'challenge') {
      newStatus = 'pending';
    }
    if (transaction_status === 'capture' && fraud_status === 'deny') {
      newStatus = 'failed';
    }

    const { error } = await supabaseServer
      .from('transactions')
      .update({
        status: newStatus,
        payment_method: payment_type || null,
      })
      .eq('id', order_id);

    if (error) {
      console.error('[Midtrans Notification] DB update error:', error);
      return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
    }

    console.log(`[Midtrans Notification] Order ${order_id} updated to: ${newStatus}`);

    if (newStatus === 'completed') {
      processCelestialOrder(order_id).catch(err => {
        console.error('[Midtrans Notification] Celestial order failed:', err);
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[Midtrans Notification] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function processCelestialOrder(transactionId) {
  console.log(`[Celestial] Processing order for transaction: ${transactionId}`);

  const { data: transaction, error: fetchError } = await supabaseServer
    .from('transactions')
    .select('*, game_items(name, sku)')
    .eq('id', transactionId)
    .single();

  if (fetchError || !transaction) {
    console.error('[Celestial] Transaction not found:', transactionId);
    return;
  }

  if (!transaction.player_info) {
    console.error('[Celestial] No player_info for transaction:', transactionId);
    await supabaseServer
      .from('transactions')
      .update({ fulfillment_status: 'failed', delivery_sn: 'No player info provided' })
      .eq('id', transactionId);
    return;
  }

  const playerMatch = transaction.player_info.match(/^(\d+)\s*(?:\((\d+)\))?\s*-\s*(.+)$/);
  if (!playerMatch) {
    console.error('[Celestial] Cannot parse player_info:', transaction.player_info);
    await supabaseServer
      .from('transactions')
      .update({ fulfillment_status: 'failed', delivery_sn: 'Cannot parse player info' })
      .eq('id', transactionId);
    return;
  }

  const userId = playerMatch[1];
  const zoneId = playerMatch[2] || null;

  let sku = null;

  if (transaction.game_items && transaction.game_items.sku) {
    sku = transaction.game_items.sku;
  }

  if (!sku && transaction.item_id) {
    const { data: item } = await supabaseServer
      .from('game_items')
      .select('name, sku')
      .eq('id', transaction.item_id)
      .single();

    if (item) {
      sku = item.sku || getSkuForItem(item.name);
    }
  }

  if (!sku && transaction.player_info) {
    sku = getSkuForItem(transaction.player_info);
  }

  if (!sku) {
    console.error('[Celestial] No SKU found for transaction:', transactionId);
    await supabaseServer
      .from('transactions')
      .update({ fulfillment_status: 'failed', delivery_sn: 'No SKU mapping found' })
      .eq('id', transactionId);
    return;
  }

  await supabaseServer
    .from('transactions')
    .update({ fulfillment_status: 'processing' })
    .eq('id', transactionId);

  const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/celestial/webhook`;

  const result = await createOrder({
    refId: transactionId,
    sku,
    target: userId,
    zoneId,
    callbackUrl,
  });

  console.log('[Celestial] Order result:', JSON.stringify(result, null, 2));

  if (result.success && result.data) {
    await supabaseServer
      .from('transactions')
      .update({
        celestial_trx_id: result.data.trx_id,
        fulfillment_status: 'processing',
      })
      .eq('id', transactionId);

    console.log('[Celestial] Order created:', result.data.trx_id);
  } else {
    await supabaseServer
      .from('transactions')
      .update({
        fulfillment_status: 'failed',
        delivery_sn: result.message || 'Order failed',
      })
      .eq('id', transactionId);

    console.error('[Celestial] Order failed:', result.message);
  }
}
