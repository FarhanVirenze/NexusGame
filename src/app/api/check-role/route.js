import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return NextResponse.json({ role: null, error: 'No auth token' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');

  // Verify the user's JWT token
  const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ role: null, error: 'Invalid token' }, { status: 401 });
  }

  // Fetch role and profile from users table using service role (bypasses RLS)
  const { data: profile, error: profileError } = await supabaseServer
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ role: 'user', profile: null, error: profileError?.message }, { status: 200 });
  }

  return NextResponse.json({ role: profile.role, profile }, { status: 200 });
}
