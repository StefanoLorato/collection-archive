export interface Collection {
    collectionId: number;
    collectionName: string;
    completed: boolean;
    categoryId: number;
    userId: number;
    visibility: string;
    description: string;
    collectionDate: string;
    createdAt:string;
    forSale: boolean;
    salePrice: number;
    visibilityStatus: string;
    liked: boolean;
    numLikes: number;
    likeId: number | null;
    bookmarked: boolean;
    bookmarkId: number | null;
}
