import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseServer } from '@/lib/supabaseServer';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email wajib diisi' }, { status: 400 });
    }

    await supabaseServer
      .from('otp_codes')
      .update({ used: true })
      .eq('email', email)
      .eq('used', false);

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const { error: dbError } = await supabaseServer
      .from('otp_codes')
      .insert({
        email,
        otp_code: otpCode,
        expires_at: expiresAt.toISOString(),
      });

    if (dbError) {
      console.error('DB error:', dbError);
      return NextResponse.json({ error: 'Gagal menyimpan OTP' }, { status: 500 });
    }

    const { error: emailError } = await resend.emails.send({
      from: 'NexusPay <onboarding@resend.dev>',
      to: email,
      subject: 'Kode Verifikasi NexusPay',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #006591; text-align: center;">Kode Verifikasi Anda</h2>
          <p style="text-align: center; color: #333;">Masukkan kode berikut untuk memverifikasi akun Anda:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #006591; background: #f0f3ff; padding: 15px 25px; border-radius: 10px;">${otpCode}</span>
          </div>
          <p style="text-align: center; color: #666; font-size: 12px;">Kode ini kadaluarsa dalam 1 jam.</p>
          <p style="text-align: center; color: #666; font-size: 12px;">Jangan bagikan kode ini kepada siapa pun.</p>
        </div>
      `,
    });

    if (emailError) {
      console.error('Email error:', emailError);
      return NextResponse.json({ error: 'Gagal mengirim email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'OTP berhasil dikirim' });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
