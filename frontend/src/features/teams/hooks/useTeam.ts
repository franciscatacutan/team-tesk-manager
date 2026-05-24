import { useQuery } from "@tanstack/react-query";
import { getTeam } from "../api/teamApi";

export const useTeam = (teamId: string) => {
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: () => getTeam(teamId),
    staleTime: 60_000,

    enabled: Boolean(teamId),
  });
};
