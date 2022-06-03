import * as React from "react";
import styles from "./style.module.scss";

export interface IMessageProps {
  bgColor?: string;
  message: string;
}

export default function Message(props: IMessageProps) {
  const { bgColor = "#fff", message } = props;

  return (
    <div className={styles.container} style={{ backgroundColor: bgColor }}>
      {message}
    </div>
  );
}
