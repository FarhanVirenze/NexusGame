"use client"
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [sending, setSending] = useState(true);
  const inputRefs = useRef([]);
  const autoSubmitted = useRef(false);

  useEffect(() => {
    if (email && !autoSubmitted.current) {
      autoSubmitted.current = true;
      sendOTP();
    }
  }, [email]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (inputRefs.current[0] && !sending) {
      inputRefs.current[0].focus();
    }
  }, [sending]);

  const sendOTP = async () => {
    setSending(true);
    setError('');
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    if (error) {
      setError(error.message || 'Gagal mengirim kode OTP');
    }
    setSending(false);
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(d => d !== '') && newOtp.join('').length === 8) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    if (pasted.length === 0) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    const nextEmpty = newOtp.findIndex(d => d === '');
    const focusIndex = nextEmpty === -1 ? 7 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();

    if (pasted.length === 8) {
      handleVerify(pasted);
    }
  };

  const handleVerify = useCallback(async (code) => {
    if (!email) {
      setError('Email tidak ditemukan. Silakan daftar ulang.');
      return;
    }

    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });

    if (error) {
      setError('Kode verifikasi salah atau kadaluarsa.');
      setOtp(['', '', '', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  }, [email]);

  const handleResend = async () => {
    if (!email) return;

    setCanResend(false);
    setResendCooldown(60);
    setError('');

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      setError(error.message || 'Gagal mengirim ulang kode. Coba lagi nanti.');
      setCanResend(true);
      setResendCooldown(0);
    }
  };

  if (success) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2">Verifikasi Berhasil!</h2>
          <p className="text-sm text-on-surface-variant">Mengalihkan ke halaman utama...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Left side: OTP Form */}
      <div className="w-full md:w-[480px] lg:w-[520px] flex flex-col justify-center px-8 md:px-14 lg:px-20 relative z-10">
        <div className="w-full max-w-[400px] mx-auto -mt-4">
          <a className="inline-flex items-center gap-2 shrink-0 mb-8" href="/">
            <img src="/images/logonexus.png" alt="NexusPay" className="w-8 h-8 rounded-lg object-contain" />
            <span className="text-lg font-bold tracking-tight text-on-surface">NexusPay</span>
          </a>

          <div className="mb-5">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-primary text-2xl">mail</span>
            </div>
            <h1 className="text-[24px] text-on-surface mb-1 leading-tight font-bold">Verifikasi Email</h1>
            <p className="text-sm text-on-surface-variant">
              {sending ? 'Mengirim kode verifikasi...' : 'Masukkan kode 8 digit yang dikirim ke'}
            </p>
            {!sending && <p className="text-sm font-semibold text-on-surface">{email}</p>}
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error p-2.5 rounded-xl mb-4 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}

          {sending ? (
            <div className="flex flex-col items-center py-8">
              <span className="material-symbols-outlined animate-spin text-3xl text-primary mb-3">progress_activity</span>
              <p className="text-sm text-on-surface-variant">Mengirim kode ke {email}...</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleVerify(otp.join('')); }}>
              <div className="flex gap-2 justify-center mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={loading}
                    className="w-10 h-12 text-center text-lg font-bold bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all disabled:opacity-50"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || otp.some(d => d === '')}
                className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-semibold px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg mr-1.5">verified</span>
                    Verify
                  </>
                )}
              </button>
            </form>
          )}

          {!sending && (
            <div className="mt-5 text-center">
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="text-xs text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Kirim ulang kode
                </button>
              ) : (
                <p className="text-xs text-on-surface-variant">
                  Kirim ulang dalam <span className="font-semibold text-on-surface">{resendCooldown}s</span>
                </p>
              )}
            </div>
          )}

          <p className="mt-4 text-center text-[11px] text-on-surface-variant">
            <a href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">Kembali ke login</a>
          </p>
        </div>
      </div>

      {/* Right side: Decorative */}
      <div className="hidden md:flex flex-1 relative overflow-hidden">
        <img
          src="/images/ml.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent w-1/4"></div>

        <div className="absolute top-[15%] right-[10%] w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center animate-bounce shadow-lg" style={{ animationDuration: '3s' }}>
          <span className="material-symbols-outlined text-white drop-shadow text-2xl">diamond</span>
        </div>
        <div className="absolute top-[38%] right-[4%] w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center animate-bounce shadow-lg" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
          <span className="material-symbols-outlined text-white drop-shadow text-xl">inventory_2</span>
        </div>
        <div className="absolute bottom-[32%] right-[12%] w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center animate-bounce shadow-lg" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
          <span className="material-symbols-outlined text-white drop-shadow text-2xl">sports_esports</span>
        </div>
        <div className="absolute top-[62%] right-[3%] w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center animate-bounce shadow-lg" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>
          <span className="material-symbols-outlined text-white drop-shadow text-lg">payments</span>
        </div>

        <div className="relative z-10 flex flex-col justify-end p-10 lg:p-14 max-w-xl">
          <div className="space-y-3 mb-5">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-md">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400"></span>
              Trusted top up platform
            </div>
            <h2 className="text-[36px] lg:text-[44px] text-white leading-[1.1] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              Top Up Game<br/>
              <span className="text-primary-container drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">Favoritmu</span>
            </h2>
            <p className="text-white/90 max-w-md drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] text-sm">
              Cepat, aman, dan terpercaya. Tersedia untuk semua game populer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5 shadow-md">
              <span className="material-symbols-outlined text-primary-container text-base drop-shadow">bolt</span>
              <div>
                <p className="text-white text-xs font-semibold drop-shadow">Instant</p>
                <p className="text-white/70 text-[10px] drop-shadow">Auto process</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5 shadow-md">
              <span className="material-symbols-outlined text-primary-container text-base drop-shadow">verified_user</span>
              <div>
                <p className="text-white text-xs font-semibold drop-shadow">Secure</p>
                <p className="text-white/70 text-[10px] drop-shadow">100% safe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
