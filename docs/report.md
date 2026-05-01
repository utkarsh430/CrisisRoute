# CrisisRoute Report

Team Member - Utkarsh Singh , John Bailey

## 1. Description of the Project

### Objective
CrisisRoute is a simplified decision-support prototype for humanitarian logistics planning. Its objective is to demonstrate how algorithmic methods can support two related operational decisions: how limited aid supplies should be prioritized across multiple demand locations, and how deliveries can be routed through a disrupted road network while accounting for safety risk.

### Problem Context
Humanitarian response operations frequently take place in unstable environments where needs exceed available resources. Relief planners may face damaged infrastructure, blocked roads, incomplete information, and competing urgent demands from shelters, clinics, camps, and hospitals. In such settings, a purely manual decision process can become difficult to justify or reproduce. CrisisRoute models this problem in a transparent and academic form using local sample scenarios rather than live operational data.

The prototype focuses on conflict and post-conflict logistics constraints. Each scenario includes a warehouse or depot, several humanitarian service sites, available food, medicine, and water inventories, and an undirected road network with distance, risk, and blocked-road indicators. The system then applies algorithmic analysis to help explain which destination should be served first and which route is most appropriate under the modeled conditions.

### Target Users
The project is primarily designed for:
- students studying algorithms, optimization, and software engineering;
- instructors evaluating capstone-style implementations of decision-support systems;
- researchers or practitioners interested in explainable humanitarian logistics prototypes;
- demonstration audiences who need a visual and interpretable example rather than a production deployment.



### Main Features
CrisisRoute includes the following main features:
- a landing page introducing the humanitarian planning problem;
- a dashboard with operational metrics and scenario-level charts;
- a scenario details page showing supply inventories, shelters, and roads;
- an optimization results page explaining prioritization, allocation outcomes, unmet demand, and recommended routing;
- a React Flow network map highlighting blocked roads, high-risk roads, and the recommended path;
- an algorithms page containing explanations, pseudocode, complexity analysis, and toy verification examples;
- fully local datasets stored in the repository with no external database or API dependencies.

## 2. Significance of the Project

### Humanitarian Relevance
Although simplified, the problem addressed by CrisisRoute is meaningful because humanitarian organizations regularly face scarcity, urgency, and infrastructure disruption at the same time. Decisions about where to send food, medicine, and water first can directly affect vulnerable populations. Route choice also matters because a short route is not always an acceptable route if its risk profile is too high.

### Meaningfulness
The project is meaningful in an academic sense because it translates a real decision-making challenge into a tractable computational model. It combines data modeling, algorithm design, verification, visualization, and user-facing explanation in one coherent system. Rather than producing a purely abstract algorithm demonstration, it embeds the algorithms in a context where their output has operational interpretation.

### Novelty
The novelty of the project lies less in inventing a new algorithm and more in integrating two classical decision processes into a single transparent workflow:
1. ranking demand locations by urgency and need,
2. allocating limited inventory accordingly,
3. routing to the highest-priority site using a risk-aware shortest-path method.

This integration provides a more complete explanation of humanitarian trade-offs than either allocation or routing alone.

### Real-World Constraints
The system explicitly models several practical constraints:
- limited food kits, medicine kits, and water units;
- multiple competing demand sites;
- varying urgency and medical need;
- accessibility difficulty;
- road distance and route risk;
- blocked roads that remove connectivity options.

These constraints are intentionally simplified, but they reflect common structural issues in humanitarian planning.

### Why Algorithmic Decision Support Is Useful
Algorithmic decision support is useful because it can:
- improve consistency across repeated planning runs;
- make assumptions explicit rather than implicit;
- expose trade-offs between urgency, supply scarcity, and route safety;
- support explanation and justification of operational choices;
- provide a foundation for further sensitivity analysis or scenario comparison.

CrisisRoute therefore demonstrates not automation of judgment, but support for structured judgment.

## 3. Code Structure

### Technology Stack
The project is implemented with the following technologies:
- **Next.js** for the application framework and App Router structure;
- **TypeScript** for static typing and reusable data models;
- **Tailwind CSS** for responsive interface styling;
- **Recharts** for data visualization and comparative analytics;
- **React Flow** for road-network graph visualization.

### Folder Structure
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

### System Architecture Diagram
The following text diagram summarizes the system flow:

```text
Local Scenario Data (lib/data/scenarios.ts)
                |
                v
      Shared Type Definitions (lib/types.ts)
                |
                v
 -------------------------------------------------
| Algorithm Layer                                  |
| - priorityAllocation.ts                          |
| - dijkstra.ts                                    |
| - verification.ts                                |
 -------------------------------------------------
                |
                v
 -------------------------------------------------
| Application Pages                                |
| - Dashboard                                      |
| - Scenario Details                               |
| - Results                                        |
| - Map                                            |
| - Algorithms                                     |
 -------------------------------------------------
                |
                v
 -------------------------------------------------
| Visualization Layer                              |
| - Recharts                                       |
| - React Flow                                     |
| - Tables / Cards / Narrative summaries           |
 -------------------------------------------------
```

