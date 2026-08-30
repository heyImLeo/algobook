import { noop, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRightIcon, TriangleAlertIcon } from "lucide-react";

import { QuestionStatusIcon } from "#/components/question-status-icon.tsx";
import type { QuestionStatus } from "#/lib/db/schema/types.ts";
import type { StudyWeekProgress, StudyWeekStatus } from "#/lib/study-plan/functions.ts";
import { studyPlanProgressQueryOptions } from "#/lib/study-plan/queries.ts";
import { cn } from "#/lib/utils.ts";

export const Route = createFileRoute("/_auth/app/study-plan")({
  component: StudyPlanPage,
  loader: ({ context }) => {
    void context.queryClient.query(studyPlanProgressQueryOptions()).catch(noop);
  },
});

interface ChecklistRow {
  num: number;
  name: string;
  problems: string;
}

interface ChecklistGroup {
  category: string;
  rows: ChecklistRow[];
}

const CORE_PATTERN_CHECKLIST: ChecklistGroup[] = [
  {
    category: "Arrays",
    rows: [
      { num: 1, name: "Sliding Window", problems: "3 · 76 · 209 · 424 · 567 · 904" },
      { num: 2, name: "Two Pointers", problems: "11 · 15 · 16 · 18 · 42 · 167" },
      { num: 6, name: "Hashing / Frequency Maps", problems: "1 · 49 · 128 · 217 · 242 · 347" },
      { num: 7, name: "Prefix Sum / Running Sum", problems: "303 · 560 · 724 · 930 · 974 · 523" },
      {
        num: 8,
        name: "Difference Array / Range Updates",
        problems: "370 · 1094 · 1109 · 1893 · 1943 · 2381",
      },
    ],
  },
  {
    category: "Linked Lists",
    rows: [
      { num: 3, name: "Fast / Slow Pointers", problems: "141 · 142 · 19 · 876 · 160 · 234" },
      { num: 14, name: "Linked List Manipulation", problems: "21 · 23 · 24 · 25 · 92 · 138" },
    ],
  },
  {
    category: "Search",
    rows: [
      { num: 4, name: "Binary Search on Sorted Data", problems: "33 · 34 · 35 · 153 · 162 · 704" },
      { num: 5, name: "Binary Search on Answer", problems: "875 · 1011 · 410 · 774 · 1283 · 1482" },
    ],
  },
  {
    category: "Stacks & Queues",
    rows: [
      { num: 9, name: "Monotonic Stack", problems: "739 · 496 · 503 · 84 · 85 · 901" },
      {
        num: 10,
        name: "Monotonic Queue / Deque",
        problems: "239 · 862 · 1425 · 1438 · 1499 · 1696",
      },
    ],
  },
  {
    category: "Heaps / PQ",
    rows: [{ num: 11, name: "Heap / Top K", problems: "215 · 347 · 692 · 703 · 973 · 1046" }],
  },
  {
    category: "Greedy",
    rows: [
      { num: 13, name: "Greedy Scheduling / Sorting", problems: "45 · 55 · 406 · 621 · 763 · 134" },
    ],
  },
  {
    category: "Backtracking",
    rows: [
      { num: 18, name: "Backtracking Basics", problems: "46 · 47 · 77 · 78 · 90 · 39" },
      {
        num: 19,
        name: "Backtracking with Constraints",
        problems: "40 · 17 · 79 · 131 · 51 · 52",
      },
    ],
  },
  {
    category: "Intervals",
    rows: [{ num: 12, name: "Intervals", problems: "56 · 57 · 252 · 253 · 435 · 452" }],
  },
  {
    category: "Graphs",
    rows: [
      { num: 20, name: "Graph BFS / DFS", problems: "200 · 695 · 733 · 994 · 1091 · 1254" },
      { num: 21, name: "Topological Sort / DAG", problems: "207 · 210 · 802 · 1462 · 1203 · 2115" },
      { num: 22, name: "Union Find / DSU", problems: "547 · 684 · 1319 · 1579 · 990 · 1202" },
      { num: 23, name: "Shortest Path", problems: "743 · 787 · 1514 · 1631 · 1334 · 1976" },
      { num: 24, name: "MST / Graph Greedy", problems: "1584 · 1135 · 1168 · 1489 · 778 · 1102" },
    ],
  },
  {
    category: "Trees",
    rows: [
      { num: 15, name: "Tree DFS", problems: "104 · 112 · 113 · 543 · 124 · 226" },
      { num: 16, name: "Tree BFS / Level Order", problems: "102 · 103 · 199 · 515 · 637 · 116" },
      { num: 17, name: "BST Problems", problems: "98 · 99 · 230 · 235 · 450 · 700" },
    ],
  },
  {
    category: "Dynamic Programming",
    rows: [
      { num: 27, name: "1D DP Basics", problems: "70 · 198 · 213 · 322 · 279 · 300" },
      { num: 28, name: "Knapsack / Subset DP", problems: "416 · 494 · 518 · 474 · 1049 · 879" },
      { num: 29, name: "Grid DP", problems: "62 · 63 · 64 · 221 · 931 · 120" },
      { num: 30, name: "String DP / Sequence DP", problems: "1143 · 72 · 115 · 583 · 97 · 1312" },
    ],
  },
  {
    category: "Tries",
    rows: [{ num: 25, name: "Trie", problems: "208 · 211 · 212 · 648 · 677 · 1268" }],
  },
  {
    category: "Bit Manipulation",
    rows: [{ num: 26, name: "Bit Manipulation", problems: "136 · 137 · 191 · 338 · 268 · 190" }],
  },
];

