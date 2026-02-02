import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "./task.service";

/*
 * Custom hook for update task
 */
export const useUpdateTask = (projectId: number, taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      title?: string;
      description?: string;
      status?: string | null;
      assignedUserId?: number | null;
    }) => updateTask(projectId, taskId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
