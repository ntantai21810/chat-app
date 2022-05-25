import classNames from "classnames";
import * as React from "react";
import Avatar from "../common/Avatar";
import MessageList from "../MessageList";
import styles from "./style.module.scss";

export interface IChatMessageProps {
  reverse?: boolean;
}

export default function ChatMessage(props: IChatMessageProps) {
  const { reverse = false } = props;

  return (
    <div
      className={classNames({
        [styles.container]: true,
        [styles.justifyContentEnd]: reverse,
      })}
    >
      <Avatar
        src="https://images.unsplash.com/photo-1653387496292-399351877639?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387"
        alt="Chat user avatar"
      />

      <div className={styles.messageList}>
        <MessageList bgColor={reverse ? "#d5edff" : "#fff"} />
      </div>
    </div>
  );
}
