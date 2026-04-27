import { AllocationSummary } from '@/lib/types';
import { formatPercent } from '@/lib/utils';

interface AllocationTableProps {
  allocationSummary: AllocationSummary;
  highlightedShelterId?: string;
}

function buildFulfillmentPercent(allocated: number, unmet: number) {
  const demand = allocated + unmet;

  if (demand === 0) {
    return '0%';
  }

  return formatPercent(allocated / demand);
}

export function AllocationTable({ allocationSummary, highlightedShelterId }: AllocationTableProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300">
          <p className="text-slate-500">Total allocated</p>
          <p className="mt-2 text-white">Food {allocationSummary.totalAllocated.food}</p>
          <p className="text-white">Medicine {allocationSummary.totalAllocated.medicine}</p>
          <p className="text-white">Water {allocationSummary.totalAllocated.water}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300">
          <p className="text-slate-500">Remaining supplies</p>
          <p className="mt-2 text-white">Food {allocationSummary.remainingSupplies.foodKits}</p>
          <p className="text-white">Medicine {allocationSummary.remainingSupplies.medicineKits}</p>
          <p className="text-white">Water {allocationSummary.remainingSupplies.waterUnits}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300">
          <p className="text-slate-500">Total unmet demand</p>
          <p className="mt-2 text-white">Food {allocationSummary.totalUnmetDemand.food}</p>
          <p className="text-white">Medicine {allocationSummary.totalUnmetDemand.medicine}</p>
          <p className="text-white">Water {allocationSummary.totalUnmetDemand.water}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/5 text-left text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Rank</th>
                <th className="px-4 py-3 font-medium">Site</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Allocated</th>
                <th className="px-4 py-3 font-medium">Unmet</th>
                <th className="px-4 py-3 font-medium">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {allocationSummary.allocationResults.map((allocation) => {
                const isHighlighted = allocation.shelterId === highlightedShelterId;

                return (
                  <tr
                    key={allocation.shelterId}
                    className={isHighlighted ? 'bg-emerald-400/10' : 'hover:bg-white/5'}
                  >
                    <td className="px-4 py-3">#{allocation.rank}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-white">{allocation.shelterName}</span>
                        <span className="text-xs uppercase tracking-[0.16em] text-slate-400">{allocation.shelterType}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{allocation.priorityScore.toFixed(3)}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-1 text-xs sm:text-sm">
                        <p>Food {allocation.allocatedFood}</p>
                        <p>Medicine {allocation.allocatedMedicine}</p>
                        <p>Water {allocation.allocatedWater}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1 text-xs sm:text-sm">
                        <p>Food {allocation.unmetFoodDemand}</p>
                        <p>Medicine {allocation.unmetMedicineDemand}</p>
                        <p>Water {allocation.unmetWaterDemand}</p>
                        <p className="font-medium text-amber-300">Total {allocation.totalUnmetDemand}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1 text-xs sm:text-sm">
                        <p>Food {buildFulfillmentPercent(allocation.allocatedFood, allocation.unmetFoodDemand)}</p>
                        <p>Medicine {buildFulfillmentPercent(allocation.allocatedMedicine, allocation.unmetMedicineDemand)}</p>
                        <p>Water {buildFulfillmentPercent(allocation.allocatedWater, allocation.unmetWaterDemand)}</p>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
