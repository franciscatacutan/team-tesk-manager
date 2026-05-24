import { useQuery } from "@tanstack/react-query";
import type { PageResponse } from "../../../common/types/pageResponse.types";
import type { User } from "../../users/types/userType";
import { getAvailableUsers } from "../api/teamMemberApi";

interface Params {
  search?: string;
}

export const useAvailableUsers = (teamId: string, params: Params) => {
  return useQuery<PageResponse<User>>({
    queryKey: ["availableUsers", teamId, params?.search],
    queryFn: async () =>
      getAvailableUsers(teamId, {
        search: params?.search,
        size: 1000,
      }),
    staleTime: 1000 * 60 * 5,
  });
};
