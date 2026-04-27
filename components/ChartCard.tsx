import { ChartCardProps } from '@/lib/types';

export function ChartCard({ title, description, children, footer }: ChartCardProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-soft sm:p-6">
      <header className="mb-5 space-y-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="max-w-3xl text-sm leading-6 text-slate-400">{description}</p>
      </header>
      {children}
      {footer ? <div className="mt-4">{footer}</div> : null}
    </section>
  );
}
