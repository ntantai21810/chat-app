import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ISocketState {
  isConnected: boolean;
}

const initialState: ISocketState = {
  isConnected: false,
};

const socketSlice = createSlice({
  name: "socket",
  initialState: initialState,
  reducers: {
    setConnect(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },

    reset() {
      return initialState;
    },
  },
});

const socketReducer = socketSlice.reducer;

export const { reset: resetSocket, setConnect: setSocketConnect } =
  socketSlice.actions;

export default socketReducer;
