
import React from 'react';

export default function UsersComponent() {
  return (
    <>
      

<nav className="bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm sticky top-0 z-50">
<div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-20">

<a className="font-display-lg text-display-lg font-extrabold text-primary tracking-tight" href="#">
                NexusPay
            </a>

<div className="hidden md:flex items-center gap-gutter">
<a className="font-label-md text-label-md text-on-surface-variant font-medium hover:text-primary transition-all duration-200" href="#">Dashboard</a>
<a className="font-label-md text-label-md text-primary font-bold border-b-2 border-primary pb-1" href="#">Users</a>
<a className="font-label-md text-label-md text-on-surface-variant font-medium hover:text-primary transition-all duration-200" href="#">Transactions</a>
<a className="font-label-md text-label-md text-on-surface-variant font-medium hover:text-primary transition-all duration-200" href="#">Settings</a>
</div>

<div className="hidden md:flex items-center gap-4">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" >search</span>
<input className="bg-surface-container-low border border-outline-variant rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface w-64 placeholder:text-outline-variant transition-all" placeholder="Search..." type="text"/>
</div>
<button className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
<img alt="Admin Profile" className="w-full h-full object-cover" data-alt="A small circular avatar of an administrator with short dark hair, wearing glasses and a crisp white shirt, set against a bright, airy background in a light-mode aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpsb_YF4tMCjqSrYbJYHW9HyuP1WpavdHbAwR3BQDzaj8dCA5_WEDHdD4Dh3r7J34mBLHTQLPo8pOugxh1JEHAAFgHLcpbiGH68297wkel0FoeWTAvjNd2tRdm5xI0w6M0Fa-gzMrCs7P1VprNvtl03QjHUw-x390FCs-b2W_DxWpr910nA0li3zKlqbidrVTj9C8snWTliHaIXl8AOR85r87yj9XRqbyXcntcWpw4fTYaXJVkwLegq5jLz8yDSRl_vSyKargQ1dD4"/>
</button>
</div>

<button className="md:hidden text-on-surface p-2">
<span className="material-symbols-outlined" >menu</span>
</button>
</div>
</nav>

<main className="flex-grow w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-12 flex flex-col gap-8">

<header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">User Management</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Review and manage registered user accounts.</p>
</div>

<div className="flex gap-4 items-center">
<button className="glass-panel px-4 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-primary flex items-center gap-2 transition-colors">
<span className="material-symbols-outlined text-[18px]" >filter_list</span>
                    Filter
                </button>
<button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2 rounded-lg font-label-md text-label-md shadow-[0_4px_14px_0_rgba(0,101,145,0.39)] hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(0,101,145,0.23)] transition-all flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]" >person_add</span>
                    Add User
                </button>
</div>
</header>

<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="glass-panel rounded-xl p-6 flex flex-col gap-2">
<div className="flex items-center gap-2 text-on-surface-variant mb-1">
<span className="material-symbols-outlined text-primary" >group</span>
<span className="font-label-md text-label-md">Total Users</span>
</div>
<div className="font-headline-lg text-headline-lg text-on-surface">14,209</div>
<div className="font-caption text-caption text-secondary flex items-center gap-1 mt-1">
<span className="material-symbols-outlined text-[14px]" >trending_up</span>
                    +12% this month
                </div>
</div>
<div className="glass-panel rounded-xl p-6 flex flex-col gap-2">
<div className="flex items-center gap-2 text-on-surface-variant mb-1">
<span className="material-symbols-outlined text-tertiary" >account_balance_wallet</span>
<span className="font-label-md text-label-md">Active Buyers</span>
</div>
<div className="font-headline-lg text-headline-lg text-on-surface">8,432</div>
<div className="font-caption text-caption text-outline mt-1">
                    Users with &gt;1 transaction
                </div>
