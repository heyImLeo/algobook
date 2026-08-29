import "@tanstack/react-start/server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "#/env/server.ts";
import * as schema from "#/lib/db/schema/index.ts";
import { relations } from "#/lib/db/schema/relations.ts";
import type { Difficulty } from "#/lib/db/schema/types.ts";

/**
 * Idempotent seed for shared curriculum content (topics, subtopics, question
 * groups, questions). Safe to re-run: existing rows (matched by their unique
 * slug/name) are left untouched, never overwritten or deleted, so it never
 * clobbers content edited after seeding. Run with `pnpm db:seed`.
 */

const client = postgres(env.DATABASE_URL);
const db = drizzle({ client, relations });

interface TopicSeed {
  slug: string;
  name: string;
  description: string;
  icon: string;
  timeComplexityRange?: string;
  spaceComplexityRange?: string;
  sortOrder: number;
}

const topics: TopicSeed[] = [
  {
    slug: "arrays",
    name: "Arrays",
    description:
      "The foundation of most interviews: contiguous memory, O(1) index access, and the patterns built on top of it — two pointers, sliding window, prefix sums, and Kadane's algorithm. Most array problems reduce to picking the right pointer strategy.",
    icon: "ListOrdered",
    timeComplexityRange: "O(1) – O(n log n)",
    spaceComplexityRange: "O(1) – O(n)",
    sortOrder: 1,
  },
  {
    slug: "linked-lists",
    name: "Linked Lists",
    description:
      "Sequential nodes connected by pointers rather than contiguous memory. The classic toolkit is fast/slow pointers, in-place reversal, and careful pointer bookkeeping — most bugs here come from losing track of a `next` reference.",
    icon: "Link2",
    timeComplexityRange: "O(n)",
    spaceComplexityRange: "O(1) – O(n)",
    sortOrder: 2,
  },
  {
    slug: "strings",
    name: "Strings",
    description:
      "Arrays of characters with their own vocabulary of patterns — sliding window, two pointers, and hashing for frequency counting. Many string problems are array problems wearing a different hat.",
    icon: "Type",
    timeComplexityRange: "O(n) – O(n²)",
    spaceComplexityRange: "O(1) – O(n)",
    sortOrder: 3,
  },
  {
    slug: "stacks-queues",
    name: "Stacks & Queues",
    description:
      "LIFO and FIFO access patterns that show up everywhere from expression parsing to BFS traversal. Monotonic stacks and deques turn a class of O(n²) brute-force problems into O(n).",
    icon: "Layers",
    timeComplexityRange: "O(n)",
    spaceComplexityRange: "O(n)",
    sortOrder: 4,
  },
  {
    slug: "heaps-pq",
    name: "Heaps / Priority Queue",
    description:
      "A tree-shaped structure that keeps the min (or max) element accessible in O(1), with O(log n) insert/remove. The go-to for top-k, k-way merge, and running-median problems.",
    icon: "ArrowUpDown",
    timeComplexityRange: "O(log n) per operation",
    spaceComplexityRange: "O(n)",
    sortOrder: 5,
  },
  {
    slug: "search",
    name: "Search",
    description:
      "Beyond looking up a sorted array: binary search generalizes to any monotonic predicate, which is what makes 'binary search on the answer' possible for optimization problems that don't look like search at all.",
    icon: "Search",
    timeComplexityRange: "O(log n)",
    spaceComplexityRange: "O(1)",
    sortOrder: 6,
  },
  {
    slug: "sort",
    name: "Sort",
    description:
      "Comparison sorts top out at O(n log n); counting and radix sort beat that bound by exploiting structure in the input. Picking the right one is mostly about what you know about the data.",
    icon: "ArrowDownUp",
    timeComplexityRange: "O(n log n)",
    spaceComplexityRange: "O(1) – O(n)",
    sortOrder: 7,
  },
  {
    slug: "greedy",
    name: "Greedy",
    description:
      "Make the locally optimal choice at each step and never look back. Works only when the problem has the greedy-choice property — proving that (or trusting the pattern) is the hard part, not the implementation.",
    icon: "TrendingUp",
    timeComplexityRange: "O(n log n)",
    spaceComplexityRange: "O(1) – O(n)",
    sortOrder: 8,
  },
  {
    slug: "backtracking",
    name: "Backtracking",
    description:
      "Exhaustive search with early pruning: build a candidate incrementally, abandon it the moment a constraint breaks. The template is always the same — choose, explore, unchoose — only the constraints change.",
    icon: "GitBranch",
    timeComplexityRange: "O(bᵈ)",
    spaceComplexityRange: "O(d)",
    sortOrder: 9,
  },
  {
    slug: "bit-manipulation",
    name: "Bit Manipulation",
    description:
      "XOR, masks, and shifts let you solve problems in O(1) space that would otherwise need a hash set — finding a single non-duplicate, counting set bits, or packing state into an integer for bitmask DP.",
    icon: "Binary",
    timeComplexityRange: "O(1) – O(log n)",
    spaceComplexityRange: "O(1)",
    sortOrder: 10,
  },
  {
    slug: "intervals",
    name: "Intervals",
    description:
      "Sort by start (or end) and sweep. Once sorted, merging, inserting, and counting overlaps all become linear scans — the sort is doing most of the work.",
    icon: "CalendarRange",
    timeComplexityRange: "O(n log n)",
    spaceComplexityRange: "O(n)",
    sortOrder: 11,
  },
  {
    slug: "graphs",
    name: "Graphs",
    description:
      "Graphs model relationships between entities as nodes and edges. Most problems reduce to traversal, shortest paths, connectivity, or ordering — and exams love combining these with implicit grids and matrices, so recognizing the underlying pattern matters more than memorizing code.",
    icon: "Network",
    timeComplexityRange: "O(V+E) – O(V·E)",
    spaceComplexityRange: "O(V) – O(V²)",
    sortOrder: 12,
  },
  {
    slug: "trees",
    name: "Trees",
    description:
      "Recursive structures where almost every algorithm is a traversal in disguise — preorder, inorder, postorder, or level-order. The hard part is usually deciding what to compute on the way down versus the way back up.",
    icon: "TreePine",
    timeComplexityRange: "O(n)",
    spaceComplexityRange: "O(h)",
    sortOrder: 13,
  },
  {
    slug: "dynamic-programming",
    name: "Dynamic Programming",
    description:
      "Break a problem into overlapping subproblems and cache the results. The entire discipline is four steps: define the state, write the recurrence, pick an order to fill it in, then optimize the space.",
    icon: "Grid3x3",
    timeComplexityRange: "O(n) – O(n³)",
    spaceComplexityRange: "O(1) – O(n²)",
    sortOrder: 14,
  },
  {
    slug: "tries",
    name: "Tries",
    description:
      "A tree where each path from the root spells out a prefix. Built for exactly one job — fast prefix lookups — but that one job covers autocomplete, word search, and bitwise max-XOR problems.",
    icon: "GitFork",
    timeComplexityRange: "O(L)",
    spaceComplexityRange: "O(n·L)",
    sortOrder: 15,
  },
];

