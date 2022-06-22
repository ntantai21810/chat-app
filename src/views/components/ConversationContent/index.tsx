import React, { useEffect, useRef } from "react";
import { IMessage } from "../../../domains/Message";
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
  const isBottom = useRef(true);
  const lastConversationId = useRef("");
  const scrollFromBottom = useRef(0);
  const scrollFromTop = useRef(0);

  const handleScroll = () => {
    if (
      ref.current?.scrollTop === 0 &&
      scrollFromTop.current > 0 &&
      onScrollToTop
    ) {
      onScrollToTop();
    }

    if (ref.current) {
      isBottom.current =
        ref.current.scrollTop + ref.current.scrollHeight ===
        ref.current.clientHeight;

      scrollFromBottom.current =
        ref.current.scrollHeight - ref.current.scrollTop;

      scrollFromTop.current = ref.current.scrollTop;
    }
  };

  //Handle scroll
  useEffect(() => {
    if (ref.current) {
      //Scroll when new messge
      if (isBottom.current) {
        ref.current.scrollTop = ref.current.scrollHeight || 0;
      } else if (messages.length > 0) {
        //Scroll when change conversation
        if (lastConversationId.current === messages[0].conversationId) {
          // Scroll when load more
          ref.current.scrollTop =
            ref.current.scrollHeight - scrollFromBottom.current;
        } else {
          ref.current.scrollTop = ref.current.scrollHeight || 0;
        }
      }
    }

    lastConversationId.current =
      messages.length > 0 ? messages[0].conversationId : "";
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
              message={item}
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
