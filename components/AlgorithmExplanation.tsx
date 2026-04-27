import { AlgorithmVerificationResult, Scenario } from '@/lib/types';

interface AlgorithmExplanationProps {
  verificationCases: AlgorithmVerificationResult[];
  scenario: Scenario;
}

const allocationPseudocode = `INPUT shelters, availableFood, availableMedicine, availableWater
FOR each shelter
  normalize urgency, population, medical need, accessibility risk
  score = 0.35*urgency + 0.25*population + 0.25*medical + 0.15*access risk
END FOR
sort shelters by descending score
FOR each shelter in sorted order
  allocate food up to remaining stock and shelter demand
  allocate medicine up to remaining stock and shelter demand
  allocate water up to remaining stock and shelter demand
  record unmet demand
END FOR
RETURN ranking, allocations, remaining supplies, unmet demand summary`;

const dijkstraPseudocode = `INPUT graph, source, destination, riskWeight
remove blocked roads from graph
FOR each open road
  edgeCost = distance + riskWeight * risk
END FOR
initialize distance[source] = 0, all others = infinity
push source into priority queue
WHILE queue not empty
  pop node with lowest weighted cost
  FOR each neighboring open road
    candidate = current cost + edgeCost
    IF candidate improves best known cost
      update distance and predecessor
      push neighbor into queue
    END IF
  END FOR
END WHILE
reconstruct path from predecessor map
RETURN route, total distance, total risk, total weighted cost`;

const limitations = [
  'Risk scoring is simplified into static numeric values and cannot capture all operational realities.',
  'The project uses static sample datasets stored locally in the repository.',
  'There is no live crisis data feed connected to the scenarios.',
  'Road conditions do not update in real time during execution.',
  'Human judgment is still required for final humanitarian delivery decisions.',
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">{children}</div>
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs leading-6 text-slate-200 sm:text-sm">
      <code>{code}</code>
    </pre>
  );
}

export function AlgorithmExplanation({ verificationCases, scenario }: AlgorithmExplanationProps) {
  return (
    <div className="space-y-6">
      <SectionCard title="1. Problem Modeling">
        <p>
          Each humanitarian scenario is represented as a local network with one warehouse or depot, multiple shelters or service
          sites, finite inventories of food, medicine, and water, and an undirected road graph connecting locations.
        </p>
        <p>
          Every site stores population, urgency, medical need, and accessibility risk values. Every road stores distance,
          operational risk, and a blocked flag. Blocked roads remain in the dataset for transparency but are ignored by the
          routing algorithm when computing feasible delivery paths.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Active scenario</p>
            <p className="mt-2 font-medium text-white">{scenario.name}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Sites</p>
            <p className="mt-2 font-medium text-white">{scenario.shelters.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Roads</p>
            <p className="mt-2 font-medium text-white">{scenario.roads.length}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="2. Priority-Based Resource Allocation">
        <p>
          The allocation model first converts each shelter or clinic into a comparable priority score. Higher scores correspond
          to sites with stronger urgency, higher population pressure, greater medical need, and more difficult access conditions.
        </p>
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-base font-medium text-emerald-50">
          <p>Priority Score =</p>
          <p className="mt-2">0.35 × urgency + 0.25 × population need + 0.25 × medical need + 0.15 × accessibility risk</p>
        </div>
        <p>
          After ranking sites in descending order, the system greedily allocates food kits, medicine kits, and water units from
          the remaining inventory. Once a supply category is exhausted, the remaining demand at lower-ranked shelters becomes
          unmet demand and is recorded for reporting.
        </p>
      </SectionCard>

      <SectionCard title="3. Risk-Aware Dijkstra Algorithm">
        <p>
          Route planning is based on Dijkstra&apos;s shortest path algorithm, but the edge cost is expanded to reflect both travel
          distance and operational danger.
        </p>
        <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-5 text-base font-medium text-sky-50">
          <p>edgeCost = distance + riskWeight × risk</p>
        </div>
        <p>
          This means a longer but safer route can be preferred over a shorter but highly dangerous route. Roads marked as
          blocked are removed from the adjacency list before the search starts, so the algorithm only explores feasible paths.
        </p>
      </SectionCard>

      <SectionCard title="4. Pseudocode">
        <div className="grid gap-6 xl:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-white">Priority allocation pseudocode</h3>
            <div className="mt-3">
              <CodeBlock code={allocationPseudocode} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Risk-aware Dijkstra pseudocode</h3>
            <div className="mt-3">
              <CodeBlock code={dijkstraPseudocode} />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="5. Complexity Analysis">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Priority allocation</p>
            <p className="mt-3 text-2xl font-semibold text-white">O(n log n)</p>
            <p className="mt-2 text-sm text-slate-300">
              Normalization and scoring are linear in the number of sites, while sorting dominates the total cost.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Dijkstra routing</p>
            <p className="mt-3 text-2xl font-semibold text-white">O((V + E) log V)</p>
            <p className="mt-2 text-sm text-slate-300">
              With a priority-queue implementation, route search depends on both the number of vertices and the number of open
              road edges.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="6. Toy Verification">
        <p>
          The following small examples are designed to be simple enough for a written report while still demonstrating the core
          algorithmic behavior expected from the project.
        </p>
        <div className="space-y-4">
          {verificationCases.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-medium text-white">{item.title}</h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    item.passed ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'
                  }`}
                >
                  {item.passed ? 'Pass' : 'Check'}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{item.description}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-slate-950/60 px-3 py-1">Scenario {item.scenarioId}</span>
                <span className="rounded-full bg-slate-950/60 px-3 py-1">{item.algorithmName}</span>
              </div>
              <div className="mt-3 grid gap-3 xl:grid-cols-3">
                <div className="rounded-2xl bg-slate-950/60 p-3 text-sm text-slate-300">
                  <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Input</span>
                  <span className="mt-2 block">{item.input}</span>
                </div>
                <div className="rounded-2xl bg-slate-950/60 p-3 text-sm text-slate-300">
                  <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Expected output</span>
                  <span className="mt-2 block">{item.expectedReasoning}</span>
                </div>
                <div className="rounded-2xl bg-slate-950/60 p-3 text-sm text-slate-300">
                  <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Actual output</span>
                  <span className="mt-2 block">{item.actualOutput}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="7. Limitations">
        <ul className="space-y-3">
          {limitations.map((item) => (
            <li key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-300">
              {item}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
