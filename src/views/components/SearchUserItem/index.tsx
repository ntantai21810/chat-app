import styles from "../../assets/styles/SearchUserItem.module.scss";
import Avatar from "../common/Avatar";
import HighlightKeyword from "../common/HighlightKeyword";

export interface ISearchUserItemProps {
  avatar?: string;
  name: string;
  onClick?: () => any;
  keywords?: string;
}

export default function SearchUserItem(props: ISearchUserItemProps) {
  const { avatar, name, onClick, keywords } = props;

  return (
    <div className={styles.container} onClick={onClick ? onClick : () => {}}>
      <Avatar
        src={
          avatar ||
          "https://images.unsplash.com/photo-1655365225179-fbc453d3bd58?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
        }
        alt="Search user avatar"
      />

      <HighlightKeyword text={name} keyword={keywords || ""} />
    </div>
  );
}
