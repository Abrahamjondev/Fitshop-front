import { createSlice } from "@reduxjs/toolkit";
import { OrdersPageState } from "../../../lib/types/screen";

const initialState: OrdersPageState = {
  pausedOrders: [],
  pausedTotal: 0,
  processOrders: [],
  processTotal: 0,
  finishedOrders: [],
  finishedTotal: 0,
};

const OrdersPageSlice = createSlice({
  name: "ordersPage",
  initialState,
  reducers: {
    // payload: { list, total }
    setPausedOrders: (state, action) => {
      state.pausedOrders = action.payload.list;
      state.pausedTotal = action.payload.total;
    },
    setProcessOrders: (state, action) => {
      state.processOrders = action.payload.list;
      state.processTotal = action.payload.total;
    },
    setFinishedOrders: (state, action) => {
      state.finishedOrders = action.payload.list;
      state.finishedTotal = action.payload.total;
    },
  },
});

export const { setPausedOrders, setProcessOrders, setFinishedOrders } =
  OrdersPageSlice.actions;

const OrdersPageReducer = OrdersPageSlice.reducer;
export default OrdersPageReducer;
