import { useMutation } from "@tanstack/react-query";

import { resetUserPasswordByAdmin } from "../api/userApi";

export const useAdminResetUserPassword = (userId: string) => {
  return useMutation({
    mutationFn: (newPassword: string) =>
      resetUserPasswordByAdmin(userId, { newPassword }),
  });
};
