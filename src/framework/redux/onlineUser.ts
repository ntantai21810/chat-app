import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../domains/User";
import { defaultActions } from "./defaultActions";
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
  removeAll: removeAllOnlineUser,
  addMany: addManyOnlineUser,
} = onlineUserSlice.actions;

export const {
  selectById: selectOnlineUserById,
  selectAll: selectAllOnlineUsers,
  selectTotal: selectTotalOnlineUsers,
} = onlineUserAdapter.getSelectors((state: RootState) => state.onlineUser);
