import { Member } from "./member";
import { Order } from "./orders";
import { Product } from "./product";
import { ProductCategory } from "../enums/product.enum";

/** REACT APP STATE **/
export interface AppRootState {
  home: HomeState;
  productsPage: ProductsPageState;
  ordersPage: OrdersPageState;
}

/** HOME PAGE **/
export interface HeroData {
  title: string;
  subtitle: string;
  images: string[];
  category: ProductCategory;
}

export interface HomeState {
  products: Product[];
  heroData: HeroData[];
  loading: boolean;
}
/** PRODUCTS PAGE **/
export interface ProductsPageState {
  restaurant: Member | null;
  chosenProduct: Product | null;
  products: Product[];
}
/** ORDERS PAGE **/
export interface OrdersPageState {
  pausedOrders: Order[];
  processOrders: Order[];
  finishedOrders: Order[];
}
