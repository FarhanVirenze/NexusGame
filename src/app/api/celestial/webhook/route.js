import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateCallbackSignature } from '@/lib/celestial';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { status, data } = body;

    console.log('Celestial webhook received:', JSON.stringify(body, null, 2));

    if (!data || !data.trx_id) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const expectedSignature = generateCallbackSignature(data.trx_id);
    const receivedSignature = body.signature;

    if (receivedSignature && receivedSignature !== expectedSignature) {
      console.error('Invalid Celestial webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const { data: transaction, error: findError } = await supabase
      .from('transactions')
      .select('id, status')
      .eq('celestial_trx_id', data.trx_id)
      .single();

    if (findError || !transaction) {
      console.error('Transaction not found for celestial_trx_id:', data.trx_id);
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    let newStatus = null;
    let fulfillmentStatus = null;

    if (status === 'success' || data.status === 'success') {
      newStatus = 'completed';
      fulfillmentStatus = 'completed';
    } else if (status === 'failed' || data.status === 'failed') {
      fulfillmentStatus = 'failed';
    } else if (status === 'processing' || data.status === 'processing') {
      fulfillmentStatus = 'processing';
    }

    const updateData = {};
    if (fulfillmentStatus) {
      updateData.fulfillment_status = fulfillmentStatus;
    }
    if (newStatus && transaction.status !== 'completed') {
      updateData.status = newStatus;
    }
    if (data.sn) {
      updateData.delivery_sn = data.sn;
    }
    updateData.delivered_at = new Date().toISOString();

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
    console.error('Celestial webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
