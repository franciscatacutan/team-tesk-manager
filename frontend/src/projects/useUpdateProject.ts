import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "./project.service";

/*
 * Custom hook to update a project.
 */
export const useUpdateProject = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name?: string; description?: string }) =>
      updateProject(projectId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};