interface SubtopicSeed {
  slug: string;
  name: string;
  description: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  bestFor?: string;
  referenceContent?: string;
  sortOrder: number;
}

const graphsSubtopics: SubtopicSeed[] = [
  {
    slug: "bfs",
    name: "BFS",
    description:
      "BFS explores a graph level by level, visiting all nodes at distance 1 before distance 2, and so on. Because of this level-by-level order, the first time BFS reaches a node is guaranteed to be via the shortest path (in terms of edge count). DFS cannot make this guarantee.",
    timeComplexity: "O(V+E)",
    spaceComplexity: "O(V)",
    bestFor: "Shortest path in unweighted graphs, level-by-level spread, multi-source problems",
    sortOrder: 1,
    referenceContent: `## When to Use

- Minimum steps / distance between two nodes
- Level-by-level spread (rotting oranges, walls and gates)
- Multi-source BFS — start from multiple sources simultaneously

## Core Idea

BFS visits nodes in order of increasing distance. The first time you reach a node, that's the shortest path. DFS does NOT guarantee this.

## Template — Standard BFS

\`\`\`python
from collections import deque

def bfs(graph, start, target):
    visited = {start}
    queue   = deque([(start, 0)])   # (node, distance)

    while queue:
        node, dist = queue.popleft()
        if node == target: return dist

        for nb in graph[node]:
            if nb not in visited:
                visited.add(nb)
                queue.append((nb, dist + 1))

    return -1   # target not reachable
\`\`\`

## Template — Grid BFS

\`\`\`python
def bfs_grid(grid, sr, sc, target_val):
    rows, cols = len(grid), len(grid[0])
    visited    = {(sr, sc)}
    queue      = deque([(sr, sc, 0)])
    DIRS       = [(0,1),(0,-1),(1,0),(-1,0)]

    while queue:
        r, c, d = queue.popleft()
        for dr, dc in DIRS:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and (nr,nc) not in visited:
                if grid[nr][nc] != 0:   # 0 = wall, adjust as needed
                    visited.add((nr,nc))
                    queue.append((nr,nc,d+1))
\`\`\`

## Template — Multi-Source BFS

\`\`\`python
def multi_source_bfs(grid, sources):
    queue   = deque([(r, c, 0) for r, c in sources])
    visited = set(sources)
    DIRS    = [(0,1),(0,-1),(1,0),(-1,0)]

    while queue:
        r, c, d = queue.popleft()
        for dr, dc in DIRS:
            nr, nc = r+dr, c+dc
            if valid(nr,nc) and (nr,nc) not in visited:
                visited.add((nr,nc))
                queue.append((nr,nc,d+1))
\`\`\`

## Key Insight: Mark Visited Before Enqueuing

Add to visited set when you enqueue, not when you dequeue. If you wait until dequeue, the same node can be enqueued multiple times, causing O(n²) worst case.

## Common Mistakes

- Marking visited on dequeue instead of enqueue — causes duplicate processing
- Using DFS when the problem asks for shortest path — DFS doesn't guarantee shortest`,
  },
  {
    slug: "dfs",
    name: "DFS",
    description:
      "DFS explores as far as possible along each branch before backtracking. Used for counting connected components, flood fill, finding all paths, and cycle detection.",
    timeComplexity: "O(V+E)",
    spaceComplexity: "O(V)",
    bestFor: "Connected components, flood fill, all-paths, cycle detection",
    sortOrder: 2,
    referenceContent: `## When to Use

- Count connected components
- Flood fill (number of islands, Pacific Atlantic)
- All paths from source to destination
- Cycle detection

## Template — Count Components / Flood Fill

\`\`\`python
def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    visited = set()
    count   = 0

    def dfs(r, c):
        if (r,c) in visited: return
        if not(0<=r<rows and 0<=c<cols): return
        if grid[r][c] == '0': return
        visited.add((r,c))
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            dfs(r+dr, c+dc)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1' and (r,c) not in visited:
                dfs(r,c); count += 1

    return count
\`\`\`

## Template — Cycle Detection in Directed Graph (3-Colour DFS)

\`\`\`python
def has_cycle(graph, n):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * n

    def dfs(node):
        color[node] = GRAY
        for nb in graph[node]:
            if color[nb] == GRAY:  return True   # back edge = cycle
            if color[nb] == WHITE and dfs(nb): return True
        color[node] = BLACK
        return False

    return any(dfs(i) for i in range(n) if color[i] == WHITE)
\`\`\`

## Key Insight: 3 Colors for Directed Cycle Detection

WHITE (0) = unvisited, GRAY (1) = currently being explored (in the DFS call stack), BLACK (2) = fully explored. A back edge (neighbor is GRAY) means a cycle.

## Common Mistakes

- Using 2-colour (visited/unvisited) for directed cycle detection — doesn't work
- Modifying the grid in-place works but is risky — prefer a separate visited set`,
  },
  {
    slug: "topological-sort",
    name: "Topological Sort",
    description:
      "Only valid for DAGs (Directed Acyclic Graphs). Nodes with no incoming edges go first. If the output doesn't include all nodes, there's a cycle.",
    timeComplexity: "O(V+E)",
    spaceComplexity: "O(V)",
    bestFor: "Build order, course prerequisites, detecting cycles in directed graphs",
    sortOrder: 3,
    referenceContent: `## When to Use

- Build order — what must come before what?
- Course prerequisites
- Detecting cycles in a directed graph

## Template — Kahn's Algorithm (BFS)

\`\`\`python
from collections import deque, defaultdict

def topo_sort(n, prerequisites):
    graph     = defaultdict(list)
    in_degree = [0] * n

    for a, b in prerequisites:      # b must come before a
        graph[b].append(a)
        in_degree[a] += 1

    queue = deque(i for i in range(n) if in_degree[i] == 0)
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)
        for nb in graph[node]:
            in_degree[nb] -= 1
            if in_degree[nb] == 0:
                queue.append(nb)

    return order if len(order) == n else []   # [] = cycle detected
\`\`\`

## Key Insight: len(order) == n

If the output has fewer than n nodes, there's a cycle. Some nodes can never reach in-degree 0 because they're part of a cycle — they never enter the queue.

## Common Mistakes

- Getting edge direction wrong: if b → a means "b must come before a", then \`graph[b].append(a)\` and \`in_degree[a] += 1\`
- Forgetting the cycle check — just returning order without verifying its length`,
  },
  {
    slug: "union-find",
    name: "Union-Find (Disjoint Set)",
    description:
      "Tracks which nodes belong to the same connected component with near-constant-time merge and find operations, using path compression and union by rank.",
    timeComplexity: "O(α(n))",
    spaceComplexity: "O(n)",
    bestFor: "Dynamic connectivity, redundant edge detection, Kruskal's MST",
    sortOrder: 4,
    referenceContent: `## When to Use

- Dynamic connectivity — are A and B connected?
- Redundant edge in an undirected graph
- Number of connected components
- Better than DFS when edges are added over time
- Building an MST with Kruskal's

## Template

\`\`\`python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank   = [0] * n
        self.count  = n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])   # path compression
        return self.parent[x]

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb: return False   # already connected → cycle if adding this edge
        if self.rank[ra] < self.rank[rb]: ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]: self.rank[ra] += 1
        self.count -= 1
        return True
\`\`\`

## Key Insight: union() Returns False = Redundant Edge

If \`union(a, b)\` returns False, a and b were already in the same component. Adding this edge would create a cycle.`,
  },
  {
    slug: "dijkstra",
    name: "Dijkstra's Algorithm",
    description:
      "Greedy shortest-path algorithm that always expands the closest unvisited node next, using a min-heap to avoid reprocessing. Requires non-negative edge weights.",
    timeComplexity: "O((V+E) log V)",
    spaceComplexity: "O(V)",
    bestFor: "Shortest path with positive weights, minimum cost to reach a destination",
    sortOrder: 5,
    referenceContent: `## When to Use

- Shortest path with positive edge weights
- "Minimum cost to reach destination"
- All edges have non-negative weights

## Template

\`\`\`python
import heapq
from collections import defaultdict

def dijkstra(n, edges, source):
    graph = defaultdict(list)
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))    # remove for directed

    dist = [float('inf')] * n
    dist[source] = 0
    heap = [(0, source)]           # (cost, node)

    while heap:
        cost, node = heapq.heappop(heap)
        if cost > dist[node]: continue   # stale entry — skip

        for nb, w in graph[node]:
            new_cost = cost + w
            if new_cost < dist[nb]:
                dist[nb] = new_cost
                heapq.heappush(heap, (new_cost, nb))

    return dist
\`\`\`

## Key Insight: Skip Stale Entries

When you pop (cost, node) from the heap, check if cost > dist[node]. If yes, this entry is outdated (a shorter path was already found) — skip it. This keeps the algorithm correct without a visited set.

## Common Mistakes

- Not skipping stale entries — processes nodes multiple times, can give wrong answers
- Using Dijkstra with negative edge weights — use Bellman-Ford instead`,
  },
  {
    slug: "bellman-ford",
    name: "Bellman-Ford Algorithm",
    description:
      "Relaxes every edge V-1 times, which is provably enough to finalize every shortest path in a graph with no negative cycle. A useful relaxation on round V means a negative cycle exists.",
    timeComplexity: "O(V·E)",
    spaceComplexity: "O(V)",
    bestFor: "Graphs with negative edge weights, detecting negative cycles",
    sortOrder: 6,
    referenceContent: `## When to Use

- Graph has negative edge weights (Dijkstra breaks here)
- Need to detect negative weight cycles
- Fewer edges/nodes (Bellman-Ford is O(V·E), slower than Dijkstra)

## Core Idea

Relax every edge V-1 times. After V-1 rounds, the shortest paths are finalized (assuming no negative cycle). A useful relaxation on round V means a negative cycle exists.

## Template

\`\`\`python
def bellman_ford(n, edges, source):
    dist = [float('inf')] * n
    dist[source] = 0

    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w

    # Extra pass to detect a negative cycle
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            return None   # negative cycle detected

    return dist
\`\`\`

## Key Insight: V-1 Relaxations is Provably Enough

The shortest path between any two nodes visits at most V-1 edges (no repeated nodes). So after V-1 full passes over all edges, every shortest distance is final — unless a negative cycle keeps shrinking it further.

## Common Mistakes

- Forgetting the extra Vth pass for negative-cycle detection
- Using this when Dijkstra would do — Bellman-Ford is slower (O(V·E) vs O(E log V)), only reach for it when weights can be negative`,
  },
  {
    slug: "floyd-warshall",
    name: "Floyd-Warshall",
    description:
      "Computes shortest paths between every pair of nodes by considering each node in turn as an allowed intermediate stop. The intermediate node must be the outermost loop for correctness.",
    timeComplexity: "O(V³)",
    spaceComplexity: "O(V²)",
    bestFor: "All-pairs shortest paths on small, dense graphs (n ≲ 500)",
    sortOrder: 7,
    referenceContent: `## When to Use

- Need shortest paths between EVERY pair of nodes, not just from one source
- Small graphs (n ≤ ~400-500, since it's O(n³))
- Works with negative edges (but not negative cycles)

## Template

\`\`\`python
def floyd_warshall(n, edges):
    INF = float('inf')
    dist = [[INF] * n for _ in range(n)]
    for i in range(n):
        dist[i][i] = 0
    for u, v, w in edges:
        dist[u][v] = min(dist[u][v], w)
        dist[v][u] = min(dist[v][u], w)   # remove for directed

    for k in range(n):              # intermediate node
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]

    return dist
\`\`\`

## Key Insight: k Must Be the Outer Loop

\`k\` (the intermediate node) has to be the outermost loop — it represents "using only nodes 0..k as intermediate stops so far." Swapping loop order breaks correctness.

## Common Mistakes

- Using this for large n (>500) — O(n³) will TLE
- Putting i or j as the outer loop instead of k`,
  },
  {
    slug: "mst",
    name: "Minimum Spanning Tree (Prim/Kruskal)",
    description:
      "Connects every node with the minimum possible total edge weight. Kruskal's greedily adds the cheapest edge that doesn't form a cycle (via Union-Find); Prim's greedily grows a tree from one node, always adding the cheapest edge that extends it.",
    timeComplexity: "O(E log V)",
    spaceComplexity: "O(V)",
    bestFor: "Network design, minimum cost to connect all nodes",
    sortOrder: 8,
    referenceContent: `## When to Use

- Connect all nodes with minimum total edge weight
- Network design problems ("minimum cost to connect all cities")

## Template — Kruskal's (edge-based, uses Union-Find) — best when edges are sparse

\`\`\`python
def kruskal(n, edges):
    edges.sort(key=lambda e: e[2])   # sort by weight
    uf = UnionFind(n)
    total_cost = 0
    mst_edges  = []

    for u, v, w in edges:
        if uf.union(u, v):           # returns False if already connected
            total_cost += w
            mst_edges.append((u, v, w))

    return total_cost if uf.count == 1 else -1   # -1 = graph not connected
\`\`\`

## Template — Prim's (node-based, uses a heap) — best when edges are dense

\`\`\`python
import heapq
from collections import defaultdict

def prim(n, edges, start=0):
    graph = defaultdict(list)
    for u, v, w in edges:
        graph[u].append((w, v))
        graph[v].append((w, u))

    visited    = set([start])
    heap       = graph[start][:]
    heapq.heapify(heap)
    total_cost = 0

    while heap and len(visited) < n:
        w, node = heapq.heappop(heap)
        if node in visited: continue
        visited.add(node)
        total_cost += w
        for nw, nb in graph[node]:
            if nb not in visited:
                heapq.heappush(heap, (nw, nb))

    return total_cost if len(visited) == n else -1
\`\`\`

## Key Insight: Kruskal's Greedily Picks Edges, Prim's Greedily Grows a Tree

Kruskal's sorts all edges and adds the cheapest one that doesn't form a cycle (Union-Find checks this in O(α(n))). Prim's starts from one node and always extends the current tree with the cheapest connecting edge. Both are greedy and both are provably correct for MST — pick based on graph density.

## Common Mistakes

- Forgetting to check the graph is fully connected (return -1 / handle the disconnected case)
- Using Kruskal's without path compression in Union-Find — degrades performance`,
  },
  {
    slug: "bipartite-check",
    name: "Bipartite Graph Check",
    description:
      "Tries to 2-color the graph with BFS or DFS; if any edge connects two same-colored nodes, the graph isn't bipartite. A graph is bipartite if and only if it has no odd-length cycle.",
    timeComplexity: "O(V+E)",
    spaceComplexity: "O(V)",
    bestFor: "2-coloring, conflict scheduling, matching problems",
    sortOrder: 9,
    referenceContent: `## When to Use

- "Can this graph be 2-colored so no adjacent nodes share a color?"
- Matching problems, conflict scheduling, "possible to divide into two groups"

## Core Idea

Try to color the graph with 2 colors using BFS/DFS. If any edge connects two same-colored nodes, it's not bipartite.

## Template

\`\`\`python
from collections import deque

def is_bipartite(graph, n):
    color = [-1] * n

    for start in range(n):
        if color[start] != -1: continue
        color[start] = 0
        queue = deque([start])

        while queue:
            node = queue.popleft()
            for nb in graph[node]:
                if color[nb] == -1:
                    color[nb] = 1 - color[node]
                    queue.append(nb)
                elif color[nb] == color[node]:
                    return False   # same color adjacent — not bipartite

    return True
\`\`\`

## Key Insight: A Graph is Bipartite ⟺ It Has No Odd-Length Cycle

This is the underlying theorem — if you ever see an odd cycle, 2-coloring is impossible.

## Common Mistakes

- Forgetting to check ALL components (the graph might be disconnected)`,
  },
  {
    slug: "bridges-articulation-points",
    name: "Bridges & Articulation Points",
    description:
      "Uses DFS with discovery time and low-link values to find edges and nodes whose removal disconnects the graph. A bridge exists when a neighbor's subtree can't reach back to the current node or earlier.",
    timeComplexity: "O(V+E)",
    spaceComplexity: "O(V)",
    bestFor: "Critical edges/nodes, network reliability",
    sortOrder: 10,
    referenceContent: `## When to Use

- Find critical edges/nodes whose removal disconnects the graph
- Network reliability problems ("which connections are single points of failure")

## Core Idea

Uses DFS with discovery time and "low-link" values. A bridge is an edge where the neighbor's low-link value is strictly greater than the current node's discovery time (no back edge bypasses it).

## Template — Bridges (Tarjan's)

\`\`\`python
from collections import defaultdict

def find_bridges(n, edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    disc = [-1] * n
    low  = [-1] * n
    bridges = []
    timer = [0]

    def dfs(node, parent):
        disc[node] = low[node] = timer[0]
        timer[0] += 1

        for nb in graph[node]:
            if nb == parent: continue
            if disc[nb] == -1:
                dfs(nb, node)
                low[node] = min(low[node], low[nb])
                if low[nb] > disc[node]:
                    bridges.append((node, nb))
            else:
                low[node] = min(low[node], disc[nb])

    for i in range(n):
        if disc[i] == -1:
            dfs(i, -1)

    return bridges
\`\`\`

## Key Insight: low[node] Tracks the Earliest Reachable Ancestor

\`low[node]\` is the smallest discovery time reachable from node's subtree (including via back edges). If a neighbor's subtree can't reach back to node or earlier, the edge to that neighbor is a bridge.

## Common Mistakes

- Forgetting to skip the direct parent edge in the DFS (causes false positives)
- Confusing bridges (edges) with articulation points (nodes) — similar algorithm, different condition (\`low[nb] >= disc[node]\` for articulation points, strict \`>\` for bridges)`,
  },
  {
    slug: "kosaraju-scc",
    name: "Kosaraju's Algorithm (SCC)",
    description:
      "Two-pass DFS: first collects finish order on the original graph, then explores the transposed graph in reverse finish order — each resulting DFS tree is one strongly connected component.",
    timeComplexity: "O(V+E)",
    spaceComplexity: "O(V)",
    bestFor: "Strongly connected components in directed graphs, condensing a graph into a DAG",
    sortOrder: 11,
    referenceContent: `## When to Use

- Directed graph — find groups of nodes where every node can reach every other node in the group
- Condensing a graph into a DAG of SCCs

## Core Idea

Two-pass DFS: (1) get finish-order via DFS on the original graph, (2) DFS on the transposed (reversed) graph in reverse finish-order — each DFS tree in pass 2 is one SCC.

## Template

\`\`\`python
from collections import defaultdict

def kosaraju(n, edges):
    graph  = defaultdict(list)
    rgraph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        rgraph[v].append(u)

    visited = [False] * n
    order   = []

    def dfs1(node):
        visited[node] = True
        for nb in graph[node]:
            if not visited[nb]:
                dfs1(nb)
        order.append(node)     # postorder — finish time

    for i in range(n):
        if not visited[i]:
            dfs1(i)

    visited2 = [False] * n
    sccs = []

    def dfs2(node, comp):
        visited2[node] = True
        comp.append(node)
        for nb in rgraph[node]:
            if not visited2[nb]:
                dfs2(nb, comp)

    for node in reversed(order):
        if not visited2[node]:
            comp = []
            dfs2(node, comp)
            sccs.append(comp)

    return sccs
\`\`\`

## Key Insight: Reverse Graph + Reverse Finish Order Isolates Each SCC

Processing nodes in reverse finish-order on the transposed graph guarantees you never "leak" from one SCC into another that it can reach but that can't reach back.

## Common Mistakes

- Doing the second DFS pass on the original graph instead of the transposed one
- Not processing nodes in reverse finish order from the first pass`,
  },
];

