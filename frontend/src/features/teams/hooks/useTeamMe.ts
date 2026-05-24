import { useQuery } from "@tanstack/react-query";
import { getTeamMe } from "../api/teamApi";

export function useTeamMe(teamId: string) {
  return useQuery({
    queryKey: ["team-me", teamId],
    queryFn: () => getTeamMe(teamId),
    staleTime: 1000 * 60 * 10,
    enabled: !!teamId,
  });
}
