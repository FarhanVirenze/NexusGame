
import React from 'react';
import Navbar from '@/components/Navbar';

export default function HistoryComponent() {
  return (
    <>
      

<Navbar />
<main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
<div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Riwayat Pesanan</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Kelola dan pantau semua transaksi top-up game Anda.</p>
</div>
<div className="flex gap-2">
<button className="glass-panel px-4 py-2 rounded-lg flex items-center gap-2 font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-[18px]">filter_list</span>
                    Filter
                </button>
<div className="relative">
<input className="bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 py-2 font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 w-full md:w-64" placeholder="Cari pesanan..." type="text" />
<span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">search</span>
</div>
</div>
</div>

<div className="glass-panel rounded-xl overflow-hidden">

<div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-outline-variant bg-surface/50 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
<div className="col-span-4">Game &amp; Detail</div>
<div className="col-span-2">Nominal</div>
<div className="col-span-2">Tanggal</div>
<div className="col-span-2">Status</div>
<div className="col-span-2 text-right">Aksi</div>
</div>

<div className="flex flex-col">

<div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-outline-variant items-center hover:bg-surface-container/30 transition-colors">
<div className="col-span-1 md:col-span-4 flex items-center gap-4">
<img className="w-12 h-12 rounded-lg object-cover bg-surface-container-highest" data-alt="High resolution icon for a popular mobile MOBA game featuring bold colors and stylized fantasy character elements in a modern, clean light mode setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnNM6xe_KZYe_GDVNY_Mk-Lkk2JbBz0iSbKrIQ21T-Pty5Zb5ubFKWGIHXeyOBRCB7bVMgqQvOlPI-TyWBWL_EgYG9W-lTDPcCGTgw1nzFZrMhqmMuj_lyHxC4rtVo-aovN7iFHJFK94Q5JasRJ-sQvhgLsRNwNfEAmxBcymCtQQ9mSw8-UWjyi7yVcN97NU5A2Vg0ujk6Y5kmtwW1J0Hl9UrYEq5JEwvCobLiRlwfQ7vFo_DbGilSvj0N4rD1_mciEzH5-XZwGN6L" />
<div>
<div className="font-headline-md text-[16px] font-bold text-on-surface">Mobile Legends: Bang Bang</div>
<div className="font-caption text-caption text-on-surface-variant">ID: 12345678 (1234)</div>
</div>
</div>
<div className="col-span-1 md:col-span-2 font-body-md text-body-md font-bold text-on-surface">
                        Rp 150.000 <span className="font-caption text-caption text-on-surface-variant font-normal block">706 Diamonds</span>
</div>
<div className="col-span-1 md:col-span-2 font-body-md text-body-md text-on-surface-variant">
                        24 Okt 2024
                    </div>
<div className="col-span-1 md:col-span-2 flex items-center">
<span className="bg-tertiary-container/20 text-tertiary px-3 py-1 rounded-full font-label-md text-[12px] flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">check_circle</span>
                            Berhasil
                        </span>
</div>
<div className="col-span-1 md:col-span-2 flex justify-end">
<button className="text-primary hover:text-primary-container font-label-md text-label-md flex items-center gap-1 transition-colors">
<span className="material-symbols-outlined text-[18px]">download</span>
<span className="md:hidden">Invoice</span>
</button>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-outline-variant items-center hover:bg-surface-container/30 transition-colors">
<div className="col-span-1 md:col-span-4 flex items-center gap-4">
<img className="w-12 h-12 rounded-lg object-cover bg-surface-container-highest" data-alt="High resolution icon for a popular tactical shooter game featuring a stylized V logo in bold red and white colors, set in a clean light mode environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_7Y0MAZtYizHjqv-CDJpZl4mULZRBCOpyTWcwK106LdebWCwc0MDHcg4dla76-TiEFcfLwsA9BeXywLIAsa3eJY1I-HUu-k0mRto1Dnt5ILSH895O5kAXJBxLwRFPIArj6bw-HWnf0jFCe4jrHPijyyK1QeEZmUHZFeBWLqRgME9GadUl2FKs7OCLtrPNBMxwZ6j9vIVvyBLYR4dde8i3IrAyGwEf41GG2q7hOM5TL2zlpBlY6HZcKx_erLh_AlqJV8qI8Tn4qQf1" />
<div>
<div className="font-headline-md text-[16px] font-bold text-on-surface">Valorant</div>
<div className="font-caption text-caption text-on-surface-variant">Riot ID: Player#EUW</div>
</div>
</div>
<div className="col-span-1 md:col-span-2 font-body-md text-body-md font-bold text-on-surface">
                        Rp 300.000 <span className="font-caption text-caption text-on-surface-variant font-normal block">2500 VP</span>
</div>
<div className="col-span-1 md:col-span-2 font-body-md text-body-md text-on-surface-variant">
                        23 Okt 2024
                    </div>
<div className="col-span-1 md:col-span-2 flex items-center">
<span className="bg-secondary-container/20 text-secondary px-3 py-1 rounded-full font-label-md text-[12px] flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">schedule</span>
                            Pending
                        </span>
</div>
<div className="col-span-1 md:col-span-2 flex justify-end">
<button className="text-on-surface-variant hover:text-on-surface font-label-md text-label-md flex items-center gap-1 transition-colors">
<span className="material-symbols-outlined text-[18px]">help</span>
<span className="md:hidden">Bantuan</span>
</button>
</div>
</div>
</div>
<div className="p-4 flex justify-center border-t border-outline-variant">
<button className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors">Muat Lebih Banyak</button>
</div>
</div>
</main>

<footer className="bg-surface-container-low dark:bg-inverse-surface border-t border-outline-variant dark:border-outline py-12">
<div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
<div className="font-display-lg text-headline-md font-bold text-on-surface dark:text-inverse-on-surface mb-4 md:mb-0">
                NexusPay
            </div>
<div className="flex gap-6 mb-4 md:mb-0">
<a className="font-body-md text-body-md font-label-md text-label-md text-on-surface-variant dark:text-surface-variant hover:text-secondary-container transition-all opacity-80 hover:opacity-100" href="#">Terms</a>
<a className="font-body-md text-body-md font-label-md text-label-md text-on-surface-variant dark:text-surface-variant hover:text-secondary-container transition-all opacity-80 hover:opacity-100" href="#">Privacy</a>
<a className="font-body-md text-body-md font-label-md text-label-md text-on-surface-variant dark:text-surface-variant hover:text-secondary-container transition-all opacity-80 hover:opacity-100" href="#">Support</a>
</div>
<div className="font-body-md text-body-md text-on-surface-variant">
                © 2024 NexusPay. Premium Gaming Solutions.
            </div>
</div>
</footer>

    </>
  );
}
