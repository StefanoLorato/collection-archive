import { Item } from "./item";

export interface WishList {
  id: number;
  name: string;
  itemId: number;
  itemDescription: string;
  releaseDate: Date;
  itemVersion: string;
  itemEdition: string;
}