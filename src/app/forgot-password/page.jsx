"use client"
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success('Email reset password telah dikirim!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface">
      <div className="w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
        <a className="font-headline-md text-headline-md font-bold tracking-tighter text-primary shrink-0 mb-12 block" href="/">
          NexusPay
        </a>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="font-display-lg text-headline-lg text-on-surface mb-2">Reset Password</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Masukkan email kamu dan kami akan mengirimkan link untuk reset password.
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-500 text-3xl">mark_email_read</span>
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Email Terkirim!</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Kami telah mengirimkan link reset password ke <strong>{email}</strong>. 
                  Silakan cek inbox atau spam folder kamu.
                </p>
              </div>
              <a
                href="/login"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg px-6 py-3 rounded-xl hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Kembali ke Login
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full bg-surface/50 border border-outline-variant/30 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg px-4 py-3 rounded-xl hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center h-12"
              >
                {loading ? <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span> : "Kirim Link Reset"}
              </button>
            </form>
          )}

          <p className="mt-8 text-center font-body-sm text-on-surface-variant text-sm">
            Ingat password? <a href="/login" className="text-primary hover:underline font-label-md">Sign in</a>
          </p>
        </div>
      </div>

      <div className="hidden md:block w-full md:w-1/2 lg:w-[55%] relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" 
          alt="Forgot password background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface to-transparent md:to-transparent/50"></div>
      </div>
    </div>
  );
}
