import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";

/*
 * Custom hook for update task
 */
export const useUpdateTask = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      title?: string | null;
      description?: string | null;
      status?: string | null;
      assignedUserId?: number | null;
    }) => api.put(`/tasks/${taskId}`, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