</div>
<div className="glass-panel rounded-xl p-6 flex flex-col gap-2">
<div className="flex items-center gap-2 text-on-surface-variant mb-1">
<span className="material-symbols-outlined text-error" >warning</span>
<span className="font-label-md text-label-md">Restricted Accounts</span>
</div>
<div className="font-headline-lg text-headline-lg text-on-surface">124</div>
<div className="font-caption text-caption text-outline mt-1">
                    Requires review
                </div>
</div>
</section>

<section className="glass-panel rounded-xl overflow-hidden flex flex-col">
<div className="overflow-x-auto w-full">
<table className="w-full text-left border-collapse min-w-[800px]">
<thead>
<tr className="bg-surface-container-high border-b border-outline-variant">
<th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">User</th>
<th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
<th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Spent</th>
<th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Join Date</th>
<th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody className="font-body-md text-body-md text-on-surface">

<tr className="zebra-row border-b border-outline-variant/30 hover:bg-surface-variant/50 transition-colors group">
<td className="py-4 px-6">
<div className="flex items-center gap-4">
<img alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-outline-variant" data-alt="A portrait of a young professional gamer with short spiky hair and neon accent lighting, wearing a stylish esports jersey, bright light mode background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkFuSzlZLKQ7c4HhpPmPmJIhGeP8F6NVuw8nSmJxP9OJPxWxta9t09T2q9ImNsuYlCTfz-j5csy6KiTIDDWdgywoWgOFx9MazEy0yvtAGWunooPv_oXYpJfngM9htzlt0MseZvMu4yiNUgVqmmNPXRssJa5lOpRJ9hcn-yEI6mKOzjSQIeMS9-H9Jpqal9wxeS5NZ0vIIUNpRXiiyuQygxhRXhvnLGDmQ7wAijJ42W0_B4P2bZ7DjV22pR63W4AVDQQoO5uqz3VuYg"/>
<div>
<div className="font-semibold text-on-surface">AlexChen_99</div>
<div className="font-caption text-caption text-on-surface-variant">alex.chen@example.com</div>
</div>
</div>
</td>
<td className="py-4 px-6">
<span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full bg-primary-fixed text-on-primary-fixed text-[12px] font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                    Active
                                </span>
</td>
<td className="py-4 px-6 font-medium text-secondary-container">
                                $1,245.50
                            </td>
<td className="py-4 px-6 text-on-surface-variant">
                                Oct 12, 2023
                            </td>
<td className="py-4 px-6 text-right">
<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-on-surface-variant hover:text-primary bg-white rounded-lg border border-outline-variant hover:border-primary transition-colors tooltip-trigger" title="View Details">
<span className="material-symbols-outlined text-[20px]" >visibility</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-error bg-white rounded-lg border border-outline-variant hover:border-error transition-colors tooltip-trigger" title="Restrict Account">
<span className="material-symbols-outlined text-[20px]" >block</span>
</button>
</div>
</td>
</tr>

<tr className="zebra-row border-b border-outline-variant/30 hover:bg-surface-variant/50 transition-colors group">
<td className="py-4 px-6">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-bold text-lg border border-outline-variant">S</div>
<div>
<div className="font-semibold text-on-surface">SarahViper</div>
<div className="font-caption text-caption text-on-surface-variant">s.viper@example.com</div>
</div>
</div>
</td>
<td className="py-4 px-6">
<span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full bg-primary-fixed text-on-primary-fixed text-[12px] font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                    Active
                                </span>
</td>
<td className="py-4 px-6 font-medium text-secondary-container">
                                $890.00
                            </td>
<td className="py-4 px-6 text-on-surface-variant">
                                Nov 05, 2023
                            </td>
<td className="py-4 px-6 text-right">
<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-on-surface-variant hover:text-primary bg-white rounded-lg border border-outline-variant hover:border-primary transition-colors" title="View Details">
<span className="material-symbols-outlined text-[20px]" >visibility</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-error bg-white rounded-lg border border-outline-variant hover:border-error transition-colors" title="Restrict Account">
<span className="material-symbols-outlined text-[20px]" >block</span>
</button>
</div>
</td>
</tr>

