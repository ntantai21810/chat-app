import * as React from "react";
import styles from "./styles.module.scss";

export interface ITypingProps {}

export default function Typing(props: ITypingProps) {
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
