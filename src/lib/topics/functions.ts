import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { authMiddleware } from "#/lib/auth/middleware.ts";
import { db } from "#/lib/db/index.ts";
import type { Difficulty, QuestionStatus } from "#/lib/db/schema/types.ts";

export interface SidebarTopic {
  id: string;
  slug: string;
  name: string;
  icon: string;
  solved: number;
  total: number;
}

export const $getSidebarTopics = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<SidebarTopic[]> => {
    const userId = context.user.id;

    const topicRows = await db.query.topic.findMany({
      orderBy: { sortOrder: "asc" },
      with: {
        subtopics: {
          with: {
            questions: {
              columns: { id: true },
              with: {
                progress: { where: { userId }, columns: { status: true } },
              },
            },
          },
        },
      },
    });

    return topicRows.map((topic) => {
      let solved = 0;
      let total = 0;
      for (const subtopic of topic.subtopics) {
        for (const question of subtopic.questions) {
          total += 1;
          if (question.progress[0]?.status === "solved") solved += 1;
        }
      }
      return { id: topic.id, slug: topic.slug, name: topic.name, icon: topic.icon, solved, total };
    });
  });

export interface TopicSubtopicSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  timeComplexity: string | null;
  spaceComplexity: string | null;
  bestFor: string | null;
  solved: number;
  total: number;
}

export interface TopicDetail {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  timeComplexityRange: string | null;
  spaceComplexityRange: string | null;
  solved: number;
  total: number;
  subtopics: TopicSubtopicSummary[];
  mixedRecall: {
    totalQuestions: number;
    dueForReviewCount: number;
  };
}

const getTopicDetailInput = z.object({ topicSlug: z.string() });

export const $getTopicDetail = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(getTopicDetailInput)
  .handler(async ({ context, data }): Promise<TopicDetail | null> => {
    const userId = context.user.id;

    const topic = await db.query.topic.findFirst({
      where: { slug: data.topicSlug },
      with: {
        subtopics: {
          orderBy: { sortOrder: "asc" },
          with: {
            questions: {
              columns: { id: true },
              with: {
                progress: {
                  where: { userId },
                  columns: { status: true, resolvableIn2Weeks: true },
                },
              },
            },
          },
        },
      },
    });

    if (!topic) return null;

    let topicSolved = 0;
    let topicTotal = 0;
    let dueForReviewCount = 0;

    const subtopics: TopicSubtopicSummary[] = topic.subtopics.map((subtopic) => {
      let solved = 0;
      const total = subtopic.questions.length;

      for (const question of subtopic.questions) {
        const progress = question.progress[0];
        if (progress?.status === "solved") {
          solved += 1;
          if (!progress.resolvableIn2Weeks) dueForReviewCount += 1;
        } else if (progress?.status === "attempted") {
          dueForReviewCount += 1;
        }
      }

      topicSolved += solved;
      topicTotal += total;

      return {
        id: subtopic.id,
        slug: subtopic.slug,
        name: subtopic.name,
        description: subtopic.description,
        timeComplexity: subtopic.timeComplexity,
        spaceComplexity: subtopic.spaceComplexity,
        bestFor: subtopic.bestFor,
        solved,
        total,
      };
    });

    return {
      id: topic.id,
      slug: topic.slug,
      name: topic.name,
      description: topic.description,
      icon: topic.icon,
      timeComplexityRange: topic.timeComplexityRange,
      spaceComplexityRange: topic.spaceComplexityRange,
      solved: topicSolved,
      total: topicTotal,
      subtopics,
      mixedRecall: { totalQuestions: topicTotal, dueForReviewCount },
    };
  });

export interface SubtopicQuestion {
  id: string;
  slug: string;
  title: string;
  leetcodeNumber: number | null;
  url: string | null;
  difficulty: Difficulty;
  status: QuestionStatus;
}

export interface SubtopicQuestionGroup {
  id: string;
  name: string;
  description: string | null;
  questions: SubtopicQuestion[];
}

export interface SubtopicDetail {
  topic: { slug: string; name: string };
  id: string;
  slug: string;
  name: string;
  description: string;
  timeComplexity: string | null;
  spaceComplexity: string | null;
  bestFor: string | null;
  referenceContent: string | null;
  solved: number;
  attempted: number;
  total: number;
  groups: SubtopicQuestionGroup[];
  questions: SubtopicQuestion[];
}

const getSubtopicDetailInput = z.object({ topicSlug: z.string(), subtopicSlug: z.string() });

export const $getSubtopicDetail = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(getSubtopicDetailInput)
  .handler(async ({ context, data }): Promise<SubtopicDetail | null> => {
    const userId = context.user.id;

    const topic = await db.query.topic.findFirst({
      where: { slug: data.topicSlug },
      columns: { slug: true, name: true },
    });
    if (!topic) return null;

    const subtopic = await db.query.subtopic.findFirst({
      where: { slug: data.subtopicSlug, topic: { slug: data.topicSlug } },
      with: {
        groups: {
          orderBy: { sortOrder: "asc" },
          with: {
            questions: {
              orderBy: { sortOrder: "asc" },
              with: { progress: { where: { userId }, columns: { status: true } } },
            },
          },
        },
        questions: {
          where: { groupId: { isNull: true } },
          orderBy: { sortOrder: "asc" },
          with: { progress: { where: { userId }, columns: { status: true } } },
        },
      },
    });
    if (!subtopic) return null;

    const toPublicQuestion = (question: {
      id: string;
      slug: string;
      title: string;
      leetcodeNumber: number | null;
      url: string | null;
      difficulty: Difficulty;
      progress: { status: QuestionStatus }[];
    }): SubtopicQuestion => ({
      id: question.id,
      slug: question.slug,
      title: question.title,
      leetcodeNumber: question.leetcodeNumber,
      url: question.url,
      difficulty: question.difficulty,
      status: question.progress[0]?.status ?? "todo",
    });

    const groups: SubtopicQuestionGroup[] = subtopic.groups.map((group) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      questions: group.questions.map(toPublicQuestion),
    }));

    const questions = subtopic.questions.map(toPublicQuestion);

    const allQuestions = [...groups.flatMap((group) => group.questions), ...questions];
    const solved = allQuestions.filter((question) => question.status === "solved").length;
    const attempted = allQuestions.filter((question) => question.status === "attempted").length;

    return {
      topic: { slug: topic.slug, name: topic.name },
      id: subtopic.id,
      slug: subtopic.slug,
      name: subtopic.name,
      description: subtopic.description,
      timeComplexity: subtopic.timeComplexity,
      spaceComplexity: subtopic.spaceComplexity,
      bestFor: subtopic.bestFor,
      referenceContent: subtopic.referenceContent,
      solved,
      attempted,
      total: allQuestions.length,
      groups,
      questions,
    };
  });
