import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "./project.service";

/*
 * Custom hook to delete a project.
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: number) => deleteProject(projectId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};
