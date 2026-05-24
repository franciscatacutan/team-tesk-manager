import { apiClient } from "../../../api/apiClients";
import type { AuthResponse } from "../types/auth.types";

export const login = async (payload: { email: string; password: string }) => {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  return data;
};

export const register = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const { data } = await apiClient.post<AuthResponse>(
    "/auth/register",
    payload,
  );
  return data;
};

export const refresh = async () => {
  const { data } = await apiClient.post<AuthResponse>("/auth/refresh");
  return data;
};

export const logout = async () => {
  await apiClient.post("/auth/logout");
};
