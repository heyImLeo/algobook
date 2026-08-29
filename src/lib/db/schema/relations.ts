import { defineRelations } from "drizzle-orm";

import * as schema from "./";

export const relations = defineRelations(schema, (r) => ({
  topic: {
    subtopics: r.many.subtopic({
      from: r.topic.id,
      to: r.subtopic.topicId,
    }),
  },
  subtopic: {
    topic: r.one.topic({
      from: r.subtopic.topicId,
      to: r.topic.id,
    }),
    groups: r.many.questionGroup({
      from: r.subtopic.id,
      to: r.questionGroup.subtopicId,
    }),
    questions: r.many.question({
      from: r.subtopic.id,
      to: r.question.subtopicId,
    }),
  },
  questionGroup: {
    subtopic: r.one.subtopic({
      from: r.questionGroup.subtopicId,
      to: r.subtopic.id,
    }),
    questions: r.many.question({
      from: r.questionGroup.id,
      to: r.question.groupId,
    }),
  },
  question: {
    subtopic: r.one.subtopic({
      from: r.question.subtopicId,
      to: r.subtopic.id,
    }),
    group: r.one.questionGroup({
      from: r.question.groupId,
      to: r.questionGroup.id,
    }),
    progress: r.many.questionProgress({
      from: r.question.id,
      to: r.questionProgress.questionId,
    }),
  },
  questionProgress: {
    question: r.one.question({
      from: r.questionProgress.questionId,
      to: r.question.id,
    }),
    user: r.one.user({
      from: r.questionProgress.userId,
      to: r.user.id,
    }),
  },
}));
