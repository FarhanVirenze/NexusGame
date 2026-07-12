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

    const authString = Buffer.from(`${serverKey}:`).toString('base64');
    const midtransApiUrl = isProduction
      ? 'https://api.midtrans.com/snap/v1/transactions'
      : 'https://api.sandbox.midtrans.com/snap/v1/transactions';
    const statusUrl = isProduction
      ? `https://api.midtrans.com/v2/${orderId}/status`
      : `https://api.sandbox.midtrans.com/v2/${orderId}/status`;

    // 1. Check Midtrans status
    let midtransStatus = null;
    try {
      const statusRes = await fetch(statusUrl, {
        headers: { 'Authorization': `Basic ${authString}` },
      });
      if (statusRes.ok) {
        midtransStatus = await statusRes.json();
      }
    } catch (e) {
      console.warn('Status check failed:', e.message);
    }

    const txStatus = midtransStatus?.transaction_status;
    const isExpired = ['expire', 'cancel', 'deny'].includes(txStatus);

    // 2. If expired/cancelled/denied → mark DB + create new order
    if (isExpired) {
      const mappedStatus = txStatus === 'expire' ? 'expired' : 'failed';
      await supabaseServer.from('transactions').update({ status: mappedStatus }).eq('id', orderId);

      return await createNewOrder(tx, auth.user, serverKey, authString, midtransApiUrl);
    }

    // 3. Still pending (or status unknown) → try Snap for same order first
    const { data: game } = await supabaseServer
      .from('games')
      .select('title')
      .eq('id', tx.game_id)
      .single();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const buildPayload = (newOrderId) => ({
      transaction_details: {
        order_id: newOrderId,
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
    });

    // Try Snap with same order_id (works if still pending)
    const snapRes = await fetch(midtransApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`,
      },
      body: JSON.stringify(buildPayload(tx.id)),
    });

    if (snapRes.ok) {
      const snapData = await snapRes.json();
      return NextResponse.json({ success: true, redirect_url: snapData.redirect_url });
    }

    // 4. Snap failed → likely expired but status check didn't catch it → clone
    const snapErr = await snapRes.json().catch(() => ({}));
    console.warn('Snap failed, cloning order. Error:', snapErr);
    return await createNewOrder(tx, auth.user, serverKey, authString, midtransApiUrl);

  } catch (error) {
    console.error('Pay error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function createNewOrder(tx, user, serverKey, authString, midtransApiUrl) {
  const newTxId = crypto.randomUUID();

  const { data: game } = await supabaseServer
    .from('games')
    .select('title')
    .eq('id', tx.game_id)
    .single();

  const { error: insertErr } = await supabaseServer
    .from('transactions')
    .insert({
      id: newTxId,
      user_id: tx.user_id,
      game_id: tx.game_id,
      amount: tx.amount,
      status: 'pending',
    });

  if (insertErr) {
    console.error('Clone tx error:', insertErr);
    return NextResponse.json({ error: 'Gagal membuat transaksi baru' }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const payload = {
    transaction_details: {
      order_id: newTxId,
      gross_amount: tx.amount,
    },
    item_details: [{
      id: tx.game_id,
      name: `Top Up ${game?.title || 'Game'}`,
      price: tx.amount,
      quantity: 1,
    }],
    customer: {
      email: user.email || 'guest@nexusgame.com',
    },
    callbacks: {
      finish: `${siteUrl}/order/success`,
    },
  };

  const snapRes = await fetch(midtransApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${authString}`,
    },
    body: JSON.stringify(payload),
  });

  const snapData = await snapRes.json();

  if (!snapRes.ok) {
    console.error('Clone snap error:', snapData);
    return NextResponse.json({
      error: 'Link pembayaran kedaluwarsa. Silakan buat pesanan baru dari halaman game.',
    }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    redirect_url: snapData.redirect_url,
    new_order: true,
  });
}
