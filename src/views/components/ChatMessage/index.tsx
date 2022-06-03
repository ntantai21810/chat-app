import classNames from "classnames";
import * as React from "react";
import Avatar from "../common/Avatar";
import MessageItem from "../Message";
import styles from "./style.module.scss";

export interface IChatMessageProps {
  reverse?: boolean;
  avatar?: string;
  content: string;
  showAvatar: boolean;
}

export default function ChatMessage(props: IChatMessageProps) {
  const { reverse = false, avatar, content, showAvatar } = props;

  return (
    <div
      className={classNames({
        [styles.container]: true,
        [styles.justifyContentEnd]: reverse,
      })}
    >
      <div className={styles.avatar}>
        {showAvatar && (
          <Avatar
            src={
              avatar ||
              "https://images.unsplash.com/photo-1653387496292-399351877639?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387"
            }
            alt="Chat user avatar"
            width="100%"
            hegiht="100%"
          />
        )}
      </div>

      <div className={styles.messageList}>
        <MessageItem bgColor={reverse ? "#d5edff" : "#fff"} message={content} />
      </div>
    </div>
  );
}