<tr className="zebra-row border-b border-outline-variant/30 hover:bg-surface-variant/50 transition-colors group">
<td className="py-4 px-6">
<div className="flex items-center gap-4">
<img alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-outline-variant" data-alt="A casual portrait of a male user wearing a headset, smiling slightly, well-lit studio environment, light aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOQD0TmfhL-gTJ3PvmxVKnQcWElEX6BXw6LmXlNHn-sCe3hFGWCQ2GdgAftSYiyD75HFjZkoSM-b3WIY8Sfkk1haBs8bgnmz5P3WSatkwNCBAYMdE35deK-V7OioR4ve7sC6LBFD3xd0k9pYxJGzNaprNIJHEejeYyRdIX--gqXYMI7F2DfXK79kD1t3A_fxeYlNhY7yAkIFJzvgDLejQx6a_I082dFE0scq4SBy6a2Cp1Gxr8xe_3gd9xjkjBBmoD7-63qqMsRl0f"/>
<div>
<div className="font-semibold text-on-surface">xX_NoobSlayer_Xx</div>
<div className="font-caption text-caption text-on-surface-variant">noobslayer@example.com</div>
</div>
</div>
</td>
<td className="py-4 px-6">
<span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full bg-error-container text-on-error-container text-[12px] font-semibold border border-error/20">
<span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                    Restricted
                                </span>
</td>
<td className="py-4 px-6 font-medium text-secondary-container">
                                $12.50
                            </td>
<td className="py-4 px-6 text-on-surface-variant">
                                Jan 15, 2024
                            </td>
<td className="py-4 px-6 text-right">
<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-on-surface-variant hover:text-primary bg-white rounded-lg border border-outline-variant hover:border-primary transition-colors" title="View Details">
<span className="material-symbols-outlined text-[20px]" >visibility</span>
</button>
<button className="p-2 text-error hover:text-on-error hover:bg-error bg-error-container rounded-lg border border-error/30 transition-colors" title="Unrestrict Account">
<span className="material-symbols-outlined text-[20px]" >lock_open</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>

<div className="p-4 border-t border-outline-variant flex items-center justify-between bg-surface-container-lowest">
<div className="font-caption text-caption text-on-surface-variant">
                    Showing 1 to 3 of 14,209 results
                </div>
<div className="flex gap-2">
<button className="p-2 rounded-lg border border-outline-variant text-outline hover:bg-surface-variant transition-colors disabled:opacity-50" disabled="">
<span className="material-symbols-outlined text-[20px]" >chevron_left</span>
</button>
<button className="p-2 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-variant transition-colors">
<span className="material-symbols-outlined text-[20px]" >chevron_right</span>
</button>
</div>
</div>
</section>
</main>

<footer className="bg-surface-container-low dark:bg-inverse-surface border-t border-outline-variant mt-auto">
<div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-desktop py-12 max-w-container-max mx-auto gap-gutter">
<div className="flex flex-col gap-4">
<span className="font-headline-md text-headline-md font-bold text-on-surface dark:text-inverse-on-surface">
                    NexusPay
                </span>
<p className="font-body-md text-body-md text-on-surface-variant">
                    © 2024 NexusPay. All rights reserved. High-performance gaming transactions.
                </p>
</div>
<div className="flex flex-wrap gap-4 font-label-md text-label-md">
<a className="text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Terms of Service</a>
<a className="text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Privacy Policy</a>
<a className="text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Refund Policy</a>
<a className="text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Contact Support</a>
<a className="text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">About Us</a>
<a className="text-on-surface-variant hover:text-primary transition-colors focus:ring-2 focus:ring-primary rounded" href="#">Partners</a>
</div>
</div>
</footer>

    </>
  );
}
