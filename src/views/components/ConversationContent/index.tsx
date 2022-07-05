import classNames from "classnames";
import React, { useEffect, useRef } from "react";
import { IFile } from "../../../domains/common/helper";
import { IMessage } from "../../../domains/Message";
import styles from "../../assets/styles/ConversationContent.module.scss";
import ChatMessage from "../ChatMessage";

export interface IConversationContentProps {
  messages: IMessage[];
  currentUserId: string;
  currentUserAvatar: string;
  chattingUserAvatar: string;
  percentFileDownloading?: { url: string; percent: number };
  scrollToElement?: string;
  highlightElement?: string;
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
    percentFileDownloading,
    scrollToElement,
    highlightElement,
  } = props;

  const ref = useRef<HTMLDivElement | null>(null);
  const lastConversationId = useRef("");
  const wheel = useRef(false);

  const handleScroll = () => {
    if (
      ref.current?.scrollTop === 0 &&
      onScrollToTop &&
      lastConversationId.current &&
      lastConversationId.current === messages[0].conversationId &&
      wheel.current
    ) {
      onScrollToTop();
    }
  };

  useEffect(() => {
    wheel.current = false;

    if (ref.current) {
      if (scrollToElement) {
        const ele = document.getElementById(scrollToElement);

        if (ele) {
          ref.current.scrollTop = ele.offsetTop;
        }
      } else {
        ref.current.scrollTop = ref.current.scrollHeight;
      }

      lastConversationId.current =
        messages.length > 0 ? messages[0].conversationId : "";
    }
  });

  return (
    <div
      className={styles.container}
      ref={ref}
      onScroll={handleScroll}
      onWheel={() => (wheel.current = true)}
    >
      {messages.map((item, index) => {
        let showAvatar = false;
        let avatar = "";

        if (index === 0 || item.fromId !== messages[index - 1].fromId) {
          showAvatar = true;

          if (currentUserId === item.fromId) avatar = currentUserAvatar || "";
          else avatar = chattingUserAvatar;
        }

        return (
          <div
            className={classNames({
              [styles.chatMessage]: true,
            })}
            key={index}
            id={`message-${item.fromId + item.toId + item.clientId}`}
          >
            <ChatMessage
              message={item}
              reverse={currentUserId === item.fromId}
              avatar={avatar}
              showAvatar={showAvatar}
              onRetry={onRetry}
              onDownloadFile={onDownloadFile}
              onImageClick={onImageClick}
              percentFileDownloading={percentFileDownloading}
              highlight={
                `message-${item.fromId + item.toId + item.clientId}` ===
                highlightElement
              }
            />
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(ConversationContent);
