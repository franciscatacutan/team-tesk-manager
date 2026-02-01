import { api } from "../api/axios";
import type { Task, TaskStatus } from "./task.types";

const token = localStorage.getItem("token");

/*
 * Fetch all tasks for a specific project.
 */
export const getTasksByProject = async (projectId: number): Promise<Task[]> => {
  // Retrieve the token from local storage
  const { data } = await api.get<Task[]>(`/projects/${projectId}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// Create a new task within a specific project.
export const createTask = async (
  projectId: number,
  payload: {
    title: string;
    description: string;
    status: TaskStatus;
    assignedUserId?: number | null;
  },
): Promise<Task> => {
  const { data } = await api.post<Task>(
    `/projects/${projectId}/tasks`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};
