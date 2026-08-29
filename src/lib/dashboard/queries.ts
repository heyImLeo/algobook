import { queryOptions } from "@tanstack/react-query";

import { $getDashboardStats } from "./functions";

export const dashboardStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["dashboard-stats"],
    queryFn: ({ signal }) => $getDashboardStats({ signal }),
  });
