import { useMutation } from "@tanstack/react-query";

import {
  updateAccountEmail,
  type UpdateAccountEmailPayload,
} from "../api/settingsApi";

export const useUpdateAccountEmail = () => {
  return useMutation({
    mutationFn: (payload: UpdateAccountEmailPayload) =>
      updateAccountEmail(payload),
  });
};
