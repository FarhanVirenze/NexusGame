"use client"
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';

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
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left side: Form */}
      <div className="w-full md:w-[480px] lg:w-[520px] flex flex-col justify-center px-8 md:px-14 lg:px-20 py-12 relative z-10">
        <a className="inline-flex items-center gap-2.5 shrink-0 mb-14 block" href="/">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-white text-[22px]">sports_esports</span>
          </div>
          <span className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">NexusPay</span>
        </a>

        <div className="w-full max-w-[400px] mx-auto">
          <div className="mb-10">
            <h1 className="font-display-lg text-[32px] md:text-[36px] text-on-surface mb-3 leading-tight">Welcome<br/>Back</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Sign in to continue your top-up</p>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error p-3.5 rounded-2xl mb-6 font-body-md text-sm flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant pl-1">Email</label>
              <input
                type="email"
                required
                className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50 font-body-md"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant pl-1">Password</label>
              <input
                type="password"
                required
                className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50 font-body-md"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <a href="/forgot-password" className="font-label-md text-primary hover:text-primary/80 text-sm transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg px-4 py-3.5 rounded-2xl hover:shadow-xl hover:shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center h-13 font-semibold"
            >
              {loading ? <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span> : "Sign In"}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px bg-outline-variant/40 flex-1"></div>
            <span className="font-label-sm text-on-surface-variant/70 text-xs uppercase tracking-widest">or</span>
            <div className="h-px bg-outline-variant/40 flex-1"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-surface-container-lowest/60 border border-outline-variant/30 text-on-surface font-label-lg px-4 py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:bg-surface-container-high/60 hover:border-outline-variant/50 transition-all"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <p className="mt-10 text-center font-body-md text-on-surface-variant text-sm">
            Don't have an account? <a href="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">Sign up</a>
          </p>
        </div>
      </div>

      {/* Right side: Decorative */}
      <div className="hidden md:flex flex-1 relative overflow-hidden bg-gradient-to-br from-primary/5 via-surface to-primary/10">
        {/* Background image */}
        <img
          src="/images/ml.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/30 to-transparent"></div>

        {/* Floating decorative elements */}
        <div className="absolute top-[15%] right-[12%] w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center animate-bounce" style={{ animationDuration: '3s' }}>
          <span className="material-symbols-outlined text-white/70 text-3xl">diamond</span>
        </div>
        <div className="absolute top-[35%] right-[6%] w-14 h-14 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
          <span className="material-symbols-outlined text-white/70 text-2xl">inventory_2</span>
        </div>
        <div className="absolute bottom-[30%] right-[15%] w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
          <span className="material-symbols-outlined text-white/70 text-[28px]">sports_esports</span>
        </div>
        <div className="absolute top-[60%] right-[4%] w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>
          <span className="material-symbols-outlined text-white/60 text-xl">payment</span>
        </div>

        {/* Main content overlay */}
        <div className="relative z-10 flex flex-col justify-end p-12 lg:p-16 max-w-xl">
          <div className="space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-full text-sm font-label-md">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Trusted top up platform
            </div>
            <h2 className="font-display-lg text-[40px] lg:text-[48px] text-on-surface leading-[1.1]">
              Top Up Game<br/>
              <span className="text-primary"> Favoritmu</span>
            </h2>
            <p className="font-body-lg text-on-surface-variant max-w-md">
              Cepat, aman, dan terpercaya. Tersedia untuk semua game populer.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl px-5 py-3">
              <span className="material-symbols-outlined text-primary text-xl">bolt</span>
              <div>
                <p className="text-on-surface font-label-md text-sm font-semibold">Instant</p>
                <p className="text-on-surface-variant font-caption text-xs">Auto process</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl px-5 py-3">
              <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
              <div>
                <p className="text-on-surface font-label-md text-sm font-semibold">Secure</p>
                <p className="text-on-surface-variant font-caption text-xs">100% safe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
