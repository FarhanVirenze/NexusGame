
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchTableServer } from '@/lib/supabaseServer';

export const revalidate = 0;

export default async function PromotionsComponent() {
  const promotions = await fetchTableServer('promotions');
  return (
    <>

<Navbar />
<main className="flex-grow w-full mt-20">

{/* Hero Banner */}
<section className="relative w-full overflow-hidden bg-gradient-to-br from-primary/5 via-surface to-secondary-container/10 py-16 md:py-24">
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl"></div>
  </div>
  <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1 space-y-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full w-fit border border-primary/20">
          <span className="material-symbols-outlined text-sm">local_fire_department</span>
          <span className="font-label-md text-label-md">Promo Spesial</span>
        </div>
        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface leading-tight">
          Hemat Lebih Banyak,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-container">Main Lebih Seru</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
          Temukan diskon eksklusif, flash sale, dan bonus top-up spesial. Tingkatkan pengalaman gaming tanpa menguras dompet.
        </p>
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
            <span className="font-body-md text-body-md">Terpercaya</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
            <span className="font-body-md text-body-md">Instan</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-[20px]">shield</span>
            <span className="font-body-md text-body-md">Aman</span>
          </div>
        </div>
      </div>
      <div className="flex-1 hidden md:flex justify-center">
        <div className="relative">
          <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary-container/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl shadow-primary/10 rotate-3 hover:rotate-0 transition-transform duration-500">
            <span className="material-symbols-outlined text-[100px] text-primary/40">local_offer</span>
          </div>
          <div className="absolute -top-4 -right-4 bg-secondary-container text-white px-4 py-2 rounded-xl font-label-md text-label-md shadow-lg animate-bounce">
            🔥 Hot Deals
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Promotions Grid */}
<section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
    <div>
      <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">Promo Aktif</h2>
      <p className="font-body-md text-body-md text-on-surface-variant">Jangan lewatkan penawaran terbaik saat ini.</p>
    </div>
    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
      <button className="whitespace-nowrap px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-md shadow-primary/20 hover:shadow-lg transition-shadow">Semua</button>
      <button className="whitespace-nowrap px-5 py-2.5 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md border border-outline-variant/30 hover:bg-surface-container-high hover:border-primary/30 transition-all">Top Up</button>
      <button className="whitespace-nowrap px-5 py-2.5 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md border border-outline-variant/30 hover:bg-surface-container-high hover:border-primary/30 transition-all">Voucher</button>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
    {promotions.length === 0 ? (
      <div className="col-span-full py-20 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-surface-container-high flex items-center justify-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/50">campaign</span>
        </div>
        <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Belum Ada Promo</h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">Saat ini belum ada promo aktif. Pantau terus halaman ini untuk penawaran terbaru!</p>
      </div>
    ) : (
      promotions.map((promo, idx) => (
        <div key={promo.id} className="group relative bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/20 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
          {/* Status Badge */}
          {promo.valid_until && new Date(promo.valid_until) > new Date() && (
            <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full font-label-md text-[11px] shadow-lg flex items-center gap-1 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Aktif
            </div>
          )}
          {promo.valid_until && new Date(promo.valid_until) < new Date() && (
            <div className="absolute top-4 right-4 z-20 bg-error-container/90 text-on-error-container px-3 py-1 rounded-full font-label-md text-[11px] shadow-lg uppercase tracking-wider">
              Expired
            </div>
          )}
          
          {/* Image */}
          <div className="h-52 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
            {promo.image_url ? (
              <img 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={promo.title}
                src={promo.image_url}
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${
                idx % 3 === 0 ? 'bg-gradient-to-br from-primary/20 to-primary-container/30' :
                idx % 3 === 1 ? 'bg-gradient-to-br from-secondary/20 to-secondary-container/30' :
                'bg-gradient-to-br from-tertiary/20 to-tertiary-container/30'
              }`}>
                <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30">local_offer</span>
              </div>
            )}
            <div className="absolute bottom-3 left-4 z-10 flex items-center gap-2">
              <span className="material-symbols-outlined text-white/80 text-[16px]">schedule</span>
              <span className="font-caption text-caption text-white/80">
                {promo.valid_until ? `Hingga ${new Date(promo.valid_until).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'Tanpa Batas Waktu'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col gap-3 flex-grow">
            <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors line-clamp-2">{promo.title}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant flex-grow line-clamp-3">
              {promo.description}
            </p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/20">
              <div className="flex items-center gap-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span className="font-caption text-caption">Syarat & ketentuan berlaku</span>
              </div>
              <button className="bg-primary text-on-primary px-5 py-2 rounded-xl font-label-md text-label-md hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all">
                Klaim
              </button>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
</section>

{/* Newsletter CTA */}
<section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-16">
  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-primary-container p-8 md:p-12">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
    </div>
    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex flex-col gap-3 max-w-lg">
        <h3 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-primary">Jangan Lewatkan Promo!</h3>
        <p className="font-body-md text-body-md text-on-primary/80">
          Subscribe untuk mendapat notifikasi promo terbaru, flash sale eksklusif, dan kode diskon spesial.
        </p>
      </div>
      <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
        <input className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-5 py-3 font-body-md text-body-md text-on-primary placeholder:text-on-primary/60 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 w-full sm:w-72" placeholder="Masukkan email kamu" type="email" />
        <button className="bg-white text-primary px-6 py-3 rounded-xl font-label-md text-label-md whitespace-nowrap hover:bg-white/90 active:scale-95 transition-all shadow-lg">
          Subscribe
        </button>
      </div>
    </div>
  </div>
</section>
</main>

<Footer />

    </>
  );
}
