import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col justify-center items-center min-h-[80vh] mt-20">
        <div className="relative flex justify-center items-center">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full w-20 h-20 animate-pulse"></div>
          <div className="w-16 h-16 border-4 border-surface-variant border-t-primary rounded-full animate-spin relative z-10"></div>
          <span className="material-symbols-outlined absolute text-primary z-20 text-2xl animate-pulse">sports_esports</span>
        </div>
        <h2 className="mt-6 font-display-sm text-display-sm text-on-surface tracking-wide">NexusPay</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2 animate-pulse">Memuat halaman...</p>
      </main>
      <Footer />
    </>
  );
}
