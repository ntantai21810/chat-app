import { IConversation, IMessage, IUser } from "../../../domains";
import styles from "../../assets/styles/SearchMessageList.module.scss";
import SearchMessageItem from "../SearchMessageItem";

export interface ISearchMessageListProps {
  messages: (IMessage & { conversation: IConversation; user: IUser })[];
  onClick?: (message: IMessage) => any;
}

export default function SearchMessageList(props: ISearchMessageListProps) {
  const { messages, onClick } = props;

  return (
    <div>
      {messages.map((item, index) => (
        <div className={styles.item} key={index}>
          <SearchMessageItem message={item} onClick={onClick} />
        </div>
      ))}
    </div>
  );
}
