import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateProjectInput } from "../types/project.types";
import { updateProject } from "../api/projectApi";

export function useUpdateProject(teamId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProjectInput) =>
      updateProject(teamId, projectId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", teamId, projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", teamId],
      });
    },
  });
}
