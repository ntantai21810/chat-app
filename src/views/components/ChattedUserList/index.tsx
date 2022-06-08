import * as React from "react";
import { IConversation } from "../../../domains/Conversation";
import { IUser } from "../../../domains/User";
import ChattedUserItem from "../ChattedUserItem";

export interface IChattedUserListProps {
  conversations: IConversation[];
  onConversationClick: (user: IUser) => any;
}

export default function ChattedUserList(props: IChattedUserListProps) {
  const { conversations, onConversationClick } = props;

  return (
    <>
      {conversations.map((item) => (
        <ChattedUserItem
          user={item.user}
          lastMessage={item.lastMessage}
          key={item.user._id}
          onClick={onConversationClick}
        />
      ))}
    </>
  );
}
