import { createSlice } from "@reduxjs/toolkit";

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
}

const initialState: AppMetaState = {
  width: 450,
  token: null,
  user: null,
  locale: "en",
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
