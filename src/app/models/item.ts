export interface Item {
  itemId: number;
  collectionId: number;
  userId: number;
  itemName: string;
  itemDescription: string;
  itemPhoto: string;
  condition: string;
  purchaseDate: string;
  releaseDate: string;
  purchasePrice: number;
  salePrice: string;
  itemVersion: string;
  itemEdition: string;
  forSale: boolean;
  visibilityStatus: string;
}
