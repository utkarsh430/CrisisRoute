import Image from 'next/image';
import { Boxes, Braces, GitBranch, Layers3, Network, Sparkles } from 'lucide-react';

import arch1 from '@/codeflow/arch1.png';
import arch2 from '@/codeflow/arch2.png';
import arch3 from '@/codeflow/arch3.png';

const architecturePanels = [
  {
    title: 'Application architecture',
    eyebrow: 'System map',
    description:
      'A high-level view of how CrisisRoute connects pages, reusable UI components, data models, and optimization logic into one cohesive planning interface.',
    image: arch1,
    accent: 'from-sky-400/30 via-cyan-400/10 to-transparent',
  },
  {
    title: 'Decision flow',
    eyebrow: 'Operational path',
    description:
      'This flow explains how a selected crisis scenario moves through prioritization, route evaluation, allocation reporting, and visual analytics.',
    image: arch2,
    accent: 'from-emerald-400/30 via-teal-400/10 to-transparent',
  },
  {
    title: 'Code structure breakdown',
    eyebrow: 'Implementation layers',
    description:
      'A compact breakdown of the project modules that keeps the frontend, scenario data, algorithm explanation, and result presentation organized.',
    image: arch3,
    accent: 'from-violet-400/30 via-fuchsia-400/10 to-transparent',
  },
];

const structureCards = [
  {
    title: 'App routes',
    description: 'Dedicated Next.js routes separate the dashboard, scenario selection, results, map, algorithms, and this architecture guide.',
    icon: GitBranch,
  },
  {
    title: 'Reusable components',
    description: 'Charts, cards, route summaries, tables, and selectors are composed into polished pages without duplicating presentation logic.',
    icon: Boxes,
  },
  {
    title: 'Local data layer',
    description: 'Scenario definitions and mock crisis datasets live locally, making the project repeatable for demos and academic evaluation.',
    icon: Braces,
  },
  {
    title: 'Visualization layer',
    description: 'The interface translates algorithmic results into approachable cards, graphs, maps, and comparison views for faster interpretation.',
    icon: Layers3,
  },
];

export default function CodeStructurePage() {
  return (
    <div className="space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/75 p-8 shadow-soft lg:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-12 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.3em] text-sky-200">
              <Network className="h-4 w-4" />
              Code architecture
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">Understand the project flow</h1>
              <p className="max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                These architecture views explain how CrisisRoute is structured from the frontend routes down to the scenario data,
                optimization workflow, and visualization components that present humanitarian planning decisions.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-brand-500/15 p-3 text-brand-200 ring-1 ring-brand-300/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Architecture narrative</p>
                <p className="text-sm leading-6 text-slate-400">Built to make the codebase easier to review, present, and maintain.</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              {['Routes', 'Data', 'UI'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-4">
                  <p className="text-lg font-semibold text-white">{item}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">Layer</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {structureCards.map(({ title, description, icon: Icon }) => (
          <article key={title} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-soft transition hover:-translate-y-1 hover:border-sky-300/30 hover:bg-slate-900/90">
            <div className="inline-flex rounded-2xl bg-sky-400/10 p-3 text-sky-200 ring-1 ring-sky-300/10">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
          </article>
        ))}
      </section>

      <section className="space-y-6">
        {architecturePanels.map((panel, index) => (
          <article
            key={panel.title}
            className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 shadow-soft"
          >
            <div className="grid gap-0 xl:grid-cols-[0.8fr_1.2fr]">
              <div className={`relative overflow-hidden border-b border-white/10 bg-gradient-to-br ${panel.accent} p-7 xl:border-b-0 xl:border-r`}>
                <div className="absolute right-6 top-6 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                  0{index + 1}
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-sky-200">{panel.eyebrow}</p>
                <h2 className="mt-4 text-2xl font-semibold text-white md:text-3xl">{panel.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">{panel.description}</p>
              </div>

              <div className="bg-slate-950/45 p-4 sm:p-6">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white p-2 shadow-2xl shadow-slate-950/30">
                  <Image
                    src={panel.image}
                    alt={`${panel.title} diagram`}
                    className="h-auto w-full rounded-2xl object-contain"
                    sizes="(min-width: 1280px) 760px, 100vw"
                    priority={index === 0}
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
