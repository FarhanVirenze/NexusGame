import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateCallbackSignature } from '@/lib/celestial';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Celestial calls this when a deposit is paid
// Payload: { status: "paid", data: { deposit_id, jumlah, status, pesan, created_at, updated_at } }
export async function POST(request) {
  try {
    const body = await request.json();
    const { status, data } = body;

    console.log('[Celestial Deposit Webhook] Received:', JSON.stringify(body, null, 2));

    if (!data || !data.deposit_id) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Verify signature: md5(api_key : api_secret : deposit_id)
    const expectedSignature = generateCallbackSignature(data.deposit_id);
    const receivedSignature = body.signature;

    if (receivedSignature && receivedSignature !== expectedSignature) {
      console.error('[Celestial Deposit Webhook] Invalid signature for deposit:', data.deposit_id);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    // Find transaction with this deposit_id
    const { data: transaction, error: findError } = await supabase
      .from('transactions')
      .select('id, status, fulfillment_status')
      .eq('celestial_deposit_id', data.deposit_id)
      .single();

    if (findError || !transaction) {
      console.error('[Celestial Deposit Webhook] Transaction not found for deposit_id:', data.deposit_id);
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (status === 'paid' || data.status === 'paid') {
      // Deposit successful - update transaction and retry order
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          celestial_deposit_status: 'paid',
          fulfillment_status: 'processing',
        })
        .eq('id', transaction.id);

      if (updateError) {
        console.error('[Celestial Deposit Webhook] Update error:', updateError);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
      }

      console.log(`[Celestial Deposit Webhook] Deposit ${data.deposit_id} paid. Retrying order for transaction: ${transaction.id}`);

      // Auto-retry the Celestial order
      processCelestialOrder(transaction.id).catch(err => {
        console.error('[Celestial Deposit Webhook] Retry order failed:', err);
      });
    } else {
      console.log(`[Celestial Deposit Webhook] Deposit ${data.deposit_id} status: ${status}`);
    }

    return NextResponse.json({ status: true });
  } catch (error) {
    console.error('[Celestial Deposit Webhook] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// Reuse processCelestialOrder logic (inline to avoid circular dependency)
async function processCelestialOrder(transactionId) {
  const { createOrder, getSkuForItem, getBalance } = await import('@/lib/celestial');

  console.log(`[Celestial Deposit Webhook] Processing order for transaction: ${transactionId}`);

  const { data: transaction, error: fetchError } = await supabase
    .from('transactions')
    .select('*, game_items(name, sku, celestial_price)')
    .eq('id', transactionId)
    .single();

  if (fetchError || !transaction) {
    console.error('[Celestial Deposit Webhook] Transaction not found:', transactionId);
    return;
  }

  if (!transaction.player_info) {
    await supabase
      .from('transactions')
      .update({ fulfillment_status: 'failed', delivery_sn: 'No player info provided' })
      .eq('id', transactionId);
    return;
  }

  const playerMatch = transaction.player_info.match(/^(\d+)\s*(?:\((\d+)\))?\s*-\s*(.+)$/);
  if (!playerMatch) {
    await supabase
      .from('transactions')
      .update({ fulfillment_status: 'failed', delivery_sn: 'Cannot parse player info' })
      .eq('id', transactionId);
    return;
  }

  const userId = playerMatch[1];
  const zoneId = playerMatch[2] || null;

  let sku = null;
  if (transaction.game_items?.sku) {
    sku = transaction.game_items.sku;
  }
  if (!sku && transaction.item_id) {
    const { data: item } = await supabase
      .from('game_items')
      .select('name, sku')
      .eq('id', transaction.item_id)
      .single();
    if (item) sku = item.sku || getSkuForItem(item.name);
  }

  if (!sku) {
    await supabase
      .from('transactions')
      .update({ fulfillment_status: 'failed', delivery_sn: 'No SKU mapping found' })
      .eq('id', transactionId);
    return;
  }

  // Check balance again after deposit
  const itemCelestialPrice = transaction.game_items?.celestial_price || 0;
  if (itemCelestialPrice > 0) {
    const saldo = await getBalance();
    if (saldo === null || saldo < itemCelestialPrice) {
      await supabase
        .from('transactions')
        .update({ fulfillment_status: 'failed', delivery_sn: `Saldo masih kurang setelah deposit (saldo: ${saldo}, harga: ${itemCelestialPrice})` })
        .eq('id', transactionId);
      return;
    }
  }

  const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/celestial/webhook`;

  const result = await createOrder({
    refId: transactionId,
    sku,
    target: userId,
    zoneId,
    callbackUrl,
  });

  console.log('[Celestial Deposit Webhook] Order result:', JSON.stringify(result, null, 2));

  if (result.success && result.data) {
    await supabase
      .from('transactions')
      .update({
        celestial_trx_id: result.data.trx_id,
        fulfillment_status: 'processing',
      })
      .eq('id', transactionId);
    console.log('[Celestial Deposit Webhook] Order created:', result.data.trx_id);
  } else {
    await supabase
      .from('transactions')
      .update({
        fulfillment_status: 'failed',
        delivery_sn: result.message || result.error || 'Order failed after deposit',
      })
      .eq('id', transactionId);
    console.error('[Celestial Deposit Webhook] Order failed:', result.message || result.error);
  }
}
