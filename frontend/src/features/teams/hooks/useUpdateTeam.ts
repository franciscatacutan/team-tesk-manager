import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateTeamInput } from "../types/team.type";
import { updateTeam } from "../api/teamApi";

export function useUpdateTeam(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTeamInput) => updateTeam(teamId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["team", teamId],
      });

      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });

      queryClient.invalidateQueries({
        queryKey: ["teams", "all"],
      });
    },
  });
}
