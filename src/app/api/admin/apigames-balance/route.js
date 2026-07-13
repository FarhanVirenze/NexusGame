import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { fetchProfile } from '@/lib/apigames';

export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const profile = await fetchProfile();
    if (!profile.success) {
      return NextResponse.json({ error: profile.error || 'Gagal mengambil saldo APIGames' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      saldo: profile.data?.saldo || 0,
      nama: profile.data?.nama || '',
      email: profile.data?.email || '',
    });
  } catch (error) {
    console.error('[Admin APIGames Balance] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
