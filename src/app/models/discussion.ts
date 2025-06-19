import { Message } from "./message";

export interface Discussion{
  discussionId?: number;
  buyerId: number;
  sellerId: number;
  itemId?: number;
  collectionId?: number;
  messages: Message[];
  sellerName?: string;
  buyerName?: string;
  name?: string;
}