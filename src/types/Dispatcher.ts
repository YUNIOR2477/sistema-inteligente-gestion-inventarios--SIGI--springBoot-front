
export interface NewDispatcher {
    name: string;
    identification: string;
    location: string;
    phone: string;
    email: string;
    contact: string;
}

export interface Dispatcher {
    id: string;
    name: string;
    identification: string;
    location: string;
    phone: string;
    email: string;
    contact: string;
    active: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedBy: string;
    deletedAt: string;
}