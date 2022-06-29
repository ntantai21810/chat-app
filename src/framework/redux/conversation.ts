import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { IConversation } from "./../../domains/Conversation/IConversation";
import { defaultActions } from "./defaultActions";
import { RootState } from "./store";

const conversationAdapter = createEntityAdapter<IConversation>({
  selectId: (message) => message.id!,
  sortComparer: (a, b) =>
    new Date(b.lastMessage.sendTime).getTime() -
    new Date(a.lastMessage.sendTime).getTime(),
});

const messageSlice = createSlice({
  name: "conversation",
  initialState: conversationAdapter.getInitialState(),
  reducers: {
    ...defaultActions(conversationAdapter),
  },
});

const conversationReducer = messageSlice.reducer;

export const {
  removeAll: removeAllConversation,
  addMany: addManyConversation,
  addOne: addOneConversation,
  updateOne: updateOneConversation,
} = messageSlice.actions;

export const { selectAll: selectAllConversation } =
  conversationAdapter.getSelectors((state: RootState) => state.conversation);

export { conversationReducer };
