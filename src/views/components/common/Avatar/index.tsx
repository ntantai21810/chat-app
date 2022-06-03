import * as React from "react";
import styles from "./style.module.scss";

export interface IAvatarProps {
  width?: string;
  hegiht?: string;
  src: string;
  alt: string;
}

export default function Avatar(props: IAvatarProps) {
  const { width, hegiht, src, alt } = props;

  return (
    <div
      className={styles.container}
      style={{
        width: width || "6rem",
        height: hegiht || "6rem",
      }}
    >
      <img src={src} alt={alt} className={styles.avatar} />
    </div>
  );
}
