"use client"
import React, { useEffect, useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSearchParams } from 'next/navigation';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('id');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    async function fetchAndSync() {
      if (!transactionId) {
        setLoading(false);
        return;
      }

      try {
        // 1. First, sync the real status from Midtrans
        setSyncing(true);
        const statusRes = await fetch(`/api/midtrans/status?id=${transactionId}`);
        const statusData = await statusRes.json();
        setSyncing(false);

        // 2. Then fetch the transaction details from our DB (now updated)
        const res = await fetch(`/api/transactions?id=${transactionId}`);
        const result = await res.json();
          
        if (res.ok && result.data) {
          const data = result.data;
          // Use the Midtrans-synced status if available
          const currentStatus = statusData?.status || data.status;
          
          setOrderData({
            invoiceId: data.id.split('-')[0].toUpperCase() + '-' + data.id.split('-')[4].substring(0, 6).toUpperCase(),
            gameTitle: data.games?.title || 'Unknown Game',
            amount: data.amount,
            status: currentStatus,
            date: new Date(data.created_at).toLocaleString('id-ID'),
            paidAt: statusData?.paid_at ? new Date(statusData.paid_at).toLocaleString('id-ID') : null,
            paymentMethod: statusData?.payment_method || null,
          });
        }
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAndSync();
  }, [transactionId]);

  const isCompleted = orderData?.status === 'completed';
  const isPending = orderData?.status === 'pending';

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col justify-center items-center min-h-[80vh] mt-20">
          <div className="relative flex justify-center items-center">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full w-20 h-20 animate-pulse"></div>
            <div className="w-16 h-16 border-4 border-surface-variant border-t-primary rounded-full animate-spin relative z-10"></div>
            <span className="material-symbols-outlined absolute text-primary z-20 text-2xl animate-pulse">sports_esports</span>
          </div>
          <h2 className="mt-6 font-display-sm text-display-sm text-on-surface tracking-wide">NexusPay</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 animate-pulse">{syncing ? 'Mengecek status pembayaran...' : 'Memuat pesanan...'}</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!orderData) {
    return (
      <>
        <Navbar />
        <main className="flex-grow w-full max-w-container-max mx-auto flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center gap-4 text-error">
            <span className="material-symbols-outlined text-6xl">error</span>
            <p className="font-body-lg">Pesanan tidak ditemukan atau link tidak valid.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 mt-20 flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-lg glass-panel rounded-2xl p-8 md:p-10 ambient-shadow-primary text-center space-y-6">
          {/* Status Animation */}
          <div className="relative mx-auto w-20 h-20">
            {isCompleted ? (
              <>
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                  <span className="material-symbols-outlined text-white text-4xl">check</span>
                </div>
              </>
            ) : isPending ? (
              <>
                <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <span className="material-symbols-outlined text-white text-4xl">schedule</span>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                  <span className="material-symbols-outlined text-white text-4xl">close</span>
                </div>
              </>
            )}
          </div>

          <div>
            <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface mb-2">
              {isCompleted ? 'Pembayaran Berhasil! 🎉' : isPending ? 'Menunggu Pembayaran ⏳' : 'Pembayaran Gagal ❌'}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {isCompleted 
                ? 'Pembayaran kamu telah diterima dan pesanan sedang diproses.' 
                : isPending 
                  ? 'Pesanan kamu sedang menunggu pembayaran. Silakan selesaikan pembayaran.'
                  : 'Pembayaran gagal atau sudah kedaluwarsa. Silakan coba lagi.'
              }
            </p>
          </div>

          {/* Invoice Details */}
          <div className="bg-surface-container-lowest rounded-xl p-6 text-left space-y-3 border border-outline-variant/30">
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20">
              <span className="font-label-md text-label-md text-on-surface-variant">Invoice ID</span>
              <span className="font-label-md text-label-md text-primary font-mono text-sm">{orderData.invoiceId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body-md text-body-md text-on-surface-variant">Game</span>
              <span className="font-label-md text-label-md text-on-surface">{orderData.gameTitle}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body-md text-body-md text-on-surface-variant">Status</span>
              <span className={`font-label-md text-label-md uppercase ${
                isCompleted ? 'text-green-500' : isPending ? 'text-amber-500' : 'text-red-500'
              }`}>
                {isCompleted ? '✅ Berhasil' : isPending ? '⏳ Pending' : '❌ Gagal'}
              </span>
            </div>
            {orderData.paymentMethod && (
              <div className="flex justify-between items-center">
                <span className="font-body-md text-body-md text-on-surface-variant">Metode Pembayaran</span>
                <span className="font-label-md text-label-md text-on-surface">{orderData.paymentMethod}</span>
              </div>
            )}
            {orderData.paidAt && (
              <div className="flex justify-between items-center">
                <span className="font-body-md text-body-md text-on-surface-variant">Dibayar Pada</span>
                <span className="font-caption text-caption text-on-surface-variant">{orderData.paidAt}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Total</span>
              <span className="font-headline-md text-headline-md text-primary">Rp {Number(orderData.amount).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body-md text-body-md text-on-surface-variant">Tanggal</span>
              <span className="font-caption text-caption text-on-surface-variant">{orderData.date}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="/"
              className="flex-1 py-3 bg-surface-container border border-outline-variant text-on-surface font-label-md text-label-md rounded-xl hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              Kembali ke Home
            </a>
            <a
              href="/history"
              className="flex-1 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-md text-label-md rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              Lihat History
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <main className="flex-grow w-full max-w-container-max mx-auto flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-5xl">progress_activity</span>
            <p className="font-body-lg">Memuat halaman...</p>
          </div>
        </main>
        <Footer />
      </>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
