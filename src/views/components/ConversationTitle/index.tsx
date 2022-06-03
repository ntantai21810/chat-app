import * as React from "react";
import { Moment } from "../../../configs/moment";
import { IUser } from "../../../models/User";
import Avatar from "../common/Avatar";
import styles from "./style.module.scss";

export interface IConversationTitleProps {
  user?: IUser;
  lastOnlineTime?: string;
}

export default function ConversationTitle(props: IConversationTitleProps) {
  const { user, lastOnlineTime } = props;

  const lastOnlineMinutes = Math.floor(
    Moment().diff(Moment(lastOnlineTime)) / 1000 / 60
  );

  return (
    <div className={styles.container}>
      {user && (
        <>
          <Avatar
            src="https://images.unsplash.com/photo-1652533881170-e72a154abbe1?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465"
            alt="Conversation avatar"
          />
          <div className={styles.header}>
            <p className={styles.name}>{user.fullName}</p>

            <p>{`Truy cập ${lastOnlineMinutes} phút trước`}</p>
          </div>
        </>
      )}
    </div>
  );
}
