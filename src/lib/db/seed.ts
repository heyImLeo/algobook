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
  // Marks the hidden per-topic subtopic holding Mixed Practice's question
  // pool — questions here must not also appear in any other subtopic.
  isMixedPool?: boolean;
  sortOrder: number;
}

/** Every topic gets exactly this one Mixed Practice pool subtopic. */
function mixedPracticeSubtopicSeed(sortOrder: number): SubtopicSeed {
  return {
    slug: "mixed-practice",
    name: "Mixed Practice",
    description:
      "A standalone pool of problems for this topic that don't appear in any subtopic above — no pattern label attached, closer to how a problem shows up in a real interview.",
    isMixedPool: true,
    sortOrder,
  };
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

const arraysSubtopics: SubtopicSeed[] = [
  {
    slug: "two-pointers",
    name: "Two Pointers",
    description:
      "Two indices moving toward each other or in the same direction to avoid nested loops. Works whenever the array is sorted or the problem has a monotonic property you can exploit — most O(n²) brute-force solutions here collapse to O(n).",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    bestFor:
      "Sorted-array pair/triplet sums, in-place partitioning, container/trapping-water problems",
    sortOrder: 1,
    referenceContent: `## When to Use

- Find a pair or triplet in a sorted array that sums to a target
- Reverse or partition an array in place
- Compare from both ends (palindrome check, trapping rain water)

## Core Idea

Instead of checking every pair with nested loops (O(n²)), keep two indices and move them based on a comparison, eliminating impossible candidates each step.

## Template — Opposite-End Pointers (Sorted Array)

\`\`\`python
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1

    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return [left, right]
        elif total < target:
            left += 1
        else:
            right -= 1

    return [-1, -1]
\`\`\`

## Template — Fast/Slow Pointers (In-Place)

\`\`\`python
def remove_duplicates(nums):
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    return slow + 1
\`\`\`

## Key Insight: Every Move Must Eliminate a Possibility

Each pointer move should provably rule out at least one candidate — that's what gives two pointers its O(n) bound instead of degrading to O(n²).

## Common Mistakes

- Using two pointers on an unsorted array without sorting first, when the comparison depends on order
- Off-by-one errors in the \`left < right\` vs \`left <= right\` boundary
- Not skipping duplicate values in triplet problems (3Sum), producing repeated results`,
  },
  {
    slug: "sliding-window",
    name: "Sliding Window",
    description:
      "A window of indices that expands and contracts over a sequence, maintaining some invariant — a running sum, count, or frequency map — without recomputing it from scratch at every step.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) – O(k)",
    bestFor: "Longest/shortest subarray or substring under a sum, count, or frequency constraint",
    sortOrder: 2,
    referenceContent: `## When to Use

- "Longest/shortest subarray or substring with [condition]"
- A fixed-size window aggregate (e.g. max sum of size k)
- Substring problems with character-frequency constraints

## Core Idea

Maintain a window \`[left, right]\` and an incrementally-updated running state. Expand \`right\` to include new elements; shrink \`left\` only when the invariant breaks, so each element enters and leaves the window at most once — O(n) total instead of O(n²).

## Template — Fixed-Size Window

\`\`\`python
def max_sum_subarray(nums, k):
    window_sum = sum(nums[:k])
    best = window_sum

    for right in range(k, len(nums)):
        window_sum += nums[right] - nums[right - k]
        best = max(best, window_sum)

    return best
\`\`\`

## Template — Variable-Size Window (Shrink While Invalid)

\`\`\`python
def longest_subarray_at_most_k_distinct(nums, k):
    count = {}
    left = 0
    best = 0

    for right, val in enumerate(nums):
        count[val] = count.get(val, 0) + 1

        while len(count) > k:
            count[nums[left]] -= 1
            if count[nums[left]] == 0:
                del count[nums[left]]
            left += 1

        best = max(best, right - left + 1)

    return best
\`\`\`

## Key Insight: Left Only Moves Forward

The left pointer never resets or moves backward — that monotonicity is exactly what keeps the total work O(n) instead of O(n²).

## Common Mistakes

- Recomputing the window's sum/count from scratch on every shift instead of updating it incrementally
- Shrinking the window with \`if\` instead of \`while\`, leaving it invalid after a single step
- Forgetting whether \`best\` should be updated before or after the window becomes invalid`,
  },
  {
    slug: "prefix-sum",
    name: "Prefix Sum",
    description:
      "Precompute cumulative sums once so any range-sum query becomes an O(1) subtraction instead of an O(n) rescan. The same idea generalizes to prefix XOR, prefix counts, and 2D prefix sums.",
    timeComplexity: "O(n) preprocess, O(1) per query",
    spaceComplexity: "O(n)",
    bestFor: "Range-sum queries, subarray-sum-equals-k, difference arrays for range updates",
    sortOrder: 3,
    referenceContent: `## When to Use

- Many queries for the sum of a subarray \`[i, j]\`
- "Number of subarrays with sum equal to k"
- Range-update problems (the difference-array trick)

## Core Idea

Build \`prefix[i] = nums[0] + ... + nums[i-1]\`. Then \`sum(i, j) = prefix[j+1] - prefix[i]\`. Paired with a hash map of prefix sums seen so far, this turns "does a subarray sum to k" into a single O(n) pass.

## Template — Prefix Sum Array

\`\`\`python
def build_prefix(nums):
    prefix = [0] * (len(nums) + 1)
    for i, val in enumerate(nums):
        prefix[i + 1] = prefix[i] + val
    return prefix

def range_sum(prefix, i, j):
    return prefix[j + 1] - prefix[i]
\`\`\`

## Template — Subarray Sum Equals K

\`\`\`python
def subarray_sum_equals_k(nums, k):
    count = {0: 1}
    running = 0
    total = 0

    for val in nums:
        running += val
        total += count.get(running - k, 0)
        count[running] = count.get(running, 0) + 1

    return total
\`\`\`

## Key Insight: \`count[0] = 1\` Seeds the Empty Prefix

Initializing the hash map with \`{0: 1}\` accounts for a subarray that starts at index 0 — without it you'd silently undercount every subarray beginning at the very start.

## Common Mistakes

- Off-by-one errors between the prefix array's length (n+1) and the original array's indices
- Forgetting to seed \`count = {0: 1}\` in the subarray-sum-equals-k pattern
- Reaching for a static prefix array when the array is frequently updated — a Fenwick tree (BIT) is the right tool there`,
  },
  {
    slug: "kadanes-algorithm",
    name: "Kadane's Algorithm",
    description:
      "A single-pass dynamic-programming trick for the maximum-sum contiguous subarray: at each index, decide whether to extend the previous subarray or start fresh, keeping a running best as you go.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    bestFor:
      "Maximum (or minimum) sum contiguous subarray, and its product and circular-array variants",
    sortOrder: 4,
    referenceContent: `## When to Use

- "Maximum sum contiguous subarray"
- Maximum product subarray (track a running min AND max, since a negative can flip them)
- Circular-array variants (max of plain Kadane's and total-sum-minus-min-subarray)

## Core Idea

At each position, the best subarray ending here is either just this element, or this element plus the best subarray ending at the previous position — whichever is larger. Track a running "current" and a global "best".

## Template — Maximum Subarray Sum

\`\`\`python
def max_subarray(nums):
    current = best = nums[0]

    for val in nums[1:]:
        current = max(val, current + val)
        best = max(best, current)

    return best
\`\`\`

## Template — Maximum Product Subarray

\`\`\`python
def max_product_subarray(nums):
    cur_max = cur_min = best = nums[0]

    for val in nums[1:]:
        candidates = (val, cur_max * val, cur_min * val)
        cur_max, cur_min = max(candidates), min(candidates)
        best = max(best, cur_max)

    return best
\`\`\`

## Key Insight: "Extend or Restart" Is a One-Line Decision

The entire algorithm is \`current = max(val, current + val)\` — if the running sum ever drops below the value of starting fresh at the current element, discard it and restart.

## Common Mistakes

- Resetting \`current\` to 0 instead of comparing against starting fresh at the current value — breaks when every number is negative
- Tracking only a running max (not also a min) for the product variant, since multiplying by a negative number can turn the smallest running product into the largest
- Assuming the answer is always non-negative — for an all-negative array, the answer is the least-negative single element`,
  },
];

const twoPointersGroups: GroupSeed[] = [
  {
    name: "Opposite-End Pointers",
    description: "Start from both ends of a sorted array and move inward based on a comparison.",
    sortOrder: 1,
  },
  {
    name: "Fast/Slow In-Place Partitioning",
    description: "Both pointers move in the same direction, rewriting the array as they go.",
    sortOrder: 2,
  },
];

const twoPointersQuestions: QuestionSeed[] = [
  {
    slug: "two-sum-ii-input-array-is-sorted",
    title: "Two Sum II - Input Array Is Sorted",
    leetcodeNumber: 167,
    url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    difficulty: "medium",
    sortOrder: 1,
    groupName: "Opposite-End Pointers",
  },
  {
    slug: "3sum",
    title: "3Sum",
    leetcodeNumber: 15,
    url: "https://leetcode.com/problems/3sum/",
    difficulty: "medium",
    sortOrder: 2,
    groupName: "Opposite-End Pointers",
  },
  {
    slug: "container-with-most-water",
    title: "Container With Most Water",
    leetcodeNumber: 11,
    url: "https://leetcode.com/problems/container-with-most-water/",
    difficulty: "medium",
    sortOrder: 3,
    groupName: "Opposite-End Pointers",
  },
  {
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    leetcodeNumber: 42,
    url: "https://leetcode.com/problems/trapping-rain-water/",
    difficulty: "hard",
    sortOrder: 4,
    groupName: "Opposite-End Pointers",
  },
  {
    slug: "remove-duplicates-from-sorted-array",
    title: "Remove Duplicates from Sorted Array",
    leetcodeNumber: 26,
    url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
    difficulty: "easy",
    sortOrder: 1,
    groupName: "Fast/Slow In-Place Partitioning",
  },
  {
    slug: "sort-colors",
    title: "Sort Colors",
    leetcodeNumber: 75,
    url: "https://leetcode.com/problems/sort-colors/",
    difficulty: "medium",
    sortOrder: 2,
    groupName: "Fast/Slow In-Place Partitioning",
  },
];

const slidingWindowGroups: GroupSeed[] = [
  {
    name: "Fixed-Size Window",
    description: "The window width is a given constant k that never changes.",
    sortOrder: 1,
  },
  {
    name: "Variable-Size Window",
    description:
      "The window grows and shrinks based on whether it currently satisfies a constraint.",
    sortOrder: 2,
  },
];

const slidingWindowQuestions: QuestionSeed[] = [
  {
    slug: "maximum-average-subarray-i",
    title: "Maximum Average Subarray I",
    leetcodeNumber: 643,
    url: "https://leetcode.com/problems/maximum-average-subarray-i/",
    difficulty: "easy",
    sortOrder: 1,
    groupName: "Fixed-Size Window",
  },
  {
    slug: "minimum-size-subarray-sum",
    title: "Minimum Size Subarray Sum",
    leetcodeNumber: 209,
    url: "https://leetcode.com/problems/minimum-size-subarray-sum/",
    difficulty: "medium",
    sortOrder: 1,
    groupName: "Variable-Size Window",
  },
  {
    slug: "max-consecutive-ones-iii",
    title: "Max Consecutive Ones III",
    leetcodeNumber: 1004,
    url: "https://leetcode.com/problems/max-consecutive-ones-iii/",
    difficulty: "medium",
    sortOrder: 2,
    groupName: "Variable-Size Window",
  },
  {
    slug: "fruit-into-baskets",
    title: "Fruit Into Baskets",
    leetcodeNumber: 904,
    url: "https://leetcode.com/problems/fruit-into-baskets/",
    difficulty: "medium",
    sortOrder: 3,
    groupName: "Variable-Size Window",
  },
  {
    slug: "subarrays-with-k-different-integers",
    title: "Subarrays with K Different Integers",
    leetcodeNumber: 992,
    url: "https://leetcode.com/problems/subarrays-with-k-different-integers/",
    difficulty: "hard",
    sortOrder: 4,
    groupName: "Variable-Size Window",
  },
];

const prefixSumQuestions: QuestionSeed[] = [
  {
    slug: "range-sum-query-immutable",
    title: "Range Sum Query - Immutable",
    leetcodeNumber: 303,
    url: "https://leetcode.com/problems/range-sum-query-immutable/",
    difficulty: "easy",
    sortOrder: 1,
  },
  {
    slug: "find-pivot-index",
    title: "Find Pivot Index",
    leetcodeNumber: 724,
    url: "https://leetcode.com/problems/find-pivot-index/",
    difficulty: "easy",
    sortOrder: 2,
  },
  {
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    leetcodeNumber: 238,
    url: "https://leetcode.com/problems/product-of-array-except-self/",
    difficulty: "medium",
    sortOrder: 3,
  },
  {
    slug: "subarray-sum-equals-k",
    title: "Subarray Sum Equals K",
    leetcodeNumber: 560,
    url: "https://leetcode.com/problems/subarray-sum-equals-k/",
    difficulty: "medium",
    sortOrder: 4,
  },
  {
    slug: "contiguous-array",
    title: "Contiguous Array",
    leetcodeNumber: 525,
    url: "https://leetcode.com/problems/contiguous-array/",
    difficulty: "medium",
    sortOrder: 5,
  },
];

const kadanesAlgorithmQuestions: QuestionSeed[] = [
  {
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    leetcodeNumber: 121,
    url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    difficulty: "easy",
    sortOrder: 1,
  },
  {
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    leetcodeNumber: 53,
    url: "https://leetcode.com/problems/maximum-subarray/",
    difficulty: "medium",
    sortOrder: 2,
  },
  {
    slug: "maximum-product-subarray",
    title: "Maximum Product Subarray",
    leetcodeNumber: 152,
    url: "https://leetcode.com/problems/maximum-product-subarray/",
    difficulty: "medium",
    sortOrder: 3,
  },
  {
    slug: "maximum-sum-circular-subarray",
    title: "Maximum Sum Circular Subarray",
    leetcodeNumber: 918,
    url: "https://leetcode.com/problems/maximum-sum-circular-subarray/",
    difficulty: "medium",
    sortOrder: 4,
  },
];

const arraysGroupsBySubtopicSlug: Record<string, GroupSeed[]> = {
  "two-pointers": twoPointersGroups,
  "sliding-window": slidingWindowGroups,
};

const arraysQuestionsBySubtopicSlug: Record<string, QuestionSeed[]> = {
  "two-pointers": twoPointersQuestions,
  "sliding-window": slidingWindowQuestions,
  "prefix-sum": prefixSumQuestions,
  "kadanes-algorithm": kadanesAlgorithmQuestions,
};

const linkedListsSubtopics: SubtopicSeed[] = [
  {
    slug: "fast-slow-pointers",
    name: "Fast & Slow Pointers",
    description:
      "Two pointers moving through the list at different speeds — one step at a time and two steps at a time. When the fast pointer would otherwise run off the end, you learn about the list's length; when it laps the slow pointer, you've found a cycle.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    bestFor: "Cycle detection, finding the middle node, finding where a cycle begins",
    sortOrder: 1,
    referenceContent: `## When to Use

- Detect whether a linked list has a cycle
- Find the middle node in one pass
- Find where a cycle begins

## Core Idea

Move \`slow\` one step and \`fast\` two steps per iteration. If there's no cycle, \`fast\` reaches the end first. If there is a cycle, \`fast\` eventually laps \`slow\` and they meet inside the loop — this is Floyd's Tortoise and Hare.

## Template — Cycle Detection

\`\`\`python
def has_cycle(head):
    slow = fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True

    return False
\`\`\`

## Template — Find Cycle Start

\`\`\`python
def detect_cycle_start(head):
    slow = fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            break
    else:
        return None

    pointer = head
    while pointer is not slow:
        pointer = pointer.next
        slow = slow.next
    return pointer
\`\`\`

## Key Insight: Meeting-Point Math Finds the Cycle Start

Once \`slow\` and \`fast\` meet, resetting one pointer to \`head\` and advancing both one step at a time makes them meet exactly at the cycle's start — a direct consequence of the distances each pointer traveled before meeting.

## Common Mistakes

- Checking \`fast.next.next\` without first checking \`fast.next\` — crashes on odd-length lists
- Using \`slow.val == fast.val\` instead of \`slow is fast\` — values can collide without an actual cycle
- Forgetting that "find the middle" with this exact template returns the second middle node on even-length lists`,
  },
  {
    slug: "reversal",
    name: "Reversal",
    description:
      "Rewiring `next` pointers so the list points the other way, either for the whole list or a bounded sublist. The iterative version marches three pointers together; the recursive version reverses from the tail backward.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) iterative, O(n) recursive",
    bestFor: "Reverse a whole list, reverse a sublist in place, reverse in groups of k",
    sortOrder: 2,
    referenceContent: `## When to Use

- Reverse an entire linked list
- Reverse only a sublist \`[left, right]\`
- Reverse in groups of k nodes (harder variant)

## Core Idea

Walk the list once, and at each node redirect \`next\` to point backward instead of forward, carrying three pointers: \`prev\`, \`curr\`, and a saved \`next\` so you don't lose the rest of the list when you overwrite \`curr.next\`.

## Template — Iterative Reversal

\`\`\`python
def reverse_list(head):
    prev = None
    curr = head

    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node

    return prev
\`\`\`

## Template — Recursive Reversal

\`\`\`python
def reverse_list_recursive(head):
    if head is None or head.next is None:
        return head

    new_head = reverse_list_recursive(head.next)
    head.next.next = head
    head.next = None
    return new_head
\`\`\`

## Key Insight: Save \`next\` Before You Overwrite It

The iterative algorithm hinges on saving \`curr.next\` into a temporary variable BEFORE reassigning \`curr.next = prev\` — otherwise the rest of the list is lost permanently.

## Common Mistakes

- Overwriting \`curr.next\` before saving it, severing the link to the rest of the list
- Forgetting to set the original head's \`next\` to \`None\` after reversal, leaving a cycle back into the untouched portion
- For sublist reversal, losing track of the node just before \`left\` — you need it to reattach the reversed piece`,
  },
  {
    slug: "merge-sort",
    name: "Merge & Sort",
    description:
      "Combine or reorder linked lists without extra array storage, exploiting the fact that splicing a node into a new position is an O(1) pointer rewrite once you've found the spot.",
    timeComplexity: "O(n log n) sort, O(n) merge",
    spaceComplexity: "O(1) – O(log n)",
    bestFor: "Merge two sorted lists, merge k sorted lists, sort a linked list",
    sortOrder: 3,
    referenceContent: `## When to Use

- Merge two already-sorted linked lists into one
- Merge k sorted linked lists (combine with a heap)
- Sort a linked list from scratch — merge sort is the natural fit since it needs no random access

## Core Idea

Use a dummy head node to avoid special-casing the first node, then repeatedly attach the smaller of two current nodes to the result, advancing that list's pointer.

## Template — Merge Two Sorted Lists

\`\`\`python
def merge_two_lists(a, b):
    dummy = tail = ListNode()

    while a and b:
        if a.val <= b.val:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next

    tail.next = a or b
    return dummy.next
\`\`\`

## Template — Merge k Sorted Lists (Min-Heap)

\`\`\`python
import heapq

def merge_k_lists(lists):
    heap = [(node.val, i, node) for i, node in enumerate(lists) if node]
    heapq.heapify(heap)
    dummy = tail = ListNode()

    while heap:
        val, i, node = heapq.heappop(heap)
        tail.next = node
        tail = tail.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))

    return dummy.next
\`\`\`

## Key Insight: A Dummy Head Removes Edge Cases

Starting \`tail\` at a throwaway dummy node means the first real node is attached exactly like every other node — no special "is this the first node?" branch needed.

## Common Mistakes

- Forgetting the tie-breaker index in the heap tuple — comparing \`ListNode\` objects directly on a value tie raises a \`TypeError\`
- Not advancing \`tail\` after attaching a node, so the next attachment overwrites it
- Assuming \`tail.next = a or b\` handles the leftover list — it only works because the loop guarantees at most one of \`a\`/\`b\` is still non-empty`,
  },
  {
    slug: "two-pointer-manipulation",
    name: "Two-Pointer List Manipulation",
    description:
      "Two pointers offset by a fixed gap, or walking two different lists in lockstep, solve a family of positional problems in one pass without ever computing the list's length up front.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    bestFor:
      "Remove the nth node from the end, find where two lists intersect, check for a palindrome",
    sortOrder: 4,
    referenceContent: `## When to Use

- "Remove the nth node from the end of the list" without a separate length-counting pass
- Find the node where two linked lists intersect
- Check whether a linked list reads the same forward and backward

## Core Idea

For "nth from the end," advance one pointer n steps first, then move both pointers together — the gap stays n, so when the lead pointer hits the end, the trailing pointer is exactly n from the end. For intersection, walk both lists and switch to the other list's head when you run out — this equalizes the total distance traveled.

## Template — Remove Nth Node From End

\`\`\`python
def remove_nth_from_end(head, n):
    dummy = ListNode(next=head)
    lead = trail = dummy

    for _ in range(n):
        lead = lead.next

    while lead.next:
        lead = lead.next
        trail = trail.next

    trail.next = trail.next.next
    return dummy.next
\`\`\`

## Template — Intersection of Two Linked Lists

\`\`\`python
def get_intersection_node(head_a, head_b):
    a, b = head_a, head_b
    while a is not b:
        a = a.next if a else head_b
        b = b.next if b else head_a
    return a
\`\`\`

## Key Insight: Switching Lists Equalizes the Walk

If the lists intersect, both pointers travel \`len(a) + len(b)\` total steps before meeting, whether or not they've switched lists yet — which is exactly what makes them arrive at the intersection point together.

## Common Mistakes

- Forgetting the dummy node when the node to remove might be the head itself
- Off-by-one errors in the "advance lead n steps first" loop
- Comparing node VALUES instead of node IDENTITY for the intersection problem — two different nodes can hold equal values without being the real intersection`,
  },
];

const linkedListsQuestionsBySubtopicSlug: Record<string, QuestionSeed[]> = {
  "fast-slow-pointers": [
    {
      slug: "linked-list-cycle",
      title: "Linked List Cycle",
      leetcodeNumber: 141,
      url: "https://leetcode.com/problems/linked-list-cycle/",
      difficulty: "easy",
      sortOrder: 1,
    },
    {
      slug: "linked-list-cycle-ii",
      title: "Linked List Cycle II",
      leetcodeNumber: 142,
      url: "https://leetcode.com/problems/linked-list-cycle-ii/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "middle-of-the-linked-list",
      title: "Middle of the Linked List",
      leetcodeNumber: 876,
      url: "https://leetcode.com/problems/middle-of-the-linked-list/",
      difficulty: "easy",
      sortOrder: 3,
    },
  ],
  reversal: [
    {
      slug: "reverse-linked-list",
      title: "Reverse Linked List",
      leetcodeNumber: 206,
      url: "https://leetcode.com/problems/reverse-linked-list/",
      difficulty: "easy",
      sortOrder: 1,
    },
    {
      slug: "reverse-linked-list-ii",
      title: "Reverse Linked List II",
      leetcodeNumber: 92,
      url: "https://leetcode.com/problems/reverse-linked-list-ii/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "reverse-nodes-in-k-group",
      title: "Reverse Nodes in k-Group",
      leetcodeNumber: 25,
      url: "https://leetcode.com/problems/reverse-nodes-in-k-group/",
      difficulty: "hard",
      sortOrder: 3,
    },
  ],
  "merge-sort": [
    {
      slug: "merge-two-sorted-lists",
      title: "Merge Two Sorted Lists",
      leetcodeNumber: 21,
      url: "https://leetcode.com/problems/merge-two-sorted-lists/",
      difficulty: "easy",
      sortOrder: 1,
    },
    {
      slug: "merge-k-sorted-lists",
      title: "Merge k Sorted Lists",
      leetcodeNumber: 23,
      url: "https://leetcode.com/problems/merge-k-sorted-lists/",
      difficulty: "hard",
      sortOrder: 2,
    },
    {
      slug: "sort-list",
      title: "Sort List",
      leetcodeNumber: 148,
      url: "https://leetcode.com/problems/sort-list/",
      difficulty: "medium",
      sortOrder: 3,
    },
  ],
  "two-pointer-manipulation": [
    {
      slug: "remove-nth-node-from-end-of-list",
      title: "Remove Nth Node From End of List",
      leetcodeNumber: 19,
      url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "intersection-of-two-linked-lists",
      title: "Intersection of Two Linked Lists",
      leetcodeNumber: 160,
      url: "https://leetcode.com/problems/intersection-of-two-linked-lists/",
      difficulty: "easy",
      sortOrder: 2,
    },
    {
      slug: "palindrome-linked-list",
      title: "Palindrome Linked List",
      leetcodeNumber: 234,
      url: "https://leetcode.com/problems/palindrome-linked-list/",
      difficulty: "easy",
      sortOrder: 3,
    },
  ],
};

const stringsSubtopics: SubtopicSeed[] = [
  {
    slug: "sliding-window",
    name: "Sliding Window",
    description:
      "A window over string indices that expands and contracts while tracking a character-frequency map, letting substring problems run in a single O(n) pass instead of checking every substring.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(k) for a k-character alphabet",
    bestFor: "Longest substring without repeats, minimum window substring, finding all anagrams",
    sortOrder: 1,
    referenceContent: `## When to Use

- "Longest/shortest substring with [condition]"
- Find all anagrams of a pattern within a string
- Minimum window containing every character of a target string

## Core Idea

Maintain a frequency map of the current window's characters. Expand the right edge to include new characters; shrink the left edge only when the window violates the constraint — too many repeats, or a missing needed character.

## Template — Longest Substring Without Repeating Characters

\`\`\`python
def length_of_longest_substring(s):
    last_seen = {}
    left = 0
    best = 0

    for right, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= left:
            left = last_seen[ch] + 1
        last_seen[ch] = right
        best = max(best, right - left + 1)

    return best
\`\`\`

## Template — Minimum Window Substring

\`\`\`python
from collections import Counter

def min_window(s, t):
    need = Counter(t)
    missing = len(t)
    left = start = end = 0

    for right, ch in enumerate(s, 1):
        if need[ch] > 0:
            missing -= 1
        need[ch] -= 1

        if missing == 0:
            while left < right and need[s[left]] < 0:
                need[s[left]] += 1
                left += 1
            if end == 0 or right - left < end - start:
                start, end = left, right
            need[s[left]] += 1
            missing += 1
            left += 1

    return s[start:end]
\`\`\`

## Key Insight: Frequency Updates Are O(1) Per Character

Because each character enters and leaves the window exactly once, updating counts incrementally — instead of recomputing frequency from scratch — is what keeps the whole algorithm O(n) instead of O(n²).

## Common Mistakes

- Comparing \`last_seen[ch]\` without checking it's \`>= left\` — a repeat from before the current window shouldn't shrink it
- Skipping the "shrink while still valid" step in minimum-window-substring, which is what finds the tightest possible window
- Treating uppercase/lowercase as equivalent when the problem treats them as distinct characters`,
  },
  {
    slug: "two-pointers",
    name: "Two Pointers",
    description:
      "Two indices closing in from opposite ends of a string, comparing characters as they go — the natural fit whenever a string's validity depends on symmetry rather than order.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    bestFor: "Palindrome checks, reversing words or characters in place, comparing backspace edits",
    sortOrder: 2,
    referenceContent: `## When to Use

- Check whether a string (or a version of it with characters removed) is a palindrome
- Reverse words in a string, or characters within each word, in place
- Compare two strings that both apply "backspace" edits

## Core Idea

Walk from both ends inward. For palindrome checks, mismatched characters mean failure — or, for "at most one removal" variants, a branch point to try skipping one side. For in-place reversal, swap and step inward until the pointers cross.

## Template — Valid Palindrome (Ignoring Non-Alphanumerics)

\`\`\`python
def is_palindrome(s):
    left, right = 0, len(s) - 1

    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1

    return True
\`\`\`

## Template — Valid Palindrome II (At Most One Removal)

\`\`\`python
def valid_palindrome_ii(s):
    def is_pal(i, j):
        while i < j:
            if s[i] != s[j]:
                return False
            i, j = i + 1, j - 1
        return True

    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return is_pal(left + 1, right) or is_pal(left, right - 1)
        left += 1
        right -= 1

    return True
\`\`\`

## Key Insight: Skip-One Branches Reuse the Same Palindrome Check

Rather than writing separate logic for "remove the left character" vs "remove the right character," both branches call the exact same \`is_pal\` helper on a shifted range.

## Common Mistakes

- Forgetting to skip non-alphanumeric characters (and normalize case) before comparing
- In the "at most one removal" variant, only trying one of the two skip branches instead of both
- Moving \`left\`/\`right\` past each other instead of stopping the loop at \`left < right\``,
  },
  {
    slug: "hashing-frequency-counting",
    name: "Hashing & Frequency Counting",
    description:
      "A character-count map (or a fixed-size array for a known alphabet) turns 'do these strings use the same letters' into an O(n) comparison instead of a sort.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) fixed alphabet, O(n) general",
    bestFor: "Anagram detection and grouping, first unique character, isomorphic strings",
    sortOrder: 3,
    referenceContent: `## When to Use

- Group or detect anagrams
- Find the first non-repeating character
- Check whether two strings follow the same character-mapping pattern (isomorphic strings)

## Core Idea

Count character occurrences once, then compare or key by that count instead of repeatedly re-scanning. A sorted string or a tuple of counts makes a great hashable "signature" for grouping.

## Template — Group Anagrams

\`\`\`python
from collections import defaultdict

def group_anagrams(strs):
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))
        groups[key].append(s)
    return list(groups.values())
\`\`\`

## Template — Isomorphic Strings

\`\`\`python
def is_isomorphic(s, t):
    map_st, map_ts = {}, {}

    for a, b in zip(s, t):
        if a in map_st and map_st[a] != b:
            return False
        if b in map_ts and map_ts[b] != a:
            return False
        map_st[a] = b
        map_ts[b] = a

    return True
\`\`\`

## Key Insight: A Sorted String Is a Cheap Canonical Key

Two strings are anagrams exactly when their sorted forms are identical — sorting turns "same multiset of characters" into "same string," which is trivially hashable and comparable.

## Common Mistakes

- Using only a forward character mapping for isomorphic strings — you need BOTH directions, or two different source characters could map to the same target
- Sorting as the grouping key when a fixed-size count array would be faster (sorting is O(n log n) per string; counting is O(n))
- Handling case-sensitivity inconsistently between different parts of the same solution`,
  },
];

const stringsQuestionsBySubtopicSlug: Record<string, QuestionSeed[]> = {
  "sliding-window": [
    {
      slug: "longest-substring-without-repeating-characters",
      title: "Longest Substring Without Repeating Characters",
      leetcodeNumber: 3,
      url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "longest-repeating-character-replacement",
      title: "Longest Repeating Character Replacement",
      leetcodeNumber: 424,
      url: "https://leetcode.com/problems/longest-repeating-character-replacement/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "permutation-in-string",
      title: "Permutation in String",
      leetcodeNumber: 567,
      url: "https://leetcode.com/problems/permutation-in-string/",
      difficulty: "medium",
      sortOrder: 3,
    },
    {
      slug: "find-all-anagrams-in-a-string",
      title: "Find All Anagrams in a String",
      leetcodeNumber: 438,
      url: "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
      difficulty: "medium",
      sortOrder: 4,
    },
    {
      slug: "minimum-window-substring",
      title: "Minimum Window Substring",
      leetcodeNumber: 76,
      url: "https://leetcode.com/problems/minimum-window-substring/",
      difficulty: "hard",
      sortOrder: 5,
    },
  ],
  "two-pointers": [
    {
      slug: "valid-palindrome",
      title: "Valid Palindrome",
      leetcodeNumber: 125,
      url: "https://leetcode.com/problems/valid-palindrome/",
      difficulty: "easy",
      sortOrder: 1,
    },
    {
      slug: "valid-palindrome-ii",
      title: "Valid Palindrome II",
      leetcodeNumber: 680,
      url: "https://leetcode.com/problems/valid-palindrome-ii/",
      difficulty: "easy",
      sortOrder: 2,
    },
    {
      slug: "reverse-words-in-a-string",
      title: "Reverse Words in a String",
      leetcodeNumber: 151,
      url: "https://leetcode.com/problems/reverse-words-in-a-string/",
      difficulty: "medium",
      sortOrder: 3,
    },
    {
      slug: "backspace-string-compare",
      title: "Backspace String Compare",
      leetcodeNumber: 844,
      url: "https://leetcode.com/problems/backspace-string-compare/",
      difficulty: "easy",
      sortOrder: 4,
    },
  ],
  "hashing-frequency-counting": [
    {
      slug: "valid-anagram",
      title: "Valid Anagram",
      leetcodeNumber: 242,
      url: "https://leetcode.com/problems/valid-anagram/",
      difficulty: "easy",
      sortOrder: 1,
    },
    {
      slug: "group-anagrams",
      title: "Group Anagrams",
      leetcodeNumber: 49,
      url: "https://leetcode.com/problems/group-anagrams/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "first-unique-character-in-a-string",
      title: "First Unique Character in a String",
      leetcodeNumber: 387,
      url: "https://leetcode.com/problems/first-unique-character-in-a-string/",
      difficulty: "easy",
      sortOrder: 3,
    },
    {
      slug: "isomorphic-strings",
      title: "Isomorphic Strings",
      leetcodeNumber: 205,
      url: "https://leetcode.com/problems/isomorphic-strings/",
      difficulty: "easy",
      sortOrder: 4,
    },
    {
      slug: "ransom-note",
      title: "Ransom Note",
      leetcodeNumber: 383,
      url: "https://leetcode.com/problems/ransom-note/",
      difficulty: "easy",
      sortOrder: 5,
    },
  ],
};

const stacksQueuesSubtopics: SubtopicSeed[] = [
  {
    slug: "monotonic-stack",
    name: "Monotonic Stack",
    description:
      "A stack that only ever holds increasing (or decreasing) values, popping off anything the next arrival outclasses. Answers 'next greater/smaller element' queries in one O(n) pass instead of O(n²) nested loops.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    bestFor: "Next greater/smaller element, Daily Temperatures, largest rectangle in a histogram",
    sortOrder: 1,
    referenceContent: `## When to Use

- "Next greater element" / "next smaller element" for every position
- Daily Temperatures — how many days until a warmer day
- Largest rectangle in a histogram

## Core Idea

Push indices onto a stack while scanning left to right. Before pushing a new index, pop everything on the stack that the new value "beats" — each popped index just found its answer. Because each index is pushed and popped at most once, the whole scan is O(n) even though it looks like nested loops.

## Template — Next Greater Element

\`\`\`python
def next_greater_elements(nums):
    result = [-1] * len(nums)
    stack = []  # indices, values decreasing bottom to top

    for i, val in enumerate(nums):
        while stack and nums[stack[-1]] < val:
            result[stack.pop()] = val
        stack.append(i)

    return result
\`\`\`

## Template — Largest Rectangle in Histogram

\`\`\`python
def largest_rectangle_area(heights):
    stack = []  # indices, heights increasing bottom to top
    best = 0
    heights = heights + [0]  # sentinel forces a final flush

    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            best = max(best, height * width)
        stack.append(i)

    return best
\`\`\`

## Key Insight: Each Element Is Pushed and Popped at Most Once

The total work across every \`while\` iteration, summed over the whole scan, is bounded by the number of pushes — so despite the nested-looking loop, the algorithm is O(n), not O(n²).

## Common Mistakes

- Storing values instead of indices — you often need the index to compute a distance or width, not just the value
- Forgetting the sentinel value at the end of the histogram template, which leaves elements stuck on the stack unflushed
- Getting the comparison direction backward — "next greater" pops while the top is SMALLER than the new value`,
  },
  {
    slug: "parentheses-matching",
    name: "Parentheses & Matching",
    description:
      "A stack naturally mirrors nested structure: push an opening bracket, and when a closing bracket arrives it must match whatever is on top. Any mismatch or leftover element means the sequence is invalid.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    bestFor:
      "Validating balanced brackets, longest valid parentheses substring, removing invalid parentheses",
    sortOrder: 2,
    referenceContent: `## When to Use

- Check whether a string of brackets is balanced
- Find the longest valid parentheses substring
- Remove the minimum number of parentheses to make a string valid

## Core Idea

Push every opening bracket. On a closing bracket, pop and check it matches the expected type — if the stack is empty or the types don't match, the sequence is invalid. A valid sequence ends with an empty stack.

## Template — Valid Parentheses

\`\`\`python
def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []

    for ch in s:
        if ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)

    return not stack
\`\`\`

## Template — Longest Valid Parentheses (Index Stack)

\`\`\`python
def longest_valid_parentheses(s):
    stack = [-1]  # base index before the string starts
    best = 0

    for i, ch in enumerate(s):
        if ch == "(":
            stack.append(i)
        else:
            stack.pop()
            if not stack:
                stack.append(i)  # new base for the next valid run
            else:
                best = max(best, i - stack[-1])

    return best
\`\`\`

## Key Insight: An Empty Stack at the End Is the Whole Check

You don't need extra bookkeeping to validate balance — an empty stack after processing every character IS the definition of "properly balanced."

## Common Mistakes

- Forgetting to check the stack is non-empty before popping, crashing on an unmatched closing bracket
- Not checking the stack is empty at the very end — a trailing unmatched opener would otherwise look valid
- In the longest-valid-parentheses variant, forgetting the base \`-1\` sentinel, which is what makes the very first valid run measurable`,
  },
  {
    slug: "stack-simulation",
    name: "Stack-Based Simulation",
    description:
      "Some problems are just 'simulate what a stack-based evaluator would do' — expression evaluation, encoded string expansion, or a stack that also tracks its own running minimum.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    bestFor: "Evaluating expressions, decoding run-length-encoded strings, O(1) minimum tracking",
    sortOrder: 3,
    referenceContent: `## When to Use

- Evaluate a mathematical expression, with or without parentheses
- Decode a string like \`3[a2[c]]\` into \`accaccacc\`
- Design a stack that supports \`getMin()\` in O(1)

## Core Idea

Use the stack to hold "work in progress" — partial results, pending operators, or repeat counts — and pop/combine them when you hit a delimiter that signals a sub-computation is complete.

## Template — Basic Calculator (No Parentheses, + - * /)

\`\`\`python
def evaluate(s):
    stack = []
    num = 0
    sign = "+"

    for ch in s + "+":
        if ch.isdigit():
            num = num * 10 + int(ch)
        elif ch != " ":
            if sign == "+":
                stack.append(num)
            elif sign == "-":
                stack.append(-num)
            elif sign == "*":
                stack.append(stack.pop() * num)
            elif sign == "/":
                stack.append(int(stack.pop() / num))
            sign = ch
            num = 0

    return sum(stack)
\`\`\`

## Template — Min Stack (O(1) getMin)

\`\`\`python
class MinStack:
    def __init__(self):
        self.stack = []  # (value, min_so_far)

    def push(self, val):
        current_min = val if not self.stack else min(val, self.stack[-1][1])
        self.stack.append((val, current_min))

    def pop(self):
        self.stack.pop()

    def top(self):
        return self.stack[-1][0]

    def get_min(self):
        return self.stack[-1][1]
\`\`\`

## Key Insight: Store Derived State Alongside Each Element

Pairing every pushed value with the running minimum AT THE TIME it was pushed means popping automatically "restores" the correct previous minimum — no recomputation needed.

## Common Mistakes

- Forgetting the trailing sentinel operator that flushes the last number in the calculator template
- Applying \`*\`/\`/\` against the wrong operand — they need the PREVIOUS stack value, not just the current number
- Storing only the value in a min-stack instead of pairing it with the minimum, making \`getMin()\` O(n) instead of O(1)`,
  },
  {
    slug: "monotonic-deque",
    name: "Monotonic Deque",
    description:
      "A double-ended queue that stays sorted by discarding elements from the back that a new arrival immediately outclasses, giving O(1) amortized access to the window's best value from the front.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
    bestFor: "Sliding window maximum/minimum, and DP recurrences needing a windowed running best",
    sortOrder: 4,
    referenceContent: `## When to Use

- Sliding window maximum or minimum
- DP recurrences that need the best value among the last k computed states

## Core Idea

Keep indices in the deque with their values in decreasing order (for a max-deque). When a new value arrives, pop everything smaller from the back before pushing it — those popped values can never be the answer for any future window, since the new value is both later AND bigger. Pop from the front when the front index falls outside the current window.

## Template — Sliding Window Maximum

\`\`\`python
from collections import deque

def max_sliding_window(nums, k):
    dq = deque()  # indices, values decreasing front to back
    result = []

    for i, val in enumerate(nums):
        while dq and nums[dq[-1]] < val:
            dq.pop()
        dq.append(i)

        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            result.append(nums[dq[0]])

    return result
\`\`\`

## Key Insight: The Front of the Deque Is Always the Current Window's Best

Because the deque stays sorted and stale indices are evicted from the front, \`nums[dq[0]]\` is always both in-window and the largest value in it — no scanning needed.

## Common Mistakes

- Popping from the back with the wrong comparison direction, leaving stale duplicates in some variants
- Forgetting to evict from the front once the window has moved past that index
- Appending values to the deque instead of indices, losing the information needed to check whether an entry has aged out of the window`,
  },
];

const stacksQueuesQuestionsBySubtopicSlug: Record<string, QuestionSeed[]> = {
  "monotonic-stack": [
    {
      slug: "next-greater-element-i",
      title: "Next Greater Element I",
      leetcodeNumber: 496,
      url: "https://leetcode.com/problems/next-greater-element-i/",
      difficulty: "easy",
      sortOrder: 1,
    },
    {
      slug: "daily-temperatures",
      title: "Daily Temperatures",
      leetcodeNumber: 739,
      url: "https://leetcode.com/problems/daily-temperatures/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "online-stock-span",
      title: "Online Stock Span",
      leetcodeNumber: 901,
      url: "https://leetcode.com/problems/online-stock-span/",
      difficulty: "medium",
      sortOrder: 3,
    },
    {
      slug: "largest-rectangle-in-histogram",
      title: "Largest Rectangle in Histogram",
      leetcodeNumber: 84,
      url: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
      difficulty: "hard",
      sortOrder: 4,
    },
  ],
  "parentheses-matching": [
    {
      slug: "valid-parentheses",
      title: "Valid Parentheses",
      leetcodeNumber: 20,
      url: "https://leetcode.com/problems/valid-parentheses/",
      difficulty: "easy",
      sortOrder: 1,
    },
    {
      slug: "minimum-remove-to-make-valid-parentheses",
      title: "Minimum Remove to Make Valid Parentheses",
      leetcodeNumber: 1249,
      url: "https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "longest-valid-parentheses",
      title: "Longest Valid Parentheses",
      leetcodeNumber: 32,
      url: "https://leetcode.com/problems/longest-valid-parentheses/",
      difficulty: "hard",
      sortOrder: 3,
    },
  ],
  "stack-simulation": [
    {
      slug: "min-stack",
      title: "Min Stack",
      leetcodeNumber: 155,
      url: "https://leetcode.com/problems/min-stack/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "implement-queue-using-stacks",
      title: "Implement Queue using Stacks",
      leetcodeNumber: 232,
      url: "https://leetcode.com/problems/implement-queue-using-stacks/",
      difficulty: "easy",
      sortOrder: 2,
    },
    {
      slug: "evaluate-reverse-polish-notation",
      title: "Evaluate Reverse Polish Notation",
      leetcodeNumber: 150,
      url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
      difficulty: "medium",
      sortOrder: 3,
    },
    {
      slug: "basic-calculator-ii",
      title: "Basic Calculator II",
      leetcodeNumber: 227,
      url: "https://leetcode.com/problems/basic-calculator-ii/",
      difficulty: "medium",
      sortOrder: 4,
    },
    {
      slug: "decode-string",
      title: "Decode String",
      leetcodeNumber: 394,
      url: "https://leetcode.com/problems/decode-string/",
      difficulty: "medium",
      sortOrder: 5,
    },
  ],
  "monotonic-deque": [
    {
      slug: "jump-game-vi",
      title: "Jump Game VI",
      leetcodeNumber: 1696,
      url: "https://leetcode.com/problems/jump-game-vi/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "shortest-subarray-with-sum-at-least-k",
      title: "Shortest Subarray with Sum at Least K",
      leetcodeNumber: 862,
      url: "https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/",
      difficulty: "hard",
      sortOrder: 2,
    },
    {
      slug: "constrained-subsequence-sum",
      title: "Constrained Subsequence Sum",
      leetcodeNumber: 1425,
      url: "https://leetcode.com/problems/constrained-subsequence-sum/",
      difficulty: "hard",
      sortOrder: 3,
    },
  ],
};

const heapsPqSubtopics: SubtopicSeed[] = [
  {
    slug: "top-k-elements",
    name: "Top-K Elements",
    description:
      "Maintain a heap of size k instead of sorting the whole collection — keeping only the k best-so-far elements turns an O(n log n) sort into an O(n log k) scan.",
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
    bestFor: "Kth largest element, top-k frequent elements, k closest points to the origin",
    sortOrder: 1,
    referenceContent: `## When to Use

- "Find the kth largest/smallest element"
- "Top k frequent elements/words"
- "K closest points to the origin"

## Core Idea

Push elements onto a heap. Once the heap exceeds size k, pop the worst element — for "top k largest," use a MIN-heap of size k, so the smallest of your current top-k is always what gets evicted by anything bigger.

## Template — Kth Largest Element in a Stream

\`\`\`python
import heapq

class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.heap = nums
        heapq.heapify(self.heap)
        while len(self.heap) > k:
            heapq.heappop(self.heap)

    def add(self, val):
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]
\`\`\`

## Template — Top K Frequent Elements

\`\`\`python
import heapq
from collections import Counter

def top_k_frequent(nums, k):
    counts = Counter(nums)
    return heapq.nlargest(k, counts.keys(), key=counts.get)
\`\`\`

## Key Insight: A MIN-Heap Finds the Largest Elements

It feels backward, but to track the k LARGEST values seen so far, you want a MIN-heap of size k — the root is always the smallest of your current top-k, exactly the one that should be evicted when something bigger shows up.

## Common Mistakes

- Using a max-heap (or negating values incorrectly) when a min-heap of size k was needed, or vice versa
- Rebuilding the heap from scratch on every insertion instead of maintaining it incrementally
- Forgetting Python's \`heapq\` is min-heap only — negate values to simulate a max-heap`,
  },
  {
    slug: "k-way-merge",
    name: "K-Way Merge",
    description:
      "Merge many sorted sequences at once by keeping only their current heads in a heap — the smallest head is always the global next element, and popping it reveals the next candidate from that same sequence.",
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
    bestFor:
      "Merging k sorted sequences, smallest range across k lists, k pairs with the smallest sums",
    sortOrder: 2,
    referenceContent: `## When to Use

- Merge k sorted lists or arrays into one sorted sequence
- Find the smallest range that includes at least one number from each of k lists
- Find the k pairs with the smallest sums from two arrays

## Core Idea

Seed a heap with the first element of each sequence, tagged with which sequence and position it came from. Repeatedly pop the smallest, emit it, and push the next element from that same sequence — the heap never holds more than k elements at once.

## Template — Merge k Sorted Arrays

\`\`\`python
import heapq

def merge_k_sorted(arrays):
    heap = [(arr[0], i, 0) for i, arr in enumerate(arrays) if arr]
    heapq.heapify(heap)
    result = []

    while heap:
        val, arr_idx, elem_idx = heapq.heappop(heap)
        result.append(val)
        if elem_idx + 1 < len(arrays[arr_idx]):
            next_val = arrays[arr_idx][elem_idx + 1]
            heapq.heappush(heap, (next_val, arr_idx, elem_idx + 1))

    return result
\`\`\`

## Key Insight: The Heap Never Grows Past k Elements

No matter how many total elements there are across all sequences, the heap only ever holds one "current head" per sequence — that's what keeps the algorithm at O(k) space instead of O(n).

## Common Mistakes

- Forgetting the tie-breaking index in heap tuples, causing a \`TypeError\` when two values tie and the next tuple element isn't comparable
- Pushing an entire sequence's remaining elements at once instead of one at a time — this defeats the point of bounding heap size
- Off-by-one errors tracking which position within each sequence has already been consumed`,
  },
  {
    slug: "two-heaps",
    name: "Two Heaps",
    description:
      "Split the data into a max-heap of the smaller half and a min-heap of the larger half, keeping them balanced in size — the median is then always at the top of one (or both) heaps.",
    timeComplexity: "O(log n) per insert, O(1) per query",
    spaceComplexity: "O(n)",
    bestFor:
      "Running median from a stream, sliding window median, greedy pairing problems like IPO",
    sortOrder: 3,
    referenceContent: `## When to Use

- Maintain the median of a stream of numbers as they arrive
- Sliding window median
- Any problem needing fast access to both "the biggest of the small half" and "the smallest of the big half"

## Core Idea

Keep a max-heap for the lower half of the numbers and a min-heap for the upper half, rebalancing after each insertion so their sizes never differ by more than one. The median is then the top of the larger heap, or the average of both tops if they're equal size.

## Template — Find Median from Data Stream

\`\`\`python
import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # max-heap, stored negated
        self.large = []  # min-heap

    def add_num(self, num):
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))

        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def find_median(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2
\`\`\`

## Key Insight: Push-Then-Rebalance, Never Push Directly to the "Right" Heap

Pushing every new number into \`small\` first and immediately shuffling its max into \`large\` guarantees every value in \`large\` is \`>=\` every value in \`small\`, without ever comparing against the current median.

## Common Mistakes

- Letting the two heaps drift more than one element apart in size, breaking the O(1) median lookup
- Forgetting Python's heap is min-heap only, so the "max-heap" half must store negated values
- Comparing the new number against the current median before deciding which heap to push to — the push-then-rebalance trick avoids needing this entirely`,
  },
  {
    slug: "heap-scheduling",
    name: "Heap Simulation & Scheduling",
    description:
      "Some heap problems are really simulations — repeatedly grab the current best (or worst) item, do something with it, and possibly push it back into the pool for a future round.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    bestFor:
      "Task scheduling with cooldowns, meeting-room allocation, repeatedly combining extreme items",
    sortOrder: 4,
    referenceContent: `## When to Use

- Schedule tasks with a cooldown between repeats of the same task
- Determine the minimum number of meeting rooms needed for overlapping intervals
- Repeatedly combine the two smallest (or largest) items until one remains

## Core Idea

A heap gives O(log n) access to "the current best choice" on every round of a simulation — exactly what greedy scheduling needs, since the best local choice each round is usually the most (or least) urgent item available right now.

## Template — Task Scheduler (Cooldown)

\`\`\`python
import heapq
from collections import Counter

def least_interval(tasks, n):
    counts = list(Counter(tasks).values())
    heap = [-c for c in counts]
    heapq.heapify(heap)
    time = 0
    queue = []  # (available_time, remaining_count)

    while heap or queue:
        time += 1
        if heap:
            count = heapq.heappop(heap) + 1  # one less remaining (stored negative)
            if count < 0:
                queue.append((time + n, count))
        if queue and queue[0][0] == time:
            heapq.heappush(heap, queue.pop(0)[1])

    return time
\`\`\`

## Template — Meeting Rooms II (Minimum Rooms Needed)

\`\`\`python
import heapq

def min_meeting_rooms(intervals):
    intervals.sort(key=lambda pair: pair[0])
    end_times = []  # min-heap of currently occupied rooms' end times

    for start, end in intervals:
        if end_times and end_times[0] <= start:
            heapq.heapreplace(end_times, end)
        else:
            heapq.heappush(end_times, end)

    return len(end_times)
\`\`\`

## Key Insight: Sorting First Turns Interval Scheduling Into a Single Pass

Once meetings are sorted by start time, a min-heap of end times lets you check "is any room free right now" in O(log n) instead of comparing against every other meeting.

## Common Mistakes

- Forgetting to sort intervals by start time before the heap simulation — the greedy logic depends on processing them in order
- In the task scheduler, mismanaging the cooldown queue's ordering, letting a task become available out of order
- Using separate \`heappush\`/\`heappop\` calls where \`heapreplace\` would do both in one O(log n) operation`,
  },
];

const heapsPqQuestionsBySubtopicSlug: Record<string, QuestionSeed[]> = {
  "top-k-elements": [
    {
      slug: "kth-largest-element-in-a-stream",
      title: "Kth Largest Element in a Stream",
      leetcodeNumber: 703,
      url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
      difficulty: "easy",
      sortOrder: 1,
    },
    {
      slug: "kth-largest-element-in-an-array",
      title: "Kth Largest Element in an Array",
      leetcodeNumber: 215,
      url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "top-k-frequent-elements",
      title: "Top K Frequent Elements",
      leetcodeNumber: 347,
      url: "https://leetcode.com/problems/top-k-frequent-elements/",
      difficulty: "medium",
      sortOrder: 3,
    },
    {
      slug: "k-closest-points-to-origin",
      title: "K Closest Points to Origin",
      leetcodeNumber: 973,
      url: "https://leetcode.com/problems/k-closest-points-to-origin/",
      difficulty: "medium",
      sortOrder: 4,
    },
  ],
  "k-way-merge": [
    {
      slug: "kth-smallest-element-in-a-sorted-matrix",
      title: "Kth Smallest Element in a Sorted Matrix",
      leetcodeNumber: 378,
      url: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "find-k-pairs-with-smallest-sums",
      title: "Find K Pairs with Smallest Sums",
      leetcodeNumber: 373,
      url: "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "smallest-range-covering-elements-from-k-lists",
      title: "Smallest Range Covering Elements from K Lists",
      leetcodeNumber: 632,
      url: "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/",
      difficulty: "hard",
      sortOrder: 3,
    },
  ],
  "two-heaps": [
    {
      slug: "find-median-from-data-stream",
      title: "Find Median from Data Stream",
      leetcodeNumber: 295,
      url: "https://leetcode.com/problems/find-median-from-data-stream/",
      difficulty: "hard",
      sortOrder: 1,
    },
    {
      slug: "ipo",
      title: "IPO",
      leetcodeNumber: 502,
      url: "https://leetcode.com/problems/ipo/",
      difficulty: "hard",
      sortOrder: 2,
    },
    {
      slug: "sliding-window-median",
      title: "Sliding Window Median",
      leetcodeNumber: 480,
      url: "https://leetcode.com/problems/sliding-window-median/",
      difficulty: "hard",
      sortOrder: 3,
    },
  ],
  "heap-scheduling": [
    {
      slug: "last-stone-weight",
      title: "Last Stone Weight",
      leetcodeNumber: 1046,
      url: "https://leetcode.com/problems/last-stone-weight/",
      difficulty: "easy",
      sortOrder: 1,
    },
    {
      slug: "meeting-rooms-ii",
      title: "Meeting Rooms II",
      leetcodeNumber: 253,
      url: "https://leetcode.com/problems/meeting-rooms-ii/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "task-scheduler",
      title: "Task Scheduler",
      leetcodeNumber: 621,
      url: "https://leetcode.com/problems/task-scheduler/",
      difficulty: "medium",
      sortOrder: 3,
    },
  ],
};

const searchSubtopics: SubtopicSeed[] = [
  {
    slug: "binary-search-basics",
    name: "Binary Search Basics",
    description:
      "Halve the search space every step by comparing the middle element against the target. The single most important precondition is that the space must be monotonic — sorted, or reducible to a clean yes/no boundary.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    bestFor:
      "Classic sorted-array lookup, insertion points, first/last occurrence among duplicates",
    sortOrder: 1,
    referenceContent: `## When to Use

- Find a target value in a sorted array
- Find the leftmost or rightmost position where a value could be inserted
- Find the first or last occurrence of a target among duplicates

## Core Idea

Compare the middle element to the target. If it matches, you're done — or you narrow further for a first/last-occurrence variant. If the middle is too small, search the right half; if too large, search the left half. Each comparison eliminates half the remaining space.

## Template — Standard Binary Search

\`\`\`python
def binary_search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1
\`\`\`

## Template — Leftmost Insertion Point (Lower Bound)

\`\`\`python
def lower_bound(nums, target):
    left, right = 0, len(nums)

    while left < right:
        mid = (left + right) // 2
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid

    return left
\`\`\`

## Key Insight: The Loop Condition Encodes What You're Looking For

A closed range (\`left <= right\`, both inclusive) is for "does this exact value exist"; a half-open range (\`left < right\`, \`right\` exclusive) is what makes boundary/insertion-point searches converge cleanly without an extra special case.

## Common Mistakes

- Mixing inclusive and exclusive bounds within the same function, causing an infinite loop or an off-by-one
- Forgetting that after a lower-bound search, you still need to check \`nums[left] == target\` if an exact match — not just an insertion point — was required
- Assuming the array has no duplicates when the problem actually needs first/last occurrence handling`,
  },
  {
    slug: "binary-search-on-answer",
    name: "Binary Search on Answer",
    description:
      "When a problem asks to minimize the maximum (or maximize the minimum) of something, and 'can we achieve X?' gets easier as X grows, binary search the space of possible answers instead of the input array itself.",
    timeComplexity: "O(n log(range))",
    spaceComplexity: "O(1)",
    bestFor: "Minimize the maximum load, Koko eating bananas, shipping capacity within D days",
    sortOrder: 2,
    referenceContent: `## When to Use

- "Minimize the maximum X" or "maximize the minimum X"
- The phrase "what is the smallest/largest value such that [condition] is achievable"
- A \`can_achieve(x)\` check exists and is monotonic — true for every x above some threshold, false below it (or vice versa)

## Core Idea

Binary search over the ANSWER, not the input. For each candidate answer, run a feasibility check — usually O(n) — and shrink the search range based on whether it's feasible, converging on the boundary between "not achievable" and "achievable."

## Template — Koko Eating Bananas

\`\`\`python
import math

def min_eating_speed(piles, h):
    def hours_needed(speed):
        return sum(math.ceil(pile / speed) for pile in piles)

    left, right = 1, max(piles)
    while left < right:
        mid = (left + right) // 2
        if hours_needed(mid) <= h:
            right = mid
        else:
            left = mid + 1

    return left
\`\`\`

## Key Insight: The Search Space Is the Answer's Range, Not the Array's Indices

\`left\` and \`right\` bound POSSIBLE ANSWERS — here, eating speeds from 1 to the largest pile — while the array itself is only used inside the O(n) feasibility check at each candidate value.

## Common Mistakes

- Writing a feasibility check that isn't actually monotonic, which breaks binary search's core assumption
- Off-by-one errors in the answer range's bounds — check with a small example whether the true answer could equal \`left\` or \`right\` exactly
- Reaching for brute force over the whole answer range instead of recognizing the monotonic structure that makes binary search applicable`,
  },
  {
    slug: "search-in-rotated-arrays",
    name: "Search in Rotated / Modified Arrays",
    description:
      "A sorted array that's been rotated is still 'half sorted' at every split point — one half of any subrange is always properly ordered, which is enough information to decide which half to search next.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    bestFor: "Search in a rotated sorted array, find the rotation point, search sorted 2D matrices",
    sortOrder: 3,
    referenceContent: `## When to Use

- Search for a target in a sorted array that's been rotated at an unknown pivot
- Find the minimum element (the rotation point) in a rotated sorted array
- Search a 2D matrix sorted along both rows and columns

## Core Idea

At any midpoint, at least one of the two halves \`[left, mid]\` or \`[mid, right]\` is guaranteed to be normally sorted, with no rotation break inside it. Check which half is sorted, then decide whether the target could be in that sorted half — if so, recurse there; otherwise recurse into the other, rotated half.

## Template — Search in Rotated Sorted Array

\`\`\`python
def search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid

        if nums[left] <= nums[mid]:  # left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:  # right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1
\`\`\`

## Key Insight: Exactly One Half Is Always Cleanly Sorted

Because there's at most one rotation break in the whole array, splitting at any midpoint guarantees one side has no break — comparing \`nums[left]\` to \`nums[mid]\` tells you instantly which side that is.

## Common Mistakes

- Using \`<\` instead of \`<=\` when comparing \`nums[left]\` and \`nums[mid]\` — a single-element half needs the inclusive comparison to be recognized as sorted
- Forgetting duplicate values can defeat the "which half is sorted" check, requiring a linear fallback when \`nums[left] == nums[mid] == nums[right]\`
- Applying standard binary search directly without first identifying the sorted half — the target-comparison rule differs on each side`,
  },
];

const searchQuestionsBySubtopicSlug: Record<string, QuestionSeed[]> = {
  "binary-search-basics": [
    {
      slug: "binary-search",
      title: "Binary Search",
      leetcodeNumber: 704,
      url: "https://leetcode.com/problems/binary-search/",
      difficulty: "easy",
      sortOrder: 1,
    },
    {
      slug: "search-insert-position",
      title: "Search Insert Position",
      leetcodeNumber: 35,
      url: "https://leetcode.com/problems/search-insert-position/",
      difficulty: "easy",
      sortOrder: 2,
    },
    {
      slug: "find-first-and-last-position-of-element-in-sorted-array",
      title: "Find First and Last Position of Element in Sorted Array",
      leetcodeNumber: 34,
      url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
      difficulty: "medium",
      sortOrder: 3,
    },
  ],
  "binary-search-on-answer": [
    {
      slug: "koko-eating-bananas",
      title: "Koko Eating Bananas",
      leetcodeNumber: 875,
      url: "https://leetcode.com/problems/koko-eating-bananas/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "capacity-to-ship-packages-within-d-days",
      title: "Capacity To Ship Packages Within D Days",
      leetcodeNumber: 1011,
      url: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "split-array-largest-sum",
      title: "Split Array Largest Sum",
      leetcodeNumber: 410,
      url: "https://leetcode.com/problems/split-array-largest-sum/",
      difficulty: "hard",
      sortOrder: 3,
    },
  ],
  "search-in-rotated-arrays": [
    {
      slug: "search-in-rotated-sorted-array",
      title: "Search in Rotated Sorted Array",
      leetcodeNumber: 33,
      url: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "find-minimum-in-rotated-sorted-array",
      title: "Find Minimum in Rotated Sorted Array",
      leetcodeNumber: 153,
      url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "search-a-2d-matrix",
      title: "Search a 2D Matrix",
      leetcodeNumber: 74,
      url: "https://leetcode.com/problems/search-a-2d-matrix/",
      difficulty: "medium",
      sortOrder: 3,
    },
    {
      slug: "search-a-2d-matrix-ii",
      title: "Search a 2D Matrix II",
      leetcodeNumber: 240,
      url: "https://leetcode.com/problems/search-a-2d-matrix-ii/",
      difficulty: "medium",
      sortOrder: 4,
    },
  ],
};

const sortSubtopics: SubtopicSeed[] = [
  {
    slug: "merge-sort",
    name: "Merge Sort",
    description:
      "Divide the array in half, recursively sort each half, then merge two sorted halves in linear time. The merge step is also secretly a linear-time way to count inversions or cross-boundary comparisons.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    bestFor:
      "Stable sorting, counting inversions, sorting structures where random access is expensive",
    sortOrder: 1,
    referenceContent: `## When to Use

- Need a STABLE sort where equal elements keep their relative order
- Count inversions — pairs that are out of order — in an array
- Sort a structure where random access is expensive, like a linked list

## Core Idea

Split the array into two halves, sort each recursively, then merge them back together in one linear pass — since each half is already sorted, merging only needs a single forward scan comparing the fronts of each half.

## Template — Merge Sort

\`\`\`python
def merge_sort(nums):
    if len(nums) <= 1:
        return nums

    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
\`\`\`

## Template — Count Inversions During Merge

\`\`\`python
def count_inversions(nums):
    def sort_and_count(arr):
        if len(arr) <= 1:
            return arr, 0

        mid = len(arr) // 2
        left, left_inv = sort_and_count(arr[:mid])
        right, right_inv = sort_and_count(arr[mid:])

        merged = []
        i = j = split_inv = 0
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                merged.append(left[i])
                i += 1
            else:
                merged.append(right[j])
                j += 1
                split_inv += len(left) - i  # everything left of i is > right[j]

        merged.extend(left[i:])
        merged.extend(right[j:])
        return merged, left_inv + right_inv + split_inv

    _, total = sort_and_count(nums)
    return total
\`\`\`

## Key Insight: The Merge Step Already "Knows" About Inversions

When an element from the right half is taken before the left half is exhausted, EVERY remaining element in the left half forms an inversion with it — counting \`len(left) - i\` at that moment captures all of them at once, for free.

## Common Mistakes

- Using \`<\` instead of \`<=\` when merging, which breaks stability by letting equal elements swap relative order
- Forgetting to extend the result with whichever half still has leftover elements after the main merge loop
- Recomputing the inversion count from scratch instead of accumulating it during the merge, turning an O(n log n) algorithm into O(n²)`,
  },
  {
    slug: "quickselect",
    name: "Quickselect",
    description:
      "A variant of quicksort that only recurses into the ONE partition that could contain the answer, giving average O(n) time to find the kth smallest/largest element without fully sorting.",
    timeComplexity: "O(n) average, O(n²) worst case",
    spaceComplexity: "O(1) in-place",
    bestFor:
      "Kth largest/smallest element, top-k selection without full sorting, median of an array",
    sortOrder: 2,
    referenceContent: `## When to Use

- Find the kth largest or smallest element without sorting the whole array
- Find the median of an unsorted array
- Any "top-k" problem where the k elements don't need to come back in sorted order

## Core Idea

Partition the array around a pivot, exactly like quicksort. But instead of recursing into both sides, check which side the target rank falls into and recurse into ONLY that side — throwing away the other half's work entirely.

## Template — Quickselect for Kth Largest

\`\`\`python
import random

def find_kth_largest(nums, k):
    target_index = len(nums) - k  # kth largest = (n-k)th smallest, 0-indexed

    def partition(left, right, pivot_index):
        pivot = nums[pivot_index]
        nums[pivot_index], nums[right] = nums[right], nums[pivot_index]
        store_index = left
        for i in range(left, right):
            if nums[i] < pivot:
                nums[store_index], nums[i] = nums[i], nums[store_index]
                store_index += 1
        nums[right], nums[store_index] = nums[store_index], nums[right]
        return store_index

    left, right = 0, len(nums) - 1
    while left < right:
        pivot_index = random.randint(left, right)
        pivot_index = partition(left, right, pivot_index)
        if pivot_index == target_index:
            break
        elif pivot_index < target_index:
            left = pivot_index + 1
        else:
            right = pivot_index - 1

    return nums[target_index]
\`\`\`

## Key Insight: A Random Pivot Makes the Worst Case Astronomically Unlikely

Always picking a fixed pivot (like the last element) degrades to O(n²) on adversarial or already-sorted input; randomizing the pivot choice makes that worst case vanishingly unlikely in practice, giving expected O(n).

## Common Mistakes

- Forgetting to convert "kth largest" into the correct target index for an ascending partition scheme
- Using a fixed pivot choice, which is vulnerable to worst-case O(n²) input an interviewer might specifically test
- Recursing into (or checking) both partitions instead of only the one containing the target index — that's what makes quickselect O(n) instead of O(n log n)`,
  },
  {
    slug: "counting-bucket-sort",
    name: "Counting Sort & Bucket Sort",
    description:
      "When you know something extra about the data — a small, bounded range of integer values, or a roughly uniform distribution — you can sort in linear time by exploiting that structure instead of relying on comparisons.",
    timeComplexity: "O(n + k) for a value range of size k",
    spaceComplexity: "O(n + k)",
    bestFor:
      "Sorting integers in a small known range, sort-by-frequency problems, uniform-distribution bucketing",
    sortOrder: 3,
    referenceContent: `## When to Use

- The values to sort are integers within a small, known range
- You need to sort by FREQUENCY rather than by value — e.g. "sort characters by decreasing frequency"
- The input is roughly uniformly distributed and can be split into buckets that are each cheap to sort

## Core Idea

Comparison sorts have an O(n log n) floor because they can only learn about order from pairwise comparisons. Counting sort sidesteps this by using values as array indices directly — count how many times each value appears, then reconstruct the sorted output from those counts with no comparisons at all.

## Template — Counting Sort

\`\`\`python
def counting_sort(nums):
    if not nums:
        return []

    offset = min(nums)
    max_val = max(nums) - offset
    counts = [0] * (max_val + 1)

    for val in nums:
        counts[val - offset] += 1

    result = []
    for i, count in enumerate(counts):
        result.extend([i + offset] * count)
    return result
\`\`\`

## Template — Sort Characters by Frequency

\`\`\`python
from collections import Counter

def frequency_sort(s):
    counts = Counter(s)
    buckets = [[] for _ in range(len(s) + 1)]

    for ch, freq in counts.items():
        buckets[freq].append(ch)

    result = []
    for freq in range(len(buckets) - 1, 0, -1):
        for ch in buckets[freq]:
            result.append(ch * freq)
    return "".join(result)
\`\`\`

## Key Insight: Counting Sort Trades Comparisons for Space Proportional to the Value Range

It's only linear-time when the value range k is reasonably small relative to n — sorting the integers 1 to 1,000,000 with only 5 of them present would allocate a huge, mostly-empty counts array, at which point a comparison sort is actually faster.

## Common Mistakes

- Applying counting sort to a value range that's much larger than the input size, wasting time and memory
- Forgetting the \`offset\` adjustment when the input contains negative numbers, since array indices can't be negative
- Confusing counting sort (one bucket per exact value) with bucket sort (one bucket per RANGE of values, each sorted separately) — they solve different problems`,
  },
];

const sortQuestionsBySubtopicSlug: Record<string, QuestionSeed[]> = {
  "merge-sort": [
    {
      slug: "count-of-smaller-numbers-after-self",
      title: "Count of Smaller Numbers After Self",
      leetcodeNumber: 315,
      url: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/",
      difficulty: "hard",
      sortOrder: 1,
    },
    {
      slug: "reverse-pairs",
      title: "Reverse Pairs",
      leetcodeNumber: 493,
      url: "https://leetcode.com/problems/reverse-pairs/",
      difficulty: "hard",
      sortOrder: 2,
    },
  ],
  quickselect: [
    {
      slug: "sort-an-array",
      title: "Sort an Array",
      leetcodeNumber: 912,
      url: "https://leetcode.com/problems/sort-an-array/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "wiggle-sort-ii",
      title: "Wiggle Sort II",
      leetcodeNumber: 324,
      url: "https://leetcode.com/problems/wiggle-sort-ii/",
      difficulty: "medium",
      sortOrder: 2,
    },
  ],
  "counting-bucket-sort": [
    {
      slug: "sort-characters-by-frequency",
      title: "Sort Characters By Frequency",
      leetcodeNumber: 451,
      url: "https://leetcode.com/problems/sort-characters-by-frequency/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "h-index",
      title: "H-Index",
      leetcodeNumber: 274,
      url: "https://leetcode.com/problems/h-index/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "maximum-gap",
      title: "Maximum Gap",
      leetcodeNumber: 164,
      url: "https://leetcode.com/problems/maximum-gap/",
      difficulty: "hard",
      sortOrder: 3,
    },
  ],
};

const greedySubtopics: SubtopicSeed[] = [
  {
    slug: "greedy-sorting",
    name: "Greedy + Sorting",
    description:
      "Sort by a carefully chosen key first, then make one pass making the locally best choice — the sort is what turns an exponential search over orderings into a single greedy scan.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1) – O(n)",
    bestFor:
      "Activity/interval selection, minimum arrows to burst balloons, deadline-based scheduling",
    sortOrder: 1,
    referenceContent: `## When to Use

- "Select the maximum number of non-overlapping intervals"
- "Minimum number of arrows/platforms/removals" for overlapping ranges
- Any problem where sorting by start time, end time, or a ratio reveals an obvious next choice

## Core Idea

Sort by the attribute that makes the greedy choice obvious — usually END time for interval scheduling, since picking the interval that finishes earliest always leaves the most room for future choices. Then scan once, greedily keeping or discarding each item based on a simple running comparison.

## Template — Non-Overlapping Intervals (Minimum Removals)

\`\`\`python
def erase_overlap_intervals(intervals):
    intervals.sort(key=lambda pair: pair[1])
    removals = 0
    prev_end = float("-inf")

    for start, end in intervals:
        if start >= prev_end:
            prev_end = end
        else:
            removals += 1

    return removals
\`\`\`

## Template — Minimum Arrows to Burst Balloons

\`\`\`python
def find_min_arrow_shots(points):
    points.sort(key=lambda pair: pair[1])
    arrows = 0
    last_arrow = float("-inf")

    for start, end in points:
        if start > last_arrow:
            arrows += 1
            last_arrow = end

    return arrows
\`\`\`

## Key Insight: Sorting by End Time Maximizes Remaining Options

Choosing the interval that ends soonest, among all valid choices, never costs you a future option that a different choice would have kept — that's the exchange-argument proof behind why this greedy strategy is optimal.

## Common Mistakes

- Sorting by START time when END time is what the greedy-choice proof actually depends on
- Using strict \`>\` vs \`>=\` inconsistently at interval boundaries — decide up front whether touching endpoints count as overlapping
- Assuming a greedy approach works without checking the exchange-argument logic — not every "sort then scan" idea is actually optimal`,
  },
  {
    slug: "greedy-arrays",
    name: "Greedy on Arrays",
    description:
      "A single forward pass where each element updates some running quantity — how far you can still reach, how much fuel is left — and the greedy claim is that never looking backward still finds the global optimum.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    bestFor:
      "Jump Game reachability, gas station circuits, candy distribution under local constraints",
    sortOrder: 2,
    referenceContent: `## When to Use

- "Can you reach the end?" or "minimum jumps to reach the end"
- A circular route problem where a resource (gas, budget) is gained and spent along the way
- Assign values under local pairwise constraints, like each child needing more candy than a lower-rated neighbor

## Core Idea

Track a running "best so far" quantity — furthest reachable index, cumulative fuel balance — as you scan once. The greedy claim is usually provable by contradiction: if a better solution existed, it would have to pass through a state your running quantity already captured.

## Template — Jump Game (Can You Reach the End?)

\`\`\`python
def can_jump(nums):
    farthest = 0

    for i, val in enumerate(nums):
        if i > farthest:
            return False
        farthest = max(farthest, i + val)

    return True
\`\`\`

## Template — Gas Station (Find the Starting Circuit)

\`\`\`python
def can_complete_circuit(gas, cost):
    total_surplus = 0
    running_surplus = 0
    start = 0

    for i in range(len(gas)):
        diff = gas[i] - cost[i]
        total_surplus += diff
        running_surplus += diff
        if running_surplus < 0:
            start = i + 1
            running_surplus = 0

    return start if total_surplus >= 0 else -1
\`\`\`

## Key Insight: A Negative Running Surplus Disqualifies Every Start Point Up to Here

If the running surplus goes negative starting from some index, no start point between the previous reset and now could work either — each of them would hit the same shortfall, just sooner — so it's safe to jump the candidate start straight past all of them.

## Common Mistakes

- Forgetting to check the TOTAL surplus is non-negative before trusting the found start index — a negative total means no valid start exists at all
- In Jump Game, checking \`farthest\` after updating it instead of before, letting an unreachable index slip through
- Assuming the greedy running-quantity approach works without verifying the specific exchange argument for that problem`,
  },
  {
    slug: "greedy-matching",
    name: "Greedy Matching",
    description:
      "Sort two related sequences and match them with two pointers, greedily pairing the easiest-to-satisfy elements first so harder-to-satisfy elements aren't wasted on a pairing they didn't need.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    bestFor:
      "Assign cookies to children, boats carrying pairs of people, capacity-constrained matching",
    sortOrder: 3,
    referenceContent: `## When to Use

- Match two groups of items under a "must satisfy a minimum requirement" rule
- Pair people or items to minimize the number of groups, subject to a capacity or sum limit
- Any problem reducible to "sort both sides, then greedily pair with two pointers"

## Core Idea

Sort both sequences. Walk them with two pointers, always trying to satisfy the current easiest requirement with the smallest resource that still satisfies it — this reserves larger resources for harder requirements instead of wasting them early.

## Template — Assign Cookies

\`\`\`python
def find_content_children(children, cookies):
    children.sort()
    cookies.sort()
    child = cookie = 0

    while child < len(children) and cookie < len(cookies):
        if cookies[cookie] >= children[child]:
            child += 1
        cookie += 1

    return child
\`\`\`

## Template — Boats to Save People (Pair Lightest with Heaviest)

\`\`\`python
def num_rescue_boats(people, limit):
    people.sort()
    left, right = 0, len(people) - 1
    boats = 0

    while left <= right:
        if people[left] + people[right] <= limit:
            left += 1
        right -= 1
        boats += 1

    return boats
\`\`\`

## Key Insight: Pairing the Extremes Together Is Never Worse Than Any Alternative

If the lightest and heaviest person CAN share a boat, doing so is always at least as good as any other pairing — the heaviest person needs a boat regardless, so giving them the partner with the most room to spare never hurts and often helps.

## Common Mistakes

- Sorting only one of the two sequences, or sorting them in inconsistent directions
- In two-pointer matching, advancing the wrong pointer when a match fails, causing valid pairs to be skipped
- Assuming smallest-with-smallest pairing is always optimal — for capacity problems, largest-with-smallest is often the correct greedy pairing instead`,
  },
];

const greedyQuestionsBySubtopicSlug: Record<string, QuestionSeed[]> = {
  "greedy-sorting": [
    {
      slug: "non-overlapping-intervals",
      title: "Non-overlapping Intervals",
      leetcodeNumber: 435,
      url: "https://leetcode.com/problems/non-overlapping-intervals/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "minimum-number-of-arrows-to-burst-balloons",
      title: "Minimum Number of Arrows to Burst Balloons",
      leetcodeNumber: 452,
      url: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "partition-labels",
      title: "Partition Labels",
      leetcodeNumber: 763,
      url: "https://leetcode.com/problems/partition-labels/",
      difficulty: "medium",
      sortOrder: 3,
    },
  ],
  "greedy-arrays": [
    {
      slug: "jump-game",
      title: "Jump Game",
      leetcodeNumber: 55,
      url: "https://leetcode.com/problems/jump-game/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "jump-game-ii",
      title: "Jump Game II",
      leetcodeNumber: 45,
      url: "https://leetcode.com/problems/jump-game-ii/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "gas-station",
      title: "Gas Station",
      leetcodeNumber: 134,
      url: "https://leetcode.com/problems/gas-station/",
      difficulty: "medium",
      sortOrder: 3,
    },
    {
      slug: "candy",
      title: "Candy",
      leetcodeNumber: 135,
      url: "https://leetcode.com/problems/candy/",
      difficulty: "hard",
      sortOrder: 4,
    },
  ],
  "greedy-matching": [
    {
      slug: "assign-cookies",
      title: "Assign Cookies",
      leetcodeNumber: 455,
      url: "https://leetcode.com/problems/assign-cookies/",
      difficulty: "easy",
      sortOrder: 1,
    },
    {
      slug: "boats-to-save-people",
      title: "Boats to Save People",
      leetcodeNumber: 881,
      url: "https://leetcode.com/problems/boats-to-save-people/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "two-city-scheduling",
      title: "Two City Scheduling",
      leetcodeNumber: 1029,
      url: "https://leetcode.com/problems/two-city-scheduling/",
      difficulty: "medium",
      sortOrder: 3,
    },
  ],
};

const backtrackingSubtopics: SubtopicSeed[] = [
  {
    slug: "subsets-combinations",
    name: "Subsets & Combinations",
    description:
      "Build every subset, or every combination of a fixed size, by deciding one element at a time whether to include it — a decision tree where each path from root to node is a valid partial answer.",
    timeComplexity: "O(2ⁿ) subsets, O(C(n,k)) combinations",
    spaceComplexity: "O(n) recursion depth",
    bestFor:
      "All subsets of a set, combinations of size k, combination sum with or without repetition",
    sortOrder: 1,
    referenceContent: `## When to Use

- Generate all subsets of a set
- Generate all combinations of size k from a set
- Combination-sum problems, where numbers can be reused or not

## Core Idea

At each recursive call, either include the current element and recurse, or skip it and recurse — this "include or skip" branching, applied to every position, naturally generates every subset. Passing a \`start\` index (instead of a \`used\` array) both avoids duplicate combinations and skips indices already decided against.

## Template — All Subsets

\`\`\`python
def subsets(nums):
    result = []

    def backtrack(start, path):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()

    backtrack(0, [])
    return result
\`\`\`

## Template — Combination Sum (Reuse Allowed)

\`\`\`python
def combination_sum(candidates, target):
    result = []

    def backtrack(start, remaining, path):
        if remaining == 0:
            result.append(path[:])
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                continue
            path.append(candidates[i])
            backtrack(i, remaining - candidates[i], path)  # i, not i+1: reuse allowed
            path.pop()

    backtrack(0, target, [])
    return result
\`\`\`

## Key Insight: \`i\` vs \`i + 1\` in the Recursive Call Controls Reuse

Passing \`i\` as the next start index allows the same element to be picked again (combination sum with repetition); passing \`i + 1\` forbids it (plain subsets/combinations) — that single character is the entire difference between the two variants.

## Common Mistakes

- Appending \`path\` directly instead of \`path[:]\` (a copy) — the list keeps mutating after being stored, corrupting every previously saved result
- Forgetting to skip candidates larger than the remaining target, wasting time exploring branches that can't succeed
- For "no duplicate combinations" with duplicate input values, forgetting to sort first and skip adjacent duplicates at the same recursion depth`,
  },
  {
    slug: "permutations",
    name: "Permutations",
    description:
      "Every arrangement of a set, generated by trying each not-yet-used element in the next open slot. Unlike subsets, order matters, so the branching factor doesn't shrink to a `start` index.",
    timeComplexity: "O(n · n!)",
    spaceComplexity: "O(n)",
    bestFor:
      "All permutations of a set, permutations with duplicate elements, next lexicographic permutation",
    sortOrder: 2,
    referenceContent: `## When to Use

- Generate every possible ordering of a set of elements
- Generate permutations when the input contains duplicates, without duplicate outputs
- Any problem needing "try every arrangement and check a condition"

## Core Idea

At each position in the output, try every element not yet used, recurse to fill the remaining positions, then undo the choice — mark it unused again — before trying the next candidate. A \`used\` boolean array tracks what's still available.

## Template — All Permutations

\`\`\`python
def permute(nums):
    result = []
    used = [False] * len(nums)

    def backtrack(path):
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i, val in enumerate(nums):
            if used[i]:
                continue
            used[i] = True
            path.append(val)
            backtrack(path)
            path.pop()
            used[i] = False

    backtrack([])
    return result
\`\`\`

## Template — Permutations With Duplicates (No Duplicate Output)

\`\`\`python
def permute_unique(nums):
    nums.sort()
    result = []
    used = [False] * len(nums)

    def backtrack(path):
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i, val in enumerate(nums):
            if used[i]:
                continue
            if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                continue  # skip duplicate at this depth
            used[i] = True
            path.append(val)
            backtrack(path)
            path.pop()
            used[i] = False

    backtrack([])
    return result
\`\`\`

## Key Insight: Sorting Plus a \`used[i-1]\` Check Kills Duplicate Branches Early

After sorting, identical values sit next to each other; skipping a duplicate value whenever its identical predecessor is currently UNUSED prevents generating the same permutation twice, without ever building the duplicate output just to filter it out later.

## Common Mistakes

- Forgetting to reset \`used[i] = False\` after backtracking, corrupting availability for sibling branches
- For the duplicates variant, checking \`not used[i-1]\` backward, which either misses duplicates or over-prunes valid permutations
- Using an O(n) "is this used?" list scan each iteration instead of a boolean array`,
  },
  {
    slug: "constraint-satisfaction",
    name: "Constraint Satisfaction",
    description:
      "Place items one at a time onto a board, checking board-wide constraints before committing to each placement — the earlier a bad placement is caught, the more of the search tree gets pruned away entirely.",
    timeComplexity: "Exponential, heavily pruned in practice",
    spaceComplexity: "O(n) for the board/state",
    bestFor: "N-Queens, Sudoku solving, any 'place items without conflicts' puzzle",
    sortOrder: 3,
    referenceContent: `## When to Use

- Place N non-attacking queens on an N×N board
- Solve a Sudoku puzzle
- Any puzzle where placements interact through row/column/diagonal/region constraints

## Core Idea

Try placing the next item in every possible valid position, checked against all existing placements, recurse into the rest of the board, and undo the placement if no full solution follows from it. Tracking "used" columns/diagonals as sets — instead of rescanning the whole board — turns each validity check into O(1).

## Template — N-Queens (Column/Diagonal Sets)

\`\`\`python
def solve_n_queens(n):
    solutions = []
    cols, diag1, diag2 = set(), set(), set()
    board = []

    def backtrack(row):
        if row == n:
            solutions.append(board[:])
            return
        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue
            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)
            board.append(col)

            backtrack(row + 1)

            board.pop()
            cols.remove(col)
            diag1.remove(row - col)
            diag2.remove(row + col)

    backtrack(0)
    return solutions
\`\`\`

## Key Insight: Diagonals Have a Constant \`row - col\` or \`row + col\`

Every cell on the same "/" diagonal shares the same \`row + col\`; every cell on the same "\\\\" diagonal shares the same \`row - col\` — tracking these two sums as sets turns an O(n) diagonal-conflict scan into an O(1) set lookup.

## Common Mistakes

- Re-scanning the whole board for conflicts on every placement instead of maintaining O(1) lookup sets
- Forgetting to remove ALL three markers (column, both diagonals) when backtracking, leaving stale state that blocks valid future placements
- Off-by-one errors converting between 0-indexed rows/columns and the board's visual representation`,
  },
  {
    slug: "grid-backtracking",
    name: "Grid Backtracking",
    description:
      "Treat a grid as an implicit graph and explore paths through it via DFS, marking cells visited as you enter them and unmarking on the way back out so other paths can reuse them.",
    timeComplexity: "O(rows · cols · 4^L) for a path of length L",
    spaceComplexity: "O(L) recursion depth",
    bestFor: "Word search on a grid, path enumeration under constraints, maze/robot path problems",
    sortOrder: 4,
    referenceContent: `## When to Use

- Check whether a word can be traced through adjacent grid cells
- Enumerate all paths through a grid matching some pattern or constraint
- Any puzzle where a path can't reuse a cell it has already visited

## Core Idea

DFS from a candidate starting cell, matching the next required character or step at each neighbor. Mark the current cell as visited before recursing into neighbors, and un-mark it on the way back out — this "temporarily borrow" pattern lets the SAME cell be reused by a different, unrelated path later.

## Template — Word Search

\`\`\`python
def exist(board, word):
    rows, cols = len(board), len(board[0])

    def backtrack(r, c, index):
        if index == len(word):
            return True
        if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != word[index]:
            return False

        temp, board[r][c] = board[r][c], "#"
        found = (
            backtrack(r + 1, c, index + 1)
            or backtrack(r - 1, c, index + 1)
            or backtrack(r, c + 1, index + 1)
            or backtrack(r, c - 1, index + 1)
        )
        board[r][c] = temp

        return found

    return any(backtrack(r, c, 0) for r in range(rows) for c in range(cols))
\`\`\`

## Key Insight: Marking In-Place Avoids a Separate \`visited\` Grid

Temporarily overwriting the current cell with a sentinel character, then restoring it, achieves the same "don't revisit" guarantee as a separate visited-set, without the extra O(rows·cols) memory.

## Common Mistakes

- Forgetting to restore the cell's original value after backtracking, corrupting the board for sibling search branches
- Not short-circuiting with \`or\` between the four directional recursive calls, wastefully exploring all four even after one already succeeds
- Missing the bounds check before indexing into the board, causing an out-of-range error at the grid's edges`,
  },
];

const backtrackingQuestionsBySubtopicSlug: Record<string, QuestionSeed[]> = {
  "subsets-combinations": [
    {
      slug: "subsets",
      title: "Subsets",
      leetcodeNumber: 78,
      url: "https://leetcode.com/problems/subsets/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "combinations",
      title: "Combinations",
      leetcodeNumber: 77,
      url: "https://leetcode.com/problems/combinations/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "combination-sum",
      title: "Combination Sum",
      leetcodeNumber: 39,
      url: "https://leetcode.com/problems/combination-sum/",
      difficulty: "medium",
      sortOrder: 3,
    },
    {
      slug: "combination-sum-ii",
      title: "Combination Sum II",
      leetcodeNumber: 40,
      url: "https://leetcode.com/problems/combination-sum-ii/",
      difficulty: "medium",
      sortOrder: 4,
    },
  ],
  permutations: [
    {
      slug: "permutations",
      title: "Permutations",
      leetcodeNumber: 46,
      url: "https://leetcode.com/problems/permutations/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "permutations-ii",
      title: "Permutations II",
      leetcodeNumber: 47,
      url: "https://leetcode.com/problems/permutations-ii/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "next-permutation",
      title: "Next Permutation",
      leetcodeNumber: 31,
      url: "https://leetcode.com/problems/next-permutation/",
      difficulty: "medium",
      sortOrder: 3,
    },
  ],
  "constraint-satisfaction": [
    {
      slug: "n-queens",
      title: "N-Queens",
      leetcodeNumber: 51,
      url: "https://leetcode.com/problems/n-queens/",
      difficulty: "hard",
      sortOrder: 1,
    },
    {
      slug: "n-queens-ii",
      title: "N-Queens II",
      leetcodeNumber: 52,
      url: "https://leetcode.com/problems/n-queens-ii/",
      difficulty: "hard",
      sortOrder: 2,
    },
    {
      slug: "sudoku-solver",
      title: "Sudoku Solver",
      leetcodeNumber: 37,
      url: "https://leetcode.com/problems/sudoku-solver/",
      difficulty: "hard",
      sortOrder: 3,
    },
  ],
  "grid-backtracking": [
    {
      slug: "word-search",
      title: "Word Search",
      leetcodeNumber: 79,
      url: "https://leetcode.com/problems/word-search/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "path-with-maximum-gold",
      title: "Path with Maximum Gold",
      leetcodeNumber: 1219,
      url: "https://leetcode.com/problems/path-with-maximum-gold/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "word-search-ii",
      title: "Word Search II",
      leetcodeNumber: 212,
      url: "https://leetcode.com/problems/word-search-ii/",
      difficulty: "hard",
      sortOrder: 3,
    },
  ],
};

const bitManipulationSubtopics: SubtopicSeed[] = [
  {
    slug: "xor-tricks",
    name: "XOR Tricks",
    description:
      "XOR is its own inverse (a ^ a = 0, a ^ 0 = a) and both commutative and associative, which makes it perfect for canceling out paired values and isolating whatever doesn't have a pair.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    bestFor: "Single number among duplicates, missing number, swapping without a temp variable",
    sortOrder: 1,
    referenceContent: `## When to Use

- Find the one element that appears once while everything else appears in pairs
- Find a missing number from a sequence
- Any problem where "cancel out the pairs, keep what's left" applies

## Core Idea

XOR-ing a value with itself gives 0, and XOR-ing with 0 leaves a value unchanged. XOR the entire array together — and, if needed, against the full expected range — and every paired or duplicate value cancels itself out, leaving only the unpaired value.

## Template — Single Number (Everything Else Appears Twice)

\`\`\`python
def single_number(nums):
    result = 0
    for num in nums:
        result ^= num
    return result
\`\`\`

## Template — Missing Number (0 to n, One Missing)

\`\`\`python
def missing_number(nums):
    result = len(nums)
    for i, num in enumerate(nums):
        result ^= i ^ num
    return result
\`\`\`

## Key Insight: XOR-ing the Full Expected Range Against the Actual Values Isolates the Difference

By XOR-ing both the indices \`0..n\` AND the actual array values into the same accumulator, every number present in both cancels out — only the missing number survives.

## Common Mistakes

- Reaching for a hash set (O(n) space) when the problem explicitly hints at O(1) space — that's usually a signal to look for an XOR trick
- Forgetting XOR only cancels PAIRS — it doesn't directly help when three or more copies of most values exist (that needs bit-counting instead)
- Mixing up which value should seed the accumulator (0 vs. n) depending on the variant`,
  },
  {
    slug: "bit-masking-counting",
    name: "Bit Masking & Counting",
    description:
      "Treat an integer's bits as a compact set — checking, setting, and clearing membership in O(1) — and count set bits with tricks faster than checking each bit individually.",
    timeComplexity: "O(1) per bit op, O(popcount) for a full number",
    spaceComplexity: "O(1)",
    bestFor: "Counting set bits, checking powers of two, subset enumeration via bitmasks",
    sortOrder: 2,
    referenceContent: `## When to Use

- Count the number of 1 bits in an integer, or for every number up to n
- Check whether a number is a power of two
- Represent a small set as bits in an integer for fast membership, union, or intersection

## Core Idea

\`n & (n - 1)\` clears the LOWEST set bit of \`n\` — repeating this until \`n\` becomes 0 counts the set bits in exactly as many steps as there are 1s, not 32. The same trick underlies "is this a power of two," since a power of two has exactly one set bit.

## Template — Count Set Bits (Brian Kernighan's Algorithm)

\`\`\`python
def count_bits(n):
    count = 0
    while n:
        n &= n - 1  # clears the lowest set bit
        count += 1
    return count
\`\`\`

## Template — Counting Bits for Every Number 0..n

\`\`\`python
def count_bits_range(n):
    result = [0] * (n + 1)
    for i in range(1, n + 1):
        result[i] = result[i & (i - 1)] + 1
    return result
\`\`\`

## Key Insight: \`i & (i - 1)\` Is Always a Smaller, Already-Computed Number

Because \`i & (i - 1)\` strips off exactly the lowest set bit, it's always strictly less than \`i\` — so building the bit-count table left to right, each answer reuses an already-solved smaller subproblem in O(1).

## Common Mistakes

- Checking each of the 32 bits individually with a loop and shift, when \`n & (n-1)\` gets the same answer in far fewer iterations for sparse numbers
- Forgetting the power-of-two check needs \`n > 0\` too — \`n & (n-1) == 0\` is also (incorrectly) true for n = 0
- Confusing bitwise AND/OR with logical AND/OR when composing multiple mask conditions`,
  },
  {
    slug: "bitmask-dp",
    name: "Bitmask DP",
    description:
      "When a DP state needs to track 'which subset of items have been used so far,' encode that subset as the bits of an integer — turning an otherwise unrepresentable state into a single DP array index.",
    timeComplexity: "O(2ⁿ · n) to O(2ⁿ · n²)",
    spaceComplexity: "O(2ⁿ · n)",
    bestFor: "Traveling-salesman-style problems, assignment problems, 'visit every item once' DP",
    sortOrder: 3,
    referenceContent: `## When to Use

- "Visit every city/item exactly once" with an optimal-cost objective (Traveling Salesman style)
- Assign n workers to n tasks minimizing total cost
- Any DP where the state needs an unordered SUBSET of items used so far, and n is small (roughly n ≤ 20)

## Core Idea

Represent "which items have been used" as an n-bit integer mask, where bit i is 1 if item i has been used. The DP state becomes \`(mask, extra)\`, and transitions try adding each not-yet-used item by checking \`mask & (1 << i) == 0\`, then moving to \`mask | (1 << i)\`.

## Template — Minimum Cost to Visit All Nodes (TSP-Style)

\`\`\`python
def tsp(cost):
    n = len(cost)
    full = (1 << n) - 1
    memo = {}

    def solve(mask, pos):
        if mask == full:
            return cost[pos][0]  # return to start
        if (mask, pos) in memo:
            return memo[(mask, pos)]

        best = float("inf")
        for nxt in range(n):
            if mask & (1 << nxt) == 0:
                best = min(best, cost[pos][nxt] + solve(mask | (1 << nxt), nxt))

        memo[(mask, pos)] = best
        return best

    return solve(1, 0)  # start at node 0, mask has bit 0 set
\`\`\`

## Key Insight: The Mask IS the State, Not Just a Helper Variable

Two completely different orderings that happen to have used the same SET of items are treated as the same DP state — this is what collapses n! possible orderings down to 2ⁿ possible masks, making the problem tractable for small n.

## Common Mistakes

- Attempting bitmask DP for n larger than roughly 20, where 2ⁿ becomes computationally infeasible — that's a signal to look for a different approach
- Forgetting to memoize on the FULL \`(mask, pos)\` pair — memoizing on mask alone conflates different "current position" states that need different answers
- Off-by-one errors between 0-indexed bit positions and 1-indexed item numbering`,
  },
];

const bitManipulationQuestionsBySubtopicSlug: Record<string, QuestionSeed[]> = {
  "xor-tricks": [
    {
      slug: "single-number",
      title: "Single Number",
      leetcodeNumber: 136,
      url: "https://leetcode.com/problems/single-number/",
      difficulty: "easy",
      sortOrder: 1,
    },
    {
      slug: "missing-number",
      title: "Missing Number",
      leetcodeNumber: 268,
      url: "https://leetcode.com/problems/missing-number/",
      difficulty: "easy",
      sortOrder: 2,
    },
    {
      slug: "single-number-iii",
      title: "Single Number III",
      leetcodeNumber: 260,
      url: "https://leetcode.com/problems/single-number-iii/",
      difficulty: "medium",
      sortOrder: 3,
    },
  ],
  "bit-masking-counting": [
    {
      slug: "number-of-1-bits",
      title: "Number of 1 Bits",
      leetcodeNumber: 191,
      url: "https://leetcode.com/problems/number-of-1-bits/",
      difficulty: "easy",
      sortOrder: 1,
    },
    {
      slug: "counting-bits",
      title: "Counting Bits",
      leetcodeNumber: 338,
      url: "https://leetcode.com/problems/counting-bits/",
      difficulty: "easy",
      sortOrder: 2,
    },
    {
      slug: "power-of-two",
      title: "Power of Two",
      leetcodeNumber: 231,
      url: "https://leetcode.com/problems/power-of-two/",
      difficulty: "easy",
      sortOrder: 3,
    },
  ],
  "bitmask-dp": [
    {
      slug: "partition-to-k-equal-sum-subsets",
      title: "Partition to K Equal Sum Subsets",
      leetcodeNumber: 698,
      url: "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "shortest-path-visiting-all-nodes",
      title: "Shortest Path Visiting All Nodes",
      leetcodeNumber: 847,
      url: "https://leetcode.com/problems/shortest-path-visiting-all-nodes/",
      difficulty: "hard",
      sortOrder: 2,
    },
  ],
};

const intervalsSubtopics: SubtopicSeed[] = [
  {
    slug: "merge-intervals",
    name: "Merge Intervals",
    description:
      "Sort intervals by start time, then walk through once: if the next interval overlaps the one you're building, extend it; otherwise close it out and start a new one.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    bestFor: "Merging overlapping intervals, finding gaps between intervals, employee free time",
    sortOrder: 1,
    referenceContent: `## When to Use

- Merge a list of possibly-overlapping intervals into their minimal non-overlapping form
- Find gaps (free time) between a set of intervals
- Determine whether any two intervals in a list overlap at all

## Core Idea

After sorting by start time, two intervals overlap exactly when the next one's start is \`<=\` the current merged interval's end. Extend the current interval's end (the \`max\` of the two ends) when they overlap; otherwise, the current interval is finished — push it to the result and start fresh.

## Template — Merge Intervals

\`\`\`python
def merge(intervals):
    intervals.sort(key=lambda pair: pair[0])
    result = [intervals[0]]

    for start, end in intervals[1:]:
        last_start, last_end = result[-1]
        if start <= last_end:
            result[-1] = [last_start, max(last_end, end)]
        else:
            result.append([start, end])

    return result
\`\`\`

## Key Insight: Sorting Reduces "Any Pair Might Overlap" to "Only Check the Neighbor"

Without sorting, checking whether any two intervals overlap requires comparing every pair — O(n²). Sorting by start time guarantees that if an interval doesn't overlap the currently-open merged interval, NO interval after it can either, so a single linear scan suffices.

## Common Mistakes

- Forgetting \`max(last_end, end)\` when merging — a fully-contained interval (e.g. \`[1,10]\` then \`[2,3]\`) would otherwise incorrectly shrink the merged end
- Sorting by end time instead of start time — end time is the right key for Greedy interval SELECTION, not merging
- Mutating the input list's structure inconsistently between tuples and lists, causing type errors mid-scan`,
  },
  {
    slug: "insert-overlap-queries",
    name: "Insert & Overlap Queries",
    description:
      "Insert a new interval into an already-sorted, non-overlapping list while keeping everything correctly merged — split the scan into 'before,' 'overlapping,' and 'after' phases relative to the new interval.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    bestFor:
      "Inserting a new interval into a sorted list, interval list intersections, calendar booking",
    sortOrder: 2,
    referenceContent: `## When to Use

- Insert a new interval into an already-sorted, non-overlapping list of intervals
- Find the intersection of two separate lists of disjoint intervals
- Check whether a new booking conflicts with any existing one

## Core Idea

Since the existing list is already sorted and non-overlapping, one pass suffices: copy intervals that end before the new one starts unchanged, merge every interval that overlaps the new one into a single growing interval, then copy the remaining intervals unchanged.

## Template — Insert Interval

\`\`\`python
def insert(intervals, new_interval):
    result = []
    i = 0
    n = len(intervals)

    while i < n and intervals[i][1] < new_interval[0]:
        result.append(intervals[i])
        i += 1

    while i < n and intervals[i][0] <= new_interval[1]:
        new_interval = [
            min(new_interval[0], intervals[i][0]),
            max(new_interval[1], intervals[i][1]),
        ]
        i += 1
    result.append(new_interval)

    while i < n:
        result.append(intervals[i])
        i += 1

    return result
\`\`\`

## Template — Interval List Intersections

\`\`\`python
def interval_intersection(a, b):
    result = []
    i = j = 0

    while i < len(a) and j < len(b):
        low = max(a[i][0], b[j][0])
        high = min(a[i][1], b[j][1])
        if low <= high:
            result.append([low, high])
        if a[i][1] < b[j][1]:
            i += 1
        else:
            j += 1

    return result
\`\`\`

## Key Insight: Three Clear Phases Replace Any Need to Re-Sort

Because the input is already sorted, the algorithm never needs to re-sort or backtrack — "before," "overlapping," and "after" are strictly sequential phases of a single forward scan.

## Common Mistakes

- Using \`<=\` vs \`<\` inconsistently between the "before" and "overlapping" loop conditions, merging one interval too early or too late
- In interval intersection, advancing the wrong pointer — always advance whichever interval ends first, since it can't intersect anything further ahead
- Forgetting a computed intersection can be empty (\`low > high\`) and needs to be skipped, not appended`,
  },
  {
    slug: "sweep-line",
    name: "Sweep Line",
    description:
      "Convert each interval into two events — a start and an end — sort all events by position, and sweep left to right maintaining a running count of how many intervals are currently active.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    bestFor: "Maximum overlap at any point, meeting-room counting, skyline-style boundary problems",
    sortOrder: 3,
    referenceContent: `## When to Use

- "What is the maximum number of intervals overlapping at any single point in time?"
- Meeting room / resource allocation counting problems
- Skyline and other "track a changing boundary as you scan" problems

## Core Idea

Instead of comparing intervals to each other directly, decompose each into a \`(+1, start)\` and \`(-1, end)\` event. Sort all events by position — breaking ties by processing ends before starts, or vice versa, depending on whether touching counts as overlapping — then sweep through maintaining a running sum. The sum's peak is the answer.

## Template — Maximum Overlapping Intervals

\`\`\`python
def max_overlaps(intervals):
    events = []
    for start, end in intervals:
        events.append((start, 1))
        events.append((end, -1))

    events.sort(key=lambda e: (e[0], e[1]))  # process ends before starts on ties

    current = best = 0
    for _, delta in events:
        current += delta
        best = max(best, current)

    return best
\`\`\`

## Key Insight: Events Turn an "Overlap Checking" Problem Into a Simple Running Sum

Rather than reasoning about pairs of intervals, the sweep line reduces the entire question to "at each moment, how many +1s have fired without a matching -1 yet" — a single accumulator answers it.

## Common Mistakes

- Getting the tie-breaking order between simultaneous start and end events backward, which changes whether touching endpoints count as overlapping
- Forgetting to sort the events at all, instead trying to process intervals in their original order
- Reaching for this heavier machinery when a simpler merge-intervals scan would answer the actual question being asked`,
  },
];

const intervalsQuestionsBySubtopicSlug: Record<string, QuestionSeed[]> = {
  "merge-intervals": [
    {
      slug: "merge-intervals",
      title: "Merge Intervals",
      leetcodeNumber: 56,
      url: "https://leetcode.com/problems/merge-intervals/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "employee-free-time",
      title: "Employee Free Time",
      leetcodeNumber: 759,
      url: "https://leetcode.com/problems/employee-free-time/",
      difficulty: "hard",
      sortOrder: 2,
    },
  ],
  "insert-overlap-queries": [
    {
      slug: "insert-interval",
      title: "Insert Interval",
      leetcodeNumber: 57,
      url: "https://leetcode.com/problems/insert-interval/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "interval-list-intersections",
      title: "Interval List Intersections",
      leetcodeNumber: 986,
      url: "https://leetcode.com/problems/interval-list-intersections/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "my-calendar-i",
      title: "My Calendar I",
      leetcodeNumber: 729,
      url: "https://leetcode.com/problems/my-calendar-i/",
      difficulty: "medium",
      sortOrder: 3,
    },
  ],
  "sweep-line": [
    {
      slug: "meeting-rooms",
      title: "Meeting Rooms",
      leetcodeNumber: 252,
      url: "https://leetcode.com/problems/meeting-rooms/",
      difficulty: "easy",
      sortOrder: 1,
    },
    {
      slug: "car-pooling",
      title: "Car Pooling",
      leetcodeNumber: 1094,
      url: "https://leetcode.com/problems/car-pooling/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "the-skyline-problem",
      title: "The Skyline Problem",
      leetcodeNumber: 218,
      url: "https://leetcode.com/problems/the-skyline-problem/",
      difficulty: "hard",
      sortOrder: 3,
    },
  ],
};

const treesSubtopics: SubtopicSeed[] = [
  {
    slug: "dfs-traversals",
    name: "DFS Traversals",
    description:
      "Recursively visit a node's left subtree, the node itself, and its right subtree in one of three orders. The order you process the node relative to its children determines what each traversal is naturally good for.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    bestFor: "Computing properties bottom-up (height, diameter, balance), path-sum problems",
    sortOrder: 1,
    referenceContent: `## When to Use

- Compute a value that depends on both subtrees — height, diameter, whether the tree is balanced
- Find or count root-to-leaf paths matching a condition
- Any "visit every node and combine children's results" problem

## Core Idea

Recursion mirrors the tree's own structure: solve the same problem on the left subtree, solve it on the right subtree, then combine the two results (and the current node's value) into the answer for this subtree. Most tree problems are this pattern with a different combination step.

## Template — Maximum Depth (Postorder Combination)

\`\`\`python
def max_depth(root):
    if root is None:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
\`\`\`

## Template — Diameter of Binary Tree (Combine While Descending)

\`\`\`python
def diameter_of_binary_tree(root):
    best = 0

    def height(node):
        nonlocal best
        if node is None:
            return 0
        left_h = height(node.left)
        right_h = height(node.right)
        best = max(best, left_h + right_h)
        return 1 + max(left_h, right_h)

    height(root)
    return best
\`\`\`

## Key Insight: The Return Value and the "Answer" Can Be Different Things

In the diameter example, the function RETURNS height (needed by the parent call) but UPDATES a separate \`best\` variable for the actual answer — many tree problems need this split between "what the recursion needs to continue" and "what the problem actually asks for."

## Common Mistakes

- Recomputing subtree height from scratch at every node instead of combining it into a single pass — this turns O(n) into O(n²)
- Forgetting the base case for a null node, causing a crash or wrong answer at leaves
- Conflating what needs to be RETURNED for the parent's use with what needs to be RECORDED as the final answer`,
  },
  {
    slug: "level-order",
    name: "BFS / Level Order",
    description:
      "Process a tree one full depth level at a time using a queue — the natural fit whenever an answer depends on level structure, like level averages, the rightmost node per level, or zigzag ordering.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n) worst case",
    bestFor:
      "Level-order traversal, per-level aggregates, right side view, minimum depth to a leaf",
    sortOrder: 2,
    referenceContent: `## When to Use

- Traverse a tree level by level, as opposed to depth-first
- Compute per-level aggregates — average, max, or the rightmost node
- Find the MINIMUM depth to a leaf — BFS finds this faster than DFS since it stops at the first leaf found

## Core Idea

Use a queue, and process it one full level at a time by snapshotting \`len(queue)\` at the start of each level before pushing that level's children — this cleanly separates "this level's nodes" from "next level's nodes" without needing extra markers.

## Template — Level Order Traversal

\`\`\`python
from collections import deque

def level_order(root):
    if root is None:
        return []

    result = []
    queue = deque([root])

    while queue:
        level_size = len(queue)
        level = []
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)

    return result
\`\`\`

## Key Insight: Snapshotting \`len(queue)\` Separates Levels Without Sentinels

Capturing the queue's length BEFORE the inner loop starts pushing new children means the inner loop processes exactly the current level's nodes, even though the queue keeps growing during that same loop.

## Common Mistakes

- Computing \`len(queue)\` inside the inner loop instead of once before it starts, letting the level boundary drift as children get appended
- Forgetting the empty-tree base case
- Using DFS with a depth counter to "simulate" level order when the problem's true nature — level aggregates — calls for genuine BFS`,
  },
  {
    slug: "bst-operations",
    name: "BST Operations",
    description:
      "A binary search tree's ordering invariant — everything left is smaller, everything right is bigger — turns search, insertion, and range queries into O(h) operations, and makes an inorder traversal come out sorted for free.",
    timeComplexity: "O(h) per operation",
    spaceComplexity: "O(h)",
    bestFor: "BST search/insert/delete, validating a BST, kth smallest element",
    sortOrder: 3,
    referenceContent: `## When to Use

- Search, insert, or delete a value in a binary search tree
- Validate whether a binary tree satisfies the BST property
- Find the kth smallest/largest element — inorder traversal visits BST nodes in sorted order

## Core Idea

At every node, the BST invariant tells you which subtree a target value MUST be in — no need to search both sides. Validating a BST requires passing down a valid \`(low, high)\` range rather than just comparing a node to its immediate children.

## Template — Search in a BST

\`\`\`python
def search_bst(root, val):
    if root is None or root.val == val:
        return root
    return search_bst(root.left, val) if val < root.val else search_bst(root.right, val)
\`\`\`

## Template — Validate BST (Range Passed Down)

\`\`\`python
def is_valid_bst(root, low=float("-inf"), high=float("inf")):
    if root is None:
        return True
    if not (low < root.val < high):
        return False
    return is_valid_bst(root.left, low, root.val) and is_valid_bst(root.right, root.val, high)
\`\`\`

## Key Insight: Comparing Only to Immediate Children Is NOT Enough to Validate a BST

A node can be individually greater than its left child and less than its right child while still violating the BST property against an ANCESTOR further up — passing down a shrinking \`(low, high)\` range is what correctly enforces the global ordering constraint.

## Common Mistakes

- Validating a BST by only comparing each node to its direct children instead of threading a valid range down through the recursion
- Reaching for a separate sort when inorder traversal of a BST already yields sorted order
- Using \`<=\`/\`>=\` instead of strict \`<\`/\`>\` when the problem specifies no duplicate values are allowed`,
  },
  {
    slug: "lowest-common-ancestor",
    name: "Lowest Common Ancestor",
    description:
      "Find the deepest node that has both target nodes as descendants by recursing into both subtrees and combining what each side reports back — a node is the LCA exactly when its two subtrees report finding different targets.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    bestFor: "Lowest common ancestor in a binary tree or BST, distance between two nodes",
    sortOrder: 4,
    referenceContent: `## When to Use

- Find the lowest (deepest) node that is an ancestor of both of two given nodes
- Compute the distance between two nodes in a tree — LCA depth is part of the formula
- Any "shared ancestor" or "path between two nodes" question in a tree

## Core Idea

Recurse into both children asking "did you find target A or B down there?" If both children report finding something, the CURRENT node is the LCA — both targets live in different subtrees, meeting exactly here. If only one side reports a find, pass that result up unchanged.

## Template — Lowest Common Ancestor (General Binary Tree)

\`\`\`python
def lowest_common_ancestor(root, p, q):
    if root is None or root is p or root is q:
        return root

    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)

    if left and right:
        return root
    return left or right
\`\`\`

## Template — Lowest Common Ancestor (BST, Using Ordering)

\`\`\`python
def lowest_common_ancestor_bst(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root
    return None
\`\`\`

## Key Insight: "Both Sides Found Something" IS the Definition of the LCA

The recursive general-tree solution doesn't need to explicitly track depth or build ancestor paths — the moment both recursive calls return non-null, that node is provably the deepest common ancestor, by definition.

## Common Mistakes

- Using the general binary-tree LCA algorithm's O(n) approach when the BST-specific O(h) version, exploiting ordering, would be far faster
- Forgetting the base case where a node can be its own ancestor
- Assuming both target nodes are guaranteed to exist in the tree when the problem doesn't guarantee that`,
  },
  {
    slug: "tree-construction",
    name: "Tree Construction & Serialization",
    description:
      "Rebuild a tree from traversal orders, or convert a tree to and from a flat string representation — both rely on a preorder (or level-order) sequence, combined with enough structural markers, uniquely determining the tree's shape.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    bestFor:
      "Building a tree from preorder+inorder, serializing/deserializing, sorted array to balanced BST",
    sortOrder: 5,
    referenceContent: `## When to Use

- Reconstruct a binary tree from its preorder and inorder traversal sequences
- Serialize a tree to a string and deserialize it back into the same structure
- Build a height-balanced BST from a sorted array

## Core Idea

The first element of a preorder sequence is always the root. In the corresponding inorder sequence, everything to the LEFT of that root's position belongs to the left subtree, and everything to the RIGHT belongs to the right subtree — recursively splitting both sequences rebuilds the whole tree.

## Template — Build Tree from Preorder and Inorder

\`\`\`python
def build_tree(preorder, inorder):
    if not preorder:
        return None

    root_val = preorder[0]
    root = TreeNode(root_val)
    mid = inorder.index(root_val)

    root.left = build_tree(preorder[1:mid + 1], inorder[:mid])
    root.right = build_tree(preorder[mid + 1:], inorder[mid + 1:])
    return root
\`\`\`

## Template — Serialize / Deserialize (Preorder with Null Markers)

\`\`\`python
def serialize(root):
    if root is None:
        return "#"
    return f"{root.val},{serialize(root.left)},{serialize(root.right)}"

def deserialize(data):
    values = iter(data.split(","))

    def build():
        val = next(values)
        if val == "#":
            return None
        node = TreeNode(int(val))
        node.left = build()
        node.right = build()
        return node

    return build()
\`\`\`

## Key Insight: Explicit Null Markers Make Preorder Alone Enough to Rebuild a Tree

Without inorder as a second reference, a plain preorder sequence is ambiguous about shape — but recording an explicit marker for every missing child removes that ambiguity, so one traversal order is sufficient for serialization.

## Common Mistakes

- Using \`list.index()\` inside the recursive build-from-traversals template without memoizing indices first, degrading the algorithm to O(n²) on skewed trees
- Off-by-one slicing errors splitting preorder/inorder arrays at the wrong boundary
- Forgetting a delimiter that can't collide with actual node values when serializing to a string`,
  },
];

const treesQuestionsBySubtopicSlug: Record<string, QuestionSeed[]> = {
  "dfs-traversals": [
    {
      slug: "maximum-depth-of-binary-tree",
      title: "Maximum Depth of Binary Tree",
      leetcodeNumber: 104,
      url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
      difficulty: "easy",
      sortOrder: 1,
    },
    {
      slug: "balanced-binary-tree",
      title: "Balanced Binary Tree",
      leetcodeNumber: 110,
      url: "https://leetcode.com/problems/balanced-binary-tree/",
      difficulty: "easy",
      sortOrder: 2,
    },
    {
      slug: "diameter-of-binary-tree",
      title: "Diameter of Binary Tree",
      leetcodeNumber: 543,
      url: "https://leetcode.com/problems/diameter-of-binary-tree/",
      difficulty: "easy",
      sortOrder: 3,
    },
    {
      slug: "path-sum-ii",
      title: "Path Sum II",
      leetcodeNumber: 113,
      url: "https://leetcode.com/problems/path-sum-ii/",
      difficulty: "medium",
      sortOrder: 4,
    },
    {
      slug: "binary-tree-maximum-path-sum",
      title: "Binary Tree Maximum Path Sum",
      leetcodeNumber: 124,
      url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
      difficulty: "hard",
      sortOrder: 5,
    },
  ],
  "level-order": [
    {
      slug: "minimum-depth-of-binary-tree",
      title: "Minimum Depth of Binary Tree",
      leetcodeNumber: 111,
      url: "https://leetcode.com/problems/minimum-depth-of-binary-tree/",
      difficulty: "easy",
      sortOrder: 1,
    },
    {
      slug: "binary-tree-level-order-traversal",
      title: "Binary Tree Level Order Traversal",
      leetcodeNumber: 102,
      url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "binary-tree-zigzag-level-order-traversal",
      title: "Binary Tree Zigzag Level Order Traversal",
      leetcodeNumber: 103,
      url: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
      difficulty: "medium",
      sortOrder: 3,
    },
    {
      slug: "binary-tree-right-side-view",
      title: "Binary Tree Right Side View",
      leetcodeNumber: 199,
      url: "https://leetcode.com/problems/binary-tree-right-side-view/",
      difficulty: "medium",
      sortOrder: 4,
    },
  ],
  "bst-operations": [
    {
      slug: "validate-binary-search-tree",
      title: "Validate Binary Search Tree",
      leetcodeNumber: 98,
      url: "https://leetcode.com/problems/validate-binary-search-tree/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "insert-into-a-binary-search-tree",
      title: "Insert into a Binary Search Tree",
      leetcodeNumber: 701,
      url: "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "kth-smallest-element-in-a-bst",
      title: "Kth Smallest Element in a BST",
      leetcodeNumber: 230,
      url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
      difficulty: "medium",
      sortOrder: 3,
    },
    {
      slug: "delete-node-in-a-bst",
      title: "Delete Node in a BST",
      leetcodeNumber: 450,
      url: "https://leetcode.com/problems/delete-node-in-a-bst/",
      difficulty: "medium",
      sortOrder: 4,
    },
  ],
  "lowest-common-ancestor": [
    {
      slug: "lowest-common-ancestor-of-a-binary-search-tree",
      title: "Lowest Common Ancestor of a Binary Search Tree",
      leetcodeNumber: 235,
      url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "lowest-common-ancestor-of-a-binary-tree",
      title: "Lowest Common Ancestor of a Binary Tree",
      leetcodeNumber: 236,
      url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
      difficulty: "medium",
      sortOrder: 2,
    },
  ],
  "tree-construction": [
    {
      slug: "convert-sorted-array-to-binary-search-tree",
      title: "Convert Sorted Array to Binary Search Tree",
      leetcodeNumber: 108,
      url: "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/",
      difficulty: "easy",
      sortOrder: 1,
    },
    {
      slug: "construct-binary-tree-from-preorder-and-inorder-traversal",
      title: "Construct Binary Tree from Preorder and Inorder Traversal",
      leetcodeNumber: 105,
      url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "serialize-and-deserialize-binary-tree",
      title: "Serialize and Deserialize Binary Tree",
      leetcodeNumber: 297,
      url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
      difficulty: "hard",
      sortOrder: 3,
    },
  ],
};

const dynamicProgrammingSubtopics: SubtopicSeed[] = [
  {
    slug: "1d-dp",
    name: "1D DP",
    description:
      "The simplest DP shape: an array where dp[i] depends only on a small window of earlier values. Recognizing this shape is often just noticing that the answer at position i is built from the answer at a few smaller positions.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n), often reducible to O(1)",
    bestFor: "Climbing stairs, house robber, decode ways, longest increasing subsequence",
    sortOrder: 1,
    referenceContent: `## When to Use

- "In how many ways can you reach step n" — climbing stairs, decode ways
- "What's the best you can do up to position i, given a constraint about adjacent choices" — house robber
- The recurrence for position i only needs a constant number of previous positions

## Core Idea

Define \`dp[i]\` as the answer restricted to the first \`i\` elements. Write a recurrence expressing \`dp[i]\` in terms of \`dp[i-1]\`, \`dp[i-2]\`, etc. Fill the array left to right, since each cell only depends on earlier ones.

## Template — Climbing Stairs

\`\`\`python
def climb_stairs(n):
    if n <= 2:
        return n
    prev2, prev1 = 1, 2
    for _ in range(3, n + 1):
        prev2, prev1 = prev1, prev2 + prev1
    return prev1
\`\`\`

## Template — House Robber

\`\`\`python
def rob(nums):
    take, skip = 0, 0
    for num in nums:
        take, skip = skip + num, max(take, skip)
    return max(take, skip)
\`\`\`

## Key Insight: Most 1D DPs Only Need the Last Few Values, Not the Whole Array

Since \`dp[i]\` in these recurrences only depends on \`dp[i-1]\` and \`dp[i-2]\`, you can replace the full array with two or three rolling variables — the "space optimization" step that turns O(n) space into O(1).

## Common Mistakes

- Building the full \`dp\` array when only the last 1-2 values are ever needed, wasting O(n) space unnecessarily
- Getting base cases wrong for \`n = 0\` or \`n = 1\`, which are easy to miscount by one
- Writing the recurrence in the wrong direction — be explicit about what \`dp[i]\` actually means before coding it`,
  },
  {
    slug: "2d-grid-dp",
    name: "2D Grid DP",
    description:
      "When a decision depends on two independent moving indices — rows and columns of a grid, or positions in two different strings — the DP state and the recurrence both become two-dimensional.",
    timeComplexity: "O(rows · cols)",
    spaceComplexity: "O(rows · cols), often reducible to O(cols)",
    bestFor: "Unique paths, minimum path sum, edit distance",
    sortOrder: 2,
    referenceContent: `## When to Use

- Count or optimize paths through a grid (robot navigation problems)
- Transform one string into another with the minimum number of edits
- Any problem with two independent "how far have I gotten" indices

## Core Idea

Define \`dp[i][j]\` as the answer considering only the first \`i\` rows and \`j\` columns, or the first \`i\` characters of string A and \`j\` characters of string B. The recurrence usually looks "up," "left," and sometimes "up-left" to the immediately smaller subproblems.

## Template — Unique Paths

\`\`\`python
def unique_paths(rows, cols):
    dp = [[1] * cols for _ in range(rows)]
    for r in range(1, rows):
        for c in range(1, cols):
            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
    return dp[rows - 1][cols - 1]
\`\`\`

## Template — Edit Distance

\`\`\`python
def min_distance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])

    return dp[m][n]
\`\`\`

## Key Insight: The First Row and Column Are Almost Always the Base Cases

\`dp[i][0]\` and \`dp[0][j]\` represent "one sequence/dimension is empty" — in edit distance, that's "delete/insert everything," exactly \`i\` or \`j\` operations, giving a clean starting boundary for the rest of the table.

## Common Mistakes

- Off-by-one confusion between 0-indexed strings/grids and a 1-indexed DP table — a very common source of subtle bugs in this pattern
- Forgetting to initialize the first row/column boundary cases before filling the rest of the table
- Using O(rows · cols) space when the recurrence only ever looks at the immediately previous row, which could be rolled into O(cols)`,
  },
  {
    slug: "knapsack",
    name: "Knapsack",
    description:
      "Choose a subset of items to maximize value under a weight or capacity constraint. Whether each item can be picked once or unlimited times determines the direction you iterate the capacity dimension in.",
    timeComplexity: "O(n · capacity)",
    spaceComplexity: "O(capacity)",
    bestFor: "0/1 knapsack, coin change, partition equal subset sum, target sum",
    sortOrder: 3,
    referenceContent: `## When to Use

- Maximize value, or count ways, selecting items under a total weight/capacity limit
- Each item can be used at most once (0/1) vs. an unlimited number of times (unbounded, like coin change)
- "Can you partition this set into two equal-sum halves" — a disguised 0/1 knapsack

## Core Idea

Build a \`dp[capacity]\` array where \`dp[c]\` is the best achievable value (or count of ways) using exactly capacity \`c\`. For 0/1 knapsack, iterate capacity BACKWARD per item so each item is only considered once; for unbounded knapsack, iterate FORWARD so an item can be reused within the same pass.

## Template — 0/1 Knapsack (Backward Capacity Loop)

\`\`\`python
def knapsack_01(weights, values, capacity):
    dp = [0] * (capacity + 1)
    for weight, value in zip(weights, values):
        for c in range(capacity, weight - 1, -1):
            dp[c] = max(dp[c], dp[c - weight] + value)
    return dp[capacity]
\`\`\`

## Template — Coin Change (Unbounded, Forward Capacity Loop)

\`\`\`python
def coin_change(coins, amount):
    dp = [0] + [float("inf")] * amount
    for c in range(1, amount + 1):
        for coin in coins:
            if coin <= c:
                dp[c] = min(dp[c], dp[c - coin] + 1)
    return dp[amount] if dp[amount] != float("inf") else -1
\`\`\`

## Key Insight: Loop Direction Is the Entire Difference Between 0/1 and Unbounded

Iterating capacity backward means \`dp[c - weight]\` still reflects the state BEFORE this item was considered, so it's used at most once; iterating forward means \`dp[c - weight]\` may already include this same item, so it can be reused any number of times.

## Common Mistakes

- Using a forward capacity loop for 0/1 knapsack, which accidentally allows reusing the same item multiple times
- Forgetting to initialize \`dp[0]\` correctly — usually 0 value, or "1 way," depending on the exact problem
- Confusing "maximize value" knapsack templates with "count number of ways" templates — the combination step differs (\`max\` vs \`+=\`)`,
  },
  {
    slug: "lcs-family",
    name: "Longest Common Subsequence Family",
    description:
      "Compare two sequences position by position, building a table where matching characters extend a common structure diagonally and mismatches inherit the best of two smaller subproblems.",
    timeComplexity: "O(m · n)",
    spaceComplexity: "O(m · n), often reducible to O(min(m, n))",
    bestFor:
      "Longest common subsequence, longest increasing subsequence, shortest common supersequence",
    sortOrder: 4,
    referenceContent: `## When to Use

- Find the longest subsequence common to two sequences, not necessarily contiguous
- Find the longest increasing subsequence within a single sequence
- Build the shortest string that contains both inputs as subsequences

## Core Idea

Define \`dp[i][j]\` as the answer using the first \`i\` characters of string A and the first \`j\` characters of string B. When \`A[i-1] == B[j-1]\`, extend the diagonal (\`dp[i-1][j-1] + 1\`); otherwise, inherit the best of dropping a character from either string.

## Template — Longest Common Subsequence

\`\`\`python
def longest_common_subsequence(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[m][n]
\`\`\`

## Key Insight: A Match Only Ever Extends the DIAGONAL Neighbor

Unlike a mismatch (which looks left and up), a matching character always extends \`dp[i-1][j-1]\` specifically — mixing this up with \`dp[i-1][j]\` or \`dp[i][j-1]\` is the most common bug in this entire family of problems.

## Common Mistakes

- Using the mismatch recurrence (\`max\` of left/up) on a matching character instead of the diagonal-extend recurrence
- Confusing "longest common SUBSEQUENCE" (can skip around) with "longest common SUBSTRING" (must be contiguous, resets to 0 on a mismatch)
- Not reducing space to O(min(m, n)) when both sequences are large — the table only ever needs the previous row`,
  },
  {
    slug: "palindrome-dp",
    name: "DP on Subsequences & Palindromes",
    description:
      "A DP table indexed by a (start, end) range within a single string, where the answer for a range depends on the answer for a strictly smaller inner range — palindromic structure grows outward or shrinks inward.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n²)",
    bestFor: "Longest palindromic substring/subsequence, palindrome partitioning",
    sortOrder: 5,
    referenceContent: `## When to Use

- Find the longest palindromic substring or subsequence within a string
- Count how many ways a string can be partitioned into palindromic pieces
- Any "is the range [i, j] a palindrome" question repeated across many ranges

## Core Idea

A range \`[i, j]\` is a palindrome exactly when \`s[i] == s[j]\` AND the strictly smaller inner range \`[i+1, j-1]\` is also a palindrome — this recursive shrinking is naturally filled by iterating range LENGTH from smallest to largest, so every smaller range is already computed.

## Template — Longest Palindromic Substring (DP Table)

\`\`\`python
def longest_palindrome(s):
    n = len(s)
    dp = [[False] * n for _ in range(n)]
    start, max_len = 0, 1

    for i in range(n):
        dp[i][i] = True

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j] and (length == 2 or dp[i + 1][j - 1]):
                dp[i][j] = True
                if length > max_len:
                    start, max_len = i, length

    return s[start:start + max_len]
\`\`\`

## Key Insight: Iterating by Range Length Guarantees Smaller Ranges Are Already Solved

Because every range's answer depends only on a STRICTLY SMALLER range, filling the table in order of increasing length guarantees \`dp[i+1][j-1]\` is already computed by the time \`dp[i][j]\` needs it.

## Common Mistakes

- Iterating by starting index instead of by range length, which can reference a not-yet-computed inner range
- Forgetting the length-2 special case, where \`dp[i+1][j-1]\` would refer to an invalid, empty range
- Confusing "longest palindromic SUBSTRING" (contiguous) with "longest palindromic SUBSEQUENCE" (characters can be skipped)`,
  },
  {
    slug: "state-machine-dp",
    name: "State Machine DP",
    description:
      "Model a sequence of allowed states — holding a stock vs. not holding one — and legal transitions between them as a small DP table indexed by day AND state, where each day's recurrence only depends on yesterday's states.",
    timeComplexity: "O(n · states)",
    spaceComplexity: "O(states)",
    bestFor:
      "Buy/sell stock with cooldown or transaction limits, sequence problems with state-dependent moves",
    sortOrder: 6,
    referenceContent: `## When to Use

- Stock-trading problems with constraints — a cooldown period, a limited number of transactions, or a transaction fee
- Any sequence problem where being in "state A" today restricts what you can do tomorrow
- Problems phrased as "you're in one of a few named situations each day, and each situation has specific legal next moves"

## Core Idea

Define one DP variable per possible state — \`hold\` (max profit if holding a stock today), \`sold\` (max profit if just sold), \`rest\` (max profit if resting). Write one recurrence per state describing which PREVIOUS states could transition into it, then update all states together each day using yesterday's values.

## Template — Best Time to Buy and Sell Stock with Cooldown

\`\`\`python
def max_profit_with_cooldown(prices):
    hold, sold, rest = float("-inf"), 0, 0

    for price in prices:
        prev_sold = sold
        sold = hold + price
        hold = max(hold, rest - price)
        rest = max(rest, prev_sold)

    return max(sold, rest)
\`\`\`

## Key Insight: Update All States "Simultaneously" Using Saved Previous Values

Every state's new value must be computed from YESTERDAY's values for all states, not from values already updated today — saving \`prev_sold\` before overwriting \`sold\` is what prevents a same-day transition from being incorrectly chained twice.

## Common Mistakes

- Updating state variables in the wrong order, letting one state's new value leak into another state's calculation for the same day
- Forgetting the cooldown constraint specifically — transitioning straight from sold to hold the very next day — when the problem requires a rest day first
- Initializing \`hold\` to 0 instead of negative infinity, which would incorrectly allow "holding" a stock that was never actually bought`,
  },
];

const dynamicProgrammingQuestionsBySubtopicSlug: Record<string, QuestionSeed[]> = {
  "1d-dp": [
    {
      slug: "climbing-stairs",
      title: "Climbing Stairs",
      leetcodeNumber: 70,
      url: "https://leetcode.com/problems/climbing-stairs/",
      difficulty: "easy",
      sortOrder: 1,
    },
    {
      slug: "house-robber",
      title: "House Robber",
      leetcodeNumber: 198,
      url: "https://leetcode.com/problems/house-robber/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "house-robber-ii",
      title: "House Robber II",
      leetcodeNumber: 213,
      url: "https://leetcode.com/problems/house-robber-ii/",
      difficulty: "medium",
      sortOrder: 3,
    },
    {
      slug: "decode-ways",
      title: "Decode Ways",
      leetcodeNumber: 91,
      url: "https://leetcode.com/problems/decode-ways/",
      difficulty: "medium",
      sortOrder: 4,
    },
  ],
  "2d-grid-dp": [
    {
      slug: "unique-paths",
      title: "Unique Paths",
      leetcodeNumber: 62,
      url: "https://leetcode.com/problems/unique-paths/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "minimum-path-sum",
      title: "Minimum Path Sum",
      leetcodeNumber: 64,
      url: "https://leetcode.com/problems/minimum-path-sum/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "edit-distance",
      title: "Edit Distance",
      leetcodeNumber: 72,
      url: "https://leetcode.com/problems/edit-distance/",
      difficulty: "hard",
      sortOrder: 3,
    },
  ],
  knapsack: [
    {
      slug: "partition-equal-subset-sum",
      title: "Partition Equal Subset Sum",
      leetcodeNumber: 416,
      url: "https://leetcode.com/problems/partition-equal-subset-sum/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "coin-change",
      title: "Coin Change",
      leetcodeNumber: 322,
      url: "https://leetcode.com/problems/coin-change/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "coin-change-ii",
      title: "Coin Change II",
      leetcodeNumber: 518,
      url: "https://leetcode.com/problems/coin-change-ii/",
      difficulty: "medium",
      sortOrder: 3,
    },
    {
      slug: "target-sum",
      title: "Target Sum",
      leetcodeNumber: 494,
      url: "https://leetcode.com/problems/target-sum/",
      difficulty: "medium",
      sortOrder: 4,
    },
  ],
  "lcs-family": [
    {
      slug: "longest-common-subsequence",
      title: "Longest Common Subsequence",
      leetcodeNumber: 1143,
      url: "https://leetcode.com/problems/longest-common-subsequence/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "longest-increasing-subsequence",
      title: "Longest Increasing Subsequence",
      leetcodeNumber: 300,
      url: "https://leetcode.com/problems/longest-increasing-subsequence/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "shortest-common-supersequence",
      title: "Shortest Common Supersequence",
      leetcodeNumber: 1092,
      url: "https://leetcode.com/problems/shortest-common-supersequence/",
      difficulty: "hard",
      sortOrder: 3,
    },
  ],
  "palindrome-dp": [
    {
      slug: "longest-palindromic-substring",
      title: "Longest Palindromic Substring",
      leetcodeNumber: 5,
      url: "https://leetcode.com/problems/longest-palindromic-substring/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "palindromic-substrings",
      title: "Palindromic Substrings",
      leetcodeNumber: 647,
      url: "https://leetcode.com/problems/palindromic-substrings/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "palindrome-partitioning-ii",
      title: "Palindrome Partitioning II",
      leetcodeNumber: 132,
      url: "https://leetcode.com/problems/palindrome-partitioning-ii/",
      difficulty: "hard",
      sortOrder: 3,
    },
  ],
  "state-machine-dp": [
    {
      slug: "best-time-to-buy-and-sell-stock-with-cooldown",
      title: "Best Time to Buy and Sell Stock with Cooldown",
      leetcodeNumber: 309,
      url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "best-time-to-buy-and-sell-stock-with-transaction-fee",
      title: "Best Time to Buy and Sell Stock with Transaction Fee",
      leetcodeNumber: 714,
      url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "best-time-to-buy-and-sell-stock-iii",
      title: "Best Time to Buy and Sell Stock III",
      leetcodeNumber: 123,
      url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/",
      difficulty: "hard",
      sortOrder: 3,
    },
  ],
};

const triesSubtopics: SubtopicSeed[] = [
  {
    slug: "trie-basics",
    name: "Trie Basics",
    description:
      "Each node holds one child per possible next character — following a path character by character checks or builds a prefix in O(L) time, independent of how many words are stored.",
    timeComplexity: "O(L) per operation",
    spaceComplexity: "O(total characters across all words)",
    bestFor: "Implementing a trie, autocomplete/prefix search, counting words with a given prefix",
    sortOrder: 1,
    referenceContent: `## When to Use

- Implement insert/search/startsWith for a dictionary of words
- Autocomplete: find all words with a given prefix
- Any problem needing fast "does this prefix exist" queries across many words

## Core Idea

Each trie node is a small dictionary mapping a character to a child node, plus a flag marking "a word ends here." Inserting walks (or creates) one node per character; searching walks the same path and checks whether it exists — and, for exact-word search, whether the end-of-word flag is set.

## Template — Trie Implementation

\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_word = True

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_word

    def starts_with(self, prefix):
        return self._walk(prefix) is not None

    def _walk(self, s):
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node
\`\`\`

## Key Insight: Prefix Queries Are the Same Walk as Exact-Word Queries, Minus the Final Flag Check

\`search\` and \`starts_with\` share nearly identical code — the only difference is whether you additionally check \`is_word\` at the end — which is why factoring out a shared \`_walk\` helper avoids duplicating the traversal logic.

## Common Mistakes

- Forgetting the \`is_word\` flag entirely, which makes \`search("ap")\` incorrectly return true just because "apple" was inserted and shares that prefix
- Using a fixed-size array for children when the alphabet isn't guaranteed to be lowercase English letters — a dictionary is more robust
- Not distinguishing between "this prefix exists" and "this exact word exists" in the implementation`,
  },
  {
    slug: "trie-backtracking",
    name: "Trie + Backtracking",
    description:
      "Combine a trie with grid or string backtracking so the search can bail out the instant no word in the dictionary shares the current prefix — pruning entire branches a plain backtracking search would explore uselessly.",
    timeComplexity: "O(rows · cols · 4^L), heavily pruned in practice",
    spaceComplexity: "O(total characters in the dictionary)",
    bestFor: "Word Search II (multiple words at once), concatenated words, palindrome pairs",
    sortOrder: 2,
    referenceContent: `## When to Use

- Search a grid for MULTIPLE dictionary words simultaneously, instead of one at a time
- Any backtracking search where "does any remaining candidate share this prefix" can prune the search early
- Building words letter by letter while checking membership against a large dictionary

## Core Idea

Insert every dictionary word into a shared trie first. During the grid DFS, walk the trie alongside the grid path — if the current character isn't a valid child in the trie, stop immediately; if a trie node's \`is_word\` flag is set, a complete word has been found. This shares the prefix-checking cost across all dictionary words at once, rather than restarting a separate search per word.

## Template — Word Search II (Trie-Guided DFS)

\`\`\`python
def find_words(board, words):
    root = Trie()
    for word in words:
        root.insert(word)

    rows, cols = len(board), len(board[0])
    found = set()

    def dfs(r, c, node, path):
        ch = board[r][c]
        if ch not in node.children:
            return
        next_node = node.children[ch]
        path += ch
        if next_node.is_word:
            found.add(path)

        board[r][c] = "#"
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != "#":
                dfs(nr, nc, next_node, path)
        board[r][c] = ch

    for r in range(rows):
        for c in range(cols):
            dfs(r, c, root.root, "")

    return list(found)
\`\`\`

## Key Insight: The Trie Turns "Check Against N Words" Into "Check Against One Shared Structure"

Without a trie, checking a partial path against 1,000 dictionary words means up to 1,000 separate prefix comparisons at every grid cell; with a shared trie, it's a single O(1) lookup regardless of how many words are loaded.

## Common Mistakes

- Rebuilding or re-checking against the word list directly instead of walking the shared trie, losing the whole performance benefit
- Forgetting to mark cells visited (and restore them) during the grid DFS, exactly as in plain grid backtracking
- Not deduplicating found words when multiple paths could spell the same word — a \`set\` sidesteps this`,
  },
  {
    slug: "bitwise-trie",
    name: "Bitwise Trie",
    description:
      "Treat each number's binary representation as a 'word' over the alphabet {0, 1}, and insert it into a trie exactly 32 (or 64) levels deep — this turns 'find the number that maximizes XOR with mine' into a greedy walk down the trie.",
    timeComplexity: "O(32) or O(64) per operation",
    spaceComplexity: "O(32 · n) for n inserted numbers",
    bestFor: "Maximum XOR of two numbers, maximum XOR with an element from a shifting set",
    sortOrder: 3,
    referenceContent: `## When to Use

- Find the maximum XOR value obtainable from pairing numbers in an array
- Maintain a dynamic set of numbers while repeatedly querying "what's the max XOR with this new number"
- Any problem needing "greedily pick bits to maximize/minimize a XOR result"

## Core Idea

Insert every number into a trie bit by bit, from the most significant bit down to the least. To find the number that maximizes XOR with a query value, greedily walk the trie trying to go the OPPOSITE direction of the query's current bit at each level — XOR-ing opposite bits produces a 1, which is what maximizes the result.

## Template — Maximum XOR of Two Numbers in an Array

\`\`\`python
class BitTrieNode:
    def __init__(self):
        self.children = {}

def find_maximum_xor(nums, bit_length=31):
    root = BitTrieNode()

    def insert(num):
        node = root
        for i in range(bit_length, -1, -1):
            bit = (num >> i) & 1
            node = node.children.setdefault(bit, BitTrieNode())

    def query(num):
        node = root
        xor_val = 0
        for i in range(bit_length, -1, -1):
            bit = (num >> i) & 1
            toggled = 1 - bit
            if toggled in node.children:
                xor_val |= (1 << i)
                node = node.children[toggled]
            else:
                node = node.children[bit]
        return xor_val

    for num in nums:
        insert(num)

    return max(query(num) for num in nums)
\`\`\`

## Key Insight: Maximizing XOR Is a Greedy, Bit-by-Bit Decision

Since higher bits contribute exponentially more to the final value than lower bits, always preferring the OPPOSITE bit at each level (when available) is provably optimal — there's never a reason to sacrifice a higher bit to gain lower ones.

## Common Mistakes

- Not fixing a consistent bit length across every inserted number, causing shorter numbers to be compared incorrectly
- Forgetting that the OPPOSITE bit might not exist in the trie yet, requiring a fallback to the same-direction child
- Building the trie AFTER trying to query it, instead of inserting all numbers first`,
  },
];

const triesQuestionsBySubtopicSlug: Record<string, QuestionSeed[]> = {
  "trie-basics": [
    {
      slug: "implement-trie-prefix-tree",
      title: "Implement Trie (Prefix Tree)",
      leetcodeNumber: 208,
      url: "https://leetcode.com/problems/implement-trie-prefix-tree/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "design-add-and-search-words-data-structure",
      title: "Design Add and Search Words Data Structure",
      leetcodeNumber: 211,
      url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
      difficulty: "medium",
      sortOrder: 2,
    },
    {
      slug: "replace-words",
      title: "Replace Words",
      leetcodeNumber: 648,
      url: "https://leetcode.com/problems/replace-words/",
      difficulty: "medium",
      sortOrder: 3,
    },
  ],
  "trie-backtracking": [
    {
      slug: "palindrome-pairs",
      title: "Palindrome Pairs",
      leetcodeNumber: 336,
      url: "https://leetcode.com/problems/palindrome-pairs/",
      difficulty: "hard",
      sortOrder: 1,
    },
    {
      slug: "concatenated-words",
      title: "Concatenated Words",
      leetcodeNumber: 472,
      url: "https://leetcode.com/problems/concatenated-words/",
      difficulty: "hard",
      sortOrder: 2,
    },
  ],
  "bitwise-trie": [
    {
      slug: "maximum-xor-of-two-numbers-in-an-array",
      title: "Maximum XOR of Two Numbers in an Array",
      leetcodeNumber: 421,
      url: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
      difficulty: "medium",
      sortOrder: 1,
    },
    {
      slug: "maximum-xor-with-an-element-from-array",
      title: "Maximum XOR With an Element From Array",
      leetcodeNumber: 1707,
      url: "https://leetcode.com/problems/maximum-xor-with-an-element-from-array/",
      difficulty: "hard",
      sortOrder: 2,
    },
  ],
};

interface TopicContentSeed {
  topicSlug: string;
  subtopics: SubtopicSeed[];
  groupsBySubtopicSlug?: Record<string, GroupSeed[]>;
  questionsBySubtopicSlug: Record<string, QuestionSeed[]>;
}

/**
 * Mixed Practice question pools, one per topic. Every question below is
 * verified (see `pnpm db:seed`'s duplicate check) to never also appear as a
 * subtopic question — Mixed Practice must stay a disjoint set of problems,
 * not a re-shuffling of ones already seen in a subtopic.
 */
const arraysMixedPracticeQuestions: QuestionSeed[] = [
  {
    slug: "move-zeroes",
    title: "Move Zeroes",
    leetcodeNumber: 283,
    url: "https://leetcode.com/problems/move-zeroes/",
    difficulty: "easy",
    sortOrder: 1,
  },
  {
    slug: "non-decreasing-array",
    title: "Non-decreasing Array",
    leetcodeNumber: 665,
    url: "https://leetcode.com/problems/non-decreasing-array/",
    difficulty: "easy",
    sortOrder: 2,
  },
  {
    slug: "longest-consecutive-sequence",
    title: "Longest Consecutive Sequence",
    leetcodeNumber: 128,
    url: "https://leetcode.com/problems/longest-consecutive-sequence/",
    difficulty: "medium",
    sortOrder: 3,
  },
  {
    slug: "rotate-array",
    title: "Rotate Array",
    leetcodeNumber: 189,
    url: "https://leetcode.com/problems/rotate-array/",
    difficulty: "medium",
    sortOrder: 4,
  },
  {
    slug: "find-all-duplicates-in-an-array",
    title: "Find All Duplicates in an Array",
    leetcodeNumber: 442,
    url: "https://leetcode.com/problems/find-all-duplicates-in-an-array/",
    difficulty: "medium",
    sortOrder: 5,
  },
  {
    slug: "first-missing-positive",
    title: "First Missing Positive",
    leetcodeNumber: 41,
    url: "https://leetcode.com/problems/first-missing-positive/",
    difficulty: "hard",
    sortOrder: 6,
  },
  {
    slug: "merge-sorted-array",
    title: "Merge Sorted Array",
    leetcodeNumber: 88,
    url: "https://leetcode.com/problems/merge-sorted-array/",
    difficulty: "easy",
    sortOrder: 7,
  },
  {
    slug: "majority-element",
    title: "Majority Element",
    leetcodeNumber: 169,
    url: "https://leetcode.com/problems/majority-element/",
    difficulty: "easy",
    sortOrder: 8,
  },
  {
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    leetcodeNumber: 217,
    url: "https://leetcode.com/problems/contains-duplicate/",
    difficulty: "easy",
    sortOrder: 9,
  },
  {
    slug: "find-the-duplicate-number",
    title: "Find the Duplicate Number",
    leetcodeNumber: 287,
    url: "https://leetcode.com/problems/find-the-duplicate-number/",
    difficulty: "medium",
    sortOrder: 10,
  },
  {
    slug: "shortest-unsorted-continuous-subarray",
    title: "Shortest Unsorted Continuous Subarray",
    leetcodeNumber: 581,
    url: "https://leetcode.com/problems/shortest-unsorted-continuous-subarray/",
    difficulty: "medium",
    sortOrder: 11,
  },
  {
    slug: "valid-triangle-number",
    title: "Valid Triangle Number",
    leetcodeNumber: 611,
    url: "https://leetcode.com/problems/valid-triangle-number/",
    difficulty: "medium",
    sortOrder: 12,
  },
];

const linkedListsMixedPracticeQuestions: QuestionSeed[] = [
  {
    slug: "remove-duplicates-from-sorted-list",
    title: "Remove Duplicates from Sorted List",
    leetcodeNumber: 83,
    url: "https://leetcode.com/problems/remove-duplicates-from-sorted-list/",
    difficulty: "easy",
    sortOrder: 1,
  },
  {
    slug: "remove-linked-list-elements",
    title: "Remove Linked List Elements",
    leetcodeNumber: 203,
    url: "https://leetcode.com/problems/remove-linked-list-elements/",
    difficulty: "easy",
    sortOrder: 2,
  },
  {
    slug: "add-two-numbers",
    title: "Add Two Numbers",
    leetcodeNumber: 2,
    url: "https://leetcode.com/problems/add-two-numbers/",
    difficulty: "medium",
    sortOrder: 3,
  },
  {
    slug: "swap-nodes-in-pairs",
    title: "Swap Nodes in Pairs",
    leetcodeNumber: 24,
    url: "https://leetcode.com/problems/swap-nodes-in-pairs/",
    difficulty: "medium",
    sortOrder: 4,
  },
  {
    slug: "rotate-list",
    title: "Rotate List",
    leetcodeNumber: 61,
    url: "https://leetcode.com/problems/rotate-list/",
    difficulty: "medium",
    sortOrder: 5,
  },
  {
    slug: "reorder-list",
    title: "Reorder List",
    leetcodeNumber: 143,
    url: "https://leetcode.com/problems/reorder-list/",
    difficulty: "medium",
    sortOrder: 6,
  },
  {
    slug: "convert-binary-number-in-a-linked-list-to-integer",
    title: "Convert Binary Number in a Linked List to Integer",
    leetcodeNumber: 1290,
    url: "https://leetcode.com/problems/convert-binary-number-in-a-linked-list-to-integer/",
    difficulty: "easy",
    sortOrder: 7,
  },
  {
    slug: "delete-node-in-a-linked-list",
    title: "Delete Node in a Linked List",
    leetcodeNumber: 237,
    url: "https://leetcode.com/problems/delete-node-in-a-linked-list/",
    difficulty: "easy",
    sortOrder: 8,
  },
  {
    slug: "copy-list-with-random-pointer",
    title: "Copy List with Random Pointer",
    leetcodeNumber: 138,
    url: "https://leetcode.com/problems/copy-list-with-random-pointer/",
    difficulty: "medium",
    sortOrder: 9,
  },
  {
    slug: "lru-cache",
    title: "LRU Cache",
    leetcodeNumber: 146,
    url: "https://leetcode.com/problems/lru-cache/",
    difficulty: "medium",
    sortOrder: 10,
  },
  {
    slug: "insertion-sort-list",
    title: "Insertion Sort List",
    leetcodeNumber: 147,
    url: "https://leetcode.com/problems/insertion-sort-list/",
    difficulty: "medium",
    sortOrder: 11,
  },
  {
    slug: "odd-even-linked-list",
    title: "Odd Even Linked List",
    leetcodeNumber: 328,
    url: "https://leetcode.com/problems/odd-even-linked-list/",
    difficulty: "medium",
    sortOrder: 12,
  },
];

const stringsMixedPracticeQuestions: QuestionSeed[] = [
  {
    slug: "longest-common-prefix",
    title: "Longest Common Prefix",
    leetcodeNumber: 14,
    url: "https://leetcode.com/problems/longest-common-prefix/",
    difficulty: "easy",
    sortOrder: 1,
  },
  {
    slug: "add-strings",
    title: "Add Strings",
    leetcodeNumber: 415,
    url: "https://leetcode.com/problems/add-strings/",
    difficulty: "easy",
    sortOrder: 2,
  },
  {
    slug: "string-to-integer-atoi",
    title: "String to Integer (atoi)",
    leetcodeNumber: 8,
    url: "https://leetcode.com/problems/string-to-integer-atoi/",
    difficulty: "medium",
    sortOrder: 3,
  },
  {
    slug: "multiply-strings",
    title: "Multiply Strings",
    leetcodeNumber: 43,
    url: "https://leetcode.com/problems/multiply-strings/",
    difficulty: "medium",
    sortOrder: 4,
  },
  {
    slug: "compare-version-numbers",
    title: "Compare Version Numbers",
    leetcodeNumber: 165,
    url: "https://leetcode.com/problems/compare-version-numbers/",
    difficulty: "medium",
    sortOrder: 5,
  },
  {
    slug: "shortest-palindrome",
    title: "Shortest Palindrome",
    leetcodeNumber: 214,
    url: "https://leetcode.com/problems/shortest-palindrome/",
    difficulty: "hard",
    sortOrder: 6,
  },
  {
    slug: "length-of-last-word",
    title: "Length of Last Word",
    leetcodeNumber: 58,
    url: "https://leetcode.com/problems/length-of-last-word/",
    difficulty: "easy",
    sortOrder: 7,
  },
  {
    slug: "find-the-index-of-the-first-occurrence-in-a-string",
    title: "Find the Index of the First Occurrence in a String",
    leetcodeNumber: 28,
    url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/",
    difficulty: "easy",
    sortOrder: 8,
  },
  {
    slug: "repeated-substring-pattern",
    title: "Repeated Substring Pattern",
    leetcodeNumber: 459,
    url: "https://leetcode.com/problems/repeated-substring-pattern/",
    difficulty: "easy",
    sortOrder: 9,
  },
  {
    slug: "zigzag-conversion",
    title: "Zigzag Conversion",
    leetcodeNumber: 6,
    url: "https://leetcode.com/problems/zigzag-conversion/",
    difficulty: "medium",
    sortOrder: 10,
  },
  {
    slug: "count-and-say",
    title: "Count and Say",
    leetcodeNumber: 38,
    url: "https://leetcode.com/problems/count-and-say/",
    difficulty: "medium",
    sortOrder: 11,
  },
  {
    slug: "integer-to-english-words",
    title: "Integer to English Words",
    leetcodeNumber: 273,
    url: "https://leetcode.com/problems/integer-to-english-words/",
    difficulty: "hard",
    sortOrder: 12,
  },
];

const stacksQueuesMixedPracticeQuestions: QuestionSeed[] = [
  {
    slug: "implement-stack-using-queues",
    title: "Implement Stack using Queues",
    leetcodeNumber: 225,
    url: "https://leetcode.com/problems/implement-stack-using-queues/",
    difficulty: "easy",
    sortOrder: 1,
  },
  {
    slug: "baseball-game",
    title: "Baseball Game",
    leetcodeNumber: 682,
    url: "https://leetcode.com/problems/baseball-game/",
    difficulty: "easy",
    sortOrder: 2,
  },
  {
    slug: "simplify-path",
    title: "Simplify Path",
    leetcodeNumber: 71,
    url: "https://leetcode.com/problems/simplify-path/",
    difficulty: "medium",
    sortOrder: 3,
  },
  {
    slug: "remove-duplicate-letters",
    title: "Remove Duplicate Letters",
    leetcodeNumber: 316,
    url: "https://leetcode.com/problems/remove-duplicate-letters/",
    difficulty: "medium",
    sortOrder: 4,
  },
  {
    slug: "132-pattern",
    title: "132 Pattern",
    leetcodeNumber: 456,
    url: "https://leetcode.com/problems/132-pattern/",
    difficulty: "medium",
    sortOrder: 5,
  },
  {
    slug: "basic-calculator",
    title: "Basic Calculator",
    leetcodeNumber: 224,
    url: "https://leetcode.com/problems/basic-calculator/",
    difficulty: "hard",
    sortOrder: 6,
  },
  {
    slug: "build-an-array-with-stack-operations",
    title: "Build an Array With Stack Operations",
    leetcodeNumber: 1441,
    url: "https://leetcode.com/problems/build-an-array-with-stack-operations/",
    difficulty: "easy",
    sortOrder: 7,
  },
  {
    slug: "final-prices-with-a-special-discount-in-a-shop",
    title: "Final Prices With a Special Discount in a Shop",
    leetcodeNumber: 1475,
    url: "https://leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop/",
    difficulty: "easy",
    sortOrder: 8,
  },
  {
    slug: "design-circular-queue",
    title: "Design Circular Queue",
    leetcodeNumber: 622,
    url: "https://leetcode.com/problems/design-circular-queue/",
    difficulty: "medium",
    sortOrder: 9,
  },
  {
    slug: "exclusive-time-of-functions",
    title: "Exclusive Time of Functions",
    leetcodeNumber: 636,
    url: "https://leetcode.com/problems/exclusive-time-of-functions/",
    difficulty: "medium",
    sortOrder: 10,
  },
  {
    slug: "validate-stack-sequences",
    title: "Validate Stack Sequences",
    leetcodeNumber: 946,
    url: "https://leetcode.com/problems/validate-stack-sequences/",
    difficulty: "medium",
    sortOrder: 11,
  },
  {
    slug: "number-of-atoms",
    title: "Number of Atoms",
    leetcodeNumber: 726,
    url: "https://leetcode.com/problems/number-of-atoms/",
    difficulty: "hard",
    sortOrder: 12,
  },
];

const heapsPqMixedPracticeQuestions: QuestionSeed[] = [
  {
    slug: "relative-ranks",
    title: "Relative Ranks",
    leetcodeNumber: 506,
    url: "https://leetcode.com/problems/relative-ranks/",
    difficulty: "easy",
    sortOrder: 1,
  },
  {
    slug: "ugly-number-ii",
    title: "Ugly Number II",
    leetcodeNumber: 264,
    url: "https://leetcode.com/problems/ugly-number-ii/",
    difficulty: "medium",
    sortOrder: 2,
  },
  {
    slug: "top-k-frequent-words",
    title: "Top K Frequent Words",
    leetcodeNumber: 692,
    url: "https://leetcode.com/problems/top-k-frequent-words/",
    difficulty: "medium",
    sortOrder: 3,
  },
  {
    slug: "reorganize-string",
    title: "Reorganize String",
    leetcodeNumber: 767,
    url: "https://leetcode.com/problems/reorganize-string/",
    difficulty: "medium",
    sortOrder: 4,
  },
  {
    slug: "single-threaded-cpu",
    title: "Single-Threaded CPU",
    leetcodeNumber: 1834,
    url: "https://leetcode.com/problems/single-threaded-cpu/",
    difficulty: "medium",
    sortOrder: 5,
  },
  {
    slug: "rearrange-string-k-distance-apart",
    title: "Rearrange String k Distance Apart",
    leetcodeNumber: 358,
    url: "https://leetcode.com/problems/rearrange-string-k-distance-apart/",
    difficulty: "hard",
    sortOrder: 6,
  },
  {
    slug: "distant-barcodes",
    title: "Distant Barcodes",
    leetcodeNumber: 1054,
    url: "https://leetcode.com/problems/distant-barcodes/",
    difficulty: "medium",
    sortOrder: 7,
  },
  {
    slug: "least-number-of-unique-integers-after-k-removals",
    title: "Least Number of Unique Integers after K Removals",
    leetcodeNumber: 1481,
    url: "https://leetcode.com/problems/least-number-of-unique-integers-after-k-removals/",
    difficulty: "medium",
    sortOrder: 8,
  },
  {
    slug: "furthest-building-you-can-reach",
    title: "Furthest Building You Can Reach",
    leetcodeNumber: 1642,
    url: "https://leetcode.com/problems/furthest-building-you-can-reach/",
    difficulty: "medium",
    sortOrder: 9,
  },
  {
    slug: "remove-stones-to-minimize-the-total",
    title: "Remove Stones to Minimize the Total",
    leetcodeNumber: 1962,
    url: "https://leetcode.com/problems/remove-stones-to-minimize-the-total/",
    difficulty: "medium",
    sortOrder: 10,
  },
  {
    slug: "trapping-rain-water-ii",
    title: "Trapping Rain Water II",
    leetcodeNumber: 407,
    url: "https://leetcode.com/problems/trapping-rain-water-ii/",
    difficulty: "hard",
    sortOrder: 11,
  },
  {
    slug: "meeting-rooms-iii",
    title: "Meeting Rooms III",
    leetcodeNumber: 2402,
    url: "https://leetcode.com/problems/meeting-rooms-iii/",
    difficulty: "hard",
    sortOrder: 12,
  },
];

const searchMixedPracticeQuestions: QuestionSeed[] = [
  {
    slug: "first-bad-version",
    title: "First Bad Version",
    leetcodeNumber: 278,
    url: "https://leetcode.com/problems/first-bad-version/",
    difficulty: "easy",
    sortOrder: 1,
  },
  {
    slug: "guess-number-higher-or-lower",
    title: "Guess Number Higher or Lower",
    leetcodeNumber: 374,
    url: "https://leetcode.com/problems/guess-number-higher-or-lower/",
    difficulty: "easy",
    sortOrder: 2,
  },
  {
    slug: "find-peak-element",
    title: "Find Peak Element",
    leetcodeNumber: 162,
    url: "https://leetcode.com/problems/find-peak-element/",
    difficulty: "medium",
    sortOrder: 3,
  },
  {
    slug: "single-element-in-a-sorted-array",
    title: "Single Element in a Sorted Array",
    leetcodeNumber: 540,
    url: "https://leetcode.com/problems/single-element-in-a-sorted-array/",
    difficulty: "medium",
    sortOrder: 4,
  },
  {
    slug: "find-the-smallest-divisor-given-a-threshold",
    title: "Find the Smallest Divisor Given a Threshold",
    leetcodeNumber: 1283,
    url: "https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/",
    difficulty: "medium",
    sortOrder: 5,
  },
  {
    slug: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    leetcodeNumber: 4,
    url: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    difficulty: "hard",
    sortOrder: 6,
  },
  {
    slug: "element-appearing-more-than-25-in-sorted-array",
    title: "Element Appearing More Than 25% In Sorted Array",
    leetcodeNumber: 1287,
    url: "https://leetcode.com/problems/element-appearing-more-than-25-in-sorted-array/",
    difficulty: "easy",
    sortOrder: 7,
  },
  {
    slug: "special-array-with-x-elements-greater-than-or-equal-x",
    title: "Special Array With X Elements Greater Than or Equal X",
    leetcodeNumber: 1608,
    url: "https://leetcode.com/problems/special-array-with-x-elements-greater-than-or-equal-x/",
    difficulty: "easy",
    sortOrder: 8,
  },
  {
    slug: "h-index-ii",
    title: "H-Index II",
    leetcodeNumber: 275,
    url: "https://leetcode.com/problems/h-index-ii/",
    difficulty: "medium",
    sortOrder: 9,
  },
  {
    slug: "find-k-closest-elements",
    title: "Find K Closest Elements",
    leetcodeNumber: 658,
    url: "https://leetcode.com/problems/find-k-closest-elements/",
    difficulty: "medium",
    sortOrder: 10,
  },
  {
    slug: "find-a-peak-element-ii",
    title: "Find a Peak Element II",
    leetcodeNumber: 1901,
    url: "https://leetcode.com/problems/find-a-peak-element-ii/",
    difficulty: "medium",
    sortOrder: 11,
  },
  {
    slug: "find-minimum-in-rotated-sorted-array-ii",
    title: "Find Minimum in Rotated Sorted Array II",
    leetcodeNumber: 154,
    url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/",
    difficulty: "hard",
    sortOrder: 12,
  },
];

const sortMixedPracticeQuestions: QuestionSeed[] = [
  {
    slug: "height-checker",
    title: "Height Checker",
    leetcodeNumber: 1051,
    url: "https://leetcode.com/problems/height-checker/",
    difficulty: "easy",
    sortOrder: 1,
  },
  {
    slug: "relative-sort-array",
    title: "Relative Sort Array",
    leetcodeNumber: 1122,
    url: "https://leetcode.com/problems/relative-sort-array/",
    difficulty: "easy",
    sortOrder: 2,
  },
  {
    slug: "sort-array-by-increasing-frequency",
    title: "Sort Array by Increasing Frequency",
    leetcodeNumber: 1636,
    url: "https://leetcode.com/problems/sort-array-by-increasing-frequency/",
    difficulty: "easy",
    sortOrder: 3,
  },
  {
    slug: "largest-number",
    title: "Largest Number",
    leetcodeNumber: 179,
    url: "https://leetcode.com/problems/largest-number/",
    difficulty: "medium",
    sortOrder: 4,
  },
  {
    slug: "queue-reconstruction-by-height",
    title: "Queue Reconstruction by Height",
    leetcodeNumber: 406,
    url: "https://leetcode.com/problems/queue-reconstruction-by-height/",
    difficulty: "medium",
    sortOrder: 5,
  },
  {
    slug: "pancake-sorting",
    title: "Pancake Sorting",
    leetcodeNumber: 969,
    url: "https://leetcode.com/problems/pancake-sorting/",
    difficulty: "medium",
    sortOrder: 6,
  },
  {
    slug: "intersection-of-two-arrays",
    title: "Intersection of Two Arrays",
    leetcodeNumber: 349,
    url: "https://leetcode.com/problems/intersection-of-two-arrays/",
    difficulty: "easy",
    sortOrder: 7,
  },
  {
    slug: "array-partition",
    title: "Array Partition",
    leetcodeNumber: 561,
    url: "https://leetcode.com/problems/array-partition/",
    difficulty: "easy",
    sortOrder: 8,
  },
  {
    slug: "squares-of-a-sorted-array",
    title: "Squares of a Sorted Array",
    leetcodeNumber: 977,
    url: "https://leetcode.com/problems/squares-of-a-sorted-array/",
    difficulty: "easy",
    sortOrder: 9,
  },
  {
    slug: "sort-the-people",
    title: "Sort the People",
    leetcodeNumber: 2418,
    url: "https://leetcode.com/problems/sort-the-people/",
    difficulty: "easy",
    sortOrder: 10,
  },
  {
    slug: "sort-integers-by-the-power-value",
    title: "Sort Integers by The Power Value",
    leetcodeNumber: 1387,
    url: "https://leetcode.com/problems/sort-integers-by-the-power-value/",
    difficulty: "medium",
    sortOrder: 11,
  },
  {
    slug: "find-the-kth-largest-integer-in-the-array",
    title: "Find the Kth Largest Integer in the Array",
    leetcodeNumber: 1985,
    url: "https://leetcode.com/problems/find-the-kth-largest-integer-in-the-array/",
    difficulty: "medium",
    sortOrder: 12,
  },
];

const greedyMixedPracticeQuestions: QuestionSeed[] = [
  {
    slug: "can-place-flowers",
    title: "Can Place Flowers",
    leetcodeNumber: 605,
    url: "https://leetcode.com/problems/can-place-flowers/",
    difficulty: "easy",
    sortOrder: 1,
  },
  {
    slug: "lemonade-change",
    title: "Lemonade Change",
    leetcodeNumber: 860,
    url: "https://leetcode.com/problems/lemonade-change/",
    difficulty: "easy",
    sortOrder: 2,
  },
  {
    slug: "di-string-match",
    title: "DI String Match",
    leetcodeNumber: 942,
    url: "https://leetcode.com/problems/di-string-match/",
    difficulty: "easy",
    sortOrder: 3,
  },
  {
    slug: "wiggle-subsequence",
    title: "Wiggle Subsequence",
    leetcodeNumber: 376,
    url: "https://leetcode.com/problems/wiggle-subsequence/",
    difficulty: "medium",
    sortOrder: 4,
  },
  {
    slug: "remove-k-digits",
    title: "Remove K Digits",
    leetcodeNumber: 402,
    url: "https://leetcode.com/problems/remove-k-digits/",
    difficulty: "medium",
    sortOrder: 5,
  },
  {
    slug: "monotone-increasing-digits",
    title: "Monotone Increasing Digits",
    leetcodeNumber: 738,
    url: "https://leetcode.com/problems/monotone-increasing-digits/",
    difficulty: "medium",
    sortOrder: 6,
  },
  {
    slug: "is-subsequence",
    title: "Is Subsequence",
    leetcodeNumber: 392,
    url: "https://leetcode.com/problems/is-subsequence/",
    difficulty: "easy",
    sortOrder: 7,
  },
  {
    slug: "maximize-sum-of-array-after-k-negations",
    title: "Maximize Sum Of Array After K Negations",
    leetcodeNumber: 1005,
    url: "https://leetcode.com/problems/maximize-sum-of-array-after-k-negations/",
    difficulty: "easy",
    sortOrder: 8,
  },
  {
    slug: "best-time-to-buy-and-sell-stock-ii",
    title: "Best Time to Buy and Sell Stock II",
    leetcodeNumber: 122,
    url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
    difficulty: "medium",
    sortOrder: 9,
  },
  {
    slug: "dota2-senate",
    title: "Dota2 Senate",
    leetcodeNumber: 649,
    url: "https://leetcode.com/problems/dota2-senate/",
    difficulty: "medium",
    sortOrder: 10,
  },
  {
    slug: "minimum-add-to-make-parentheses-valid",
    title: "Minimum Add to Make Parentheses Valid",
    leetcodeNumber: 921,
    url: "https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/",
    difficulty: "medium",
    sortOrder: 11,
  },
  {
    slug: "patching-array",
    title: "Patching Array",
    leetcodeNumber: 330,
    url: "https://leetcode.com/problems/patching-array/",
    difficulty: "hard",
    sortOrder: 12,
  },
];

const backtrackingMixedPracticeQuestions: QuestionSeed[] = [
  {
    slug: "generate-parentheses",
    title: "Generate Parentheses",
    leetcodeNumber: 22,
    url: "https://leetcode.com/problems/generate-parentheses/",
    difficulty: "medium",
    sortOrder: 1,
  },
  {
    slug: "restore-ip-addresses",
    title: "Restore IP Addresses",
    leetcodeNumber: 93,
    url: "https://leetcode.com/problems/restore-ip-addresses/",
    difficulty: "medium",
    sortOrder: 2,
  },
  {
    slug: "palindrome-partitioning",
    title: "Palindrome Partitioning",
    leetcodeNumber: 131,
    url: "https://leetcode.com/problems/palindrome-partitioning/",
    difficulty: "medium",
    sortOrder: 3,
  },
  {
    slug: "combination-sum-iii",
    title: "Combination Sum III",
    leetcodeNumber: 216,
    url: "https://leetcode.com/problems/combination-sum-iii/",
    difficulty: "medium",
    sortOrder: 4,
  },
  {
    slug: "non-decreasing-subsequences",
    title: "Non-decreasing Subsequences",
    leetcodeNumber: 491,
    url: "https://leetcode.com/problems/non-decreasing-subsequences/",
    difficulty: "medium",
    sortOrder: 5,
  },
  {
    slug: "expression-add-operators",
    title: "Expression Add Operators",
    leetcodeNumber: 282,
    url: "https://leetcode.com/problems/expression-add-operators/",
    difficulty: "hard",
    sortOrder: 6,
  },
  {
    slug: "binary-watch",
    title: "Binary Watch",
    leetcodeNumber: 401,
    url: "https://leetcode.com/problems/binary-watch/",
    difficulty: "easy",
    sortOrder: 7,
  },
  {
    slug: "letter-combinations-of-a-phone-number",
    title: "Letter Combinations of a Phone Number",
    leetcodeNumber: 17,
    url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
    difficulty: "medium",
    sortOrder: 8,
  },
  {
    slug: "matchsticks-to-square",
    title: "Matchsticks to Square",
    leetcodeNumber: 473,
    url: "https://leetcode.com/problems/matchsticks-to-square/",
    difficulty: "medium",
    sortOrder: 9,
  },
  {
    slug: "beautiful-arrangement",
    title: "Beautiful Arrangement",
    leetcodeNumber: 526,
    url: "https://leetcode.com/problems/beautiful-arrangement/",
    difficulty: "medium",
    sortOrder: 10,
  },
  {
    slug: "letter-tile-possibilities",
    title: "Letter Tile Possibilities",
    leetcodeNumber: 1079,
    url: "https://leetcode.com/problems/letter-tile-possibilities/",
    difficulty: "medium",
    sortOrder: 11,
  },
  {
    slug: "permutation-sequence",
    title: "Permutation Sequence",
    leetcodeNumber: 60,
    url: "https://leetcode.com/problems/permutation-sequence/",
    difficulty: "hard",
    sortOrder: 12,
  },
];

const bitManipulationMixedPracticeQuestions: QuestionSeed[] = [
  {
    slug: "reverse-bits",
    title: "Reverse Bits",
    leetcodeNumber: 190,
    url: "https://leetcode.com/problems/reverse-bits/",
    difficulty: "easy",
    sortOrder: 1,
  },
  {
    slug: "find-the-difference",
    title: "Find the Difference",
    leetcodeNumber: 389,
    url: "https://leetcode.com/problems/find-the-difference/",
    difficulty: "easy",
    sortOrder: 2,
  },
  {
    slug: "hamming-distance",
    title: "Hamming Distance",
    leetcodeNumber: 461,
    url: "https://leetcode.com/problems/hamming-distance/",
    difficulty: "easy",
    sortOrder: 3,
  },
  {
    slug: "single-number-ii",
    title: "Single Number II",
    leetcodeNumber: 137,
    url: "https://leetcode.com/problems/single-number-ii/",
    difficulty: "medium",
    sortOrder: 4,
  },
  {
    slug: "bitwise-and-of-numbers-range",
    title: "Bitwise AND of Numbers Range",
    leetcodeNumber: 201,
    url: "https://leetcode.com/problems/bitwise-and-of-numbers-range/",
    difficulty: "medium",
    sortOrder: 5,
  },
  {
    slug: "sum-of-two-integers",
    title: "Sum of Two Integers",
    leetcodeNumber: 371,
    url: "https://leetcode.com/problems/sum-of-two-integers/",
    difficulty: "medium",
    sortOrder: 6,
  },
  {
    slug: "power-of-four",
    title: "Power of Four",
    leetcodeNumber: 342,
    url: "https://leetcode.com/problems/power-of-four/",
    difficulty: "easy",
    sortOrder: 7,
  },
  {
    slug: "convert-a-number-to-hexadecimal",
    title: "Convert a Number to Hexadecimal",
    leetcodeNumber: 405,
    url: "https://leetcode.com/problems/convert-a-number-to-hexadecimal/",
    difficulty: "easy",
    sortOrder: 8,
  },
  {
    slug: "decode-xored-array",
    title: "Decode XORed Array",
    leetcodeNumber: 1720,
    url: "https://leetcode.com/problems/decode-xored-array/",
    difficulty: "easy",
    sortOrder: 9,
  },
  {
    slug: "repeated-dna-sequences",
    title: "Repeated DNA Sequences",
    leetcodeNumber: 187,
    url: "https://leetcode.com/problems/repeated-dna-sequences/",
    difficulty: "medium",
    sortOrder: 10,
  },
  {
    slug: "maximum-product-of-word-lengths",
    title: "Maximum Product of Word Lengths",
    leetcodeNumber: 318,
    url: "https://leetcode.com/problems/maximum-product-of-word-lengths/",
    difficulty: "medium",
    sortOrder: 11,
  },
  {
    slug: "minimum-flips-to-make-a-or-b-equal-to-c",
    title: "Minimum Flips to Make a OR b Equal to c",
    leetcodeNumber: 1318,
    url: "https://leetcode.com/problems/minimum-flips-to-make-a-or-b-equal-to-c/",
    difficulty: "medium",
    sortOrder: 12,
  },
];

const intervalsMixedPracticeQuestions: QuestionSeed[] = [
  {
    slug: "summary-ranges",
    title: "Summary Ranges",
    leetcodeNumber: 228,
    url: "https://leetcode.com/problems/summary-ranges/",
    difficulty: "easy",
    sortOrder: 1,
  },
  {
    slug: "my-calendar-ii",
    title: "My Calendar II",
    leetcodeNumber: 731,
    url: "https://leetcode.com/problems/my-calendar-ii/",
    difficulty: "medium",
    sortOrder: 2,
  },
  {
    slug: "remove-covered-intervals",
    title: "Remove Covered Intervals",
    leetcodeNumber: 1288,
    url: "https://leetcode.com/problems/remove-covered-intervals/",
    difficulty: "medium",
    sortOrder: 3,
  },
  {
    slug: "divide-intervals-into-minimum-number-of-groups",
    title: "Divide Intervals Into Minimum Number of Groups",
    leetcodeNumber: 2406,
    url: "https://leetcode.com/problems/divide-intervals-into-minimum-number-of-groups/",
    difficulty: "medium",
    sortOrder: 4,
  },
  {
    slug: "my-calendar-iii",
    title: "My Calendar III",
    leetcodeNumber: 732,
    url: "https://leetcode.com/problems/my-calendar-iii/",
    difficulty: "hard",
    sortOrder: 5,
  },
  {
    slug: "minimum-number-of-taps-to-open-to-water-a-garden",
    title: "Minimum Number of Taps to Open to Water a Garden",
    leetcodeNumber: 1326,
    url: "https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden/",
    difficulty: "hard",
    sortOrder: 6,
  },
  {
    slug: "check-if-all-the-integers-in-a-range-are-covered",
    title: "Check if All the Integers in a Range Are Covered",
    leetcodeNumber: 1893,
    url: "https://leetcode.com/problems/check-if-all-the-integers-in-a-range-are-covered/",
    difficulty: "easy",
    sortOrder: 7,
  },
  {
    slug: "determine-if-two-events-have-conflict",
    title: "Determine if Two Events Have Conflict",
    leetcodeNumber: 2446,
    url: "https://leetcode.com/problems/determine-if-two-events-have-conflict/",
    difficulty: "easy",
    sortOrder: 8,
  },
  {
    slug: "video-stitching",
    title: "Video Stitching",
    leetcodeNumber: 1024,
    url: "https://leetcode.com/problems/video-stitching/",
    difficulty: "medium",
    sortOrder: 9,
  },
  {
    slug: "remove-interval",
    title: "Remove Interval",
    leetcodeNumber: 1272,
    url: "https://leetcode.com/problems/remove-interval/",
    difficulty: "medium",
    sortOrder: 10,
  },
  {
    slug: "maximum-profit-in-job-scheduling",
    title: "Maximum Profit in Job Scheduling",
    leetcodeNumber: 1235,
    url: "https://leetcode.com/problems/maximum-profit-in-job-scheduling/",
    difficulty: "hard",
    sortOrder: 11,
  },
  {
    slug: "data-stream-as-disjoint-intervals",
    title: "Data Stream as Disjoint Intervals",
    leetcodeNumber: 352,
    url: "https://leetcode.com/problems/data-stream-as-disjoint-intervals/",
    difficulty: "hard",
    sortOrder: 12,
  },
];

const graphsMixedPracticeQuestions: QuestionSeed[] = [
  {
    slug: "find-the-town-judge",
    title: "Find the Town Judge",
    leetcodeNumber: 997,
    url: "https://leetcode.com/problems/find-the-town-judge/",
    difficulty: "easy",
    sortOrder: 1,
  },
  {
    slug: "number-of-provinces",
    title: "Number of Provinces",
    leetcodeNumber: 547,
    url: "https://leetcode.com/problems/number-of-provinces/",
    difficulty: "medium",
    sortOrder: 2,
  },
  {
    slug: "keys-and-rooms",
    title: "Keys and Rooms",
    leetcodeNumber: 841,
    url: "https://leetcode.com/problems/keys-and-rooms/",
    difficulty: "medium",
    sortOrder: 3,
  },
  {
    slug: "find-eventual-safe-states",
    title: "Find Eventual Safe States",
    leetcodeNumber: 802,
    url: "https://leetcode.com/problems/find-eventual-safe-states/",
    difficulty: "medium",
    sortOrder: 4,
  },
  {
    slug: "shortest-path-with-alternating-colors",
    title: "Shortest Path with Alternating Colors",
    leetcodeNumber: 1129,
    url: "https://leetcode.com/problems/shortest-path-with-alternating-colors/",
    difficulty: "medium",
    sortOrder: 5,
  },
  {
    slug: "largest-color-value-in-a-directed-graph",
    title: "Largest Color Value in a Directed Graph",
    leetcodeNumber: 1857,
    url: "https://leetcode.com/problems/largest-color-value-in-a-directed-graph/",
    difficulty: "hard",
    sortOrder: 6,
  },
  {
    slug: "find-center-of-star-graph",
    title: "Find Center of Star Graph",
    leetcodeNumber: 1791,
    url: "https://leetcode.com/problems/find-center-of-star-graph/",
    difficulty: "easy",
    sortOrder: 7,
  },
  {
    slug: "minimum-genetic-mutation",
    title: "Minimum Genetic Mutation",
    leetcodeNumber: 433,
    url: "https://leetcode.com/problems/minimum-genetic-mutation/",
    difficulty: "medium",
    sortOrder: 8,
  },
  {
    slug: "flower-planting-with-no-adjacent",
    title: "Flower Planting With No Adjacent",
    leetcodeNumber: 1042,
    url: "https://leetcode.com/problems/flower-planting-with-no-adjacent/",
    difficulty: "medium",
    sortOrder: 9,
  },
  {
    slug: "reorder-routes-to-make-all-paths-lead-to-the-city-zero",
    title: "Reorder Routes to Make All Paths Lead to the City Zero",
    leetcodeNumber: 1466,
    url: "https://leetcode.com/problems/reorder-routes-to-make-all-paths-lead-to-the-city-zero/",
    difficulty: "medium",
    sortOrder: 10,
  },
  {
    slug: "find-closest-node-to-given-two-nodes",
    title: "Find Closest Node to Given Two Nodes",
    leetcodeNumber: 2359,
    url: "https://leetcode.com/problems/find-closest-node-to-given-two-nodes/",
    difficulty: "medium",
    sortOrder: 11,
  },
  {
    slug: "find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree",
    title: "Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree",
    leetcodeNumber: 1489,
    url: "https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/",
    difficulty: "hard",
    sortOrder: 12,
  },
];

const treesMixedPracticeQuestions: QuestionSeed[] = [
  {
    slug: "same-tree",
    title: "Same Tree",
    leetcodeNumber: 100,
    url: "https://leetcode.com/problems/same-tree/",
    difficulty: "easy",
    sortOrder: 1,
  },
  {
    slug: "path-sum",
    title: "Path Sum",
    leetcodeNumber: 112,
    url: "https://leetcode.com/problems/path-sum/",
    difficulty: "easy",
    sortOrder: 2,
  },
  {
    slug: "sum-root-to-leaf-numbers",
    title: "Sum Root to Leaf Numbers",
    leetcodeNumber: 129,
    url: "https://leetcode.com/problems/sum-root-to-leaf-numbers/",
    difficulty: "medium",
    sortOrder: 3,
  },
  {
    slug: "house-robber-iii",
    title: "House Robber III",
    leetcodeNumber: 337,
    url: "https://leetcode.com/problems/house-robber-iii/",
    difficulty: "medium",
    sortOrder: 4,
  },
  {
    slug: "all-nodes-distance-k-in-binary-tree",
    title: "All Nodes Distance K in Binary Tree",
    leetcodeNumber: 863,
    url: "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/",
    difficulty: "medium",
    sortOrder: 5,
  },
  {
    slug: "maximum-sum-bst-in-binary-tree",
    title: "Maximum Sum BST in Binary Tree",
    leetcodeNumber: 1373,
    url: "https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/",
    difficulty: "hard",
    sortOrder: 6,
  },
  {
    slug: "binary-tree-inorder-traversal",
    title: "Binary Tree Inorder Traversal",
    leetcodeNumber: 94,
    url: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    difficulty: "easy",
    sortOrder: 7,
  },
  {
    slug: "symmetric-tree",
    title: "Symmetric Tree",
    leetcodeNumber: 101,
    url: "https://leetcode.com/problems/symmetric-tree/",
    difficulty: "easy",
    sortOrder: 8,
  },
  {
    slug: "binary-tree-tilt",
    title: "Binary Tree Tilt",
    leetcodeNumber: 563,
    url: "https://leetcode.com/problems/binary-tree-tilt/",
    difficulty: "easy",
    sortOrder: 9,
  },
  {
    slug: "merge-two-binary-trees",
    title: "Merge Two Binary Trees",
    leetcodeNumber: 617,
    url: "https://leetcode.com/problems/merge-two-binary-trees/",
    difficulty: "easy",
    sortOrder: 10,
  },
  {
    slug: "path-sum-iii",
    title: "Path Sum III",
    leetcodeNumber: 437,
    url: "https://leetcode.com/problems/path-sum-iii/",
    difficulty: "medium",
    sortOrder: 11,
  },
  {
    slug: "find-duplicate-subtrees",
    title: "Find Duplicate Subtrees",
    leetcodeNumber: 652,
    url: "https://leetcode.com/problems/find-duplicate-subtrees/",
    difficulty: "medium",
    sortOrder: 12,
  },
];

const dynamicProgrammingMixedPracticeQuestions: QuestionSeed[] = [
  {
    slug: "n-th-tribonacci-number",
    title: "N-th Tribonacci Number",
    leetcodeNumber: 1137,
    url: "https://leetcode.com/problems/n-th-tribonacci-number/",
    difficulty: "easy",
    sortOrder: 1,
  },
  {
    slug: "triangle",
    title: "Triangle",
    leetcodeNumber: 120,
    url: "https://leetcode.com/problems/triangle/",
    difficulty: "medium",
    sortOrder: 2,
  },
  {
    slug: "word-break",
    title: "Word Break",
    leetcodeNumber: 139,
    url: "https://leetcode.com/problems/word-break/",
    difficulty: "medium",
    sortOrder: 3,
  },
  {
    slug: "integer-break",
    title: "Integer Break",
    leetcodeNumber: 343,
    url: "https://leetcode.com/problems/integer-break/",
    difficulty: "medium",
    sortOrder: 4,
  },
  {
    slug: "longest-palindromic-subsequence",
    title: "Longest Palindromic Subsequence",
    leetcodeNumber: 516,
    url: "https://leetcode.com/problems/longest-palindromic-subsequence/",
    difficulty: "medium",
    sortOrder: 5,
  },
  {
    slug: "word-break-ii",
    title: "Word Break II",
    leetcodeNumber: 140,
    url: "https://leetcode.com/problems/word-break-ii/",
    difficulty: "hard",
    sortOrder: 6,
  },
  {
    slug: "divisor-game",
    title: "Divisor Game",
    leetcodeNumber: 1025,
    url: "https://leetcode.com/problems/divisor-game/",
    difficulty: "easy",
    sortOrder: 7,
  },
  {
    slug: "perfect-squares",
    title: "Perfect Squares",
    leetcodeNumber: 279,
    url: "https://leetcode.com/problems/perfect-squares/",
    difficulty: "medium",
    sortOrder: 8,
  },
  {
    slug: "super-ugly-number",
    title: "Super Ugly Number",
    leetcodeNumber: 313,
    url: "https://leetcode.com/problems/super-ugly-number/",
    difficulty: "medium",
    sortOrder: 9,
  },
  {
    slug: "largest-divisible-subset",
    title: "Largest Divisible Subset",
    leetcodeNumber: 368,
    url: "https://leetcode.com/problems/largest-divisible-subset/",
    difficulty: "medium",
    sortOrder: 10,
  },
  {
    slug: "maximum-length-of-pair-chain",
    title: "Maximum Length of Pair Chain",
    leetcodeNumber: 646,
    url: "https://leetcode.com/problems/maximum-length-of-pair-chain/",
    difficulty: "medium",
    sortOrder: 11,
  },
  {
    slug: "distinct-subsequences",
    title: "Distinct Subsequences",
    leetcodeNumber: 115,
    url: "https://leetcode.com/problems/distinct-subsequences/",
    difficulty: "hard",
    sortOrder: 12,
  },
];

const triesMixedPracticeQuestions: QuestionSeed[] = [
  {
    slug: "implement-magic-dictionary",
    title: "Implement Magic Dictionary",
    leetcodeNumber: 676,
    url: "https://leetcode.com/problems/implement-magic-dictionary/",
    difficulty: "medium",
    sortOrder: 1,
  },
  {
    slug: "map-sum-pairs",
    title: "Map Sum Pairs",
    leetcodeNumber: 677,
    url: "https://leetcode.com/problems/map-sum-pairs/",
    difficulty: "medium",
    sortOrder: 2,
  },
  {
    slug: "longest-word-in-dictionary",
    title: "Longest Word in Dictionary",
    leetcodeNumber: 720,
    url: "https://leetcode.com/problems/longest-word-in-dictionary/",
    difficulty: "medium",
    sortOrder: 3,
  },
  {
    slug: "camelcase-matching",
    title: "Camelcase Matching",
    leetcodeNumber: 1023,
    url: "https://leetcode.com/problems/camelcase-matching/",
    difficulty: "medium",
    sortOrder: 4,
  },
  {
    slug: "search-suggestions-system",
    title: "Search Suggestions System",
    leetcodeNumber: 1268,
    url: "https://leetcode.com/problems/search-suggestions-system/",
    difficulty: "medium",
    sortOrder: 5,
  },
  {
    slug: "prefix-and-suffix-search",
    title: "Prefix and Suffix Search",
    leetcodeNumber: 745,
    url: "https://leetcode.com/problems/prefix-and-suffix-search/",
    difficulty: "hard",
    sortOrder: 6,
  },
  {
    slug: "implement-trie-ii-prefix-tree",
    title: "Implement Trie II (Prefix Tree)",
    leetcodeNumber: 1804,
    url: "https://leetcode.com/problems/implement-trie-ii-prefix-tree/",
    difficulty: "medium",
    sortOrder: 7,
  },
  {
    slug: "remove-sub-folders-from-the-filesystem",
    title: "Remove Sub-Folders from the Filesystem",
    leetcodeNumber: 1233,
    url: "https://leetcode.com/problems/remove-sub-folders-from-the-filesystem/",
    difficulty: "medium",
    sortOrder: 8,
  },
  {
    slug: "longest-word-with-all-prefixes",
    title: "Longest Word With All Prefixes",
    leetcodeNumber: 1858,
    url: "https://leetcode.com/problems/longest-word-with-all-prefixes/",
    difficulty: "medium",
    sortOrder: 9,
  },
  {
    slug: "extra-characters-in-a-string",
    title: "Extra Characters in a String",
    leetcodeNumber: 2707,
    url: "https://leetcode.com/problems/extra-characters-in-a-string/",
    difficulty: "medium",
    sortOrder: 10,
  },
  {
    slug: "number-of-valid-words-for-each-puzzle",
    title: "Number of Valid Words for Each Puzzle",
    leetcodeNumber: 1178,
    url: "https://leetcode.com/problems/number-of-valid-words-for-each-puzzle/",
    difficulty: "hard",
    sortOrder: 11,
  },
  {
    slug: "sum-of-prefix-scores-of-strings",
    title: "Sum of Prefix Scores of Strings",
    leetcodeNumber: 2416,
    url: "https://leetcode.com/problems/sum-of-prefix-scores-of-strings/",
    difficulty: "hard",
    sortOrder: 12,
  },
];

const topicContent: TopicContentSeed[] = [
  {
    topicSlug: "graphs",
    subtopics: [...graphsSubtopics, mixedPracticeSubtopicSeed(graphsSubtopics.length + 1)],
    groupsBySubtopicSlug: { bfs: bfsGroups },
    questionsBySubtopicSlug: {
      ...graphsQuestionsBySubtopicSlug,
      "mixed-practice": graphsMixedPracticeQuestions,
    },
  },
  {
    topicSlug: "arrays",
    subtopics: [...arraysSubtopics, mixedPracticeSubtopicSeed(arraysSubtopics.length + 1)],
    groupsBySubtopicSlug: arraysGroupsBySubtopicSlug,
    questionsBySubtopicSlug: {
      ...arraysQuestionsBySubtopicSlug,
      "mixed-practice": arraysMixedPracticeQuestions,
    },
  },
  {
    topicSlug: "linked-lists",
    subtopics: [
      ...linkedListsSubtopics,
      mixedPracticeSubtopicSeed(linkedListsSubtopics.length + 1),
    ],
    questionsBySubtopicSlug: {
      ...linkedListsQuestionsBySubtopicSlug,
      "mixed-practice": linkedListsMixedPracticeQuestions,
    },
  },
  {
    topicSlug: "strings",
    subtopics: [...stringsSubtopics, mixedPracticeSubtopicSeed(stringsSubtopics.length + 1)],
    questionsBySubtopicSlug: {
      ...stringsQuestionsBySubtopicSlug,
      "mixed-practice": stringsMixedPracticeQuestions,
    },
  },
  {
    topicSlug: "stacks-queues",
    subtopics: [
      ...stacksQueuesSubtopics,
      mixedPracticeSubtopicSeed(stacksQueuesSubtopics.length + 1),
    ],
    questionsBySubtopicSlug: {
      ...stacksQueuesQuestionsBySubtopicSlug,
      "mixed-practice": stacksQueuesMixedPracticeQuestions,
    },
  },
  {
    topicSlug: "heaps-pq",
    subtopics: [...heapsPqSubtopics, mixedPracticeSubtopicSeed(heapsPqSubtopics.length + 1)],
    questionsBySubtopicSlug: {
      ...heapsPqQuestionsBySubtopicSlug,
      "mixed-practice": heapsPqMixedPracticeQuestions,
    },
  },
  {
    topicSlug: "search",
    subtopics: [...searchSubtopics, mixedPracticeSubtopicSeed(searchSubtopics.length + 1)],
    questionsBySubtopicSlug: {
      ...searchQuestionsBySubtopicSlug,
      "mixed-practice": searchMixedPracticeQuestions,
    },
  },
  {
    topicSlug: "sort",
    subtopics: [...sortSubtopics, mixedPracticeSubtopicSeed(sortSubtopics.length + 1)],
    questionsBySubtopicSlug: {
      ...sortQuestionsBySubtopicSlug,
      "mixed-practice": sortMixedPracticeQuestions,
    },
  },
  {
    topicSlug: "greedy",
    subtopics: [...greedySubtopics, mixedPracticeSubtopicSeed(greedySubtopics.length + 1)],
    questionsBySubtopicSlug: {
      ...greedyQuestionsBySubtopicSlug,
      "mixed-practice": greedyMixedPracticeQuestions,
    },
  },
  {
    topicSlug: "backtracking",
    subtopics: [
      ...backtrackingSubtopics,
      mixedPracticeSubtopicSeed(backtrackingSubtopics.length + 1),
    ],
    questionsBySubtopicSlug: {
      ...backtrackingQuestionsBySubtopicSlug,
      "mixed-practice": backtrackingMixedPracticeQuestions,
    },
  },
  {
    topicSlug: "bit-manipulation",
    subtopics: [
      ...bitManipulationSubtopics,
      mixedPracticeSubtopicSeed(bitManipulationSubtopics.length + 1),
    ],
    questionsBySubtopicSlug: {
      ...bitManipulationQuestionsBySubtopicSlug,
      "mixed-practice": bitManipulationMixedPracticeQuestions,
    },
  },
  {
    topicSlug: "intervals",
    subtopics: [...intervalsSubtopics, mixedPracticeSubtopicSeed(intervalsSubtopics.length + 1)],
    questionsBySubtopicSlug: {
      ...intervalsQuestionsBySubtopicSlug,
      "mixed-practice": intervalsMixedPracticeQuestions,
    },
  },
  {
    topicSlug: "trees",
    subtopics: [...treesSubtopics, mixedPracticeSubtopicSeed(treesSubtopics.length + 1)],
    questionsBySubtopicSlug: {
      ...treesQuestionsBySubtopicSlug,
      "mixed-practice": treesMixedPracticeQuestions,
    },
  },
  {
    topicSlug: "dynamic-programming",
    subtopics: [
      ...dynamicProgrammingSubtopics,
      mixedPracticeSubtopicSeed(dynamicProgrammingSubtopics.length + 1),
    ],
    questionsBySubtopicSlug: {
      ...dynamicProgrammingQuestionsBySubtopicSlug,
      "mixed-practice": dynamicProgrammingMixedPracticeQuestions,
    },
  },
  {
    topicSlug: "tries",
    subtopics: [...triesSubtopics, mixedPracticeSubtopicSeed(triesSubtopics.length + 1)],
    questionsBySubtopicSlug: {
      ...triesQuestionsBySubtopicSlug,
      "mixed-practice": triesMixedPracticeQuestions,
    },
  },
];

async function seedTopics() {
  await db.insert(schema.topic).values(topics).onConflictDoNothing({ target: schema.topic.slug });

  const rows = await db.query.topic.findMany({
    where: { slug: { in: topics.map((t) => t.slug) } },
  });
  return new Map(rows.map((row) => [row.slug, row.id]));
}

async function seedSubtopicsForTopic(topicId: string, subtopics: SubtopicSeed[]) {
  await db
    .insert(schema.subtopic)
    .values(subtopics.map((s) => ({ ...s, topicId })))
    .onConflictDoNothing({ target: [schema.subtopic.topicId, schema.subtopic.slug] });

  const rows = await db.query.subtopic.findMany({
    where: { topicId, slug: { in: subtopics.map((s) => s.slug) } },
  });
  return new Map(rows.map((row) => [row.slug, row.id]));
}

async function seedGroupsForSubtopic(subtopicId: string, groups: GroupSeed[]) {
  await db
    .insert(schema.questionGroup)
    .values(groups.map((g) => ({ ...g, subtopicId })))
    .onConflictDoNothing({ target: [schema.questionGroup.subtopicId, schema.questionGroup.name] });

  const rows = await db.query.questionGroup.findMany({
    where: { subtopicId, name: { in: groups.map((g) => g.name) } },
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

async function seedTopicContent(topicId: string, content: TopicContentSeed) {
  const subtopicIdBySlug = await seedSubtopicsForTopic(topicId, content.subtopics);

  let questionCount = 0;
  for (const [slug, questions] of Object.entries(content.questionsBySubtopicSlug)) {
    const subtopicId = subtopicIdBySlug.get(slug);
    if (!subtopicId) throw new Error(`Subtopic "${slug}" was not seeded`);

    const groups = content.groupsBySubtopicSlug?.[slug];
    const groupIdByName = groups ? await seedGroupsForSubtopic(subtopicId, groups) : undefined;

    await seedQuestionsForSubtopic(subtopicId, questions, groupIdByName);
    questionCount += questions.length;
  }

  return { subtopicCount: content.subtopics.length, questionCount };
}

async function main() {
  console.log("Seeding topics...");
  const topicIdBySlug = await seedTopics();

  for (const content of topicContent) {
    const topicId = topicIdBySlug.get(content.topicSlug);
    if (!topicId) throw new Error(`Topic "${content.topicSlug}" was not seeded`);

    console.log(`Seeding ${content.topicSlug} content...`);
    const { subtopicCount, questionCount } = await seedTopicContent(topicId, content);
    console.log(`  ${content.topicSlug}: ${subtopicCount} subtopics, ${questionCount} questions.`);
  }

  console.log(`Done: ${topics.length} topics seeded.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => void client.end());
