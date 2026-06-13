import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTeamActivities } from "../api/teamApi";

export const useTeamActivities = (
  teamId: string,
  params: {
    page?: number;
    size?: number;
    search?: string;
    sort?: string;
  },
) => {
  return useQuery({
    queryKey: [
      "teamActivity",
      teamId,
      params.page,
      params.size,
      params.search,
      params.sort,
    ],
    queryFn: async () =>
      getTeamActivities(teamId, {
        page: params.page,
        size: params.size,
        search: params.search,
        sort: params.sort,
      }),

    placeholderData: keepPreviousData,
  });
};
