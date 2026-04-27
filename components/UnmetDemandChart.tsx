'use client';

import { ChartCard } from '@/components/ChartCard';
import { AllocationSummary } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface UnmetDemandChartProps {
  allocationSummary: AllocationSummary;
  highlightedShelterId?: string;
}

export function UnmetDemandChart({ allocationSummary, highlightedShelterId }: UnmetDemandChartProps) {
  const data = allocationSummary.allocationResults.map((result) => ({
    name: result.shelterName.length > 18 ? `${result.shelterName.slice(0, 18)}…` : result.shelterName,
    fullName: result.shelterName,
    food: result.unmetFoodDemand,
    medicine: result.unmetMedicineDemand,
    water: result.unmetWaterDemand,
    total: result.totalUnmetDemand,
    fill: result.shelterId === highlightedShelterId ? '#fb7185' : '#f97316',
  }));

  const topShortfalls = [...data].sort((left, right) => right.total - left.total).slice(0, 3);

  if (data.length === 0) {
    return (
      <ChartCard
        title="Unmet demand by site"
        description="Compare how much food, medicine, and water remains unfulfilled at each site after the priority-based allocation pass."
      >
        <div className="flex h-80 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-6 text-center text-sm text-slate-400">
          No unmet demand data is available for this scenario.
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Unmet demand by site"
      description="Compare how much food, medicine, and water remains unfulfilled at each site after the priority-based allocation pass."
      footer={
        <div className="grid gap-3 sm:grid-cols-3">
          {topShortfalls.map((item) => (
            <div key={item.fullName} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Highest shortfall</p>
              <p className="mt-2 text-sm font-semibold text-white">{item.fullName}</p>
              <p className="mt-1 text-sm text-slate-300">{formatNumber(item.total)} units unmet</p>
            </div>
          ))}
        </div>
      }
    >
      <div className="h-80" role="img" aria-label="Horizontal bar chart showing unmet demand totals for each scenario site">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 18, right: 16, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" horizontal={false} />
            <XAxis type="number" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" width={130} stroke="#94a3b8" tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value: number, key: string) => [formatNumber(value), key === 'total' ? 'Total unmet demand' : `Unmet ${key}`]}
              labelFormatter={(label: unknown, payload: ReadonlyArray<{ payload?: { fullName?: string } }>) =>
                payload?.[0]?.payload?.fullName ?? String(label ?? '')
              }
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
              }}
            />
            <Bar dataKey="total" radius={[0, 12, 12, 0]} name="total unmet demand">
              {data.map((entry) => (
                <Cell key={entry.fullName} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
