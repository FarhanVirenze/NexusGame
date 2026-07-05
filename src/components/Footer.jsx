import React from 'react';
import BrandLogo from '@/components/BrandLogo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-lowest w-full border-t border-outline-variant/30 mt-auto pt-16 pb-8">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <BrandLogo size="lg" />
              <span className="font-display-lg text-[22px] font-bold text-on-surface tracking-tight">NexusPay</span>
            </div>
            <p className="font-body-md text-[14px] text-on-surface-variant max-w-sm leading-relaxed">
              Platform top-up game dan voucher digital terpercaya. Proses instan, aman, dan tanpa biaya tersembunyi. Tingkatkan pengalaman gaming kamu hari ini.
            </p>
            <div className="flex gap-3 mt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">language</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">alternate_email</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">headset_mic</span>
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="col-span-1 md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <h4 className="font-headline-md text-[15px] font-semibold text-on-surface">Layanan</h4>
              <div className="flex flex-col gap-3">
                <a href="/" className="font-body-md text-[14px] text-on-surface-variant hover:text-primary transition-colors">Top Up Game</a>
                <a href="/promotions" className="font-body-md text-[14px] text-on-surface-variant hover:text-primary transition-colors">Promo & Diskon</a>
                <a href="/history" className="font-body-md text-[14px] text-on-surface-variant hover:text-primary transition-colors">Lacak Pesanan</a>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4">
              <h4 className="font-headline-md text-[15px] font-semibold text-on-surface">Perusahaan</h4>
              <div className="flex flex-col gap-3">
                <a href="/news" className="font-body-md text-[14px] text-on-surface-variant hover:text-primary transition-colors">Berita & Update</a>
                <a href="#" className="font-body-md text-[14px] text-on-surface-variant hover:text-primary transition-colors">Tentang Kami</a>
                <a href="#" className="font-body-md text-[14px] text-on-surface-variant hover:text-primary transition-colors">Syarat & Ketentuan</a>
                <a href="#" className="font-body-md text-[14px] text-on-surface-variant hover:text-primary transition-colors">Kebijakan Privasi</a>
              </div>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-4">
              <h4 className="font-headline-md text-[15px] font-semibold text-on-surface">Bantuan</h4>
              <div className="flex flex-col gap-3">
                <a href="#" className="font-body-md text-[14px] text-on-surface-variant hover:text-primary transition-colors">Pusat Bantuan</a>
                <a href="#" className="font-body-md text-[14px] text-on-surface-variant hover:text-primary transition-colors">Hubungi Kami</a>
                <a href="#" className="font-body-md text-[14px] text-on-surface-variant hover:text-primary transition-colors">FAQ</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-caption text-[13px] text-on-surface-variant">
            © {currentYear} NexusPay Gaming. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-surface-container rounded-md flex items-center gap-1 opacity-70">
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">lock</span>
              <span className="font-label-md text-[11px] text-on-surface-variant font-medium">100% SECURE</span>
            </div>
            <div className="px-3 py-1.5 bg-surface-container rounded-md flex items-center gap-1 opacity-70">
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">speed</span>
              <span className="font-label-md text-[11px] text-on-surface-variant font-medium">FAST DELIVERY</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
