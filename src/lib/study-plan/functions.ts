import { createServerFn } from "@tanstack/react-start";

import { authMiddleware } from "#/lib/auth/middleware.ts";
import { TOPIC_BY_SLUG } from "#/lib/curriculum/content.ts";
import { db } from "#/lib/db/index.ts";
import type { QuestionStatus } from "#/lib/db/schema/types.ts";

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

export interface StudyDayQuestion {
  id: string;
  slug: string;
  title: string;
  leetcodeNumber: number | null;
  status: QuestionStatus;
}

export interface StudyDay {
  day: number;
  subtopicName: string;
  topicSlug: string;
  subtopicSlug: string;
  solved: number;
  total: number;
  questions: StudyDayQuestion[];
}

export interface StudyPlanProgress {
  weeks: StudyWeekProgress[];
  currentWeek: number;
  completedWeeks: number;
  currentWeekDays: StudyDay[];
}

export const $getStudyPlanProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<StudyPlanProgress> => {
    const userId = context.user.id;

    const progressRows = await db.query.questionProgress.findMany({
      where: { userId },
      columns: { questionId: true, status: true },
    });
    const statusByQuestionId = new Map(progressRows.map((row) => [row.questionId, row.status]));

    const progressBySlug = new Map<string, { solved: number; total: number }>();
    for (const topicSlug of new Set(WEEK_PLAN.flatMap((week) => week.topicSlugs))) {
      const topic = TOPIC_BY_SLUG.get(topicSlug);
      if (!topic) continue;

      let solved = 0;
      let total = 0;
      for (const subtopic of topic.subtopics) {
        if (subtopic.isMixedPool) continue;
        for (const question of subtopic.allQuestions) {
          total += 1;
          if (statusByQuestionId.get(question.id) === "solved") solved += 1;
        }
      }
      progressBySlug.set(topicSlug, { solved, total });
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

    // The current week's day-by-day breakdown is generated straight from the
    // real curriculum: each subtopic in the week's topic(s), in order, becomes
    // one "day," listing that subtopic's actual questions and live status.
    const currentWeekPlan = WEEK_PLAN.find((week) => week.week === currentWeek);
    const currentWeekDays: StudyDay[] = [];
    let dayNumber = 0;
    for (const topicSlug of currentWeekPlan?.topicSlugs ?? []) {
      const topic = TOPIC_BY_SLUG.get(topicSlug);
      if (!topic) continue;

      for (const subtopic of topic.subtopics) {
        if (subtopic.isMixedPool) continue;

        dayNumber += 1;
        let solved = 0;
        const questions: StudyDayQuestion[] = subtopic.allQuestions.map((question) => {
          const status = statusByQuestionId.get(question.id) ?? "todo";
          if (status === "solved") solved += 1;
          return {
            id: question.id,
            slug: question.slug,
            title: question.title,
            leetcodeNumber: question.leetcodeNumber,
            status,
          };
        });

        currentWeekDays.push({
          day: dayNumber,
          subtopicName: subtopic.name,
          topicSlug,
          subtopicSlug: subtopic.slug,
          solved,
          total: questions.length,
          questions,
        });
      }
    }

    return {
      weeks,
      currentWeek,
      completedWeeks: weeks.filter((week) => week.status === "complete").length,
      currentWeekDays,
    };
  });
