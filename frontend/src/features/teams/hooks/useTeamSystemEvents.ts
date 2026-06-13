import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getTeamSystemEvents } from "../api/teamApi";

export const useTeamSystemEvents = (
  teamId: string,
  params: {
    page?: number;
    size?: number;
    sort?: string;
  },
) => {
  return useQuery({
    queryKey: [
      "team-system-events",
      teamId,
      params.page,
      params.size,
      params.sort,
    ],
    queryFn: () => getTeamSystemEvents(teamId, params),
    enabled: Boolean(teamId),
    placeholderData: keepPreviousData,
  });
};
