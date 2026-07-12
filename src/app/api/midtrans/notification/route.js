import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import crypto from 'crypto';

// Midtrans will call this endpoint when payment status changes
// Set this URL in Midtrans Dashboard > Settings > System Configuration > Payment Notification
// URL: https://yourdomain.com/api/midtrans/notification

export async function POST(request) {
  try {
    const body = await request.json();

    // Midtrans sends these fields in the notification:
    // - order_id: our transaction ID
    // - transaction_status: capture, settlement, pending, deny, expire, cancel
    // - fraud_status: accept, challenge, deny (for credit card)
    // - payment_type: gopay, ovo, bank_transfer, credit_card, etc.
    // - gross_amount: total amount
    // - signature_key: HMAC SHA512 signature for verification

    const { order_id, transaction_status, fraud_status, payment_type, gross_amount, signature_key } = body;

    if (!order_id || !transaction_status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify signature for security
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (serverKey && signature_key) {
      const expectedSignature = crypto
        .createHash('sha512')
        .update(`${order_id}${body.status_code}${gross_amount}${serverKey}`)
        .digest('hex');

      if (signature_key !== expectedSignature) {
        console.error('[Midtrans Notification] Invalid signature for order:', order_id);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
      }
    }

    console.log(`[Midtrans Notification] Order ${order_id} status: ${transaction_status} (fraud: ${fraud_status || 'N/A'})`);

    // Map Midtrans status to our internal status
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

    // For credit card transactions, check fraud status
    if (transaction_status === 'capture' && fraud_status === 'challenge') {
      newStatus = 'pending';
    }
    if (transaction_status === 'capture' && fraud_status === 'deny') {
      newStatus = 'failed';
    }

    // Update transaction status in database
    const { error } = await supabaseServer
      .from('transactions')
      .update({ status: newStatus })
      .eq('id', order_id);

    if (error) {
      console.error('[Midtrans Notification] DB update error:', error);
      return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
    }

    console.log(`[Midtrans Notification] Order ${order_id} updated to: ${newStatus}`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[Midtrans Notification] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
