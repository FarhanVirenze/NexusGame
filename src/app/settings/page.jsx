
import React from 'react';
import Navbar from '@/components/Navbar';

export default function SettingsComponent() {
  return (
    <>
      

<Navbar />
<main className="flex-grow px-margin-mobile md:px-margin-desktop py-12">
<div className="max-w-3xl mx-auto space-y-12">

<div className="text-center md:text-left">
<h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Account Settings</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant">Manage your gaming profile and preferences.</p>
</div>

<section className="glass-card rounded-xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
<div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-fixed rounded-full blur-3xl opacity-30 pointer-events-none"></div>
<div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0 relative group cursor-pointer">
<img className="w-full h-full object-cover" data-alt="A high-quality, professional avatar portrait of a modern gamer. Bright, clean lighting, optimistic mood. The background is a soft, light-mode gradient of subtle blues and whites." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMWTAZgAruBsTV67OQVBFyWTyVtXmoJ_sDeg4kiqggfzVDZk238vXF42QSecHO_3hTVA8d4x0T1dNEunQ1X6uluMtsxZhoVM1IPeUitS36fBh9U5ABiZ_0-RixayiVVZV3Jk8Wck-LLYP4D9BSArwIcH5n0Ge7Sg0rGGhKziOKNQ93DI-ODEftiP8ZCZ-lSi-zIGqQuIJzqNIQEH4vnsCaWessfaSKNmoZDbAxRJQguQzbjCJ-xgtM3MOm6v-73CgqSHdUrfagyCQs"/>
<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined text-white">photo_camera</span>
</div>
</div>
<div className="flex-grow text-center md:text-left">
<h2 className="font-headline-md text-headline-md text-on-surface">Alex "Nexus" Chen</h2>
<p className="font-body-md text-body-md text-outline mt-1">alex.chen@example.com</p>
<div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
<span className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full font-caption text-caption flex items-center gap-1">
<span className="material-symbols-outlined" >verified</span> Pro Member
                        </span>
</div>
</div>
</section>

<section className="glass-card rounded-xl p-8 shadow-sm">
<h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">person</span> Personal Details
                </h3>
<form className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Display Name</label>
<input className="form-input-styled" placeholder="Enter your display name" type="text" value="AlexNexus"/>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Email Address</label>
<input className="form-input-styled" placeholder="Enter your email" type="email" value="alex.chen@example.com"/>
</div>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Bio</label>
<textarea className="form-input-styled h-24 resize-none" placeholder="A brief description of your gaming style..."></textarea>
</div>
<div className="flex justify-end">
<button className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2.5 rounded-lg font-label-md text-label-md shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200" type="button">
                            Save Changes
                        </button>
</div>
</form>
</section>

<section className="glass-card rounded-xl p-8 shadow-sm">
<h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-secondary-container">link</span> Linked Game IDs
                </h3>
<div className="space-y-4">

<div className="flex items-center justify-between p-4 bg-surface-container-low border border-surface-variant rounded-lg">
<div className="flex items-center gap-4">
<div className="w-10 h-10 bg-[#eb0029] rounded-md flex items-center justify-center text-white font-bold">R</div>
<div>
<p className="font-label-md text-label-md text-on-surface">Riot ID</p>
<p className="font-caption text-caption text-outline">Nexus#NA1</p>
</div>
</div>
<button className="text-error font-label-md text-label-md hover:underline">Unlink</button>
</div>

<div className="flex items-center justify-between p-4 bg-surface-container-low border border-surface-variant rounded-lg">
<div className="flex items-center gap-4">
<div className="w-10 h-10 bg-[#f9a826] rounded-md flex items-center justify-center text-white font-bold">M</div>
<div>
<p className="font-label-md text-label-md text-on-surface">Mobile Legends</p>
<p className="font-caption text-caption text-outline">Not Linked</p>
</div>
</div>
<button className="text-primary font-label-md text-label-md hover:underline">Connect</button>
</div>
</div>
</section>

<section className="glass-card rounded-xl p-8 shadow-sm">
<h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-on-surface">lock</span> Security
                </h3>
<form className="space-y-6">
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Current Password</label>
<input className="form-input-styled" placeholder="••••••••" type="password"/>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">New Password</label>
<input className="form-input-styled" placeholder="••••••••" type="password"/>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Confirm New Password</label>
<input className="form-input-styled" placeholder="••••••••" type="password"/>
</div>
</div>
<div className="flex justify-end">
<button className="bg-surface-container-high text-on-surface border border-outline-variant px-6 py-2.5 rounded-lg font-label-md text-label-md hover:bg-surface-variant transition-colors duration-200" type="button">
                            Update Password
                        </button>
</div>
</form>
</section>

<section className="glass-card rounded-xl p-8 shadow-sm">
<h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-primary-container">notifications</span> Notification Preferences
                </h3>
<div className="space-y-4">
<label className="flex items-center justify-between p-4 hover:bg-surface-container-low rounded-lg cursor-pointer transition-colors">
<div>
<p className="font-label-md text-label-md text-on-surface">Transaction Receipts</p>
<p className="font-caption text-caption text-outline">Email confirmations for successful purchases.</p>
</div>
<input checked="" className="form-checkbox h-5 w-5 text-primary rounded border-outline-variant focus:ring-primary-container" type="checkbox"/>
</label>
<div className="h-px bg-surface-variant w-full"></div>
<label className="flex items-center justify-between p-4 hover:bg-surface-container-low rounded-lg cursor-pointer transition-colors">
<div>
<p className="font-label-md text-label-md text-on-surface">Promotional Offers</p>
<p className="font-caption text-caption text-outline">Updates on sales and new game integrations.</p>
</div>
<input className="form-checkbox h-5 w-5 text-primary rounded border-outline-variant focus:ring-primary-container" type="checkbox"/>
</label>
</div>
</section>
</div>
</main>

<footer className="bg-surface-container-low border-t border-outline-variant mt-auto">
<div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-desktop py-12 max-w-container-max mx-auto gap-gutter">
<div className="font-headline-md text-headline-md font-bold text-on-surface">
                NexusPay
            </div>
<div className="flex flex-wrap justify-center gap-6">
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Terms of Service</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Privacy Policy</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Refund Policy</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Contact Support</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">About Us</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Partners</a>
</div>
<div className="font-caption text-caption text-on-surface-variant text-center md:text-right w-full md:w-auto mt-6 md:mt-0">
                © 2024 NexusPay. All rights reserved. High-performance gaming transactions.
            </div>
</div>
</footer>

    </>
  );
}
