import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProjects } from "../api/projectApi";
import type { Project } from "../types/project.types";
import type { PageResponse } from "../../../common/types/pageResponse.types";
import type { DeletedFilter } from "../../../common/types/deletedFilter.types";
import type { ProjectStatus } from "../utils/project.constants";

export const useProjects = (
  teamId: string,
  params: {
    page: number;
    size: number;
    search?: string;
    status?: ProjectStatus[];
    sort?: string;
    statusFilter?: ProjectStatus[];
    deletedFilter: DeletedFilter;
  },
) => {
  return useQuery<PageResponse<Project>>({
    queryKey: [
      "projects",
      teamId,
      params.page,
      params.size,
      params.search,
      params.status,
      params.statusFilter,
      params.sort,
      params.deletedFilter,
    ],
    queryFn: () =>
      getProjects(teamId, {
        page: params.page,
        size: params.size,
        search: params.search,
        status: params.status ?? params.statusFilter,
        sort: params.sort,
        deletedFilter: params.deletedFilter,
      }),
    placeholderData: keepPreviousData,
  });
};
