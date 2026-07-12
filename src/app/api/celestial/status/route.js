import { NextResponse } from 'next/server';
import { checkStatus } from '@/lib/celestial';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const trxId = searchParams.get('trx_id');

    if (!trxId) {
      return NextResponse.json({ error: 'trx_id wajib diisi' }, { status: 400 });
    }

    const result = await checkStatus(trxId);

    if (!result.success) {
      return NextResponse.json({ error: result.message || 'Gagal cek status' }, { status: 400 });
    }

    return NextResponse.json({ success: true, status: result.data });
  } catch (error) {
    console.error('Celestial status error:', error);
    return NextResponse.json({ error: 'Gagal cek status' }, { status: 500 });
  }
}
