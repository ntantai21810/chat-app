import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Moment } from "../../helper/configs/moment";
import { IConversation } from "./../../domains/Conversation/IConversation";
import { defaultActions } from "./defaultActions";
import { RootState } from "./store";

const conversationAdapter = createEntityAdapter<IConversation>({
  selectId: (message) => message.id!,
  sortComparer: (a, b) =>
    Moment(a.lastMessage.sendTime).unix() -
    Moment(b.lastMessage.sendTime).unix(),
});

const messageSlice = createSlice({
  name: "conversation",
  initialState: conversationAdapter.getInitialState(),
  reducers: {
    ...defaultActions(conversationAdapter),
  },
});

const messageReducer = messageSlice.reducer;

export const {
  removeAll: removeAllConversation,
  addMany: addManyConversation,
  addOne: addOneConversation,
  updateOne: updateOneConversation,
} = messageSlice.actions;

export const { selectAll: selectAllConversation } =
  conversationAdapter.getSelectors((state: RootState) => state.conversation);

export default messageReducer;
