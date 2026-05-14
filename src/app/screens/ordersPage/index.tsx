import { useState, SyntheticEvent, useEffect } from "react";
import { Container, Stack, Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import {
  retrieveFinishedOrders,
  retrievePausedOrders,
  retrieveProcessOrders,
} from "./selector";

import "../../../css/order.css";

import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import { Order, OrderInquiry } from "../../../lib/types/orders";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { createSelector } from "reselect";

function getFitShopMemberLabel(memberType?: MemberType) {
  if (memberType === MemberType.RESTAURANT) return "FitShop Partner";
  return "FitShop Member";
}

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

const ordersSummaryRetriever = createSelector(
  retrievePausedOrders,
  retrieveProcessOrders,
  retrieveFinishedOrders,
  (pausedOrders, processOrders, finishedOrders) => ({
    pausedOrders,
    processOrders,
    finishedOrders,
  }),
);

export default function OrdersPage() {
  const { setPausedOrders, setProcessOrders, setFinishedOrders } =
    actionDispatch(useDispatch());
  const { orderBuilder, authMember } = useGlobals();
  const { pausedOrders, processOrders, finishedOrders } = useSelector(
    ordersSummaryRetriever,
  );
  const history = useHistory();
  const [value, setValue] = useState("1");
  const [orderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });

  useEffect(() => {
    const order = new OrderService();

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE })
      .then((data) => setPausedOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS })
      .then((data) => setProcessOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH })
      .then((data) => setFinishedOrders(data))
      .catch((err) => console.log(err));
  }, [orderInquiry, orderBuilder]);

  /** HANDLERS **/

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (!authMember) history.push("/");
  return (
    <div className="order-page">
      <Container className="order-container">
        <Stack className="order-left">
          <Box className="order-page-head">
            <span className="order-kicker">FitShop Orders</span>
            <Box className="order-title-row">
              <Box>
                <h1>Order Command Center</h1>
                <p>
                  Track baskets, active deliveries, and completed FitShop
                  purchases in one clean workflow.
                </p>
              </Box>
              <Box className="order-total-chip">
                <ReceiptLongIcon />
                <span>
                  {(pausedOrders?.length || 0) +
                    (processOrders?.length || 0) +
                    (finishedOrders?.length || 0)}
                </span>
                <small>Total</small>
              </Box>
            </Box>
          </Box>
          <TabContext value={value}>
            <Box className="order-nav-frame">
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  className="table_list"
                >
                  <Tab
                    icon={<Inventory2Icon />}
                    iconPosition="start"
                    label={`Paused (${pausedOrders?.length || 0})`}
                    value={"1"}
                  />
                  <Tab
                    icon={<LocalShippingIcon />}
                    iconPosition="start"
                    label={`Processing (${processOrders?.length || 0})`}
                    value={"2"}
                  />
                  <Tab
                    icon={<CheckCircleIcon />}
                    iconPosition="start"
                    label={`Finished (${finishedOrders?.length || 0})`}
                    value={"3"}
                  />
                </Tabs>
              </Box>
            </Box>
            <Stack className="order-main-content">
              <PausedOrders setValue={setValue} />
              <ProcessOrders setValue={setValue} />
              <FinishedOrders />
            </Stack>
          </TabContext>
        </Stack>

        <Stack className="order-right">
          <Box className="order-info-box">
            <Box className="member-box">
              <div className="order-user-img">
                <img
                  src={
                    authMember?.memberImage
                      ? `${serverApi}/${authMember.memberImage}`
                      : "/icons/default-user.svg"
                  }
                  alt=""
                  className="order-user-avatar"
                />
                <div className="order-user-icon-box">
                  <img
                    src={
                      authMember?.memberType === MemberType.USER
                        ? "/icons/user-badge.svg"
                        : "/icons/user.svg"
                    }
                    alt=""
                    className="order-user-prof-img"
                  />
                </div>
              </div>
              <span className="order-user-name">{authMember?.memberNick}</span>
              <span className="order-user-prof">
                {getFitShopMemberLabel(authMember?.memberType)}
              </span>
            </Box>
            <Box className="liner" />
            <Box className="order-user-address">
              <div className="order-address-line" style={{ display: "flex" }}>
                <LocationOnIcon />
                <p className="spec-address-text">
                  {authMember?.memberAddress
                    ? authMember.memberAddress
                    : "Do not exist"}
                </p>
              </div>
            </Box>
          </Box>

          <Box className="card-input">
            <Box className="payment-head">
              <CreditCardIcon />
              <Box>
                <strong>Payment Method</strong>
                <span>Saved checkout details</span>
              </Box>
            </Box>
            <Box className="card-num-input">
              <input
                type="text"
                placeholder="Card number : **** 4090 2002 7495"
                className="card-number"
              />
            </Box>
            <Box className="card-info-input">
              <input type="text" placeholder="07 / 24" className="card-data" />
              <input type="text" placeholder="CVV : 010" className="card-cvc" />
            </Box>
            <Box className="card-user-info">
              <input
                type="text"
                placeholder="Justin Robertson"
                className="card-user"
              />
            </Box>
            <Stack className="cards-img">
              <img src="/icons/western-card.svg" alt="" className="card-icon" />
              <img src="/icons/master-card.svg" alt="" className="card-icon" />
              <img src="/icons/paypal-card.svg" alt="" className="card-icon" />
              <img src="/icons/visa-card.svg" alt="" className="card-icon" />
            </Stack>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
