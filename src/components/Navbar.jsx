"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 w-full z-[100] bg-surface/70 backdrop-blur-xl border-b border-white/40 shadow-sm shadow-primary/5 transition-all duration-300" id="topNav">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 max-w-container-max mx-auto gap-4">

        <a className="font-headline-md text-headline-md font-bold tracking-tighter text-primary shrink-0" href="/">
          NexusPay
        </a>

        <div className="hidden md:flex flex-1 max-w-md mx-4 relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
          <input className="w-full bg-white/50 border border-outline-variant/30 text-on-surface placeholder-on-surface-variant/70 rounded-full py-2 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all backdrop-blur-md font-body-md text-body-md" placeholder="Search games, vouchers..." type="text" />
        </div>

        <div className="hidden md:flex items-center gap-8 shrink-0">
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md hover:scale-105 duration-200" href="/">Home</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md hover:scale-105 duration-200" href="/promotions">Promotions</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md hover:scale-105 duration-200" href="/history">History</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md hover:scale-105 duration-200" href="/news">News</a>
        </div>

        <div className="hidden md:flex items-center gap-4 shrink-0">
          {!user ? (
            <>
              <a href="/login" className="font-label-md text-label-md text-primary hover:scale-105 transition-transform duration-200 px-4 py-2">
                  Sign In
              </a>
              <a href="/register" className="font-label-md text-label-md bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-200">
                  Sign Up
              </a>
            </>
          ) : (
            <>
              <a href="/settings" className="font-label-md text-label-md text-primary hover:scale-105 transition-transform duration-200 px-4 py-2">
                  My Account
              </a>
              <button onClick={handleLogout} className="font-label-md text-label-md bg-gradient-to-r from-error to-error text-on-error px-6 py-2 rounded-full shadow-lg shadow-error/20 hover:scale-105 transition-transform duration-200">
                  Logout
              </button>
            </>
          )}
        </div>

        <button className="md:hidden text-primary p-2 shrink-0">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </nav>
  );
}
