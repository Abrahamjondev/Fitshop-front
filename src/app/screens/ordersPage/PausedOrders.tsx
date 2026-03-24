import React from "react";
import { Stack, Box, Button } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePausedOrders } from "./selector";
import { Messages, serverApi } from "../../../lib/config";
// import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { T } from "../../../lib/types/common";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
// import { OrderStatus } from "../../../lib/enums/order.num";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/orders";
import { OrderStatus } from "../../../lib/enums/order.enum";

/** REDUX SLICE & SELECTOR */
const pausedOrdersRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({ pausedOrders }),
);

interface PausedOrderProps {
  setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrderProps) {
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { pausedOrders } = useSelector(pausedOrdersRetriever);

  /** HANDLERS **/
  const deleteOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.DELETE,
      };

      const confirmation = window.confirm("Do you wont to delete the order?");
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        // ORDER REBUILD
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const processOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      // PAYMENT PROCESS shu joyda bo'lish kerak

      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.PROCESS,
      };

      const confirmation = window.confirm(
        "Do you wont to proceed with payment?",
      );
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        // PROCESS ORDER
        setValue("2");
        // ORDER REBUILD
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <TabPanel value="1">
      <Stack>
        {pausedOrders?.map((order: Order) => {
          return (
            <Box key={order._id} className="order-main-box">
              <Box className="order-box-scroll">
                {order?.orderItems?.map((item: OrderItem) => {
                  const product: Product = order.productData.filter(
                    (ele: Product) => item.productId === ele._id,
                  )[0];
                  const imagePath = `${serverApi}/${product.productImages[0]}`;
                  return (
                    <Box key={item._id} className="orders-name-price">
                      <img src={imagePath} className="order-dish-img" alt="" />
                      <p className="title-dish">{product.productName}</p>
                      <Box className="price-box">
                        <p>${item.itemPrice}</p>
                        <img src="/icons/close.svg" alt="" />
                        <p>{item.itemQuantity}</p>
                        <img src="/icons/pause.svg" alt="" />
                        <p style={{ marginLeft: "15px" }}>
                          ${item.itemQuantity * item.itemPrice}
                        </p>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Box className="total-price-box">
                <Box className="box-total">
                  <p className="bold-txt">Product price</p>
                  <p className="normal-txt">
                    ${order.orderTotal - order.orderDelivery}
                  </p>
                  <img
                    src="/icons/plus.svg"
                    alt=""
                    style={{ marginLeft: "20px" }}
                  />
                  <p className="bold-txt">Delivery cost</p>
                  <p className="normal-txt">${order.orderDelivery}</p>
                  <img
                    src="/icons/pause.svg"
                    alt=""
                    style={{ marginLeft: "20px" }}
                  />
                  <p className="bold-txt">Total</p>
                  <p className="normal-txt">${order.orderTotal}</p>
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

        {!pausedOrders ||
          (pausedOrders.length === 0 && (
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"center"}
            >
              <img
                src="/icons/noimage-list.svg"
                style={{ width: 300, height: 300 }}
                alt=""
              />
            </Box>
          ))}
      </Stack>
    </TabPanel>
  );
}