interface GroupSeed {
  name: string;
  description?: string;
  sortOrder: number;
}

const bfsGroups: GroupSeed[] = [
  {
    name: "Grid Flood-Fill / Basic BFS",
    description: "Scan for an unvisited region and flood outward — the simplest BFS/DFS template.",
    sortOrder: 1,
  },
  {
    name: "Multi-Source BFS",
    description:
      "Seed the queue with every source at once, so each cell's first-reached distance is the distance to its nearest source.",
    sortOrder: 2,
  },
  {
    name: "BFS from Two Boundaries",
    description: "Run BFS inward from two separate boundaries and intersect what each one reaches.",
    sortOrder: 3,
  },
  {
    name: "Weighted-ish Grid Shortest Path",
    description:
      "Still plain BFS, just with more neighbor directions (e.g. 8-directional) per step.",
    sortOrder: 4,
  },
  {
    name: "BFS on an Implicit Graph",
    description: "Neighbors are generated on the fly by a rule instead of being given directly.",
    sortOrder: 5,
  },
  {
    name: "BFS on a State Space",
    description:
      "The 'node' is a full state, not just a grid cell — bound the search space explicitly.",
    sortOrder: 6,
  },
  {
    name: "BFS + Connected Components",
    description: "Find a shape first (DFS), then multi-source BFS outward from its border.",
    sortOrder: 7,
  },
];