### Explanation of Major Files and Components
- `lib/data/scenarios.ts` stores the three local humanitarian scenarios, scenario metadata helpers, and the default scenario export.
- `lib/types.ts` defines reusable types for nodes, shelters, roads, inventory, allocation outputs, route outputs, chart cards, and verification results.
- `lib/algorithms/priorityAllocation.ts` implements the weighted priority scoring and greedy allocation procedure.
- `lib/algorithms/dijkstra.ts` implements the risk-aware shortest-path search, adjacency construction, path reconstruction, and toy route verification.
- `lib/algorithms/verification.ts` connects allocation and routing into a combined optimization pipeline and produces report-friendly verification cases.
- `app/results/page.tsx` presents the most complete end-to-end analytical interpretation and ties the recommended shelter to the recommended route.
- `components/PriorityChart.tsx`, `components/SupplyChart.tsx`, `components/UnmetDemandChart.tsx`, and `components/RoadRiskChart.tsx` provide visual comparisons of ranking, delivered supply, shortfall, and network risk.
- `components/CrisisGraph.tsx` renders the scenario network with road-state styling and recommended-route emphasis.

## 4. Description of Algorithms

### Priority-Based Resource Allocation
The first algorithm addresses the question: **which site should receive scarce supplies first?**

Each shelter or service site is scored using normalized indicators so that different quantities can be combined on the same scale. The implemented score is:

**Priority Score = 0.35 × normalized urgency + 0.25 × normalized population need + 0.25 × normalized medical need + 0.15 × normalized accessibility risk**

The reasoning behind the weights is as follows:
- urgency has the greatest weight because immediate severity is central to prioritization;
- population need captures how many people are affected;
- medical need ensures clinics and hospitals with severe treatment requirements are elevated;
- accessibility risk captures the operational difficulty of reaching a site.

After computing scores for all sites, the algorithm sorts them in descending order. It then performs a greedy allocation of available food kits, medicine kits, and water units. For each site, the algorithm assigns as much of each supply category as possible from the remaining stock. If stock is insufficient, the unfulfilled amount is recorded as unmet demand.

This method is intentionally simple, transparent, and explainable. It does not guarantee a globally optimal distribution under all possible objective functions, but it is well suited to demonstration and interpretation.

### Risk-Aware Dijkstra Shortest Path
The second algorithm addresses the question: **what route should be used to reach the selected site?**

The road network is modeled as an undirected graph. Nodes represent the warehouse and humanitarian destinations. Edges represent roads. Each road stores:
- distance in kilometers,
- a risk score,
- a blocked indicator.

Blocked roads are excluded before route search begins. For all remaining edges, the routing cost is defined as:

**edgeCost = distance + riskWeight × risk**

This formulation allows the model to prefer a longer but safer route when the direct route is too risky. Dijkstra’s algorithm is then applied from the source warehouse to the selected destination. The output includes path node IDs, readable node names, step-by-step route segments, total distance, total risk, and total weighted cost.

### Combined Optimization Pipeline
The combined optimization pipeline links the two algorithms in sequence:
1. load the selected scenario;
2. run priority-based allocation on all sites;
3. identify the highest-priority shelter from the ranking;
4. run risk-aware Dijkstra from the warehouse to that shelter;
5. return a combined result object containing ranking, selected allocation, and selected route.

This pipeline is important because it demonstrates a realistic planning sequence: prioritize first, then route to the chosen destination.

### Complexity Analysis
- **Priority allocation complexity:** `O(n log n)`
  - scoring and normalization are linear in the number of sites;
  - sorting dominates the overall cost.
- **Risk-aware Dijkstra complexity:** `O((V + E) log V)`
  - with a priority-queue interpretation of Dijkstra, runtime depends on the number of vertices and edges.

In this prototype, scenario sizes are small, so performance is effectively instantaneous. The complexity analysis remains relevant as the number of sites and roads increases.

## 5. Verification of Algorithms

### Toy Example for Priority Allocation
A three-site toy scenario is included to verify that the weighting formula behaves as intended. The example contains:
- Alpha Shelter,
- Bravo Clinic,
- Charlie Camp,
with limited stock of food, medicine, and water.

The expected reasoning is that **Bravo Clinic** should rank first because it combines very high urgency with maximum medical need. The actual output produced by the verification helper confirms that the clinic is ranked ahead of the shelter and the camp.

### Toy Example for Route Planning
A small four-node graph is used to verify that the routing method is genuinely risk-aware rather than distance-only. Two candidate routes exist:
- a shorter but high-risk route,
- a longer but lower-risk detour.

