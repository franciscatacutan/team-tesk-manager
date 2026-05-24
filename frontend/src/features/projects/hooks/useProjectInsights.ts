import { useQuery } from "@tanstack/react-query";

import { getProjectInsights } from "../api/projectApi";

export const useProjectInsights = (teamId: string, projectId: string) => {
  return useQuery({
    queryKey: ["project-insights", teamId, projectId],
    queryFn: () => getProjectInsights(teamId, projectId),
    enabled: Boolean(teamId && projectId),
  });
};
