import { useQuery } from "@tanstack/react-query";
import { getProject } from "../api/projectApi";

export const useProject = (teamId: string, projectId: string) => {
  return useQuery({
    queryKey: ["project", teamId, projectId],
    queryFn: () => getProject(teamId, projectId),
  });
};
