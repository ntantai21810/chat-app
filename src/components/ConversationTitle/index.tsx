import * as React from "react";
import Avatar from "../common/Avatar";
import styles from "./style.module.scss";

export interface IConversationTitleProps {}

export default function ConversationTitle(props: IConversationTitleProps) {
  return (
    <div className={styles.container}>
      <Avatar
        src="https://images.unsplash.com/photo-1652533881170-e72a154abbe1?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465"
        alt="Conversation avatar"
      />

      <div className={styles.header}>
        <p className={styles.name}>Test ten nhom</p>

        <p>Truy cap 1 phut truoc</p>
      </div>
    </div>
  );
}
