import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "../api/projectApi";

/*
 * Custom hook to create a project.
 */
export const useCreateProject = (teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      createProject(teamId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", teamId],
      });
    },
  });
};
