import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMembers } from "../api/teamMemberApi";

export const useAddMembers = (teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      members: { userId: string; role: "ADMIN" | "MEMBER" }[];
    }) => addMembers(teamId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teamMembers", teamId],
      });
      queryClient.invalidateQueries({
        queryKey: ["allTeamMembers", teamId],
      });
      queryClient.invalidateQueries({
        queryKey: ["availableUsers", teamId],
      });
      queryClient.invalidateQueries({
        queryKey: ["team", teamId],
      });
      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
    },
  });
};
