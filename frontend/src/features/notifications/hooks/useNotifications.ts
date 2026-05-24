import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "../api/notificationApi";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications", "inbox"],
    queryFn: () =>
      getNotifications({
        page: 0,
        size: 12,
        sort: "createdAt,desc",
      }),
    refetchInterval: 30_000,
    staleTime: 10_000,
  });
};
