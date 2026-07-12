"use client"
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      if (data.user && !data.session) {
        window.location.href = '/login?registered=true';
      } else {
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
          <img src="/images/logonexus.png" alt="NexusPay" className="w-10 h-10 rounded-xl object-contain" />
          <span className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">NexusPay</span>
        </a>

        <div className="w-full max-w-[400px] mx-auto">
          <div className="mb-10">
            <h1 className="font-display-lg text-[32px] md:text-[36px] text-on-surface mb-3 leading-tight">Sign<br/>Up</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Join NexusPay and start top up</p>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error p-3.5 rounded-2xl mb-6 font-body-md text-sm flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant pl-1">Full Name</label>
              <input
                type="text"
                required
                name="fullName"
                className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50 font-body-md"
                placeholder="Your full name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant pl-1">Email</label>
              <input
                type="email"
                required
                name="email"
                className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50 font-body-md"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant pl-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-2xl px-5 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50 font-body-md"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant pl-1">Confirm Password</label>
              <input
                type="password"
                required
                name="confirmPassword"
                className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50 font-body-md"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg px-4 py-3.5 rounded-2xl hover:shadow-xl hover:shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center h-13 font-semibold"
            >
              {loading ? <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span> : "Create Account"}
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
            Already have an account? <a href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">Sign in</a>
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
          <div className="space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 bg-black/25 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-label-md">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Trusted top up platform
            </div>
            <h2 className="font-display-lg text-[40px] lg:text-[48px] text-white leading-[1.1] drop-shadow-lg">
              Top Up Game<br/>
              <span className="text-primary-container">Favoritmu</span>
            </h2>
            <p className="font-body-lg text-white/80 max-w-md drop-shadow">
              Cepat, aman, dan terpercaya. Tersedia untuk semua game populer.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-black/25 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3">
              <span className="material-symbols-outlined text-primary-container text-xl">bolt</span>
              <div>
                <p className="text-white font-label-md text-sm font-semibold">Instant</p>
                <p className="text-white/70 font-caption text-xs">Auto process</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-black/25 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3">
              <span className="material-symbols-outlined text-primary-container text-xl">verified_user</span>
              <div>
                <p className="text-white font-label-md text-sm font-semibold">Secure</p>
                <p className="text-white/70 font-caption text-xs">100% safe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
