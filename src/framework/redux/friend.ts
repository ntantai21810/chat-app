import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../domains";
import { defaultActions } from "./defaultActions";
import { RootState } from "./store";

const friendAdapter = createEntityAdapter<IUser>({
  selectId: (auth) => auth._id,
});

const friendSlice = createSlice({
  name: "friend",
  initialState: friendAdapter.getInitialState(),
  reducers: {
    ...defaultActions(friendAdapter),
  },
});

const friendReducer = friendSlice.reducer;

export { friendReducer };

export const {
  addOne: addOneFriend,
  addMany: addManyFriend,
  updateOne: updateOneFriend,
  removeAll: removeAllFriend,
} = friendSlice.actions;

export const {
  selectById: selectFriendById,
  selectIds: selectFriendIds,
  selectEntities: selectFriendEntities,
  selectAll: selectAllFriends,
  selectTotal: selectTotalFriends,
} = friendAdapter.getSelectors((state: RootState) => state.friend);
