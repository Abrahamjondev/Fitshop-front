import {
  ProductCategory,
  ProductCollection,
  ProductSize,
  ProductStatus,
  ProductWeight,
} from "../enums/product.enum";

export interface Product {
  _id: string;
  productStatus: ProductStatus;
  productCollection: ProductCollection | ProductCategory;
  productName: string;
  productBrand?: string;
  productPrice: number;
  productLeftCount: number;
  productSize: ProductSize;
  productWeight?: ProductWeight | number;
  productVolume: number;
  productDesc?: string;
  productImages: string[];
  productRating?: number;
  productViews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  productCollection?: ProductCollection | ProductCategory;
  productStatus?: ProductStatus;
  search?: string;
}
