import * as React from "react";
import { AiOutlineClose } from "react-icons/ai";
import styles from "./style.module.scss";

export interface IImageProps {
  width?: string;
  height?: string;
  src: string;
  alt: string;
  closable?: boolean;
  onClose?: () => any;
}

export default function Image(props: IImageProps) {
  const {
    width = "4rem",
    height = "4rem",
    src,
    alt,
    closable,
    onClose,
  } = props;

  return (
    <div style={{ width: width, height: height }} className={styles.container}>
      <img className={styles.img} src={src} alt={alt} />
      {closable && (
        <div className={styles.closeIcon} onClick={onClose}>
          <AiOutlineClose fontSize="1.2rem" color="#fff" />
        </div>
      )}
    </div>
  );
}
