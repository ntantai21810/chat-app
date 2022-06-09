import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IConversation } from "../../domains/Conversation";

interface IConversationState {
  conversations: {
    [userId: string]: IConversation;
  };
  error: string;
  isLoading: boolean;
  isDbLoaded: boolean;
}

const initialState: IConversationState = {
  conversations: {},
  error: "",
  isLoading: false,
  isDbLoaded: false,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState: initialState,
  reducers: {
    setConversations(state, action: PayloadAction<IConversation[]>) {
      const data: { [userId: string]: IConversation } = {};

      for (let conversation of action.payload) {
        data[conversation.user._id] = conversation;
      }

      state.conversations = data;
    },

    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setisDBLoaded(state, action: PayloadAction<boolean>) {
      state.isDbLoaded = action.payload;
    },

    reset() {
      return initialState;
    },
  },
});

const conversationReducer = conversationSlice.reducer;

export const {
  reset: resetConversations,
  setConversations,
  setError: setConversationError,
  setLoading: setConversationLoading,
  setisDBLoaded: setConversationDBLoaded,
} = conversationSlice.actions;

export default conversationReducer;
