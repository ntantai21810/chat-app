import React, { useEffect, useRef } from "react";
import { IFile } from "../../../domains/common/helper";
import { IMessage } from "../../../domains/Message";
import ChatMessage from "../ChatMessage";
import styles from "./styles.module.scss";

export interface IConversationContentProps {
  messages: IMessage[];
  currentUserId: string;
  currentUserAvatar: string;
  chattingUserAvatar: string;
  onScrollToTop?: () => any;
  onRetry?: (message: IMessage) => any;
  onDownloadFile?: (url: string) => any;
  onImageClick?: (image: IFile) => any;
}

function ConversationContent(props: IConversationContentProps) {
  const {
    messages,
    currentUserId,
    currentUserAvatar,
    chattingUserAvatar,
    onScrollToTop,
    onRetry,
    onDownloadFile,
    onImageClick,
  } = props;

  const ref = useRef<HTMLDivElement | null>(null);
  const lastConversationId = useRef("");
  const lastConversationSendTime = useRef("");
  const lastMessageLength = useRef(0);
  const scrollFromBottom = useRef(0);

  const handleScroll = () => {
    if (
      ref.current?.scrollTop === 0 &&
      onScrollToTop &&
      lastConversationId.current &&
      lastConversationId.current === messages[0].conversationId
    ) {
      onScrollToTop();
    }

    if (ref.current) {
      scrollFromBottom.current =
        ref.current.scrollHeight - ref.current.scrollTop;
    }
  };

  //Handle scroll
  useEffect(() => {
    if (ref.current) {
      //First render
      if (!lastConversationId.current || !lastConversationSendTime.current)
        ref.current.scrollTop = ref.current.scrollHeight;
      else if (messages.length > 0) {
        if (lastConversationId.current === messages[0].conversationId) {
          // New message
          if (
            messages[messages.length - 1].sendTime !==
            lastConversationSendTime.current
          ) {
            ref.current.scrollTop = ref.current.scrollHeight;
          }
          //Load more
          else if (lastMessageLength.current < messages.length) {
            ref.current.scrollTop =
              ref.current.scrollHeight - scrollFromBottom.current;
          }
        }
        //Change conversation
        else {
          ref.current.scrollTop = ref.current.scrollHeight;
        }
      }
    }

    lastConversationId.current =
      messages.length > 0 ? messages[0].conversationId : "";

    lastConversationSendTime.current =
      messages.length > 0 ? messages[messages.length - 1].sendTime : "";

    lastMessageLength.current = messages.length;
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
              onRetry={onRetry}
              onDownloadFile={onDownloadFile}
              onImageClick={onImageClick}
            />
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(ConversationContent);
