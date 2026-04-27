import { InsightMetric } from '@/lib/types';

interface MetricGridProps {
  metrics: InsightMetric[];
  columnsClassName?: string;
}

export function MetricGrid({ metrics, columnsClassName = 'md:grid-cols-3' }: MetricGridProps) {
  return (
    <div className={`grid gap-3 ${columnsClassName}`}>
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
          <p className="mt-2 text-xl font-semibold text-white break-words">{metric.value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{metric.detail}</p>
        </div>
      ))}
    </div>
  );
}
