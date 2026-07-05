"use client";

import React, { useMemo, useState } from 'react';
import { getCategoryStyle, getUniqueCategories } from '@/lib/categoryStyles';

export default function TrendingGames({ games = [] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const categories = useMemo(() => getUniqueCategories(games), [games]);

  const filteredGames = useMemo(() => {
    if (activeCategory === 'all') return games;
    return games.filter(g => g.category === activeCategory);
  }, [games, activeCategory]);

  return (
    <section id="trending-games" className="py-16 md:py-20 bg-surface-container-lowest relative z-20 scroll-mt-24">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full w-fit border border-primary/20 mb-3">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="font-label-md text-label-md">Populer</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">Trending Games</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Top up game favorit kamu dalam hitungan detik.</p>
          </div>
          <a className="hidden sm:flex items-center gap-1 font-label-md text-label-md text-primary hover:gap-2 transition-all bg-primary/5 px-4 py-2 rounded-full border border-primary/20 hover:bg-primary/10" href="#">
            Lihat Semua <span className="material-symbols-outlined text-sm">chevron_right</span>
          </a>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full font-label-md text-[13px] transition-all duration-200 border ${
                activeCategory === 'all'
                  ? 'bg-primary text-on-primary border-primary shadow-md shadow-primary/20'
                  : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:border-primary/30 hover:text-primary'
              }`}
            >
              Semua
            </button>
            {categories.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full font-label-md text-[13px] transition-all duration-200 border capitalize ${
                  activeCategory === category
                    ? 'bg-primary text-on-primary border-primary shadow-md shadow-primary/20'
                    : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:border-primary/30 hover:text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {filteredGames.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-3 block opacity-40">sports_esports</span>
            <p className="font-body-md">Tidak ada game untuk kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGames.map(game => (
              <a
                key={game.id}
                href={`/game/${game.id}`}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden cursor-pointer group block border border-outline-variant/20 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={game.title}
                    src={game.image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-headline-md text-[16px] font-bold text-white drop-shadow-md">{game.title}</h3>
                  </div>
                  {game.category && (
                    <div className={`absolute top-3 right-3 font-label-md text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-lg ${getCategoryStyle(game.category)}`}>
                      {game.category}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-body-md text-[13px] text-on-surface-variant line-clamp-2 mb-3">{game.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-[13px] font-bold text-primary">Top Up Sekarang</span>
                    <span className="material-symbols-outlined text-primary bg-primary/10 rounded-full p-1.5 text-[18px] group-hover:bg-primary group-hover:text-on-primary transition-colors">arrow_forward</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
