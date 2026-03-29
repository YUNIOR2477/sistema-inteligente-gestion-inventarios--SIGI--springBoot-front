import type { ChatRoom, NewChatRoom } from "../types/ChatRoom";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { addParticipants, createRoom, deactivateRoom, getChatRoomById, getChatRoomByName, getChatRoomByUserId, removeParticipant } from "../services/ChatRoomApi";
import { handleApiError } from "../utils/axiosUtils";
import { create } from "zustand";
import type { PagedRequest } from "@/types/Request";

interface ChatRoomState {
    isLoading: boolean;
    handleCreateRoom: (newChatRoom: NewChatRoom) => Promise<ApiResponse<ChatRoom>>;
    handleAddParticipants: (roomId: string, userIds: string[]) => Promise<ApiResponse<void>>;
    handleRemoveParticipant: (roomId: string, userId: string) => Promise<ApiResponse<void>>;
    fetchChatRoomByUserId: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<ChatRoom>>;
    fetchChatRoomByName: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<ChatRoom>>;
    fetchChatRoomById: (roomId: string) => Promise<ApiResponse<ChatRoom>>;
    handleDeactivateRoomById: (roomId: string) => Promise<ApiResponse<void>>;
}

export const useChatRoomStore = create<ChatRoomState>((set) => {

    return {
        isLoading: false,

        handleCreateRoom: async (newChatRoom) => {
            set({ isLoading: true });
            try {
                const data = await createRoom(newChatRoom);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },
        handleAddParticipants: async (roomId, userIds) => {
            set({ isLoading: true });
            try {
                const data = await addParticipants(roomId, userIds);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        handleDeactivateRoomById: async (roomId) => {
            set({ isLoading: true });
            try {
                const data = await deactivateRoom(roomId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        handleRemoveParticipant: async (roomId, userId) => {
            set({ isLoading: true });
            try {
                const data = await removeParticipant(roomId, userId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        fetchChatRoomById: async (roomId) => {
            set({ isLoading: true });
            try {
                const data = await getChatRoomById(roomId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        fetchChatRoomByUserId: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getChatRoomByUserId(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        fetchChatRoomByName: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getChatRoomByName(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },
    };
});