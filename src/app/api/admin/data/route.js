import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { verifyAdmin, validateTable } from '@/lib/auth';

export async function GET(request) {
  const auth = await verifyAdmin(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const table = searchParams.get('table');

  if (!validateTable(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
  }

  try {
    let query;
    if (table === 'transactions') {
      query = supabaseServer
        .from('transactions')
        .select('*, users(email), games(title, image_url)')
        .order('created_at', { ascending: false });
    } else if (table === 'game_items') {
      query = supabaseServer
        .from(table)
        .select('*')
        .order('price', { ascending: true });
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
