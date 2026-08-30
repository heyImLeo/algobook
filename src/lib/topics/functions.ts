import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { authMiddleware } from "#/lib/auth/middleware.ts";
import { CURRICULUM, TOPIC_BY_SLUG } from "#/lib/curriculum/content.ts";
import { db } from "#/lib/db/index.ts";
import type { Difficulty, QuestionStatus } from "#/lib/db/schema/types.ts";

async function getSolvedQuestionIds(userId: string): Promise<Set<string>> {
  const rows = await db.query.questionProgress.findMany({
    where: { userId, status: "solved" },
    columns: { questionId: true },
  });
  return new Set(rows.map((row) => row.questionId));
}

async function getProgressByQuestionId(
  userId: string,
): Promise<
  Map<string, { status: QuestionStatus; resolvableIn2Weeks: boolean; lastPracticedAt: Date | null }>
> {
  const rows = await db.query.questionProgress.findMany({
    where: { userId },
    columns: { questionId: true, status: true, resolvableIn2Weeks: true, lastPracticedAt: true },
  });
  return new Map(rows.map((row) => [row.questionId, row]));
}

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
    const solvedIds = await getSolvedQuestionIds(context.user.id);

    return CURRICULUM.map((topic) => {
      let solved = 0;
      let total = 0;
      for (const subtopic of topic.subtopics) {
        if (subtopic.isMixedPool) continue;
        for (const question of subtopic.allQuestions) {
          total += 1;
          if (solvedIds.has(question.id)) solved += 1;
        }
      }
      return {
        id: topic.slug,
        slug: topic.slug,
        name: topic.name,
        icon: topic.icon,
        solved,
        total,
      };
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
    const topic = TOPIC_BY_SLUG.get(data.topicSlug);
    if (!topic) return null;

    const solvedIds = await getSolvedQuestionIds(context.user.id);

    let topicSolved = 0;
    let topicTotal = 0;
    let mixedPracticeTodo = 0;

    const subtopics: TopicSubtopicSummary[] = [];

    for (const subtopic of topic.subtopics) {
      let solved = 0;
      const total = subtopic.allQuestions.length;

      for (const question of subtopic.allQuestions) {
        if (solvedIds.has(question.id)) solved += 1;
      }

      if (subtopic.isMixedPool) {
        mixedPracticeTodo += total - solved;
        continue;
      }

      topicSolved += solved;
      topicTotal += total;

      subtopics.push({
        id: subtopic.slug,
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
      id: topic.slug,
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
    const topic = TOPIC_BY_SLUG.get(data.topicSlug);
    if (!topic) return null;

    const poolSubtopic = topic.subtopics.find((subtopic) => subtopic.isMixedPool);

    const questions: MixedPracticeQuestion[] = [];
    if (poolSubtopic) {
      const progressByQuestionId = await getProgressByQuestionId(context.user.id);

      for (const question of poolSubtopic.allQuestions) {
        const status = progressByQuestionId.get(question.id)?.status ?? "todo";
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
    const topic = TOPIC_BY_SLUG.get(data.topicSlug);
    if (!topic) return null;

    const subtopic = topic.subtopics.find((s) => s.slug === data.subtopicSlug);
    if (!subtopic) return null;

    const progressByQuestionId = await getProgressByQuestionId(context.user.id);

    const toPublicQuestion = (
      question: (typeof subtopic.allQuestions)[number],
    ): SubtopicQuestion => {
      const progress = progressByQuestionId.get(question.id);
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
      id: group.name,
      name: group.name,
      description: group.description,
      questions: group.questions.map(toPublicQuestion),
    }));

    const questions = subtopic.ungroupedQuestions.map(toPublicQuestion);

    const allQuestions = [...groups.flatMap((group) => group.questions), ...questions];
    const solved = allQuestions.filter((question) => question.status === "solved").length;
    const attempted = allQuestions.filter((question) => question.status === "attempted").length;

    const rawQuestionsWithGroup = [
      ...subtopic.groups.flatMap((group) =>
        group.questions.map((question) => ({ question, groupName: group.name as string | null })),
      ),
      ...subtopic.ungroupedQuestions.map((question) => ({
        question,
        groupName: null as string | null,
      })),
    ];

    const continueCandidate = rawQuestionsWithGroup
      .filter(({ question }) => progressByQuestionId.get(question.id)?.status === "attempted")
      .sort((a, b) => {
        const aTime = progressByQuestionId.get(a.question.id)?.lastPracticedAt?.getTime() ?? 0;
        const bTime = progressByQuestionId.get(b.question.id)?.lastPracticedAt?.getTime() ?? 0;
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

    const relatedSubtopics: RelatedSubtopic[] = topic.subtopics
      .filter((s) => s.slug !== data.subtopicSlug && !s.isMixedPool)
      .slice(0, 2)
      .map((s) => ({ slug: s.slug, name: s.name, description: s.description }));

    return {
      topic: { slug: topic.slug, name: topic.name, icon: topic.icon },
      id: subtopic.slug,
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
      relatedSubtopics,
    };
  });
