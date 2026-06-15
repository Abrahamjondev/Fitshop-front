import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectProductsPage = (state: AppRootState) => state.productsPage;

export const retrieveShop = createSelector(
  selectProductsPage,
  (productsPage) => productsPage.shop,
);

export const retrieveChosenProduct = createSelector(
  selectProductsPage,
  (productsPage) => productsPage.chosenProduct,
);

export const retrieveProducts = createSelector(
  selectProductsPage,
  (productsPage) => productsPage.products,
);

export const retrieveProductsTotal = createSelector(
  selectProductsPage,
  (productsPage) => productsPage.productsTotal,
);
