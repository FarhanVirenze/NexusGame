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
    
    // Pass metadata to Supabase
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
    <div className="min-h-screen flex flex-col md:flex-row bg-surface">
      {/* Left side: Form (Scrollable) */}
      <div className="w-full md:w-1/2 lg:w-[50%] flex flex-col px-8 md:px-12 lg:px-20 py-8 md:py-12 overflow-y-auto">
        <a className="font-headline-md text-headline-md font-bold tracking-tighter text-primary shrink-0 mb-8 block" href="/">
          NexusPay
        </a>

        <div className="w-full max-w-lg mx-auto pb-12">
          <div className="mb-8">
            <h1 className="font-display-lg text-headline-lg text-on-surface mb-2">Daftar Akun NexusPay</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Silakan isi form di bawah ini untuk membuat akun baru.</p>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg mb-6 font-body-sm text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-primary/10 border border-primary/20 text-primary p-3 rounded-lg mb-6 font-body-sm text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleManualRegister} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input 
                  type="text" 
                  required
                  className="w-full bg-surface/50 border border-outline-variant/30 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="*Nama Depan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <input 
                  type="text" 
                  required
                  className="w-full bg-surface/50 border border-outline-variant/30 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="*Nama Belakang"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex border border-outline-variant/30 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/50">
              <div className="bg-surface-variant/30 px-4 py-3 flex items-center justify-center border-r border-outline-variant/30">
                <span className="text-xl mr-2">🇮🇩</span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
              </div>
              <input 
                type="tel" 
                required
                className="w-full bg-surface/50 text-on-surface px-4 py-3 focus:outline-none"
                placeholder="Nomor WhatsApp"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <input 
                type="email" 
                required
                className="w-full bg-surface/50 border border-outline-variant/30 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="*Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full bg-surface/50 border border-outline-variant/30 text-on-surface rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="*Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>

            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                required
                className="w-full bg-surface/50 border border-outline-variant/30 text-on-surface rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="*Konfirmasi Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showConfirmPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>

            <div className="pl-2 pt-2 space-y-1">
              <p className="font-body-sm text-sm text-on-surface-variant flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/50"></span> Minimal satu huruf besar (A-Z)
              </p>
              <p className="font-body-sm text-sm text-on-surface-variant flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/50"></span> Minimal satu huruf kecil (a-z)
              </p>
              <p className="font-body-sm text-sm text-on-surface-variant flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/50"></span> Minimal satu angka (0-9)
              </p>
              <p className="font-body-sm text-sm text-on-surface-variant flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/50"></span> Minimal satu karakter khusus (!@#$%^&amp;*)
              </p>
            </div>

            <div className="pt-4 flex items-start gap-3">
              <input 
                type="checkbox" 
                id="terms" 
                required
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
              />
              <label htmlFor="terms" className="font-body-sm text-sm text-on-surface">
                Dengan melakukan ini, anda telah menyetujui <a href="#" className="text-secondary hover:underline">Syarat &amp; Ketentuan</a> dan <a href="#" className="text-secondary hover:underline">Kebijakan Privasi</a>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#cbd5e1] hover:bg-[#94a3b8] text-white font-label-lg px-4 py-3 rounded-xl transition-all active:scale-[0.98] mt-6 disabled:opacity-70 flex justify-center items-center h-12"
            >
              {loading ? <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span> : "Buat Akun"}
            </button>
          </form>

          <p className="mt-8 text-center font-body-sm text-on-surface-variant text-sm">
            Sudah punya akun? <a href="/login" className="text-primary hover:underline font-label-md">Masuk di sini</a>
          </p>
        </div>
      </div>

      {/* Right side: Image */}
      <div className="hidden md:block w-full md:w-1/2 lg:w-[50%] relative overflow-hidden">
        <img 
          src="/images/ml.png"
          alt="Register background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface to-transparent md:to-transparent/50"></div>
      </div>
    </div>
  );
}
