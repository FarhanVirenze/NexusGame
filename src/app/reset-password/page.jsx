"use client"
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        }).then(({ error }) => {
          if (error) {
            setError('Link reset password tidak valid atau sudah kadaluarsa.');
          } else {
            setSessionReady(true);
          }
          setChecking(false);
        });
      } else {
        setError('Link reset password tidak valid.');
        setChecking(false);
      }
    } else {
      setError('Link reset password tidak valid.');
      setChecking(false);
    }
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Password tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message || 'Gagal reset password.');
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
  };

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
      </div>
    );
  }

  if (success) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2">Password Berhasil Diubah!</h2>
          <p className="text-sm text-on-surface-variant">Mengalihkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-background overflow-hidden">
      <div className="w-full md:w-[480px] lg:w-[520px] flex flex-col justify-center px-8 md:px-14 lg:px-20 relative z-10">
        <div className="w-full max-w-[400px] mx-auto -mt-4">
          <a className="inline-flex items-center gap-2 shrink-0 mb-8" href="/">
            <img src="/images/logonexus.png" alt="NexusPay" className="w-8 h-8 rounded-lg object-contain" />
            <span className="text-lg font-bold tracking-tight text-on-surface">NexusPay</span>
          </a>

          <div className="mb-5">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-primary text-2xl">lock_reset</span>
            </div>
            <h1 className="text-[24px] text-on-surface mb-1 leading-tight font-bold">Reset Password</h1>
            <p className="text-sm text-on-surface-variant">Masukkan password baru kamu</p>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error p-2.5 rounded-xl mb-4 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}

          {sessionReady && (
            <form onSubmit={handleReset} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-on-surface-variant pl-1">Password Baru</label>
                <input
                  type="password"
                  required
                  className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50"
                  placeholder="Min. 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-on-surface-variant pl-1">Konfirmasi Password</label>
                <input
                  type="password"
                  required
                  className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50"
                  placeholder="Ulangi password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-semibold px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg mr-1.5">lock_reset</span>
                    Ubah Password
                  </>
                )}
              </button>
            </form>
          )}

          <p className="mt-5 text-center text-[11px] text-on-surface-variant">
            <a href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">Kembali ke login</a>
          </p>
        </div>
      </div>

      <div className="hidden md:flex flex-1 relative overflow-hidden">
        <img src="/images/ml.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
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
