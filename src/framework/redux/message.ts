import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage } from "../../domains/Message";

interface IMessageState {
  message: {
    [userId: string]: IMessage[];
  };
  isLoading: boolean;
  isDbLoaded: boolean;
  error: string;
}

interface IPayload {
  userId: string;
  message: IMessage | IMessage[];
}

const initialState: IMessageState = {
  message: {},
  isLoading: false,
  isDbLoaded: false,
  error: "",
};

const messageSlice = createSlice({
  name: "message",
  initialState: initialState,
  reducers: {
    addMessage(state, action: PayloadAction<IPayload>) {
      if (Array.isArray(action.payload.message)) {
        if (state.message[action.payload.userId]) {
          state.message[action.payload.userId] = state.message[
            action.payload.userId
          ].concat(action.payload.message);
        } else {
          state.message[action.payload.userId] = [...action.payload.message];
        }
      } else {
        if (state.message[action.payload.userId]) {
          state.message[action.payload.userId].push(action.payload.message);
        } else {
          state.message[action.payload.userId] = [action.payload.message];
        }
      }
    },

    setMessage(state, action: PayloadAction<IPayload>) {
      if (Array.isArray(action.payload.message)) {
        if (state.message[action.payload.userId]) {
          state.message[action.payload.userId] = action.payload.message;
        } else {
          state.message[action.payload.userId] = [...action.payload.message];
        }
      } else {
        state.message[action.payload.userId] = [action.payload.message];
      }
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setDBLoaded(state, action: PayloadAction<boolean>) {
      state.isDbLoaded = action.payload;
    },

    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    reset() {
      return initialState;
    },
  },
});

const messageReducer = messageSlice.reducer;

export const {
  reset: resetAllMessage,
  addMessage,
  setMessage,
  setLoading: setMessageLoading,
  setDBLoaded: setMessageDBLoaded,
  setError: setMessageError,
} = messageSlice.actions;

export default messageReducer;
