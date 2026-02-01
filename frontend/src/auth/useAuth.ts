import { useMutation } from "@tanstack/react-query";
import * as authService from "./auth.service";

/* Custom hook for user registration
 *
 */
export const useRegister = () =>
  useMutation({
    mutationFn: authService.register,
  });

// Custom hook for user login
export const useLogin = () =>
  useMutation({
    mutationFn: authService.login,
  });
