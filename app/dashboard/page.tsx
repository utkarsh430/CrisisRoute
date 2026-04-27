import { DashboardCards } from '@/components/DashboardCards';
import { MetricGrid } from '@/components/MetricGrid';
import { PriorityChart } from '@/components/PriorityChart';
import { ScenarioSelector } from '@/components/ScenarioSelector';
import { SupplyChart } from '@/components/SupplyChart';
import { priorityAllocate } from '@/lib/algorithms/priorityAllocation';
import { defaultScenario, getScenarioById, scenarioOptions } from '@/lib/data/scenarios';
import { formatNumber } from '@/lib/utils';

interface DashboardPageProps {
  searchParams?: Promise<{ scenario?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const scenario = getScenarioById(params?.scenario ?? defaultScenario.id);
  const allocationSummary = priorityAllocate(scenario);
  const highestPriorityShelter = allocationSummary.rankedShelters[0];
  const totalPopulation = scenario.shelters.reduce((sum, shelter) => sum + shelter.population, 0);
  const totalDemand = allocationSummary.totalDemand.food + allocationSummary.totalDemand.medicine + allocationSummary.totalDemand.water;

  return (
    <div className="space-y-8 pb-10">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Dashboard</p>
        <h1 className="text-4xl font-semibold text-white">Operational overview</h1>
        <p className="max-w-3xl text-slate-300">
          Review the selected local crisis scenario through supply availability, road conditions, and priority-based response
          indicators before running detailed optimization outputs.
        </p>
      </section>

      <ScenarioSelector scenarios={scenarioOptions} selectedId={scenario.id} hrefBase="/dashboard" />

      <DashboardCards scenario={scenario} highestPriorityShelter={highestPriorityShelter} />

      <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <PriorityChart allocationSummary={allocationSummary} />
        <SupplyChart allocationSummary={allocationSummary} mode="dashboard" />
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Scenario summary</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{scenario.name}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">{scenario.description}</p>
          <MetricGrid
            metrics={[
              { label: 'Depot', value: scenario.warehouse.name, detail: 'Primary dispatch node for the selected scenario.' },
              { label: 'Population tracked', value: formatNumber(totalPopulation), detail: 'Total population represented across all modeled sites.' },
              { label: 'Total demand units', value: formatNumber(totalDemand), detail: 'Combined food, medicine, and water demand before allocation.' },
            ]}
          />
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Priority insight</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Highest priority destination</h2>
          {highestPriorityShelter ? (
            <div className="mt-4 space-y-4">
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Selected shelter</p>
                <p className="mt-2 text-xl font-semibold text-white">{highestPriorityShelter.shelterName}</p>
                <p className="mt-2 text-sm text-slate-300">Priority score {highestPriorityShelter.priorityScore.toFixed(3)}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Urgency contribution</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {highestPriorityShelter.priorityBreakdown.urgencyContribution.toFixed(3)}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Medical contribution</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {highestPriorityShelter.priorityBreakdown.medicalContribution.toFixed(3)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">No shelter ranking is available for this scenario.</p>
          )}
        </article>
      </section>
    </div>
  );
}
