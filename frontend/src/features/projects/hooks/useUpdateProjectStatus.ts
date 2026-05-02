import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProjectStatus } from "../api/projectApi";
import type { ProjectStatus } from "../utils/project.constants";

export function useUpdateProjectStatus(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      status,
    }: {
      projectId: string;
      status: ProjectStatus;
    }) => updateProjectStatus(teamId, projectId, status),

    onSuccess: (project) => {
      queryClient.invalidateQueries({
        queryKey: ["project", teamId, project.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", teamId],
      });
    },
  });
}
