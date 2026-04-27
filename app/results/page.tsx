import { AllocationTable } from '@/components/AllocationTable';
import { PriorityChart } from '@/components/PriorityChart';
import { MetricGrid } from '@/components/MetricGrid';
import { RoadRiskChart } from '@/components/RoadRiskChart';
import { RouteSummary } from '@/components/RouteSummary';
import { ScenarioSelector } from '@/components/ScenarioSelector';
import { SupplyChart } from '@/components/SupplyChart';
import { UnmetDemandChart } from '@/components/UnmetDemandChart';
import { buildCombinedOptimizationResult } from '@/lib/algorithms/verification';
import { defaultScenario, getScenarioById, scenarioOptions } from '@/lib/data/scenarios';
import { formatPercent } from '@/lib/utils';

interface ResultsPageProps {
  searchParams?: Promise<{ scenario?: string }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  const scenario = getScenarioById(params?.scenario ?? defaultScenario.id);
  const optimization = buildCombinedOptimizationResult(scenario, 5);
  const topShelter = optimization.highestPriorityShelter;
  const selectedAllocation = optimization.selectedAllocationResult;
  const selectedRoute = optimization.selectedRoute;

  return (
    <div className="space-y-8 pb-10">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Optimization results</p>
        <h1 className="text-4xl font-semibold text-white">Allocation and route recommendation</h1>
        <p className="max-w-3xl text-slate-300">
          This view ranks all sites by humanitarian pressure, allocates limited supplies in priority order, and then computes a
          risk-aware delivery route to the highest-priority destination.
        </p>
      </section>

      <ScenarioSelector scenarios={scenarioOptions} selectedId={scenario.id} hrefBase="/results" />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-200">Recommended destination</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{topShelter.shelterName}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-100">
            This site ranks first because it has the strongest combined score across urgency, population need, medical need,
            and accessibility risk. It is therefore selected for the first delivery decision.
          </p>
          <MetricGrid
            metrics={[
              { label: 'Priority score', value: topShelter.priorityScore.toFixed(3), detail: 'Final weighted ranking score for the selected destination.' },
              { label: 'Rank', value: `#${topShelter.rank}`, detail: 'Highest-priority site in the current scenario ranking.' },
              { label: 'Unmet demand', value: selectedAllocation.totalUnmetDemand, detail: 'Remaining units still needed after the first allocation pass.' },
              { label: 'Route status', value: selectedRoute.routeExists ? 'Reachable' : 'Unavailable', detail: 'Whether a feasible risk-aware route exists to the chosen destination.' },
            ]}
            columnsClassName="sm:grid-cols-2 xl:grid-cols-4"
          />
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Recommendation rationale</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Why this shelter and route</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
            <p>
              The allocation model favors destinations with the highest normalized urgency, population pressure, medical demand,
              and access constraints. {topShelter.shelterName} leads the ranking with strong contribution from urgency
              ({topShelter.priorityBreakdown.urgencyContribution.toFixed(3)}) and medical need
              ({topShelter.priorityBreakdown.medicalContribution.toFixed(3)}).
            </p>
            <p>
              The selected route then minimizes the weighted transport cost using distance + riskWeight × risk. This produces a
              route with total distance {selectedRoute.totalDistanceKm.toFixed(2)} km, cumulative risk {selectedRoute.totalRisk.toFixed(2)},
              and weighted cost {selectedRoute.totalWeightedCost.toFixed(2)}.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Fulfilled demand</p>
                <p className="mt-2 text-white">Food {selectedAllocation.allocatedFood}</p>
                <p className="text-white">Medicine {selectedAllocation.allocatedMedicine}</p>
                <p className="text-white">Water {selectedAllocation.allocatedWater}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Normalized factors</p>
                <p className="mt-2 text-white">Urgency {formatPercent(topShelter.priorityBreakdown.normalizedUrgency)}</p>
                <p className="text-white">Population {formatPercent(topShelter.priorityBreakdown.normalizedPopulationNeed)}</p>
                <p className="text-white">Medical {formatPercent(topShelter.priorityBreakdown.normalizedMedicalNeed)}</p>
                <p className="text-white">Access risk {formatPercent(topShelter.priorityBreakdown.normalizedAccessibilityRisk)}</p>
              </div>
            </div>
          </div>
        </article>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <PriorityChart
          allocationSummary={optimization.allocationSummary}
          highlightedShelterId={optimization.highestPriorityShelter.shelterId}
        />
        <SupplyChart allocationSummary={optimization.allocationSummary} mode="results" />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <UnmetDemandChart
          allocationSummary={optimization.allocationSummary}
          highlightedShelterId={optimization.highestPriorityShelter.shelterId}
        />
        <RoadRiskChart scenario={scenario} />
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Allocation results</h2>
          <p className="text-sm text-slate-400">
            Ranked allocations show how limited food, medicine, and water are distributed and where unmet demand remains.
          </p>
        </div>
        <AllocationTable
          allocationSummary={optimization.allocationSummary}
          highlightedShelterId={optimization.highestPriorityShelter.shelterId}
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Recommended route</h2>
          <p className="text-sm text-slate-400">
            The recommended path connects {scenario.warehouse.name} to {topShelter.shelterName} using the lowest weighted cost
            after blocked roads are removed from the network.
          </p>
        </div>
        <RouteSummary route={selectedRoute} riskWeight={optimization.riskWeight} />
      </section>
    </div>
  );
}
