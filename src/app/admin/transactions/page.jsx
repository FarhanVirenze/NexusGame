
import React from 'react';

export default function TransactionsComponent() {
  return (
    <>
      

<header className="bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm docked full-width top-0 z-50">
<div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto h-20">
<div className="font-display-lg text-display-lg font-extrabold text-primary tracking-tight">
                NexusPay
            </div>
<nav className="hidden md:flex gap-gutter items-center">
<a className="text-on-surface-variant font-medium hover:text-primary transition-all duration-200" href="#">Explore</a>
<a className="text-on-surface-variant font-medium hover:text-primary transition-all duration-200" href="#">Top-Up</a>
<a className="text-on-surface-variant font-medium hover:text-primary transition-all duration-200" href="#">Promotions</a>
<a className="text-on-surface-variant font-medium hover:text-primary transition-all duration-200" href="#">Support</a>
</nav>
<div className="flex items-center gap-4">
<button className="font-label-md text-label-md text-primary font-medium hover:text-primary-container transition-colors">Sign In</button>
<button className="font-label-md text-label-md bg-primary text-on-primary px-4 py-2 rounded-full shadow-sm hover:scale-95 transition-transform">Sign Up</button>
</div>
</div>
</header>
<div className="flex flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 gap-gutter">

<aside className="hidden lg:block w-64 flex-shrink-0">
<div className="glass-panel rounded-xl p-4 sticky top-28">
<div className="font-headline-md text-headline-md text-on-surface mb-6">Admin Panel</div>
<nav className="flex flex-col gap-2">
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant font-medium hover:bg-surface-container hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined" >dashboard</span>
                        Dashboard
                    </a>

<a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-container text-primary font-bold shadow-[inset_4px_0_0_0_#006591]" href="#">
<span className="material-symbols-outlined" >receipt_long</span>
                        Transactions
                    </a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant font-medium hover:bg-surface-container hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined" >group</span>
                        Users
                    </a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant font-medium hover:bg-surface-container hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined" >settings</span>
                        Settings
                    </a>
</nav>
</div>
</aside>

<main className="flex-1 flex flex-col min-w-0">
<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
<div>
<h1 className="font-headline-lg text-headline-lg text-on-surface">Transaction Management</h1>
<p className="text-on-surface-variant mt-1">Review and manage all player microtransactions.</p>
</div>
<button className="flex items-center gap-2 bg-white border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors shadow-sm">
<span className="material-symbols-outlined text-[18px]">download</span>
                    Export CSV
                </button>
</div>

<div className="glass-panel rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
<div className="relative w-full md:w-96">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body-md text-body-md" placeholder="Search by Order ID or Player ID..." type="text"/>
</div>
<div className="flex flex-wrap w-full md:w-auto gap-4 items-center">
<div className="relative">
<select className="appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg pl-4 pr-10 py-2 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary">
<option value="">All Statuses</option>
<option value="success">Success</option>
<option value="pending">Pending</option>
<option value="failed">Failed</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
</div>
<div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2">
<span className="material-symbols-outlined text-outline text-[20px]">calendar_today</span>
<input className="bg-transparent border-none p-0 font-body-md text-body-md focus:ring-0 text-on-surface" type="date"/>
<span className="text-outline-variant mx-1">-</span>
<input className="bg-transparent border-none p-0 font-body-md text-body-md focus:ring-0 text-on-surface" type="date"/>
</div>
</div>
</div>

<div className="glass-panel rounded-xl overflow-hidden flex-1 flex flex-col">
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="border-b border-outline-variant bg-surface-container-lowest/50">
<th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Order ID</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Game</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Player ID</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Amount</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Payment</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Date</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Action</th>
</tr>
</thead>
<tbody className="font-body-md text-body-md">

<tr className="border-b border-surface-dim table-row-hover">
<td className="p-4 font-medium text-on-surface">#NX-88392</td>
<td className="p-4 text-on-surface-variant">Valorant</td>
<td className="p-4 text-on-surface-variant">PL-9921</td>
<td className="p-4 font-semibold text-on-surface">$24.99</td>
<td className="p-4 text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">credit_card</span> CC ending 4242
                                </td>
<td className="p-4">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e6f4ea] text-[#137333]">
<span className="w-1.5 h-1.5 rounded-full bg-[#137333]"></span> Success
                                    </span>
</td>
<td className="p-4 text-on-surface-variant text-sm">Oct 24, 14:32</td>
<td className="p-4 text-right">
<button className="text-outline hover:text-primary transition-colors" title="View Details">
<span className="material-symbols-outlined">visibility</span>
</button>
</td>
</tr>

<tr className="border-b border-surface-dim table-row-hover">
<td className="p-4 font-medium text-on-surface">#NX-88391</td>
<td className="p-4 text-on-surface-variant">League of Legends</td>
<td className="p-4 text-on-surface-variant">PL-1042</td>
<td className="p-4 font-semibold text-on-surface">$9.99</td>
<td className="p-4 text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">account_balance_wallet</span> PayPal
                                </td>
<td className="p-4">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fef7e0] text-[#b06000]">
<span className="w-1.5 h-1.5 rounded-full bg-[#b06000]"></span> Pending
                                    </span>
</td>
<td className="p-4 text-on-surface-variant text-sm">Oct 24, 14:15</td>
<td className="p-4 text-right">
<button className="text-outline hover:text-primary transition-colors" title="View Details">
<span className="material-symbols-outlined">visibility</span>
</button>
</td>
</tr>

<tr className="border-b border-surface-dim table-row-hover">
<td className="p-4 font-medium text-on-surface">#NX-88390</td>
<td className="p-4 text-on-surface-variant">Apex Legends</td>
<td className="p-4 text-on-surface-variant">PL-5510</td>
<td className="p-4 font-semibold text-on-surface">$49.99</td>
<td className="p-4 text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">credit_card</span> CC ending 1123
                                </td>
<td className="p-4">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fce8e6] text-[#c5221f]">
<span className="w-1.5 h-1.5 rounded-full bg-[#c5221f]"></span> Failed
                                    </span>
</td>
<td className="p-4 text-on-surface-variant text-sm">Oct 24, 13:50</td>
<td className="p-4 text-right">
<button className="text-outline hover:text-primary transition-colors" title="View Details">
<span className="material-symbols-outlined">visibility</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>

<div className="p-4 border-t border-outline-variant bg-surface-container-lowest/50 flex items-center justify-between mt-auto">
<div className="text-sm text-on-surface-variant">
                        Showing <span className="font-medium text-on-surface">1</span> to <span className="font-medium text-on-surface">3</span> of <span className="font-medium text-on-surface">1,240</span> results
                    </div>
<div className="flex gap-2">
<button className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container disabled:opacity-50" disabled="">Previous</button>
<button className="px-3 py-1 rounded bg-primary text-on-primary font-medium">1</button>
<button className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">2</button>
<button className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">3</button>
<button className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">Next</button>
</div>
</div>
</div>
</main>
</div>

<footer className="bg-surface-container-low border-t border-outline-variant mt-auto">
<div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-desktop py-12 max-w-container-max mx-auto gap-gutter">
<div className="font-headline-md text-headline-md font-bold text-on-surface">NexusPay</div>
<div className="flex flex-wrap gap-4 justify-center">
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Refund Policy</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Contact Support</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">About Us</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Partners</a>
</div>
<div className="font-caption text-caption text-on-surface-variant">© 2024 NexusPay. All rights reserved. High-performance gaming transactions.</div>
</div>
</footer>

    </>
  );
}
