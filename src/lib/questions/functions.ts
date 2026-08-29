import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { authMiddleware, freshAuthMiddleware } from "#/lib/auth/middleware.ts";
import { db } from "#/lib/db/index.ts";
import { questionProgress } from "#/lib/db/schema/dsa.schema.ts";
import type { Difficulty, QuestionStatus } from "#/lib/db/schema/types.ts";

export interface QuestionDetail {
  id: string;
  slug: string;
  title: string;
  leetcodeNumber: number | null;
  url: string | null;
  difficulty: Difficulty;
  groupName: string | null;
  topic: { slug: string; name: string };
  subtopic: { slug: string; name: string };
  status: QuestionStatus;
  solvedWithoutHint: boolean;
  understoodFully: boolean;
  resolvableIn2Weeks: boolean;
  approachNotes: string | null;
  solutionCode: string | null;
  timeTakenMinutes: number | null;
  solvedAt: string | null;
  lastPracticedAt: string | null;
}

const getQuestionDetailInput = z.object({
  topicSlug: z.string(),
  subtopicSlug: z.string(),
  questionSlug: z.string(),
});

export const $getQuestionDetail = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(getQuestionDetailInput)
  .handler(async ({ context, data }): Promise<QuestionDetail | null> => {
    const userId = context.user.id;

    const question = await db.query.question.findFirst({
      where: {
        slug: data.questionSlug,
        subtopic: { slug: data.subtopicSlug, topic: { slug: data.topicSlug } },
      },
      with: {
        subtopic: {
          columns: { slug: true, name: true },
          with: { topic: { columns: { slug: true, name: true } } },
        },
        group: { columns: { name: true } },
        progress: { where: { userId } },
      },
    });
    if (!question?.subtopic?.topic) return null;

    const progress = question.progress[0];

    return {
      id: question.id,
      slug: question.slug,
      title: question.title,
      leetcodeNumber: question.leetcodeNumber,
      url: question.url,
      difficulty: question.difficulty,
      groupName: question.group?.name ?? null,
      topic: question.subtopic.topic,
      subtopic: { slug: question.subtopic.slug, name: question.subtopic.name },
      status: progress?.status ?? "todo",
      solvedWithoutHint: progress?.solvedWithoutHint ?? false,
      understoodFully: progress?.understoodFully ?? false,
      resolvableIn2Weeks: progress?.resolvableIn2Weeks ?? false,
      approachNotes: progress?.approachNotes ?? null,
      solutionCode: progress?.solutionCode ?? null,
      timeTakenMinutes: progress?.timeTakenMinutes ?? null,
      solvedAt: progress?.solvedAt ? progress.solvedAt.toISOString() : null,
      lastPracticedAt: progress?.lastPracticedAt ? progress.lastPracticedAt.toISOString() : null,
    };
  });

const updateQuestionProgressInput = z.object({
  questionId: z.string(),
  status: z.enum(["todo", "attempted", "solved"]).optional(),
  solvedWithoutHint: z.boolean().optional(),
  understoodFully: z.boolean().optional(),
  resolvableIn2Weeks: z.boolean().optional(),
  approachNotes: z.string().nullable().optional(),
  solutionCode: z.string().nullable().optional(),
  timeTakenMinutes: z.number().int().positive().nullable().optional(),
});

export type UpdateQuestionProgressInput = z.infer<typeof updateQuestionProgressInput>;

export const $updateQuestionProgress = createServerFn({ method: "POST" })
  .middleware([freshAuthMiddleware])
  .validator(updateQuestionProgressInput)
  .handler(async ({ context, data }) => {
    const userId = context.user.id;
    const now = new Date();

    const values = {
      userId,
      questionId: data.questionId,
      lastPracticedAt: now,
      ...(data.status !== undefined && { status: data.status }),
      ...(data.status === "solved" && { solvedAt: now }),
      ...(data.solvedWithoutHint !== undefined && { solvedWithoutHint: data.solvedWithoutHint }),
      ...(data.understoodFully !== undefined && { understoodFully: data.understoodFully }),
      ...(data.resolvableIn2Weeks !== undefined && {
        resolvableIn2Weeks: data.resolvableIn2Weeks,
      }),
      ...(data.approachNotes !== undefined && { approachNotes: data.approachNotes }),
      ...(data.solutionCode !== undefined && { solutionCode: data.solutionCode }),
      ...(data.timeTakenMinutes !== undefined && { timeTakenMinutes: data.timeTakenMinutes }),
    };

    await db
      .insert(questionProgress)
      .values(values)
      .onConflictDoUpdate({
        target: [questionProgress.userId, questionProgress.questionId],
        set: values,
      });
  });
