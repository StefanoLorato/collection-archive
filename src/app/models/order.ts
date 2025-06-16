import { OrderItem } from "./orderItem";

export interface Order {
  orderId?: number;
  buyerId: number;
  orderedAt?: string;
  status?: string;
  shippingAddressId: number;
  orderItems: OrderItem[];
}
