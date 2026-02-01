import { api } from "../api/axios";
import type { Task } from "./task.types";

/*
 * Fetch all tasks for a specific project.
 */
export const getTasksByProject = async (projectId: number): Promise<Task[]> => {
  // Retrieve the token from local storage
  const token = localStorage.getItem("token");

  const { data } = await api.get<Task[]>(`/projects/${projectId}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
