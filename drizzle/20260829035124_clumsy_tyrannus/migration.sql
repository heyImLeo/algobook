CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"issuer" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question" (
	"id" text PRIMARY KEY,
	"subtopic_id" text NOT NULL,
	"group_id" text,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"leetcode_number" integer,
	"url" text,
	"difficulty" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_group" (
	"id" text PRIMARY KEY,
	"subtopic_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_progress" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"question_id" text NOT NULL,
	"status" text DEFAULT 'todo' NOT NULL,
	"solved_without_hint" boolean DEFAULT false NOT NULL,
	"understood_fully" boolean DEFAULT false NOT NULL,
	"resolvable_in_2_weeks" boolean DEFAULT false NOT NULL,
	"approach_notes" text,
	"solution_code" text,
	"time_taken_minutes" integer,
	"last_practiced_at" timestamp,
	"solved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subtopic" (
	"id" text PRIMARY KEY,
	"topic_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"time_complexity" text,
	"space_complexity" text,
	"best_for" text,
	"reference_content" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topic" (
	"id" text PRIMARY KEY,
	"slug" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"time_complexity_range" text,
	"space_complexity_range" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "account_issuer_accountId_uidx" ON "account" ("issuer","account_id");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "question_subtopicId_slug_uidx" ON "question" ("subtopic_id","slug");--> statement-breakpoint
CREATE INDEX "question_groupId_idx" ON "question" ("group_id");--> statement-breakpoint
CREATE UNIQUE INDEX "questionGroup_subtopicId_name_uidx" ON "question_group" ("subtopic_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "questionProgress_userId_questionId_uidx" ON "question_progress" ("user_id","question_id");--> statement-breakpoint
CREATE INDEX "questionProgress_userId_idx" ON "question_progress" ("user_id");--> statement-breakpoint
CREATE INDEX "questionProgress_questionId_idx" ON "question_progress" ("question_id");--> statement-breakpoint
CREATE UNIQUE INDEX "subtopic_topicId_slug_uidx" ON "subtopic" ("topic_id","slug");--> statement-breakpoint
CREATE INDEX "subtopic_topicId_idx" ON "subtopic" ("topic_id");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "question" ADD CONSTRAINT "question_subtopic_id_subtopic_id_fkey" FOREIGN KEY ("subtopic_id") REFERENCES "subtopic"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "question" ADD CONSTRAINT "question_group_id_question_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "question_group"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "question_group" ADD CONSTRAINT "question_group_subtopic_id_subtopic_id_fkey" FOREIGN KEY ("subtopic_id") REFERENCES "subtopic"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "question_progress" ADD CONSTRAINT "question_progress_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "question_progress" ADD CONSTRAINT "question_progress_question_id_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "subtopic" ADD CONSTRAINT "subtopic_topic_id_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE CASCADE;