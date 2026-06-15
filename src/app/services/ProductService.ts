import api from "./api";
import {
  Product,
  ProductInquiry,
  ProductsResult,
} from "../../lib/types/product";

class ProductService {
  public async getProducts(input: ProductInquiry): Promise<ProductsResult> {
    try {
      // axios `params` qiymatlarni o'zi URL-encode qiladi
      const result = await api.get("/product/all", {
        params: {
          order: input.order,
          page: input.page,
          limit: input.limit,
          ...(input.productCollection && {
            productCollection: input.productCollection,
          }),
          ...(input.search && { search: input.search }),
        },
        withCredentials: false,
      });

      // Backend { list, total } qaytaradi
      return {
        list: result.data?.list ?? [],
        total: result.data?.total ?? 0,
      };
    } catch (err) {
      console.error("Error, getProducts:", err);
      throw err;
    }
  }

  public async getProduct(productId: string): Promise<Product> {
    try {
      const result = await api.get(`/product/${productId}`);
      return result.data;
    } catch (err) {
      console.error("Error, getProduct:", err);
      throw err;
    }
  }
}

export default ProductService;
