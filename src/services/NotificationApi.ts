import { buildPagedParams, type PagedRequest } from "@/types/Request";
import type { Notification } from "../types/Notification";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { api, handleApiError } from "../utils/axiosUtils";

const notificationApi = api("notifications");

export const getNotificationById = async (notificationId: string): Promise<ApiResponse<Notification>> => {
    try {
        const response = await notificationApi.get<ApiResponse<Notification>>(`/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}


export const markAsRead = async (notificationId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await notificationApi.get<ApiResponse<void>>(`/mark-as-read/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const markAllAsRead = async (): Promise<ApiResponse<void>> => {
    try {
        const response = await notificationApi.put<ApiResponse<void>>("/mark-all-as-read");
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    } 
}

export const getNotificationUnread = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Notification>> => {
    try {
        const response = await notificationApi.get<ApiResponsePaginated<Notification>>("/unread", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getAllNotifications = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Notification>> => {
    try {
        const response = await notificationApi.get<ApiResponsePaginated<Notification>>("", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const countUnread = async (): Promise<ApiResponse<number>> => {
    try {
        const response = await notificationApi.get<ApiResponse<number>>("/count-unread");
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getNotificationsByTittle = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Notification>> => {
    try {
        const response = await notificationApi.get<ApiResponsePaginated<Notification>>("/by-tittle", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}
