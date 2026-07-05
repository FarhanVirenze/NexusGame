"use client"
import React, { useEffect, useState, useMemo } from 'react';

export default function TransactionsComponent() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // DataTable state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch('/api/admin/data?table=transactions');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        setTransactions(data || []);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  // Derived computed data
  const filtered = useMemo(() => {
    let result = [...transactions];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(tx => tx.status === statusFilter);
    }

    // Search — match id, game title, user email, amount
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(tx =>
        tx.id?.toLowerCase().includes(q) ||
        tx.games?.title?.toLowerCase().includes(q) ||
        tx.users?.email?.toLowerCase().includes(q) ||
        String(tx.amount).includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA, valB;
      if (sortField === 'amount') {
        valA = Number(a.amount || 0);
        valB = Number(b.amount || 0);
      } else if (sortField === 'created_at') {
        valA = new Date(a.created_at).getTime();
        valB = new Date(b.created_at).getTime();
      } else if (sortField === 'status') {
        valA = a.status || '';
        valB = b.status || '';
      } else {
        valA = a[sortField] || '';
        valB = b[sortField] || '';
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="material-symbols-outlined text-[14px] ml-1 opacity-30">unfold_more</span>;
    return <span className="material-symbols-outlined text-[14px] ml-1 text-primary">{sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>;
  };

  // Summary stats
  const totalAmount = transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  const successCount = transactions.filter(tx => tx.status === 'completed').length;
  const pendingCount = transactions.filter(tx => tx.status === 'pending').length;

  return (
    <>
      <main className="flex-1 flex flex-col min-h-screen transition-all duration-300 bg-background relative overflow-y-auto">
        <div className="p-6 md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-8 pb-24 mt-4">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">Transaction Management</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Review and manage all player microtransactions.</p>
            </div>
            <button className="flex items-center gap-2 bg-white border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export CSV
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-xl flex items-center gap-4 border border-outline-variant/50">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
              <div>
                <div className="font-label-md text-label-md text-on-surface-variant mb-1">Total Volume</div>
                <div className="font-headline-md text-headline-md text-on-surface">
                  {loading ? '...' : `Rp ${totalAmount.toLocaleString('id-ID')}`}
                </div>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-xl flex items-center gap-4 border border-outline-variant/50">
              <div className="w-12 h-12 rounded-full bg-[#e6f4ea] text-[#137333] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <div>
                <div className="font-label-md text-label-md text-on-surface-variant mb-1">Successful</div>
                <div className="font-headline-md text-headline-md text-on-surface">{loading ? '...' : successCount}</div>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-xl flex items-center gap-4 border border-outline-variant/50">
              <div className="w-12 h-12 rounded-full bg-[#fef7e0] text-[#b06000] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">pending_actions</span>
              </div>
              <div>
                <div className="font-label-md text-label-md text-on-surface-variant mb-1">Pending</div>
                <div className="font-headline-md text-headline-md text-on-surface">{loading ? '...' : pendingCount}</div>
              </div>
            </div>
          </div>

          {/* DataTable Controls */}
          <div className="glass-panel rounded-xl overflow-hidden flex-1 flex flex-col">
            <div className="p-4 border-b border-outline-variant/30 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-surface-container-lowest/30">
              <div className="relative flex-1 w-full sm:max-w-sm">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                <input
                  type="text"
                  placeholder="Search by ID, game, user, amount..."
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface text-sm"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  className="bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2.5 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <div className="text-sm text-on-surface-variant whitespace-nowrap">
                  {filtered.length} result{filtered.length !== 1 && 's'}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-lowest/50">
                    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Transaction ID</th>
                    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider cursor-pointer select-none hover:text-primary transition-colors" onClick={() => toggleSort('game')}>
                      <span className="inline-flex items-center">Game<SortIcon field="game" /></span>
                    </th>
                    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">User Email</th>
                    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider cursor-pointer select-none hover:text-primary transition-colors" onClick={() => toggleSort('amount')}>
                      <span className="inline-flex items-center">Amount<SortIcon field="amount" /></span>
                    </th>
                    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider cursor-pointer select-none hover:text-primary transition-colors" onClick={() => toggleSort('status')}>
                      <span className="inline-flex items-center">Status<SortIcon field="status" /></span>
                    </th>
                    <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider cursor-pointer select-none hover:text-primary transition-colors" onClick={() => toggleSort('created_at')}>
                      <span className="inline-flex items-center">Date<SortIcon field="created_at" /></span>
                    </th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
                        <p className="mt-3">Loading transactions...</p>
                      </td>
                    </tr>
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                        <p className="mt-2">{searchQuery || statusFilter !== 'all' ? 'No transactions match your filters.' : 'No transactions found.'}</p>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((tx) => (
                      <tr key={tx.id} className="border-b border-surface-dim hover:bg-surface-container-lowest/50 transition-colors">
                        <td className="p-4 font-medium text-on-surface font-mono text-sm">
                          {tx.id.substring(0, 8)}...
                        </td>
                        <td className="p-4 text-on-surface-variant">{tx.games?.title || 'Unknown Game'}</td>
                        <td className="p-4 text-on-surface-variant">{tx.users?.email || 'Unknown User'}</td>
                        <td className="p-4 font-semibold text-on-surface">
                          Rp {Number(tx.amount || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="p-4">
                          {tx.status === 'completed' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e6f4ea] text-[#137333]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#137333]"></span> Success
                            </span>
                          ) : tx.status === 'failed' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fce8e6] text-[#c5221f]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#c5221f]"></span> Failed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fef7e0] text-[#b06000]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#b06000]"></span> Pending
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-on-surface-variant text-sm">
                          {new Date(tx.created_at).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && totalPages > 0 && (
              <div className="p-4 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-container-lowest/30">
                <div className="font-caption text-caption text-on-surface-variant">
                  Showing {Math.min((currentPage - 1) * perPage + 1, filtered.length)}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} transactions
                </div>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">first_page</span>
                  </button>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === '...' ? (
                        <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-on-surface-variant text-sm">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                            currentPage === p
                              ? 'bg-primary text-on-primary'
                              : 'text-on-surface-variant hover:bg-surface-container'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">last_page</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
