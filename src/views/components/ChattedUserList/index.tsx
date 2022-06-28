import { IConversation } from "../../../domains/Conversation";
import { IUser } from "../../../domains/User";
import ChattedUserItem from "../ChattedUserItem";

export interface IChattedUserListProps {
  conversations: (IConversation & { user: IUser })[];
  onConversationClick?: (conversation: IConversation) => any;
  currentConversationId?: string;
}

export default function ChattedUserList(props: IChattedUserListProps) {
  const { conversations, onConversationClick, currentConversationId } = props;

  return (
    <>
      {conversations.map((item) => (
        <ChattedUserItem
          user={item.user}
          lastMessage={item.lastMessage}
          key={item.id}
          onClick={() => (onConversationClick ? onConversationClick(item) : "")}
          active={item.id === currentConversationId}
        />
      ))}
    </>
  );
}
