import type { Product } from "./Product";
import type { Warehouse } from "./Warehouse";

export interface NewInventory {
    productId: string;
    warehouseId: string;
    location: string;
    lot: string;
    productionDate: string;
    expirationDate: string;
    availableQuantity: string;
    reservedQuantity: string;
}

export interface NewEntry {
    inventoryId: string,
    dispatcherId: string
    quantity: string,
    motive: string
}

export interface NewExitTransfer {
    originInventoryId:string,
    destinationInventoryId: string,
    quantity: string,
    motive: string
}

export interface NewExitDisposal {
    inventoryId:string,
    quantity: string,
    motive: string
}


export interface Inventory {
    id: string;
    product: Product;
    warehouse: Warehouse;
    location: string;
    lot: string;
    active: string;
    productionDate: string;
    expirationDate: string;
    availableQuantity: string;
    reservedQuantity: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedBy: string;
    deletedAt: string;
}