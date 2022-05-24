import * as React from "react";
import ChattedUserList from "../../components/ChattedUserList";
import styles from "./style.module.scss";

export interface IChatPageProps {}

export default function ChatPage(props: IChatPageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.chattedUserList}>
        <ChattedUserList />
      </div>
    </div>
  );
}
