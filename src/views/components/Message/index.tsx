import classNames from "classnames";
import { IMessage, MessageStatus } from "../../../domains/Message";
import styles from "./style.module.scss";

export interface IMessageProps {
  bgColor?: string;
  message: IMessage;
  showStatus: boolean;
}

export default function Message(props: IMessageProps) {
  const { bgColor = "#fff", message, showStatus } = props;

  return (
    <div
      className={classNames({
        [styles.container]: true,
      })}
      style={{ backgroundColor: bgColor }}
    >
      {message.content}

      {showStatus && (
        <div
          className={classNames({
            [styles.status]: true,
            [styles.error]: message.status === MessageStatus.ERROR,
          })}
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
