import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get('table');

  if (!['games', 'users', 'transactions', 'promotions', 'content', 'game_items'].includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
  }

  try {
    let query;
    if (table === 'transactions') {
      query = supabaseServer
        .from('transactions')
        .select('*, users(email), games(title)')
        .order('created_at', { ascending: false });
    } else {
      query = supabaseServer
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching ${table}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
