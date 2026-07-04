
import React from 'react';

export default function SettingsComponent() {
  return (
    <>
      

<nav className="bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm docked full-width top-0 z-50 fixed w-full h-20">
<div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-full">
<div className="flex items-center gap-gutter">
<a className="font-display-lg text-display-lg font-extrabold text-primary dark:text-inverse-primary tracking-tight" href="#" >NexusPay</a>
</div>
<div className="hidden md:flex items-center gap-6">

<a className="text-on-surface-variant font-medium font-label-md text-label-md hover:text-primary transition-all duration-200" href="#">Dashboard</a>
<a className="text-on-surface-variant font-medium font-label-md text-label-md hover:text-primary transition-all duration-200" href="#">Users</a>
<a className="text-on-surface-variant font-medium font-label-md text-label-md hover:text-primary transition-all duration-200" href="#">Transactions</a>
<a className="text-primary font-bold border-b-2 border-primary pb-1 font-label-md text-label-md" href="#">Settings</a>
</div>
<div className="flex items-center gap-4">
<button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-all duration-200">Admin Sign Out</button>
</div>
</div>
</nav>

<main className="flex-grow pt-28 pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-gutter">

<aside className="hidden lg:block lg:col-span-3">
<div className="glass-panel rounded-xl p-6 sticky top-28">
<h3 className="font-headline-md text-headline-md mb-6 text-on-surface">Configuration</h3>
<nav className="flex flex-col gap-2">
<a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-container-high text-primary font-bold transition-colors" href="#">
<span className="material-symbols-outlined" >settings</span>
<span className="font-label-md text-label-md">General Settings</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined">key</span>
<span className="font-label-md text-label-md">API Keys</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined">shield_person</span>
<span className="font-label-md text-label-md">Security</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined">mail</span>
<span className="font-label-md text-label-md">Email Templates</span>
</a>
</nav>
</div>
</aside>

<section className="col-span-1 lg:col-span-9 flex flex-col gap-8">

<div>
<h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Platform Settings</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Manage global variables and operational modes for NexusPay.</p>
</div>

<form className="flex flex-col gap-8">

<div className="glass-panel rounded-xl p-6 md:p-8">
<h2 className="font-headline-md text-headline-md mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">build_circle</span>
                        Operational Mode
                    </h2>
<div className="flex items-center justify-between p-4 bg-surface-container rounded-lg border border-outline-variant/30">
<div>
<p className="font-label-md text-label-md text-on-surface mb-1">Maintenance Mode</p>
<p className="font-caption text-caption text-on-surface-variant">Disables public API access and shows a holding page. Internal Admin access remains active.</p>
</div>

<div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
<input className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 transition-all right-6 border-surface-variant" id="maintenance_toggle" name="toggle" type="checkbox"/>
<label className="toggle-label block overflow-hidden h-6 rounded-full bg-surface-variant cursor-pointer transition-colors" htmlFor="maintenance_toggle"></label>
</div>
</div>
</div>

<div className="glass-panel rounded-xl p-6 md:p-8">
<h2 className="font-headline-md text-headline-md mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">api</span>
                        Payment Gateway Integration
                    </h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="flex flex-col gap-2">
<label className="font-label-md text-label-md text-on-surface">Primary Gateway Secret Key</label>
<div className="relative flex items-center input-glow rounded-lg border border-slate-200 bg-slate-50 transition-all overflow-hidden">
<span className="material-symbols-outlined pl-3 text-outline">key</span>
<input className="w-full bg-transparent border-none focus:ring-0 font-body-md text-body-md text-on-surface py-3 px-3" placeholder="sk_live_..." type="password" value="sk_live_1234567890abcdef"/>
</div>
</div>
<div className="flex flex-col gap-2">
<label className="font-label-md text-label-md text-on-surface">Webhook Signing Secret</label>
<div className="relative flex items-center input-glow rounded-lg border border-slate-200 bg-slate-50 transition-all overflow-hidden">
<span className="material-symbols-outlined pl-3 text-outline">lock</span>
<input className="w-full bg-transparent border-none focus:ring-0 font-body-md text-body-md text-on-surface py-3 px-3" placeholder="whsec_..." type="password" value="whsec_0987654321fedcba"/>
</div>
</div>
</div>
</div>

<div className="glass-panel rounded-xl p-6 md:p-8">
<h2 className="font-headline-md text-headline-md mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">contact_support</span>
                        Support Configuration
                    </h2>
<div className="flex flex-col gap-6">
<div className="flex flex-col gap-2 w-full md:w-1/2">
<label className="font-label-md text-label-md text-on-surface">Global Support Email</label>
<div className="relative flex items-center input-glow rounded-lg border border-slate-200 bg-slate-50 transition-all overflow-hidden">
<span className="material-symbols-outlined pl-3 text-outline">mail</span>
<input className="w-full bg-transparent border-none focus:ring-0 font-body-md text-body-md text-on-surface py-3 px-3" type="email" value="support@nexuspay.gg"/>
</div>
</div>
</div>
</div>

<div className="glass-panel rounded-xl p-6 md:p-8 relative overflow-hidden">

<div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-fixed rounded-full blur-3xl opacity-30 pointer-events-none"></div>
<h2 className="font-headline-md text-headline-md mb-6 flex items-center gap-2 relative z-10">
<span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                        Admin Security Profile
                    </h2>
<div className="flex flex-col gap-6 relative z-10">
<div className="flex items-center gap-4 p-4 rounded-lg bg-surface border border-outline-variant/30">
<div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-md">
                                A
                            </div>
<div>
<p className="font-label-md text-label-md text-on-surface">Admin Session Timeout</p>
<p className="font-caption text-caption text-on-surface-variant">Automatically log out after inactivity.</p>
</div>
<div className="ml-auto">
<select className="bg-slate-50 border border-slate-200 text-on-surface font-body-md rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5">
<option>15 Minutes</option>
<option selected="">30 Minutes</option>
<option>1 Hour</option>
</select>
</div>
</div>
<div className="flex justify-end gap-4 mt-4">
<button className="px-6 py-3 rounded-lg bg-white border border-outline-variant font-label-md text-label-md text-on-surface hover:bg-surface transition-colors shadow-sm" type="button">Cancel</button>

<button className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-md text-label-md shadow-md hover:scale-[1.02] transition-transform shadow-primary/20 hover:shadow-primary/40" type="submit">Save Configuration</button>
</div>
</div>
</div>
</form>
</section>
</main>

<footer className="bg-surface-container-low dark:bg-inverse-surface border-t border-outline-variant mt-auto">
<div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-desktop py-12 max-w-container-max mx-auto gap-gutter">
<div className="font-headline-md text-headline-md font-bold text-on-surface dark:text-inverse-on-surface">NexusPay</div>
<div className="flex flex-wrap justify-center gap-6">
<a className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Terms of Service</a>
<a className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Privacy Policy</a>
<a className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Refund Policy</a>
<a className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Contact Support</a>
<a className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">About Us</a>
<a className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Partners</a>
</div>
<div className="font-caption text-caption text-on-surface-variant text-center md:text-right">
                © 2024 NexusPay. All rights reserved. High-performance gaming transactions.
            </div>
</div>
</footer>

    </>
  );
}
