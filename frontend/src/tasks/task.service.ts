import { api } from "../api/axios";
import type { Task, TaskStatus } from "./task.types";

/*
 * Fetch all tasks for a specific project.
 */
export const getTasksByProject = async (projectId: number): Promise<Task[]> => {
  const { data } = await api.get<Task[]>(`/projects/${projectId}/tasks`);
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
  );

  return data;
};

// Update Task
export const updateTask = async (
  projectId: number,
  taskId: number,
  payload: {
    name?: string;
    description?: string;
    status?: string | null;
    assignedUserId?: number | null;
  },
) => {
  const { data } = await api.patch(
    `/projects/${projectId}/tasks/${taskId}`,
    payload,
  );
  return data;
};

// Delete a task within a specific project
export const deleteTask = async (
  projectId: number,
  taskId: number,
): Promise<void> => {
  await api.delete(`/projects/${projectId}/tasks/${taskId}`);
};
