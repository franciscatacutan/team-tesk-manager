import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateTaskInput } from "../types/task.types";
import { updateTask } from "../api/taskApi";

export function useUpdateTask(
  teamId: string,
  projectId: string,
  taskId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTaskInput) =>
      updateTask(teamId, projectId, taskId, data),

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
}
