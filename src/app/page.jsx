
import React from 'react';
import { fetchGames } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';

export default async function PageComponent() {
  const games = await fetchGames();
  return (
    <>
      
<Navbar />
<main className="flex-grow pt-20">

<section className="relative h-[600px] md:h-[700px] w-full overflow-hidden bg-black" id="hero-carousel">

<div className="relative w-full h-full">

<div className="slide absolute inset-0 w-full h-full z-10">
<img alt="Esports Tournament" className="absolute inset-0 w-full h-full object-cover opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8yh8CaCp9Q7yULDEtlazLC5PgORJzdj4l3D8RMKVti5zBcTIi4cxgxhNPnGdB6QzbMQzwWkoquIm8NWQJsVVZ8g7-s0YZ8tPj-J3V4-uvOaVyy4IJAmVF0jxBUHCMrBbZTsh_nHkGrJ--RogSV-Lt5jmMqTbiU9PuYm5Ctzf-tCZJXZq_bCauW2s4ZGhJmGn7A-xMvFnBBc_uz7Tmmp_07huxwSNX2sbHB4VUn3XmjCyJkRQmpzImkNBlg_tQUscS-UriLgAoyzrG" />
<div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
<div className="absolute inset-0 flex items-center">
<div className="max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop relative z-20">
<div className="max-w-2xl slide-content">
<span className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/20 text-primary font-label-md text-caption border border-primary/30 backdrop-blur-md">New Season</span>
<h2 className="font-display-lg text-display-lg text-on-background mb-4">Conquer the <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-container">Battlefield</span></h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mb-8">Top up your game credits instantly and get back to the action. Special discounts on premium passes.</p>
<button className="font-label-md text-label-md bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-full shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-2 w-fit">
                            Top Up Now
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
</div>
</div>
</div>

<div className="slide absolute inset-0 w-full h-full z-0 opacity-0">
<img alt="Racing Game" className="absolute inset-0 w-full h-full object-cover opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJNth84DxdI6lw-e8CSgjPbm9DCjliXq9DlLy0LFvBN6N_jceNY1xDqLOe_C7NeJKTOGUJVqawDsld5iqC3EEywJ4F7ZAQTiO7lEpIrtHjQ2nmZ_nQ9y19b0gokpswYaWPy0rHIlfAPfP6RqGq-D7CMXdJeWTivFQbpIgSVUKSEoQL6tFXuIgr_aT-iya0S4ydCtz9Sun8xCwo0lNAZmhy4qpMjEiBf4tSX0nWOL9ENY9fdQfQV8TLrJvk992UJkEbpAz1fSDZuxab" />
<div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
<div className="absolute inset-0 flex items-center">
<div className="max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop relative z-20">
<div className="max-w-2xl slide-content">
<span className="inline-block px-3 py-1 mb-4 rounded-full bg-secondary-container/20 text-secondary font-label-md text-caption border border-secondary/30 backdrop-blur-md">Weekend Promo</span>
<h2 className="font-display-lg text-display-lg text-on-background mb-4">Need for <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary-container">Speed</span></h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mb-8">Unlock exclusive vehicles and customize your ride. Instant delivery on all cosmetic packs.</p>
<button className="font-label-md text-label-md bg-gradient-to-r from-secondary to-secondary-container text-white px-8 py-4 rounded-full shadow-xl shadow-secondary/30 hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-2 w-fit">
                            Claim Offer
                            <span className="material-symbols-outlined text-sm">local_offer</span>
</button>
</div>
</div>
</div>
</div>

<div className="slide absolute inset-0 w-full h-full z-0 opacity-0">
<img alt="Fantasy Game" className="absolute inset-0 w-full h-full object-cover opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCx2ScEW7CDFo47u6owgovQy4IkO9Xcs0p9pypLl_PCow9eiFN2T0XF63CCUiQjgB735FMgQZqbug2DpJkvOv4BoBLN9vypD53Ij6URpjQWlOUYAlFA6JuPMZE11NQES0n4rZB73BG5uv-Nd7WPjj9wi4w6ma0hnplMN3sLF47fNTNE-d1S5t-oqt3OeMUctaxyEPqvKXN1k0qVJ8m6VYamuV4HpizfknEcy0Xi0i8qykv6-f0Ken3m9hNL-4xf_e9QftbqLfOkOPQU" />
<div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
<div className="absolute inset-0 flex items-center">
<div className="max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop relative z-20">
<div className="max-w-2xl slide-content">
<span className="inline-block px-3 py-1 mb-4 rounded-full bg-tertiary/20 text-tertiary font-label-md text-caption border border-tertiary/30 backdrop-blur-md">Exclusive</span>
<h2 className="font-display-lg text-display-lg text-on-background mb-4">Epic <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-tertiary to-primary">Adventures</span></h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mb-8">Summon your favorite heroes with our discounted crystal bundles. Secure and trusted by millions.</p>
<button className="font-label-md text-label-md bg-gradient-to-r from-tertiary to-tertiary-container text-white px-8 py-4 rounded-full shadow-xl shadow-tertiary/30 hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-2 w-fit">
                            Explore Bundles
                            <span className="material-symbols-outlined text-sm">explore</span>
</button>
</div>
</div>
</div>
</div>
</div>

<div className="absolute bottom-8 left-0 right-0 z-30">
<div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex items-center justify-between">
<div className="flex items-center gap-3 carousel-dots">
<button className="w-8 h-2 rounded-full bg-primary transition-all duration-300 dot active"></button>
<button className="w-2 h-2 rounded-full bg-outline-variant/50 hover:bg-outline transition-all duration-300 dot"></button>
<button className="w-2 h-2 rounded-full bg-outline-variant/50 hover:bg-outline transition-all duration-300 dot"></button>
</div>
<div className="flex items-center gap-4">
<button className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-on-surface hover:text-primary hover:bg-white transition-colors duration-300 shadow-sm" id="prev-slide">
<span className="material-symbols-outlined">arrow_back</span>
</button>
<button className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-on-surface hover:text-primary hover:bg-white transition-colors duration-300 shadow-sm" id="next-slide">
<span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</div>
</div>
</section>

<section className="py-24 bg-surface-container-lowest relative z-20">
<div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
<div className="flex justify-between items-end mb-12">
<div>
<h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Trending Games</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Top up your favorite titles in seconds.</p>
</div>
<a className="hidden sm:flex items-center gap-1 font-label-md text-label-md text-primary hover:underline" href="#">
                        View All <span className="material-symbols-outlined text-sm">chevron_right</span>
</a>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">

{games.map(game => (
<a key={game.id} href={`/game/${game.id}`} className="game-card glass-panel rounded-xl overflow-hidden cursor-pointer group block">
<div className="relative h-48 overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={game.title} src={game.image_url} />
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
<div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
<h3 className="font-headline-md text-headline-md text-white">{game.title}</h3>
</div>
{game.category && (
<div className="absolute top-3 right-3 bg-secondary-container text-white font-label-md text-caption px-2 py-1 rounded">{game.category}</div>
)}
</div>
<div className="p-4 bg-white/50 backdrop-blur-md">
<p className="font-body-md text-caption text-on-surface-variant">{game.description}</p>
<div className="mt-3 flex items-center justify-between">
<span className="font-label-md text-label-md text-primary">From ${game.price}</span>
<span className="material-symbols-outlined text-primary bg-primary/10 rounded-full p-1">add</span>
</div>
</div>
</a>
))}
</div>
</div>
</section>
</main>

<footer className="bg-surface-container-highest w-full py-12 border-t border-outline-variant/20 mt-auto">
<div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-6">

<div className="font-headline-md text-headline-md text-on-surface">
                NexusPay
            </div>

<div className="flex flex-wrap justify-center gap-6">
<a className="font-label-md text-label-md text-on-surface-variant hover:text-secondary hover:underline transition-opacity duration-300" href="#">Terms of Service</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-secondary hover:underline transition-opacity duration-300" href="#">Privacy Policy</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-secondary hover:underline transition-opacity duration-300" href="#">Partner Program</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-secondary hover:underline transition-opacity duration-300" href="#">Refund Policy</a>
</div>

<div className="font-body-md text-body-md text-on-surface-variant text-center md:text-right">
                © 2024 NexusPay Gaming. All rights reserved.
            </div>
</div>
</footer>



    </>
  );
}
