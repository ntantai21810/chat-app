import React from "react";
import { useEffect, useRef } from "react";
import { IMessage } from "../../../domains/Message";
import { Moment } from "../../../helper/configs/moment";
import ChatMessage from "../ChatMessage";
import styles from "./styles.module.scss";

export interface IConversationContentProps {
  messages: IMessage[];
  currentUserId: string;
  currentUserAvatar: string;
  chattingUserAvatar: string;
  onScrollToTop?: () => any;
}

function ConversationContent(props: IConversationContentProps) {
  const {
    messages,
    currentUserId,
    currentUserAvatar,
    chattingUserAvatar,
    onScrollToTop,
  } = props;

  const ref = useRef<HTMLDivElement | null>(null);
  const lastMessageSendTimeRef = useRef<string>("");

  console.log("Conversation content render");

  const handleScroll = () => {
    if (ref.current?.scrollTop === 0 && onScrollToTop) {
      onScrollToTop();
    }
  };

  //Scroll to bottom
  useEffect(() => {
    if (
      ref.current &&
      (!lastMessageSendTimeRef.current ||
        (lastMessageSendTimeRef.current &&
          Moment(lastMessageSendTimeRef.current).unix() <
            Moment(messages[messages.length - 1].sendTime).unix()))
    ) {
      ref.current.scrollTop = ref.current.scrollHeight || 0;
    }

    if (messages.length > 0) {
      lastMessageSendTimeRef.current = messages[messages.length - 1].sendTime;
    }
  });

  return (
    <div className={styles.container} ref={ref} onScroll={handleScroll}>
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
