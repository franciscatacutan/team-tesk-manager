import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTaskComment } from "../api/taskApi";

export const useCreateTaskComment = (
  teamId: string,
  projectId: string,
  taskId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (message: string) =>
      createTaskComment(teamId, projectId, taskId, message),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taskActivities", teamId, projectId, taskId],
      });

      queryClient.invalidateQueries({
        queryKey: ["projectActivities", teamId, projectId],
      });
    },
  });
};
