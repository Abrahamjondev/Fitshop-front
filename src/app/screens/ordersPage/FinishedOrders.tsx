import React from "react";
import { Stack, Box, Pagination } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveFinishedOrders, retrieveFinishedTotal } from "./selector";
import {
  formatPrice,
  getOrderProduct,
  getOrderSubtotal,
  getOrderDelivery,
  getOrderTotal,
  getProductImage,
} from "../../../lib/utils";
import { Order, OrderItem } from "../../../lib/types/orders";

/** REDUX SLICE & SELECTOR */
const finishedOrdersRetriever = createSelector(
  retrieveFinishedOrders,
  retrieveFinishedTotal,
  (finishedOrders, finishedTotal) => ({ finishedOrders, finishedTotal }),
);

interface FinishedOrderProps {
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function FinishedOrders(props: FinishedOrderProps) {
  const { page, limit, onPageChange } = props;
  const { finishedOrders, finishedTotal } = useSelector(
    finishedOrdersRetriever,
  );
  const totalPages = Math.max(1, Math.ceil(finishedTotal / limit));

  return (
    <TabPanel value="3">
      <Stack>
        {finishedOrders?.map((order: Order) => {
          const orderSubtotal = getOrderSubtotal(order);
          const orderDelivery = getOrderDelivery(order);
          const orderTotal = getOrderTotal(order);

          return (
            <Box key={order._id} className="order-main-box">
              <Box className="order-card-head">
                <Box>
                  <span className="order-status-pill finished">Completed</span>
                  <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                </Box>
                <span>
                  {moment(order.updatedAt).format("YYYY-MM-DD HH:mm")}
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
              </Box>
            </Box>
          );
        })}

        {(!finishedOrders || finishedOrders.length === 0) && (
          <Box className="order-empty-state">
            <img src="/icons/noimage-list.svg" alt="" />
            <strong>No finished orders</strong>
            <span>Completed FitShop purchases will appear here.</span>
          </Box>
        )}

        {finishedTotal > limit && (
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
