import { CrisisNode, Road, RouteResult, RouteStep, Scenario } from '@/lib/types';

interface AdjacencyEdge {
  fromNodeId: string;
  toNodeId: string;
  distanceKm: number;
  riskScore: number;
  weightedCost: number;
}

interface QueueNode {
  nodeId: string;
  totalWeightedCost: number;
}

interface PathState {
  totalDistanceKm: number;
  totalRisk: number;
  totalWeightedCost: number;
  previousNodeId: string | null;
}

interface ToyRouteVerificationResult {
  passed: boolean;
  expectedPath: string[];
  observedPath: string[];
  summary: string;
}

function roundToTwo(value: number) {
  return Number(value.toFixed(2));
}

// Collects every warehouse and shelter-like site into a shared lookup used for readable route output.
function getNodeLookup(scenario: Scenario) {
  const nodes: CrisisNode[] = [scenario.warehouse, ...scenario.shelters];
  return new Map(nodes.map((node) => [node.id, node]));
}

// Converts one undirected road into the weighted routing cost used by Dijkstra.
function getEdgeCost(distanceKm: number, riskScore: number, riskWeight: number) {
  return distanceKm + riskWeight * riskScore;
}

// Builds an undirected adjacency list while skipping blocked roads.
export function buildAdjacencyList(scenario: Scenario, riskWeight: number) {
  const adjacency = new Map<string, AdjacencyEdge[]>();

  scenario.roads
    .filter((road) => !road.blocked)
    .forEach((road) => {
      const forwardEdge: AdjacencyEdge = {
        fromNodeId: road.fromNodeId,
        toNodeId: road.toNodeId,
        distanceKm: road.distanceKm,
        riskScore: road.riskScore,
        weightedCost: roundToTwo(getEdgeCost(road.distanceKm, road.riskScore, riskWeight)),
      };

      const reverseEdge: AdjacencyEdge = {
        fromNodeId: road.toNodeId,
        toNodeId: road.fromNodeId,
        distanceKm: road.distanceKm,
        riskScore: road.riskScore,
        weightedCost: roundToTwo(getEdgeCost(road.distanceKm, road.riskScore, riskWeight)),
      };

      adjacency.set(road.fromNodeId, [...(adjacency.get(road.fromNodeId) ?? []), forwardEdge]);
      adjacency.set(road.toNodeId, [...(adjacency.get(road.toNodeId) ?? []), reverseEdge]);
    });

  return adjacency;
}

// Reconstructs the selected node-id path from the Dijkstra predecessor map.
export function reconstructPath(states: Map<string, PathState>, sourceNodeId: string, destinationNodeId: string) {
  const pathNodeIds: string[] = [];
  let currentNodeId: string | null = destinationNodeId;

  while (currentNodeId) {
    pathNodeIds.unshift(currentNodeId);

    if (currentNodeId === sourceNodeId) {
      break;
    }

    currentNodeId = states.get(currentNodeId)?.previousNodeId ?? null;
  }

  return pathNodeIds[0] === sourceNodeId ? pathNodeIds : [];
}

// Expands the chosen node path into human-readable steps with per-edge distance,
// risk, and weighted cost details for the results and map views.
function buildRouteSteps(
  pathNodeIds: string[],
  adjacency: Map<string, AdjacencyEdge[]>,
  nodeLookup: Map<string, CrisisNode>,
): RouteStep[] {
  return pathNodeIds.slice(0, -1).map((fromNodeId, index) => {
    const toNodeId = pathNodeIds[index + 1];
    const edge = (adjacency.get(fromNodeId) ?? []).find((candidate) => candidate.toNodeId === toNodeId);
    const fromNodeName = nodeLookup.get(fromNodeId)?.name ?? fromNodeId;
    const toNodeName = nodeLookup.get(toNodeId)?.name ?? toNodeId;

    if (!edge) {
      throw new Error(`Missing edge from ${fromNodeId} to ${toNodeId}`);
    }

    return {
      fromNodeId,
      fromNodeName,
      toNodeId,
      toNodeName,
      distanceKm: edge.distanceKm,
      riskScore: edge.riskScore,
      weightedCost: edge.weightedCost,
    };
  });
}

