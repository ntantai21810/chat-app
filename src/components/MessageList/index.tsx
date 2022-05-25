import * as React from "react";
import MessageItem from "../MessageItem";
import styles from "./style.module.scss";

export interface IMessageListProps {
  bgColor?: string;
}

export default function MessageList(props: IMessageListProps) {
  const { bgColor = "#fff" } = props;

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <MessageItem bgColor={bgColor} />
      </div>
      <div className={styles.item}>
        <MessageItem bgColor={bgColor} />
      </div>
      <div className={styles.item}>
        <MessageItem bgColor={bgColor} />
      </div>
      <div className={styles.item}>
        <MessageItem bgColor={bgColor} />
      </div>
    </div>
  );
}
