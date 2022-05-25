import * as React from "react";
import styles from "./style.module.scss";

export interface IMessageItemProps {
  bgColor?: string;
}

export default function MessageItem(props: IMessageItemProps) {
  const { bgColor = "#fff" } = props;

  return (
    <div className={styles.container} style={{ backgroundColor: bgColor }}>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt veritatis
      est eius adipisci corporis deleniti, sequi quia doloremque, temporibus
      itaque architecto repudiandae magnam cupiditate repellendus autem non,
      fugiat accusantium consectetur.
    </div>
  );
}
