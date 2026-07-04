
import React from 'react';

export default function ContentComponent() {
  return (
    <>
      

<header className="bg-white/70 backdrop-blur-xl docked full-width top-0 border-b border-white/40 shadow-sm z-50 sticky">
<div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto h-20">

<a className="font-display-lg text-display-lg font-extrabold text-primary dark:text-inverse-primary tracking-tight" href="#">NexusPay</a>

<nav className="hidden md:flex gap-gutter items-center h-full">
<a className="h-full flex items-center text-on-surface-variant font-medium hover:text-primary transition-all duration-200" href="#">Explore</a>
<a className="h-full flex items-center text-on-surface-variant font-medium hover:text-primary transition-all duration-200" href="#">Top-Up</a>
<a className="h-full flex items-center text-primary font-bold border-b-2 border-primary pb-1 scale-95 transition-transform" href="#">Promotions</a>
<a className="h-full flex items-center text-on-surface-variant font-medium hover:text-primary transition-all duration-200" href="#">Support</a>
</nav>

<div className="hidden md:flex items-center gap-base">
<button className="px-4 py-2 font-label-md text-label-md text-primary hover:bg-surface-container-low rounded-lg transition-colors">Sign In</button>
<button className="px-4 py-2 font-label-md text-label-md bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-lg shadow-sm hover:scale-105 transition-transform">Sign Up</button>
</div>

<button className="md:hidden text-primary p-2">
<span className="material-symbols-outlined" >menu</span>
</button>
</div>
</header>
<div className="flex-1 flex w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop gap-gutter py-8">

<aside className="hidden md:flex w-64 flex-col gap-2 flex-shrink-0">
<div className="glass-panel p-4 rounded-xl sticky top-28">
<h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-4 px-2">Admin Panel</h3>
<nav className="flex flex-col gap-1">
<a className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors font-label-md text-label-md" href="#">
<span className="material-symbols-outlined" >dashboard</span>
                        Dashboard
                    </a>
<a className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors font-label-md text-label-md" href="#">
<span className="material-symbols-outlined" >group</span>
                        Users
                    </a>
<a className="flex items-center gap-3 px-3 py-2 rounded-lg text-primary bg-primary-fixed hover:bg-primary-fixed-dim transition-colors font-label-md text-label-md" href="#">
<span className="material-symbols-outlined" >campaign</span>
                        News &amp; Promotions
                    </a>
<a className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors font-label-md text-label-md" href="#">
<span className="material-symbols-outlined" >settings</span>
                        Settings
                    </a>
</nav>
</div>
</aside>

<main className="flex-1 flex flex-col min-w-0">
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
<div>
<h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Content Management</h1>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage platform news articles and promotional campaigns.</p>
</div>
<button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-lg font-label-md text-label-md shadow-sm hover:scale-105 transition-transform flex-shrink-0">
<span className="material-symbols-outlined" >add</span>
                    Create New
                </button>
</div>

<div className="flex border-b border-outline-variant mb-6 overflow-x-auto hide-scrollbar">
<button className="px-6 py-3 font-label-md text-label-md text-primary border-b-2 border-primary whitespace-nowrap">Manage Promotions</button>
<button className="px-6 py-3 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap">Manage News</button>
</div>

<div className="flex flex-col gap-6">

<section>
<h2 className="font-headline-md text-headline-md text-on-surface mb-4">Active Banners</h2>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

<div className="glass-panel rounded-xl overflow-hidden flex flex-col group relative">
<div className="h-32 bg-surface-container relative w-full overflow-hidden">
<div className="bg-cover bg-center w-full h-full absolute inset-0 opacity-80 group-hover:scale-105 transition-transform duration-500" data-alt="A high-energy, vibrant digital illustration representing a competitive esports tournament. Glowing neon purple and electric blue accents on a dark background, signifying a premium gaming event. Bright lighting, dynamic composition." ></div>
<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
<div className="absolute top-3 left-3 bg-secondary-container text-on-secondary-container px-2 py-1 rounded font-caption text-caption uppercase tracking-wide">Live</div>
</div>
<div className="p-4 flex flex-col gap-2 bg-white/50">
<div className="flex justify-between items-start">
<h3 className="font-headline-md text-headline-md text-on-surface !text-[18px]">Summer Championship Hub</h3>
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined" >more_vert</span>
</button>
</div>
<p className="font-body-md text-body-md text-on-surface-variant text-sm">Targeting: All Regions • Ends in 12 days</p>
<div className="flex justify-between items-center mt-2 pt-2 border-t border-outline-variant/30">
<span className="font-caption text-caption text-on-surface-variant">Views: 124.5k</span>
<span className="font-caption text-caption text-primary cursor-pointer hover:underline">Edit Banner</span>
</div>
</div>
</div>

<div className="glass-panel rounded-xl overflow-hidden flex flex-col group relative border-dashed border-2 border-outline-variant hover:border-primary/50 transition-colors bg-transparent items-center justify-center min-h-[220px] cursor-pointer">
<div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary mb-3">
<span className="material-symbols-outlined" >add_photo_alternate</span>
</div>
<span className="font-label-md text-label-md text-on-surface-variant">Upload New Banner</span>
</div>
</div>
</section>

<section className="mt-4">
<div className="flex justify-between items-center mb-4">
<h2 className="font-headline-md text-headline-md text-on-surface">Active Discount Codes</h2>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" >search</span>
<input className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-64" placeholder="Search codes..." type="text"/>
</div>
</div>
<div className="glass-panel rounded-xl overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="border-b border-outline-variant bg-surface-container-lowest/50">
<th className="py-4 px-4 font-label-md text-label-md text-on-surface-variant whitespace-nowrap">Code</th>
<th className="py-4 px-4 font-label-md text-label-md text-on-surface-variant whitespace-nowrap">Discount</th>
<th className="py-4 px-4 font-label-md text-label-md text-on-surface-variant whitespace-nowrap">Usage</th>
<th className="py-4 px-4 font-label-md text-label-md text-on-surface-variant whitespace-nowrap">Status</th>
<th className="py-4 px-4 font-label-md text-label-md text-on-surface-variant text-right whitespace-nowrap">Actions</th>
</tr>
</thead>
<tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline-variant/50">
<tr className="hover:bg-surface-container-lowest/80 transition-colors">
<td className="py-3 px-4 font-bold tracking-wider">NEXUS2024</td>
<td className="py-3 px-4 text-secondary-container font-medium">-20% Off</td>
<td className="py-3 px-4 text-on-surface-variant">4,210 / 10,000</td>
<td className="py-3 px-4">
<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-caption text-caption">Active</span>
</td>
<td className="py-3 px-4 text-right">
<button className="text-outline hover:text-primary transition-colors p-1"><span className="material-symbols-outlined" >edit</span></button>
<button className="text-outline hover:text-error transition-colors p-1"><span className="material-symbols-outlined" >delete</span></button>
</td>
</tr>
<tr className="hover:bg-surface-container-lowest/80 transition-colors bg-surface-container-low/30">
<td className="py-3 px-4 font-bold tracking-wider">WELCOME10</td>
<td className="py-3 px-4 text-secondary-container font-medium">-10% Off</td>
<td className="py-3 px-4 text-on-surface-variant">Unlimited</td>
<td className="py-3 px-4">
<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-caption text-caption">Active</span>
</td>
<td className="py-3 px-4 text-right">
<button className="text-outline hover:text-primary transition-colors p-1"><span className="material-symbols-outlined" >edit</span></button>
<button className="text-outline hover:text-error transition-colors p-1"><span className="material-symbols-outlined" >delete</span></button>
</td>
</tr>
</tbody>
</table>
</div>
</section>
</div>
</main>
</div>

<footer className="bg-surface-container-low dark:bg-inverse-surface full-width border-t border-outline-variant flat no shadows mt-auto">
<div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-desktop py-12 max-w-container-max mx-auto gap-gutter">
<div className="font-headline-md text-headline-md font-bold text-on-surface dark:text-inverse-on-surface">NexusPay</div>
<nav className="flex flex-wrap justify-center gap-6 font-body-md text-body-md">
<a className="text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Terms of Service</a>
<a className="text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Privacy Policy</a>
<a className="text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Refund Policy</a>
<a className="text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Contact Support</a>
<a className="text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">About Us</a>
<a className="text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Partners</a>
</nav>
<div className="font-caption text-caption text-on-surface-variant text-center md:text-right">
                © 2024 NexusPay. All rights reserved. High-performance gaming transactions.
            </div>
</div>
</footer>

    </>
  );
}
