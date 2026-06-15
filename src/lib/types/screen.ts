import { Member } from "./member";
import { Order } from "./orders";
import { Product } from "./product";

/** REACT APP STATE **/
export interface AppRootState {
  home: HomeState;
  productsPage: ProductsPageState;
  ordersPage: OrdersPageState;
}

/** HOME PAGE **/
export interface HomeState {
  topProducts: Product[];
  topUsers: Member[];
}

/** PRODUCTS PAGE **/
export interface ProductsPageState {
  shop: Member | null;
  chosenProduct: Product | null;
  products: Product[];
  productsTotal: number;
}

/** ORDERS PAGE **/
export interface OrdersPageState {
  pausedOrders: Order[];
  pausedTotal: number;
  processOrders: Order[];
  processTotal: number;
  finishedOrders: Order[];
  finishedTotal: number;
}
