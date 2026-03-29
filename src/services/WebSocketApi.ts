// websocket.ts
import SockJS from "sockjs-client";
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import type { ChatMessage, sendMessage } from "../types/ChatMessage";
import type { Notification } from "../types/Notification";

let stompClient: Client | null = null;
let activeCleanup: (() => void) | null = null;

interface WebSocketOptions {
  userId?: string;
  roomIds?: string[];
  onNotification?: (notif: Notification) => void;
  onChatMessage?: (msg: ChatMessage) => void;
}

export const connectWebSocket = ({
  userId,
  roomIds,
  onNotification,
  onChatMessage,
}: WebSocketOptions): (() => void) => {
  if (stompClient && stompClient.connected) {
    return activeCleanup ?? (() => {});
  }

  const subscriptions: StompSubscription[] = [];

  const authStore = localStorage.getItem("auth-store");
  const parsed = authStore ? JSON.parse(authStore) : null;
  const token = parsed?.state?.userToken ?? "";

  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    connectHeaders: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    debug: (msg: string) => {
      console.debug("[STOMP]", msg);
    },
    onConnect: (frame) => {
      console.log("[WebSocket] ✅ Conectado (SockJS + STOMP)", frame?.headers);

      if (userId && onNotification) {
        const dest = `/topic/notifications/${userId}`;
        const sub = stompClient!.subscribe(dest, (message: IMessage) => {
          try {
            const notif: Notification = JSON.parse(message.body);
            onNotification(notif);
          } catch (err) {
            console.error(
              "[WebSocket] ❌ Error parseando notificación",
              err,
              message.body,
            );
          }
        });
        subscriptions.push(sub);
      }

      if (roomIds && onChatMessage) {
        roomIds.forEach((roomId) => {
          const dest = `/topic/chat.room.${roomId}`;
          const sub = stompClient!.subscribe(dest, (message: IMessage) => {
            try {
              const chatMsg: ChatMessage = JSON.parse(message.body);
              onChatMessage(chatMsg);
            } catch (err) {
              console.error(
                "[WebSocket] ❌ Error parseando mensaje de chat",
                err,
              );
            }
          });
          subscriptions.push(sub);
        });
      }

      if (userId && onChatMessage) {
        const dest = `/user/${userId}/queue/chat.dm`;
        const sub = stompClient!.subscribe(dest, (message: IMessage) => {
          try {
            const chatMsg: ChatMessage = JSON.parse(message.body);
            onChatMessage(chatMsg);
          } catch (err) {
            console.error(
              "[WebSocket] ❌ Error parseando mensaje directo",
              err,
            );
          }
        });
        subscriptions.push(sub);
      }
    },
    onStompError: (frame) => {
      console.error("[WebSocket] ❌ Error STOMP", frame);
    },
    onWebSocketClose: (evt) => {
      console.warn("[WebSocket] ⚠️ Conexión cerrada", evt);
    },
    onWebSocketError: (event) => {
      console.error("[WebSocket] ❌ Error WebSocket", event);
    },
  });

  stompClient.activate();

  const cleanup = () => {
    if (stompClient) {
      try {
        subscriptions.forEach((sub) => {
          try {
            stompClient!.unsubscribe(sub.id);
          } catch { /* empty */ }
        });
        stompClient.deactivate();
      } catch (e) {
        console.warn("[WebSocket] Error al cerrar cliente", e);
      } finally {
        stompClient = null;
        activeCleanup = null;
      }
    }
  };

  activeCleanup = cleanup;
  return cleanup;
};

export const sendChatMessage = (roomId: string, message: sendMessage): void => {
  if (stompClient?.connected) {
    stompClient.publish({
      destination: `/app/chat.send/${roomId}`,
      body: JSON.stringify(message),
    });
  } else {
    console.warn("[WebSocket] ⚠️ No conectado, mensaje no enviado");
  }
};
