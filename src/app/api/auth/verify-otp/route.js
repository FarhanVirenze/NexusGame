import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(request) {
  try {
    const { email, otpCode } = await request.json();

    if (!email || !otpCode) {
      return NextResponse.json({ error: 'Email dan kode OTP wajib diisi' }, { status: 400 });
    }

    const { data: otpRecord, error: fetchError } = await supabaseServer
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otpCode)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !otpRecord) {
      return NextResponse.json({ error: 'Kode OTP salah atau kadaluarsa' }, { status: 400 });
    }

    await supabaseServer
      .from('otp_codes')
      .update({ used: true })
      .eq('id', otpRecord.id);

    const { data: userData, error: userFetchError } = await supabaseServer.auth.admin.listUsers();
    const user = userData?.users?.find(u => u.email === email);

    if (userFetchError || !user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    if (!user.email_confirmed_at) {
      const { error: confirmError } = await supabaseServer.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
      );

      if (confirmError) {
        console.error('Confirm error:', confirmError);
        return NextResponse.json({ error: 'Gagal memverifikasi akun' }, { status: 500 });
      }
    }

    const { data: signInData, error: signInError } = await supabaseServer.auth.signInWithPassword({
      email,
      password: null,
    });

    if (signInError) {
      const { data: sessionData, error: sessionError } = await supabaseServer.auth.admin.generateLink({
        type: 'magiclink',
        email,
      });

      if (sessionError) {
        return NextResponse.json({
          message: 'Verifikasi berhasil! Silakan login.',
          verified: true,
        });
      }

      return NextResponse.json({
        message: 'Verifikasi berhasil!',
        verified: true,
        redirectTo: sessionData?.properties?.action_link || '/login',
      });
    }

    return NextResponse.json({
      message: 'Verifikasi berhasil!',
      verified: true,
      session: signInData?.session,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
