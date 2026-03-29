export interface NewClient {
    name: string;
    identification: string;
    location: string;
    phone: string;
    email: string;
}

export interface Client {
    id: string;
    name: string;
    identification: string;
    location: string;
    phone: string;
    email: string;
    active: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedBy: string;
    deletedAt: string;
}