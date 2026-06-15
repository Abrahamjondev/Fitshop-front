export interface Review {
  _id: string;
  memberId: string;
  productId: string;
  reviewRating: number;
  reviewComment?: string;
  createdAt: string;
  updatedAt: string;
  /** Sharh muallifi (backend aggregatsiyasidan) */
  memberNick?: string;
  memberImage?: string;
}

export interface ReviewInput {
  reviewRating: number;
  reviewComment?: string;
}

export interface ReviewsResult {
  list: Review[];
  total: number;
  average: number;
}