// Runs Dijkstra's algorithm on the undirected road network using
// distance plus risk-weighted risk as the edge cost.
// Blocked roads are filtered out before search so only feasible links are explored.
export function riskAwareDijkstra(
  scenario: Scenario,
  sourceNodeId: string,
  destinationNodeId: string,
  riskWeight: number,
): RouteResult {
  const adjacency = buildAdjacencyList(scenario, riskWeight);
  const nodeLookup = getNodeLookup(scenario);
  const queue: QueueNode[] = [{ nodeId: sourceNodeId, totalWeightedCost: 0 }];
  const states = new Map<string, PathState>([
    [
      sourceNodeId,
      {
        totalDistanceKm: 0,
        totalRisk: 0,
        totalWeightedCost: 0,
        previousNodeId: null,
      },
    ],
  ]);

  while (queue.length > 0) {
    queue.sort((left, right) => left.totalWeightedCost - right.totalWeightedCost);
    const current = queue.shift();

    if (!current) {
      break;
    }

    if (current.nodeId === destinationNodeId) {
      break;
    }

    const currentState = states.get(current.nodeId);
    if (!currentState) {
      continue;
    }

    for (const edge of adjacency.get(current.nodeId) ?? []) {
      const nextWeightedCost = currentState.totalWeightedCost + edge.weightedCost;
      const existingState = states.get(edge.toNodeId);

      if (!existingState || nextWeightedCost < existingState.totalWeightedCost) {
        states.set(edge.toNodeId, {
          totalDistanceKm: currentState.totalDistanceKm + edge.distanceKm,
          totalRisk: currentState.totalRisk + edge.riskScore,
          totalWeightedCost: nextWeightedCost,
          previousNodeId: current.nodeId,
        });

        queue.push({
          nodeId: edge.toNodeId,
          totalWeightedCost: nextWeightedCost,
        });
      }
    }
  }

  const finalState = states.get(destinationNodeId);
  const pathNodeIds = finalState ? reconstructPath(states, sourceNodeId, destinationNodeId) : [];
  const routeExists = pathNodeIds.length > 0;
  const pathNodeNames = pathNodeIds.map((nodeId) => nodeLookup.get(nodeId)?.name ?? nodeId);
  const steps = routeExists ? buildRouteSteps(pathNodeIds, adjacency, nodeLookup) : [];

  return {
    sourceNodeId,
    destinationNodeId,
    destinationNodeName: nodeLookup.get(destinationNodeId)?.name ?? destinationNodeId,
    pathNodeIds,
    pathNodeNames,
    steps,
    totalDistanceKm: roundToTwo(finalState?.totalDistanceKm ?? 0),
    totalRisk: roundToTwo(finalState?.totalRisk ?? 0),
    totalWeightedCost: roundToTwo(finalState?.totalWeightedCost ?? 0),
    routeExists,
  };
}

// Generates one route result per destination site so the UI can compare reachability
// across the full scenario without changing the core shortest-path routine.
export function getAllRoutes(scenario: Scenario, riskWeight = 5) {
  return scenario.shelters.map((shelter) => riskAwareDijkstra(scenario, scenario.warehouse.id, shelter.id, riskWeight));
}

// Small graph designed to show that the safer route can win even when it is longer
// in raw distance once risk is included in the weighted cost calculation.
export function runDijkstraToyVerification(): ToyRouteVerificationResult {
  const toyScenario: Scenario = {
    id: 'toy-dijkstra-verification',
    name: 'Toy Dijkstra Verification',
    description: 'Small graph where the safest route is not the shortest route.',
    warehouse: {
      id: 'S',
      name: 'Source Depot',
      nodeType: 'warehouse',
    },
    supplyInventory: {
      foodKits: 0,
      medicineKits: 0,
      waterUnits: 0,
    },
    shelters: [
      {
        id: 'A',
        name: 'Alpha Junction',
        nodeType: 'shelter',
        population: 1,
        urgencyScore: 1,
        foodDemand: 0,
        medicineDemand: 0,
        waterDemand: 0,
        medicalNeedScore: 1,
        accessibilityRiskScore: 1,
      },
      {
        id: 'B',
        name: 'Bravo Bypass',
        nodeType: 'camp',
        population: 1,
        urgencyScore: 1,
        foodDemand: 0,
        medicineDemand: 0,
        waterDemand: 0,
        medicalNeedScore: 1,
        accessibilityRiskScore: 1,
      },
      {
        id: 'D',
        name: 'Delta Clinic',
        nodeType: 'clinic',
        population: 1,
        urgencyScore: 1,
        foodDemand: 0,
        medicineDemand: 0,
        waterDemand: 0,
        medicalNeedScore: 1,
        accessibilityRiskScore: 1,
      },
    ],
    roads: [
      { id: 'TD1', fromNodeId: 'S', toNodeId: 'A', distanceKm: 3, riskScore: 9, blocked: false },
      { id: 'TD2', fromNodeId: 'A', toNodeId: 'D', distanceKm: 3, riskScore: 9, blocked: false },
      { id: 'TD3', fromNodeId: 'S', toNodeId: 'B', distanceKm: 5, riskScore: 1, blocked: false },
      { id: 'TD4', fromNodeId: 'B', toNodeId: 'D', distanceKm: 5, riskScore: 1, blocked: false },
    ],
  };

  const result = riskAwareDijkstra(toyScenario, 'S', 'D', 4);
  const expectedPath = ['S', 'B', 'D'];
  const observedPath = result.pathNodeIds;
  const passed = expectedPath.join('|') === observedPath.join('|');

  return {
    passed,
    expectedPath,
    observedPath,
    summary: `Observed ${observedPath.join(' → ')} with weighted cost ${result.totalWeightedCost}`,
  };
}
