import {
  AlertTriangle,
  Boxes,
  Droplets,
  Factory,
  MapPinned,
  Milk,
  Pill,
  ShieldAlert,
} from 'lucide-react';
import { InsightMetric, RankedShelter, Scenario } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

interface DashboardCardsProps {
  scenario: Scenario;
  highestPriorityShelter?: RankedShelter;
}

export function DashboardCards({ scenario, highestPriorityShelter }: DashboardCardsProps) {
  const blockedRoads = scenario.roads.filter((road) => road.blocked).length;
  const averageRoadRisk = scenario.roads.reduce((sum, road) => sum + road.riskScore, 0) / scenario.roads.length;

  const cards: InsightMetric[] = [
    {
      label: 'Shelters',
      value: scenario.shelters.length,
      detail: 'Scenario sites included in the ranking and demand analysis',
      icon: Boxes,
      tone: 'text-sky-300 bg-sky-500/15',
    },
    {
      label: 'Roads',
      value: scenario.roads.length,
      detail: 'Road segments modeled in the network',
      icon: MapPinned,
      tone: 'text-brand-300 bg-brand-500/15',
    },
    {
      label: 'Available food kits',
      value: formatNumber(scenario.supplyInventory.foodKits),
      detail: 'Current warehouse food inventory',
      icon: Factory,
      tone: 'text-amber-300 bg-amber-500/15',
    },
    {
      label: 'Available medicine kits',
      value: formatNumber(scenario.supplyInventory.medicineKits),
      detail: 'Current warehouse medical inventory',
      icon: Pill,
      tone: 'text-rose-300 bg-rose-500/15',
    },
    {
      label: 'Available water units',
      value: formatNumber(scenario.supplyInventory.waterUnits),
      detail: 'Current warehouse water inventory',
      icon: Droplets,
      tone: 'text-cyan-300 bg-cyan-500/15',
    },
    {
      label: 'Blocked roads',
      value: blockedRoads,
      detail: 'Roads unavailable for routing decisions',
      icon: AlertTriangle,
      tone: 'text-orange-300 bg-orange-500/15',
    },
    {
      label: 'Average road risk',
      value: averageRoadRisk.toFixed(1),
      detail: 'Mean risk score across all road segments',
      icon: ShieldAlert,
      tone: 'text-fuchsia-300 bg-fuchsia-500/15',
    },
    {
      label: 'Highest priority shelter',
      value: highestPriorityShelter?.shelterName ?? 'Unavailable',
      detail: highestPriorityShelter
        ? `Priority score ${highestPriorityShelter.priorityScore.toFixed(3)}`
        : 'No ranked shelter available',
      icon: Milk,
      tone: 'text-emerald-300 bg-emerald-500/15',
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, detail, icon: Icon, tone }) => (
        <article key={label} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-soft">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-3xl">{value}</p>
            </div>
            {Icon && tone ? (
              <div className={`rounded-2xl p-3 ${tone}`}>
                <Icon className="h-5 w-5" />
              </div>
            ) : null}
          </div>
          <p className="text-sm leading-6 text-slate-400">{detail}</p>
        </article>
      ))}
    </section>
  );
}
