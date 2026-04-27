import type { ComponentType, ReactNode } from 'react';

export type SupplyType = 'Food' | 'Medicine' | 'Water';

export type ShelterType = 'shelter' | 'clinic' | 'camp' | 'hospital' | 'village';

export type NodeType = 'warehouse' | ShelterType;

// Shared node shape used by the graph view and routing outputs.
export interface CrisisNode {
  id: string;
  name: string;
  nodeType: NodeType;
}

// Demand-side locations extend the base node with operational metrics.
export interface Shelter extends CrisisNode {
  nodeType: ShelterType;
  population: number;
  urgencyScore: number;
  foodDemand: number;
  medicineDemand: number;
  waterDemand: number;
  medicalNeedScore: number;
  accessibilityRiskScore: number;
}

export interface Road {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  distanceKm: number;
  riskScore: number;
  blocked: boolean;
}

export interface SupplyInventory {
  foodKits: number;
  medicineKits: number;
  waterUnits: number;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  warehouse: CrisisNode & { nodeType: 'warehouse' };
  shelters: Shelter[];
  roads: Road[];
  supplyInventory: SupplyInventory;
}

export interface DemandTotals {
  food: number;
  medicine: number;
  water: number;
}

export interface PriorityBreakdown {
  normalizedUrgency: number;
  normalizedPopulationNeed: number;
  normalizedMedicalNeed: number;
  normalizedAccessibilityRisk: number;
  urgencyContribution: number;
  populationContribution: number;
  medicalContribution: number;
  accessibilityContribution: number;
  finalScore: number;
}

export interface RankedShelter {
  shelterId: string;
  shelterName: string;
  shelterType: ShelterType;
  priorityScore: number;
  rank: number;
  priorityBreakdown: PriorityBreakdown;
}

export interface ShelterAllocationResult {
  shelterId: string;
  shelterName: string;
  shelterType: ShelterType;
  rank: number;
  priorityScore: number;
  priorityBreakdown: PriorityBreakdown;
  allocatedFood: number;
  allocatedMedicine: number;
  allocatedWater: number;
  unmetFoodDemand: number;
  unmetMedicineDemand: number;
  unmetWaterDemand: number;
  totalUnmetDemand: number;
}

export interface AllocationSummary {
  rankedShelters: RankedShelter[];
  allocationResults: ShelterAllocationResult[];
  remainingSupplies: SupplyInventory;
  totalDemand: DemandTotals;
  totalAllocated: DemandTotals;
  totalUnmetDemand: DemandTotals & { combined: number };
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface InsightMetric {
  label: string;
  value: string | number;
  detail: string;
  icon?: ComponentType<{ className?: string }>;
  tone?: string;
}

export interface ChartCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export interface RouteStep {
  fromNodeId: string;
  fromNodeName: string;
  toNodeId: string;
  toNodeName: string;
  distanceKm: number;
  riskScore: number;
  weightedCost: number;
}

export interface RouteResult {
  sourceNodeId: string;
  destinationNodeId: string;
  destinationNodeName: string;
  pathNodeIds: string[];
  pathNodeNames: string[];
  steps: RouteStep[];
  totalDistanceKm: number;
  totalRisk: number;
  totalWeightedCost: number;
  routeExists: boolean;
}

// Combined optimization output ties resource prioritization to route selection.
export interface CombinedOptimizationResult {
  scenarioId: string;
  scenarioName: string;
  warehouseId: string;
  riskWeight: number;
  allocationSummary: AllocationSummary;
  highestPriorityShelter: RankedShelter;
  selectedAllocationResult: ShelterAllocationResult;
  selectedRoute: RouteResult;
}

export interface AlgorithmVerificationResult {
  title: string;
  description: string;
  input: string;
  expectedReasoning: string;
  actualOutput: string;
  passed: boolean;
  scenarioId: string;
  algorithmName: 'priority-allocation' | 'risk-aware-dijkstra' | 'combined-decision-pipeline';
}
