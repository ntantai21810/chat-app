import * as React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { IMessage } from "../../../models/Message";
import { IUser } from "../../../models/User";
import ChatMessage from "../ChatMessage";
import styles from "./styles.module.scss";

export interface IConversationContentProps {
  messages: IMessage[];
  fromUser: Pick<IUser, "avatar" | "_id">;
  toUserAvatar: string;
}

export default function ConversationContent(props: IConversationContentProps) {
  const { messages, fromUser, toUserAvatar } = props;

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

          if (fromUser._id === item.fromId) avatar = fromUser.avatar || "";
          else avatar = toUserAvatar;
        }

        return (
          <div className={styles.chatMessage} key={index}>
            <ChatMessage
              content={item.content}
              reverse={fromUser._id === item.fromId}
              avatar={avatar}
              showAvatar={showAvatar}
            />
          </div>
        );
      })}
    </div>
  );
}
