import { buildPagedParams, type PagedRequest } from "@/types/Request";
import type { ChatRoom, NewChatRoom } from "../types/ChatRoom";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { api, handleApiError } from "../utils/axiosUtils";

const chatApi = api("chat-rooms");

export const createRoom = async (newChatRoom: NewChatRoom): Promise<ApiResponse<ChatRoom>> => {
    try {
        const response = await chatApi.post<ApiResponse<ChatRoom>>("", newChatRoom);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const addParticipants = async (roomId: string, userIds: string[]): Promise<ApiResponse<void>> => {
    try {
        const response = await chatApi.put<ApiResponse<void>>(`/${roomId}/participants`, userIds);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const removeParticipant = async (roomId: string, userId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await chatApi.put<ApiResponse<void>>(`/${roomId}/participants/${userId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getChatRoomByUserId = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<ChatRoom>> => {
    try {
        const response = await chatApi.get<ApiResponsePaginated<ChatRoom>>(`/user`, { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getChatRoomByName = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<ChatRoom>> => {
    try {
        const response = await chatApi.get<ApiResponsePaginated<ChatRoom>>(`/by-name`, { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getChatRoomById = async (roomId: string): Promise<ApiResponse<ChatRoom>> => {
    try {
        const response = await chatApi.get<ApiResponse<ChatRoom>>(`/${roomId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const deactivateRoom = async (roomId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await chatApi.delete<ApiResponse<void>>(`/${roomId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}