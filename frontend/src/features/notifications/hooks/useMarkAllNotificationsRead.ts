import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markAllNotificationsRead } from "../api/notificationApi";

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
