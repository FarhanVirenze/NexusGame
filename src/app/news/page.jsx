
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchTableServer } from '@/lib/supabaseServer';

export const revalidate = 0;

export default async function NewsComponent() {
  const allContent = await fetchTableServer('content');
  const news = allContent.filter(item => item.type === 'news');
  const mainArticle = news.length > 0 ? news[0] : null;
  const subArticles = news.length > 1 ? news.slice(1, 3) : [];
  const restArticles = news.length > 3 ? news.slice(3) : [];
  return (
    <>

<Navbar />
<main className="flex-grow w-full mt-20">

{/* Hero Section */}
<section className="relative w-full overflow-hidden bg-gradient-to-br from-surface via-surface to-tertiary-container/5 py-16 md:py-20">
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
  </div>
  <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
    <div className="flex flex-col md:flex-row items-start justify-between gap-6">
      <div>
        <div className="inline-flex items-center gap-2 bg-tertiary/10 text-tertiary px-4 py-1.5 rounded-full w-fit border border-tertiary/20 mb-4">
          <span className="material-symbols-outlined text-sm">newspaper</span>
          <span className="font-label-md text-label-md">Berita Terbaru</span>
        </div>
        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-3">News & Updates</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Ikuti perkembangan terbaru dari game favorit, turnamen besar, dan update platform kami.
        </p>
      </div>
      <div className="hidden md:flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 min-w-[280px]">
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
        <input className="bg-transparent font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none w-full" placeholder="Cari artikel..." type="text" />
      </div>
    </div>
  </div>
</section>

{/* Featured Section */}
{(mainArticle || subArticles.length > 0) && (
<section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
    
    {/* Main Feature */}
    <article className="md:col-span-8 relative rounded-2xl overflow-hidden group cursor-pointer min-h-[360px] md:min-h-[440px] shadow-lg hover:shadow-2xl transition-shadow duration-300">
      {mainArticle ? (
        <>
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={mainArticle.title} src={mainArticle.image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          </div>
          <div className="relative z-10 p-6 md:p-8 flex flex-col justify-end h-full text-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary-container text-white px-4 py-1 rounded-full font-label-md text-[11px] uppercase tracking-wider shadow-md">Headline</span>
              <span className="font-caption text-caption text-white/70 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                {new Date(mainArticle.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <h2 className="font-display-lg text-headline-lg-mobile md:text-headline-lg font-bold mb-3 drop-shadow-md leading-tight">{mainArticle.title}</h2>
            <p className="font-body-lg text-body-lg text-white/80 max-w-xl line-clamp-2 mb-6">{mainArticle.body}</p>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-label-md text-label-md px-6 py-3 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 w-fit group-hover:gap-3">
              Baca Selengkapnya <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-surface-container-high text-on-surface-variant font-body-lg rounded-2xl">
          <div className="text-center">
            <span className="material-symbols-outlined text-[48px] mb-2 block opacity-50">article</span>
            <p>Belum ada artikel utama</p>
          </div>
        </div>
      )}
    </article>

    {/* Side Articles */}
    <div className="md:col-span-4 flex flex-col gap-6">
      {subArticles.length > 0 ? subArticles.map((article, idx) => (
        <article key={article.id} className="flex-1 rounded-2xl overflow-hidden relative group cursor-pointer border border-outline-variant/20 hover:border-primary/30 hover:shadow-lg transition-all duration-300 bg-surface-container-lowest">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover opacity-20 transition-transform duration-500 group-hover:scale-105" alt={article.title} src={article.image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"} />
          </div>
          <div className="relative z-10 p-5 flex flex-col h-full justify-between min-h-[180px]">
            <div>
              <span className={`inline-block ${idx === 0 ? 'text-primary bg-primary/10' : 'text-tertiary bg-tertiary/10'} font-label-md text-[11px] uppercase tracking-wider px-3 py-1 rounded-full mb-3`}>News</span>
              <h3 className="font-headline-md text-headline-md text-on-surface line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h3>
            </div>
            <div className="flex justify-between items-end mt-4">
              <span className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </span>
              <span className={`material-symbols-outlined ${idx === 0 ? 'text-primary bg-primary/10' : 'text-tertiary bg-tertiary/10'} rounded-full p-2 text-[18px] group-hover:scale-110 transition-transform`}>arrow_outward</span>
            </div>
          </div>
        </article>
      )) : (
        <div className="flex-1 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest flex items-center justify-center min-h-[180px]">
          <p className="text-on-surface-variant font-body-md">Belum ada artikel lainnya</p>
        </div>
      )}
    </div>
  </div>
</section>
)}

{/* Articles Grid */}
<section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
  <div className="flex justify-between items-end mb-8">
    <div>
      <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">Semua Artikel</h2>
      <p className="font-body-md text-body-md text-on-surface-variant">Jelajahi berbagai topik menarik seputar dunia gaming</p>
    </div>
    <div className="hidden md:flex gap-2">
      <button className="bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-full shadow-md shadow-primary/20">Semua</button>
      <button className="bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md px-5 py-2.5 rounded-full border border-outline-variant/30 hover:border-primary/30 transition-colors">Update</button>
      <button className="bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md px-5 py-2.5 rounded-full border border-outline-variant/30 hover:border-primary/30 transition-colors">Tips</button>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
    {restArticles.length === 0 ? (
      <div className="col-span-full py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-surface-container-high flex items-center justify-center">
          <span className="material-symbols-outlined text-[40px] text-on-surface-variant/50">description</span>
        </div>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Belum ada artikel tambahan saat ini.</p>
      </div>
    ) : (
      restArticles.map(article => (
        <article key={article.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden flex flex-col border border-outline-variant/20 group cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
          <div className="h-48 overflow-hidden relative">
            <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={article.title} src={article.image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"} />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
              <span className="font-label-md text-[11px] text-primary uppercase tracking-wider">News</span>
            </div>
          </div>
          <div className="p-5 flex-grow flex flex-col">
            <span className="font-caption text-caption text-on-surface-variant mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2 line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-4 flex-grow">{article.body}</p>
            <div className="flex items-center text-primary font-label-md text-label-md gap-1 group-hover:gap-2 transition-all">
              Baca Artikel <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </div>
          </div>
        </article>
      ))
    )}
  </div>
</section>
</main>

<Footer />

    </>
  );
}
