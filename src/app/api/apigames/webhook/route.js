import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateSignature, mapApiGamesStatus } from '@/lib/apigames';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { ref_id, status, sn } = body;

    console.log('APIGames webhook received:', JSON.stringify(body, null, 2));

    if (!ref_id) {
      return NextResponse.json({ error: 'Invalid payload: missing ref_id' }, { status: 400 });
    }

    const receivedSignature = request.headers.get('x-apigames-authorization');
    const expectedSignature = generateSignature(ref_id);

    if (receivedSignature && receivedSignature !== expectedSignature) {
      console.error('Invalid APIGames webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const { data: transaction, error: findError } = await supabase
      .from('transactions')
      .select('id, status')
      .eq('id', ref_id)
      .single();

    if (findError || !transaction) {
      console.error('Transaction not found for ref_id:', ref_id);
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const newFulfillmentStatus = mapApiGamesStatus(status);
    let newStatus = null;

    if (status === 'Sukses' || status === 'Success') {
      newStatus = 'completed';
    } else if (status === 'Gagal' || status === 'Failed') {
      newStatus = 'failed';
    }

    const updateData = {
      fulfillment_status: newFulfillmentStatus,
      delivered_at: new Date().toISOString(),
    };

    if (sn) {
      updateData.delivery_sn = sn;
    }

    if (newStatus && transaction.status !== 'completed') {
      updateData.status = newStatus;
    }

    const { error: updateError } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', transaction.id);

    if (updateError) {
      console.error('Failed to update transaction:', updateError);
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }

    return NextResponse.json({ status: true });
  } catch (error) {
    console.error('APIGames webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
