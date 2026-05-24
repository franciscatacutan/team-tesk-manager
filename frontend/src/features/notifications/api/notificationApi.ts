import { apiClient } from "@/api/apiClients";
import type { PageResponse } from "@/common/types/pageResponse.types";

import type {
  AppNotification,
  UnreadNotificationCount,
} from "../types/notification.types";

export const getNotifications = async (params: {
  page?: number;
  size?: number;
  sort?: string;
}): Promise<PageResponse<AppNotification>> => {
  const response = await apiClient.get("/notifications", { params });
  return response.data;
};

export const getUnreadNotificationCount =
  async (): Promise<UnreadNotificationCount> => {
    const response = await apiClient.get("/notifications/unread-count");
    return response.data;
  };

export const markNotificationRead = async (
  notificationId: string,
): Promise<AppNotification> => {
  const response = await apiClient.patch(
    `/notifications/${notificationId}/read`,
  );
  return response.data;
};

export const markAllNotificationsRead =
  async (): Promise<UnreadNotificationCount> => {
    const response = await apiClient.patch("/notifications/read-all");
    return response.data;
  };
