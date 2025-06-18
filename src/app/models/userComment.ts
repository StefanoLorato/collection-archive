export interface UserComment {
  commentId?: number;
  userId: number;
  itemId?: number;
  collectionId?: number;
  comment: string;
  name: string;
}