interface QuestionSeed {
  slug: string;
  title: string;
  leetcodeNumber?: number;
  url?: string;
  difficulty: Difficulty;
  sortOrder: number;
  groupName?: string;
}

const bfsQuestions: QuestionSeed[] = [
  {
    slug: "number-of-islands",
    title: "Number of Islands",
    leetcodeNumber: 200,
    url: "https://leetcode.com/problems/number-of-islands/",
    difficulty: "medium",
    sortOrder: 1,
    groupName: "Grid Flood-Fill / Basic BFS",
  },
  {
    slug: "flood-fill",
    title: "Flood Fill",
    leetcodeNumber: 733,
    url: "https://leetcode.com/problems/flood-fill/",
    difficulty: "easy",
    sortOrder: 2,
    groupName: "Grid Flood-Fill / Basic BFS",
  },
  {
    slug: "rotting-oranges",
    title: "Rotting Oranges",
    leetcodeNumber: 994,
    url: "https://leetcode.com/problems/rotting-oranges/",
    difficulty: "medium",
    sortOrder: 1,
    groupName: "Multi-Source BFS",
  },
  {
    slug: "01-matrix",
    title: "01 Matrix",
    leetcodeNumber: 542,
    url: "https://leetcode.com/problems/01-matrix/",
    difficulty: "medium",
    sortOrder: 2,
    groupName: "Multi-Source BFS",
  },
  {
    slug: "walls-and-gates",
    title: "Walls and Gates",
    url: "https://neetcode.io/solutions/walls-and-gates",
    difficulty: "medium",
    sortOrder: 3,
    groupName: "Multi-Source BFS",
  },
  {
    slug: "pacific-atlantic-water-flow",
    title: "Pacific Atlantic Water Flow",
    leetcodeNumber: 417,
    url: "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    difficulty: "medium",
    sortOrder: 1,
    groupName: "BFS from Two Boundaries",
  },
  {
    slug: "shortest-path-in-binary-matrix",
    title: "Shortest Path in Binary Matrix",
    leetcodeNumber: 1091,
    url: "https://leetcode.com/problems/shortest-path-in-binary-matrix/",
    difficulty: "medium",
    sortOrder: 1,
    groupName: "Weighted-ish Grid Shortest Path",
  },
  {
    slug: "word-ladder",
    title: "Word Ladder",
    leetcodeNumber: 127,
    url: "https://leetcode.com/problems/word-ladder/",
    difficulty: "hard",
    sortOrder: 1,
    groupName: "BFS on an Implicit Graph",
  },
  {
    slug: "minimum-knight-moves",
    title: "Minimum Knight Moves",
    leetcodeNumber: 1197,
    url: "https://leetcode.com/problems/minimum-knight-moves/",
    difficulty: "medium",
    sortOrder: 1,
    groupName: "BFS on a State Space",
  },
  {
    slug: "open-the-lock",
    title: "Open the Lock",
    leetcodeNumber: 752,
    url: "https://leetcode.com/problems/open-the-lock/",
    difficulty: "medium",
    sortOrder: 2,
    groupName: "BFS on a State Space",
  },
  {
    slug: "sliding-puzzle",
    title: "Sliding Puzzle",
    leetcodeNumber: 773,
    url: "https://leetcode.com/problems/sliding-puzzle/",
    difficulty: "hard",
    sortOrder: 3,
    groupName: "BFS on a State Space",
  },
  {
    slug: "shortest-bridge",
    title: "Shortest Bridge",
    leetcodeNumber: 934,
    url: "https://leetcode.com/problems/shortest-bridge/",
    difficulty: "medium",
    sortOrder: 1,
    groupName: "BFS + Connected Components",
  },
];

