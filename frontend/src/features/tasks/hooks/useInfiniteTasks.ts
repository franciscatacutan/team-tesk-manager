import { useInfiniteQuery } from "@tanstack/react-query";
import type { DeletedFilter } from "../../../common/types/deletedFilter.types";
import type { Task } from "../types/task.types";
import { getTasks } from "../api/taskApi";
import type { PageResponse } from "../../../common/types/pageResponse.types";

export const useInfiniteTasks = (
  teamId: string,
  projectId: string,
  status: string,
  params: {
    search?: string;
    status?: string;
    sort?: string;
    deletedFilter: DeletedFilter;
  },
) => {
  return useInfiniteQuery<PageResponse<Task>>({
    queryKey: [
      "tasks",
      "infinite",
      teamId,
      projectId,
      status,
      params.search,
      params.sort,
      params.deletedFilter,
    ],

    queryFn: ({ pageParam }) => {
      const page = (pageParam ?? 0) as number;

      return getTasks(teamId, projectId, {
        page,
        size: 10,
        status,
        search: params.search,
        sort: params.sort,
        deletedFilter: params.deletedFilter,
      });
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.page + 1;
    },
  });
};
