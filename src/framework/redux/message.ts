import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage } from "../../domains/Message";
import { Moment } from "../../helper/configs/moment";

interface IMessageState {
  [userId: string]: IMessage[];
}

const initialState: IMessageState = {};

const messageSlice = createSlice({
  name: "message",
  initialState: initialState,
  reducers: {
    addBySend(state, action: PayloadAction<IMessage>) {
      if (state[action.payload.toId])
        state[action.payload.toId].push(action.payload);
      else state[action.payload.toId] = [action.payload];
    },

    addByReceive(state, action: PayloadAction<IMessage>) {
      if (state[action.payload.fromId])
        state[action.payload.fromId].push(action.payload);
      else state[action.payload.fromId] = [action.payload];
    },

    addMany(
      state,
      action: PayloadAction<{
        toUserId: string;
        messages: IMessage[];
      }>
    ) {
      const newState = (state[action.payload.toUserId] ?? []).concat(
        action.payload.messages
      );

      newState.sort(
        (a, b) => Moment(a.sendTime).valueOf() - Moment(b.sendTime).valueOf()
      );

      state[action.payload.toUserId] = newState;
    },

    reset() {
      return initialState;
    },
  },
});

const messageReducer = messageSlice.reducer;

export const {
  reset: resetAllMessage,
  addBySend: addMessageBySend,
  addByReceive: addMessageByReceive,
  addMany: addManyMessage,
} = messageSlice.actions;

export default messageReducer;
