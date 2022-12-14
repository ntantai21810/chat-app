import { IConversation, IMessage, IUser } from "../../../domains";
import styles from "../../assets/styles/SearchMessageItem.module.scss";
import ChattedUserItem from "../ChattedUserItem";

export interface ISearchMessageItemProps {
  message: IMessage & { conversation: IConversation; user: IUser };
  onClick?: (user: IMessage) => any;
  keywords?: string;
}

export default function SearchMessageItem(props: ISearchMessageItemProps) {
  const { message, onClick, keywords } = props;

  return (
    <div className={styles.container}>
      <ChattedUserItem
        user={message.user}
        lastMessage={message}
        onClick={() => (onClick ? onClick(message) : "")}
        keywords={keywords}
      />
    </div>
  );
}
