import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectOrdersPage = (state: AppRootState) => state.ordersPage;

export const retrievePausedOrders = createSelector(
  selectOrdersPage,
  (ordersPage) => ordersPage.pausedOrders,
);

export const retrievePausedTotal = createSelector(
  selectOrdersPage,
  (ordersPage) => ordersPage.pausedTotal,
);

export const retrieveProcessOrders = createSelector(
  selectOrdersPage,
  (ordersPage) => ordersPage.processOrders,
);

export const retrieveProcessTotal = createSelector(
  selectOrdersPage,
  (ordersPage) => ordersPage.processTotal,
);

export const retrieveFinishedOrders = createSelector(
  selectOrdersPage,
  (ordersPage) => ordersPage.finishedOrders,
);

export const retrieveFinishedTotal = createSelector(
  selectOrdersPage,
  (ordersPage) => ordersPage.finishedTotal,
);
