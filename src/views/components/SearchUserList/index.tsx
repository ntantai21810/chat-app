import * as React from "react";
import { IUser } from "../../../domains/User";
import SearchUserItem from "../SearchUserItem";
import styles from "../../assets/styles/SearchUserList.module.scss";

export interface ISearchUserListProps {
  users: IUser[];
  onClick?: (user: IUser) => any;
}

export default function SearchUserList(props: ISearchUserListProps) {
  const { users, onClick } = props;

  return (
    <div>
      {users.map((item) => (
        <div className={styles.item} key={item._id}>
          <SearchUserItem
            avatar={item.avatar}
            name={item.fullName}
            onClick={() => (onClick ? onClick(item) : "")}
          />
        </div>
      ))}
    </div>
  );
}
