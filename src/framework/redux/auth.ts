import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuth } from "../../domains/Auth";

export interface IAuthState {
  auth: IAuth;
  error: string;
  isLogging: boolean;
}

const initialState: IAuthState = {
  auth: {
    user: {
      _id: "",
      fullName: "",
      phone: "",
      avatar: "",
    },
    accessToken: "",
  },
  error: "",
  isLogging: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAuth(state, action: PayloadAction<IAuth>) {
      state.auth = action.payload;
    },

    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    setisLogging(state, action: PayloadAction<boolean>) {
      state.isLogging = action.payload;
    },

    reset() {
      return initialState;
    },
  },
});

const authReducer = authSlice.reducer;

export const {
  reset: resetAuth,
  setAuth,
  setError: setAuthError,
  setisLogging: setAuthIsLogging,
} = authSlice.actions;

export default authReducer;
