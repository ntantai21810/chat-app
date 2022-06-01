import * as React from "react";
import { IConversation } from "../../models/Conversation";
import ChattedUserItem from "../ChattedUserItem";

export interface IChattedUserListProps {
  conversations?: IConversation[];
}

export default function ChattedUserList(props: IChattedUserListProps) {
  return (
    <>
      <ChattedUserItem />
      <ChattedUserItem />
      <ChattedUserItem />
      <ChattedUserItem />
      <ChattedUserItem />
      <ChattedUserItem />
    </>
  );
}
