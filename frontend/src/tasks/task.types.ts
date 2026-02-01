export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

/*
 * Represents a task within a project.
 */
export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
};
