import { IUser } from "./../models/User";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { defaultActions } from "../utils/defaultActions";
import { RootState } from "./store";

const onlineUserAdapter = createEntityAdapter<IUser>({
  selectId: (user) => user._id,
});

const onlineUserSlice = createSlice({
  name: "onlineUser",
  initialState: onlineUserAdapter.getInitialState(),
  reducers: {
    ...defaultActions(onlineUserAdapter),
  },
});

const onlineUserReducer = onlineUserSlice.reducer;

export default onlineUserReducer;

export const {
  addOne: addOneOnlineUser,
  updateOne: updateOneOnlineUser,
  removeOne: removeOneOnlineUser,
  addMany: addManyOnlineUser,
} = onlineUserSlice.actions;

export const {
  selectById: selectOnlineUserById,
  selectAll: selectAllOnlineUsers,
  selectTotal: selectTotalOnlineUsers,
} = onlineUserAdapter.getSelectors((state: RootState) => state.onlineUser);
