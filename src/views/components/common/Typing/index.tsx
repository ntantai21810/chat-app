import * as React from "react";
import styles from "../../../assets/styles/Typing.module.scss";

export interface ITypingProps {}

export default function TypingIcon(props: ITypingProps) {
  return (
    <div className={styles.center}>
      <div className={styles.wave}></div>
      <div className={styles.wave}></div>
      <div className={styles.wave}></div>
      <div className={styles.wave}></div>
      <div className={styles.wave}></div>
    </div>
  );
}
