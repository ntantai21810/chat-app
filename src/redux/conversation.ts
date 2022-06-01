import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IConversation } from "./../models/Conversation";

interface IConversationState {
  conversations: {
    [userId: string]: IConversation;
  };
  activeConversationId: string;
}

const initialState: IConversationState = {
  conversations: {},
  activeConversationId: "",
};

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

        state.conversations = {
          ...state.conversations,
          ...data,
        };
      } else {
        state.conversations[action.payload.user._id] = action.payload;
      }
    },

    updateConversation(state, action: PayloadAction<Partial<IConversation>>) {
      if (action.payload.user?._id) {
        state.conversations[action.payload.user._id] = {
          ...state.conversations[action.payload.user._id],
          ...action.payload,
        };
      }
    },

    setActiveConversation(state, action: PayloadAction<string>) {
      state.activeConversationId = action.payload;
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
  setActiveConversation,
} = conversationSlice.actions;

export default conversationReducer;
