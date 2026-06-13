import { z } from "zod";

export const createTaskSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().optional(),

    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),

    assigneeId: z.string().min(1, "Assignee is required"),
    supportId: z.string().optional(),

    plannedStartDate: z.string().min(1, "Start date is required"),
    plannedDueDate: z.string().min(1, "Due date is required"),
  })
  .refine(
    (data) => {
      if (!data.plannedStartDate || !data.plannedDueDate) return true;

      return new Date(data.plannedStartDate) <= new Date(data.plannedDueDate);
    },
    {
      message: "Due date must be after start date",
      path: ["plannedDueDate"],
    },
  );

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
