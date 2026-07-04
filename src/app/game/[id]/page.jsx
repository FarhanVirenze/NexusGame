
import React from 'react';
import Navbar from '@/components/Navbar';

export default function IdComponent() {
  return (
    <>
      

<Navbar />
<main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-16 mt-20">

<section className="gsap-hero relative rounded-2xl overflow-hidden h-[400px] md:h-[500px] flex items-end pb-8 px-6 md:px-12 ambient-shadow-primary glass-panel">
<div className="absolute inset-0 z-0">
<div className="bg-cover bg-center w-full h-full opacity-80 mix-blend-overlay" data-alt="A dynamic, high-fidelity digital illustration of epic fantasy warriors in a luminous arena. The lighting is bright and energetic with glowing blue and vibrant purple accents on a mostly white and light-blue background, representing a high-octane competitive esports environment. The mood is heroic and pristine." ></div>
<div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent"></div>
</div>
<div className="relative z-10 w-full max-w-3xl">
<div className="flex items-center gap-3 mb-4">
<span className="bg-tertiary text-on-tertiary font-label-md text-label-md px-3 py-1 rounded-full uppercase tracking-wider text-xs">MOBA</span>
<span className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-3 py-1 rounded-full uppercase tracking-wider text-xs flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]" data-icon="bolt">bolt</span>
                         Instant Delivery
                     </span>
</div>
<h1 className="font-display-lg text-display-lg md:text-[56px] text-on-surface mb-4">Mobile Legends</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                     Top up Mobile Legends Diamonds fast and cheap! Simply enter your User ID and Zone ID, select the value of Diamonds you wish to purchase, complete the payment, and the Diamonds will be added immediately to your MLBB account.
                 </p>
</div>
</section>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

<div className="lg:col-span-8 space-y-8">

<section className="gsap-step glass-panel rounded-xl p-6 md:p-8 ambient-shadow-primary">
<div className="flex items-center gap-4 mb-6">
<div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md text-headline-md">1</div>
<h2 className="font-headline-md text-headline-md text-on-surface">Enter Account Details</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="font-label-md text-label-md text-on-surface-variant block">User ID</label>
<input className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg px-4 py-3 font-body-md text-body-md outline-none transition-all shadow-sm" placeholder="e.g. 12345678" type="text" />
</div>
<div className="space-y-2">
<label className="font-label-md text-label-md text-on-surface-variant block">Zone ID</label>
<input className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg px-4 py-3 font-body-md text-body-md outline-none transition-all shadow-sm" placeholder="e.g. (1234)" type="text" />
</div>
</div>
<p className="font-caption text-caption text-outline mt-3 flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]" data-icon="help">help</span>
                        To find your User ID, click on your avatar in the top left corner of the main game screen.
                    </p>
</section>

<section className="gsap-step glass-panel rounded-xl p-6 md:p-8 ambient-shadow-primary">
<div className="flex items-center gap-4 mb-6">
<div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md text-headline-md">2</div>
<h2 className="font-headline-md text-headline-md text-on-surface">Select Recharge Amount</h2>
</div>

<div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
<button className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md whitespace-nowrap">Diamonds</button>
<button className="px-4 py-2 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant font-label-md text-label-md whitespace-nowrap hover:bg-surface-container-high transition-colors">Starlight Member</button>
<button className="px-4 py-2 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant font-label-md text-label-md whitespace-nowrap hover:bg-surface-container-high transition-colors">Twilight Pass</button>
</div>

<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

<div className="relative group cursor-pointer">
<input checked="" className="peer hidden" id="den-1" name="denomination" type="radio" />
<label className="block w-full h-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary transition-all hover:border-primary/50 relative overflow-hidden" htmlFor="den-1">
<div className="absolute inset-0 bg-primary/5 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
<div className="flex flex-col items-center justify-center gap-2 relative z-10">
<span className="material-symbols-outlined text-primary text-3xl" data-icon="diamond" data-weight="fill">diamond</span>
<span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">5</span>
<span className="font-caption text-caption text-on-surface-variant uppercase">Diamonds</span>
</div>
</label>
</div>

<div className="relative group cursor-pointer">
<input className="peer hidden" id="den-2" name="denomination" type="radio" />
<label className="block w-full h-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary transition-all hover:border-primary/50 relative overflow-hidden" htmlFor="den-2">
<div className="absolute top-0 right-0 bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-1 rounded-bl-lg z-20">+1 Bonus</div>
<div className="absolute inset-0 bg-primary/5 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
<div className="flex flex-col items-center justify-center gap-2 relative z-10">
<span className="material-symbols-outlined text-primary text-3xl" data-icon="diamond" data-weight="fill">diamond</span>
<span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">11</span>
<span className="font-caption text-caption text-on-surface-variant uppercase">Diamonds</span>
</div>
</label>
</div>

<div className="relative group cursor-pointer">
<input className="peer hidden" id="den-3" name="denomination" type="radio" />
<label className="block w-full h-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary transition-all hover:border-primary/50 relative overflow-hidden" htmlFor="den-3">
<div className="absolute top-0 right-0 bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-1 rounded-bl-lg z-20">+2 Bonus</div>
<div className="absolute inset-0 bg-primary/5 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
<div className="flex flex-col items-center justify-center gap-2 relative z-10">
<span className="material-symbols-outlined text-primary text-3xl" data-icon="diamond" data-weight="fill">diamond</span>
<span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">17</span>
<span className="font-caption text-caption text-on-surface-variant uppercase">Diamonds</span>
</div>
</label>
</div>

<div className="relative group cursor-pointer">
<input className="peer hidden" id="den-4" name="denomination" type="radio" />
<label className="block w-full h-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary transition-all hover:border-primary/50 relative overflow-hidden" htmlFor="den-4">
<div className="absolute inset-0 bg-primary/5 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
<div className="flex flex-col items-center justify-center gap-2 relative z-10">
<span className="material-symbols-outlined text-primary text-3xl" data-icon="diamond" data-weight="fill">diamond</span>
<span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">25</span>
<span className="font-caption text-caption text-on-surface-variant uppercase">Diamonds</span>
</div>
</label>
</div>
</div>
</section>
</div>

<div className="lg:col-span-4 space-y-8">
<section className="gsap-summary glass-panel rounded-xl p-6 md:p-8 ambient-shadow-secondary sticky top-28">
<h3 className="font-headline-md text-headline-md text-on-surface mb-6 border-b border-outline-variant pb-4">Order Summary</h3>
<div className="space-y-4 mb-6">
<div className="flex justify-between items-center">
<span className="font-body-md text-body-md text-on-surface-variant">Item</span>
<span className="font-label-md text-label-md text-on-surface">5 Diamonds</span>
</div>
<div className="flex justify-between items-center">
<span className="font-body-md text-body-md text-on-surface-variant">Price</span>
<span className="font-label-md text-label-md text-on-surface">Rp 1.500</span>
</div>
<div className="flex justify-between items-center">
<span className="font-body-md text-body-md text-on-surface-variant">Admin Fee</span>
<span className="font-label-md text-label-md text-on-surface">Rp 0</span>
</div>
</div>
<div className="border-t border-outline-variant pt-4 mb-8">
<div className="flex justify-between items-end">
<span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Total</span>
<span className="font-headline-md text-headline-md text-secondary-container">Rp 1.500</span>
</div>
</div>
<button className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline-lg-mobile text-[18px] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
<span className="material-symbols-outlined" data-icon="shopping_cart">shopping_cart</span>
                        Buy Now
                    </button>
<div className="mt-4 flex items-center justify-center gap-2 text-on-surface-variant font-caption text-caption">
<span className="material-symbols-outlined text-[16px]" data-icon="verified_user">verified_user</span>
                         Secure Payment Guaranteed
                    </div>
</section>
</div>
</div>
</main>

<footer className="bg-surface-container-low dark:bg-inverse-surface border-t border-outline-variant dark:border-outline flex flex-col md:flex-row justify-between items-center px-margin-desktop w-full max-w-container-max mx-auto py-12 mt-12">
<div className="font-display-lg text-headline-md font-bold text-on-surface dark:text-inverse-on-surface mb-6 md:mb-0">
            © 2024 NexusPay. Premium Gaming Solutions.
        </div>
<div className="flex gap-6">
<a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary-container transition-all opacity-80 hover:opacity-100 font-body-md text-body-md font-label-md text-label-md" href="#">Terms</a>
<a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary-container transition-all opacity-80 hover:opacity-100 font-body-md text-body-md font-label-md text-label-md" href="#">Privacy</a>
<a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary-container transition-all opacity-80 hover:opacity-100 font-body-md text-body-md font-label-md text-label-md" href="#">Support</a>
</div>
</footer>


    </>
  );
}
