import type { Dispatcher } from "./Dispatcher";
import type { Inventory } from "./Inventory";
import type { Order } from "./Order";
import type { Product } from "./Product";
import type { User } from "./User";

export interface NewMovement {
    type: string;
    inventoryId: string;
    productId: string;
    quantity: string;
    userId: string;
    orderId: string;
    dispatcherId: string;
    motive: string;
}

export interface Movement {
    id: string;
    type: string;
    inventory: Inventory;
    product: Product;
    quantity: string;
    user: User;
    order: Order;
    dispatcher: Dispatcher;
    motive: string;
    active: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedBy: string;
    deletedAt: string;
}