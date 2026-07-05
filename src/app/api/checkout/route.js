import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, gameId, itemName, price, playerInfo, userEmail } = body;

    if (!userId || !gameId || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const xenditSecretKey = process.env.XENDIT_SECRET_KEY;
    if (!xenditSecretKey) {
      return NextResponse.json({ error: 'Xendit Secret Key not configured' }, { status: 500 });
    }

    // 1. Create transaction in Supabase first (status: pending)
    const transactionId = crypto.randomUUID();
    const { error: dbError } = await supabaseServer
      .from('transactions')
      .insert({
        id: transactionId,
        user_id: userId,
        game_id: gameId,
        amount: price,
        status: 'pending'
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Failed to create transaction record' }, { status: 500 });
    }

    // 2. Create Xendit Invoice
    const xenditAuth = Buffer.from(`${xenditSecretKey}:`).toString('base64');
    

    const payload = {
      external_id: transactionId,
      amount: price,
      description: `Top Up ${itemName} - ${playerInfo}`,
      invoice_duration: 3600, // 1 hour
      customer: {
        email: userEmail || 'guest@nexusgame.com'
      },
      success_redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/order/success?id=${transactionId}`,
      failure_redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/game/${gameId}`
    };

    const xenditRes = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${xenditAuth}`
      },
      body: JSON.stringify(payload)
    });

    const xenditData = await xenditRes.json();

    if (!xenditRes.ok) {
      console.error('Xendit error:', xenditData);
      // We could update the transaction status to failed here
      await supabaseServer.from('transactions').update({ status: 'failed' }).eq('id', transactionId);
      return NextResponse.json({ error: xenditData.message || 'Failed to generate payment link' }, { status: xenditRes.status });
    }

    // Return the invoice URL to redirect the user
    return NextResponse.json({
      success: true,
      invoice_url: xenditData.invoice_url,
      transaction_id: transactionId
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
