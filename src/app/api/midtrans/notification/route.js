import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import crypto from 'crypto';

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
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[Midtrans Notification] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
