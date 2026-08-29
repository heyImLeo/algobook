import { queryOptions } from "@tanstack/react-query";

import { $getQuestionDetail } from "./functions";

export const questionDetailQueryOptions = (
  topicSlug: string,
  subtopicSlug: string,
  questionSlug: string,
) =>
  queryOptions({
    queryKey: ["question-detail", topicSlug, subtopicSlug, questionSlug],
    queryFn: ({ signal }) =>
      $getQuestionDetail({ data: { topicSlug, subtopicSlug, questionSlug }, signal }),
  });