interface DayQuestion {
  title: string;
  leetcodeNumber: number;
  status: QuestionStatus;
}

interface DayGroup {
  label: string;
  questions: DayQuestion[];
}

const WEEK_5_DAY_BY_DAY: DayGroup[] = [
  {
    label: "Day 1–2 — BFS & DFS Fundamentals",
    questions: [
      { title: "Number of Islands", leetcodeNumber: 200, status: "solved" },
      { title: "Clone Graph", leetcodeNumber: 133, status: "todo" },
      { title: "Rotting Oranges", leetcodeNumber: 994, status: "solved" },
      { title: "Flood Fill", leetcodeNumber: 733, status: "solved" },
      { title: "Pacific Atlantic Water Flow", leetcodeNumber: 417, status: "attempted" },
    ],
  },
  {
    label: "Day 3 — Topological Sort",
    questions: [
      { title: "Course Schedule", leetcodeNumber: 207, status: "todo" },
      { title: "Course Schedule II", leetcodeNumber: 210, status: "todo" },
      { title: "Alien Dictionary", leetcodeNumber: 269, status: "todo" },
      { title: "All Ancestors of a Node in a DAG", leetcodeNumber: 2192, status: "todo" },
    ],
  },
  {
    label: "Day 4 — Union-Find",
    questions: [
      { title: "Number of Connected Components", leetcodeNumber: 323, status: "todo" },
      { title: "Redundant Connection", leetcodeNumber: 684, status: "todo" },
      { title: "Accounts Merge", leetcodeNumber: 721, status: "todo" },
      { title: "Graph Valid Tree", leetcodeNumber: 261, status: "todo" },
    ],
  },
  {
    label: "Day 5–6 — Dijkstra & Advanced",
    questions: [
      { title: "Network Delay Time", leetcodeNumber: 743, status: "solved" },
      { title: "Cheapest Flights Within K Stops", leetcodeNumber: 787, status: "attempted" },
      { title: "Path with Minimum Effort", leetcodeNumber: 1631, status: "todo" },
      { title: "Word Ladder", leetcodeNumber: 127, status: "attempted" },
    ],
  },
];

const DAILY_LOG_TEMPLATE = `Date: ___________
Topic: ___________

Problem 1: _________________ (#___)
- First instinct: ___________________
- Pattern identified: _______________
- Solved without hint: Y / N
- Time taken: _______ min
- Complexity: T: O(?)  S: O(?)
- Notes: ___________________________

Daily reflection:
- What pattern felt unclear today?
- What did I look up that I should know cold?`;

const DIFFICULTY_PROGRESSION = [
  "Read the pattern's reference page — understand the template.",
  "Solve 2–3 Easy problems to build muscle memory.",
  "Solve 3–4 Medium problems without hints.",
  "Attempt 1 Hard problem — look at hints after 30 min.",
  "Re-solve anything that took over 25 min without looking at the solution.",
];

const RED_FLAGS = [
  "Reaching for brute force every time — drill the cheatsheet",
  "Mediums fine but Hards feel impossible — practice combining 2 patterns",
  "Right approach, wrong code — trace through a small example",
];

const STATUS_STYLES: Record<StudyWeekStatus, string> = {
  complete: "bg-success/15 text-success",
  "in-progress": "bg-primary/15 text-primary",
  upcoming: "bg-muted text-muted-foreground",
};

const STATUS_LABELS: Record<StudyWeekStatus, string> = {
  complete: "Complete",
  "in-progress": "In Progress",
  upcoming: "Upcoming",
};

