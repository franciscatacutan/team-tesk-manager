import { apiClient } from "../../../api/apiClients";
import type { BaseQueryParams } from "../../../common/types/baseQuery.types";
import type { PageResponse } from "../../../common/types/pageResponse.types";
import type { DeletedFilter } from "../../../common/types/deletedFilter.types";
import type {
  Team,
  TeamActivity,
  TeamMe,
  TeamMember,
} from "../types/team.type";
import type { TeamInsights } from "../types/teamInsights.types";

export const getTeams = async (
  params: BaseQueryParams & {
    deletedFilter: DeletedFilter;
  },
): Promise<PageResponse<Team>> => {
  const response = await apiClient.get(`/teams`, { params });
  return response.data;
};

export const getAllTeams = async (
  params: Pick<BaseQueryParams, "page" | "size"> & {
    deletedFilter: DeletedFilter;
  },
): Promise<PageResponse<Team>> => {
  const response = await apiClient.get(`/teams`, { params });
  return response.data;
};

export const getTeamActivities = async (
  teamId: string,
  params: BaseQueryParams,
): Promise<PageResponse<TeamActivity>> => {
  const res = await apiClient.get(`/teams/${teamId}/activities`, { params });
  return res.data;
};

export const createTeam = async (data: {
  name: string;
  description?: string;
}): Promise<Team> => {
  const response = await apiClient.post("/teams", data);
  return response.data;
};

export const getTeamMe = async (teamId: string): Promise<TeamMe> => {
  const response = await apiClient.get(`/teams/${teamId}/me`);
  return response.data;
};

export const getTeam = async (teamId: string): Promise<Team> => {
  const response = await apiClient.get(`/teams/${teamId}`);
  return response.data;
};

export const updateTeam = async (
  teamId: string,
  data: {
    name?: string;
    description?: string;
  },
): Promise<Team> => {
  const response = await apiClient.patch(`/teams/${teamId}`, data);
  return response.data;
};

export const deleteTeam = async (teamId: string): Promise<void> => {
  await apiClient.delete(`/teams/${teamId}`);
};

export const transferTeam = async (
  teamId: string,
  userId: string,
): Promise<TeamMember> => {
  const response = await apiClient.patch(`/teams/${teamId}/transfer/${userId}`);
  return response.data;
};

export const getTeamInsights = async (
  teamId: string,
): Promise<TeamInsights> => {
  const response = await apiClient.get(`/teams/${teamId}/insights/summary`);
  return response.data;
};
