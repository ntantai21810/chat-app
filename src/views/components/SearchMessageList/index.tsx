import { IConversation, IMessage, IUser } from "../../../domains";
import styles from "../../assets/styles/SearchMessageList.module.scss";
import SearchMessageItem from "../SearchMessageItem";

export interface ISearchMessageListProps {
  messages: (IMessage & { conversation: IConversation; user: IUser })[];
  onClick?: (message: IMessage) => any;
  keywords?: string;
}

export default function SearchMessageList(props: ISearchMessageListProps) {
  const { messages, onClick, keywords } = props;

  return (
    <div>
      {messages.map((item, index) => (
        <div className={styles.item} key={index}>
          <SearchMessageItem
            message={item}
            onClick={onClick}
            keywords={keywords}
          />
        </div>
      ))}
    </div>
  );
}
