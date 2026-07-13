import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { verifyAuth } from '@/lib/auth';
import { getBalance } from '@/lib/apigames';

export async function POST(request) {
  try {
    // Verify user is authenticated — get userId from server session, NOT client
    const auth = await verifyAuth(request);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await request.json();
    const { gameId, itemName, price, playerInfo, userEmail, itemId } = body;

    // Use server-verified userId, not client-provided
    const userId = auth.user.id;

    if (!gameId || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const merchantId = process.env.MIDTRANS_MERCHANT_ID;
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

    if (!serverKey || !merchantId) {
      return NextResponse.json({ error: 'Midtrans not configured' }, { status: 500 });
    }

    // [NEW] Cek saldo APIGames sebelum mengizinkan checkout
    const apigamesBalance = await getBalance();
    if (apigamesBalance === null) {
      return NextResponse.json({ error: 'Sistem sedang gangguan (gagal cek stok).' }, { status: 500 });
    }
    
    // Asumsi: Modal APIGames pasti lebih kecil dari harga jual (price).
    // Jadi cek saldo >= harga jual adalah proteksi yang sangat aman.
    if (apigamesBalance < price) {
      return NextResponse.json({ error: 'Maaf, stok produk sedang kosong atau sistem sedang maintenance.' }, { status: 400 });
    }

    // 1. Create transaction in Supabase
    const transactionId = crypto.randomUUID();
    const { error: dbError } = await supabaseServer
      .from('transactions')
      .insert({
        id: transactionId,
        user_id: userId,
        game_id: gameId,
        item_id: itemId || null,
        amount: price,
        status: 'pending',
        player_info: playerInfo || null,
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Failed to create transaction record' }, { status: 500 });
    }

    // 2. Create Midtrans Snap transaction
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const midtransApiUrl = isProduction
      ? 'https://api.midtrans.com/snap/v1/transactions'
      : 'https://api.sandbox.midtrans.com/snap/v1/transactions';

    const authString = Buffer.from(`${serverKey}:`).toString('base64');

    const payload = {
      transaction_details: {
        order_id: transactionId,
        gross_amount: price,
      },
      item_details: [{
        id: gameId,
        name: `Top Up ${itemName}`.slice(0, 50),
        price: price,
        quantity: 1,
      }],
      customer: {
        email: userEmail || auth.user.email || 'guest@nexusgame.com',
      },
      callbacks: {
        finish: `${siteUrl}/history`,
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
      console.error('Midtrans error:', midtransData);
      await supabaseServer.from('transactions').update({ status: 'failed' }).eq('id', transactionId);
      return NextResponse.json({ error: midtransData.message || 'Failed to generate payment link' }, { status: midtransRes.status });
    }

    // Simpan redirect_url ke DB supaya bisa dipakai ulang saat "Lanjut Bayar"
    await supabaseServer
      .from('transactions')
      .update({ redirect_url: midtransData.redirect_url })
      .eq('id', transactionId);

    return NextResponse.json({
      success: true,
      redirect_url: midtransData.redirect_url,
      transaction_id: transactionId,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
