import { createServerFn } from "@tanstack/react-start";

import { authMiddleware } from "#/lib/auth/middleware.ts";
import { db } from "#/lib/db/index.ts";
import type { QuestionStatus } from "#/lib/db/schema/types.ts";

import { computeStreakDays, startOfWeekUtc } from "./streak";

export interface DashboardTopicProgress {
  id: string;
  slug: string;
  name: string;
  icon: string;
  solved: number;
  total: number;
}

export interface DashboardActivityItem {
  questionId: string;
  questionSlug: string;
  title: string;
  topicSlug: string;
  topicName: string;
  subtopicSlug: string;
  subtopicName: string;
  subtopicSolved: number;
  subtopicTotal: number;
  status: QuestionStatus;
  practicedAt: string;
}

export interface DashboardStats {
  totalSolved: number;
  totalQuestions: number;
  totalAttempted: number;
  topicsActiveCount: number;
  topicsCount: number;
  weekSolvedCount: number;
  streakDays: number;
  topics: DashboardTopicProgress[];
  continueItem: DashboardActivityItem | null;
  recentActivity: DashboardActivityItem[];
}

interface ActivityWorkingItem {
  questionId: string;
  questionSlug: string;
  title: string;
  topicSlug: string;
  topicName: string;
  subtopicSlug: string;
  subtopicName: string;
  subtopicSolved: number;
  subtopicTotal: number;
  status: QuestionStatus;
  practicedAt: Date;
}

function toPublicActivity(item: ActivityWorkingItem): DashboardActivityItem {
  return { ...item, practicedAt: item.practicedAt.toISOString() };
}

export const $getDashboardStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<DashboardStats> => {
    const userId = context.user.id;

    const topicRows = await db.query.topic.findMany({
      orderBy: { sortOrder: "asc" },
      with: {
        subtopics: {
          where: { isMixedPool: false },
          with: {
            questions: {
              with: {
                progress: { where: { userId } },
              },
            },
          },
        },
      },
    });

    const topics: DashboardTopicProgress[] = [];
    const activity: ActivityWorkingItem[] = [];
    const solvedDates: Date[] = [];

    let totalSolved = 0;
    let totalQuestions = 0;
    let totalAttempted = 0;
    let weekSolvedCount = 0;

    const weekStart = startOfWeekUtc(new Date());

    for (const topic of topicRows) {
      let topicSolved = 0;
      let topicTotal = 0;

      for (const subtopic of topic.subtopics) {
        let subtopicSolved = 0;
        const subtopicTotal = subtopic.questions.length;
        const subtopicActivity: Omit<ActivityWorkingItem, "subtopicSolved" | "subtopicTotal">[] =
          [];

        for (const question of subtopic.questions) {
          topicTotal += 1;
          const progress = question.progress[0];
          if (!progress) continue;

          if (progress.status === "solved") {
            topicSolved += 1;
            subtopicSolved += 1;
            if (progress.solvedAt) {
              solvedDates.push(progress.solvedAt);
              if (progress.solvedAt >= weekStart) weekSolvedCount += 1;
            }
          } else if (progress.status === "attempted") {
            totalAttempted += 1;
          }

          subtopicActivity.push({
            questionId: question.id,
            questionSlug: question.slug,
            title: question.title,
            topicSlug: topic.slug,
            topicName: topic.name,
            subtopicSlug: subtopic.slug,
            subtopicName: subtopic.name,
            status: progress.status,
            practicedAt: progress.lastPracticedAt ?? progress.updatedAt,
          });
        }

        for (const item of subtopicActivity) {
          activity.push({ ...item, subtopicSolved, subtopicTotal });
        }
      }

      totalSolved += topicSolved;
      totalQuestions += topicTotal;
      topics.push({
        id: topic.id,
        slug: topic.slug,
        name: topic.name,
        icon: topic.icon,
        solved: topicSolved,
        total: topicTotal,
      });
    }

    activity.sort((a, b) => b.practicedAt.getTime() - a.practicedAt.getTime());

    const continueSource = activity.find((item) => item.status === "attempted") ?? null;

    return {
      totalSolved,
      totalQuestions,
      totalAttempted,
      topicsActiveCount: topics.filter((topic) => topic.solved > 0).length,
      topicsCount: topics.length,
      weekSolvedCount,
      streakDays: computeStreakDays(solvedDates),
      topics,
      continueItem: continueSource ? toPublicActivity(continueSource) : null,
      recentActivity: activity.slice(0, 5).map(toPublicActivity),
    };
  });
