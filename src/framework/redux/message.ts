import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage } from "../../domains/Message";

const initialState: IMessage[] = [];

const messageSlice = createSlice({
  name: "message",
  initialState: initialState,
  reducers: {
    removeAll() {
      return initialState;
    },

    addMany(state, action: PayloadAction<IMessage[]>) {
      return [...state, ...action.payload].sort(
        (m1, m2) =>
          new Date(m1.sendTime).getTime() - new Date(m2.sendTime).getTime()
      );
    },
    addOne(state, action: PayloadAction<IMessage>) {
      return [...state, action.payload].sort(
        (m1, m2) =>
          new Date(m1.sendTime).getTime() - new Date(m2.sendTime).getTime()
      );
    },
    updateOne(state, action: PayloadAction<IMessage>) {
      return state.map((item) =>
        item.clientId === action.payload.clientId ? action.payload : item
      );
    },

    removeOne(state, action: PayloadAction<IMessage>) {
      return state.filter((item) => item.clientId !== action.payload.clientId);
    },
  },
});

const messageReducer = messageSlice.reducer;

export const {
  removeAll: removeAllMessage,
  addMany: addManyMessage,
  addOne: addOneMessage,
  updateOne: updateOneMessage,
  removeOne: removeOneMessage,
} = messageSlice.actions;

export { messageReducer };
