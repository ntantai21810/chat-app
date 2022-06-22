import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { IMessage } from "../../domains/Message";
import { Moment } from "../../helper/configs/moment";
import { defaultActions } from "./defaultActions";
import { RootState } from "./store";

const messageAdapter = createEntityAdapter<IMessage>({
  selectId: (message) => message.id!,
  sortComparer: (m1, m2) =>
    Moment(m1.sendTime).unix() - Moment(m2.sendTime).unix(),
});

const messageSlice = createSlice({
  name: "message",
  initialState: messageAdapter.getInitialState(),
  reducers: {
    ...defaultActions(messageAdapter),
  },
});

const messageReducer = messageSlice.reducer;

export const {
  removeAll: removeAllMessage,
  addMany: addManyMessage,
  addOne: addOneMessage,
} = messageSlice.actions;

export const { selectAll: selectAllMessages } = messageAdapter.getSelectors(
  (state: RootState) => state.message
);

export default messageReducer;
