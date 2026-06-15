import api from "./api";
import { Product } from "../../lib/types/product";

export interface WishlistToggleResult {
  productId: string;
  wished: boolean;
}

class WishlistService {
  /** Sevimlilardagi mahsulot id'lari (heart holati uchun) */
  public async getWishlistIds(): Promise<string[]> {
    try {
      const result = await api.get("/wishlist/ids");
      return result.data?.list ?? [];
    } catch (err) {
      console.error("Error, getWishlistIds:", err);
      throw err;
    }
  }

  /** Sevimlilar — to'liq mahsulot ma'lumoti bilan, sahifalangan (wishlist sahifasi uchun) */
  public async getWishlist(
    page: number = 1,
    limit: number = 8,
  ): Promise<{ list: Product[]; total: number }> {
    try {
      const result = await api.get("/wishlist", { params: { page, limit } });
      return {
        list: result.data?.list ?? [],
        total: result.data?.total ?? 0,
      };
    } catch (err) {
      console.error("Error, getWishlist:", err);
      throw err;
    }
  }

  /** Sevimliga qo'shadi yoki olib tashlaydi */
  public async toggle(productId: string): Promise<WishlistToggleResult> {
    try {
      const result = await api.post("/wishlist/toggle", { productId });
      return result.data;
    } catch (err) {
      console.error("Error, toggleWishlist:", err);
      throw err;
    }
  }
}

export default WishlistService;
