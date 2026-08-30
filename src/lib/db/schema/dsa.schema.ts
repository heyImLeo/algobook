import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { user } from "./auth.schema";
import type { QuestionStatus } from "./types";

/**
 * Per-user practice state for a question: status, the spaced-recall
 * confidence checklist, and personal approach/solution notes. Mixed Recall
 * draws on `status` and `resolvableIn2Weeks` rather than solved-count alone.
 *
 * The curriculum itself (topics/subtopics/questions) is static content in
 * src/lib/curriculum/content.ts, not a DB table — `questionId` below is a
 * stable string id (`${topicSlug}/${subtopicSlug}/${questionSlug}`) into
 * that content, not a real foreign key.
 */
export const questionProgress = pgTable(
  "question_progress",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    questionId: text("question_id").notNull(),
    status: text("status").$type<QuestionStatus>().notNull().default("todo"),
    solvedWithoutHint: boolean("solved_without_hint").notNull().default(false),
    understoodFully: boolean("understood_fully").notNull().default(false),
    resolvableIn2Weeks: boolean("resolvable_in_2_weeks").notNull().default(false),
    approachNotes: text("approach_notes"),
    solutionCode: text("solution_code"),
    timeTakenMinutes: integer("time_taken_minutes"),
    lastPracticedAt: timestamp("last_practiced_at"),
    solvedAt: timestamp("solved_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("questionProgress_userId_questionId_uidx").on(table.userId, table.questionId),
    index("questionProgress_userId_idx").on(table.userId),
    index("questionProgress_questionId_idx").on(table.questionId),
  ],
);
