import React from "react";
import { useEffect, useRef } from "react";
import { IMessage } from "../../../domains/Message";
import ChatMessage from "../ChatMessage";
import styles from "./styles.module.scss";

export interface IConversationContentProps {
  messages: IMessage[];
  currentUserId: string;
  currentUserAvatar: string;
  chattingUserAvatar: string;
}

function ConversationContent(props: IConversationContentProps) {
  const { messages, currentUserId, currentUserAvatar, chattingUserAvatar } =
    props;

  const ref = useRef<HTMLDivElement | null>(null);

  //Scroll to bottom
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight || 0;
  });

  return (
    <div className={styles.container} ref={ref}>
      {messages.map((item, index) => {
        let showAvatar = false;
        let avatar = "";

        if (index === 0 || item.fromId !== messages[index - 1].fromId) {
          showAvatar = true;

          if (currentUserId === item.fromId) avatar = currentUserAvatar || "";
          else avatar = chattingUserAvatar;
        }

        return (
          <div className={styles.chatMessage} key={index}>
            <ChatMessage
              content={item.content}
              reverse={currentUserId === item.fromId}
              avatar={avatar}
              showAvatar={showAvatar}
            />
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(ConversationContent);
