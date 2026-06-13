import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTeam } from "../api/teamApi";

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: string) => deleteTeam(teamId),

    onSuccess: (_, teamId) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });

      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
    },
  });
}
