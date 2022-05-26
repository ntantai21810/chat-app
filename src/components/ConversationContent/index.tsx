import * as React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import ChatMessage from "../ChatMessage";
import styles from "./styles.module.scss";

export interface IConversationContentProps {}

export default function ConversationContent(props: IConversationContentProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  //Scroll to bottom
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current?.scrollHeight || 0;
  }, []);

  return (
    <div className={styles.container} ref={ref}>
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
