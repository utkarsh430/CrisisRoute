import { MetricGrid } from '@/components/MetricGrid';
import { ScenarioSelector } from '@/components/ScenarioSelector';
import { RoadTable } from '@/components/RoadTable';
import { ShelterTable } from '@/components/ShelterTable';
import { defaultScenario, getScenarioById, scenarioOptions } from '@/lib/data/scenarios';
import { formatNumber } from '@/lib/utils';

interface ScenarioPageProps {
  searchParams?: Promise<{ scenario?: string }>;
}

export default async function ScenarioPage({ searchParams }: ScenarioPageProps) {
  const params = await searchParams;
  const selected = getScenarioById(params?.scenario ?? defaultScenario.id);

  return (
    <div className="space-y-8 pb-10">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Scenario input data</p>
        <h1 className="text-4xl font-semibold text-white">Scenario details</h1>
        <p className="max-w-3xl text-slate-300">
          Inspect the selected local scenario before running optimization so the shelter demand profile, available inventory,
          and road conditions are clearly understood.
        </p>
      </section>

      <ScenarioSelector scenarios={scenarioOptions} selectedId={selected.id} hrefBase="/scenario" />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Selected scenario</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{selected.name}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">{selected.description}</p>
          <MetricGrid
            metrics={[
              { label: 'Warehouse', value: selected.warehouse.name, detail: 'Dispatch origin for allocation and routing analysis.' },
              { label: 'Shelters and sites', value: selected.shelters.length, detail: 'Demand nodes included in this local scenario.' },
              { label: 'Road segments', value: selected.roads.length, detail: 'Undirected network links before blocked roads are excluded.' },
            ]}
          />
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Supply inventory</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Available relief stock</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Food kits</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatNumber(selected.supplyInventory.foodKits)}</p>
            </div>
            <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-rose-200">Medicine kits</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatNumber(selected.supplyInventory.medicineKits)}</p>
            </div>
            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Water units</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatNumber(selected.supplyInventory.waterUnits)}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Shelter and site demand table</h2>
          <p className="text-sm text-slate-400">
            Review the population, urgency, relief demand, and medical-access indicators that feed the allocation algorithm.
          </p>
        </div>
        <ShelterTable shelters={selected.shelters} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Road network table</h2>
          <p className="text-sm text-slate-400">
            Review the road connectivity, distances, risk scores, and blocked segments that shape route feasibility.
          </p>
        </div>
        <RoadTable roads={selected.roads} scenario={selected} />
      </section>
    </div>
  );
}
