import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "./project.service";

/*
 * Custom hook to create a project.
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};
