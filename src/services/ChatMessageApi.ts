import { buildPagedParams, type PagedRequest } from "@/types/Request";
import type { ChatMessage } from "../types/ChatMessage";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { api, handleApiError } from "../utils/axiosUtils";

const chatApi = api("chat");

export const getChatMessagesByRoomId = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<ChatMessage>> => {
    try {
        const response = await chatApi.get<ApiResponsePaginated<ChatMessage>>(`/by-room`, { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getChatMessagesBySenderId = async ( pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<ChatMessage>> => {
    try {
        const response = await chatApi.get<ApiResponsePaginated<ChatMessage>>(`/by-sender`, { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const countUnreadMessagesByRoomId = async (roomId: string): Promise<ApiResponse<number>> => {
    try {
        const response = await chatApi.get<ApiResponse<number>>(`/unread-count/${roomId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const markMessagesAsReadByRoomId = async (roomId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await chatApi.put<ApiResponse<void>>(`/mark-as-read/${roomId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}