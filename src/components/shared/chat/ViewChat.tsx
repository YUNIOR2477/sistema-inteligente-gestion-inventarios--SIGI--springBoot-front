import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ToastMessage from "../ToastMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "../Theme-provider";
import { useChatRoomStore } from "@/store/useChatRoomStore";
import { useChatMessageStore } from "@/store/useChatMessageStore";
import type { ApiError } from "@/types/Response";
import type { ChatRoom } from "@/types/ChatRoom";
import type { ChatMessage } from "@/types/ChatMessage";
import { Info, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { sendChatMessage } from "@/services/WebSocketApi";
import { useUserStore } from "@/store/useUserStore";

interface ViewProps {
  chatRoomId: string;
}

export const ViewChat = ({ chatRoomId }: ViewProps) => {
  const { theme } = useTheme();

  const { fetchChatRoomById } = useChatRoomStore();

  const {
    fetchChatMessagesByRoomId,
    fetchChatMessagesBySenderId,
    handleMarkMessagesAsReadByRoomId,
    isLoading: isMessagesLoading,
  } = useChatMessageStore();

  const { userProfileResponse } = useUserStore();

  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingRoom, setLoadingRoom] = useState<boolean>(false);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!chatRoomId) return;

    const fetchDetails = async () => {
      setLoadingRoom(true);
      setLoadingMessages(true);
      try {
        const roomResp = await fetchChatRoomById(chatRoomId);
        if (roomResp) {
          setRoom(roomResp.data);
        }

        const msgResp = await fetchChatMessagesByRoomId({
          searchId: chatRoomId,
          page: 0,
          size: 200,
          sortField: "sentAt",
          sortDirection: "asc",
        });

        if (msgResp && msgResp.data && Array.isArray(msgResp.data.content)) {
          setMessages(msgResp.data.content);
          try {
            await handleMarkMessagesAsReadByRoomId(chatRoomId);
          } catch (err) {
            const apiError = err as ApiError;
            console.warn("mark read failed", apiError);
          }
        } else if (msgResp && Array.isArray(msgResp)) {
          setMessages(msgResp);
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        ToastMessage({
          type: "error",
          title: apiError?.title ?? "Error",
          description: apiError?.description ?? "Failed to load chat details.",
        });
        setRoom(null);
        setMessages([]);
      } finally {
        setLoadingRoom(false);
        setLoadingMessages(false);
        setTimeout(scrollToBottom, 100);
      }
    };

    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const refreshMessages = async () => {
    if (!chatRoomId) return;
    setLoadingMessages(true);
    try {
      const msgResp = await fetchChatMessagesByRoomId({
        searchId: chatRoomId,
        page: 0,
        size: 200,
        sortField: "createdAt",
        sortDirection: "asc",
      });
      if (msgResp && msgResp.data && Array.isArray(msgResp.data.content)) {
        setMessages(msgResp.data.content);
      } else if (Array.isArray(msgResp)) {
        setMessages(msgResp);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      ToastMessage({
        type: "error",
        title: apiError?.title ?? "Error",
        description: apiError?.description ?? "Failed to refresh messages.",
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  const onSendMessage = async () => {
    if (!chatRoomId) return;
    const content = (newMessage || "").trim();
    if (!content) return;
    setSending(true);
    try {
      if (userProfileResponse?.data.id) {
        await sendChatMessage(chatRoomId, {
          content,
          roomId: chatRoomId,
          senderId: userProfileResponse?.data.id,
        });
        await refreshMessages();
        setNewMessage("");
        setTimeout(scrollToBottom, 50);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      ToastMessage({
        type: "error",
        title: apiError?.title ?? "Send failed",
        description: apiError?.description ?? "Failed to send message.",
      });
    } finally {
      setSending(false);
    }
  };

  const onFetchBySender = async (senderId: string) => {
    setLoadingMessages(true);
    try {
      const resp = await fetchChatMessagesBySenderId({
        searchValue: senderId,
        page: 0,
        size: 200,
        sortField: "sentAt",
        sortDirection: "asc",
      });
      if (resp && resp.data && Array.isArray(resp.data.content)) {
        setMessages(resp.data.content);
      } else if (Array.isArray(resp)) {
        setMessages(resp);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      ToastMessage({
        type: "error",
        title: apiError?.title ?? "Error",
        description:
          apiError?.description ?? "Failed to fetch messages by sender.",
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  return (
    <div>
      <SheetHeader>
        <SheetTitle
          className={`text-xl font-medium justify-between flex items-center gap-2 ${theme === "system" ? "text-green-400" : ""}`}
        >
          <div className="flex items-center gap-2">
            <Info />
            <span>{loadingRoom ? "Loading..." : (room?.name ?? "Chat")}</span>
          </div>

        </SheetTitle>

        <SheetDescription className="justify-start flex gap-4">
          <div className="text-sm text-primary/80">
            {room ? `${room.participantEmails?.length ?? 0} participants` : ""}
          </div>
          <div className="text-sm text-primary/60">{room?.createdAt ?? ""}</div>
        </SheetDescription>
      </SheetHeader>

      <Separator />

      <div className="px-4 py-3 h-[75vh] flex flex-col gap-3">
        <div className="flex-1 overflow-y-auto space-y-3 p-3  border rounded-md">
          {loadingMessages || isMessagesLoading ? (
            <>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-2/3" />
            </>
          ) : messages && messages.length > 0 ? (
            messages.map((m) => (
              <div key={m.id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs text-primary/70">
                  <div className="font-semibold">{m.senderEmail}</div>
                  <div className="text-[11px] text-primary/60">{m.sentAt}</div>
                </div>
                <div className="text-sm text-primary/90">{m.content}</div>
                <div className="text-right">
                  <Button
                    size="xs"
                    variant="ghost"
                    className="text-slate-500"
                    onClick={() => onFetchBySender(m.senderEmail)}
                  >
                    View all from sender
                  </Button>
                </div>
                <Separator/>
              </div>
            ))
          ) : (
            <div className="text-center text-primary/80 py-6">
              No messages yet.
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Write a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
          />
          <Button
            onClick={onSendMessage}
            disabled={sending || newMessage.trim() === ""}
            aria-label="Send message"
          >
            <Send />
          </Button>
        </div>
      </div>

      <SheetFooter>
        <div className="w-full flex justify-between items-center">
          <div className="text-xs text-primary/60">
            Messages: {messages.length}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="font-medium border border-slate-300"
              onClick={() => refreshMessages()}
            >
              Refresh
            </Button>
            <SheetClose asChild>
              <Button
                variant="ghost"
                className="font-medium border border-slate-300"
              >
                Close
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetFooter>
    </div>
  );
};
