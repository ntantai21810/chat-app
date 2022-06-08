import * as React from "react";
import { IUser } from "../../../domains/User";
import Avatar from "../common/Avatar";
import styles from "./style.module.scss";

export interface IOnlineUserProps {
  users: IUser[];
  onUserClick?: (user: IUser) => any;
}

export default function OnlineUser(props: IOnlineUserProps) {
  const { users, onUserClick } = props;

  const ref = React.useRef<HTMLDivElement | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (ref.current) {
      ref.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className={styles.container} onWheel={handleWheel} ref={ref}>
      {users.map((user) => (
        <div
          className={styles.item}
          key={user._id}
          onClick={onUserClick ? () => onUserClick(user) : undefined}
        >
          <Avatar
            src={
              user.avatar ||
              "https://images.unsplash.com/photo-1653257340129-148be674836c?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465"
            }
            alt="Online user"
          />

          <p className={styles.name}>{user.fullName || ""}</p>
        </div>
      ))}
    </div>
  );
}
