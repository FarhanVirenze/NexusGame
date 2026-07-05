import React from 'react';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function AdminComponent() {
  // Fetch real data from Supabase
  const [{ count: totalUsers }, { data: allTransactions }, { data: recentTransactions }] = await Promise.all([
    supabaseServer.from('users').select('*', { count: 'exact', head: true }),
    supabaseServer.from('transactions').select('amount, status'),
    supabaseServer.from('transactions')
      .select('*, games(title, image_url), users(email, first_name)')
      .order('created_at', { ascending: false })
      .limit(5)
  ]);

  // Calculate metrics
  let totalRevenue = 0;
  let successCount = 0;
  let pendingOrders = 0;

  if (allTransactions) {
    allTransactions.forEach(tx => {
      if (tx.status === 'completed' || tx.status === 'success') {
        totalRevenue += Number(tx.amount || 0);
        successCount++;
      }
      if (tx.status === 'pending') {
        pendingOrders++;
      }
    });
  }

  const totalTx = allTransactions?.length || 0;
  const successRate = totalTx > 0 ? ((successCount / totalTx) * 100).toFixed(1) : 0;

  return (
    <>

      
      <main className="flex-1 flex flex-col min-h-screen transition-all duration-300 bg-background relative overflow-y-auto">
        <div className="p-6 md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-8 pb-24 mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Overview</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Real-time metrics for NexusPay ecosystem.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a href="/admin/games" className="bg-primary bg-gradient-to-r from-primary to-[#0080b8] text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-xl shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
                New Game
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-container/20 rounded-full blur-2xl group-hover:bg-primary-container/30 transition-colors"></div>
              <div className="flex justify-between items-start z-10">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" data-icon="payments">payments</span>
                </div>
              </div>
              <div className="z-10">
                <p className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mb-1">Total Revenue</p>
                <h3 className="font-display-lg text-[32px] md:text-[40px] text-on-surface font-extrabold tracking-tight">
                  Rp {totalRevenue.toLocaleString('id-ID')}
                </h3>
              </div>
              <div className="h-10 w-full flex items-end gap-1 mt-2 z-10 opacity-70">
                <div className="w-full bg-primary/20 h-[20%] rounded-t-sm"></div>
                <div className="w-full bg-primary/30 h-[40%] rounded-t-sm"></div>
                <div className="w-full bg-primary/20 h-[30%] rounded-t-sm"></div>
                <div className="w-full bg-primary/40 h-[60%] rounded-t-sm"></div>
                <div className="w-full bg-primary/50 h-[50%] rounded-t-sm"></div>
                <div className="w-full bg-primary/40 h-[70%] rounded-t-sm"></div>
                <div className="w-full bg-primary/70 h-[90%] rounded-t-sm"></div>
                <div className="w-full bg-primary h-[100%] rounded-t-sm"></div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-tertiary-container/20 rounded-full blur-2xl group-hover:bg-tertiary-container/30 transition-colors"></div>
              <div className="flex justify-between items-start z-10">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary" data-icon="group">group</span>
                </div>
              </div>
              <div className="z-10">
                <p className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mb-1">Total Users</p>
                <h3 className="font-display-lg text-[32px] md:text-[40px] text-on-surface font-extrabold tracking-tight">{totalUsers}</h3>
              </div>
              <div className="h-10 w-full flex items-end gap-1 mt-2 z-10 opacity-70">
                <div className="w-full bg-tertiary/30 h-[30%] rounded-t-sm"></div>
                <div className="w-full bg-tertiary/40 h-[50%] rounded-t-sm"></div>
                <div className="w-full bg-tertiary/30 h-[40%] rounded-t-sm"></div>
                <div className="w-full bg-tertiary/50 h-[70%] rounded-t-sm"></div>
                <div className="w-full bg-tertiary/40 h-[60%] rounded-t-sm"></div>
                <div className="w-full bg-tertiary/60 h-[80%] rounded-t-sm"></div>
                <div className="w-full bg-tertiary/70 h-[90%] rounded-t-sm"></div>
                <div className="w-full bg-tertiary h-[100%] rounded-t-sm"></div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary-container/20 rounded-full blur-2xl group-hover:bg-secondary-container/30 transition-colors"></div>
              <div className="flex justify-between items-start z-10">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary" data-icon="task_alt">task_alt</span>
                </div>
              </div>
              <div className="z-10">
                <p className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mb-1">Success Rate</p>
                <h3 className="font-display-lg text-[32px] md:text-[40px] text-on-surface font-extrabold tracking-tight">{successRate}%</h3>
              </div>
              <div className="h-10 w-full flex items-end gap-1 mt-2 z-10 opacity-70">
                <div className="w-full bg-secondary/80 h-[95%] rounded-t-sm"></div>
                <div className="w-full bg-secondary/90 h-[98%] rounded-t-sm"></div>
                <div className="w-full bg-secondary/80 h-[96%] rounded-t-sm"></div>
                <div className="w-full bg-secondary/90 h-[99%] rounded-t-sm"></div>
                <div className="w-full bg-secondary/80 h-[97%] rounded-t-sm"></div>
                <div className="w-full bg-secondary/90 h-[98%] rounded-t-sm"></div>
                <div className="w-full bg-secondary/80 h-[99%] rounded-t-sm"></div>
                <div className="w-full bg-secondary h-[100%] rounded-t-sm"></div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-error-container/20 rounded-full blur-2xl group-hover:bg-error-container/30 transition-colors"></div>
              <div className="flex justify-between items-start z-10">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-error" data-icon="pending_actions">pending_actions</span>
                </div>
              </div>
              <div className="z-10">
                <p className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mb-1">Pending Orders</p>
                <h3 className="font-display-lg text-[32px] md:text-[40px] text-on-surface font-extrabold tracking-tight">{pendingOrders}</h3>
              </div>
              <div className="h-10 w-full flex items-end gap-1 mt-2 z-10 opacity-70">
                <div className="w-full bg-error/20 h-[10%] rounded-t-sm"></div>
                <div className="w-full bg-error/10 h-[5%] rounded-t-sm"></div>
                <div className="w-full bg-error/30 h-[15%] rounded-t-sm"></div>
                <div className="w-full bg-error/20 h-[10%] rounded-t-sm"></div>
                <div className="w-full bg-error/40 h-[20%] rounded-t-sm"></div>
                <div className="w-full bg-error/30 h-[15%] rounded-t-sm"></div>
                <div className="w-full bg-error/50 h-[25%] rounded-t-sm"></div>
                <div className="w-full bg-error/80 h-[40%] rounded-t-sm"></div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl flex flex-col overflow-hidden mt-4">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest/50">
              <h3 className="font-headline-md text-headline-md-mobile md:text-headline-md text-on-surface">Recent Transactions</h3>
              <a href="/admin/transactions" className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors flex items-center gap-1">
                View All <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="py-4 px-6 font-caption text-caption text-on-surface-variant uppercase tracking-wider">Order ID</th>
                    <th className="py-4 px-6 font-caption text-caption text-on-surface-variant uppercase tracking-wider">Game</th>
                    <th className="py-4 px-6 font-caption text-caption text-on-surface-variant uppercase tracking-wider">User</th>
                    <th className="py-4 px-6 font-caption text-caption text-on-surface-variant uppercase tracking-wider text-right">Amount</th>
                    <th className="py-4 px-6 font-caption text-caption text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                    <th className="py-4 px-6 font-caption text-caption text-on-surface-variant uppercase tracking-wider text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 bg-surface-container-lowest/30">
                  {recentTransactions && recentTransactions.length > 0 ? (
                    recentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="py-4 px-6 font-label-md text-label-md text-on-surface">
                          #{tx.id.split('-')[0].toUpperCase()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md bg-surface-variant flex items-center justify-center shrink-0 border border-outline-variant/30 overflow-hidden">
                              {tx.games?.image_url ? (
                                <img src={tx.games.image_url} alt={tx.games?.title} className="w-full h-full object-cover" />
                              ) : (
                                <span className="material-symbols-outlined text-on-surface-variant text-sm">sports_esports</span>
                              )}
                            </div>
                            <span className="font-body-md text-body-md font-medium text-on-surface whitespace-nowrap">
                              {tx.games?.title || 'Unknown Game'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">
                          {tx.users?.email || 'Unknown User'}
                        </td>
                        <td className="py-4 px-6 font-label-md text-label-md text-on-surface text-right">
                          Rp {Number(tx.amount || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                            ${tx.status === 'completed' || tx.status === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 
                              tx.status === 'failed' ? 'bg-red-100 text-red-800 border border-red-200' : 
                              'bg-amber-100 text-amber-800 border border-amber-200'}`}
                          >
                            {tx.status || 'Pending'}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-caption text-caption text-on-surface-variant text-right whitespace-nowrap">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 px-6 text-center text-on-surface-variant font-body-md">
                        Belum ada transaksi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
