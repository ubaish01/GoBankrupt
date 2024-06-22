import { createSlice } from "@reduxjs/toolkit";
import { userType, walletType } from "../../types";

export interface RootState {
  user?: userType;
  login: Boolean;
  timerActive: Boolean;
  wallet: walletType;
}

const initialState = {
  user: null,
  login: false,
  timerActive: false,
  wallet: { balance: 0 },
};

export const userSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    user: (state, action) => {
      state.user = action.payload;
    },
    login: (state, action) => {
      state.login = action.payload;
    },
    timerActive: (state, action) => {
      state.timerActive = action.payload;
    },
    wallet: (state, action) => {
      state.wallet = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { user, login, timerActive, wallet } = userSlice.actions;

export default userSlice.reducer;
