// src/store/chatMessageStore.ts
import { create } from "zustand";
import type { ChatMessage } from "../types/ChatMessage";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import {
    countUnreadMessagesByRoomId,
    getChatMessagesByRoomId,
    getChatMessagesBySenderId,
    markMessagesAsReadByRoomId,
} from "../services/ChatMessageApi";
import { handleApiError } from "../utils/axiosUtils";
import type { PagedRequest } from "@/types/Request";

interface ChatMessageState {
    isLoading: boolean; 

    fetchChatMessagesByRoomId: (
      pagedRequestDto: PagedRequest
    ) => Promise<ApiResponsePaginated<ChatMessage> >;

    fetchChatMessagesBySenderId: (
       pagedRequestDto: PagedRequest
    ) => Promise<ApiResponsePaginated<ChatMessage> >;

    fetchCountUnreadMessagesByRoomId: (
        roomId: string
    ) => Promise<ApiResponse<number> >;

    handleMarkMessagesAsReadByRoomId: (
        roomId: string
    ) => Promise<ApiResponse<void> >;
}

export const useChatMessageStore = create<ChatMessageState>((set) => {

    return {
        isLoading: false,
        
        fetchChatMessagesByRoomId: async ( pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getChatMessagesByRoomId(pagedRequestDto);
                set({  isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        fetchChatMessagesBySenderId: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getChatMessagesBySenderId(pagedRequestDto);
                set({  isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        fetchCountUnreadMessagesByRoomId: async (roomId) => {
            set({ isLoading: true });
            try {
                const data = await countUnreadMessagesByRoomId(roomId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        handleMarkMessagesAsReadByRoomId: async (roomId) => {
            set({ isLoading: true });
            try {
                const data = await markMessagesAsReadByRoomId(roomId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },
    };
});