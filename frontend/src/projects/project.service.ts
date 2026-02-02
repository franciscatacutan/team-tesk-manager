import { api } from "../api/axios";
import type { Project } from "./project.types";

//  * Fetch all projects.
export const getProjects = async (): Promise<Project[]> => {
  const { data } = await api.get("/projects");
  return data;
};

// Fetch project by ID
export const getProjectById = async (projectId: number) => {
  const { data } = await api.get(`/projects/${projectId}`);
  return data;
};

// Create Project
export const createProject = async (payload: {
  name: string;
  description?: string;
}): Promise<Project> => {
  const { data } = await api.post("/projects", payload);
  return data;
};

// Update Project
export const updateProject = async (
  projectId: number,
  payload: {
    name?: string;
    description?: string;
  },
) => {
  const { data } = await api.patch(`/projects/${projectId}`, payload);
  return data;
};

// Delete Project
export const deleteProject = async (projectId: number): Promise<void> => {
  await api.delete(`/projects/${projectId}`);
};
