import { buildNodeNameLookup } from '@/lib/utils';
import { Road, Scenario } from '@/lib/types';

interface RoadTableProps {
  roads: Road[];
  scenario?: Scenario;
}

export function RoadTable({ roads, scenario }: RoadTableProps) {
  const nodeNameLookup = scenario ? buildNodeNameLookup(scenario) : new Map<string, string>();

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-left text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">To</th>
              <th className="px-4 py-3 font-medium">Distance</th>
              <th className="px-4 py-3 font-medium">Risk</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {roads.map((road) => {
              const fromName = nodeNameLookup.get(road.fromNodeId) ?? road.fromNodeId;
              const toName = nodeNameLookup.get(road.toNodeId) ?? road.toNodeId;

              return (
                <tr key={road.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-white">{fromName}</td>
                  <td className="px-4 py-3 font-medium text-white">{toName}</td>
                  <td className="px-4 py-3">{road.distanceKm} km</td>
                  <td className="px-4 py-3">{road.riskScore}/10</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        road.blocked ? 'bg-red-500/15 text-red-300' : 'bg-emerald-500/15 text-emerald-300'
                      }`}
                    >
                      {road.blocked ? 'Blocked' : 'Open'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
