import { createServerFn } from "@tanstack/react-start";

import { authMiddleware } from "#/lib/auth/middleware.ts";
import { db } from "#/lib/db/index.ts";

interface WeekPlan {
  week: number;
  focus: string;
  topicsLabel: string;
  target: string;
  topicSlugs: string[];
}

const WEEK_PLAN: WeekPlan[] = [
  {
    week: 1,
    focus: "Foundation",
    topicsLabel: "Arrays & Strings",
    target: "20–25",
    topicSlugs: ["arrays", "strings"],
  },
  {
    week: 2,
    focus: "Searching & Sorting",
    topicsLabel: "Binary Search, Sorting",
    target: "15–20",
    topicSlugs: ["search", "sort"],
  },
  {
    week: 3,
    focus: "Linear Structures",
    topicsLabel: "Stacks & Queues, Linked Lists",
    target: "20–25",
    topicSlugs: ["stacks-queues", "linked-lists"],
  },
  {
    week: 4,
    focus: "Trees",
    topicsLabel: "Binary Trees, BST",
    target: "20–25",
    topicSlugs: ["trees"],
  },
  {
    week: 5,
    focus: "Graphs",
    topicsLabel: "BFS, DFS, Topo Sort, Union-Find",
    target: "20–25",
    topicSlugs: ["graphs"],
  },
  {
    week: 6,
    focus: "Dynamic Programming",
    topicsLabel: "1D, 2D, Knapsack",
    target: "20–25",
    topicSlugs: ["dynamic-programming"],
  },
  {
    week: 7,
    focus: "Advanced",
    topicsLabel: "Heaps, Tries, Backtracking, Intervals",
    target: "20–25",
    topicSlugs: ["heaps-pq", "tries", "backtracking", "intervals", "bit-manipulation", "greedy"],
  },
  {
    week: 8,
    focus: "Review & Mock",
    topicsLabel: "Mixed, timed practice, mock interviews",
    target: "20–30",
    topicSlugs: [],
  },
];

export type StudyWeekStatus = "complete" | "in-progress" | "upcoming";

export interface StudyWeekProgress {
  week: number;
  focus: string;
  topicsLabel: string;
  target: string;
  status: StudyWeekStatus;
  solved: number;
  total: number;
}

export interface StudyPlanProgress {
  weeks: StudyWeekProgress[];
  currentWeek: number;
  completedWeeks: number;
}

export const $getStudyPlanProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<StudyPlanProgress> => {
    const userId = context.user.id;
    const allTopicSlugs = [...new Set(WEEK_PLAN.flatMap((w) => w.topicSlugs))];

    const topicRows = await db.query.topic.findMany({
      where: { slug: { in: allTopicSlugs } },
      columns: { slug: true },
      with: {
        subtopics: {
          with: {
            questions: {
              columns: { id: true },
              with: { progress: { where: { userId }, columns: { status: true } } },
            },
          },
        },
      },
    });

    const progressBySlug = new Map<string, { solved: number; total: number }>();
    for (const topic of topicRows) {
      let solved = 0;
      let total = 0;
      for (const subtopic of topic.subtopics) {
        for (const question of subtopic.questions) {
          total += 1;
          if (question.progress[0]?.status === "solved") solved += 1;
        }
      }
      progressBySlug.set(topic.slug, { solved, total });
    }

    const weeksComputed = WEEK_PLAN.map((week) => {
      let solved = 0;
      let total = 0;
      for (const slug of week.topicSlugs) {
        const progress = progressBySlug.get(slug);
        if (progress) {
          solved += progress.solved;
          total += progress.total;
        }
      }
      return { ...week, solved, total };
    });

    // The current week is the first one that isn't fully solved yet (a
    // topic-less review week, with total 0, counts as "not complete" so it
    // only becomes current once every earlier week is actually done).
    const current = weeksComputed.find((week) => week.total === 0 || week.solved < week.total);
    const currentWeek = current?.week ?? weeksComputed[weeksComputed.length - 1].week;

    const weeks: StudyWeekProgress[] = weeksComputed.map((week) => {
      const isComplete = week.total > 0 && week.solved === week.total;
      const status: StudyWeekStatus = isComplete
        ? "complete"
        : week.week === currentWeek
          ? "in-progress"
          : "upcoming";
      return {
        week: week.week,
        focus: week.focus,
        topicsLabel: week.topicsLabel,
        target: week.target,
        status,
        solved: week.solved,
        total: week.total,
      };
    });

    return {
      weeks,
      currentWeek,
      completedWeeks: weeks.filter((week) => week.status === "complete").length,
    };
  });
