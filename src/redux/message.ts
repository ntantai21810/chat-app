import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage } from "../models/Message";

interface IMessageState {
  [userId: string]: IMessage[];
}

const initialState: IMessageState = {};

const messageSlice = createSlice({
  name: "message",
  initialState: initialState,
  reducers: {
    add(state, action: PayloadAction<IMessage>) {
      if (state[action.payload.toId]) {
        state[action.payload.toId].push(action.payload);
      } else {
        state[action.payload.toId] = [action.payload];
      }
    },

    reset() {
      return initialState;
    },
  },
});

const messageReducer = messageSlice.reducer;

export const { reset: resetAllMessage, add: addMessage } = messageSlice.actions;

export default messageReducer;
