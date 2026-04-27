import {
  AllocationSummary,
  PriorityBreakdown,
  RankedShelter,
  Scenario,
  Shelter,
  ShelterAllocationResult,
  SupplyInventory,
} from '@/lib/types';

interface NormalizationContext {
  maxUrgency: number;
  maxPopulation: number;
  maxMedicalNeed: number;
  maxAccessibilityRisk: number;
}

interface ToyVerificationResult {
  passed: boolean;
  rankedShelterNames: string[];
  remainingSupplies: SupplyInventory;
  summary: string;
}

function roundToThree(value: number) {
  return Number(value.toFixed(3));
}

// Uses scenario-wide maxima to place all scoring factors on a comparable 0-1 scale.
function buildNormalizationContext(shelters: Shelter[]): NormalizationContext {
  return {
    maxUrgency: Math.max(...shelters.map((shelter) => shelter.urgencyScore), 1),
    maxPopulation: Math.max(...shelters.map((shelter) => shelter.population), 1),
    maxMedicalNeed: Math.max(...shelters.map((shelter) => shelter.medicalNeedScore), 1),
    maxAccessibilityRisk: Math.max(...shelters.map((shelter) => shelter.accessibilityRiskScore), 1),
  };
}

// Applies the weighted priority formula to one shelter and preserves each contribution
// so the results page can explain why a site was ranked highly.
function buildPriorityBreakdown(shelter: Shelter, context: NormalizationContext): PriorityBreakdown {
  const normalizedUrgency = shelter.urgencyScore / context.maxUrgency;
  const normalizedPopulationNeed = shelter.population / context.maxPopulation;
  const normalizedMedicalNeed = shelter.medicalNeedScore / context.maxMedicalNeed;
  const normalizedAccessibilityRisk = shelter.accessibilityRiskScore / context.maxAccessibilityRisk;

  const urgencyContribution = 0.35 * normalizedUrgency;
  const populationContribution = 0.25 * normalizedPopulationNeed;
  const medicalContribution = 0.25 * normalizedMedicalNeed;
  const accessibilityContribution = 0.15 * normalizedAccessibilityRisk;
  const finalScore = urgencyContribution + populationContribution + medicalContribution + accessibilityContribution;

  return {
    normalizedUrgency: roundToThree(normalizedUrgency),
    normalizedPopulationNeed: roundToThree(normalizedPopulationNeed),
    normalizedMedicalNeed: roundToThree(normalizedMedicalNeed),
    normalizedAccessibilityRisk: roundToThree(normalizedAccessibilityRisk),
    urgencyContribution: roundToThree(urgencyContribution),
    populationContribution: roundToThree(populationContribution),
    medicalContribution: roundToThree(medicalContribution),
    accessibilityContribution: roundToThree(accessibilityContribution),
    finalScore: roundToThree(finalScore),
  };
}

// Produces a descending ranking that becomes the fixed order for greedy allocation.
// The returned ranks are reused directly by the tables and charts.
function buildRankedShelters(shelters: Shelter[]): RankedShelter[] {
  const context = buildNormalizationContext(shelters);

  return shelters
    .map((shelter) => {
      const priorityBreakdown = buildPriorityBreakdown(shelter, context);

      return {
        shelterId: shelter.id,
        shelterName: shelter.name,
        shelterType: shelter.nodeType,
        priorityScore: priorityBreakdown.finalScore,
        priorityBreakdown,
      };
    })
    .sort((left, right) => right.priorityScore - left.priorityScore)
    .map((shelter, index) => ({
      ...shelter,
      rank: index + 1,
    }));
}

// Aggregates scenario demand before allocation so charts can compare need,
// delivered supply, and remaining shortfall.
function buildDemandTotals(shelters: Shelter[]) {
  return shelters.reduce(
    (totals, shelter) => ({
      food: totals.food + shelter.foodDemand,
      medicine: totals.medicine + shelter.medicineDemand,
      water: totals.water + shelter.waterDemand,
    }),
    { food: 0, medicine: 0, water: 0 },
  );
}

// Allocates each supply category independently so shortages in one category do not
// prevent allocation of the others for the current shelter.
function allocateForShelter(
  shelter: Shelter,
  rank: number,
  priorityScore: number,
  priorityBreakdown: PriorityBreakdown,
  remainingSupplies: SupplyInventory,
): ShelterAllocationResult {
  const allocatedFood = Math.min(remainingSupplies.foodKits, shelter.foodDemand);
  remainingSupplies.foodKits -= allocatedFood;

  const allocatedMedicine = Math.min(remainingSupplies.medicineKits, shelter.medicineDemand);
  remainingSupplies.medicineKits -= allocatedMedicine;

  const allocatedWater = Math.min(remainingSupplies.waterUnits, shelter.waterDemand);
  remainingSupplies.waterUnits -= allocatedWater;

  const unmetFoodDemand = shelter.foodDemand - allocatedFood;
  const unmetMedicineDemand = shelter.medicineDemand - allocatedMedicine;
  const unmetWaterDemand = shelter.waterDemand - allocatedWater;

  return {
    shelterId: shelter.id,
    shelterName: shelter.name,
    shelterType: shelter.nodeType,
    rank,
    priorityScore,
    priorityBreakdown,
    allocatedFood,
    allocatedMedicine,
    allocatedWater,
    unmetFoodDemand,
    unmetMedicineDemand,
    unmetWaterDemand,
    totalUnmetDemand: unmetFoodDemand + unmetMedicineDemand + unmetWaterDemand,
  };
}

