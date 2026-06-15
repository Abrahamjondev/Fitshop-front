import React from "react";
import { Stack, Box, Button, Pagination } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePausedOrders, retrievePausedTotal } from "./selector";
import { Messages } from "../../../lib/config";
import {
  formatPrice,
  getOrderProduct,
  getOrderSubtotal,
  getOrderDelivery,
  getOrderTotal,
  getProductImage,
} from "../../../lib/utils";
import { T } from "../../../lib/types/common";
import {
  sweetConfirmAlert,
  sweetErrorHandling,
} from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/orders";
import { OrderStatus } from "../../../lib/enums/order.enum";

/** REDUX SLICE & SELECTOR */
const pausedOrdersRetriever = createSelector(
  retrievePausedOrders,
  retrievePausedTotal,
  (pausedOrders, pausedTotal) => ({ pausedOrders, pausedTotal }),
);

interface PausedOrderProps {
  setValue: (input: string) => void;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function PausedOrders(props: PausedOrderProps) {
  const { setValue, page, limit, onPageChange } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { pausedOrders, pausedTotal } = useSelector(pausedOrdersRetriever);
  const totalPages = Math.max(1, Math.ceil(pausedTotal / limit));

  /** HANDLERS **/
  const deleteOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.DELETE,
      };

      const confirmation = await sweetConfirmAlert(
        "Do you want to cancel this order?",
      );
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.error(err);
      sweetErrorHandling(err).then();
    }
  };

  const processOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);

      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.PROCESS,
      };

      const confirmation = await sweetConfirmAlert(
        "Do you want to proceed with payment?",
      );
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setValue("2");
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.error(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <TabPanel value="1">
      <Stack>
        {pausedOrders?.map((order: Order) => {
          const orderSubtotal = getOrderSubtotal(order);
          const orderDelivery = getOrderDelivery(order);
          const orderTotal = getOrderTotal(order);

          return (
            <Box key={order._id} className="order-main-box">
              <Box className="order-card-head">
                <Box>
                  <span className="order-status-pill paused">
                    Awaiting payment
                  </span>
                  <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                </Box>
                <span>
                  {moment(order.createdAt).format("YYYY-MM-DD HH:mm")}
                </span>
              </Box>
              <Box className="order-box-scroll">
                {order?.orderItems?.map((item: OrderItem) => {
                  const product = getOrderProduct(order, item);
                  const imagePath = getProductImage(product);
                  return (
                    <Box key={item._id} className="orders-name-price">
                      <img
                        src={imagePath}
                        className="order-dish-img"
                        alt={product?.productName || "Product"}
                        onError={(event) => {
                          event.currentTarget.src = "/icons/noimage-list.svg";
                        }}
                      />
                      <p className="title-dish">
                        {product?.productName || "Unavailable product"}
                      </p>
                      <Box className="price-box">
                        <p>{formatPrice(item.itemPrice)}</p>
                        <span>x</span>
                        <p>{item.itemQuantity}</p>
                        <strong>
                          {formatPrice(item.itemQuantity * item.itemPrice)}
                        </strong>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Box className="total-price-box">
                <Box className="box-total">
                  <p className="bold-txt">Product price</p>
                  <p className="normal-txt">{formatPrice(orderSubtotal)}</p>
                  <p className="bold-txt">Delivery cost</p>
                  <p className="normal-txt">
                    {orderDelivery === 0 ? "Free" : formatPrice(orderDelivery)}
                  </p>
                  <p className="bold-txt">Total</p>
                  <p className="normal-txt">{formatPrice(orderTotal)}</p>
                </Box>
                <Button
                  value={order._id}
                  variant="contained"
                  color="secondary"
                  className="cancel-button"
                  onClick={deleteOrderHandler}
                >
                  Cancel
                </Button>
                <Button
                  value={order._id}
                  variant="contained"
                  className="pay-button"
                  onClick={processOrderHandler}
                >
                  Payment
                </Button>
              </Box>
            </Box>
          );
        })}

        {(!pausedOrders || pausedOrders.length === 0) && (
          <Box className="order-empty-state">
            <img src="/icons/noimage-list.svg" alt="" />
            <strong>No paused orders</strong>
            <span>Your unpaid baskets will appear here.</span>
          </Box>
        )}

        {pausedTotal > limit && (
          <Stack alignItems="center" sx={{ mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => onPageChange(value)}
              color="secondary"
            />
          </Stack>
        )}
      </Stack>
    </TabPanel>
  );
}
