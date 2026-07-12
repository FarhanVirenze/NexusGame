"use client"
import dynamic from 'next/dynamic';

const RevenueChart = dynamic(() => import('./RevenueChart'), {
  loading: () => <div className="h-[200px] flex items-center justify-center text-on-surface-variant"><span className="material-symbols-outlined animate-spin">progress_activity</span></div>,
  ssr: false,
});

export default function RevenueChartWrapper({ data }) {
  return <RevenueChart data={data} />;
}
