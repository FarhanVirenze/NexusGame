
import React from 'react';
import { fetchGamesServer } from '@/lib/supabaseServer';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import TrendingGames from '@/components/TrendingGames';

export const revalidate = 0;

export default async function PageComponent() {
  const games = await fetchGamesServer();
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-20">
        <HeroCarousel />
        <TrendingGames games={games} />
      </main>
      <Footer />
    </>
  );
}
