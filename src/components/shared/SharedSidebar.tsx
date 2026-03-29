/* eslint-disable @typescript-eslint/no-explicit-any */
import { FolderKanban } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { useTheme } from "./Theme-provider";
import { SidebarMenuNav } from "./SidebarMenuNav";
import { NavUserProfile } from "./NavUserProfile";
import { buildSidebarData } from "@/utils/sidebarHelper";
import { hasAccess } from "@/utils/rolePermissions";
import { useAuthStore } from "@/store/useAuthStore";
import { Skeleton } from "@/components/ui/skeleton";

export function SharedSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme } = useTheme();
  const { userRole } = useAuthStore();

  const safeRole =
    Array.isArray(userRole) && userRole.length > 0
      ? userRole[0]
      : typeof userRole === "string"
      ? userRole
      : "";

  const normalizedRole = safeRole ? safeRole.replace("ROLE_", "").toLowerCase() : "";

  const data = buildSidebarData(normalizedRole);

  const systemTheme = (className: string) => {
    return `${theme === "system" ? `${className}` : ""}`;
  };

  const filterItems = (sections: any[]) =>
    sections.map((section) => ({
      ...section,
      items: section.items.filter((item: any) =>
        hasAccess(safeRole, item.entity, item.requiredAction),
      ),
    }));

  return (
    <Sidebar
      variant="inset"
      {...props}
      className={`bg-background ${systemTheme("bg-gray-950")}`}
    >
      <SidebarHeader className={`bg-background ${systemTheme("bg-gray-950")}`}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin" className="mb-4">
                <div
                  className={`flex aspect-square size-8 items-center justify-center rounded-lg text-primary ${
                    theme !== "system" ? " bg-primary" : "bg-green-500"
                  }`}
                >
                  <FolderKanban className="size-6 text-primary-foreground" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-lg font-semibold">SIGI</span>
                  <span className="truncate text-xs text-primary font-semibold">
                    {safeRole
                      ? `${normalizedRole.toUpperCase()} PANEL`
                      : <Skeleton className="h-4 w-24" />}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent
        className={`bg-background overflow-y-auto scrollbar ${systemTheme(
          "bg-gray-950",
        )}`}
      >
        {data.navProducts && (
          <SidebarMenuNav
            title="Products"
            items={filterItems(data.navProducts)}
          />
        )}
        {data.navInventories && (
          <SidebarMenuNav
            title="Inventories"
            items={filterItems(data.navInventories)}
          />
        )}
        {data.navMovements && (
          <SidebarMenuNav
            title="Movements"
            items={filterItems(data.navMovements)}
          />
        )}
        {data.navWarehouses && (
          <SidebarMenuNav
            title="Warehouses"
            items={filterItems(data.navWarehouses)}
          />
        )}
        {data.navOrders && (
          <SidebarMenuNav title="Orders" items={filterItems(data.navOrders)} />
        )}
        {data.navClients && (
          <SidebarMenuNav
            title="Clients"
            items={filterItems(data.navClients)}
          />
        )}
        {data.navDispatchers && (
          <SidebarMenuNav
            title="Dispatchers"
            items={filterItems(data.navDispatchers)}
          />
        )}
        {data.navInvoices && (
          <SidebarMenuNav
            title="Invoices"
            items={filterItems(data.navInvoices)}
          />
        )}
        {data.navUsers && (
          <SidebarMenuNav title="Users" items={filterItems(data.navUsers)} />
        )}
        <SidebarMenuNav
          title="Communications"
          items={filterItems(data.navSecondary)}
        />
      </SidebarContent>
      <SidebarFooter className={` bg-background ${systemTheme("bg-gray-950")}`}>
        <NavUserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}