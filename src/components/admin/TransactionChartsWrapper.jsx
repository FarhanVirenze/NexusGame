"use client"
import dynamic from 'next/dynamic';

const TransactionCharts = dynamic(() => import('./TransactionCharts'), {
  loading: () => <div className="h-[300px] flex items-center justify-center text-on-surface-variant"><span className="material-symbols-outlined animate-spin">progress_activity</span></div>,
  ssr: false,
});

export default function TransactionChartsWrapper({ dailyData, statusData }) {
  return <TransactionCharts dailyData={dailyData} statusData={statusData} />;
}
