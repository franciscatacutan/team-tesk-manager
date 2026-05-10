import { apiClient } from "@/api/apiClients";

export type UpdateAccountEmailPayload = {
  currentPassword: string;
  newEmail: string;
};

export type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export const updateAccountEmail = async (
  payload: UpdateAccountEmailPayload,
): Promise<void> => {
  await apiClient.patch("/users/me/email", payload);
};

export const updatePassword = async (
  userId: string,
  payload: UpdatePasswordPayload,
): Promise<void> => {
  await apiClient.patch(`/users/${userId}/password`, payload);
};
