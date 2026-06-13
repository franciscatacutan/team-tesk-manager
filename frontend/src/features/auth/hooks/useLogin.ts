import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/auth.api";
import { authStorage } from "../utils/authStorage";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.login,
    onSuccess: (data) => {
      authStorage.setToken(data.token);
      queryClient.setQueryData(["me"], {
        id: data.user.userId,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        role: data.user.role,
      });
    },
  });
};
