import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transferTeam } from "../api/teamApi";

export function useTransferOwnership(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => transferTeam(teamId, userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teamMembers", teamId],
      });

      queryClient.invalidateQueries({
        queryKey: ["team", teamId],
      });
    },
  });
}
