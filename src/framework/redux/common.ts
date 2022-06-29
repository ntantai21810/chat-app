import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ICommonState {
  isSocketConnected: boolean;
  isDatabaseConnected: boolean;
  showNotification: boolean;
}

const initialState: ICommonState = {
  isSocketConnected: false,
  isDatabaseConnected: false,
  showNotification: false,
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

    setShowNotification(state, action: PayloadAction<boolean>) {
      state.showNotification = action.payload;
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
  setShowNotification,
} = commonSlice.actions;

export { commonReducer };
