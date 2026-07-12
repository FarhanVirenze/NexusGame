"use client"
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const STATUS_COLORS = {
  completed: '#22c55e',
  pending: '#f59e0b',
  failed: '#ef4444',
  expired: '#94a3b8',
};

function CustomBarTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 shadow-lg">
        <p className="font-label-md text-label-md text-on-surface-variant mb-1">{label}</p>
        <p className="font-body-md text-body-md text-on-surface">
          {payload[0].value} transaksi
        </p>
      </div>
    );
  }
  return null;
}

function CustomPieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 shadow-lg">
        <p className="font-label-md text-label-md text-on-surface-variant mb-1">{payload[0].name}</p>
        <p className="font-body-md text-body-md text-on-surface">
          {payload[0].value} transaksi
        </p>
      </div>
    );
  }
  return null;
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function TransactionCharts({ dailyData, statusData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Daily Volume Bar Chart */}
      <div className="lg:col-span-2 glass-panel rounded-xl p-6 border border-outline-variant/50">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Daily Transactions</h3>
        {dailyData && dailyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--outline-variant))" strokeOpacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: 'hsl(var(--on-surface-variant))' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: 'hsl(var(--on-surface-variant))' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[280px] flex items-center justify-center text-on-surface-variant font-body-md">
            No transaction data
          </div>
        )}
      </div>

      {/* Status Distribution Pie Chart */}
      <div className="glass-panel rounded-xl p-6 border border-outline-variant/50">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Status Distribution</h3>
        {statusData && statusData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={90}
                innerRadius={45}
                dataKey="value"
                strokeWidth={2}
                stroke="hsl(var(--surface-container-lowest))"
              >
                {statusData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend 
                iconType="circle" 
                iconSize={8}
                formatter={(value) => <span className="text-on-surface-variant text-xs capitalize">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[280px] flex items-center justify-center text-on-surface-variant font-body-md">
            No data
          </div>
        )}
      </div>
    </div>
  );
}
