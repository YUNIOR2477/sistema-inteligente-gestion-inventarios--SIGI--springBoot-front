export type CrudAction = "view" | "create" | "update" | "delete" | "restore";

export type Entity =
  | "inventories"
  | "products"
  | "clients"
  | "users"
  | "orders"
  | "dispatchers"
  | "warehouses"
  | "invoices"
  | "movements";

export interface RolePermissions {
  [entity: string]: CrudAction[];
}

export const rolePermissionsMap: Record<string, RolePermissions> = {
  ROLE_ADMIN: {
    inventories: ["view", "create", "update", "delete", "restore"],
    products: ["view", "create", "update", "delete", "restore"],
    clients: ["view", "create", "update", "delete", "restore"],
    users: ["view", "create", "update", "delete", "restore"],
    orders: ["view", "create", "update", "delete", "restore"],
    dispatchers: ["view", "create", "update", "delete", "restore"],
    warehouses: ["view", "create", "update", "delete", "restore"],
    invoices: ["view", "create", "update", "delete", "restore"],
    movements: ["view", "update", "delete", "restore"],
    notifications: ["view", "create", "update", "delete", "restore"],
    chats: ["view", "create", "update", "delete", "restore"],
  },

  ROLE_AUDITOR: {
    inventories: ["view"],
    products: ["view"],
    clients: ["view"],
    users: ["view"],
    orders: ["view"],
    dispatchers: ["view"],
    warehouses: ["view"],
    invoices: ["view"],
    movements: ["view"],
    notifications: ["view"],
    chats: ["view"],  
  },

  ROLE_WAREHOUSE: {
    inventories: ["view", "create", "update"],
    products: ["view", "create", "update"],
    clients: ["view"],
    users: ["view"],
    orders: ["view"],
    dispatchers: ["view"],
    warehouses: ["view", "update"],
    invoices: ["view"],
    movements: ["view", "update"],
    notifications: ["view", "create"],
    chats: ["view", "create"],
  },

  ROLE_DISPATCHER: {
    inventories: ["view"],
    products: ["view"],
    clients: ["view"],
    users: ["view"],
    orders: ["view"],
    dispatchers: ["view", "update"],
    warehouses: ["view"],
    invoices: ["view"],
    movements: ["view", "update"],
    notifications: ["view", "create"],
    chats: ["view", "create"],
  },

  ROLE_SELLER: {
    inventories: ["view"], 
    products: ["view"],
    clients: ["view", "create", "update"],
    users: ["view"],
    orders: ["view", "create", "update"],
    dispatchers: ["view"],
    warehouses: ["view"],
    invoices: ["view", "create","update"],
    movements: ["view"],
    notifications: ["view", "create"],
    chats: ["view", "create"],
  },
};


export const hasAccess = (
  role: string,
  entity: Entity,
  action: CrudAction,
): boolean => {
  const permissions = rolePermissionsMap[role];
  if (!permissions) return false;
  return permissions[entity]?.includes(action) ?? false;
};