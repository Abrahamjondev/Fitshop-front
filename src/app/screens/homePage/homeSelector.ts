import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectHome = (state: AppRootState) => state.home;

export const selectProducts = createSelector(
  selectHome,
  (home) => home.products,
);

export const selectHeroData = createSelector(
  selectHome,
  (home) => home.heroData,
);

export const selectHomeLoading = createSelector(
  selectHome,
  (home) => home.loading,
);
