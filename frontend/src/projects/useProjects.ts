import { useQuery } from "@tanstack/react-query";
import { getProjects } from "./project.service";
import { getProjectById } from "./project.service";

/*
 * Custom hook to fetch projects.
 */
export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
};
/*
 * Custom hook to fetch a project by ID.
 */
export const useProjectById = (projectId: number) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
    enabled: !!projectId,
  });
};
