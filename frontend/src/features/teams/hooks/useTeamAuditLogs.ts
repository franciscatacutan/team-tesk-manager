import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getTeamAuditLogs } from "../api/teamApi";

export const useTeamAuditLogs = (
  teamId: string,
  params: {
    page?: number;
    size?: number;
    sort?: string;
  },
) => {
  return useQuery({
    queryKey: ["team-audit-logs", teamId, params.page, params.size, params.sort],
    queryFn: () => getTeamAuditLogs(teamId, params),
    enabled: Boolean(teamId),
    placeholderData: keepPreviousData,
  });
};
