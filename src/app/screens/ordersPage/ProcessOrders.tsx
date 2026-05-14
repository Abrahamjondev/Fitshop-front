import React from "react";
import { Stack, Box, Button } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveProcessOrders } from "./selector";
import { Messages, serverApi } from "../../../lib/config";
// import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { useGlobals } from "../../hooks/useGlobals";
import { T } from "../../../lib/types/common";
import OrderService from "../../services/OrderService";
// import { OrderStatus } from "../../../lib/enums/order.num";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/orders";

/** REDUX SLICE & SELECTOR */
const processOrdersRetriever = createSelector(
  retrieveProcessOrders,
  (processOrders) => ({ processOrders }),
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

interface ProcessOrderProps {
  setValue: (input: string) => void;
}

export default function PausedOrders(props: ProcessOrderProps) {
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { processOrders } = useSelector(processOrdersRetriever);

  /** HANDLERS **/
  const finishedOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      // PAYMENT PROCESS shu joyda bo'lish kerak

      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.FINISH,
      };

      const confirmation = window.confirm("Have you received your order?");
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        // PROCESS ORDER
        setValue("3");
        // ORDER REBUILD
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <TabPanel value="2">
      <Stack>
        {processOrders?.map((order: Order) => {
          const orderSubtotal = getOrderSubtotal(order);
          const orderDelivery = getOrderDelivery(order);
          const orderTotal = getOrderTotal(order);

          return (
            <Box key={order._id} className="order-main-box">
              <Box className="order-card-head">
                <Box>
                  <span className="order-status-pill process">In progress</span>
                  <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                </Box>
                <span>{moment().format("YY-MM-DD HH:mm")}</span>
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
                <Button
                  value={order._id}
                  variant="contained"
                  color="secondary"
                  className="verify-btn"
                  onClick={finishedOrderHandler}
                >
                  Verify to fulfil
                </Button>
              </Box>
            </Box>
          );
        })}

        {!processOrders ||
          (processOrders.length === 0 && (
            <Box className="order-empty-state">
              <img src="/icons/noimage-list.svg" alt="" />
              <strong>No processing orders</strong>
              <span>Paid orders being prepared will appear here.</span>
            </Box>
          ))}
      </Stack>
    </TabPanel>
  );
}
