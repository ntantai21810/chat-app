import classNames from "classnames";
import * as React from "react";
import { IMessage, MessageType } from "../../../domains/Message";
import Avatar from "../common/Avatar";
import Image from "../common/Image";
import MessageItem from "../Message";
import styles from "./style.module.scss";

export interface IChatMessageProps {
  reverse?: boolean;
  avatar?: string;
  message: IMessage;
  showAvatar: boolean;
}

export default function ChatMessage(props: IChatMessageProps) {
  const { reverse = false, avatar, message, showAvatar } = props;

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

      <div className={styles.messageItem}>
        {message.type === MessageType.TEXT && (
          <MessageItem
            bgColor={reverse ? "#d5edff" : "#fff"}
            message={message}
            showStatus={reverse}
          />
        )}
        {message.type === MessageType.IMAGE && (
          <div className={styles.imagesContainer}>
            {message.content.split("-").map((url, index) => (
              <div className={styles.imageItem} key={index}>
                <Image
                  width="36rem"
                  height="20rem"
                  src={url}
                  alt="Image message"
                />
                <div className={styles.overlay}></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
