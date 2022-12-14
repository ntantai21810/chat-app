import classNames from "classnames";
import React, { UIEventHandler, useEffect, useRef } from "react";
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
  onScroll?: UIEventHandler;
  onRetry?: (message: IMessage) => any;
  onDownloadFile?: (url: string) => any;
  onImageClick?: (image: IFile, message: IMessage) => any;
  onPhoneClick?: (phone: string) => any;
  onUrlClick?: (url: string) => any;
}

function ConversationContent(props: IConversationContentProps) {
  const {
    messages,
    currentUserId,
    currentUserAvatar,
    chattingUserAvatar,
    percentFileDownloading,
    scrollToElement,
    highlightElement,
    onScrollToTop,
    onRetry,
    onDownloadFile,
    onImageClick,
    onScroll,
    onPhoneClick,
    onUrlClick,
  } = props;

  const ref = useRef<HTMLDivElement | null>(null);
  const lastConversationId = useRef("");
  const wheel = useRef(false);

  const handleScroll: UIEventHandler = (e) => {
    if (
      ref.current?.scrollTop === 0 &&
      onScrollToTop &&
      lastConversationId.current &&
      lastConversationId.current === messages[0].conversationId &&
      wheel.current
    ) {
      onScrollToTop();
    }

    if (onScroll) onScroll(e);
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
              onPhoneClick={onPhoneClick}
              onUrlClick={onUrlClick}
            />
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(ConversationContent);
