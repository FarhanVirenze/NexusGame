import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/celestial';
import { verifyAuth } from '@/lib/auth';

export async function POST(request) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { refId, sku, target, zoneId } = body;

    if (!refId || !sku || !target) {
      return NextResponse.json({ error: 'refId, sku, dan target wajib diisi' }, { status: 400 });
    }

    const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/celestial/webhook`;

    const result = await createOrder({ refId, sku, target, zoneId, callbackUrl });

    if (!result.success) {
      return NextResponse.json({ error: result.message || 'Gagal membuat order' }, { status: 400 });
    }

    return NextResponse.json({ success: true, order: result.data });
  } catch (error) {
    console.error('Celestial order error:', error);
    return NextResponse.json({ error: 'Gagal membuat order' }, { status: 500 });
  }
}
