import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth";
import { commonReducer } from "./common";
import { conversationReducer } from "./conversation";
import { friendReducer } from "./friend";
import { messageReducer } from "./message";

const rootReducer = combineReducers({
  auth: authReducer,
  message: messageReducer,
  conversation: conversationReducer,
  common: commonReducer,
  friend: friendReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export { store };

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
