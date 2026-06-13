import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignUser } from "../api/taskApi";

export const useAssignUser = (
  teamId: string,
  projectId: string,
  taskId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      assignUser(teamId, projectId, taskId, userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task", teamId, projectId, taskId],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", teamId, projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", "infinite", teamId, projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["taskActivities", teamId, projectId, taskId],
      });

      queryClient.invalidateQueries({
        queryKey: ["projectActivity", teamId, projectId],
      });
    },
  });
};
