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
import type { Difficulty, QuestionStatus } from "./types";

/**
 * Shared curriculum content (topics, subtopics, question groups, questions).
 * Seeded/managed centrally; not user-owned. Per-user practice state lives in
 * `questionProgress` below.
 */

export const topic = pgTable("topic", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  timeComplexityRange: text("time_complexity_range"),
  spaceComplexityRange: text("space_complexity_range"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const subtopic = pgTable(
  "subtopic",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    topicId: text("topic_id")
      .notNull()
      .references(() => topic.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    timeComplexity: text("time_complexity"),
    spaceComplexity: text("space_complexity"),
    bestFor: text("best_for"),
    // Long-form reference content (core idea, when-to-use, variants, code,
    // common mistakes, ...), authored as markdown and rendered client-side.
    referenceContent: text("reference_content"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("subtopic_topicId_slug_uidx").on(table.topicId, table.slug),
    index("subtopic_topicId_idx").on(table.topicId),
  ],
);

/**
 * Optional grouping of questions within a subtopic (e.g. BFS's
 * Single-Source / Multi-Source / Flood Fill variants). A subtopic with no
 * meaningful variants simply has no groups, and its questions render as one
 * flat list.
 */
export const questionGroup = pgTable(
  "question_group",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    subtopicId: text("subtopic_id")
      .notNull()
      .references(() => subtopic.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("questionGroup_subtopicId_name_uidx").on(table.subtopicId, table.name)],
);

export const question = pgTable(
  "question",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    subtopicId: text("subtopic_id")
      .notNull()
      .references(() => subtopic.id, { onDelete: "cascade" }),
    groupId: text("group_id").references(() => questionGroup.id, { onDelete: "set null" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    leetcodeNumber: integer("leetcode_number"),
    url: text("url"),
    difficulty: text("difficulty").$type<Difficulty>().notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("question_subtopicId_slug_uidx").on(table.subtopicId, table.slug),
    index("question_groupId_idx").on(table.groupId),
  ],
);

/**
 * Per-user practice state for a question: status, the spaced-recall
 * confidence checklist, and personal approach/solution notes. Mixed Recall
 * draws on `status` and `resolvableIn2Weeks` rather than solved-count alone.
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
    questionId: text("question_id")
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),
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
