import { IConversation } from "../../../domains/Conversation";
import { IUser } from "../../../domains/User";
import ChattedUserItem from "../ChattedUserItem";

export interface IChattedUserListProps {
  conversations: (IConversation & { user: IUser })[];
  onConversationClick?: (conversation: IConversation) => any;
}

export default function ChattedUserList(props: IChattedUserListProps) {
  const { conversations, onConversationClick } = props;

  return (
    <>
      {conversations.map((item) => (
        <ChattedUserItem
          user={item.user}
          lastMessage={item.lastMessage}
          key={item.id}
          onClick={() => (onConversationClick ? onConversationClick(item) : "")}
        />
      ))}
    </>
  );
}
