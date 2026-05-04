import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { PageResponse } from "../../../common/types/pageResponse.types";
import { getTasks } from "../api/taskApi";
import type { DeletedFilter } from "../../../common/types/deletedFilter.types";
import type { Task } from "../types/task.types";
import type { TaskStatus } from "../utils/task.constants";

export const useTasks = (
  teamId: string,
  projectId: string,
  params: {
    page: number;
    size: number;
    search?: string;
    status?: TaskStatus[];
    sort?: string;
    statusFilter?: TaskStatus[];
    deletedFilter: DeletedFilter;
  },
) => {
  return useQuery<PageResponse<Task>>({
    queryKey: [
      "tasks",
      teamId,
      projectId,
      params.page,
      params.size,
      params.search,
      params.status,
      params.statusFilter,
      params.sort,
      params.deletedFilter,
    ],

    queryFn: () =>
      getTasks(teamId, projectId, {
        page: params.page,
        size: params.size,
        search: params.search,
        statuses: params.statusFilter,
        sort: params.sort,
        deletedFilter: params.deletedFilter,
      }),
    placeholderData: keepPreviousData,
  });
};
