"use client"
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (cooldown > 0) return;
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
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
        }
      }
    });

    if (error) {
      console.error('SignUp error:', error);
      const msg = error.message || error.error_description || JSON.stringify(error);
      if (msg.includes('rate limit') || msg.includes('email')) {
        setError('Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.');
        setCooldown(60);
      } else if (msg.includes('already registered') || msg.includes('already been registered')) {
        setError('Email sudah terdaftar. Silakan login atau gunakan email lain.');
      } else {
        setError(msg);
      }
      setLoading(false);
    } else {
      if (data.user && !data.session) {
        window.location.href = `/verify-email?email=${encodeURIComponent(formData.email)}`;
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
    <div className="h-screen flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Left side: Form */}
      <div className="w-full md:w-[480px] lg:w-[520px] flex flex-col justify-center px-8 md:px-12 lg:px-16 relative z-10">
        <div className="w-full max-w-[400px] mx-auto -mt-2">
          <a className="inline-flex items-center gap-2 shrink-0 mb-5" href="/">
            <img src="/images/logonexus.png" alt="NexusPay" className="w-8 h-8 rounded-lg object-contain" />
            <span className="text-lg font-bold tracking-tight text-on-surface">NexusPay</span>
          </a>

          <div className="mb-3">
            <h1 className="text-[24px] text-on-surface mb-0.5 leading-tight font-bold">Sign Up</h1>
            <p className="text-xs text-on-surface-variant">Join NexusPay and start top up</p>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error p-2 rounded-lg mb-2 text-[11px] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1 space-y-0.5">
                <label className="text-[11px] font-medium text-on-surface-variant pl-1">First Name</label>
                <input
                  type="text"
                  required
                  name="firstName"
                  className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1 space-y-0.5">
                <label className="text-[11px] font-medium text-on-surface-variant pl-1">Last Name</label>
                <input
                  type="text"
                  required
                  name="lastName"
                  className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-0.5">
              <label className="text-[11px] font-medium text-on-surface-variant pl-1">Phone</label>
              <input
                type="tel"
                required
                name="phone"
                className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50"
                placeholder="08xxxxxxxxxx"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-0.5">
              <label className="text-[11px] font-medium text-on-surface-variant pl-1">Email</label>
              <input
                type="email"
                required
                name="email"
                className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1 space-y-0.5">
                <label className="text-[11px] font-medium text-on-surface-variant pl-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    name="password"
                    className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-lg px-3 py-1.5 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50"
                    placeholder="Min. 6 chars"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface transition-colors">
                    <span className="material-symbols-outlined text-[14px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 space-y-0.5">
                <label className="text-[11px] font-medium text-on-surface-variant pl-1">Confirm</label>
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-semibold px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center mt-1"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
              ) : cooldown > 0 ? (
                `Tunggu ${cooldown}s`
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="my-2.5 flex items-center gap-3">
            <div className="h-px bg-outline-variant/40 flex-1"></div>
            <span className="text-[9px] text-on-surface-variant/70 uppercase tracking-widest">or</span>
            <div className="h-px bg-outline-variant/40 flex-1"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-surface-container-lowest/60 border border-outline-variant/30 text-on-surface text-xs font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-high/60 hover:border-outline-variant/50 transition-all"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-3.5 h-3.5" />
            Continue with Google
          </button>

          <p className="mt-3 text-center text-[11px] text-on-surface-variant">
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
