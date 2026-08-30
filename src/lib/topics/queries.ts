import { queryOptions } from "@tanstack/react-query";

import {
  $getMixedPracticeQueue,
  $getSidebarTopics,
  $getSubtopicDetail,
  $getTopicDetail,
} from "./functions";

export const sidebarTopicsQueryOptions = () =>
  queryOptions({
    queryKey: ["sidebar-topics"],
    queryFn: ({ signal }) => $getSidebarTopics({ signal }),
  });

export const topicDetailQueryOptions = (topicSlug: string) =>
  queryOptions({
    queryKey: ["topic-detail", topicSlug],
    queryFn: ({ signal }) => $getTopicDetail({ data: { topicSlug }, signal }),
  });

export const subtopicDetailQueryOptions = (topicSlug: string, subtopicSlug: string) =>
  queryOptions({
    queryKey: ["subtopic-detail", topicSlug, subtopicSlug],
    queryFn: ({ signal }) => $getSubtopicDetail({ data: { topicSlug, subtopicSlug }, signal }),
  });

export const mixedPracticeQueueQueryOptions = (topicSlug: string) =>
  queryOptions({
    queryKey: ["mixed-practice-queue", topicSlug],
    queryFn: ({ signal }) => $getMixedPracticeQueue({ data: { topicSlug }, signal }),
  });
