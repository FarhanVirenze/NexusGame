import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { verifyUserOrAdmin } from '@/lib/auth';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('id');

  if (!orderId) {
    return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
  }

  // Verify auth — user can only check own orders, admin can check all
  const auth = await verifyUserOrAdmin(request, null);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

  if (!serverKey) {
    return NextResponse.json({ error: 'Midtrans not configured' }, { status: 500 });
  }

  try {
    const authString = Buffer.from(`${serverKey}:`).toString('base64');
    const midtransApiUrl = isProduction
      ? `https://api.midtrans.com/v2/${orderId}/status`
      : `https://api.sandbox.midtrans.com/v2/${orderId}/status`;

    const midtransRes = await fetch(midtransApiUrl, {
      headers: {
        'Authorization': `Basic ${authString}`,
      },
    });

    if (!midtransRes.ok) {
      const errData = await midtransRes.json();
      console.error('[Midtrans Status] Error:', errData);
      return NextResponse.json({ error: 'Failed to check Midtrans status' }, { status: 500 });
    }

    const data = await midtransRes.json();

    let newStatus;
    const transactionStatus = data.transaction_status;
    const fraudStatus = data.fraud_status;

    switch (transactionStatus) {
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

    if (transactionStatus === 'capture' && fraudStatus === 'challenge') {
      newStatus = 'pending';
    }
    if (transactionStatus === 'capture' && fraudStatus === 'deny') {
      newStatus = 'failed';
    }

    const { error: dbError } = await supabaseServer
      .from('transactions')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (dbError) {
      console.error('[Midtrans Status] DB update error:', dbError);
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      midtrans_status: transactionStatus,
      fraud_status: fraudStatus || null,
      payment_type: data.payment_type || null,
      settlement_time: data.settlement_time || null,
    });

  } catch (error) {
    console.error('[Midtrans Status] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
