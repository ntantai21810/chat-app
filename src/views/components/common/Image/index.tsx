import * as React from "react";
import { AiOutlineClose } from "react-icons/ai";
import styles from "../../../assets/styles/Image.module.scss";

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

  const ref = React.useRef<HTMLImageElement | null>(null);
  let retry = false;

  const handleError: React.ReactEventHandler = (e) => {
    if (ref.current && !retry) {
      ref.current.src = src;
      retry = true;
    }
  };

  return (
    <div style={{ width: width, height: height }} className={styles.container}>
      <img
        ref={ref}
        className={styles.img}
        src={src}
        alt={alt}
        onError={handleError}
      />

      {closable && (
        <div className={styles.closeIcon} onClick={onClose}>
          <AiOutlineClose fontSize="1.2rem" color="#fff" />
        </div>
      )}
    </div>
  );
}
