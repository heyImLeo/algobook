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
          where: { isMixedPool: false },
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
  mixedPractice: {
    todoCount: number;
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
                progress: { where: { userId }, columns: { status: true } },
              },
            },
          },
        },
      },
    });

    if (!topic) return null;

    let topicSolved = 0;
    let topicTotal = 0;
    let mixedPracticeTodo = 0;

    const subtopics: TopicSubtopicSummary[] = [];

    for (const subtopic of topic.subtopics) {
      let solved = 0;
      const total = subtopic.questions.length;

      for (const question of subtopic.questions) {
        if (question.progress[0]?.status === "solved") solved += 1;
      }

      if (subtopic.isMixedPool) {
        mixedPracticeTodo += total - solved;
        continue;
      }

      topicSolved += solved;
      topicTotal += total;

      subtopics.push({
        id: subtopic.id,
        slug: subtopic.slug,
        name: subtopic.name,
        description: subtopic.description,
        timeComplexity: subtopic.timeComplexity,
        spaceComplexity: subtopic.spaceComplexity,
        bestFor: subtopic.bestFor,
        solved,
        total,
      });
    }

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
      mixedPractice: { todoCount: mixedPracticeTodo },
    };
  });

export interface MixedPracticeQuestion {
  id: string;
  slug: string;
  title: string;
  leetcodeNumber: number | null;
  url: string | null;
  difficulty: Difficulty;
  subtopicSlug: string;
  status: QuestionStatus;
}

export interface MixedPracticeQueue {
  topic: { slug: string; name: string };
  questions: MixedPracticeQuestion[];
}

const DIFFICULTY_ORDER: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };

/**
 * A standalone pool of questions for the topic that don't appear in any of
 * its subtopics — e.g. Graphs' mixed practice is its own set of graph
 * problems, disjoint from anything already seen under BFS, DFS, Dijkstra,
 * etc. Only not-yet-solved questions from that pool are returned, sorted
 * easiest to hardest.
 */
export const $getMixedPracticeQueue = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(getTopicDetailInput)
  .handler(async ({ context, data }): Promise<MixedPracticeQueue | null> => {
    const userId = context.user.id;

    const topic = await db.query.topic.findFirst({
      where: { slug: data.topicSlug },
      columns: { slug: true, name: true },
      with: {
        subtopics: {
          where: { isMixedPool: true },
          columns: { slug: true },
          with: {
            questions: {
              orderBy: { sortOrder: "asc" },
              with: {
                progress: { where: { userId }, columns: { status: true } },
              },
            },
          },
        },
      },
    });
    if (!topic) return null;

    const poolSubtopic = topic.subtopics[0];

    const questions: MixedPracticeQuestion[] = [];
    if (poolSubtopic) {
      for (const question of poolSubtopic.questions) {
        const status = question.progress[0]?.status ?? "todo";
        if (status === "solved") continue;

        questions.push({
          id: question.id,
          slug: question.slug,
          title: question.title,
          leetcodeNumber: question.leetcodeNumber,
          url: question.url,
          difficulty: question.difficulty,
          subtopicSlug: poolSubtopic.slug,
          status,
        });
      }
    }

    questions.sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);

    return { topic: { slug: topic.slug, name: topic.name }, questions };
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
  questionSlug: string;
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
          where: { slug: { ne: data.subtopicSlug }, isMixedPool: false },
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
          questionSlug: continueCandidate.question.slug,
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
