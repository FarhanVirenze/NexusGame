import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

// This endpoint checks the real payment status from Xendit
// and syncs it with our database. Useful for sandbox/local dev
// where webhooks can't reach localhost.

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get('id');

  if (!transactionId) {
    return NextResponse.json({ error: 'Missing transaction ID' }, { status: 400 });
  }

  const xenditSecretKey = process.env.XENDIT_SECRET_KEY;
  if (!xenditSecretKey) {
    return NextResponse.json({ error: 'Xendit not configured' }, { status: 500 });
  }

  try {
    const xenditAuth = Buffer.from(`${xenditSecretKey}:`).toString('base64');

    // Fetch invoice from Xendit by external_id (our transaction ID)
    const xenditRes = await fetch(
      `https://api.xendit.co/v2/invoices?external_id=${transactionId}`,
      {
        headers: {
          'Authorization': `Basic ${xenditAuth}`
        }
      }
    );

    if (!xenditRes.ok) {
      const errData = await xenditRes.json();
      console.error('[Xendit Status] Error:', errData);
      return NextResponse.json({ error: 'Failed to check Xendit status' }, { status: 500 });
    }

    const invoices = await xenditRes.json();

    if (!invoices || invoices.length === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const invoice = invoices[0]; // Get the latest invoice for this external_id

    // Map Xendit status to our internal status
    let newStatus;
    switch (invoice.status) {
      case 'PAID':
      case 'SETTLED':
        newStatus = 'completed';
        break;
      case 'EXPIRED':
        newStatus = 'expired';
        break;
      default:
        newStatus = 'pending';
    }

    // Update transaction status in our database
    const { error: dbError } = await supabaseServer
      .from('transactions')
      .update({ status: newStatus })
      .eq('id', transactionId);

    if (dbError) {
      console.error('[Xendit Status] DB update error:', dbError);
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      xendit_status: invoice.status,
      invoice_url: invoice.invoice_url,
      paid_at: invoice.paid_at || null,
      payment_method: invoice.payment_method || null,
    });

  } catch (error) {
    console.error('[Xendit Status] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
