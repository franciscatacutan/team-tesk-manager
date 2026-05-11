import { apiClient } from "../../../api/apiClients";
import type { BaseQueryParams } from "../../../common/types/baseQuery.types";
import type { DeletedFilter } from "../../../common/types/deletedFilter.types";
import type {
  ObservabilityAuditLog,
  ObservabilitySystemEvent,
} from "../../../common/types/observability.types";
import type { PageResponse } from "../../../common/types/pageResponse.types";
import type { ProjectInsights } from "../types/projectInsights.types";
import type {
  Project,
  ProjectActivity,
  ProjectStatus,
  UpdateProjectInput,
} from "../types/project.types";

export const getProjects = async (
  teamId: string,
  params: {
    page?: number;
    size?: number;
    search?: string;
    status?: ProjectStatus[];
    all?: boolean;
    sort?: string;
    deletedFilter?: DeletedFilter;
  },
) => {
  const response = await apiClient.get(`/teams/${teamId}/projects`, {
    params: {
      ...params,
      status: params.status?.length ? params.status : undefined,
    },
    paramsSerializer: {
      indexes: null,
    },
  });
  return response.data;
};

export const createProject = async (
  teamId: string,
  data: { name: string; description?: string },
): Promise<Project> => {
  const response = await apiClient.post(`/teams/${teamId}/projects`, data);
  return response.data;
};

export const getProject = async (
  teamId: string,
  projectId: string,
): Promise<Project> => {
  const response = await apiClient.get(
    `/teams/${teamId}/projects/${projectId}`,
  );

  return response.data;
};

export const getProjectActivities = async (
  teamId: string,
  projectId: string,
  params: BaseQueryParams,
): Promise<PageResponse<ProjectActivity>> => {
  const res = await apiClient.get(
    `/teams/${teamId}/projects/${projectId}/activities`,
    { params },
  );
  return res.data;
};

export const getProjectInsights = async (
  teamId: string,
  projectId: string,
): Promise<ProjectInsights> => {
  const response = await apiClient.get(
    `/teams/${teamId}/projects/${projectId}/insights/summary`,
  );
  return response.data;
};

export const getProjectAuditLogs = async (
  teamId: string,
  projectId: string,
  params: Pick<BaseQueryParams, "page" | "size" | "sort">,
): Promise<PageResponse<ObservabilityAuditLog>> => {
  const response = await apiClient.get(
    `/teams/${teamId}/projects/${projectId}/insights/audit-logs`,
    { params },
  );
  return response.data;
};

export const getProjectSystemEvents = async (
  teamId: string,
  projectId: string,
  params: Pick<BaseQueryParams, "page" | "size" | "sort">,
): Promise<PageResponse<ObservabilitySystemEvent>> => {
  const response = await apiClient.get(
    `/teams/${teamId}/projects/${projectId}/insights/system-events`,
    { params },
  );
  return response.data;
};

export const updateProject = async (
  teamId: string,
  projectId: string,
  data: UpdateProjectInput,
): Promise<Project> => {
  const response = await apiClient.patch(
    `/teams/${teamId}/projects/${projectId}`,
    data,
  );
  return response.data;
};

export const updateProjectStatus = async (
  teamId: string,
  projectId: string,
  status: ProjectStatus,
): Promise<Project> => {
  const response = await apiClient.patch(
    `/teams/${teamId}/projects/${projectId}/status`,
    { status },
  );
  return response.data;
};

export const deleteProject = async (teamId: string, projectId: string) => {
  await apiClient.delete(`/teams/${teamId}/projects/${projectId}`);
};
