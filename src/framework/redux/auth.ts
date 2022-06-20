import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuth } from "../../domains/Auth";

export interface IAuthState {
  auth: IAuth;
  error: string;
  isLoggingIn: boolean;
  isLoadingAuth: boolean;
  isLoggingOut: boolean;
}

const initialState: IAuthState = {
  auth: {
    user: {
      _id: "",
      fullName: "",
      phone: "",
      avatar: "",
      // lastOnlineTime: "",
    },
    accessToken: "",
  },
  error: "",
  isLoggingIn: false,
  isLoadingAuth: true,
  isLoggingOut: false,
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

    setIsLoggingIn(state, action: PayloadAction<boolean>) {
      state.isLoggingIn = action.payload;
    },

    setIsLoadingAuth(state, action: PayloadAction<boolean>) {
      state.isLoadingAuth = action.payload;
    },

    setIsLoggingOut(state, action: PayloadAction<boolean>) {
      state.isLoggingOut = action.payload;
    },

    logout() {
      return {
        auth: {
          user: {
            _id: "",
            fullName: "",
            phone: "",
            avatar: "",
            // lastOnlineTime: "",
          },
          accessToken: "",
        },
        error: "",
        isLoggingIn: false,
        isLoadingAuth: false,
        isLoggingOut: false,
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
  setAuth,
  setError: setAuthError,
  setIsLoggingIn: setAuthIsLoggingIn,
  setIsLoadingAuth: setAuthIsLoading,
  setIsLoggingOut: setAuthIsLoggingOut,
  logout,
} = authSlice.actions;

export default authReducer;
