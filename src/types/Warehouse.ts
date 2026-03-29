export interface NewWarehouse {
    name: string;
    location: string;
    totalCapacity: string;
}

export interface Warehouse {
    id: string;
    name: string;
    location: string;
    totalCapacity: string;
    active: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedBy: string;
    deletedAt: string;
}
