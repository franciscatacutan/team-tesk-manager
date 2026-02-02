import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "./task.service";

/*
 * Custom hook to delete a within a project.
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      taskId,
    }: {
      projectId: number;
      taskId: number;
    }) => deleteTask(projectId, taskId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
};
