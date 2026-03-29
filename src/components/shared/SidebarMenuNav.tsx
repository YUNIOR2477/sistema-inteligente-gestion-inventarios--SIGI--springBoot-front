import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useTheme } from "./Theme-provider";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { CreateProduct } from "./product/CreateProduct";
import { CreateInventory } from "./inventory/CreateInventory";
import { useEffect, type JSX } from "react";
import { CreateClient } from "./client/CreateClient";
import { CreateOrder } from "./order/CreateOrder";
import { CreateOrderLine } from "./order/CreateOrderLine";
import { CreateWarehouse } from "./warehouse/CreateWarehouse";
import { CreateUser } from "./user/CreateUser";
import { CreateDispatcher } from "./dispatcher/CreateDispatcher";

import { useLocation } from "react-router-dom";

interface SidebarMenuProps {
  title: string;
  items: {
    title: string;
    icon: LucideIcon;
    items?: { title: string; url: string; icon: LucideIcon }[];
  }[];
}

const componentMap: Record<string, JSX.Element> = {
  "Create Product": <CreateProduct />,
  "Create Inventory": <CreateInventory />,
  "Create Client": <CreateClient />,
  "Create Order": <CreateOrder />,
  "Create Order Line": <CreateOrderLine />,
  "Create Warehouse": <CreateWarehouse />,
  "Create Dispatcher": <CreateDispatcher />,
  "Create User": <CreateUser />,
};

export function SidebarMenuNav({ title, items }: SidebarMenuProps) {
  const { theme } = useTheme();
  const location = useLocation();
  useEffect(() => {
    const activeEl = document.querySelector(".border-primary");
    if (activeEl) {
      activeEl.scrollIntoView({ block: "center" });
    }
  }, [location.pathname]);


  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[14px] font-extrabold -mt-5 text-primary">
        {title}
      </SidebarGroupLabel>
       <div className="overflow-y-auto max-h-screen">
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 1;
          const singleSubItem =
            item.items && item.items.length === 1 ? item.items[0] : null;

          return (
            <SidebarMenuItem key={item.title}>
              {hasSubItems ? (
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`data-[state=open]:border text-[14px] cursor-pointer ${
                        theme !== "system"
                          ? "data-[state=open]:border-primary bg-primary/10 hover:bg-primary/20"
                          : "bg-gray-800/50 hover:bg-gray-800 data-[state=open]:border-primary"
                      }`}
                    >
                      <a>
                        <item.icon
                          className={
                            theme !== "system"
                              ? "text-primary/90"
                              : "text-green-400"
                          }
                        />
                        <span className="text-primary">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items!.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          {item.title === "Create" ? (
                            <Sheet>
                              <SheetTrigger asChild>
                                <SidebarMenuSubButton className="cursor-pointer">
                                  <subItem.icon className="size-4 text-primary" />
                                  <span className="text-primary">
                                    {subItem.title}
                                  </span>
                                </SidebarMenuSubButton>
                              </SheetTrigger>
                              <SheetContent
                                side="right"
                                className={`flex flex-col overflow-y-auto border rounded-md shadow-lg bg-background ${
                                  theme === "system"
                                    ? "bg-gray-950"
                                    : "bg-background"
                                }`}
                              >
                                {componentMap[subItem.title] ?? <></>}
                              </SheetContent>
                            </Sheet>
                          ) : (
                            <SidebarMenuSubButton asChild>
                              <a
                                href={subItem.url}
                                className={`flex gap-1 items-center ${
                                  location.pathname.startsWith(subItem.url)
                                    ? "border border-primary rounded-md"
                                    : ""
                                }`}
                              >
                                <subItem.icon className="size-4 text-primary" />
                                <span className="text-primary">
                                  {subItem.title}
                                </span>
                              </a>
                            </SidebarMenuSubButton>
                          )}
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : singleSubItem ? (
                item.title === "Create" ? (
                  <Sheet>
                    <SheetTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className={`text-[14px] cursor-pointer ${
                          location.pathname.startsWith(singleSubItem.url)
                            ? "border border-primary rounded-md"
                            : ""
                        } ${
                          theme !== "system"
                            ? "bg-primary/10 hover:bg-primary/20"
                            : "bg-gray-800/50 hover:bg-gray-800"
                        }`}
                      >
                        <a className="flex gap-1 items-center">
                          <item.icon
                            className={
                              theme !== "system"
                                ? "text-primary/90"
                                : "text-green-400"
                            }
                          />
                          <span className="text-primary">
                            {singleSubItem.title}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className={`flex flex-col overflow-y-auto border rounded-md shadow-lg bg-background ${
                        theme === "system" ? "bg-gray-950" : "bg-background"
                      }`}
                    >
                      {componentMap[singleSubItem.title] ?? <></>}
                    </SheetContent>
                  </Sheet>
                ) : (
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`text-[14px] cursor-pointer ${
                      location.pathname.startsWith(singleSubItem.url)
                        ? "border border-primary rounded-md"
                        : ""
                    } ${
                      theme !== "system"
                        ? "bg-primary/10 hover:bg-primary/20"
                        : "bg-gray-800/50 hover:bg-gray-800"
                    }`}
                  >
                    <a
                      href={singleSubItem.url}
                      className="flex gap-1 items-center"
                    >
                      <item.icon
                        className={
                          theme !== "system"
                            ? "text-primary/90"
                            : "text-green-400"
                        }
                      />
                      <span className="text-primary">
                        {singleSubItem.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                )
              ) : null}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
      </div>
    </SidebarGroup>
  );
}
