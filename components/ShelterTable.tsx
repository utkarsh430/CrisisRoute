import { Shelter } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

interface ShelterTableProps {
  shelters: Shelter[];
}

export function ShelterTable({ shelters }: ShelterTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-left text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Population</th>
              <th className="px-4 py-3 font-medium">Urgency</th>
              <th className="px-4 py-3 font-medium">Food demand</th>
              <th className="px-4 py-3 font-medium">Medicine demand</th>
              <th className="px-4 py-3 font-medium">Water demand</th>
              <th className="px-4 py-3 font-medium">Medical need</th>
              <th className="px-4 py-3 font-medium">Accessibility risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {shelters.map((shelter) => (
              <tr key={shelter.id} className="hover:bg-white/5">
                <td className="px-4 py-3 font-medium text-white">{shelter.name}</td>
                <td className="px-4 py-3 capitalize">{shelter.nodeType}</td>
                <td className="px-4 py-3">{formatNumber(shelter.population)}</td>
                <td className="px-4 py-3">{shelter.urgencyScore}/10</td>
                <td className="px-4 py-3">{formatNumber(shelter.foodDemand)}</td>
                <td className="px-4 py-3">{formatNumber(shelter.medicineDemand)}</td>
                <td className="px-4 py-3">{formatNumber(shelter.waterDemand)}</td>
                <td className="px-4 py-3">{shelter.medicalNeedScore}/10</td>
                <td className="px-4 py-3">{shelter.accessibilityRiskScore}/10</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