const dfsQuestions: QuestionSeed[] = [
  {
    slug: "clone-graph",
    title: "Clone Graph",
    leetcodeNumber: 133,
    url: "https://leetcode.com/problems/clone-graph/",
    difficulty: "medium",
    sortOrder: 1,
  },
  {
    slug: "max-area-of-island",
    title: "Max Area of Island",
    leetcodeNumber: 695,
    url: "https://leetcode.com/problems/max-area-of-island/",
    difficulty: "medium",
    sortOrder: 2,
  },
  {
    slug: "surrounded-regions",
    title: "Surrounded Regions",
    leetcodeNumber: 130,
    url: "https://leetcode.com/problems/surrounded-regions/",
    difficulty: "medium",
    sortOrder: 3,
  },
];

const topologicalSortQuestions: QuestionSeed[] = [
  {
    slug: "course-schedule",
    title: "Course Schedule",
    leetcodeNumber: 207,
    url: "https://leetcode.com/problems/course-schedule/",
    difficulty: "medium",
    sortOrder: 1,
  },
  {
    slug: "course-schedule-ii",
    title: "Course Schedule II",
    leetcodeNumber: 210,
    url: "https://leetcode.com/problems/course-schedule-ii/",
    difficulty: "medium",
    sortOrder: 2,
  },
  {
    slug: "all-ancestors-of-a-node-in-a-dag",
    title: "All Ancestors of a Node in a DAG",
    leetcodeNumber: 2192,
    url: "https://leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph/",
    difficulty: "medium",
    sortOrder: 3,
  },
  {
    slug: "alien-dictionary",
    title: "Alien Dictionary",
    leetcodeNumber: 269,
    url: "https://leetcode.com/problems/alien-dictionary/",
    difficulty: "hard",
    sortOrder: 4,
  },
];

