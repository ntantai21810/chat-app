import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth";
import conversationReducer from "./conversation";
import messageReducer from "./message";
import onlineUserReducer from "./onlineUser";
import socketReducer from "./socket";

const rootReducer = combineReducers({
  auth: authReducer,
  onlineUser: onlineUserReducer,
  message: messageReducer,
  conversation: conversationReducer,
  socket: socketReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export { store };

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
