import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProjects } from "../api/projectApi";
import type { Project } from "../types/project.types";
import type { PageResponse } from "../../../common/types/pageResponse.types";

import type { ProjectSearchParams } from "../types/project.requests";

export const useProjects = (
  teamId: string,
  params: ProjectSearchParams = {},
) => {
  return useQuery<PageResponse<Project>>({
    queryKey: ["projects", teamId, params],
    queryFn: () => getProjects(teamId, params),
    enabled: Boolean(teamId),
    placeholderData: keepPreviousData,
  });
};
