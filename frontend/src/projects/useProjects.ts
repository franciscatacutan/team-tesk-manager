import { useQuery } from "@tanstack/react-query";
import { getProjects } from "./project.service";

/*
 * Custom hook to fetch project.
 */
export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
};
