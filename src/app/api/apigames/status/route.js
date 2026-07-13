import { NextResponse } from 'next/server';
import { checkStatus } from '@/lib/apigames';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const refId = searchParams.get('ref_id');

    if (!refId) {
      return NextResponse.json({ error: 'ref_id wajib diisi' }, { status: 400 });
    }

    const result = await checkStatus(refId);

    if (!result.success) {
      return NextResponse.json({ error: result.message || result.error || 'Gagal cek status' }, { status: 400 });
    }

    return NextResponse.json({ success: true, status: result.data });
  } catch (error) {
    console.error('APIGames status error:', error);
    return NextResponse.json({ error: 'Gagal cek status' }, { status: 500 });
  }
}
