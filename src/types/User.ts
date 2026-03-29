import type { Product } from "./Product";

export interface UserLogin {
  email: string;
  password: string;
}

export interface NewUser {
  email: string;
  password: string;
  name: string;
  surname: string;
  phoneNumber: string;
  role: string;
}

export interface UpdateUser {
  email: string;
  password: string;
  name: string;
  surname: string;
  phoneNumber: string;
}

export interface User {
  id: string;
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
  role: string;
  active: string;
  notificationsEnabled: string;
  chatNotificationsEnabled: string;
  chatRoomsIds: string[];
  lastLogin: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedBy: string;
  deletedAt: string;
}

export interface Metrics {
    totalProducts: number;
    totalWarehouses: number;
    totalInventories: number;
    totalLoWStock: number;
    totalOrdersDraft:number;
    totalOrdersConfirmed : number;
    totalOrdersCanceled: number;
    totalOrdersDelivered: number;
    totalOrdersPending: number;
    latestProductsAdded: Product[];
}
