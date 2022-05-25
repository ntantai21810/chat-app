import * as React from "react";
import ChattedUserList from "../../components/ChattedUserList";
import Input from "../../components/common/Input";
import ConversationAction from "../../components/ConversationAction";
import ConversationContent from "../../components/ConversationContent";
import ConversationTitle from "../../components/ConversationTitle";
import styles from "./style.module.scss";
import { AiOutlineSend } from "react-icons/ai";

export interface IChatPageProps {}

export default function ChatPage(props: IChatPageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.chattedUserList}>
        <ChattedUserList />
      </div>

      <div className={styles.conversationSection}>
        <div className={styles.conversationTitle}>
          <ConversationTitle />
        </div>

        <div className={styles.conversationContent}>
          <ConversationContent />
        </div>

        <div className={styles.conversationAction}>
          <ConversationAction />
        </div>

        <div className={styles.conversationInput}>
          <Input
            border={false}
            icon={<AiOutlineSend />}
            placeholder="Nhập tin nhắn ..."
          />
        </div>
      </div>
    </div>
  );
}
