import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuth } from "../models/Auth";

const initialState: IAuth = {
  _id: "",
  phone: "",
  fullName: "",
  accessToken: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    set(_, action: PayloadAction<IAuth>) {
      return action.payload;
    },

    update(state, action: PayloadAction<Partial<IAuth>>) {
      return {
        ...state,
        ...action.payload,
      };
    },

    reset() {
      return initialState;
    },
  },
});

const authReducer = authSlice.reducer;

export const {
  reset: resetAuth,
  set: setAuth,
  update: updateAuth,
} = authSlice.actions;

export default authReducer;
