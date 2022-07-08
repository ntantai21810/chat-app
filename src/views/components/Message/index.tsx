import classNames from "classnames";
import { useEffect, useRef } from "react";
import { IMessage, MessageStatus } from "../../../domains/Message";
import styles from "../../assets/styles/Message.module.scss";

export interface IMessageProps {
  bgColor?: string;
  message: IMessage;
  showStatus: boolean;
  highlight?: boolean;
  onRetry?: (message: IMessage) => any;
}

export default function Message(props: IMessageProps) {
  const { bgColor = "#fff", message, showStatus, onRetry, highlight } = props;

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = (message.content as string).replace(
        /\u00a0/g,
        " "
      );
    }
  }, [message]);

  return (
    <div
      className={classNames({
        [styles.container]: true,
      })}
      style={{ backgroundColor: highlight ? "rgb(255 199 0)" : bgColor }}
    >
      <div ref={ref}></div>

      {showStatus && (
        <div
          className={classNames({
            [styles.status]: true,
            [styles.error]: message.status === MessageStatus.ERROR,
          })}
          onClick={() =>
            message.status === MessageStatus.ERROR && onRetry
              ? onRetry(message)
              : ""
          }
        >
          {message.status === MessageStatus.PENDING && "Đang gửi"}
          {message.status === MessageStatus.SENT && "Đã gửi"}
          {message.status === MessageStatus.RECEIVED && "Đã nhận"}
          {message.status === MessageStatus.ERROR && "Thử lại"}
        </div>
      )}
    </div>
  );
}
