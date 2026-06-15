import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectHome = (state: AppRootState) => state.home;

export const retrieveTopProducts = createSelector(
  selectHome,
  (home) => home.topProducts,
);

export const retrieveTopUsers = createSelector(
  selectHome,
  (home) => home.topUsers,
);
