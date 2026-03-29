import { Outlet, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../components/shared/Theme-provider";
import { useUserStore } from "@/store/useUserStore";
import { connectWebSocket } from "@/services/WebSocketApi";
import ToastMessage from "../components/shared/ToastMessage";
import type { ChatMessage } from "@/types/ChatMessage";
import type { Notification } from "@/types/Notification";
import { ModeToggle } from "../components/shared/ModeToggle";
import { SharedSidebar } from "../components/shared/SharedSidebar";

export default function PrincipalLayout() {
  const { theme } = useTheme();
  const [navigationTitle, setNavigationTitle] = useState<string | null>("");
  const [navigationBar, setNavigationBar] = useState<string | null>("");
  const navigate = useNavigate();

  const { fetchCurrentUser, userProfileResponse } = useUserStore();
  const [userId, setUserId] = useState<string>("");
  const [roomIds, setRoomIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string>("true");

  const notificationsRef = useRef<string>(notifications);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const systemTheme = (className: string) => (theme === "system" ? className : "");

  useEffect(() => {
    setNavigationTitle(localStorage.getItem("navigationTitle"));
    setNavigationBar(localStorage.getItem("navigationBar"));
  }, [navigate]);

  useEffect(() => {
    const fetchIdUser = async () => {
      try {
        if (userProfileResponse !== null) {
          setUserId(userProfileResponse.data.id);
          setRoomIds(userProfileResponse.data.chatRoomsIds ?? []);
          setNotifications(userProfileResponse.data.notificationsEnabled ? "true" : "false");
        } else {
          const user = await fetchCurrentUser();
          if (user && user.data) {
            setUserId(user.data.id);
            setRoomIds(user.data.chatRoomsIds ?? []);
            setNotifications(user.data.notificationsEnabled ? "true" : "false");
          }
        }
      } catch (err) {
        console.error("Error fetching current user", err);
        navigate("/login");
      }
    };

    void fetchIdUser();

  }, [fetchCurrentUser, navigate, userProfileResponse]);

  useEffect(() => {
    if (!userId) return;

    const cleanup = connectWebSocket({
      userId,
      roomIds,
      onNotification: (notif: Notification) => {
        if (notificationsRef.current === "true") {
          console.log("Toast -> notificación recibida:", notif);
          ToastMessage({
            type: "notification",
            title: `New notification: ${notif.title}`,
            description: `${notif.message}`,
          });
        } else {
          console.log("Notificaciones desactivadas, no mostrar toast");
        }
      },
      onChatMessage: (msg: ChatMessage) => {
        ToastMessage({
          type: "chatMessage",
          title: `New message from: ${msg.senderEmail}`,
          description: `${msg.content}`,
        });
      },
    });

    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, JSON.stringify(roomIds)]);


  return (
    <SidebarProvider>
      <SharedSidebar />
      <div className={`min-h-screen w-full flex flex-col`}>
        <SidebarInset className={`${systemTheme("bg-gray-950")}`}>
          <header className="flex h-16 shrink-0 items-center gap-2 relative ">
            <div className="flex items-center gap-2 px-4 justify-between">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      onClick={() => {
                        localStorage.setItem("navigationBar", "");
                      }}
                      href="/admin"
                      className={`font-black text-primary text-base  ${systemTheme(
                        "text-green-400 hover:text-green-400/70",
                      )}`}
                    >
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {navigationTitle && navigationTitle !== "" && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="font-medium">
                          {navigationTitle}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}

                  {navigationBar && navigationBar !== "" && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="font-normal">
                          {navigationBar}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="absolute right-4">
              <ModeToggle />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div
              className={`min-h-screen flex-1 rounded-xl md:min-h-min bg-primary/10
                ${systemTheme(
                "bg-linear-to-br from-gray-800 via-gray-600 to-gray-800",
              )}`}
            >
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
