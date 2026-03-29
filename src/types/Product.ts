export interface NewProduct {
    sku: string;
    name: string;
    category: string;
    unit: string;
    price: string;
    barcode: string;
    imageUrl: string;
}

export interface Product {
    id: string;
    sku: string;
    name: string;
    category: string;
    unit: string;
    price: string;
    barcode: string;
    imageUrl: string;
    active: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedBy: string;
    deletedAt: string;
}