With a positive risk weight, the expected reasoning is that the safer detour should be selected if its weighted cost is lower. The actual output confirms that the algorithm chooses the safer path rather than the shortest geometric path.

### Expected Output vs Actual Output
The verification module stores structured examples containing:
- input,
- expected reasoning,
- actual output,
- pass/fail status.

The verification cases cover:
1. priority allocation ranking,
2. risk-aware Dijkstra selection,
3. the combined decision pipeline.

The rendered algorithms page exposes these verification cases with clear input, expected reasoning, actual output, and pass/fail status so they can be discussed directly in a presentation or written report.

### Explanation of Correctness
The correctness argument for the prototype is practical and structural rather than formal proof-oriented:
- the allocation algorithm produces deterministic scores from a fixed formula and sorts in descending order;
- the route algorithm ignores blocked edges and minimizes the defined weighted cost;
- the combined pipeline verifies that the chosen route destination matches the top-ranked shelter.

Because the toy examples are small and interpretable, their outputs can be checked directly by inspection, which is appropriate for a capstone report.

## 6. Execution Results and Analysis

This section discusses results for the three local sample scenarios. These results are generated from simplified data and should be interpreted as prototype outputs, not operational recommendations.

### Scenario 1: Urban Conflict Zone
This scenario models dense urban displacement with several dangerous arterial roads. It includes six demand sites and ten roads, with one blocked road and multiple high-risk segments.

The ranking output in this scenario tends to elevate sites that combine severe urgency with difficult access, which makes it useful for demonstrating why the priority formula does not behave like a simple population sort. Allocation results show that the first-ranked destination receives substantial support, while lower-ranked destinations experience higher unmet demand once stock begins to run low. The route output is especially instructive because the shortest direct road is not always selected when its risk contribution makes a safer detour cheaper in weighted terms.

#### Priority Ranking Results
High-medical-need sites such as **Old Market Clinic** and **North General Hospital** are strong candidates for top ranking because they combine maximum urgency, high medical demand, and elevated accessibility risk. The scenario is intentionally designed to create tension between dense urban need and dangerous access conditions.

#### Allocation Results
The available food, medicine, and water inventory is substantial but still limited relative to total cumulative demand. The allocation output shows how the highest-ranked destinations absorb inventory first, leaving more modest sites with greater residual shortfalls if stock becomes constrained.

#### Route Recommendation Results
The routing model highlights an important urban trade-off: some direct paths are short but dangerous. Because edge cost includes risk, the recommended route may avoid the most hazardous links even if doing so increases distance.

#### Visualizations and Discussion
The results page supports interpretation through:
- a priority score bar chart,
- a demand-versus-allocation chart,
- an unmet-demand chart,
- a road risk distribution chart,
- a route summary and network map.

### Scenario 2: Rural Displacement Crisis
This scenario models dispersed settlements connected by longer rural roads. Distances are higher, road density is lower, and some paths create a stronger trade-off between coverage and travel burden.

The priority ranking remains sensitive to urgency and medical need, but the rural setting makes route choice more visible because long links can dominate the weighted cost even when they are relatively safe. Allocation results are useful for illustrating that a scenario can be logistically reachable while still suffering substantial unmet demand due to limited supply. The road risk chart and network map are particularly helpful in explaining why a route may remain feasible even when several alternatives are unattractive.

#### Priority Ranking Results
Large camps and villages are strong candidates for upper ranking in this scenario because population pressure combines with long-range access difficulty. At the same time, a smaller clinic can still rise in the ranking when medical need is severe.

#### Allocation Results
The allocation outputs show how shortages remain visible even when routes are feasible. Because settlements are geographically dispersed, the scenario is useful for explaining that allocation priority and routing feasibility are related but still analytically separate decisions in the current prototype.

#### Route Recommendation Results
The selected route often spans longer road segments than in the urban case. This makes the mileage-versus-risk trade-off easier to discuss, especially when a direct road is available but riskier than an indirect alternative.

#### Visualizations and Discussion
The road risk distribution chart is especially useful here because it shows whether long rural corridors are mostly low risk or whether a few critical links dominate the route decision. The map view also provides a clear screenshot of sparse network structure and constrained connectivity.

### Scenario 3: Post-Conflict Medical Emergency
This scenario is centered on high medical demand across hospitals and clinics. It includes six sites and ten roads, with one blocked medical corridor and several risky direct roads.

In this scenario, the allocation model tends to elevate sites with critical treatment requirements, and the medicine category becomes more constrained than food or water. This creates a clear example of category-specific scarcity: a destination can receive food and water while still retaining a notable medical shortfall. The routing result also shows how blocked roads and high-risk links can narrow the available path set even when the destination remains reachable.

