import axios from "axios";
import { serverApi } from "../../lib/config";
import { Product, ProductInquiry } from "../../lib/types/product";

class ProductService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }
  public async getProducts(input: ProductInquiry): Promise<Product[]> {
    try {
      let url = `${this.path}/product/all?order=${input.order}&page=${input.page}&limit=${input.limit}`;
      if (input.productCollection)
        url += `&productCollection=${input.productCollection}`;
      if (input.productStatus) url += `&productStatus=${input.productStatus}`;
      if (input.search) url += `&search=${input.search}`;

      const result = await axios.get(url);
      console.log("getproducts;", result);

      return Array.isArray(result.data)
        ? result.data
        : result.data.data || result.data.products || [];
    } catch (err) {
      console.log("Error, getProduct:", err);
      throw err;
    }
  }

  public async getProduct(productId: string): Promise<Product> {
    try {
      const url = `${this.path}/product/${productId}`;
      const result = await axios.get(url, { withCredentials: true });

      console.log("getproduct", result);
      return result.data.data || result.data.product || result.data;
    } catch (err) {
      console.log("Error, getProduct:", err);
      throw err;
    }
  }
}

export default ProductService;
