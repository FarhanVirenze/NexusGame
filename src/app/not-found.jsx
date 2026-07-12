"use client"
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center min-h-[80vh] mt-20">
        <div className="text-center px-4">
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-primary/20 to-primary-container/30 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-5xl">explore_off</span>
            </div>
          </div>
          <h1 className="font-display-lg text-[64px] md:text-[80px] text-on-surface font-extrabold mb-2">404</h1>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Halaman Tidak Ditemukan</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-8">
            Sepertinya halaman yang kamu cari sudah dipindahkan atau tidak tersedia. Kembali ke beranda untuk melanjutkan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl font-label-md hover:shadow-lg transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              Kembali ke Beranda
            </a>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 bg-surface-container border border-outline-variant text-on-surface px-6 py-3 rounded-xl font-label-md hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Kembali
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
