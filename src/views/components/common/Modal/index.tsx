import * as React from "react";
import ReactDOM from "react-dom";
import { useDetectClickOutside } from "../../../../helper";
import styles from "../../../assets/styles/Modal.module.scss";

export interface IModalProps {
  children: React.ReactNode;
  width?: string;
  height?: string;
  show: boolean;
  onClose?: Function;
  overlay?: boolean;
  className?: string;
}

const ModalRoot = document.getElementById("modal-root");

export default function Modal(props: IModalProps) {
  const {
    children,
    width,
    height,
    show,
    onClose,
    overlay = true,
    className,
  } = props;

  const ref = React.createRef<any>();

  const handleClickOutside = () => {
    if (onClose) onClose();
  };

  useDetectClickOutside(ref, handleClickOutside);

  return ReactDOM.createPortal(
    <div
      className={styles.modal}
      style={{ display: !!show ? "block" : "none" }}
    >
      {overlay && <div className={styles.overlay}></div>}
      <div
        ref={ref}
        className={`${styles.main} ${className ?? ""}`}
        style={{ width: width || "40rem", height: height || "40rem" }}
      >
        {children}
      </div>
    </div>,
    ModalRoot!
  );
}
