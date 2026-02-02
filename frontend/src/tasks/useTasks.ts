import { useQuery } from "@tanstack/react-query";
import { getTasksByProject } from "./task.service";

/*
 * Custom hook to fetch tasks for a specific project.
 */
export const useTasks = (projectId: number) => {
  return useQuery({
    // Unique query key based on project ID
    queryKey: ["tasks", projectId],
    // query function to fetch tasks by project ID
    queryFn: () => getTasksByProject(projectId),
  });
};
