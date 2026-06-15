import api from "./api";
import { CartItem } from "../../lib/types/search";
import {
  Order,
  OrderInquiry,
  OrderItemInput,
  OrdersResult,
  OrderUpdateInput,
} from "../../lib/types/orders";

class OrderService {
  public async createOrder(input: CartItem[]): Promise<Order> {
    try {
      const orderItems: OrderItemInput[] = input.map((cartItem: CartItem) => {
        return {
          itemQuantity: cartItem.quantity,
          itemPrice: cartItem.price,
          productId: cartItem._id,
        };
      });

      const result = await api.post("/order/create", orderItems);
      return result.data;
    } catch (err) {
      console.error("Error, createOrder:", err);
      throw err;
    }
  }

  public async getMyOrders(input: OrderInquiry): Promise<OrdersResult> {
    try {
      const result = await api.get("/order/all", {
        params: {
          page: input.page,
          limit: input.limit,
          orderStatus: input.orderStatus,
        },
      });

      // Backend { list, total } qaytaradi
      return {
        list: result.data?.list ?? [],
        total: result.data?.total ?? 0,
      };
    } catch (err) {
      console.error("Error, getMyOrders:", err);
      throw err;
    }
  }

  public async updateOrder(input: OrderUpdateInput): Promise<Order> {
    try {
      const result = await api.post("/order/update", input);
      return result.data;
    } catch (err) {
      console.error("Error, updateOrder:", err);
      throw err;
    }
  }
}

export default OrderService;
