"use client"
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Error({ error, reset }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center min-h-[80vh] mt-20">
        <div className="text-center px-4">
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-error/10 rounded-full animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-error/20 to-error-container/30 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-error text-5xl">error</span>
            </div>
          </div>
          <h1 className="font-display-lg text-[48px] text-on-surface font-extrabold mb-2">Oops!</h1>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Terjadi Kesalahan</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-8">
            {error?.message || 'Sepertinya ada yang tidak beres. Silakan coba lagi atau hubungi support jika masalah berlanjut.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl font-label-md hover:shadow-lg transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Coba Lagi
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-surface-container border border-outline-variant text-on-surface px-6 py-3 rounded-xl font-label-md hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              Kembali ke Beranda
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
