import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { table, data } = body;

    if (!['games', 'users', 'promotions', 'content', 'game_items'].includes(table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
    }

    if (table === 'users') {
      // Special logic for creating users via auth admin
      const { email, password, first_name, last_name, phone, role } = data;
      
      const { data: authData, error: authError } = await supabaseServer.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { first_name, last_name, phone }
      });

      if (authError) throw authError;

      // Update role (public.users gets created by trigger)
      const { error: updateError } = await supabaseServer
        .from('users')
        .update({ role: role || 'user' })
        .eq('id', authData.user.id);

      if (updateError) throw updateError;
      
      return NextResponse.json({ success: true, data: authData.user });
    } else {
      const { data: inserted, error } = await supabaseServer
        .from(table)
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return NextResponse.json({ success: true, data: inserted });
    }
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { table, id, data } = body;

    if (!table || !id || !data) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const { data: updated, error } = await supabaseServer
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');
    const id = searchParams.get('id');

    if (!table || !id) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    if (table === 'users') {
      const { error } = await supabaseServer.auth.admin.deleteUser(id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    } else {
      const { error } = await supabaseServer
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
