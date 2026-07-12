import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { verifyAuth } from '@/lib/auth';

export async function POST(request) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const { data: tx, error: txError } = await supabaseServer
      .from('transactions')
      .select('id, game_id, amount, status, user_id')
      .eq('id', orderId)
      .single();

    if (txError || !tx) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (tx.user_id !== auth.user.id && auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (tx.status !== 'pending') {
      return NextResponse.json({ error: 'Transaction is not pending' }, { status: 400 });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

    if (!serverKey) {
      return NextResponse.json({ error: 'Midtrans not configured' }, { status: 500 });
    }

    const { data: game } = await supabaseServer
      .from('games')
      .select('title')
      .eq('id', tx.game_id)
      .single();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const midtransApiUrl = isProduction
      ? 'https://api.midtrans.com/snap/v1/transactions'
      : 'https://api.sandbox.midtrans.com/snap/v1/transactions';

    const authString = Buffer.from(`${serverKey}:`).toString('base64');

    const payload = {
      transaction_details: {
        order_id: tx.id,
        gross_amount: tx.amount,
      },
      item_details: [{
        id: tx.game_id,
        name: `Top Up ${game?.title || 'Game'}`,
        price: tx.amount,
        quantity: 1,
      }],
      customer: {
        email: auth.user.email || 'guest@nexusgame.com',
      },
      callbacks: {
        finish: `${siteUrl}/order/success`,
      },
    };

    const midtransRes = await fetch(midtransApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    });

    const midtransData = await midtransRes.json();

    if (!midtransRes.ok) {
      console.error('Midtrans snap error:', midtransData);
      return NextResponse.json({ error: midtransData.message || 'Failed to create payment' }, { status: midtransRes.status });
    }

    return NextResponse.json({
      success: true,
      redirect_url: midtransData.redirect_url,
    });

  } catch (error) {
    console.error('Pay error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
