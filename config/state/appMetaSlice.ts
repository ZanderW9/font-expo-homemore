import { createSlice } from "@reduxjs/toolkit";
import React from "react";
import { Dimensions } from "react-native";

// 这是一个全局的状态管理，用于存储一些全局的状态，比如用户信息，页面宽度等

interface AppMetaState {
  width: number;
  token: string | null;
  user: {
    id: string;
    userName: string;
    avatar: string;
    createdAt: string;
  } | null;
  locale: string;
  dialogComponent: React.ReactNode | null;
  openDialog: boolean;
}

const initialState: AppMetaState = {
  width: Dimensions.get("window").width,
  token: null,
  user: null,
  locale: "en",
  dialogComponent: null,
  openDialog: false,
};

export const appMetaSlice = createSlice({
  name: "appMeta",
  initialState,
  reducers: {
    updateAppMeta: (state, action) => {
      return { ...state, ...action.payload };
    },
    signOut: (state) => {
      return { ...state, user: null, token: null };
    },
    default: (state) => state,
  },
});

export const { updateAppMeta, signOut } = appMetaSlice.actions;

export default appMetaSlice.reducer;
