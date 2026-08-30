import { queryOptions } from "@tanstack/react-query";

import { $getStudyPlanProgress } from "./functions";

export const studyPlanProgressQueryOptions = () =>
  queryOptions({
    queryKey: ["study-plan-progress"],
    queryFn: ({ signal }) => $getStudyPlanProgress({ signal }),
  });