const unionFindQuestions: QuestionSeed[] = [
  {
    slug: "number-of-connected-components-in-an-undirected-graph",
    title: "Number of Connected Components",
    leetcodeNumber: 323,
    url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
    difficulty: "medium",
    sortOrder: 1,
  },
  {
    slug: "redundant-connection",
    title: "Redundant Connection",
    leetcodeNumber: 684,
    url: "https://leetcode.com/problems/redundant-connection/",
    difficulty: "medium",
    sortOrder: 2,
  },
  {
    slug: "accounts-merge",
    title: "Accounts Merge",
    leetcodeNumber: 721,
    url: "https://leetcode.com/problems/accounts-merge/",
    difficulty: "medium",
    sortOrder: 3,
  },
  {
    slug: "graph-valid-tree",
    title: "Graph Valid Tree",
    leetcodeNumber: 261,
    url: "https://leetcode.com/problems/graph-valid-tree/",
    difficulty: "medium",
    sortOrder: 4,
  },
];

const dijkstraQuestions: QuestionSeed[] = [
  {
    slug: "network-delay-time",
    title: "Network Delay Time",
    leetcodeNumber: 743,
    url: "https://leetcode.com/problems/network-delay-time/",
    difficulty: "medium",
    sortOrder: 1,
  },
  {
    slug: "path-with-minimum-effort",
    title: "Path with Minimum Effort",
    leetcodeNumber: 1631,
    url: "https://leetcode.com/problems/path-with-minimum-effort/",
    difficulty: "medium",
    sortOrder: 2,
  },
  {
    slug: "cheapest-flights-within-k-stops",
    title: "Cheapest Flights Within K Stops",
    leetcodeNumber: 787,
    url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
    difficulty: "hard",
    sortOrder: 3,
  },
];