#### Priority Ranking Results
Medical sites such as **Unity Trauma Hospital** and **South Quarter Clinic** are expected to score highly because the weighting formula gives strong influence to urgency and medical need. This scenario demonstrates the intended behavior of the allocation model in medically sensitive conditions.

#### Allocation Results
Because medicine inventory is heavily stressed in this scenario, the allocation table and charts make shortfall patterns easier to interpret. A high-ranking medical site may receive substantial medicine stock first, while lower-priority sites retain unmet clinical demand.

#### Route Recommendation Results
The route logic demonstrates that direct access to a medical destination is not always selected if the direct edge carries too much risk or is blocked. This is a realistic modeling choice for post-conflict delivery planning.

#### Visualizations and Discussion
This scenario benefits especially from the combined view of:
- highlighted top-priority destination,
- allocation summary,
- unmet demand by site,
- route metrics,
- network map with recommended path emphasis.

### Cross-Scenario Discussion
Across the three scenarios, the ranking results demonstrate that the weighted score captures a trade-off among urgency, affected population, medical pressure, and access difficulty. The top-ranked destination is not determined by a single attribute alone; rather, it reflects the strongest combined humanitarian pressure.

The allocation tables and charts show that greedy allocation is easy to interpret because each destination is served in ranked order until inventory is exhausted. This makes shortfalls transparent. When supplies are insufficient, unmet demand becomes concentrated in lower-ranked sites or in specific categories such as medicine.

The route recommendation results illustrate that the chosen path is based on weighted transport cost rather than pure distance. In multiple scenarios, this helps explain why the selected route may be slightly longer but operationally safer under the modeled risk assumptions.

The dashboard, results page, and map page complement the raw tables with charts and network views. Priority charts explain ranking, supply charts explain scarcity, unmet-demand charts highlight residual need, and the React Flow map shows blocked roads, high-risk roads, and the recommended path. Together, these views make the prototype more interpretable and better suited to capstone-style presentation.

Overall, the three scenarios show that output changes meaningfully with geography, supply levels, demand structure, and network risk.

## 7. Conclusions

### Summary of Findings
CrisisRoute demonstrates that a relatively small set of interpretable algorithms can produce clear and educational humanitarian planning outputs. The project successfully connects local scenario modeling, weighted prioritization, greedy resource allocation, risk-aware routing, and visual explanation in a single web application.

The results indicate that:
- site ranking is sensitive to urgency, population pressure, medical need, and accessibility risk;
- limited inventories naturally create unmet demand that can be visualized and discussed;
- route recommendations change when risk is incorporated, especially in scenarios with dangerous direct links or blocked roads;
- scenario comparison is valuable because the best operational response depends heavily on context.

### Project Limitations
The project has important limitations:
- it uses static sample data rather than live humanitarian data;
- risk is represented by simplified numeric scores;
- allocation is greedy rather than globally optimized;
- routing does not include convoy capacity, time windows, fuel, weather, or multi-vehicle scheduling;
- the system is a prototype for academic demonstration, not a deployed field system.

### Future Improvements
Possible future extensions include:
- multi-objective allocation with fairness or minimum-service constraints;
- stronger optimization baselines such as linear programming or min-cost flow;
- sensitivity analysis on weights and risk parameters;
- dynamic scenario editing within the interface;
- real-time data ingestion hooks for road status or incident updates;
- more formal automated testing and benchmark evaluation.

### Course Learning Applied
The project applies course concepts in several ways:
- algorithm design through weighted scoring and shortest-path routing;
- complexity analysis for comparing algorithmic cost;
- data structures including graphs, maps, arrays, and typed records;
- software engineering through modular architecture, reusable components, and static typing;
- verification through interpretable toy examples and end-to-end consistency checks.

## 8. AI Usage
AI was used for - 
- enhance and design the graphical interface of frontend website and to make it look aesthetic.
- eslint was used to analyse bugs in javascript frontend deployment.
- codeflow (open source tool) for converting folder architecture into graph images.
The core algorithm and logic were implemented by us manually. 




## 9. References
1. Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. *Introduction to Algorithms*. MIT Press.
2. Ahuja, R. K., Magnanti, T. L., & Orlin, J. B. *Network Flows: Theory, Algorithms, and Applications*. Prentice Hall.
3. Van Wassenhove, L. N. “Humanitarian Aid Logistics: Supply Chain Management in High Gear.” *Journal of the Operational Research Society*.
4. Next.js Documentation. https://nextjs.org/
5. Recharts Documentation. https://recharts.org/
6. React Flow Documentation. https://reactflow.dev/
7. workflow of Uber and Doordash resource allocation system. 

## 10. Appendix
- **GitHub link:**  https://github.com/utkarsh430/CrisisRoute
- **Deployment link:**   localhost:3000
- **Report:** /docs/report.md

