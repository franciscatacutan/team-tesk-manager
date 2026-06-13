import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateUserRole } from "../api/userApi";
import type { UserRole } from "../types/userRole";

export const useUpdateUserRole = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (role: UserRole) => updateUserRole(userId, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
