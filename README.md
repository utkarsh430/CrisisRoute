# CrisisRoute

## Overview
CrisisRoute is a local-first humanitarian crisis response optimization project built with Next.js. It demonstrates how scenario modeling, priority-based aid allocation, and risk-aware routing can be combined in a polished web interface to support explainable planning decisions.

## Objective
The objective of CrisisRoute is to demonstrate algorithmic decision-making for humanitarian aid allocation and safe route planning under conflict and post-conflict constraints. The system models limited supplies, urgent demand, road-network risk, and blocked routes to show how computational methods can support operational trade-off analysis.

## Features
- Local crisis response scenarios
- Priority-based resource allocation
- Risk-aware route planning
- Graph visualization with recommended route highlighting
- Charts and results analysis
- Toy algorithm verification

## Algorithms Used

### 1. Priority-Based Resource Allocation
This algorithm ranks shelters, clinics, camps, hospitals, and villages using a weighted priority score based on urgency, population need, medical need, and accessibility risk. After ranking locations, the system allocates limited food, medicine, and water in descending priority order and records remaining shortfalls.

### 2. Risk-Aware Dijkstra Shortest Path
This routing algorithm applies Dijkstra’s shortest path method using a weighted edge cost that combines physical distance with road risk. Blocked roads are excluded from the graph, allowing the system to recommend feasible and comparatively safer delivery paths.

## Tech Stack
- Next.js
- TypeScript
- Tailwind CSS
- React Flow
- Recharts

## Data Source
The project uses local sample datasets stored in `lib/data/scenarios.ts`. All scenario data is maintained directly inside the repository, and no external database, authentication provider, API keys, or online backend services are required.

## Folder Structure
```text
app/
  page.tsx
  dashboard/page.tsx
  scenario/page.tsx
  results/page.tsx
  map/page.tsx
  algorithms/page.tsx
components/
  Navbar.tsx
  DashboardCards.tsx
  ScenarioSelector.tsx
  ShelterTable.tsx
  RoadTable.tsx
  AllocationTable.tsx
  PriorityChart.tsx
  SupplyChart.tsx
  UnmetDemandChart.tsx
  RoadRiskChart.tsx
  CrisisGraph.tsx
  RouteSummary.tsx
  AlgorithmExplanation.tsx
  ChartCard.tsx
  MetricGrid.tsx
lib/
  algorithms/
    priorityAllocation.ts
    dijkstra.ts
    verification.ts
  data/
    scenarios.ts
  types.ts
  utils.ts
docs/
  report.md
  video-script.md
public/
  screenshots/
```

## How to Run Locally
```bash
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## How to Build
```bash
npm run build
npm start
```

## Deployment
CrisisRoute can be deployed on Vercel or any static-compatible Next.js hosting platform that supports App Router projects. It is presented as a simplified decision-support prototype using local sample data rather than a live operational system.



