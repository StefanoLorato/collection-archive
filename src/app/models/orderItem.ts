export interface OrderItem{
  orderItemId?: number;
  orderId?: number;
  sellerId: number;
  itemId?: number;
  collectionId?: number;
  name?: string;
  price: number;
  status?: string;
  photo?: string;
}
