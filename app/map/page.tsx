import { CrisisGraph } from '@/components/CrisisGraph';
import { MetricGrid } from '@/components/MetricGrid';
import { ScenarioSelector } from '@/components/ScenarioSelector';
import { buildCombinedOptimizationResult } from '@/lib/algorithms/verification';
import { defaultScenario, getScenarioById, scenarioOptions } from '@/lib/data/scenarios';
import { formatRoutePath } from '@/lib/utils';

interface MapPageProps {
  searchParams?: Promise<{ scenario?: string }>;
}

const legendItems = [
  { label: 'Warehouse / depot', swatch: 'bg-emerald-500 border-emerald-300' },
  { label: 'Shelter / camp / clinic / village', swatch: 'bg-slate-700 border-slate-400' },
  { label: 'Normal road', swatch: 'bg-sky-500 border-sky-300' },
  { label: 'High-risk road', swatch: 'bg-amber-500 border-amber-300' },
  { label: 'Blocked road', swatch: 'bg-rose-500 border-rose-300 border-dashed' },
  { label: 'Recommended route', swatch: 'bg-emerald-300 border-emerald-100' },
];

export default async function MapPage({ searchParams }: MapPageProps) {
  const params = await searchParams;
  const scenario = getScenarioById(params?.scenario ?? defaultScenario.id);
  const optimization = buildCombinedOptimizationResult(scenario, 5);

  return (
    <div className="space-y-8 pb-10">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Network map visualization</p>
        <h1 className="text-4xl font-semibold text-white">Relief network map</h1>
        <p className="max-w-3xl text-slate-300">
          Explore the active scenario as a road-network diagram showing humanitarian sites, blocked segments, elevated-risk
          corridors, and the currently recommended delivery route.
        </p>
      </section>

      <ScenarioSelector scenarios={scenarioOptions} selectedId={scenario.id} hrefBase="/map" />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-200">Highlighted route</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{optimization.highestPriorityShelter.shelterName}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-100">
            The map emphasizes the route from {scenario.warehouse.name} to the highest-priority destination after blocked roads
            are removed and route cost is computed from distance plus weighted risk.
          </p>
          <MetricGrid
            metrics={[
              {
                label: 'Distance',
                value: `${optimization.selectedRoute.totalDistanceKm.toFixed(2)} km`,
                detail: 'Total road distance covered by the recommended route.',
              },
              {
                label: 'Total risk',
                value: optimization.selectedRoute.totalRisk.toFixed(2),
                detail: 'Combined risk score across the selected open-road segments.',
              },
              {
                label: 'Weighted cost',
                value: optimization.selectedRoute.totalWeightedCost.toFixed(2),
                detail: 'Distance plus risk-weighted route cost minimized by the routing algorithm.',
              },
            ]}
          />
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Map legend</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Visual encoding</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className={`inline-block h-4 w-10 rounded-full border-2 ${item.swatch}`} />
                <span className="text-sm text-slate-200">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300 break-words">
            Recommended path: {optimization.selectedRoute.routeExists ? formatRoutePath(optimization.selectedRoute.pathNodeNames) : 'No feasible path available'}
          </div>
        </article>
      </section>

      <CrisisGraph
        scenario={scenario}
        recommendedRoute={optimization.selectedRoute}
        highlightedShelterId={optimization.highestPriorityShelter.shelterId}
      />
    </div>
  );
}
