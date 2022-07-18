import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage } from "../../domains";

const initialState: IMessage[] = [];

const messageSlice = createSlice({
  name: "message",
  initialState: initialState,
  reducers: {
    removeAll() {
      return initialState;
    },

    addMany(state, action: PayloadAction<IMessage[]>) {
      return [...state, ...action.payload].sort(
        (m1, m2) =>
          new Date(m1.sendTime).getTime() - new Date(m2.sendTime).getTime()
      );
    },

    addOne(state, action: PayloadAction<IMessage>) {
      return [...state, action.payload].sort(
        (m1, m2) =>
          new Date(m1.sendTime).getTime() - new Date(m2.sendTime).getTime()
      );
    },

    updateOne(state, action: PayloadAction<IMessage>) {
      Object.keys(action.payload).forEach(
        (key) =>
          (action.payload as any)[key] === undefined &&
          delete (action.payload as any)[key]
      );

      if (
        !state.find(
          (item) =>
            item.fromId === action.payload.fromId &&
            item.toId === action.payload.toId &&
            item.clientId === action.payload.clientId
        )
      ) {
        state.push(action.payload);
      } else
        return state.map((item) =>
          item.clientId === action.payload.clientId
            ? { ...item, ...action.payload }
            : item
        );
    },

    updateMany(state, action: PayloadAction<IMessage[]>) {
      return state.map((item) => {
        const message = action.payload.find(
          (m) =>
            m.clientId === item.clientId &&
            m.fromId === item.fromId &&
            m.toId === item.toId
        );

        if (message) {
          Object.keys(message).forEach(
            (key) =>
              (message as any)[key] === undefined &&
              delete (message as any)[key]
          );

          return {
            ...item,
            ...message,
          };
        } else return item;
      });
    },

    removeOne(state, action: PayloadAction<IMessage>) {
      return state.filter((item) => item.clientId !== action.payload.clientId);
    },
  },
});

const messageReducer = messageSlice.reducer;

export const {
  removeAll: removeAllMessage,
  addMany: addManyMessage,
  addOne: addOneMessage,
  updateOne: updateOneMessage,
  updateMany: updateManyMessage,
  removeOne: removeOneMessage,
} = messageSlice.actions;

export { messageReducer };
