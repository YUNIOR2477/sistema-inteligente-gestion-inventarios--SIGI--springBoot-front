import type { Client } from "./Client";
import type { Order } from "./Order";

export interface NewInvoice {
    orderId: string;
    tax: string;
}

export interface Invoice {
    id: string;
    number: string;
    order: Order;
    client: Client;
    subtotal: string;
    tax: string;
    total: string;
    status: string;
    active: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedBy: string;
    deletedAt: string;
}