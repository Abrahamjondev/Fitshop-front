import {
  ProductCategory,
  ProductSize,
  ProductStatus,
  ProductWeight,
} from "../enums/product.enum";

export interface Product {
  _id: string;
  productStatus: ProductStatus;
  productCollection: ProductCategory;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productSize: ProductSize;
  productWeight?: ProductWeight | number;
  productDesc?: string;
  productImages: string[];
  productViews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  productCollection?: ProductCategory;
  search?: string;
}

/** Backend /product/all javobi: ro'yxat + jami soni (pagination uchun) */
export interface ProductsResult {
  list: Product[];
  total: number;
}
