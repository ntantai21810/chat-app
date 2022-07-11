import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { IMessage, MessageStatus } from "../../../domains/Message";
import { API } from "../../../network";
import styles from "../../assets/styles/Message.module.scss";
import PreviewLink from "../common/PreviewLink";

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

  const handleClickUrl = (url: string) => {
    (window as any).electronAPI.openLink(url);
  };

  useEffect(() => {
    const handleValueChange = async () => {
      if (ref.current) {
        ref.current.innerHTML = (message.content as string).replace(
          /\u00a0/g,
          " "
        );
      }
    };

    handleValueChange();
  }, [message]);

  return (
    <div
      className={classNames({
        [styles.container]: true,
      })}
      style={{ backgroundColor: highlight ? "rgb(255 199 0)" : bgColor }}
    >
      <div ref={ref}></div>

      {message.thumb && (
        <div className={styles.previewLink}>
          <PreviewLink
            title={message.thumb.title}
            description={message.thumb.description}
            image={message.thumb.image}
            url={message.thumb.url}
            onClick={handleClickUrl}
          />
        </div>
      )}

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
