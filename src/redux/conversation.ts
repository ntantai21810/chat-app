import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IConversation } from "./../models/Conversation";

interface IConversationState {
  [userId: string]: IConversation;
}

const initialState: IConversationState = {};

const conversationSlice = createSlice({
  name: "conversation",
  initialState: initialState,
  reducers: {
    add(state, action: PayloadAction<IConversation | IConversation[]>) {
      if (Array.isArray(action.payload)) {
        const data = action.payload.reduce(
          (prev, conversation) => ({
            ...prev,
            [conversation.user._id]: conversation,
          }),
          {}
        );

        return {
          ...state,
          ...data,
        };
      } else {
        state[action.payload.user._id] = action.payload;
      }
    },

    updateConversation(state, action: PayloadAction<Partial<IConversation>>) {
      if (action.payload.user?._id) {
        state[action.payload.user._id] = {
          ...state[action.payload.user._id],
          ...action.payload,
        };
      }
    },

    reset() {
      return initialState;
    },
  },
});

const conversationReducer = conversationSlice.reducer;

export const {
  reset: resetAllConversation,
  add: addConversation,
  updateConversation,
} = conversationSlice.actions;

export default conversationReducer;
