import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";

export const Route = createFileRoute("/_auth/app/pattern-cheatsheet")({
  component: PatternCheatsheetPage,
});

interface PatternRow {
  signal: string;
  pattern: string;
}

interface PatternGroup {
  category: string;
  rows: PatternRow[];
}

const PATTERN_GROUPS: PatternGroup[] = [
  {
    category: "Arrays & Strings",
    rows: [
      { signal: "sorted array, find pair summing to X", pattern: "Two Pointers" },
      { signal: "longest substring without repeating", pattern: "Sliding Window (variable)" },
      { signal: "maximum sum subarray of size k", pattern: "Sliding Window (fixed)" },
      { signal: "subarray sum equals k", pattern: "Prefix Sum + HashMap" },
      { signal: "maximum subarray sum", pattern: "Kadane's" },
      { signal: "two sum, find complement", pattern: "HashMap" },
    ],
  },
  {
    category: "Graphs",
    rows: [
      { signal: "number of islands, connected components", pattern: "DFS / BFS flood fill" },
      { signal: "shortest path, minimum steps", pattern: "BFS (unweighted)" },
      { signal: "course schedule, build order", pattern: "Topological Sort (Kahn's)" },
      { signal: "union find, redundant edge", pattern: "Union-Find" },
      { signal: "shortest path with weights", pattern: "Dijkstra" },
    ],
  },
  {
    category: "Dynamic Programming",
    rows: [
      { signal: "how many ways, count paths", pattern: "DP (1D or 2D)" },
      { signal: "longest common subsequence", pattern: "2D DP" },
      { signal: "0/1 knapsack, partition equal subset", pattern: "DP (knapsack)" },
      { signal: "unbounded knapsack, coin change", pattern: "DP (unbounded)" },
      { signal: "palindromic subsequence / substring", pattern: "DP or Expand Around Centre" },
    ],
  },
  {
    category: "Other Patterns",
    rows: [
      { signal: "top k, k closest, k largest", pattern: "Heap" },
      { signal: "word search, prefix autocomplete", pattern: "Trie" },
      { signal: "generate all subsets / permutations", pattern: "Backtracking" },
      { signal: "merge intervals, insert interval", pattern: "Sort by start + Greedy" },
      { signal: "XOR, find the missing number", pattern: "Bit Manipulation" },
      { signal: "N-Queens, Sudoku solver", pattern: "Backtracking + constraints" },
    ],
  },
];

interface ComplexityRow {
  n: string;
  complexity: string;
  patterns: string;
}

const COMPLEXITY_ROWS: ComplexityRow[] = [
  { n: "n ≤ 20", complexity: "O(2ⁿ) or O(n!)", patterns: "Backtracking, Bitmask DP, Brute Force" },
  { n: "n ≤ 100", complexity: "O(n³)", patterns: "Interval DP, Floyd-Warshall" },
  { n: "n ≤ 1,000", complexity: "O(n²)", patterns: "2D DP, O(n²) Two Pointers" },
  { n: "n ≤ 100,000", complexity: "O(n log n)", patterns: "Merge Sort, Binary Search, Heap" },
  { n: "n ≤ 1,000,000", complexity: "O(n)", patterns: "Two Pointers, Sliding Window, BFS/DFS" },
  {
    n: "n > 10,000,000",
    complexity: "O(log n) or O(1)",
    patterns: "Binary Search, Math, Bit Tricks",
  },
];

interface OverlapRow {
  situation: string;
  guidance: string;
}

const OVERLAP_ROWS: OverlapRow[] = [
  {
    situation: "Subarray sum = k",
    guidance: "Prefix Sum (not Sliding Window — values can be negative)",
  },
  {
    situation: "Max sum subarray",
    guidance: "Kadane's (not Prefix Sum — O(1) space)",
  },
  {
    situation: "Find pair summing to k, unsorted",
    guidance: "HashMap (not Two Pointers — needs sort first)",
  },
  {
    situation: "Shortest path in grid",
    guidance: "BFS (not DFS — BFS guarantees shortest)",
  },
  {
    situation: "Cycle in undirected graph",
    guidance: "Union-Find (not DFS — simpler for this case)",
  },
  {
    situation: "Cycle in directed graph",
    guidance: "DFS 3-colour (Union-Find doesn't work here)",
  },
];

function PatternCheatsheetPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/app" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRightIcon className="size-3.5" aria-hidden="true" />
        <span className="font-medium text-foreground">Pattern Cheatsheet</span>
      </nav>

      <h1 className="mb-2 text-2xl font-bold tracking-tight">Pattern Cheatsheet</h1>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
        Scan the problem statement for these signals, match to a pattern, jump to that subtopic.
        Built from the phrases that actually show up in problem statements — not textbook names.
      </p>

      {PATTERN_GROUPS.map((group) => (
        <PatternTable key={group.category} group={group} />
      ))}

      <h2 className="mb-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">
        Complexity Signal Table
      </h2>
      <div className="mb-8 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-150 text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <th className="px-4 py-3 text-left">Input size (n)</th>
              <th className="px-4 py-3 text-left">Max complexity</th>
              <th className="px-4 py-3 text-left">Typical patterns</th>
            </tr>
          </thead>
          <tbody>
            {COMPLEXITY_ROWS.map((row) => (
              <tr key={row.n} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 font-mono text-sm whitespace-nowrap">{row.n}</td>
                <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-muted-foreground">
                  {row.complexity}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{row.patterns}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">
        Tricky Overlaps — Which One?
      </h2>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-125 text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <th className="px-4 py-3 text-left">Situation</th>
              <th className="px-4 py-3 text-left">Use this, not that</th>
            </tr>
          </thead>
          <tbody>
            {OVERLAP_ROWS.map((row) => (
              <tr key={row.situation} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 whitespace-nowrap">{row.situation}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.guidance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PatternTable({ group }: { readonly group: PatternGroup }) {
  return (
    <>
      <h2 className="mb-3.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
        {group.category}
      </h2>
      <div className="mb-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-125 table-fixed text-sm">
          <colgroup>
            <col className="w-[62%]" />
            <col className="w-[38%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-border text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <th className="px-4 py-3 text-left">If the problem says or asks...</th>
              <th className="px-4 py-3 text-left">Reach for...</th>
            </tr>
          </thead>
          <tbody>
            {group.rows.map((row) => (
              <tr key={row.signal} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 text-sm">&quot;{row.signal}&quot;</td>
                <td className="px-4 py-3 text-sm font-medium text-primary">{row.pattern}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
