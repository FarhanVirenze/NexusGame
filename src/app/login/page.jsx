"use client"
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      try {
        const res = await fetch('/api/check-role', {
          headers: {
            'Authorization': `Bearer ${data.session.access_token}`,
          },
        });
        const roleData = await res.json();
        if (roleData.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      } catch (err) {
        window.location.href = '/';
      }
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      }
    });
    if (error) setError(error.message);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Left side: Form */}
      <div className="w-full md:w-[480px] lg:w-[520px] flex flex-col justify-center px-8 md:px-14 lg:px-20 relative z-10">
        <div className="w-full max-w-[400px] mx-auto -mt-4">
          <a className="inline-flex items-center gap-2 shrink-0 mb-8" href="/">
            <img src="/images/logonexus.png" alt="NexusPay" className="w-8 h-8 rounded-lg object-contain" />
            <span className="text-lg font-bold tracking-tight text-on-surface">NexusPay</span>
          </a>

          <div className="mb-5">
            <h1 className="text-[26px] text-on-surface mb-1 leading-tight font-bold">Sign In</h1>
            <p className="text-sm text-on-surface-variant">Sign in to continue your top-up</p>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error p-2.5 rounded-xl mb-4 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-on-surface-variant pl-1">Email</label>
              <input
                type="email"
                required
                className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-on-surface-variant pl-1">Password</label>
              <input
                type="password"
                required
                className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end -mb-0.5">
              <a href="/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-semibold px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> : "Sign In"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px bg-outline-variant/40 flex-1"></div>
            <span className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest">or</span>
            <div className="h-px bg-outline-variant/40 flex-1"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-surface-container-lowest/60 border border-outline-variant/30 text-on-surface text-sm font-medium px-4 py-2.5 rounded-xl flex items-center justify-center gap-2.5 hover:bg-surface-container-high/60 hover:border-outline-variant/50 transition-all"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
            Continue with Google
          </button>

          <p className="mt-5 text-center text-xs text-on-surface-variant">
            Don&apos;t have an account? <a href="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">Sign up</a>
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

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent w-1/3"></div>

        <div className="absolute top-[15%] right-[10%] w-16 h-16 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center animate-bounce" style={{ animationDuration: '3s' }}>
          <span className="material-symbols-outlined text-white text-3xl">diamond</span>
        </div>
        <div className="absolute top-[38%] right-[4%] w-12 h-12 rounded-xl bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
          <span className="material-symbols-outlined text-white text-2xl">inventory_2</span>
        </div>
        <div className="absolute bottom-[32%] right-[12%] w-14 h-14 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
          <span className="material-symbols-outlined text-white text-[28px]">sports_esports</span>
        </div>
        <div className="absolute top-[62%] right-[3%] w-11 h-11 rounded-xl bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>
          <span className="material-symbols-outlined text-white text-xl">payments</span>
        </div>

        <div className="relative z-10 flex flex-col justify-end p-12 lg:p-16 max-w-xl">
          <div className="space-y-3 mb-6">
            <div className="inline-flex items-center gap-2 bg-black/25 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-medium">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Trusted top up platform
            </div>
            <h2 className="font-display-lg text-[40px] lg:text-[48px] text-white leading-[1.1] drop-shadow-lg">
              Top Up Game<br/>
              <span className="text-primary-container">Favoritmu</span>
            </h2>
            <p className="text-white/80 max-w-md drop-shadow text-sm">
              Cepat, aman, dan terpercaya. Tersedia untuk semua game populer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md border border-white/15 rounded-xl px-4 py-2.5">
              <span className="material-symbols-outlined text-primary-container text-base">bolt</span>
              <div>
                <p className="text-white text-xs font-semibold">Instant</p>
                <p className="text-white/60 text-[10px]">Auto process</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md border border-white/15 rounded-xl px-4 py-2.5">
              <span className="material-symbols-outlined text-primary-container text-base">verified_user</span>
              <div>
                <p className="text-white text-xs font-semibold">Secure</p>
                <p className="text-white/60 text-[10px]">100% safe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
