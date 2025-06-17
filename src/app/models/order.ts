import { OrderItem } from "./orderItem";

export interface Order {
  orderId?: number;
  buyerId: number;
  buyerEmail?: string;
  orderedAt?: string;
  shippingAddressId: number;
  orderItems: OrderItem[];
}
