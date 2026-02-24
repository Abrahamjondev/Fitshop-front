import React from "react";
import { TabPanel } from "@mui/lab";
import { Box, Button, Stack } from "@mui/material";

export default function FinishedOrders() {
  return (
    <TabPanel value={"3"}>
      <Stack>
        {[].map((ele, index) => {
          return (
            <Box key={index} className={"order-main-box"}>
              <Box className={"order-box-scroll"}>
                {[1, 2, 3].map((ele2, index2) => {
                  return (
                    <Box key={index2} className={"orders-name-price"}>
                      <img
                        src={"/img/lavash.webp"}
                        className={"order-dish-img"}
                        alt=""
                      />
                      <p className={"title-dish"}>Lavash</p>
                      <Box className={"price-box"}>
                        <p style={{ marginRight: "15px" }}>$9</p>
                        <img src={"/icons/close.svg"} />
                        <p style={{ margin: "0 15px" }}>2</p>
                        <img src={"/icons/pause.svg"} />
                        <p style={{ marginLeft: "15px" }}>$24</p>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Box className={"total-price-box"}>
                <Box className={"box-total"}>
                  <p>Product price</p>
                  <p style={{ marginLeft: "15px" }}>$18</p>
                  <img src={"/icons/plus.svg"} style={{ margin: "0 15px" }} />
                  <p>Delivery cost</p>
                  <p style={{ marginLeft: "15px" }}>$2</p>
                  <img src={"/icons/pause.svg"} style={{ margin: "0 15px" }} />
                  <p>Total</p>
                  <p style={{ marginLeft: "15px" }}>$65</p>
                </Box>
              </Box>
            </Box>
          );
        })}

        {true && (
          <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
            <img
              src="/icons/noimage-list.svg"
              style={{ width: 300, height: 300 }}
              alt=""
            />
          </Box>
        )}
      </Stack>
    </TabPanel>
  );
}
