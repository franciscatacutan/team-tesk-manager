import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getProjectAuditLogs } from "../api/projectApi";

export const useProjectAuditLogs = (
  teamId: string,
  projectId: string,
  params: {
    page?: number;
    size?: number;
    sort?: string;
  },
) => {
  return useQuery({
    queryKey: [
      "project-audit-logs",
      teamId,
      projectId,
      params.page,
      params.size,
      params.sort,
    ],
    queryFn: () => getProjectAuditLogs(teamId, projectId, params),
    enabled: Boolean(teamId && projectId),
    placeholderData: keepPreviousData,
  });
};
