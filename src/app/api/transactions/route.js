import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { verifyUserOrAdmin } from '@/lib/auth';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get('id');
  const userId = searchParams.get('user_id');

  if (!transactionId && !userId) {
    return NextResponse.json({ error: 'Missing id or user_id parameter' }, { status: 400 });
  }

  // Verify auth — user can only see own transactions, admin can see all
  if (userId) {
    const auth = await verifyUserOrAdmin(request, userId);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    let query = supabaseServer.from('transactions').select('*, games(*)');

    if (transactionId) {
      query = query.eq('id', transactionId).single();
    } else if (userId) {
      query = query.eq('user_id', userId).order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Transactions API Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
