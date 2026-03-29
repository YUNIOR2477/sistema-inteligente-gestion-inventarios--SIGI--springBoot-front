import type { Inventory } from "./Inventory";

export interface NewOrderLine {
    orderId:string
    quantity: string;
    inventoryId: string;
}

export interface OrderLine {
    id: string;
    orderId: string;
    inventory: Inventory;
    lot: string;
    quantity: string;
    unitPrice: string;
    active: string;
    createdAt: string;
    createdBy: string;
    updateAt: string;
    updatedBy: string;
    deletedBy: string;
    deletedAt: string;
}
