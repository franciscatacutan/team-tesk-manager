import { api } from "../api/axios";
import type { Project } from "./project.types";

// Retrieve the token from local storage
const token = localStorage.getItem("token");

//  * Fetch all projects.
export const getProjects = async (): Promise<Project[]> => {
  const { data } = await api.get("/projects", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// Fetch project by ID
export const getProjectById = async (projectId: number) => {
  const { data } = await api.get(`/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// Create Project
export const createProject = async (payload: {
  name: string;
  description?: string;
}): Promise<Project> => {
  const { data } = await api.post("/projects", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
