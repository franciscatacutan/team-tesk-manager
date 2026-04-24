import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { PageResponse } from "../../../common/types/pageResponse.types";
import { getTeamMembers } from "../api/teamMemberApi";
import type { TeamMember, TeamRole } from "../types/team.type";

interface Params {
  page: number;
  size?: number;
  search?: string;
  sort?: string;
  role?: TeamRole[];
}

export const useTeamMembers = (teamId: string, params?: Params) => {
  return useQuery<PageResponse<TeamMember>>({
    queryKey: [
      "teamMembers",
      teamId,
      params?.page,
      params?.size,
      params?.search,
      params?.sort,
      params?.role,
    ],
    queryFn: () =>
      getTeamMembers(teamId, {
        page: params?.page,
        size: params?.size,
        search: params?.search,
        sort: params?.sort,
        role: params?.role,
      }),
    placeholderData: keepPreviousData,
  });
};