function StudyPlanPage() {
  const progressQuery = useQuery(studyPlanProgressQueryOptions());
  const progress = progressQuery.data;
  const currentWeek = progress?.weeks.find((week) => week.week === progress.currentWeek);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/app" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRightIcon className="size-3.5" aria-hidden="true" />
        <span className="font-medium text-foreground">Study Plan</span>
      </nav>

      <h1 className="mb-2 text-2xl font-bold tracking-tight">Study Plan</h1>
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
        An 8-week roadmap from rusty to interview-ready. Each week targets specific topics and
        builds on the last — adjust the pace to your own starting level.
      </p>

      {progress && currentWeek && (
        <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-5">
          <div>
            <div className="mb-0.5 text-xs font-bold tracking-wide text-primary uppercase">
              Currently on
            </div>
            <div className="text-sm font-bold">
              Week {currentWeek.week} — {currentWeek.focus}
            </div>
          </div>
          <div className="h-1.5 min-w-32 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(progress.completedWeeks / progress.weeks.length) * 100}%` }}
            />
          </div>
          <span className="font-mono text-xs whitespace-nowrap text-muted-foreground">
            {progress.completedWeeks} of {progress.weeks.length} weeks
          </span>
        </div>
      )}

      <h2 className="mb-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">
        8-Week Overview
      </h2>
      <div className="mb-8 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-175 table-fixed text-sm">
          <colgroup>
            <col className="w-14" />
            <col className="w-[26%]" />
            <col className="w-[34%]" />
            <col className="w-24" />
            <col className="w-32" />
          </colgroup>
          <thead>
            <tr className="border-b border-border text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <th className="px-4 py-3 text-left">Week</th>
              <th className="px-4 py-3 text-left">Focus</th>
              <th className="px-4 py-3 text-left">Topics</th>
              <th className="px-4 py-3 text-left">Target</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {progress?.weeks.map((week) => (
              <WeekRow key={week.week} week={week} />
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-1.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
        Core Pattern Checklist
      </h2>
      <p className="mb-4 max-w-2xl text-xs text-muted-foreground">
        30 patterns spanning every topic, 6 hand-picked LeetCode reps each — grouped by topic so it
        maps straight onto the tracker instead of sitting as a separate list.
      </p>
      <div className="mb-8 rounded-2xl border border-border bg-card px-5">
        {CORE_PATTERN_CHECKLIST.map((group) => (
          <div key={group.category}>
            <div className="pt-4 pb-1.5 text-xs font-bold tracking-wide text-primary uppercase">
              {group.category}
            </div>
            {group.rows.map((row) => (
              <div
                key={row.num}
                className="flex items-center gap-3.5 border-b border-border py-2.5 last:border-b-0"
              >
                <span className="w-6 shrink-0 font-mono text-xs text-muted-foreground">
                  {row.num}
                </span>
                <span className="flex-1 text-sm font-semibold">{row.name}</span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {row.problems}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <h2 className="mb-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">
        Week 5 — Graphs, Day by Day
      </h2>
      <div className="mb-8 rounded-2xl border border-border bg-card px-5">
        {WEEK_5_DAY_BY_DAY.map((day) => (
          <div key={day.label}>
            <div className="pt-4 pb-1.5 text-xs font-bold text-muted-foreground">{day.label}</div>
            {day.questions.map((question) => (
              <div
                key={question.leetcodeNumber}
                className="flex items-center gap-2.5 border-b border-border py-2.5 last:border-b-0"
              >
                <QuestionStatusIcon status={question.status} className="shrink-0" />
                <span
                  className={cn("text-sm", question.status === "todo" && "text-muted-foreground")}
                >
                  {question.title}
                </span>
                <span className="ml-auto shrink-0 font-mono text-xs text-muted-foreground">
                  #{question.leetcodeNumber}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <h2 className="mb-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">
        Daily Practice Template
      </h2>
      <pre className="mb-8 overflow-x-auto rounded-2xl border border-border bg-muted p-4 font-mono text-xs leading-relaxed">
        {DAILY_LOG_TEMPLATE}
      </pre>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">
            Difficulty Progression
          </h2>
          <div className="rounded-2xl border border-border bg-card p-5">
            <ol className="ml-4.5 flex list-decimal flex-col gap-2.5">
              {DIFFICULTY_PROGRESSION.map((step) => (
                <li key={step} className="text-sm leading-relaxed text-muted-foreground">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">
            Red Flags
          </h2>
          <div className="flex gap-3.5 rounded-2xl border border-warning/25 bg-warning/10 p-5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning">
              <TriangleAlertIcon className="size-4" aria-hidden="true" />
            </div>
            <ul className="ml-4 flex list-disc flex-col gap-2">
              {RED_FLAGS.map((flag) => (
                <li key={flag} className="text-xs leading-relaxed text-muted-foreground">
                  {flag}
                </li>
              ))}
              <li className="text-xs leading-relaxed text-muted-foreground">
                Timing out — check for{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono">list.pop(0)</code> instead
                of <code className="rounded bg-muted px-1 py-0.5 font-mono">deque.popleft()</code>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeekRow({ week }: { readonly week: StudyWeekProgress }) {
  return (
    <tr
      className={cn(
        "border-b border-border last:border-b-0",
        week.status === "in-progress" && "bg-primary/5",
      )}
    >
      <td className="px-4 py-3 font-mono text-sm text-muted-foreground">{week.week}</td>
      <td
        className={cn(
          "px-4 py-3 text-sm font-semibold",
          week.status === "upcoming" && "text-muted-foreground",
        )}
      >
        {week.focus}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{week.topicsLabel}</td>
      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{week.target}</td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap",
            STATUS_STYLES[week.status],
          )}
        >
          {STATUS_LABELS[week.status]}
        </span>
      </td>
    </tr>
  );
}
