import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters"),
  description: z.string().optional(),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
