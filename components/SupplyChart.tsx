'use client';

import { ChartCard } from '@/components/ChartCard';
import { AllocationSummary } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface SupplyChartProps {
  allocationSummary: AllocationSummary;
  mode?: 'results' | 'dashboard';
}

export function SupplyChart({ allocationSummary, mode = 'results' }: SupplyChartProps) {
  const data = [
    {
      type: 'Food',
      demand: allocationSummary.totalDemand.food,
      allocated: allocationSummary.totalAllocated.food,
      unmet: allocationSummary.totalUnmetDemand.food,
      remaining: allocationSummary.remainingSupplies.foodKits,
    },
    {
      type: 'Medicine',
      demand: allocationSummary.totalDemand.medicine,
      allocated: allocationSummary.totalAllocated.medicine,
      unmet: allocationSummary.totalUnmetDemand.medicine,
      remaining: allocationSummary.remainingSupplies.medicineKits,
    },
    {
      type: 'Water',
      demand: allocationSummary.totalDemand.water,
      allocated: allocationSummary.totalAllocated.water,
      unmet: allocationSummary.totalUnmetDemand.water,
      remaining: allocationSummary.remainingSupplies.waterUnits,
    },
  ];

  return (
    <ChartCard
      title={mode === 'dashboard' ? 'Demand versus available supplies' : 'Demand versus allocation outcome'}
      description={
        mode === 'dashboard'
          ? 'Review total demand against the allocation output to understand whether the selected scenario has enough stock to satisfy needs.'
          : 'Compare demand, delivered supplies, unmet shortfalls, and remaining inventory to support the written recommendation.'
      }
    >
      <div className="h-80" role="img" aria-label="Bar chart comparing demand, allocated, unmet, and remaining relief supplies">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 0, right: 10, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
            <XAxis dataKey="type" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" tickFormatter={(value: number) => formatNumber(value)} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value: number, name: string) => [formatNumber(value), name]}
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
              }}
            />
            <Legend wrapperStyle={{ color: '#cbd5e1', paddingTop: 12 }} />
            <Bar dataKey="demand" fill="#38bdf8" name="Total demand" radius={[10, 10, 0, 0]} />
            <Bar dataKey="allocated" fill="#34d399" name="Allocated" radius={[10, 10, 0, 0]} />
            <Bar dataKey="unmet" fill="#f97316" name="Unmet demand" radius={[10, 10, 0, 0]} />
            {mode === 'results' ? <Bar dataKey="remaining" fill="#a78bfa" name="Remaining supply" radius={[10, 10, 0, 0]} /> : null}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
