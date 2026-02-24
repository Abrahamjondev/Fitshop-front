import { SyntheticEvent, useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import "../../../css/order.css";

export default function OrdersPage() {
  const [value, setValue] = useState("1");

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className={"order-page"}>
      <Container className={"order-container"}>
        <Stack className={"order-left"}>
          <TabContext value={value}>
            <Box className={"order-nav-frame"}>
              <Box sx={{ borderBottom: 2, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  className={"table_list"}
                  sx={{ mb: 1 }}
                >
                  <Tab label="PAUSED ORDERS" value={"1"} />
                  <Tab label="PROCESS ORDERS" value={"2"} />
                  <Tab label="FINISHED ORDERS" value={"3"} />
                </Tabs>
              </Box>
            </Box>
            <Stack className={"order-main-content"}>
              <PausedOrders />
              <ProcessOrders />
              <FinishedOrders />
            </Stack>
          </TabContext>
        </Stack>

        <Stack className={"order-right"}>
          <Box className={"order-info-box"}>
            <Box className={"member-box"}>
              <div className={"order-user-img"}>
                <img
                  src={"/img/justin.webp"}
                  alt=""
                  className={"order-user-avatar"}
                />
                <div className={"order-user-icon-box"}>
                  <img
                    src={"/icons/user-badge.svg"}
                    alt=""
                    className={"order-user-prof-img"}
                  />
                </div>
              </div>
              <span className={"order-user-name"}>ABRAHAM</span>
              <span className={"order-user-prof"}>USER</span>
            </Box>
            <Box className={"liner"}></Box>
            <Box className={"order-user-address"}>
              <div style={{ display: "flex" }}>
                <LocationOnIcon />
                <span>Uzbekistan, Fergana</span>
              </div>
            </Box>
          </Box>
          <Box className={"order-card-box"}>
            <Box className={"order-card-input-box"}>
              <input
                type="text"
                className={"single-input"}
                placeholder="Card Number 5555 7777 8888 9999"
              />
              <div className={"half-input-box"}>
                <input
                  type="text"
                  className={"half-input"}
                  placeholder="07/24"
                />
                <input
                  type="text"
                  className={"half-input"}
                  placeholder="CVV: 010"
                />
              </div>
              <input
                type="text"
                className={"single-input"}
                placeholder="ABRAHAM "
              />
            </Box>
            <Box className={"order-card-img-box"}>
              <img src="/icons/western-card.svg" alt="" />
              <img src="/icons/master-card.svg" alt="" />
              <img src="/icons/paypal-card.svg" alt="" />
              <img src="/icons/visa-card.svg" alt="" />
            </Box>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
