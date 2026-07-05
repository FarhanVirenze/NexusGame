import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const { data, error } = await supabaseServer
      .from('games')
      .select('id, title, category, image_url')
      .ilike('title', `%${q}%`)
      .limit(5);

    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error searching games:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
