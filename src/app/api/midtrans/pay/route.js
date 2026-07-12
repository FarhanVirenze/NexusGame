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
      return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
    }

    if (tx.user_id !== auth.user.id && auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (tx.status !== 'pending') {
      return NextResponse.json({ error: 'Transaksi sudah tidak pending' }, { status: 400 });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

    if (!serverKey) {
      return NextResponse.json({ error: 'Midtrans not configured' }, { status: 500 });
    }

    const authString = Buffer.from(`${serverKey}:`).toString('base64');
    const statusUrl = isProduction
      ? `https://api.midtrans.com/v2/${orderId}/status`
      : `https://api.sandbox.midtrans.com/v2/${orderId}/status`;

    // 1. Cek status Midtrans
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

    // 2. Kalau expired/cancelled/denied → update DB, kasih error
    if (['expire', 'cancel', 'deny'].includes(txStatus)) {
      const mappedStatus = txStatus === 'expire' ? 'expired' : 'failed';
      await supabaseServer.from('transactions').update({ status: mappedStatus }).eq('id', orderId);
      return NextResponse.json({
        error: 'Pembayaran sudah kedaluwarsa. Silakan buat pesanan baru dari halaman game.',
        expired: true,
      }, { status: 400 });
    }

    // 3. Masih pending → panggil Snap API dengan order_id yang sama untuk dapat link pembayaran baru
    const { data: game } = await supabaseServer
      .from('games')
      .select('title')
      .eq('id', tx.game_id)
      .single();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const midtransApiUrl = isProduction
      ? 'https://api.midtrans.com/snap/v1/transactions'
      : 'https://api.sandbox.midtrans.com/snap/v1/transactions';

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
      console.error('Snap retry error:', snapData);
      return NextResponse.json({
        error: snapData.message || 'Gagal membuat link pembayaran. Silakan coba lagi.',
      }, { status: snapRes.status });
    }

    return NextResponse.json({
      success: true,
      redirect_url: snapData.redirect_url,
    });

  } catch (error) {
    console.error('Pay error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
