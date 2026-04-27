'use client';

import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SelectOption } from '@/lib/types';

interface ScenarioSelectorProps {
  scenarios: SelectOption[];
  selectedId: string;
  hrefBase?: string;
}

export function ScenarioSelector({ scenarios, selectedId, hrefBase = '/scenario' }: ScenarioSelectorProps) {
  const router = useRouter();
  const selectedScenario = scenarios.find((scenario) => scenario.value === selectedId) ?? scenarios[0];

  function handleScenarioChange(nextScenarioId: string) {
    if (nextScenarioId === selectedId) {
      return;
    }

    const nextHref = nextScenarioId === scenarios[0]?.value ? hrefBase : `${hrefBase}?scenario=${nextScenarioId}`;
    router.push(nextHref);
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 shadow-soft sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Scenario selector</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Choose an operating context</h2>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Switch between local sample scenarios to compare demand pressure, blocked roads, and route safety conditions.
          </p>
        </div>

        <div className="w-full max-w-xl">
          <label htmlFor="scenario-selector" className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">
            Active scenario
          </label>
          <div className="relative">
            <select
              id="scenario-selector"
              aria-label="Select humanitarian scenario"
              value={selectedId}
              onChange={(event) => handleScenarioChange(event.target.value)}
              className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3.5 pr-12 text-sm text-white outline-none transition focus:border-sky-400/40"
            >
              {scenarios.map((scenario) => (
                <option key={scenario.value} value={scenario.value}>
                  {scenario.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {selectedScenario ? (
        <div className="mt-5 grid gap-3 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Scenario summary</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{selectedScenario.label}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-300">Switch to update all analysis views for the selected local humanitarian scenario.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Scenario ID</p>
              <p className="mt-2 font-medium text-white">{selectedScenario.value}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Scenarios available</p>
              <p className="mt-2 font-medium text-white">{scenarios.length}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Routing mode</p>
              <p className="mt-2 font-medium text-white">URL query selection</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
