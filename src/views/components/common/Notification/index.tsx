import classNames from "classnames";
import * as React from "react";
import ReactDOM from "react-dom";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import styles from "../../../assets/styles/Notification.module.scss";

export interface INotificationProps {
  type: "success" | "error";
  message: string;
}

const NotificationRoot = document.getElementById("notification-root");

export default function Notification(props: INotificationProps) {
  const { type, message } = props;

  const el = (
    <div
      className={classNames({
        [styles.container]: true,
        [styles.success]: type === "success",
        [styles.error]: type === "error",
      })}
    >
      <div className={styles.icon}>
        {type === "success" && (
          <AiOutlineCheckCircle fontSize={"2rem"} color="green" />
        )}
        {type === "error" && (
          <AiOutlineCloseCircle fontSize={"2rem"} color="red" />
        )}
      </div>

      <div
        className={classNames({
          [styles.message]: true,
          [styles.success]: type === "success",
          [styles.error]: type === "error",
        })}
      >
        {message}
      </div>
    </div>
  );

  return ReactDOM.createPortal(el, NotificationRoot!);
}
