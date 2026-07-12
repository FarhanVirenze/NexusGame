"use client"
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleManualRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!termsAgreed) {
      setError("You must agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Registration successful! Please check your email to confirm your account.');
    }
    setLoading(false);
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
      {/* Left side: Form (Scrollable) */}
      <div className="w-full md:w-[480px] lg:w-[560px] flex flex-col px-8 md:px-12 lg:px-16 py-8 md:py-10 relative z-10 overflow-y-auto">
        <a className="inline-flex items-center gap-2.5 shrink-0 mb-10 block" href="/">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-white text-[22px]">sports_esports</span>
          </div>
          <span className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">NexusPay</span>
        </a>

        <div className="w-full max-w-[440px] mx-auto pb-10">
          <div className="mb-8">
            <h1 className="font-display-lg text-[28px] md:text-[32px] text-on-surface mb-3 leading-tight">Daftar Akun</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Buat akun dan mulai top-up sekarang</p>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error p-3.5 rounded-2xl mb-5 font-body-md text-sm flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          {success && (
            <div className="bg-primary/10 border border-primary/20 text-primary p-3.5 rounded-2xl mb-5 font-body-md text-sm flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              {success}
            </div>
          )}

          <form onSubmit={handleManualRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant pl-1">Nama Depan</label>
                <input
                  type="text"
                  required
                  className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50 font-body-md"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant pl-1">Nama Belakang</label>
                <input
                  type="text"
                  required
                  className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50 font-body-md"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant pl-1">Nomor WhatsApp</label>
              <div className="flex border border-outline-variant/40 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/60 transition-all bg-surface-container-lowest/80">
                <div className="bg-surface-container-high/60 px-4 py-3.5 flex items-center justify-center border-r border-outline-variant/30 gap-1.5">
                  <span className="text-lg">🇮🇩</span>
                  <span className="font-body-md text-on-surface-variant text-sm">+62</span>
                </div>
                <input
                  type="tel"
                  required
                  className="w-full bg-transparent text-on-surface px-5 py-3.5 focus:outline-none font-body-md placeholder:text-on-surface-variant/50"
                  placeholder="8123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-2xl pl-5 pr-14 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50 font-body-md"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant pl-1">Konfirmasi Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full bg-surface-container-lowest/80 border border-outline-variant/40 text-on-surface rounded-2xl pl-5 pr-14 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-on-surface-variant/50 font-body-md"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showConfirmPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Password strength indicators */}
            <div className="pl-1 pt-1 space-y-1.5">
              {[
                { check: /[A-Z]/.test(password), label: 'Satu huruf besar (A-Z)' },
                { check: /[a-z]/.test(password), label: 'Satu huruf kecil (a-z)' },
                { check: /[0-9]/.test(password), label: 'Satu angka (0-9)' },
                { check: /[!@#$%^&*]/.test(password), label: 'Satu karakter khusus (!@#$%^&*)' },
              ].map((item, i) => (
                <p key={i} className={`font-body-sm text-xs flex items-center gap-2 transition-colors ${item.check ? 'text-green-600' : 'text-on-surface-variant/60'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${item.check ? 'bg-green-500' : 'bg-on-surface-variant/30'}`}></span>
                  {item.label}
                </p>
              ))}
            </div>

            <div className="pt-2 flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                required
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
              />
              <label htmlFor="terms" className="font-body-sm text-sm text-on-surface-variant">
                Saya menyetujui <a href="#" className="text-primary hover:underline font-medium">Syarat &amp; Ketentuan</a> dan <a href="#" className="text-primary hover:underline font-medium">Kebijakan Privasi</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg px-4 py-3.5 rounded-2xl hover:shadow-xl hover:shadow-primary/25 transition-all active:scale-[0.98] mt-4 disabled:opacity-70 flex justify-center items-center h-13 font-semibold"
            >
              {loading ? <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span> : "Buat Akun"}
            </button>
          </form>

          <p className="mt-8 text-center font-body-md text-on-surface-variant text-sm">
            Sudah punya akun? <a href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">Masuk di sini</a>
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
        <div className="absolute top-[12%] right-[10%] w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center animate-bounce" style={{ animationDuration: '3s' }}>
          <span className="material-symbols-outlined text-white/70 text-3xl">diamond</span>
        </div>
        <div className="absolute top-[38%] right-[5%] w-14 h-14 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
          <span className="material-symbols-outlined text-white/70 text-2xl">inventory_2</span>
        </div>
        <div className="absolute bottom-[28%] right-[14%] w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
          <span className="material-symbols-outlined text-white/70 text-[28px]">sports_esports</span>
        </div>
        <div className="absolute top-[62%] right-[3%] w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>
          <span className="material-symbols-outlined text-white/60 text-xl">payment</span>
        </div>

        {/* Main content overlay */}
        <div className="relative z-10 flex flex-col justify-end p-12 lg:p-16 max-w-xl">
          <div className="space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-full text-sm font-label-md">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Join 50,000+ gamers
            </div>
            <h2 className="font-display-lg text-[40px] lg:text-[48px] text-on-surface leading-[1.1]">
              Mulai Top Up<br/>
              <span className="text-primary">Sekarang</span>
            </h2>
            <p className="font-body-lg text-on-surface-variant max-w-md">
              Daftar gratis dan dapatkan akses ke semua game favoritmu.
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
