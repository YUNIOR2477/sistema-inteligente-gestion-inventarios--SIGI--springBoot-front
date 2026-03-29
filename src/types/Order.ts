import type { Client } from "./Client"
import type { Dispatcher } from "./Dispatcher";
import type { OrderLine } from "./OrderLine";
import type { User } from "./User"
import type { Warehouse } from "./Warehouse";

export interface NewOrder {
    clientId: string;
    warehouseId: string;
    dispatcherId:string;
}

export interface Order {
    id: string;
    client: Client;
    user: User;
    warehouse: Warehouse;
    dispatcher: Dispatcher;
    status: string;
    total: string;
    lines: OrderLine[];
    active: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedBy: string;
    deletedAt: string;
}
