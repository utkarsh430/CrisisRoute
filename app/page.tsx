import Link from 'next/link';
import { ArrowRight, BarChart3, CheckCircle2, GitCompareArrows, ShieldAlert, Waypoints } from 'lucide-react';
import { defaultScenario, scenarios } from '@/lib/data/scenarios';

const featureCards = [
  {
    title: 'Resource allocation',
    description:
      'Rank shelters, clinics, and camps by urgency, medical pressure, population demand, and accessibility risk to distribute limited relief supplies more transparently.',
    icon: BarChart3,
  },
  {
    title: 'Risk-aware route planning',
    description:
      'Evaluate safer delivery paths by combining road distance with risk penalties while automatically excluding blocked links from convoy recommendations.',
    icon: ShieldAlert,
  },
  {
    title: 'Scenario comparison',
    description:
      'Switch across local humanitarian case studies to compare how supply pressure, route difficulty, and response priorities change by operating environment.',
    icon: GitCompareArrows,
  },
  {
    title: 'Algorithm verification',
    description:
      'Inspect report-friendly toy examples that explain why the allocation and routing methods produce the selected operational decisions.',
    icon: CheckCircle2,
  },
];

const actionLinks = [
  { href: '/dashboard', label: 'View Dashboard' },
  { href: `/results?scenario=${defaultScenario.id}`, label: 'Run Optimization' },
  { href: `/algorithms?scenario=${defaultScenario.id}`, label: 'Explore Algorithms' },
];

export default function HomePage() {
  return (
    <div className="space-y-10 pb-10">
      <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-soft lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.3em] text-sky-200">
            <Waypoints className="h-4 w-4" />
            Humanitarian logistics platform
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">CrisisRoute</h1>
            <p className="text-xl font-medium text-emerald-200 md:text-2xl">
              Algorithmic Aid Allocation and Safe Route Planning
            </p>
            <p className="max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              Humanitarian operations often face a difficult balance: limited food, medicine, and water must be directed toward
              the most urgent locations while deliveries still need safe and practical routes through disrupted road networks.
              CrisisRoute presents this decision process in a transparent, structured planning interface.
            </p>
            <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
              The system uses local sample scenarios stored directly in the project to demonstrate allocation rankings, route
              selection, and verification workflows without external services or live operational dependencies.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {actionLinks.map((action, index) => (
              <Link
                key={action.href}
                href={action.href}
                className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium transition sm:text-base ${
                  index === 0
                    ? 'bg-brand-500 text-white hover:bg-brand-400'
                    : 'border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10'
                }`}
              >
                {action.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <article className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Local scenarios</p>
            <p className="mt-3 text-3xl font-semibold text-white">{scenarios.length}</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Urban, rural, and post-conflict datasets are included for repeatable demonstrations and report-ready analysis.
            </p>
          </article>

          <article className="rounded-3xl border border-sky-400/20 bg-sky-400/10 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-sky-200">Decision workflow</p>
            <p className="mt-3 text-lg font-semibold text-white">Prioritize, allocate, route</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              The platform links shelter ranking with road-network evaluation so the chosen destination and its path can be
              examined together.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Default study scenario</p>
            <h2 className="mt-3 text-xl font-semibold text-white">{defaultScenario.name}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">{defaultScenario.description}</p>
          </article>
        </div>
      </section>

      <section className="space-y-4">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Core capabilities</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Built for clear humanitarian planning analysis</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-base">
            The landing workflow introduces the main analytical features used throughout the project and frames them in a form
            suitable for academic presentation and capstone demonstration.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-soft">
              <div className="inline-flex rounded-2xl bg-brand-500/10 p-3 text-brand-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
