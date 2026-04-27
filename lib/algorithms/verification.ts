import { formatRoutePath } from '@/lib/utils';
import { riskAwareDijkstra, runDijkstraToyVerification } from '@/lib/algorithms/dijkstra';
import { priorityAllocate, runPriorityAllocationToyVerification } from '@/lib/algorithms/priorityAllocation';
import { defaultScenario } from '@/lib/data/scenarios';
import { AlgorithmVerificationResult, CombinedOptimizationResult, Scenario } from '@/lib/types';

function formatList(values: string[]) {
  return formatRoutePath(values);
}

// Runs the full decision pipeline for a single scenario by ranking demand
// locations first and then routing to the highest-priority destination.
export function buildCombinedOptimizationResult(
  scenario: Scenario,
  riskWeight = 5,
): CombinedOptimizationResult {
  const allocationSummary = priorityAllocate(scenario);
  const highestPriorityShelter = allocationSummary.rankedShelters[0];

  if (!highestPriorityShelter) {
    throw new Error(`Scenario ${scenario.id} does not contain any shelters to optimize.`);
  }

  const selectedAllocationResult = allocationSummary.allocationResults.find(
    (result) => result.shelterId === highestPriorityShelter.shelterId,
  );

  if (!selectedAllocationResult) {
    throw new Error(`Allocation result for shelter ${highestPriorityShelter.shelterId} was not generated.`);
  }

  const selectedRoute = riskAwareDijkstra(
    scenario,
    scenario.warehouse.id,
    highestPriorityShelter.shelterId,
    riskWeight,
  );

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    warehouseId: scenario.warehouse.id,
    riskWeight,
    allocationSummary,
    highestPriorityShelter,
    selectedAllocationResult,
    selectedRoute,
  };
}

export function buildVerificationCases(scenario: Scenario = defaultScenario): AlgorithmVerificationResult[] {
  const allocationToyVerification = runPriorityAllocationToyVerification();
  const dijkstraToyVerification = runDijkstraToyVerification();
  const combinedResult = buildCombinedOptimizationResult(scenario, 5);

  return [
    {
      title: 'Priority allocation ranks the clinic first in the toy example',
      description: 'A small three-site allocation example checks whether the weighting formula prioritizes the strongest combined urgency and medical pressure.',
      input:
        'Three sites: Alpha Shelter, Bravo Clinic, Charlie Camp. Limited stock: 120 food kits, 70 medicine kits, 160 water units.',
      expectedReasoning:
        'Bravo Clinic should rank first because it combines maximum urgency and medical need, so it receives stock before the other two sites.',
      actualOutput: `Ranking: ${allocationToyVerification.rankedShelterNames.join(' > ')}. ${allocationToyVerification.summary}`,
      passed: allocationToyVerification.passed,
      scenarioId: scenario.id,
      algorithmName: 'priority-allocation',
    },
    {
      title: 'Risk-aware Dijkstra chooses the safer detour in the toy graph',
      description: 'A four-node graph demonstrates that the selected path can be longer in distance but lower in weighted risk cost.',
      input:
        'Source S to destination D with two choices: S-A-D is shorter but high risk, S-B-D is longer but low risk. Risk weight = 4.',
      expectedReasoning:
        'The algorithm should reject the shorter dangerous route and select S → B → D because its weighted cost is lower once risk is included.',
      actualOutput: `Selected path: ${formatList(dijkstraToyVerification.observedPath)}. ${dijkstraToyVerification.summary}`,
      passed: dijkstraToyVerification.passed,
      scenarioId: scenario.id,
      algorithmName: 'risk-aware-dijkstra',
    },
    {
      title: 'Combined pipeline targets the top-ranked shelter and routes to it',
      description: 'This verification checks the end-to-end decision flow used by the application for a selected humanitarian scenario.',
      input: `Scenario ${scenario.name} with warehouse ${scenario.warehouse.name}, ${scenario.shelters.length} sites, and risk weight 5.`,
      expectedReasoning:
        'The pipeline should first identify the highest-priority shelter from the allocation ranking, then compute a valid risk-aware route from the warehouse to that same destination.',
      actualOutput:
        `Top shelter: ${combinedResult.highestPriorityShelter.shelterName} (rank ${combinedResult.highestPriorityShelter.rank}, score ${combinedResult.highestPriorityShelter.priorityScore}). ` +
        `Allocated: food ${combinedResult.selectedAllocationResult.allocatedFood}, medicine ${combinedResult.selectedAllocationResult.allocatedMedicine}, water ${combinedResult.selectedAllocationResult.allocatedWater}. ` +
        `Route: ${combinedResult.selectedRoute.routeExists ? formatList(combinedResult.selectedRoute.pathNodeNames) : 'No route found'} ` +
        `(cost ${combinedResult.selectedRoute.totalWeightedCost}, distance ${combinedResult.selectedRoute.totalDistanceKm} km).`,
      passed:
        combinedResult.selectedRoute.routeExists &&
        combinedResult.selectedRoute.destinationNodeId === combinedResult.highestPriorityShelter.shelterId &&
        combinedResult.selectedAllocationResult.rank === 1,
      scenarioId: scenario.id,
      algorithmName: 'combined-decision-pipeline',
    },
  ];
}
