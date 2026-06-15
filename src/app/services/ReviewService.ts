import api from "./api";
import { Review, ReviewInput, ReviewsResult } from "../../lib/types/review";

class ReviewService {
  public async getProductReviews(
    productId: string,
    page = 1,
    limit = 5,
  ): Promise<ReviewsResult> {
    try {
      const result = await api.get(`/product/${productId}/reviews`, {
        params: { page, limit },
        withCredentials: false,
      });
      return {
        list: result.data?.list ?? [],
        total: result.data?.total ?? 0,
        average: result.data?.average ?? 0,
      };
    } catch (err) {
      console.error("Error, getProductReviews:", err);
      throw err;
    }
  }

  public async createReview(
    productId: string,
    input: ReviewInput,
  ): Promise<Review> {
    try {
      const result = await api.post(`/product/${productId}/review`, input);
      return result.data;
    } catch (err) {
      console.error("Error, createReview:", err);
      throw err;
    }
  }

  public async deleteReview(productId: string): Promise<void> {
    try {
      await api.delete(`/product/${productId}/review`);
    } catch (err) {
      console.error("Error, deleteReview:", err);
      throw err;
    }
  }
}

export default ReviewService;
