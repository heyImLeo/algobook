ALTER TABLE "question" DROP CONSTRAINT "question_subtopic_id_subtopic_id_fkey";--> statement-breakpoint
ALTER TABLE "question" DROP CONSTRAINT "question_group_id_question_group_id_fkey";--> statement-breakpoint
ALTER TABLE "question_group" DROP CONSTRAINT "question_group_subtopic_id_subtopic_id_fkey";--> statement-breakpoint
ALTER TABLE "subtopic" DROP CONSTRAINT "subtopic_topic_id_topic_id_fkey";--> statement-breakpoint
DROP TABLE "question";--> statement-breakpoint
DROP TABLE "question_group";--> statement-breakpoint
DROP TABLE "subtopic";--> statement-breakpoint
DROP TABLE "topic";