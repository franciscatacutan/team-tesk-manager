export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const TASK_PRIORITY_STYLES: Record<TaskPriority, string> = {
  HIGH: "bg-red-100 text-red-700 border-red-200",
  MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
  LOW: "bg-green-100 text-green-700 border-green-200",
};

export const TASK_PRIORITY_ORDER: TaskPriority[] = ["HIGH", "MEDIUM", "LOW"];
