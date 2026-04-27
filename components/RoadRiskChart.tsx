'use client';

import { ChartCard } from '@/components/ChartCard';
import { Scenario } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface RoadRiskChartProps {
  scenario: Scenario;
}

const riskBands = [
  { key: 'low', label: 'Low risk (1-3)', min: 1, max: 3, fill: '#38bdf8' },
  { key: 'moderate', label: 'Moderate risk (4-6)', min: 4, max: 6, fill: '#f59e0b' },
  { key: 'high', label: 'High risk (7-10)', min: 7, max: 10, fill: '#f97316' },
];

export function RoadRiskChart({ scenario }: RoadRiskChartProps) {
  const data = riskBands.map((band) => {
    const roads = scenario.roads.filter((road) => road.riskScore >= band.min && road.riskScore <= band.max);
    const blocked = roads.filter((road) => road.blocked).length;

    return {
      ...band,
      totalRoads: roads.length,
      blockedRoads: blocked,
      openRoads: roads.length - blocked,
    };
  });

  return (
    <ChartCard
      title="Road risk distribution"
      description="Group road segments by risk band to show how much of the network is low-risk, moderate-risk, or high-risk under the selected scenario."
      footer={
        <div className="grid gap-3 sm:grid-cols-3">
          {data.map((item) => (
            <div key={item.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{formatNumber(item.totalRoads)}</p>
              <p className="mt-1 text-sm text-slate-300">Blocked: {formatNumber(item.blockedRoads)}</p>
            </div>
          ))}
        </div>
      }
    >
      <div className="h-80" role="img" aria-label="Bar chart showing road counts by low, moderate, and high risk bands">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 8, right: 8, top: 12, bottom: 12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
            <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} interval={0} />
            <YAxis allowDecimals={false} stroke="#94a3b8" tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value: number, name: string) => [formatNumber(value), name === 'totalRoads' ? 'Road segments' : 'Blocked segments']}
              labelFormatter={(label) => label}
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
              }}
            />
            <Bar dataKey="totalRoads" radius={[12, 12, 0, 0]} name="Road segments">
              <LabelList dataKey="openRoads" position="top" fill="#cbd5e1" fontSize={12} formatter={(value: number) => `${value} open`} />
              {data.map((entry) => (
                <Cell key={entry.key} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
