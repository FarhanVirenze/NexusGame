"use client"
import React, { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/adminFetch';

export default function ProviderBalanceCard() {
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchBalance = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await adminFetch('/api/admin/apigames-balance');
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

  const isLow = saldo !== null && saldo === 0;

  return (
    <div className="glass-card rounded-xl p-8 shadow-sm">
      <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">account_balance_wallet</span> APIGames Balance
      </h3>

      {message.text && (
        <div className={`p-3 rounded-lg font-body-sm text-sm mb-4 ${message.type === 'error' ? 'bg-error/10 border border-error/20 text-error' : 'bg-primary/10 border border-primary/20 text-primary'}`}>
          {message.text}
        </div>
      )}

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
              <p className="text-on-surface-variant text-sm mt-1">Saldo APIGames.id</p>
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

      <div className="border-t border-outline-variant/30 pt-6">
        <p className="text-on-surface-variant text-sm">
          <span className="material-symbols-outlined text-[16px] align-middle mr-1">info</span>
          Top up saldo melalui dashboard APIGames.id
        </p>
      </div>
    </div>
  );
}
