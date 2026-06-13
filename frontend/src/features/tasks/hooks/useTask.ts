import { useQuery } from "@tanstack/react-query";
import { getTask } from "../api/taskApi";

export const useTask = (teamId: string, projectId: string, taskId: string) => {
  return useQuery({
    queryKey: ["task", teamId, projectId, taskId],
    queryFn: () => getTask(teamId, projectId, taskId),
  });
};
