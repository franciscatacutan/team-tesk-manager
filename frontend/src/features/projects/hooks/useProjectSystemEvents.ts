import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getProjectSystemEvents } from "../api/projectApi";

export const useProjectSystemEvents = (
  teamId: string,
  projectId: string,
  params: {
    page?: number;
    size?: number;
    sort?: string;
  },
) => {
  return useQuery({
    queryKey: [
      "project-system-events",
      teamId,
      projectId,
      params.page,
      params.size,
      params.sort,
    ],
    queryFn: () => getProjectSystemEvents(teamId, projectId, params),
    enabled: Boolean(teamId && projectId),
    placeholderData: keepPreviousData,
  });
};
