import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateUserProfile } from "../api/userApi";

export const useUpdateUserProfile = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      firstName?: string;
      lastName?: string;
      email?: string;
    }) => updateUserProfile(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
