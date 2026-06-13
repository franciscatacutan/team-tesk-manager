import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "../api/projectApi";

export function useDeleteProject(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(teamId, projectId),

    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });
}
