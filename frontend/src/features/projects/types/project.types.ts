export type ProjectStatus = "ACTIVE" | "ON_HOLD" | "COMPLETED";

export type Project = {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  owner: User;
  createdBy: User;
  lastActivityAt: string;
  plannedStartDate?: string;
  plannedDueDate?: string;
  actualStartDate?: string;
  actualCompletionDate?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

type Task = {
  id: string;
  title: string;
};

export type ProjectActivity = {
  id: string;
  message: string;
  user: User;
  task: Task;
  createdAt: string;
};

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  plannedStartDate?: string;
  plannedDueDate?: string;
}
