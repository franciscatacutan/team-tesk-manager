import { api } from "../api/axios";
import type { Project } from "./project.types";

// Retrieve the token from local storage
const token = localStorage.getItem("token");

/*
 * Fetch all projects.
 */
export const getProjects = async (): Promise<Project[]> => {
  const { data } = await api.get("/projects", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
