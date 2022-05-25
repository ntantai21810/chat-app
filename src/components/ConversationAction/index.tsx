import * as React from "react";
import styles from "./style.module.scss";
import { BsImage } from "react-icons/bs";

export interface IConversationActionProps {}

export default function ConversationAction(props: IConversationActionProps) {
  return (
    <div className={styles.container}>
      <div className={styles.action}>
        <BsImage fontSize="2.2rem" />
      </div>
      <div className={styles.action}>
        <BsImage fontSize="2.2rem" />
      </div>
      <div className={styles.action}>
        <BsImage fontSize="2.2rem" />
      </div>
      <div className={styles.action}>
        <BsImage fontSize="2.2rem" />
      </div>
    </div>
  );
}
