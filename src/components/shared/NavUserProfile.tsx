// NavUserProfile.tsx
"use client";
import {
  Bell,
  BellOff,
  ChevronsUpDown,
  CircleUser,
  LogOut,
  Mail,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import type { User } from "@/types/User";
import { useTheme } from "@/components/shared/Theme-provider";
import ToastMessage from "@/components/shared/ToastMessage";
import type { ApiError } from "@/types/Response";
import { Skeleton } from "../ui/skeleton";
import { Sheet, SheetContent } from "../ui/sheet";
import { ViewUser } from "./user/ViewUser";

export function NavUserProfile() {
  const { isMobile } = useSidebar();
  const { logout, userRole } = useAuthStore();
  const navigate = useNavigate();

  const {
    handleChangeNotificationStatus,
    fetchCurrentUser,
    userProfileResponse,
    userProfileIsLoading,
  } = useUserStore();

  const [user, setUser] = useState<User | null>(null);
  const avatarSrc = "";
  const name = user?.name ?? "Guest";
  const surname = user?.surname ?? "User";
  const email = user?.email ?? "Email not available";
  const initials = name.slice(0, 2).toUpperCase();
  const initialSurname = surname.slice(0, 1);
  const [role, setRole] = useState<string | null>("");
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<string>("true");
  const [viewOpen, setViewOpen] = useState(false);

  useEffect(() => {
    const getRedirectPath = () => {
      if (userProfileResponse?.data.role === "ROLE_ADMIN") setRole("admin");
      if (userProfileResponse?.data.role === "ROLE_WAREHOUSE")
        setRole("warehouse");
      if (userProfileResponse?.data.role === "ROLE_SELLER") setRole("seller");
      if (userProfileResponse?.data.role === "ROLE_AUDITOR") setRole("auditor");
      if (userProfileResponse?.data.role === "ROLE_DISPATCHER")
        setRole("dispatcher");
    };
    getRedirectPath();
  }, [userProfileResponse?.data.role, userRole]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = userProfileResponse ?? (await fetchCurrentUser());
        if (response && response.data) {
          const userData = response.data;
          setUser(userData);
          setNotifications(userData.notificationsEnabled ? "true" : "false");
        } else {
          ToastMessage({
            type: "error",
            title: "Error",
            description:
              "No se pudo cargar el perfil. Por favor inicia sesión de nuevo si el problema persiste",
          });
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        ToastMessage({
          type: "error",
          title: apiError?.title ?? "Error",
          description: apiError?.description ?? "Error loading profile",
        });
        if (apiError) {
          navigate("/login");
        }
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const systemTheme = useCallback(
    (className: string) => (theme === "system" ? className : ""),
    [theme],
  );

  const toggleNotificationsAsync = useCallback(async () => {
    setNotifications((prev) => {
      const nextState = prev === "true" ? "false" : "true";
      return nextState;
    });

    let optimisticNextState = notifications === "true" ? "false" : "true";

    try {
      await handleChangeNotificationStatus();

      const resp = await fetchCurrentUser();
      if (resp && resp.data) {
        const updatedUser = resp.data;
        setUser(updatedUser);
        setNotifications(updatedUser.notificationsEnabled ? "true" : "false");
        optimisticNextState = updatedUser.notificationsEnabled
          ? "true"
          : "false";
      }

      ToastMessage({
        type: "success",
        title: `System notifications ${optimisticNextState === "true" ? "activated" : "deactivated"}`,
        description: `System notifications ${optimisticNextState === "true" ? "activated" : "deactivated"} successfully`,
      });
    } catch (err) {
      console.error("Error toggling notifications", err);
      setNotifications((prev) => (prev === "true" ? "false" : "true"));
      ToastMessage({
        type: "error",
        title: "Error",
        description: "Could not change notifications status",
      });
    }
  }, [handleChangeNotificationStatus, fetchCurrentUser, notifications]);

  const handleClickNotifications = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void toggleNotificationsAsync();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {userProfileIsLoading ? (
          <Skeleton className="h-8 w-1/3" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className={` border border-primary mt-2 ${systemTheme("border-green-500")}`}
            >
              <SidebarMenuButton
                size="lg"
                className={`data-[state=open]:bg-primary/10 cursor-pointer hover:bg-primary/10 ${systemTheme("hover:bg-gray-800/50 data-[state=open]:bg-gray-800/50")}`}
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatarSrc} alt={name} />
                  <AvatarFallback
                    className={`rounded-lg text-primary-foreground bg-primary font-medium ${systemTheme("bg-green-500")}`}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {name} {initialSurname}
                  </span>
                  <span className="truncate text-xs">{email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className={`min-w-40 border rounded-lg ml-3 bg-background ${theme !== "system" ? "border-primary" : "bg-gray-950 border-green-500"}`}
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal ">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={avatarSrc} alt={name} />
                    <AvatarFallback
                      className={`rounded-lg text-primary-foreground font-medium bg-primary ${systemTheme("bg-green-500")}`}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {name} {initialSurname}
                    </span>
                    <span className="truncate text-xs">{email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator
                className={`${theme !== "system" ? "bg-primary" : "bg-green-500"}`}
              />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setViewOpen(true)}
                  className={`cursor-pointer focus:bg-primary/20 ${systemTheme("focus:bg-gray-800/80")}`}
                >
                  <CircleUser
                    className={`${theme !== "system" ? "text-primary/90" : "text-green-400"}`}
                  />
                  View profile
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator
                className={`${theme !== "system" ? "bg-primary" : "bg-green-500"}`}
              />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() =>
                    navigate(`/${role}/chat-rooms/search`, { replace: true })
                  }
                  className={`cursor-pointer focus:bg-primary/20 ${systemTheme("focus:bg-gray-800/80")}`}
                >
                  <Mail
                    className={`${theme !== "system" ? "text-primary/90" : "text-green-400"}`}
                  />
                  Messages
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    navigate(`/${role}/notifications/search`, {
                      replace: true,
                    })
                  }
                  className={`cursor-pointer focus:bg-primary/20 ${systemTheme("focus:bg-gray-800/80")}`}
                >
                  <Bell
                    className={`${theme !== "system" ? "text-primary/90" : "text-green-400"}`}
                  />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator
                className={`${theme !== "system" ? "bg-primary" : "bg-green-500"}`}
              />

              <div className="flex justify-center gap-6">
                <DropdownMenuItem
                  onClick={handleClickNotifications}
                  className="flex flex-col items-center gap-1"
                >
                  {notifications === "true" ? (
                    <Bell className="text-primary" size={24} />
                  ) : (
                    <BellOff className="text-red-500" size={24} />
                  )}
                  <span className="text-xs font-medium text-center">
                    System: {notifications === "true" ? "ON" : "OFF"}
                  </span>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator
                className={`${theme !== "system" ? "bg-primary" : "bg-green-500"}`}
              />

              <DropdownMenuItem
                onClick={() => {
                  logout();
                  navigate("/auth/login");
                }}
                className={`cursor-pointer text-red-500 justify-center`}
              >
                <LogOut className="text-red-500" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>

      <Sheet open={viewOpen} onOpenChange={setViewOpen}>
        <SheetContent
          side="right"
          className={`flex flex-col overflow-y-auto border rounded-md shadow-lg bg-background ${theme === "system" ? "bg-gray-950" : "bg-background"}`}
        >
          <ViewUser isDeleted={false} userProfile={true} />
        </SheetContent>
      </Sheet>
    </SidebarMenu>
  );
}
