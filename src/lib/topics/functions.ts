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
    inRotation: number;
    confirmedSolid: number;
    dueForReview: number;
    lastPracticedAt: string | null;
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
                  columns: { status: true, resolvableIn2Weeks: true, lastPracticedAt: true },
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
    let confirmedSolid = 0;
    let dueForReview = 0;
    const practicedDates: Date[] = [];

    const subtopics: TopicSubtopicSummary[] = topic.subtopics.map((subtopic) => {
      let solved = 0;
      const total = subtopic.questions.length;

      for (const question of subtopic.questions) {
        const progress = question.progress[0];
        if (progress?.status === "solved") {
          solved += 1;
          if (progress.resolvableIn2Weeks) confirmedSolid += 1;
          else dueForReview += 1;
        } else if (progress?.status === "attempted") {
          dueForReview += 1;
        }

        if (progress?.lastPracticedAt) practicedDates.push(progress.lastPracticedAt);
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

    const lastPracticedAt =
      practicedDates.length > 0
        ? new Date(Math.max(...practicedDates.map((date) => date.getTime())))
        : null;

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
      mixedRecall: {
        inRotation: confirmedSolid + dueForReview,
        confirmedSolid,
        dueForReview,
        lastPracticedAt: lastPracticedAt ? lastPracticedAt.toISOString() : null,
      },
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
  dueForReview: boolean;
}

export interface SubtopicQuestionGroup {
  id: string;
  name: string;
  description: string | null;
  questions: SubtopicQuestion[];
}

export interface SubtopicContinueItem {
  questionId: string;
  title: string;
  groupName: string | null;
  status: QuestionStatus;
}

export interface RelatedSubtopic {
  slug: string;
  name: string;
  description: string;
}

export interface SubtopicDetail {
  topic: { slug: string; name: string; icon: string };
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
  continueItem: SubtopicContinueItem | null;
  relatedSubtopics: RelatedSubtopic[];
}

const getSubtopicDetailInput = z.object({ topicSlug: z.string(), subtopicSlug: z.string() });

export const $getSubtopicDetail = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(getSubtopicDetailInput)
  .handler(async ({ context, data }): Promise<SubtopicDetail | null> => {
    const userId = context.user.id;

    const topic = await db.query.topic.findFirst({
      where: { slug: data.topicSlug },
      columns: { slug: true, name: true, icon: true },
      with: {
        subtopics: {
          where: { slug: { ne: data.subtopicSlug } },
          orderBy: { sortOrder: "asc" },
          limit: 2,
          columns: { slug: true, name: true, description: true },
        },
      },
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
              with: {
                progress: {
                  where: { userId },
                  columns: { status: true, resolvableIn2Weeks: true, lastPracticedAt: true },
                },
              },
            },
          },
        },
        questions: {
          where: { groupId: { isNull: true } },
          orderBy: { sortOrder: "asc" },
          with: {
            progress: {
              where: { userId },
              columns: { status: true, resolvableIn2Weeks: true, lastPracticedAt: true },
            },
          },
        },
      },
    });
    if (!subtopic) return null;

    type RawQuestion = {
      id: string;
      slug: string;
      title: string;
      leetcodeNumber: number | null;
      url: string | null;
      difficulty: Difficulty;
      progress: {
        status: QuestionStatus;
        resolvableIn2Weeks: boolean;
        lastPracticedAt: Date | null;
      }[];
    };

    const toPublicQuestion = (question: RawQuestion): SubtopicQuestion => {
      const progress = question.progress[0];
      const status = progress?.status ?? "todo";
      const dueForReview =
        status === "attempted" || (status === "solved" && !progress?.resolvableIn2Weeks);

      return {
        id: question.id,
        slug: question.slug,
        title: question.title,
        leetcodeNumber: question.leetcodeNumber,
        url: question.url,
        difficulty: question.difficulty,
        status,
        dueForReview,
      };
    };

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

    const rawQuestionsWithGroup = [
      ...subtopic.groups.flatMap((group) =>
        group.questions.map((question) => ({ question, groupName: group.name as string | null })),
      ),
      ...subtopic.questions.map((question) => ({ question, groupName: null as string | null })),
    ];

    const continueCandidate = rawQuestionsWithGroup
      .filter(({ question }) => question.progress[0]?.status === "attempted")
      .sort((a, b) => {
        const aTime = a.question.progress[0]?.lastPracticedAt?.getTime() ?? 0;
        const bTime = b.question.progress[0]?.lastPracticedAt?.getTime() ?? 0;
        return bTime - aTime;
      })[0];

    const continueItem: SubtopicContinueItem | null = continueCandidate
      ? {
          questionId: continueCandidate.question.id,
          title: continueCandidate.question.title,
          groupName: continueCandidate.groupName,
          status: "attempted",
        }
      : null;

    return {
      topic: { slug: topic.slug, name: topic.name, icon: topic.icon },
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
      continueItem,
      relatedSubtopics: topic.subtopics,
    };
  });
