import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMemberRole } from "../api/teamMemberApi";

export const useUpdateMemberRole = (teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      role,
    }: {
      memberId: string;
      role: "ADMIN" | "MEMBER";
    }) => updateMemberRole(teamId, memberId, role),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teamMembers", teamId],
      });
    },
  });
};
