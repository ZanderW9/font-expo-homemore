import { createSlice } from "@reduxjs/toolkit";

// 管理detail page的状态

interface listingDetailState {
  id: string;
}

const initialState: listingDetailState = {
  id: "",
};

export const listingDetailSlice = createSlice({
  name: "listingDetail",
  initialState,
  reducers: {
    update: (state, action) => {
      return { ...state, ...action.payload };
    },
    default: (state) => state,
  },
});

export const { update } = listingDetailSlice.actions;

export default listingDetailSlice.reducer;
