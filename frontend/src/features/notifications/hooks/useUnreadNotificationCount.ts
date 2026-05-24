import { useQuery } from "@tanstack/react-query";

import { getUnreadNotificationCount } from "../api/notificationApi";

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });
};
