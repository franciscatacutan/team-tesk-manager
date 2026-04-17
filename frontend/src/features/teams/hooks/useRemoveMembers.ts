import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMembers } from "../api/teamMemberApi";

export const useRemoveMembers = (teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userIds: string[] }) => removeMembers(teamId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teamMembers", teamId],
      });
      queryClient.invalidateQueries({
        queryKey: ["team", teamId],
      });
    },
  });
};
