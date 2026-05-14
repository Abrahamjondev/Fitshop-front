import React from "react";
import { Stack, Box } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveFinishedOrders } from "./selector";
import { serverApi } from "../../../lib/config";
// import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { Order, OrderItem } from "../../../lib/types/orders";

/** REDUX SLICE & SELECTOR */
const finishedOrdersRetriever = createSelector(
  retrieveFinishedOrders,
  (finishedOrders) => ({ finishedOrders }),
);

const DELIVERY_FREE_THRESHOLD = 500000;
const DELIVERY_COST = 30000;

function getOrderProduct(
  order: Order,
  item: OrderItem,
): Product | undefined {
  return order.productData.find((ele: Product) => item.productId === ele._id);
}

function getProductImage(product?: Product) {
  const image = product?.productImages?.[0];
  if (!image) return "/icons/noimage-list.svg";
  if (image.startsWith("http")) return image;
  if (image.startsWith("/")) return `${serverApi}${image}`;
  return `${serverApi}/${image}`;
}

function formatOrderPrice(price: number) {
  return `${price?.toLocaleString()} UZS`;
}

function getOrderSubtotal(order: Order) {
  return order.orderItems.reduce(
    (total, item) => total + item.itemQuantity * item.itemPrice,
    0,
  );
}

function getOrderDelivery(order: Order) {
  if (order.orderDelivery > 0) return order.orderDelivery;

  const subtotal = getOrderSubtotal(order);
  return subtotal < DELIVERY_FREE_THRESHOLD ? DELIVERY_COST : 0;
}

function getOrderTotal(order: Order) {
  const subtotal = getOrderSubtotal(order);
  const delivery = getOrderDelivery(order);
  const calculatedTotal = subtotal + delivery;

  return order.orderTotal >= calculatedTotal ? order.orderTotal : calculatedTotal;
}

export default function FinishedOrders() {
  const { finishedOrders } = useSelector(finishedOrdersRetriever);
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
                <span>{order.orderItems.length} items</span>
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
                        <p>{formatOrderPrice(item.itemPrice)}</p>
                        <span>x</span>
                        <p>{item.itemQuantity}</p>
                        <strong>
                          {formatOrderPrice(item.itemQuantity * item.itemPrice)}
                        </strong>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Box className="total-price-box">
                <Box className="box-total">
                  <p className="bold-txt">Product price</p>
                  <p className="normal-txt">
                    {formatOrderPrice(orderSubtotal)}
                  </p>
                  <p className="bold-txt">Delivery cost</p>
                  <p className="normal-txt">
                    {orderDelivery === 0 ? "Free" : formatOrderPrice(orderDelivery)}
                  </p>
                  <p className="bold-txt">Total</p>
                  <p className="normal-txt">
                    {formatOrderPrice(orderTotal)}
                  </p>
                </Box>
              </Box>
            </Box>
          );
        })}

        {!finishedOrders ||
          (finishedOrders.length === 0 && (
            <Box className="order-empty-state">
              <img src="/icons/noimage-list.svg" alt="" />
              <strong>No finished orders</strong>
              <span>Completed FitShop purchases will appear here.</span>
            </Box>
          ))}
      </Stack>
    </TabPanel>
  );
}
