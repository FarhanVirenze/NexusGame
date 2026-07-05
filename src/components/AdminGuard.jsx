"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminGuard({ children }) {
  const [status, setStatus] = useState('loading'); // loading | authorized | denied

  useEffect(() => {
    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = '/login';
        return;
      }

      // Use server-side API to check role (bypasses RLS)
      try {
        const res = await fetch('/api/check-role', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        const data = await res.json();

        if (data.role === 'admin') {
          setStatus('authorized');
        } else {
          setStatus('denied');
        }
      } catch (err) {
        console.error('Role check failed:', err);
        setStatus('denied');
      }
    }

    checkAdmin();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <span className="material-symbols-outlined animate-spin text-5xl text-primary">progress_activity</span>
          <p className="mt-4 font-body-md text-on-surface-variant">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="glass-card rounded-2xl p-12 max-w-md text-center shadow-xl">
          <div className="w-20 h-20 mx-auto mb-6 bg-error/10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-error">block</span>
          </div>
          <h1 className="font-headline-lg text-headline-md text-on-surface mb-3">Akses Ditolak</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8">
            Anda tidak memiliki izin untuk mengakses halaman ini. Halaman ini hanya tersedia untuk administrator.
          </p>
          <a 
            href="/" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl font-label-md shadow-lg hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