// Totals the units successfully delivered across all destinations.
function buildTotalAllocated(allocationResults: ShelterAllocationResult[]) {
  return allocationResults.reduce(
    (totals, result) => ({
      food: totals.food + result.allocatedFood,
      medicine: totals.medicine + result.allocatedMedicine,
      water: totals.water + result.allocatedWater,
    }),
    { food: 0, medicine: 0, water: 0 },
  );
}

// Totals unmet demand after allocation to make shortages visible by category and overall.
function buildTotalUnmetDemand(allocationResults: ShelterAllocationResult[]) {
  const totals = allocationResults.reduce(
    (currentTotals, result) => ({
      food: currentTotals.food + result.unmetFoodDemand,
      medicine: currentTotals.medicine + result.unmetMedicineDemand,
      water: currentTotals.water + result.unmetWaterDemand,
    }),
    { food: 0, medicine: 0, water: 0 },
  );

  return {
    ...totals,
    combined: totals.food + totals.medicine + totals.water,
  };
}

// Computes shelter priority from normalized urgency, population need,
// medical need, and accessibility risk before allocating limited supplies.
// The ranking order is preserved while inventory is consumed one shelter at a time.
// This keeps the algorithm behavior simple, deterministic, and easy to explain.
export function priorityAllocate(scenario: Scenario): AllocationSummary {
  const rankedShelters = buildRankedShelters(scenario.shelters);
  const shelterById = new Map(scenario.shelters.map((shelter) => [shelter.id, shelter]));
  const remainingSupplies: SupplyInventory = { ...scenario.supplyInventory };

  const allocationResults = rankedShelters.map((rankedShelter) => {
    const shelter = shelterById.get(rankedShelter.shelterId);

    if (!shelter) {
      throw new Error(`Shelter ${rankedShelter.shelterId} not found in scenario ${scenario.id}`);
    }

    return allocateForShelter(
      shelter,
      rankedShelter.rank,
      rankedShelter.priorityScore,
      rankedShelter.priorityBreakdown,
      remainingSupplies,
    );
  });

  return {
    rankedShelters,
    allocationResults,
    remainingSupplies,
    totalDemand: buildDemandTotals(scenario.shelters),
    totalAllocated: buildTotalAllocated(allocationResults),
    totalUnmetDemand: buildTotalUnmetDemand(allocationResults),
  };
}

// Small deterministic example used by the algorithms page and report to confirm
// that the weighted ranking and greedy allocation behave as expected.
// It is intentionally compact so the expected order and shortfalls are easy to verify manually.
export function runPriorityAllocationToyVerification(): ToyVerificationResult {
  const toyScenario: Scenario = {
    id: 'toy-priority-allocation',
    name: 'Toy Priority Allocation',
    description: 'Simple verification scenario for three shelters.',
    warehouse: {
      id: 'T0',
      name: 'Toy Warehouse',
      nodeType: 'warehouse',
    },
    roads: [],
    supplyInventory: {
      foodKits: 120,
      medicineKits: 70,
      waterUnits: 160,
    },
    shelters: [
      {
        id: 'T1',
        name: 'Alpha Shelter',
        nodeType: 'shelter',
        population: 300,
        urgencyScore: 9,
        foodDemand: 70,
        medicineDemand: 20,
        waterDemand: 90,
        medicalNeedScore: 6,
        accessibilityRiskScore: 5,
      },
      {
        id: 'T2',
        name: 'Bravo Clinic',
        nodeType: 'clinic',
        population: 180,
        urgencyScore: 10,
        foodDemand: 30,
        medicineDemand: 40,
        waterDemand: 30,
        medicalNeedScore: 10,
        accessibilityRiskScore: 7,
      },
      {
        id: 'T3',
        name: 'Charlie Camp',
        nodeType: 'camp',
        population: 420,
        urgencyScore: 7,
        foodDemand: 80,
        medicineDemand: 30,
        waterDemand: 80,
        medicalNeedScore: 5,
        accessibilityRiskScore: 4,
      },
    ],
  };

  const result = priorityAllocate(toyScenario);
  const rankedShelterNames = result.rankedShelters.map((item) => item.shelterName);
  const passed =
    rankedShelterNames[0] === 'Bravo Clinic' &&
    result.totalAllocated.food === 120 &&
    result.totalAllocated.medicine === 70 &&
    result.totalAllocated.water === 160;

  return {
    passed,
    rankedShelterNames,
    remainingSupplies: result.remainingSupplies,
    summary: `Top-ranked shelter: ${rankedShelterNames[0] ?? 'None'}; total unmet demand: ${result.totalUnmetDemand.combined}`,
  };
}
