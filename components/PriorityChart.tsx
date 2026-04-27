'use client';

import { ChartCard } from '@/components/ChartCard';
import { AllocationSummary } from '@/lib/types';
import { formatDecimal } from '@/lib/utils';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PriorityChartProps {
  allocationSummary: AllocationSummary;
  highlightedShelterId?: string;
}

export function PriorityChart({ allocationSummary, highlightedShelterId }: PriorityChartProps) {
  const data = allocationSummary.rankedShelters.map((item) => ({
    name: item.shelterName.length > 18 ? `${item.shelterName.slice(0, 18)}…` : item.shelterName,
    fullName: item.shelterName,
    score: Number(item.priorityScore.toFixed(3)),
    rank: item.rank,
    urgency: item.priorityBreakdown.urgencyContribution,
    population: item.priorityBreakdown.populationContribution,
    medical: item.priorityBreakdown.medicalContribution,
    accessibility: item.priorityBreakdown.accessibilityContribution,
    fill: item.shelterId === highlightedShelterId ? '#34d399' : '#38bdf8',
  }));

  if (data.length === 0) {
    return (
      <ChartCard
        title="Priority score comparison"
        description="Compare final shelter scores and inspect the factors that shape the recommended ranking."
      >
        <div className="flex h-80 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-6 text-center text-sm text-slate-400">
          No shelter priority data is available for this scenario.
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Priority score comparison"
      description="Compare final shelter scores and inspect how urgency, population pressure, medical need, and accessibility contribute to the recommended ranking."
    >
      <div className="h-80" role="img" aria-label="Bar chart comparing scenario shelter priority scores">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 0, right: 10, top: 10, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" angle={-25} textAnchor="end" interval={0} height={70} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" domain={[0, 1]} tickFormatter={(value: number) => formatDecimal(value, 2)} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value: number, key: string) => {
                if (key === 'score') {
                  return [formatDecimal(value, 3), 'Priority score'];
                }

                return [formatDecimal(value, 3), `${key} contribution`];
              }}
              labelFormatter={(label: unknown, payload: ReadonlyArray<{ payload?: { fullName?: string } }>) =>
                payload?.[0]?.payload?.fullName ?? String(label ?? '')
              }
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
              }}
            />
            <Bar dataKey="score" radius={[10, 10, 0, 0]} name="score">
              <LabelList dataKey="rank" position="top" fill="#cbd5e1" fontSize={12} formatter={(value: number) => `#${value}`} />
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
