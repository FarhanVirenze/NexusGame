import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('game_id');

  try {
    if (gameId) {
      const { data, error } = await supabaseServer
        .from('game_items')
        .select('*')
        .eq('game_id', gameId)
        .order('price', { ascending: true });

      if (error) throw error;
      return NextResponse.json(data || []);
    }

    const { data, error } = await supabaseServer
      .from('games')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Public games API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
