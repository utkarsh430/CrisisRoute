import { MetricGrid } from '@/components/MetricGrid';
import { RouteResult } from '@/lib/types';

interface RouteSummaryProps {
  route: RouteResult;
  riskWeight?: number;
}

export function RouteSummary({ route, riskWeight = 5 }: RouteSummaryProps) {
  if (!route.routeExists) {
    return (
      <article className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-5 shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-rose-200">Route unavailable</p>
        <h3 className="mt-2 text-lg font-semibold text-white">No safe path found</h3>
        <p className="mt-2 text-sm text-slate-200">
          All currently open roads fail to connect the warehouse to {route.destinationNodeName} under the selected scenario.
        </p>
      </article>
    );
  }

  const routeMetrics = [
    { label: 'Total distance', value: `${route.totalDistanceKm.toFixed(2)} km`, detail: 'Distance traveled along the selected route.' },
    { label: 'Total risk', value: route.totalRisk.toFixed(2), detail: 'Cumulative route risk across all selected road segments.' },
    {
      label: 'Weighted cost',
      value: route.totalWeightedCost.toFixed(2),
      detail: `Computed using distance plus a risk weight of ${riskWeight}.`,
    },
  ];

  return (
    <article className="space-y-5 rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-soft">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Recommended route</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Warehouse to {route.destinationNodeName}</h3>
          <p className="mt-2 text-sm text-slate-300">
            The selected path minimizes distance plus a risk penalty using a risk weight of {riskWeight}.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          Total weighted cost {route.totalWeightedCost.toFixed(2)}
        </div>
      </div>

      <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-200 break-words">{route.pathNodeNames.join(' → ')}</div>

      <MetricGrid metrics={routeMetrics} />

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60">
        <div className="border-b border-white/10 px-4 py-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Route steps</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/5 text-left text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">From</th>
                <th className="px-4 py-3 font-medium">To</th>
                <th className="px-4 py-3 font-medium">Distance</th>
                <th className="px-4 py-3 font-medium">Risk</th>
                <th className="px-4 py-3 font-medium">Weighted cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {route.steps.map((step, index) => (
                <tr key={`${step.fromNodeId}-${step.toNodeId}-${index}`} className="hover:bg-white/5">
                  <td className="px-4 py-3">{step.fromNodeName}</td>
                  <td className="px-4 py-3">{step.toNodeName}</td>
                  <td className="px-4 py-3">{step.distanceKm.toFixed(2)} km</td>
                  <td className="px-4 py-3">{step.riskScore}</td>
                  <td className="px-4 py-3">{step.weightedCost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </article>
  );
}
