import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProjectActivities } from "../api/projectApi";

export const useProjectActivity = (
  teamId: string,
  projectId: string,
  params: {
    page?: number;
    size?: number;
    search?: string;
    sort?: string;
  },
) => {
  return useQuery({
    queryKey: [
      "projectActivities",
      teamId,
      projectId,
      params.page,
      params.size,
      params.search,
      params.sort,
    ],
    queryFn: async () =>
      getProjectActivities(teamId, projectId, {
        page: params.page,
        size: params.size,
        search: params.search,
        sort: params.sort,
      }),

    placeholderData: keepPreviousData,
  });
};
