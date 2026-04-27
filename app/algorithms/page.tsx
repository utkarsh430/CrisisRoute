import { AlgorithmExplanation } from '@/components/AlgorithmExplanation';
import { ScenarioSelector } from '@/components/ScenarioSelector';
import { buildVerificationCases } from '@/lib/algorithms/verification';
import { defaultScenario, getScenarioById, scenarioOptions } from '@/lib/data/scenarios';

interface AlgorithmsPageProps {
  searchParams?: Promise<{ scenario?: string }>;
}

export default async function AlgorithmsPage({ searchParams }: AlgorithmsPageProps) {
  const params = await searchParams;
  const scenario = getScenarioById(params?.scenario ?? defaultScenario.id);
  const verificationCases = buildVerificationCases(scenario);

  return (
    <div className="space-y-8 pb-10">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Algorithm explanation</p>
        <h1 className="text-4xl font-semibold text-white">Methods, pseudocode, and verification</h1>
        <p className="max-w-3xl text-slate-300">
          This page summarizes how CrisisRoute models humanitarian logistics decisions, how each algorithm works, and how small
          toy examples confirm the expected behavior of the optimization pipeline.
        </p>
      </section>

      <ScenarioSelector scenarios={scenarioOptions} selectedId={scenario.id} hrefBase="/algorithms" />
      <AlgorithmExplanation verificationCases={verificationCases} scenario={scenario} />
    </div>
  );
}
