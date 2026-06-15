import { createSlice } from "@reduxjs/toolkit";
import { ProductsPageState } from "../../../lib/types/screen";

const initialState: ProductsPageState = {
  shop: null,
  chosenProduct: null,
  products: [],
  productsTotal: 0,
};

const productsPageSlice = createSlice({
  name: "productsPage",
  initialState,
  reducers: {
    setShop: (state, action) => {
      state.shop = action.payload;
    },
    setChosenProduct: (state, action) => {
      state.chosenProduct = action.payload;
    },
    // payload: { list, total }
    setProducts: (state, action) => {
      state.products = action.payload.list;
      state.productsTotal = action.payload.total;
    },
  },
});

export const { setShop, setChosenProduct, setProducts } =
  productsPageSlice.actions;

const ProductsPageReducer = productsPageSlice.reducer;
export default ProductsPageReducer;
