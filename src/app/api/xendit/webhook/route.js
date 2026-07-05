import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

// Xendit will call this endpoint when payment status changes
// You need to set this URL in Xendit Dashboard > Settings > Callbacks > Invoice Paid
// URL: https://yourdomain.com/api/xendit/webhook

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Xendit sends these fields in the callback:
    // - external_id: our transaction ID
    // - status: PAID, EXPIRED, etc.
    // - id: Xendit invoice ID
    // - paid_amount, payment_method, etc.
    
    const { external_id, status, id: xenditInvoiceId } = body;

    if (!external_id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(`[Xendit Webhook] Transaction ${external_id} status: ${status}`);

    // Map Xendit status to our internal status
    let newStatus;
    switch (status) {
      case 'PAID':
      case 'SETTLED':
        newStatus = 'completed';
        break;
      case 'EXPIRED':
        newStatus = 'expired';
        break;
      case 'FAILED':
        newStatus = 'failed';
        break;
      default:
        newStatus = 'pending';
    }

    // Update transaction status in database
    const { error } = await supabaseServer
      .from('transactions')
      .update({ status: newStatus })
      .eq('id', external_id);

    if (error) {
      console.error('[Xendit Webhook] DB update error:', error);
      return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
    }

    console.log(`[Xendit Webhook] Transaction ${external_id} updated to: ${newStatus}`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[Xendit Webhook] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
