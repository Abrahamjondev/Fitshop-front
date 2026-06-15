import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import homeReducer from "./screens/homePage/homeSlice";
import reduxLogger from "redux-logger";
import ProductsPageReducer from "./screens/productsPage/slice";
import OrdersPageReducer from "./screens/ordersPage/slice";

const isDev = process.env.NODE_ENV === "development";

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    isDev
      ? getDefaultMiddleware().concat(reduxLogger as any)
      : getDefaultMiddleware(),

  reducer: {
    home: homeReducer,
    productsPage: ProductsPageReducer,
    ordersPage: OrdersPageReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
