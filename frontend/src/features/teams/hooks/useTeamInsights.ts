import { useQuery } from "@tanstack/react-query";
import { getTeamInsights } from "../api/teamApi";

export const useTeamInsights = (teamId: string) => {
  return useQuery({
    queryKey: ["team-insights", teamId],
    queryFn: () => getTeamInsights(teamId),
    enabled: Boolean(teamId),
  });
};
