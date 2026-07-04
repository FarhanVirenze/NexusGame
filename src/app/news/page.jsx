
import React from 'react';
import Navbar from '@/components/Navbar';

export default function NewsComponent() {
  return (
    <>
      

<Navbar />
<main className="flex-grow w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-12 md:py-20 flex flex-col gap-16 mt-20">

<section className="text-center md:text-left space-y-4">
<h1 className="font-display-lg text-display-lg text-on-surface">News &amp; Updates</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Stay up to date with the latest game releases, major tournaments, and platform enhancements.</p>
</section>

<section className="grid grid-cols-1 md:grid-cols-12 gap-gutter">

<article className="md:col-span-8 relative rounded-2xl overflow-hidden glass-panel ambient-shadow-lg group cursor-pointer flex flex-col min-h-[400px] md:min-h-[500px]">
<div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A highly detailed, wide-angle promotional artwork for a sci-fi competitive shooter game. Characters in sleek, high-tech armor stand in a futuristic, brilliantly lit neon arena. The scene is bright and charged, using a vibrant color palette dominated by electric blues, energetic oranges, and pristine whites. The overall lighting is cinematic, conveying a sense of high-octane esports action in a modern light-mode setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2gm31auzcyqaWbPx-TIf5TTbYMZMEnW9LnOfiae9rki-K7rOWf_xgJvF-THuwBQsTQKtKYupPUkAlPhXRZRSQ9VSQ-qzXAHYj9ej3zwUPlFmNu9Ql_hqwZcnA7Ce3Kv_vjDBjY2fxUwUP34XP4dW84kb7FW4DqBoKfQubTSTBAfUMxmLzCHDCwwo8-sqFrVXyX3rGXMfHaFvQwlxYpODhNIrGqjftoa5jXJjmNYaHjljJRczzM72mT_Gl9WOsbdoBDo4QzbmlQHYN" />
<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
</div>
<div className="relative z-10 p-8 flex flex-col justify-end h-full text-white">
<div className="flex items-center gap-3 mb-4">
<span className="bg-secondary-container text-white px-3 py-1 rounded-full font-label-md text-label-md uppercase tracking-wider">Major Update</span>
<span className="font-caption text-caption text-white/80">Oct 24, 2024</span>
</div>
<h2 className="font-display-lg text-headline-lg-mobile md:text-display-lg font-bold mb-3 drop-shadow-md">Global Championship 2024 Qualifiers Announced</h2>
<p className="font-body-lg text-body-lg text-white/90 max-w-xl drop-shadow mb-6">Prepare your teams. The biggest prize pool in NexusPay history is up for grabs in the upcoming regional qualifiers starting next month.</p>
<div>
<button className="glass-panel text-white font-label-md text-label-md px-6 py-3 rounded-full hover:bg-white/20 transition-colors flex items-center gap-2 w-fit">
                            Read Full Story <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
</div>
</article>

<div className="md:col-span-4 flex flex-col gap-gutter">

<article className="flex-1 rounded-2xl glass-panel ambient-shadow relative overflow-hidden group cursor-pointer">
<div className="absolute inset-0 z-0">
<img className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105" data-alt="A macro shot of a sleek, modern smartphone displaying a beautifully designed gaming top-up interface. The screen glows brightly, showing dynamic 3D gold coins and a futuristic energy bar. The phone rests on a pristine white frosted glass table, illuminated by soft, natural studio lighting mixed with subtle electric blue ambient light. The aesthetic is tactile digital, lightweight, and professional." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIK6aKYve8bD_ZpBxIrF4xJ4zz10ckOoT04KVex2DnBPsEJLr-s0SNsuc0v05x4Y49Dp-0sOl_jb_FGJQDJWv1w05yFdskCvoVG7xxCOn7I_Uk8_Nzdz7_KiLj1KcDGvHFNkcL4lSkY8r6v-DD2dbiJlm99Kth9OArFN1eDCV-sMPieCPK4gE5VWYxzzgDgfu8XakxRt4O6zPoit-qIYiG5eszrAbLMSxOqirXaBQIHgQpn9o446xpQPfQ3YdZ_zTmrRhiLJBVQpQ9" />
<div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>
</div>
<div className="relative z-10 p-6 flex flex-col h-full justify-between">
<div>
<span className="text-primary font-label-md text-label-md uppercase tracking-wider mb-2 block">Platform News</span>
<h3 className="font-headline-md text-headline-md text-on-surface mb-2">New Seamless Checkout Experience</h3>
</div>
<div className="flex justify-between items-end mt-4">
<span className="font-caption text-caption text-on-surface-variant">Oct 22, 2024</span>
<span className="material-symbols-outlined text-primary bg-primary/10 rounded-full p-2">arrow_outward</span>
</div>
</div>
</article>

<article className="flex-1 rounded-2xl glass-panel ambient-shadow relative overflow-hidden group cursor-pointer">
<div className="absolute inset-0 z-0">
<img className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105" data-alt="A beautifully lit, high-end esports gaming setup featuring a glowing mechanical keyboard and a premium precision mouse on a bright, minimalist desk. The scene is rendered in high-key lighting, creating a bright and airy atmosphere. The primary lighting accents are crisp whites and subtle vivid purples, emphasizing a clean, professional, and tactile digital aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs61wFOhbRp9DldU1bMPN0PHOs0di-tEhT89LDs3Q8o3Re8g5BQ1odnvEJk-hmYC72SkNJHsdK-TgbYZHUm5fRBCXOAxNNVMDzgwrf_dOlPBb1jOh_v48KZbtEJ3mngPySU6F9PP6zUeFhzz1zHBDcK7aExiCdMiryctKVEnkTJ2XSVhh1L0g13_Xw6qzLCYTfmiKKDr_E9J-EbPHu-glEdPvZ6Of07NE9BSBxxSCBmM5W5bEbj3MhoxZ9iFryLq6Oi1k8JqM9YnF1" />
<div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>
</div>
<div className="relative z-10 p-6 flex flex-col h-full justify-between">
<div>
<span className="text-tertiary font-label-md text-label-md uppercase tracking-wider mb-2 block">Esports</span>
<h3 className="font-headline-md text-headline-md text-on-surface mb-2">Top 5 Plays of the Week</h3>
</div>
<div className="flex justify-between items-end mt-4">
<span className="font-caption text-caption text-on-surface-variant">Oct 20, 2024</span>
<span className="material-symbols-outlined text-tertiary bg-tertiary/10 rounded-full p-2">play_arrow</span>
</div>
</div>
</article>
</div>
</section>

<section className="mt-8">
<div className="flex justify-between items-end mb-8 border-b border-outline-variant/30 pb-4">
<h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Latest Articles</h2>

<div className="hidden md:flex gap-2">
<button className="bg-primary text-white font-label-md text-label-md px-4 py-2 rounded-full">All</button>
<button className="bg-surface-variant text-on-surface-variant font-label-md text-label-md px-4 py-2 rounded-full hover:bg-surface-dim transition-colors">Game Updates</button>
<button className="bg-surface-variant text-on-surface-variant font-label-md text-label-md px-4 py-2 rounded-full hover:bg-surface-dim transition-colors">Tips &amp; Tricks</button>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">

<article className="glass-panel rounded-xl overflow-hidden flex flex-col ambient-shadow group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
<div className="h-48 overflow-hidden relative">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="A vibrant, stylized promotional image for a fantasy RPG game patch. The scene features glowing magical artifacts on a stone pedestal in a bright, ethereal forest clearing. Sunbeams cut through the canopy, creating a lightweight, premium feel with dominant colors of soft greens, radiant gold, and electric blue accents, matching the bright glassmorphism style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0qE0mZwLXQLpDrIeRni2dMsASk5kr9YXSk_8qQ5Y3bD6pLBCCY-P_fPsg3vgg1vH7bcpnq4fzSBbyTyDiS9PFaJITLbMnBCyKs7RoTEclNW_9ocZQ3iJ9K2vaKaV_KjbxbAOQOEx8wzysVYheS0Brx3kgdR-KieRH2eqtOgAodZUSEImQJJT3srItz6dhpI4d93hFuM3PjhfcEvCv-bAqsWq3VDFJ7PnPU0LBhje0vZ64y2rJnwm3kXnU7Rml2pNjUYlSX0XJT_Se" />
<div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full">
<span className="font-label-md text-label-md text-primary">Game Updates</span>
</div>
</div>
<div className="p-6 flex-grow flex flex-col">
<span className="font-caption text-caption text-on-surface-variant mb-2">Oct 18, 2024</span>
<h3 className="font-headline-md text-headline-md text-on-surface mb-3 line-clamp-2">Patch 4.2 Notes: New Heroes and Balance Changes</h3>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-4 flex-grow">Dive into the comprehensive breakdown of the latest balance patch, featuring two completely redesigned heroes and significant adjustments to the meta.</p>
<div className="flex items-center text-primary font-label-md text-label-md gap-1 group-hover:gap-2 transition-all">
                            Read Article <span className="material-symbols-outlined text-[16px]">chevron_right</span>
</div>
</div>
</article>

<article className="glass-panel rounded-xl overflow-hidden flex flex-col ambient-shadow group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
<div className="h-48 overflow-hidden relative bg-surface-container-high flex items-center justify-center">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="An isometric, highly detailed 3D render of a futuristic gaming controller floating above a frosted glass surface. The lighting is pristine and bright, utilizing a high-key studio setup with soft ambient shadows. The controller has glowing electric blue elements and energetic orange buttons, perfectly aligning with a premium, tactile digital tech aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9-ajL2AKmgoA0Rw9Px0ei3ahJ-XhyBgKPidDGXqMiFIj1vPv-CFcLQurHI_frO2gNP01o192UXEh54gl-TgDmjJFug82ZgY4yUlw1dKkXTLd-xqqJeWsDyR11wkwWGs0nCY8UBjUkfw6SmX_z71MsyrjU2Y1s6CSCaRuN27j5Ljlb_QNkgsXhgiM75-mbHcMRYh8q9X-0iD98VE2cUJiO6wfREOo7J_8mL-X2x6X4ozy5twd56z6VPwkJNCnsjwkZmlNMibNvRU_Q" />
<div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full">
<span className="font-label-md text-label-md text-tertiary">Tips &amp; Tricks</span>
</div>
</div>
<div className="p-6 flex-grow flex flex-col">
<span className="font-caption text-caption text-on-surface-variant mb-2">Oct 15, 2024</span>
<h3 className="font-headline-md text-headline-md text-on-surface mb-3 line-clamp-2">Mastering the New Currency System</h3>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-4 flex-grow">A complete guide to maximizing your value with the newly introduced cross-region currency exchange system on NexusPay.</p>
<div className="flex items-center text-primary font-label-md text-label-md gap-1 group-hover:gap-2 transition-all">
                            Read Article <span className="material-symbols-outlined text-[16px]">chevron_right</span>
</div>
</div>
</article>

<article className="glass-panel rounded-xl overflow-hidden flex flex-col ambient-shadow group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
<div className="h-48 overflow-hidden relative">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="A wide shot of a massive, brightly lit esports arena stage during a tournament setup phase. The stage is clean and modern, featuring large glowing LED screens displaying abstract blue and white graphics. The lighting is crisp and cool, creating an airy, professional atmosphere typical of a premium high-performance gaming platform event." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6JkeiYViRdWvGuRMteyDN9IPQDYWdJrEVTdVM8S2fUMvZV7wRh1ZIBKa6UX-mGoppNbzKWxvQWNd8uI18jrVHqfgKhWGvvHZJ-p3HMhLglUN7BYQqWPtncnCPqjfUmOQVQmVeqjn3Ln6Ijgp0q90DCAJGKpTlF-mKdtxYoHxCbvuHuYHzIa7sNKtH3P2el6cGU1k3u5gOcfcIN-Gitk5naNEYCphidFNROEu3AqLPERi27e2ROZTLE3NZMz3QLJrwjAzX1rWvqWcH" />
<div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full">
<span className="font-label-md text-label-md text-secondary">Esports News</span>
</div>
</div>
<div className="p-6 flex-grow flex flex-col">
<span className="font-caption text-caption text-on-surface-variant mb-2">Oct 12, 2024</span>
<h3 className="font-headline-md text-headline-md text-on-surface mb-3 line-clamp-2">Team Vertex Secures Regional Victory</h3>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-4 flex-grow">In a stunning 3-0 sweep, Team Vertex dominates the finals, securing their spot in the international bracket next month.</p>
<div className="flex items-center text-primary font-label-md text-label-md gap-1 group-hover:gap-2 transition-all">
                            Read Article <span className="material-symbols-outlined text-[16px]">chevron_right</span>
</div>
</div>
</article>
</div>
<div className="mt-12 flex justify-center">
<button className="bg-white border border-outline-variant text-primary font-label-md text-label-md px-8 py-3 rounded-full hover:bg-surface-variant hover:border-primary transition-all shadow-sm">Load More Articles</button>
</div>
</section>
</main>

<footer className="bg-surface-container-low dark:bg-inverse-surface w-full border-t border-outline-variant mt-auto">
<div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-12 max-w-container-max mx-auto gap-gutter">
<div className="flex flex-col items-center md:items-start gap-2">
<span className="font-headline-md text-headline-md font-bold text-on-surface dark:text-inverse-on-surface">NexusPay</span>
<p className="font-caption text-caption text-on-surface-variant text-center md:text-left">© 2024 NexusPay. All rights reserved. High-performance gaming transactions.</p>
</div>
<nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded-sm" href="#">Terms of Service</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded-sm" href="#">Privacy Policy</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded-sm" href="#">Refund Policy</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded-sm" href="#">Contact Support</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded-sm" href="#">About Us</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded-sm" href="#">Partners</a>
</nav>
</div>
</footer>


    </>
  );
}