const bellmanFordQuestions: QuestionSeed[] = [
  {
    slug: "negative-weight-cycle-detection",
    title: "Negative Weight Cycle Detection",
    url: "https://www.geeksforgeeks.org/detect-negative-cycle-graph-bellman-ford/",
    difficulty: "medium",
    sortOrder: 1,
  },
];

const floydWarshallQuestions: QuestionSeed[] = [
  {
    slug: "find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance",
    title: "Find the City With the Smallest Number of Neighbors at a Threshold Distance",
    leetcodeNumber: 1334,
    url: "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/",
    difficulty: "medium",
    sortOrder: 1,
  },
  {
    slug: "all-pairs-shortest-path",
    title: "All Pairs Shortest Path",
    url: "https://www.geeksforgeeks.org/dsa/floyd-warshall-algorithm-dp-16/",
    difficulty: "medium",
    sortOrder: 2,
  },
  {
    slug: "evaluate-division",
    title: "Evaluate Division",
    leetcodeNumber: 399,
    url: "https://leetcode.com/problems/evaluate-division/",
    difficulty: "medium",
    sortOrder: 3,
  },
];

const mstQuestions: QuestionSeed[] = [
  {
    slug: "min-cost-to-connect-all-points",
    title: "Min Cost to Connect All Points",
    leetcodeNumber: 1584,
    url: "https://leetcode.com/problems/min-cost-to-connect-all-points/",
    difficulty: "medium",
    sortOrder: 1,
  },
  {
    slug: "connecting-cities-with-minimum-cost",
    title: "Connecting Cities With Minimum Cost",
    leetcodeNumber: 1135,
    url: "https://leetcode.com/problems/connecting-cities-with-minimum-cost/",
    difficulty: "medium",
    sortOrder: 2,
  },
  {
    slug: "optimize-water-distribution-in-a-village",
    title: "Optimize Water Distribution in a Village",
    leetcodeNumber: 1168,
    url: "https://leetcode.com/problems/optimize-water-distribution-in-a-village/",
    difficulty: "hard",
    sortOrder: 3,
  },
];

