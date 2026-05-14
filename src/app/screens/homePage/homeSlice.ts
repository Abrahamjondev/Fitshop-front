import { createSlice } from "@reduxjs/toolkit";
import { HomeState } from "../../../lib/types/screen";

const initialState: HomeState = {
  products: [],
  heroData: [],
  loading: false,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setHeroData: (state, action) => {
      state.heroData = action.payload;
    },
    setHomeLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setProducts, setHeroData, setHomeLoading } = homeSlice.actions;

const homeReducer = homeSlice.reducer;
export default homeReducer;
