'use client';

import 'reactflow/dist/style.css';
import ReactFlow, { Background, Controls, Edge, MiniMap, Node } from 'reactflow';
import { RouteResult, Scenario, ShelterType } from '@/lib/types';

interface CrisisGraphProps {
  scenario: Scenario;
  recommendedRoute?: RouteResult;
  highlightedShelterId?: string;
}

const positions: Record<string, { x: number; y: number }> = {
  U0: { x: 30, y: 200 },
  U1: { x: 260, y: 60 },
  U2: { x: 300, y: 200 },
  U3: { x: 540, y: 70 },
  U4: { x: 590, y: 220 },
  U5: { x: 260, y: 350 },
  U6: { x: 540, y: 360 },
  R0: { x: 40, y: 210 },
  R1: { x: 280, y: 60 },
  R2: { x: 330, y: 220 },
  R3: { x: 560, y: 80 },
  R4: { x: 250, y: 370 },
  R5: { x: 590, y: 290 },
  R6: { x: 830, y: 180 },
  P0: { x: 40, y: 220 },
  P1: { x: 260, y: 80 },
  P2: { x: 280, y: 270 },
  P3: { x: 500, y: 160 },
  P4: { x: 560, y: 340 },
  P5: { x: 820, y: 210 },
  P6: { x: 520, y: 40 },
};

const sitePalette: Record<ShelterType, { background: string; border: string }> = {
  shelter: { background: 'rgba(56,189,248,0.18)', border: 'rgba(125,211,252,0.7)' },
  clinic: { background: 'rgba(168,85,247,0.18)', border: 'rgba(196,181,253,0.7)' },
  camp: { background: 'rgba(245,158,11,0.18)', border: 'rgba(252,211,77,0.75)' },
  hospital: { background: 'rgba(244,63,94,0.18)', border: 'rgba(253,164,175,0.75)' },
  village: { background: 'rgba(45,212,191,0.18)', border: 'rgba(153,246,228,0.7)' },
};

function buildRecommendedRoadSet(recommendedRoute?: RouteResult) {
  const routePairs = new Set<string>();

  recommendedRoute?.steps.forEach((step) => {
    routePairs.add(`${step.fromNodeId}:${step.toNodeId}`);
    routePairs.add(`${step.toNodeId}:${step.fromNodeId}`);
  });

  return routePairs;
}

function buildPosition(nodeId: string, index: number) {
  if (positions[nodeId]) {
    return positions[nodeId];
  }

  const column = index % 3;
  const row = Math.floor(index / 3);

  return {
    x: 240 + column * 250,
    y: 80 + row * 160,
  };
}

function getNodeStyle(nodeType: ShelterType | 'warehouse', highlighted = false) {
  if (nodeType === 'warehouse') {
    return {
      background: highlighted ? 'rgba(16,185,129,0.34)' : 'rgba(16,185,129,0.22)',
      border: highlighted ? 'rgba(167,243,208,0.95)' : 'rgba(110,231,183,0.7)',
    };
  }

  const palette = sitePalette[nodeType];

  return {
    background: highlighted ? palette.background.replace('0.18', '0.3') : palette.background,
    border: highlighted ? 'rgba(255,255,255,0.95)' : palette.border,
  };
}

export function CrisisGraph({ scenario, recommendedRoute, highlightedShelterId }: CrisisGraphProps) {
  const recommendedRoads = buildRecommendedRoadSet(recommendedRoute);

  const nodes: Node[] = [
    {
      id: scenario.warehouse.id,
      position: buildPosition(scenario.warehouse.id, 0),
      data: {
        label: (
          <div className="space-y-1 text-left">
            <div className="font-semibold text-white">{scenario.warehouse.name}</div>
            <div className="text-xs uppercase tracking-[0.16em] text-emerald-100">Warehouse / Depot</div>
          </div>
        ),
      },
      draggable: false,
      selectable: false,
      style: {
        width: 210,
        borderRadius: 20,
        border: `1px solid ${getNodeStyle('warehouse', true).border}`,
        background: getNodeStyle('warehouse', true).background,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 18px 45px rgba(2,8,23,0.45)',
        color: 'white',
      },
    },
    ...scenario.shelters.map((shelter, index) => {
      const isRecommended = shelter.id === highlightedShelterId;
      const style = getNodeStyle(shelter.nodeType, isRecommended);

      return {
        id: shelter.id,
        position: buildPosition(shelter.id, index + 1),
        draggable: false,
        selectable: false,
        data: {
          label: (
            <div className="space-y-1 text-left">
              <div className="font-semibold text-white">{shelter.name}</div>
              <div className="text-xs uppercase tracking-[0.16em] text-slate-200">{shelter.nodeType}</div>
              <div className="text-[11px] text-slate-300">Urgency {shelter.urgencyScore} • Risk {shelter.accessibilityRiskScore}</div>
            </div>
          ),
        },
        style: {
          width: 195,
          borderRadius: 18,
          border: `1px solid ${style.border}`,
          background: style.background,
          boxShadow: isRecommended
            ? '0 0 0 1px rgba(255,255,255,0.08), 0 0 24px rgba(52,211,153,0.28)'
            : '0 0 0 1px rgba(255,255,255,0.03), 0 12px 32px rgba(2,8,23,0.32)',
          color: 'white',
        },
      };
    }),
  ];

  const edges: Edge[] = scenario.roads.map((road) => {
    const isRecommended = recommendedRoads.has(`${road.fromNodeId}:${road.toNodeId}`);
    const isHighRisk = road.riskScore >= 7;

    let stroke = '#38bdf8';
    let strokeWidth = 2.5;
    let strokeDasharray: string | undefined;

    if (road.blocked) {
      stroke = '#f43f5e';
      strokeWidth = 2.5;
      strokeDasharray = '8 6';
    } else if (isRecommended) {
      stroke = '#6ee7b7';
      strokeWidth = 5;
    } else if (isHighRisk) {
      stroke = '#f59e0b';
      strokeWidth = 3.5;
    }

    return {
      id: road.id,
      source: road.fromNodeId,
      target: road.toNodeId,
      type: 'straight',
      animated: isRecommended,
      label: `${road.distanceKm} km • risk ${road.riskScore}${road.blocked ? ' • blocked' : ''}`,
      labelStyle: {
        fill: isRecommended ? '#d1fae5' : '#cbd5e1',
        fontSize: 12,
        fontWeight: isRecommended ? 700 : 500,
      },
      style: {
        stroke,
        strokeWidth,
        strokeDasharray,
      },
    };
  });

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-soft">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-lg font-semibold text-white">Scenario network graph</h2>
        <p className="mt-1 text-sm text-slate-400">
          Dashed edges indicate blocked roads, amber edges indicate high-risk roads, and the bright green path is the recommended route.
        </p>
      </div>
      <div className="h-[560px] sm:h-[640px] w-full bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.08),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.08),_transparent_30%)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.16 }}
          minZoom={0.4}
          maxZoom={1.6}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="rgba(148,163,184,0.16)" gap={24} />
          <MiniMap
            pannable
            zoomable
            style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}
            nodeColor={(node) => {
              if (node.id === scenario.warehouse.id) {
                return '#10b981';
              }

              if (node.id === highlightedShelterId) {
                return '#6ee7b7';
              }

              return '#64748b';
            }}
          />
          <Controls className="!bg-slate-950/80 !text-white" />
        </ReactFlow>
      </div>
    </div>
  );
}
