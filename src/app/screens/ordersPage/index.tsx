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
  retrievePausedTotal,
  retrieveProcessTotal,
  retrieveFinishedTotal,
} from "./selector";

import "../../../css/order.css";

import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory } from "react-router-dom";
import { getMemberImage } from "../../../lib/utils";
import { MemberType } from "../../../lib/enums/member.enum";
import { OrdersResult } from "../../../lib/types/orders";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { createSelector } from "reselect";

const ORDERS_PER_PAGE = 5;

function getFitShopMemberLabel(memberType?: MemberType) {
  if (memberType === MemberType.SHOP) return "FitShop Partner";
  return "FitShop Member";
}

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: OrdersResult) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: OrdersResult) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: OrdersResult) => dispatch(setFinishedOrders(data)),
});

const ordersTotalsRetriever = createSelector(
  retrievePausedTotal,
  retrieveProcessTotal,
  retrieveFinishedTotal,
  (pausedTotal, processTotal, finishedTotal) => ({
    pausedTotal,
    processTotal,
    finishedTotal,
  }),
);

export default function OrdersPage() {
  const { setPausedOrders, setProcessOrders, setFinishedOrders } =
    actionDispatch(useDispatch());
  const { orderBuilder, authMember } = useGlobals();
  const { pausedTotal, processTotal, finishedTotal } = useSelector(
    ordersTotalsRetriever,
  );
  const history = useHistory();
  const [value, setValue] = useState("1");
  const [pausedPage, setPausedPage] = useState(1);
  const [processPage, setProcessPage] = useState(1);
  const [finishedPage, setFinishedPage] = useState(1);

  // Auth guard — render paytida emas, effect ichida redirect qilamiz
  useEffect(() => {
    if (!authMember) history.push("/");
  }, [authMember, history]);

  useEffect(() => {
    if (!authMember) return;
    const order = new OrderService();

    order
      .getMyOrders({
        page: pausedPage,
        limit: ORDERS_PER_PAGE,
        orderStatus: OrderStatus.PAUSE,
      })
      .then((data) => setPausedOrders(data))
      .catch((err) => console.error(err));

    order
      .getMyOrders({
        page: processPage,
        limit: ORDERS_PER_PAGE,
        orderStatus: OrderStatus.PROCESS,
      })
      .then((data) => setProcessOrders(data))
      .catch((err) => console.error(err));

    order
      .getMyOrders({
        page: finishedPage,
        limit: ORDERS_PER_PAGE,
        orderStatus: OrderStatus.FINISH,
      })
      .then((data) => setFinishedOrders(data))
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authMember, orderBuilder, pausedPage, processPage, finishedPage]);

  /** HANDLERS **/

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (!authMember) return null;

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
                <span>{pausedTotal + processTotal + finishedTotal}</span>
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
                  aria-label="Order status tabs"
                  className="table_list"
                >
                  <Tab
                    icon={<Inventory2Icon />}
                    iconPosition="start"
                    label={`Paused (${pausedTotal})`}
                    value={"1"}
                  />
                  <Tab
                    icon={<LocalShippingIcon />}
                    iconPosition="start"
                    label={`Processing (${processTotal})`}
                    value={"2"}
                  />
                  <Tab
                    icon={<CheckCircleIcon />}
                    iconPosition="start"
                    label={`Finished (${finishedTotal})`}
                    value={"3"}
                  />
                </Tabs>
              </Box>
            </Box>
            <Stack className="order-main-content">
              <PausedOrders
                setValue={setValue}
                page={pausedPage}
                limit={ORDERS_PER_PAGE}
                onPageChange={setPausedPage}
              />
              <ProcessOrders
                setValue={setValue}
                page={processPage}
                limit={ORDERS_PER_PAGE}
                onPageChange={setProcessPage}
              />
              <FinishedOrders
                page={finishedPage}
                limit={ORDERS_PER_PAGE}
                onPageChange={setFinishedPage}
              />
            </Stack>
          </TabContext>
        </Stack>

        <Stack className="order-right">
          <Box className="order-info-box">
            <Box className="member-box">
              <div className="order-user-img">
                <img
                  src={getMemberImage(authMember)}
                  alt=""
                  className="order-user-avatar"
                  onError={(event) => {
                    event.currentTarget.src = "/icons/default-user.svg";
                  }}
                />
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
                    : "No address yet"}
                </p>
              </div>
            </Box>
          </Box>

          <Box className="card-input">
            <Box className="payment-head">
              <CreditCardIcon />
              <Box>
                <strong>Payment Method</strong>
                <span>Cash on delivery is used for now</span>
              </Box>
            </Box>
            <Box className="card-num-input">
              <input
                type="text"
                placeholder="Card number (coming soon)"
                className="card-number"
                disabled
              />
            </Box>
            <Box className="card-info-input">
              <input
                type="text"
                placeholder="MM / YY"
                className="card-data"
                disabled
              />
              <input
                type="text"
                placeholder="CVV"
                className="card-cvc"
                disabled
              />
            </Box>
            <Box className="card-user-info">
              <input
                type="text"
                placeholder="Cardholder name"
                className="card-user"
                disabled
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
