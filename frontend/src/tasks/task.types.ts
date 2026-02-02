export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

/*
 * Represents a task within a project.
 */
export type Task = {
  id: number;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assignedUser?: UserSummary | null;
};

/*
 * Summary information about a user.
 */
export type UserSummary = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};
