import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";

export const Route = createFileRoute("/_auth/app/complexity-reference")({
  component: ComplexityReferencePage,
});

interface GrowthRow {
  notation: string;
  name: string;
  example: string;
}

const GROWTH_RATES: GrowthRow[] = [
  { notation: "O(1)", name: "Constant", example: "Array index access, hash map lookup" },
  { notation: "O(log n)", name: "Logarithmic", example: "Binary search, balanced BST operations" },
  { notation: "O(n)", name: "Linear", example: "Single pass over an array, linked list traversal" },
  {
    notation: "O(n log n)",
    name: "Linearithmic",
    example: "Merge sort, heap sort, sorting in general",
  },
  { notation: "O(n²)", name: "Quadratic", example: "Nested loops, naive pair-checking" },
  { notation: "O(2ⁿ)", name: "Exponential", example: "Brute-force subsets, unoptimized recursion" },
  { notation: "O(n!)", name: "Factorial", example: "Brute-force permutations" },
];

interface StructureRow {
  structure: string;
  access: string;
  search: string;
  insert: string;
  delete: string;
  space: string;
}

const DATA_STRUCTURES: StructureRow[] = [
  {
    structure: "Array",
    access: "O(1)",
    search: "O(n)",
    insert: "O(n)",
    delete: "O(n)",
    space: "O(n)",
  },
  {
    structure: "Dynamic Array (list)",
    access: "O(1)",
    search: "O(n)",
    insert: "O(1) amortized",
    delete: "O(n)",
    space: "O(n)",
  },
  {
    structure: "Linked List",
    access: "O(n)",
    search: "O(n)",
    insert: "O(1)",
    delete: "O(1)",
    space: "O(n)",
  },
  {
    structure: "Stack / Queue",
    access: "O(n)",
    search: "O(n)",
    insert: "O(1)",
    delete: "O(1)",
    space: "O(n)",
  },
  {
    structure: "Hash Table",
    access: "—",
    search: "O(1) avg",
    insert: "O(1) avg",
    delete: "O(1) avg",
    space: "O(n)",
  },
  {
    structure: "Binary Search Tree (balanced)",
    access: "O(log n)",
    search: "O(log n)",
    insert: "O(log n)",
    delete: "O(log n)",
    space: "O(n)",
  },
  {
    structure: "Heap (binary)",
    access: "O(1) min/max",
    search: "O(n)",
    insert: "O(log n)",
    delete: "O(log n)",
    space: "O(n)",
  },
  {
    structure: "Trie",
    access: "—",
    search: "O(L)",
    insert: "O(L)",
    delete: "O(L)",
    space: "O(n · L)",
  },
];

interface AlgorithmRow {
  algorithm: string;
  time: string;
  space: string;
}

const ALGORITHMS: AlgorithmRow[] = [
  { algorithm: "Binary Search", time: "O(log n)", space: "O(1)" },
  { algorithm: "Merge Sort", time: "O(n log n)", space: "O(n)" },
  { algorithm: "Quick Sort (average)", time: "O(n log n)", space: "O(log n)" },
  { algorithm: "Quick Sort (worst case)", time: "O(n²)", space: "O(n)" },
  { algorithm: "Heap Sort", time: "O(n log n)", space: "O(1)" },
  { algorithm: "Counting Sort", time: "O(n + k)", space: "O(n + k)" },
  { algorithm: "BFS / DFS", time: "O(V + E)", space: "O(V)" },
  { algorithm: "Dijkstra (binary heap)", time: "O((V + E) log V)", space: "O(V)" },
  { algorithm: "Bellman-Ford", time: "O(V · E)", space: "O(V)" },
  { algorithm: "Floyd-Warshall", time: "O(V³)", space: "O(V²)" },
  { algorithm: "Topological Sort (Kahn's)", time: "O(V + E)", space: "O(V)" },
  { algorithm: "Union-Find (path compression)", time: "O(α(n)) per op", space: "O(n)" },
];

function ComplexityReferencePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/app" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRightIcon className="size-3.5" aria-hidden="true" />
        <span className="font-medium text-foreground">Complexity Reference</span>
      </nav>

      <h1 className="mb-2 text-2xl font-bold tracking-tight">Complexity Reference</h1>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
        Quick lookup for Big-O growth rates, per-operation costs on common data structures, and the
        time/space complexity of the algorithms that show up across every topic.
      </p>

      <h2 className="mb-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">
        Big-O Growth Rates
      </h2>
      <div className="mb-8 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-125 table-fixed text-sm">
          <colgroup>
            <col className="w-28" />
            <col className="w-32" />
            <col />
          </colgroup>
          <thead>
            <tr className="border-b border-border text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <th className="px-4 py-3 text-left">Notation</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Typical example</th>
            </tr>
          </thead>
          <tbody>
            {GROWTH_RATES.map((row) => (
              <tr key={row.notation} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 font-mono text-sm font-medium text-primary">
                  {row.notation}
                </td>
                <td className="px-4 py-3 text-sm">{row.name}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{row.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">
        Data Structure Operations
      </h2>
      <div className="mb-8 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-175 table-fixed text-sm">
          <colgroup>
            <col className="w-[26%]" />
            <col />
            <col />
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr className="border-b border-border text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <th className="px-4 py-3 text-left">Structure</th>
              <th className="px-3 py-3 text-left">Access</th>
              <th className="px-3 py-3 text-left">Search</th>
              <th className="px-3 py-3 text-left">Insert</th>
              <th className="px-3 py-3 text-left">Delete</th>
              <th className="px-3 py-3 text-left">Space</th>
            </tr>
          </thead>
          <tbody>
            {DATA_STRUCTURES.map((row) => (
              <tr key={row.structure} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">{row.structure}</td>
                <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{row.access}</td>
                <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{row.search}</td>
                <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{row.insert}</td>
                <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{row.delete}</td>
                <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{row.space}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">
        Algorithm Complexities
      </h2>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-125 table-fixed text-sm">
          <colgroup>
            <col className="w-[46%]" />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr className="border-b border-border text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <th className="px-4 py-3 text-left">Algorithm</th>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Space</th>
            </tr>
          </thead>
          <tbody>
            {ALGORITHMS.map((row) => (
              <tr key={row.algorithm} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">{row.algorithm}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.time}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.space}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
