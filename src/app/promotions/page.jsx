
import React from 'react';
import Navbar from '@/components/Navbar';

export default function PromotionsComponent() {
  return (
    <>
      

<Navbar />
<main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex flex-col gap-16 mt-20">

<section className="relative w-full rounded-2xl overflow-hidden glass-panel ambient-shadow-primary p-8 md:p-16 flex flex-col md:flex-row items-center gap-gutter min-h-[400px]">

<div className="absolute inset-0 opacity-20 pointer-events-none" ></div>
<div className="flex-1 flex flex-col gap-6 z-10 relative">
<div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full w-fit">
<span className="material-symbols-outlined text-sm">local_fire_department</span>
<span className="font-label-md text-label-md">Limited Time Events</span>
</div>
<h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface">
                    Level Up Your<br />
<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Gaming Experience</span>
</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                    Discover exclusive discounts, flash sales, and bonus currency events. Power up your account without draining your wallet.
                </p>
</div>
<div className="flex-1 w-full relative z-10 hidden md:block">
<div className="bg-cover bg-center w-full h-[300px] rounded-xl glass-panel" data-alt="A dynamic, high-key digital illustration representing gaming power-ups. A glowing, stylized diamond and abstract geometric shapes float in a bright, pristine environment. The color palette features electric blues and subtle energetic orange accents against a soft, light-mode frosted glass background. The scene feels premium, fast, and modern." ></div>
</div>
</section>

<section className="flex flex-col gap-8">
<div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-outline-variant/30 pb-4">
<div>
<h2 className="font-headline-md text-headline-md text-on-surface">Active Promotions</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Don't miss out on these current offers.</p>
</div>

<div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
<button className="whitespace-nowrap px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md">All Offers</button>
<button className="whitespace-nowrap px-4 py-2 rounded-full bg-surface-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors">Top Ups</button>
<button className="whitespace-nowrap px-4 py-2 rounded-full bg-surface-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors">Vouchers</button>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">

<div className="glass-panel rounded-xl overflow-hidden card-hover ambient-shadow-secondary flex flex-col relative group">

<div className="absolute top-4 right-4 z-20 bg-secondary-container text-white px-3 py-1 rounded-md font-label-md text-label-md shadow-md">
                        Ends in 24h
                    </div>
<div className="h-48 relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
<div className="bg-cover bg-center w-full h-full group-hover:scale-105 transition-transform duration-500" data-alt="A high-quality 3D render of sparkling blue gaming diamonds scattered on a sleek, light-colored surface. The lighting is bright and crisp, creating a premium light-mode aesthetic. A subtle electric blue glow emanates from the gems, hinting at digital value and high-performance gaming microtransactions." ></div>
</div>
<div className="p-6 flex flex-col gap-4 flex-grow">
<h3 className="font-headline-md text-headline-md text-on-surface">10% Off Diamonds with QRIS</h3>
<p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                            Get a flat 10% discount on all Mobile Legends Diamond packages when you pay using any supported QRIS e-wallet.
                        </p>
<div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/30">
<span className="font-label-md text-label-md text-secondary">Use code: QRISML10</span>
<button className="btn-secondary-gradient text-white px-5 py-2 rounded-lg font-label-md text-label-md">
                                Claim Now
                            </button>
</div>
</div>
</div>

<div className="glass-panel rounded-xl overflow-hidden card-hover ambient-shadow-primary flex flex-col relative group">
<div className="absolute top-4 right-4 z-20 bg-primary-container text-white px-3 py-1 rounded-md font-label-md text-label-md shadow-md">
                        New Users
                    </div>
<div className="h-48 relative overflow-hidden">
<div className="bg-cover bg-center w-full h-full group-hover:scale-105 transition-transform duration-500" data-alt="An abstract visualization of digital currency transfer in a bright, modern setting. Glowing gold and blue digital coins fly through a translucent, frosted glass interface. The lighting is soft and airy, characteristic of a premium financial application designed for gamers. The overall mood is fast, secure, and rewarding." ></div>
</div>
<div className="p-6 flex flex-col gap-4 flex-grow">
<h3 className="font-headline-md text-headline-md text-on-surface">50% Cashback on First Top-Up</h3>
<p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                            Welcome to NexusPay! Enjoy a massive 50% cashback (up to Rp 50.000) on your very first game credit purchase.
                        </p>
<div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/30">
<span className="font-label-md text-label-md text-primary">No code needed</span>
<button className="btn-primary-gradient text-on-primary px-5 py-2 rounded-lg font-label-md text-label-md">
                                View Details
                            </button>
</div>
</div>
</div>

<div className="glass-panel rounded-xl overflow-hidden card-hover flex flex-col relative group">
<div className="absolute top-4 right-4 z-20 bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-md font-label-md text-label-md shadow-md">
                        Weekly Special
                    </div>
<div className="h-48 relative overflow-hidden bg-surface-container-high flex items-center justify-center">
<span className="material-symbols-outlined text-[80px] text-tertiary opacity-50 group-hover:scale-110 transition-transform duration-500">flash_on</span>
</div>
<div className="p-6 flex flex-col gap-4 flex-grow">
<h3 className="font-headline-md text-headline-md text-on-surface">Weekend Flash Sale: PUBG UC</h3>
<p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                            Prices drop every Friday at 18:00 WIB. Score up to 30% off selected PUBG Mobile UC packages while stocks last.
                        </p>
<div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/30">
<span className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-sm">schedule</span> Starts Friday
                            </span>
<button className="bg-surface-variant text-on-surface px-5 py-2 rounded-lg font-label-md text-label-md border border-outline-variant/50 hover:bg-surface-container-high transition-colors">
                                Remind Me
                            </button>
</div>
</div>
</div>
</div>
</section>

<section className="glass-panel rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 ambient-shadow-primary bg-gradient-to-br from-surface to-primary-fixed/30">
<div className="flex flex-col gap-4 max-w-lg">
<h3 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Never Miss a Drop</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
                    Subscribe to our alerts and be the first to know about upcoming flash sales, exclusive promo codes, and new game integrations.
                </p>
</div>
<div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
<input className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full sm:w-64" placeholder="Enter your email address" type="email" />
<button className="btn-primary-gradient text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md whitespace-nowrap">
                    Subscribe
                </button>
</div>
</section>
</main>

<footer className="bg-surface-container-low dark:bg-inverse-surface font-body-md text-body-md font-label-md text-label-md full-width py-12 border-t border-outline-variant dark:border-outline flat no shadows flex flex-col md:flex-row justify-between items-center px-margin-desktop w-full max-w-container-max mx-auto mt-auto">
<div className="font-display-lg text-headline-md font-bold text-on-surface dark:text-inverse-on-surface mb-4 md:mb-0">
            NexusPay
        </div>
<div className="flex gap-6 mb-4 md:mb-0">
<a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary-container transition-all opacity-80 hover:opacity-100 transition-opacity" href="#">Terms</a>
<a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary-container transition-all opacity-80 hover:opacity-100 transition-opacity" href="#">Privacy</a>
<a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary-container transition-all opacity-80 hover:opacity-100 transition-opacity" href="#">Support</a>
</div>
<div className="text-on-surface-variant dark:text-surface-variant font-caption text-caption text-center md:text-right">
            © 2024 NexusPay. Premium Gaming Solutions.
        </div>
</footer>

    </>
  );
}
