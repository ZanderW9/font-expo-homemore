import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import appMeta from "@/config/state/appMetaSlice";
import listingDetail from "@/config/state/listing/listingDetailSlice";

export const store = configureStore({
  reducer: {
    appMeta,
    listingDetail,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { useDispatch, useSelector };
