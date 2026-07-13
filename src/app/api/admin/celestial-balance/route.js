import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { fetchProfile, createDeposit, checkDepositStatus } from '@/lib/celestial';

// GET — Fetch Celestial balance
export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const profile = await fetchProfile();
    if (!profile.success) {
      return NextResponse.json({ error: profile.error || 'Gagal mengambil saldo Celestial' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      saldo: profile.data?.saldo || 0,
      nama: profile.data?.nama || '',
      email: profile.data?.email || '',
    });
  } catch (error) {
    console.error('[Admin Celestial Balance] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — Create manual deposit
export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { jumlah } = body;

    if (!jumlah || jumlah < 10000) {
      return NextResponse.json({ error: 'Nominal deposit minimal Rp 10.000' }, { status: 400 });
    }

    const depositCallbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/celestial/deposit-webhook`;

    const result = await createDeposit({
      jumlah,
      callbackUrl: depositCallbackUrl,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Gagal membuat deposit' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      deposit_id: result.data?.deposit_id,
      jumlah: result.data?.jumlah,
      qr_image: result.data?.qr_image,
      status: result.data?.status,
    });
  } catch (error) {
    console.error('[Admin Celestial Balance] Deposit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
