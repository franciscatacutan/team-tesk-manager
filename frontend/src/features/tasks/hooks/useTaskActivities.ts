import { useQuery, keepPreviousData } from "@tanstack/react-query";

import type { PageResponse } from "../../../common/types/pageResponse.types";
import type { TaskActivity } from "../types/task.types";
import { getTaskActivities } from "../api/taskApi";

interface Params {
  page?: number;
  size?: number;
  sort?: string;
}

export const useTaskActivities = (
  teamId: string,
  projectId: string,
  taskId: string,
  params: Params = {},
) => {
  const { page = 0, size = 10, sort } = params;

  return useQuery<PageResponse<TaskActivity>>({
    queryKey: ["taskActivities", teamId, projectId, taskId, page, size, sort],

    queryFn: () =>
      getTaskActivities(teamId, projectId, taskId, {
        page,
        size,
        sort,
      }),

    placeholderData: keepPreviousData,
  });
};
