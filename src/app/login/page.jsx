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
      // Check user role via server-side API (bypasses RLS)
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
        // Fallback to home if role check fails
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
    <div className="min-h-screen flex flex-col md:flex-row bg-surface">
      {/* Left side: Form */}
      <div className="w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
        <a className="font-headline-md text-headline-md font-bold tracking-tighter text-primary shrink-0 mb-12 block" href="/">
          NexusPay
        </a>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="font-display-lg text-headline-lg text-on-surface mb-2">Welcome Back</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Sign in to your NexusPay account</p>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg mb-6 font-body-sm text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-4">
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
            
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Password</label>
              <input 
                type="password" 
                required
                className="w-full bg-surface/50 border border-outline-variant/30 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="text-right">
              <a href="/forgot-password" className="font-label-sm text-primary hover:underline text-sm">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg px-4 py-3 rounded-xl hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center h-12"
            >
              {loading ? <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span> : "Sign In"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-outline-variant/30 flex-1"></div>
            <span className="font-label-sm text-on-surface-variant text-sm uppercase tracking-wider">or</span>
            <div className="h-px bg-outline-variant/30 flex-1"></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full glass-panel border border-outline-variant/30 text-on-surface font-label-lg px-4 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-surface-variant/50 transition-colors"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <p className="mt-8 text-center font-body-sm text-on-surface-variant text-sm">
            Don't have an account? <a href="/register" className="text-primary hover:underline font-label-md">Sign up</a>
          </p>
        </div>
      </div>

      {/* Right side: Image */}
      <div className="hidden md:block w-full md:w-1/2 lg:w-[55%] relative overflow-hidden">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG_XO6IpFp_EadDhd-DfEqX9RU9i3M1bLsKwVSRJ3GYqfaan5FrQC-oAqtrkeU2jW4gf8pFUBPrF63JMLWPG8QlAnozVdieBaSrdzMY1RjP-Z5IJm8ONct3lDpkc3TAhWD-S8FsNRm3wmohUEfl5oSjVOaY2bTozW6zExp7XapFmg6vZLBhhr5pPmgpUyoL8y6HLtXVItB65SUgWiRyfgoRYRcIFKi5lu3XxmSjbv4rUxcEEp8Ru7HOMQp9TUgKQhkkx9glU1v2F9O" 
          alt="Login background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface to-transparent md:to-transparent/50"></div>
      </div>
    </div>
  );
}
