import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";

export const Route = createFileRoute("/_auth/app/python-reference")({
  component: PythonReferencePage,
});

interface SnippetRow {
  purpose: string;
  code: string;
}

interface SnippetGroup {
  category: string;
  rows: SnippetRow[];
}

const SNIPPET_GROUPS: SnippetGroup[] = [
  {
    category: "collections",
    rows: [
      { purpose: "Count occurrences", code: "Counter(items)" },
      { purpose: "Most common k elements", code: "Counter(items).most_common(k)" },
      { purpose: "Dict with a default value/factory", code: "defaultdict(list)" },
      { purpose: "Double-ended queue (O(1) both ends)", code: "deque([1, 2, 3])" },
      { purpose: "Pop from the front in O(1)", code: "dq.popleft()" },
      { purpose: "Insertion-ordered dict (3.7+ dicts already are)", code: "OrderedDict()" },
    ],
  },
  {
    category: "heapq",
    rows: [
      { purpose: "Turn a list into a min-heap in place", code: "heapq.heapify(nums)" },
      { purpose: "Push a value", code: "heapq.heappush(heap, val)" },
      { purpose: "Pop the smallest value", code: "heapq.heappop(heap)" },
      { purpose: "Push then pop in one O(log n) step", code: "heapq.heappushpop(heap, val)" },
      { purpose: "n largest / smallest without a full sort", code: "heapq.nlargest(k, nums)" },
      {
        purpose: "Simulate a max-heap (heapq is min-heap only)",
        code: "heapq.heappush(heap, -val)",
      },
    ],
  },
  {
    category: "itertools",
    rows: [
      { purpose: "All permutations", code: "itertools.permutations(items)" },
      { purpose: "All combinations of size r", code: "itertools.combinations(items, r)" },
      { purpose: "Cartesian product", code: "itertools.product(a, b)" },
      { purpose: "Running totals", code: "itertools.accumulate(nums)" },
      { purpose: "Flatten one level of nesting", code: "itertools.chain(*lists)" },
    ],
  },
  {
    category: "Sorting",
    rows: [
      { purpose: "Sort by a custom key", code: "sorted(items, key=lambda x: x[1])" },
      { purpose: "Sort descending", code: "sorted(items, reverse=True)" },
      { purpose: "Sort by multiple keys", code: "sorted(items, key=lambda x: (x[0], -x[1]))" },
      { purpose: "In-place sort (no new list)", code: "items.sort(key=...)" },
    ],
  },
  {
    category: "Strings",
    rows: [
      { purpose: "Split on whitespace", code: "s.split()" },
      { purpose: "Split on a specific character", code: 's.split(",")' },
      { purpose: "Join a list into a string", code: '"".join(chars)' },
      { purpose: "Strip whitespace from both ends", code: "s.strip()" },
      { purpose: "Check alphanumeric", code: "ch.isalnum()" },
      { purpose: "Reverse a string", code: "s[::-1]" },
    ],
  },
  {
    category: "Comprehensions & Functional",
    rows: [
      { purpose: "List comprehension with filter", code: "[x for x in nums if x % 2 == 0]" },
      { purpose: "Dict comprehension", code: "{k: v for k, v in pairs}" },
      { purpose: "Set comprehension (dedupe)", code: "{x for x in nums}" },
      { purpose: "Map a function over an iterable", code: "map(str, nums)" },
      { purpose: "Iterate with index", code: "enumerate(items)" },
      { purpose: "Iterate two lists together", code: "zip(list_a, list_b)" },
    ],
  },
];

interface GotchaRow {
  mistake: string;
  fix: string;
}

const GOTCHAS: GotchaRow[] = [
  {
    mistake: "list.pop(0) to dequeue — O(n), shifts every remaining element",
    fix: "Use collections.deque and dq.popleft() — O(1)",
  },
  {
    mistake: "Mutable default argument: def f(cache={})",
    fix: "Use def f(cache=None): cache = cache or {}",
  },
  {
    mistake: "/ for integer division",
    fix: "Use // for floor division — / always returns a float",
  },
  {
    mistake: "Checking equality with is instead of ==",
    fix: "is checks identity, not value — use == for value comparison",
  },
  {
    mistake: "Appending to a list while iterating over it",
    fix: "Iterate over a copy (list(items)) or build a new list instead",
  },
  {
    mistake: "Forgetting Python has no do-while — off-by-one loop bounds",
    fix: "Double-check range(start, stop) is exclusive of stop",
  },
];

function PythonReferencePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/app" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRightIcon className="size-3.5" aria-hidden="true" />
        <span className="font-medium text-foreground">Python Reference</span>
      </nav>

      <h1 className="mb-2 text-2xl font-bold tracking-tight">Python Reference</h1>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
        The built-ins and standard-library idioms that come up constantly while solving these
        problems in Python, plus the mistakes that quietly turn a correct solution into a slow or
        wrong one.
      </p>

      {SNIPPET_GROUPS.map((group) => (
        <div key={group.category}>
          <h2 className="mb-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">
            {group.category}
          </h2>
          <div className="mb-8 overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-125 table-fixed text-sm">
              <colgroup>
                <col className="w-[52%]" />
                <col />
              </colgroup>
              <tbody>
                {group.rows.map((row) => (
                  <tr key={row.purpose} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 text-sm text-muted-foreground">{row.purpose}</td>
                    <td className="px-4 py-3 font-mono text-xs">{row.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <h2 className="mb-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">
        Common Gotchas
      </h2>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-150 table-fixed text-sm">
          <colgroup>
            <col className="w-1/2" />
            <col className="w-1/2" />
          </colgroup>
          <thead>
            <tr className="border-b border-border text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <th className="px-4 py-3 text-left">Mistake</th>
              <th className="px-4 py-3 text-left">Fix</th>
            </tr>
          </thead>
          <tbody>
            {GOTCHAS.map((row) => (
              <tr key={row.mistake} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 text-sm text-muted-foreground">{row.mistake}</td>
                <td className="px-4 py-3 text-sm">{row.fix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
