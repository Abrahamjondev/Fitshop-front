import { createSlice } from "@reduxjs/toolkit";
import { HomeState } from "../../../lib/types/screen";

const initialState: HomeState = {
  topProducts: [],
  topUsers: [],
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setTopProducts: (state, action) => {
      state.topProducts = action.payload;
    },
    setTopUsers: (state, action) => {
      state.topUsers = action.payload;
    },
  },
});

export const { setTopProducts, setTopUsers } = homeSlice.actions;

const homeReducer = homeSlice.reducer;
export default homeReducer;
