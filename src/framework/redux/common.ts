import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ICommonState {
  isSocketConnected: boolean;
  isDatabaseConnected: boolean;
}

const initialState: ICommonState = {
  isSocketConnected: false,
  isDatabaseConnected: false,
};

const commonSlice = createSlice({
  name: "common",
  initialState: initialState,
  reducers: {
    setSocketConnect(state, action: PayloadAction<boolean>) {
      state.isSocketConnected = action.payload;
    },

    setDatabaseConnect(state, action: PayloadAction<boolean>) {
      state.isDatabaseConnected = action.payload;
    },

    reset() {
      return initialState;
    },
  },
});

const commonReducer = commonSlice.reducer;

export const {
  reset: resetCommon,
  setSocketConnect,
  setDatabaseConnect,
} = commonSlice.actions;

export default commonReducer;
