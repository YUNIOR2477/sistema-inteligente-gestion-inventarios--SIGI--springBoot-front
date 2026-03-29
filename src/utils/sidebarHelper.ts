import {
  FolderPlus,
  FolderSearch,
  FolderSync,
  FolderCheck,
  FolderInput,
  BellRing,
  Mail,
  FileStack,
  Mails,
} from "lucide-react";

export const buildSidebarData = (role: string) => ({
  navClients: [
    {
      title: "Create",
      icon: FolderPlus,
      items: [
        {
          icon: FolderPlus,
          title: "Create Client",
          url: `/${role}/clients/create`,
          entity: "clients",
          requiredAction: "create",
        },
      ],
    },
    {
      title: "Management",
      icon: FolderCheck,
      items: [
        {
          icon: FolderSearch,
          title: "Manage Clients",
          url: `/${role}/clients/search`,
          entity: "clients",
          requiredAction: "view",
        },
      ],
    },
    {
      title: "Restore",
      icon: FolderSync,
      items: [
        {
          icon: FolderInput,
          title: "Restore Clients",
          url: `/${role}/clients/restore`,
          entity: "clients",
          requiredAction: "restore",
        },
      ],
    },
  ],
  navInventories: [
    {
      title: "Create",
      icon: FolderPlus,
      items: [
        {
          icon: FolderPlus,
          title: "Create Inventory",
          url: `/${role}/inventories/create`,
          entity: "inventories",
          requiredAction: "create",
        }
      ],
    },
    {
      title: "Management",
      icon: FolderCheck,
      items: [
        {
          icon: FolderSearch,
          title: "Manage Inventories",
          url: `/${role}/inventories/search`,
          entity: "inventories",
          requiredAction: "view",
        },
      ],
    },
    {
      title: "Restore",
      icon: FolderSync,
      items: [
        {
          icon: FolderInput,
          title: "Restore Inventory",
          url: `/${role}/inventories/restore`,
          entity: "inventories",
          requiredAction: "restore",
        },
      ],
    },
  ],
  navProducts: [
    {
      title: "Create",
      icon: FolderPlus,
      items: [
        {
          icon: FolderPlus,
          title: "Create Product",
          url: `/${role}/products/create`,
          entity: "products",
          requiredAction: "create",
        },
      ],
    },
    {
      title: "Management",
      icon: FolderCheck,
      items: [
        {
          icon: FolderSearch,
          title: "Manage Products",
          url: `/${role}/products/search`,
          entity: "products",
          requiredAction: "view",
        },
      ],
    },
    {
      title: "Restore",
      icon: FolderSync,
      items: [
        {
          icon: FolderInput,
          title: "Restore Products",
          url: `/${role}/products/restore`,
          entity: "products",
          requiredAction: "restore",
        },
      ],
    },
  ],
  navDispatchers: [
    {
      title: "Create",
      icon: FolderPlus,
      items: [
        {
          icon: FolderPlus,
          title: "Create Dispatcher",
          url: `/${role}/dispatcher/create`,
          entity: "dispatchers",
          requiredAction: "create",
        },
      ],
    },
    {
      title: "Management",
      icon: FolderCheck,
      items: [
        {
          icon: FolderSearch,
          title: "Manage Dispatchers",
          url: `/${role}/dispatchers/search`,
          entity: "dispatchers",
          requiredAction: "view",
        },
      ],
    },

    {
      title: "Restore",
      icon: FolderSync,
      items: [
        {
          icon: FolderInput,
          title: "Restore Dispatchers",
          url: `/${role}/dispatchers/restore`,
          entity: "dispatchers",
          requiredAction: "restore",
        },
      ],
    },
  ],
  navWarehouses: [
    {
      title: "Create",
      icon: FolderPlus,
      items: [
        {
          icon: FolderPlus,
          title: "Create Warehouse",
          url: `/${role}/warehouse/create`,
          entity: "warehouses",
          requiredAction: "create",
        },
      ],
    },
    {
      title: "Management",
      icon: FolderCheck,
      items: [
        {
          icon: FolderSearch,
          title: "Manage Warehouses",
          url: `/${role}/warehouses/search`,
          entity: "warehouses",
          requiredAction: "view",
        },
      ],
    },
    {
      title: "Restore",
      icon: FolderSync,
      items: [
        {
          icon: FolderInput,
          title: "Restore Warehouse",
          url: `/${role}/warehouses/restore`,
          entity: "warehouses",
          requiredAction: "restore",
        },
      ],
    },
  ],
  navUsers: [
    {
      title: "Create",
      icon: FolderPlus,
      items: [
        {
          icon: FolderPlus,
          title: "Create User",
          url: `/${role}/users/create`,
          entity: "users",
          requiredAction: "create",
        },
      ],
    },
    {
      title: "Management",
      icon: FolderCheck,
      items: [
        {
          icon: FolderSearch,
          title: "Manage Users",
          url: `/${role}/users/search`,
          entity: "users",
          requiredAction: "view",
        },
      ],
    },
    {
      title: "Restore",
      icon: FolderSync,
      items: [
        {
          icon: FolderInput,
          title: "Activate Users",
          url: `/${role}/users/restore`,
          entity: "users",
          requiredAction: "restore",
        },
      ],
    },
  ],
  navInvoices: [
    {
      title: "Management",
      icon: FolderCheck,
      items: [
        {
          icon: FolderSearch,
          title: "Manage Invoices",
          url: `/${role}/invoices/search`,
          entity: "invoices",
          requiredAction: "view",
        },
      ],
    },
    {
      title: "Restore",
      icon: FolderSync,
      items: [
        {
          icon: FolderInput,
          title: "Restore Invoices",
          url: `/${role}/invoices/restore`,
          entity: "invoices",
          requiredAction: "restore",
        },
      ],
    },
  ],
  navOrders: [
    {
      title: "Create",
      icon: FolderPlus,
      items: [
        {
          icon: FolderPlus,
          title: "Create Order",
          url: `/${role}/orders/create`,
          entity: "orders",
          requiredAction: "create",
        },
      ],
    },
    {
      title: "Management",
      icon: FolderCheck,
      items: [
        {
          icon: FolderSearch,
          title: "Manage Orders",
          url: `/${role}/orders/search`,
          entity: "orders",
          requiredAction: "view",
        },
      ],
    },
    {
      title: "Restore",
      icon: FolderSync,
      items: [
        {
          icon: FolderInput,
          title: "Restore Orders",
          url: `/${role}/orders/restore`,
          entity: "orders",
          requiredAction: "restore",
        },
      ],
    },
  ],
  navMovements: [
    {
      title: "Management",
      icon: FolderCheck,
      items: [
        {
          icon: FolderSearch,
          title: "Manage Movements",
          url: `/${role}/movements/search`,
          entity: "movements",
          requiredAction: "view",
        },
      ],
    },
     {
      title: "Restore",
      icon: FolderSync,
      items: [
        {
          icon: FolderInput,
          title: "Restore Movement",
          url: `/${role}/movements/restore`,
          entity: "invoices",
          requiredAction: "restore",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Notifications",
      icon: BellRing,
      items: [
        {
          icon: FileStack,
          title: "Notifications",
          url: `/${role}/notifications/search`,
          entity: "notifications",
          requiredAction: "view",
        }
      ],
    },
    {
      title: "Messages",
      icon: Mail,
      items: [
        {
          icon: Mails,
          title: "All chats",
          url: `/${role}/chat-rooms/search`,
          entity: "chats",
          requiredAction: "view",
        },
      ],
    },
  ],
});
