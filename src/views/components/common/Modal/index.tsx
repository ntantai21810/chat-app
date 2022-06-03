import * as React from "react";
import { useDetectClickOutside } from "../../../../hooks/common";
import styles from "./style.module.scss";

export interface IModalProps {
  children: React.ReactNode;
  width?: string;
  height?: string;
  show: boolean;
  onClose?: () => any;
}

export default function Modal(props: IModalProps) {
  const { children, width, height, show, onClose } = props;

  const ref = React.createRef<any>();

  const handleClickOutside = () => {
    if (onClose) onClose();
  };

  useDetectClickOutside(ref, handleClickOutside);

  return (
    <div
      className={styles.modal}
      style={{ display: !!show ? "block" : "none" }}
    >
      <div className={styles.overlay}></div>
      <div
        ref={ref}
        className={styles.main}
        style={{ width: width || "40rem", height: height || "40rem" }}
      >
        {children}
      </div>
    </div>
  );
}
