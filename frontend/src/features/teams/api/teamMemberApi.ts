import { apiClient } from "../../../api/apiClients";
import type { BaseQueryParams } from "../../../common/types/baseQuery.types";
import type { PageResponse } from "../../../common/types/pageResponse.types";
import type { User } from "../../users/types/userType";
import type {
  AddMembersInput,
  RemoveMembersInput,
  TeamMember,
} from "../types/team.type";

export const getTeamMembers = async (
  teamId: string,
  params: BaseQueryParams,
): Promise<PageResponse<TeamMember>> => {
  const response = await apiClient.get(`/teams/${teamId}/members`, { params });
  return response.data;
};

export const getAvailableUsers = async (
  teamId: string,
  params: Pick<BaseQueryParams, "search" | "size">,
): Promise<PageResponse<User>> => {
  const response = await apiClient.get(`/teams/${teamId}/available-users`, {
    params,
  });
  return response.data;
};

export const addMembers = async (
  teamId: string,
  data: AddMembersInput,
): Promise<TeamMember> => {
  const res = await apiClient.post(`/teams/${teamId}/members`, data);

  return res.data;
};

export const removeMembers = async (
  teamId: string,
  data: RemoveMembersInput,
): Promise<void> => {
  await apiClient.delete(`/teams/${teamId}/members`, { data });
};

export const updateMemberRole = async (
  teamId: string,
  userId: string,
  role: "ADMIN" | "MEMBER",
): Promise<TeamMember> => {
  const res = await apiClient.patch(`/teams/${teamId}/members/${userId}/role`, {
    role,
  });

  return res.data;
};
