
import React from 'react';
import Navbar from '@/components/Navbar';

export default function IdComponent() {
  return (
    <>
      

<div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-fixed-dim/20 blur-[120px] pointer-events-none -z-10"></div>
<div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-secondary-fixed/30 blur-[100px] pointer-events-none -z-10"></div>

<Navbar />
<main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 mt-20">

<div className="mb-8">
<button className="group flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors duration-200">
<span className="material-symbols-outlined transition-transform group-hover:-translate-x-1" data-icon="arrow_back">arrow_back</span>
<span className="font-label-md text-label-md">Back to History</span>
</button>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-gutter">

<div className="lg:col-span-8 flex flex-col gap-6">

<div className="glass-panel ambient-glow rounded-xl p-6 md:p-8 flex flex-col relative overflow-hidden">
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container"></div>
<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
<div>
<h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary mb-2">Transaction Detail</h1>
<p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                                Order ID: <span className="font-label-md text-label-md text-on-surface">NXP-9942-881A</span>
<button className="text-primary hover:text-primary-container ml-1" title="Copy ID">
<span className="material-symbols-outlined text-[16px]" data-icon="content_copy">content_copy</span>
</button>
</p>
</div>

<div className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]" data-icon="check_circle" data-weight="fill">check_circle</span>
<span className="font-label-md text-label-md uppercase tracking-wider">Berhasil</span>
</div>
</div>
<hr className="border-t border-outline-variant/30 mb-8"/>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 mb-8">
<div>
<p className="font-caption text-caption text-outline mb-1 uppercase tracking-wider">Product</p>
<p className="font-headline-md text-headline-md text-on-surface">Mobile Legends</p>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">706 Diamonds</p>
</div>
<div>
<p className="font-caption text-caption text-outline mb-1 uppercase tracking-wider">Transaction Date</p>
<p className="font-body-lg text-body-lg text-on-surface">24 Oct 2024, 14:32 WIB</p>
</div>
<div>
<p className="font-caption text-caption text-outline mb-1 uppercase tracking-wider">Player ID</p>
<p className="font-body-lg text-body-lg text-on-surface">12345678 (1234)</p>
</div>
<div>
<p className="font-caption text-caption text-outline mb-1 uppercase tracking-wider">Payment Method</p>
<p className="font-body-lg text-body-lg text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-primary" data-icon="qr_code_scanner">qr_code_scanner</span>
                                QRIS
                            </p>
</div>
</div>

<div className="bg-surface-container-low rounded-lg p-4 mb-8 border border-outline-variant/20">
<div className="flex justify-between items-center py-2">
<span className="font-body-md text-body-md text-on-surface-variant">Nominal</span>
<span className="font-body-md text-body-md text-on-surface">Rp 150.000</span>
</div>
<div className="flex justify-between items-center py-2 border-t border-outline-variant/10">
<span className="font-body-md text-body-md text-on-surface-variant">Admin Fee</span>
<span className="font-body-md text-body-md text-on-surface">Rp 2.500</span>
</div>
<div className="flex justify-between items-center py-2 border-t border-outline-variant/10">
<span className="font-body-md text-body-md text-on-surface-variant">Promo Code (NEXUS20)</span>
<span className="font-body-md text-body-md text-secondary-container">- Rp 10.000</span>
</div>
<div className="flex justify-between items-center py-4 border-t border-outline-variant/30 mt-2">
<span className="font-headline-md text-headline-md text-on-surface">Total</span>
<span className="font-headline-md text-headline-md text-secondary-container">Rp 142.500</span>
</div>
</div>

<div className="flex flex-col sm:flex-row gap-4 mt-auto">
<button className="flex-1 bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-md text-label-md py-3 px-6 rounded-lg shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
<span className="material-symbols-outlined" data-icon="download">download</span>
                            Download Receipt
                        </button>
<button className="flex-1 bg-surface-container-lowest border border-outline-variant text-primary font-label-md text-label-md py-3 px-6 rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2">
<span className="material-symbols-outlined" data-icon="support_agent">support_agent</span>
                            Need Help?
                        </button>
</div>
</div>
</div>

<div className="lg:col-span-4 flex flex-col gap-6">
<div className="glass-panel ambient-glow rounded-xl p-6 md:p-8">
<h2 className="font-headline-md text-headline-md text-on-surface mb-6">Order Status</h2>

<div className="relative">

<div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-outline-variant/30"></div>

<div className="absolute left-[15px] top-4 h-full w-[2px] bg-tertiary"></div>

<div className="flex flex-col gap-8 relative z-10">

<div className="flex gap-4 items-start">
<div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-md shadow-tertiary/20 shrink-0">
<span className="material-symbols-outlined text-[16px]" data-icon="shopping_cart">shopping_cart</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface">Order Placed</p>
<p className="font-caption text-caption text-outline mt-1">24 Oct, 14:30</p>
</div>
</div>

<div className="flex gap-4 items-start">
<div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-md shadow-tertiary/20 shrink-0">
<span className="material-symbols-outlined text-[16px]" data-icon="payments">payments</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface">Payment Verified</p>
<p className="font-caption text-caption text-outline mt-1">24 Oct, 14:31</p>
</div>
</div>

<div className="flex gap-4 items-start">
<div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-md shadow-tertiary/20 shrink-0">
<span className="material-symbols-outlined text-[16px]" data-icon="sync">sync</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface">Processing Order</p>
<p className="font-caption text-caption text-outline mt-1">24 Oct, 14:31</p>
</div>
</div>

<div className="flex gap-4 items-start">
<div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-md shadow-tertiary/20 shrink-0">
<span className="material-symbols-outlined text-[16px]" data-icon="check">check</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface">Order Successful</p>
<p className="font-caption text-caption text-outline mt-1">24 Oct, 14:32</p>
<p className="font-caption text-caption text-primary mt-1">Items delivered to account.</p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</main>

    </>
  );
}