const bipartiteQuestions: QuestionSeed[] = [
  {
    slug: "is-graph-bipartite",
    title: "Is Graph Bipartite?",
    leetcodeNumber: 785,
    url: "https://leetcode.com/problems/is-graph-bipartite/",
    difficulty: "medium",
    sortOrder: 1,
  },
  {
    slug: "possible-bipartition",
    title: "Possible Bipartition",
    leetcodeNumber: 886,
    url: "https://leetcode.com/problems/possible-bipartition/",
    difficulty: "medium",
    sortOrder: 2,
  },
];

const bridgesQuestions: QuestionSeed[] = [
  {
    slug: "critical-connections-in-a-network",
    title: "Critical Connections in a Network",
    leetcodeNumber: 1192,
    url: "https://leetcode.com/problems/critical-connections-in-a-network/",
    difficulty: "hard",
    sortOrder: 1,
  },
  {
    slug: "articulation-points",
    title: "Articulation Points (Cut Vertices)",
    url: "https://www.geeksforgeeks.org/dsa/articulation-points-or-cut-vertices-in-a-graph/",
    difficulty: "hard",
    sortOrder: 2,
  },
];

const kosarajuQuestions: QuestionSeed[] = [
  {
    slug: "strongly-connected-components-kosaraju",
    title: "Strongly Connected Components (Kosaraju's)",
    url: "https://www.geeksforgeeks.org/dsa/strongly-connected-components/",
    difficulty: "medium",
    sortOrder: 1,
  },
  {
    slug: "number-of-strongly-connected-components",
    title: "Number of Strongly Connected Components",
    difficulty: "medium",
    sortOrder: 2,
  },
];

const graphsQuestionsBySubtopicSlug: Record<string, QuestionSeed[]> = {
  bfs: bfsQuestions,
  dfs: dfsQuestions,
  "topological-sort": topologicalSortQuestions,
  "union-find": unionFindQuestions,
  dijkstra: dijkstraQuestions,
  "bellman-ford": bellmanFordQuestions,
  "floyd-warshall": floydWarshallQuestions,
  mst: mstQuestions,
  "bipartite-check": bipartiteQuestions,
  "bridges-articulation-points": bridgesQuestions,
  "kosaraju-scc": kosarajuQuestions,
};

async function seedTopics() {
  await db.insert(schema.topic).values(topics).onConflictDoNothing({ target: schema.topic.slug });

  const rows = await db.query.topic.findMany({
    where: { slug: { in: topics.map((t) => t.slug) } },
  });
  return new Map(rows.map((row) => [row.slug, row.id]));
}

async function seedGraphsSubtopics(graphsTopicId: string) {
  await db
    .insert(schema.subtopic)
    .values(graphsSubtopics.map((s) => ({ ...s, topicId: graphsTopicId })))
    .onConflictDoNothing({ target: [schema.subtopic.topicId, schema.subtopic.slug] });

  const rows = await db.query.subtopic.findMany({
    where: { topicId: graphsTopicId, slug: { in: graphsSubtopics.map((s) => s.slug) } },
  });
  return new Map(rows.map((row) => [row.slug, row.id]));
}

async function seedBfsGroups(bfsSubtopicId: string) {
  await db
    .insert(schema.questionGroup)
    .values(bfsGroups.map((g) => ({ ...g, subtopicId: bfsSubtopicId })))
    .onConflictDoNothing({ target: [schema.questionGroup.subtopicId, schema.questionGroup.name] });

  const rows = await db.query.questionGroup.findMany({
    where: { subtopicId: bfsSubtopicId, name: { in: bfsGroups.map((g) => g.name) } },
  });
  return new Map(rows.map((row) => [row.name, row.id]));
}

async function seedQuestionsForSubtopic(
  subtopicId: string,
  questions: QuestionSeed[],
  groupIdByName?: Map<string, string>,
) {
  if (questions.length === 0) return;

  await db
    .insert(schema.question)
    .values(
      questions.map(({ groupName, ...q }) => ({
        ...q,
        subtopicId,
        groupId: groupName ? groupIdByName?.get(groupName) : undefined,
      })),
    )
    .onConflictDoNothing({ target: [schema.question.subtopicId, schema.question.slug] });
}

async function main() {
  console.log("Seeding topics...");
  const topicIdBySlug = await seedTopics();

  const graphsTopicId = topicIdBySlug.get("graphs");
  if (!graphsTopicId) throw new Error("Graphs topic was not seeded");

  console.log("Seeding Graphs subtopics...");
  const subtopicIdBySlug = await seedGraphsSubtopics(graphsTopicId);

  const bfsSubtopicId = subtopicIdBySlug.get("bfs");
  if (!bfsSubtopicId) throw new Error("BFS subtopic was not seeded");

  console.log("Seeding BFS question groups...");
  const bfsGroupIdByName = await seedBfsGroups(bfsSubtopicId);

  console.log("Seeding Graphs questions...");
  for (const [slug, questions] of Object.entries(graphsQuestionsBySubtopicSlug)) {
    const subtopicId = subtopicIdBySlug.get(slug);
    if (!subtopicId) throw new Error(`Subtopic "${slug}" was not seeded`);
    await seedQuestionsForSubtopic(
      subtopicId,
      questions,
      slug === "bfs" ? bfsGroupIdByName : undefined,
    );
  }

  const questionCount = Object.values(graphsQuestionsBySubtopicSlug).reduce(
    (sum, qs) => sum + qs.length,
    0,
  );
  console.log(
    `Done: ${topics.length} topics, ${graphsSubtopics.length} Graphs subtopics, ${bfsGroups.length} BFS groups, ${questionCount} Graphs questions.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => void client.end());
