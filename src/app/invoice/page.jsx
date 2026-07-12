"use client"
import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function InvoiceContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('id');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef(null);

  useEffect(() => {
    async function loadInvoice() {
      if (!transactionId) { setLoading(false); return; }

      try {
        // Fetch transaction
        const res = await fetch(`/api/transactions?id=${transactionId}`);
        const result = await res.json();

        // Fetch Midtrans status for payment method info
        const statusRes = await fetch(`/api/midtrans/status?id=${transactionId}`);
        const statusData = await statusRes.json();

        if (res.ok && result.data) {
          const tx = result.data;
          setData({
            id: tx.id,
            invoiceId: tx.id.split('-')[0].toUpperCase() + '-' + tx.id.split('-')[4]?.substring(0, 6).toUpperCase(),
            gameTitle: tx.games?.title || 'Unknown Game',
            gameImage: tx.games?.image_url || null,
            amount: tx.amount,
            status: statusData?.status || tx.status,
            date: new Date(tx.created_at).toLocaleString('id-ID', { 
              day: 'numeric', month: 'long', year: 'numeric', 
              hour: '2-digit', minute: '2-digit' 
            }),
            paidAt: statusData?.paid_at 
              ? new Date(statusData.paid_at).toLocaleString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })
              : null,
            paymentMethod: statusData?.payment_method || '-',
          });
        }
      } catch (err) {
        console.error('Error loading invoice:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInvoice();
  }, [transactionId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: "'Hanken Grotesk', sans-serif", background: '#f8f9fa' }}>
        <p style={{ color: '#666' }}>Memuat invoice...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: "'Hanken Grotesk', sans-serif", background: '#f8f9fa' }}>
        <p style={{ color: '#e53e3e' }}>Invoice tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .invoice-card { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
        }
      `}</style>

      <div style={{ 
        minHeight: '100vh', 
        background: '#f1f5f9', 
        fontFamily: "'Hanken Grotesk', sans-serif",
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Print/Download Button */}
        <div className="no-print" style={{ width: '100%', maxWidth: '600px', display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => window.history.back()} 
            style={{ 
              padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0',
              background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '6px', color: '#475569'
            }}
          >
            ← Kembali
          </button>
          <button 
            onClick={handlePrint} 
            style={{ 
              padding: '10px 24px', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', 
              cursor: 'pointer', fontSize: '14px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)'
            }}
          >
            🖨️ Print / Download PDF
          </button>
        </div>

        {/* Invoice Card */}
        <div className="invoice-card" ref={invoiceRef} style={{ 
          width: '100%', maxWidth: '600px', background: 'white', 
          borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 4px 30px rgba(0,0,0,0.08)'
        }}>
          {/* Header */}
          <div style={{ 
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
            padding: '32px 28px', color: 'white', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
            <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '24px', fontFamily: "'Sora', sans-serif", fontWeight: 700, letterSpacing: '-0.5px' }}>NexusPay</h1>
                <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.85 }}>Invoice Pembayaran</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                  padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                  display: 'inline-block'
                }}>
                  ✅ LUNAS
                </div>
              </div>
            </div>
          </div>

          {/* Invoice ID */}
          <div style={{ padding: '20px 28px', borderBottom: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Invoice ID</p>
              <p style={{ margin: '4px 0 0', fontSize: '16px', fontWeight: 700, color: '#1e293b', fontFamily: 'monospace' }}>{data.invoiceId}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Tanggal Pesanan</p>
              <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 500, color: '#475569' }}>{data.date}</p>
            </div>
          </div>

          {/* Game Info */}
          <div style={{ padding: '20px 28px', borderBottom: '1px solid #f1f5f9' }}>
            <p style={{ margin: '0 0 12px', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Detail Pembelian</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              {data.gameImage ? (
                <img src={data.gameImage} alt={data.gameTitle} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🎮</div>
              )}
              <div>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{data.gameTitle}</p>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Top Up Game</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div style={{ padding: '20px 28px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Rincian Pembayaran</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Metode Pembayaran</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{data.paymentMethod}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Status</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#22c55e' }}>Berhasil</span>
              </div>
              {data.paidAt && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>Dibayar Pada</span>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#475569' }}>{data.paidAt}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Biaya Admin</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#22c55e' }}>Gratis</span>
              </div>
            </div>
          </div>

          {/* Total */}
          <div style={{ 
            margin: '0 28px', padding: '18px 20px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', 
            border: '1px solid #bbf7d0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#166534' }}>Total Pembayaran</span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#166534', fontFamily: "'Sora', sans-serif" }}>
              Rp {Number(data.amount).toLocaleString('id-ID')}
            </span>
          </div>

          {/* Footer */}
          <div style={{ padding: '24px 28px', textAlign: 'center' }}>
            <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '20px' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Terima kasih telah berbelanja di <strong style={{ color: '#6366f1' }}>NexusPay</strong></p>
              <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#cbd5e1' }}>Invoice ini digenerate secara otomatis dan sah tanpa tanda tangan.</p>
              <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#cbd5e1' }}>ID: {data.id}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: "'Hanken Grotesk', sans-serif", background: '#f8f9fa' }}>
        <p style={{ color: '#666' }}>Memuat halaman invoice...</p>
      </div>
    }>
      <InvoiceContent />
    </Suspense>
  );
}
