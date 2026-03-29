import { create } from "zustand";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { countUnread, getAllNotifications, getNotificationById, getNotificationsByTittle, getNotificationUnread, markAllAsRead, markAsRead } from "../services/NotificationApi";
import { handleApiError } from "../utils/axiosUtils";
import type { Notification } from "../types/Notification";
import type { PagedRequest } from "@/types/Request";

interface NotificationState {
    isLoading: boolean;
    handleMarkAsReadNotification: (notificationId: string) => Promise<ApiResponse<void>>;
    handleMarkAllAsReadNotifications: () => Promise<ApiResponse<void>>;
    fetchNotificationById: (notificationId: string) => Promise<ApiResponse<Notification>>;
    fetchNotificationsUnread: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Notification>>;
    fetchAllNotifications: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Notification>>;
    fetchCountUnread: () => Promise<ApiResponse<number>>;
    fetchANotificationsByTitle: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Notification>>;
}
export const useNotificationStore = create<NotificationState>((set) => {
    return {
        isLoading: false,

        handleMarkAllAsReadNotifications: async () => {
            set({ isLoading: true });
            try {
                const data = await markAllAsRead();
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        handleMarkAsReadNotification: async (notificationId) => {
            set({ isLoading: true, });
            try {
                const data = await markAsRead(notificationId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        fetchAllNotifications: async (pagedRequestDto) => {
            set({ isLoading: true, });
            try {
                const data = await getAllNotifications(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        fetchANotificationsByTitle: async (pagedRequestDto) => {
            set({ isLoading: true, });
            try {
                const data = await getNotificationsByTittle(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        fetchCountUnread: async () => {
            set({ isLoading: true, });
            try {
                const data = await countUnread();
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        fetchNotificationById: async (notificationId) => {
            set({ isLoading: true, });
            try {
                const data = await getNotificationById(notificationId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        fetchNotificationsUnread: async (pagedRequestDto) => {
            set({ isLoading: true, });
            try {
                const data = await getNotificationUnread(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },
    }
})