"use client"
import React, { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/adminFetch';

export default function CelestialBalanceCard() {
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [depositing, setDepositing] = useState(false);
  const [depositAmount, setDepositAmount] = useState(10000);
  const [depositQr, setDepositQr] = useState(null);
  const [depositId, setDepositId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/celestial-balance');
      const data = await res.json();
      if (res.ok && data.success) {
        setSaldo(data.saldo);
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal mengambil saldo' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleDeposit = async () => {
    if (depositAmount < 10000) {
      setMessage({ type: 'error', text: 'Minimal deposit Rp 10.000' });
      return;
    }

    setDepositing(true);
    setMessage({ type: '', text: '' });
    setDepositQr(null);

    try {
      const res = await adminFetch('/api/admin/celestial-balance', {
        method: 'POST',
        body: JSON.stringify({ jumlah: depositAmount }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setDepositQr(data.qr_image);
        setDepositId(data.deposit_id);
        setMessage({ type: 'success', text: `Deposit Rp ${depositAmount.toLocaleString('id-ID')} berhasil dibuat. Silakan bayar QR di bawah.` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal membuat deposit' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error: ' + err.message });
    } finally {
      setDepositing(false);
    }
  };

  const isLow = saldo !== null && saldo === 0;

  return (
    <div className="glass-card rounded-xl p-8 shadow-sm">
      <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">account_balance_wallet</span> Celestial Balance
      </h3>

      {message.text && (
        <div className={`p-3 rounded-lg font-body-sm text-sm mb-4 ${message.type === 'error' ? 'bg-error/10 border border-error/20 text-error' : 'bg-primary/10 border border-primary/20 text-primary'}`}>
          {message.text}
        </div>
      )}

      {/* Balance Display */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
              <span className="text-on-surface-variant text-sm">Loading...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <span className={`text-3xl font-bold ${isLow ? 'text-error' : 'text-on-surface'}`}>
                  Rp {saldo !== null ? saldo.toLocaleString('id-ID') : '0'}
                </span>
                {isLow && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error/10 text-error text-xs font-semibold">
                    <span className="material-symbols-outlined text-[14px]">warning</span> Habis
                  </span>
                )}
              </div>
              <p className="text-on-surface-variant text-sm mt-1">Saldo Celestial TopUp</p>
            </>
          )}
        </div>
        <button
          onClick={fetchBalance}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-surface-container transition-colors"
          title="Refresh saldo"
        >
          <span className={`material-symbols-outlined text-on-surface-variant ${loading ? 'animate-spin' : ''}`}>refresh</span>
        </button>
      </div>

      {/* Deposit Form */}
      <div className="border-t border-outline-variant/30 pt-6">
        <h4 className="font-label-md text-label-md text-on-surface mb-3">Deposit Manual</h4>
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">Rp</span>
              <input
                type="number"
                min="10000"
                step="1000"
                value={depositAmount}
                onChange={e => setDepositAmount(parseInt(e.target.value) || 0)}
                className="w-full bg-surface border border-outline-variant/50 rounded-lg pl-10 pr-4 py-2.5 text-on-surface focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
          </div>
          <button
            onClick={handleDeposit}
            disabled={depositing || depositAmount < 10000}
            className="bg-gradient-to-r from-primary to-primary-container text-white px-5 py-2.5 rounded-lg font-label-md text-label-md shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 flex items-center gap-2 whitespace-nowrap"
          >
            {depositing ? (
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-lg">add</span>
            )}
            Deposit
          </button>
        </div>
      </div>

      {/* QR Code Display */}
      {depositQr && (
        <div className="border-t border-outline-variant/30 pt-6 mt-6">
          <div className="bg-surface-container rounded-xl p-6 text-center">
            <p className="text-on-surface-variant text-sm mb-3">Scan QR di bawah untuk deposit:</p>
            <img src={depositQr} alt="QR Deposit Celestial" className="w-56 mx-auto rounded-lg shadow-md" />
            <p className="text-xs text-on-surface-variant mt-3">ID: {depositId}</p>
            <p className="text-xs text-on-surface-variant">Nominal: Rp {depositAmount.toLocaleString('id-ID')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
