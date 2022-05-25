import * as React from "react";
import ChatMessage from "../ChatMessage";
import styles from "./styles.module.scss";

export interface IConversationContentProps {}

export default function ConversationContent(props: IConversationContentProps) {
  return (
    <div className={styles.container}>
      <div className={styles.chatMessage}>
        <ChatMessage />
      </div>
      <div className={styles.chatMessage}>
        <ChatMessage reverse={true} />
      </div>
      <div className={styles.chatMessage}>
        <ChatMessage reverse={true} />
      </div>
      <div className={styles.chatMessage}>
        <ChatMessage />
      </div>
      <div className={styles.chatMessage}>
        <ChatMessage reverse={true} />
      </div>
    </div>
  );
}
