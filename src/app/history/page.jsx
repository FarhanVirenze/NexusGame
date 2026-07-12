"use client"
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';

export default function HistoryComponent() {
  const [txList, setTxList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    async function loadHistory() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAuth(false);
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/transactions?user_id=${session.user.id}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      const result = await res.json();

      if (res.ok && result.data) {
        let transactions = result.data;

        // Sync pending transactions with Midtrans to get real status
        const pendingTxs = transactions.filter(tx => tx.status === 'pending');
        if (pendingTxs.length > 0) {
          const syncPromises = pendingTxs.map(async (tx) => {
            try {
              const statusRes = await fetch(`/api/midtrans/status?id=${tx.id}`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
              });
              const statusData = await statusRes.json();
              if (statusRes.ok && statusData.status) {
                return { id: tx.id, newStatus: statusData.status };
              }
            } catch (e) {
              // Ignore sync errors for individual transactions
            }
            return null;
          });
          
          const syncResults = await Promise.all(syncPromises);
          syncResults.forEach(result => {
            if (result) {
              const tx = transactions.find(t => t.id === result.id);
              if (tx) {
                tx.status = result.newStatus;
              }
            }
          });
        }

        setTxList(transactions);
      }

      setLoading(false);
    }
    loadHistory();
  }, []);

  async function handlePay(tx) {
    setPayingId(tx.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/login';
        return;
      }

      const res = await fetch('/api/midtrans/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ orderId: tx.id }),
      });

      const data = await res.json();

      if (res.ok && data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        if (data.expired) {
          if (confirm(data.error || 'Pembayaran kedaluwarsa. Buat pesanan baru?')) {
            window.location.href = `/game/${tx.game_id}`;
          }
        } else {
          alert(data.error || 'Gagal membuat link pembayaran. Silakan coba lagi.');
        }
        setPayingId(null);
      }
    } catch (e) {
      alert('Terjadi kesalahan, coba lagi');
      setPayingId(null);
    }
  }

  const filteredTx = txList.filter(tx => {
    const matchesSearch = searchQuery === '' || 
      (tx.games?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || tx.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: txList.length,
    completed: txList.filter(t => t.status === 'completed').length,
    pending: txList.filter(t => t.status === 'pending').length,
    totalSpent: txList.filter(t => t.status === 'completed').reduce((sum, t) => sum + Number(t.amount), 0),
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col justify-center items-center min-h-[60vh] mt-20">
          <div className="relative flex justify-center items-center">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full w-20 h-20 animate-pulse"></div>
            <div className="w-16 h-16 border-4 border-surface-variant border-t-primary rounded-full animate-spin relative z-10"></div>
            <span className="material-symbols-outlined absolute text-primary z-20 text-2xl animate-pulse">sports_esports</span>
          </div>
          <h2 className="mt-6 font-display-sm text-display-sm text-on-surface tracking-wide">NexusPay</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 animate-pulse">Memuat riwayat pesanan...</p>
        </main>
      </>
    );
  }

  return (
    <>

<Navbar />
<main className="flex-grow w-full mt-20">

{/* Hero */}
<section className="relative w-full overflow-hidden bg-gradient-to-br from-surface via-surface to-primary/5 py-12 md:py-16">
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
  </div>
  <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
      <div>
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full w-fit border border-primary/20 mb-4">
          <span className="material-symbols-outlined text-sm">receipt_long</span>
          <span className="font-label-md text-label-md">Riwayat Transaksi</span>
        </div>
        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-2">Riwayat Pesanan</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Kelola dan pantau semua transaksi top-up game Anda.</p>
      </div>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[18px]">receipt</span>
          </div>
          <span className="font-caption text-caption text-on-surface-variant">Total Pesanan</span>
        </div>
        <span className="font-headline-md text-headline-md text-on-surface">{stats.total}</span>
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-tertiary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
          </div>
          <span className="font-caption text-caption text-on-surface-variant">Berhasil</span>
        </div>
        <span className="font-headline-md text-headline-md text-on-surface">{stats.completed}</span>
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary text-[18px]">schedule</span>
          </div>
          <span className="font-caption text-caption text-on-surface-variant">Pending</span>
        </div>
        <span className="font-headline-md text-headline-md text-on-surface">{stats.pending}</span>
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
          </div>
          <span className="font-caption text-caption text-on-surface-variant">Total Belanja</span>
        </div>
        <span className="font-headline-md text-[18px] font-bold text-on-surface">Rp {stats.totalSpent.toLocaleString('id-ID')}</span>
      </div>
    </div>
  </div>
</section>

{/* Transactions Table */}
<section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
  {/* Controls */}
  <div className="flex flex-col md:flex-row gap-4 mb-6">
    <div className="relative flex-1">
      <span className="material-symbols-outlined absolute left-3.5 top-3 text-on-surface-variant text-[20px]">search</span>
      <input 
        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-11 pr-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all" 
        placeholder="Cari berdasarkan nama game atau ID transaksi..." 
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {['all', 'completed', 'pending', 'expired', 'failed'].map(status => (
        <button 
          key={status}
          onClick={() => setFilterStatus(status)}
          className={`whitespace-nowrap px-4 py-3 rounded-xl font-label-md text-label-md transition-all ${
            filterStatus === status 
              ? 'bg-primary text-on-primary shadow-md shadow-primary/20' 
              : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:border-primary/30'
          }`}
        >
          {status === 'all' ? 'Semua' : status === 'completed' ? 'Berhasil' : status === 'pending' ? 'Pending' : status === 'expired' ? 'Expired' : 'Gagal'}
        </button>
      ))}
    </div>
  </div>

  {/* Table */}
  <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/20 shadow-sm">
    {/* Header */}
    <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-surface-container-low/50 font-label-md text-[11px] text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
      <div className="col-span-4">Game & Detail</div>
      <div className="col-span-2">Nominal</div>
      <div className="col-span-2">Tanggal</div>
      <div className="col-span-2">Status</div>
      <div className="col-span-2 text-right">Aksi</div>
    </div>

    {/* Body */}
    <div className="flex flex-col divide-y divide-outline-variant/15">
      {!isAuth ? (
        <div className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[40px] text-primary">lock</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
            Silakan Login Terlebih Dahulu
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto mb-6">
            Anda perlu masuk ke akun Anda untuk melihat riwayat pesanan.
          </p>
          <a href="/login" className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md hover:bg-primary/90 transition-colors">
            Login Sekarang
          </a>
        </div>
      ) : filteredTx.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined text-[40px] text-on-surface-variant/50">receipt_long</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
            {searchQuery || filterStatus !== 'all' ? 'Tidak Ditemukan' : 'Belum Ada Pesanan'}
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto">
            {searchQuery || filterStatus !== 'all' 
              ? 'Coba ubah kata kunci atau filter pencarian Anda.' 
              : 'Pesanan top-up game Anda akan muncul di sini.'}
          </p>
        </div>
      ) : (
        filteredTx.map(tx => (
          <div key={tx.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-4 md:py-5 items-center hover:bg-primary/[0.02] transition-colors group">
            <div className="col-span-1 md:col-span-4 flex items-center gap-3">
              {tx.games?.image_url ? (
                <img className="w-11 h-11 rounded-xl object-cover ring-2 ring-outline-variant/10" alt={tx.games?.title} src={tx.games.image_url} />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center ring-2 ring-outline-variant/10">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">sports_esports</span>
                </div>
              )}
              <div>
                <div className="font-label-md text-[14px] font-bold text-on-surface group-hover:text-primary transition-colors">{tx.games?.title || 'Unknown Game'}</div>
                <div className="font-caption text-[11px] text-on-surface-variant">#{tx.id.substring(0,8).toUpperCase()}</div>
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <span className="md:hidden font-caption text-caption text-on-surface-variant mr-2">Nominal:</span>
              <span className="font-label-md text-[14px] font-bold text-on-surface">Rp {Number(tx.amount).toLocaleString('id-ID')}</span>
            </div>
            <div className="col-span-1 md:col-span-2 font-body-md text-[13px] text-on-surface-variant">
              <span className="md:hidden font-caption text-caption text-on-surface-variant mr-2">Tanggal:</span>
              {new Date(tx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <div className="col-span-1 md:col-span-2 flex items-center">
              {tx.status === 'completed' && (
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full font-label-md text-[11px]">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Berhasil
                </span>
              )}
              {tx.status === 'pending' && (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full font-label-md text-[11px]">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span> Pending
                </span>
              )}
              {tx.status === 'expired' && (
                <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1 rounded-full font-label-md text-[11px]">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span> Expired
                </span>
              )}
              {tx.status === 'failed' && (
                <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full font-label-md text-[11px]">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Gagal
                </span>
              )}
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-start md:justify-end gap-2">
              {tx.status === 'pending' && (
                <button
                  onClick={() => handlePay(tx)}
                  disabled={payingId === tx.id}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-label-md text-[11px]"
                  title="Lanjutkan Pembayaran"
                >
                  {payingId === tx.id ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <span className="material-symbols-outlined text-[16px]">payments</span>
                  )}
                  <span className="hidden sm:inline">{payingId === tx.id ? 'Memproses...' : 'Bayar'}</span>
                </button>
              )}
              {tx.status === 'completed' && (
                <a
                  href={`/invoice?id=${tx.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-lg transition-colors flex items-center gap-1"
                  title="Download Invoice"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span className="text-[11px] font-label-md hidden sm:inline">Invoice</span>
                </a>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  </div>

  {/* Pagination Info */}
  {filteredTx.length > 0 && (
    <div className="mt-4 flex justify-between items-center">
      <span className="font-caption text-caption text-on-surface-variant">
        Menampilkan {filteredTx.length} dari {txList.length} transaksi
      </span>
    </div>
  )}
</section>
</main>

<Footer />

    </>
  );
}
