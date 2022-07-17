import classNames from "classnames";
import { AiOutlineFile } from "react-icons/ai";
import { BsDownload } from "react-icons/bs";
import { IFile } from "../../../domains/common/helper";
import { IMessage, MessageStatus, MessageType } from "../../../domains/Message";
import Avatar from "../common/Avatar";
import Image from "../common/Image";
import MessageItem from "../Message";
import styles from "../../assets/styles/ChatMessage.module.scss";
import { memo } from "react";

export interface IChatMessageProps {
  reverse?: boolean;
  avatar?: string;
  message: IMessage;
  showAvatar: boolean;
  percentFileDownloading?: { url: string; percent: number };
  highlight?: boolean;
  onRetry?: (message: IMessage) => any;
  onDownloadFile?: (url: string) => any;
  onImageClick?: (image: IFile, message: IMessage) => any;
}

function ChatMessage(props: IChatMessageProps) {
  const {
    reverse = false,
    avatar,
    message,
    showAvatar,
    highlight,
    onRetry,
    onDownloadFile,
    onImageClick,
    percentFileDownloading,
  } = props;

  return (
    <div
      className={classNames({
        [styles.container]: true,
        [styles.justifyContentEnd]: reverse,
      })}
    >
      <div className={styles.avatar}>
        {showAvatar && (
          <Avatar
            src={
              avatar ||
              "https://images.unsplash.com/photo-1653387496292-399351877639?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387"
            }
            alt="Chat user avatar"
            width="100%"
            hegiht="100%"
          />
        )}
      </div>

      <div className={styles.messageItem}>
        {message.type === MessageType.TEXT && (
          <MessageItem
            bgColor={reverse ? "#d5edff" : "#fff"}
            message={message}
            showStatus={reverse}
            onRetry={onRetry}
            highlight={highlight}
          />
        )}
        {message.type === MessageType.IMAGE && (
          <>
            <div className={styles.imagesContainer}>
              {(message.content as IFile[]).map((item, index) => (
                <div
                  className={styles.imageItem}
                  key={index}
                  onClick={() =>
                    onImageClick ? onImageClick(item, message) : ""
                  }
                >
                  <Image
                    width="36rem"
                    height="20rem"
                    src={item.data}
                    alt="Image message"
                  />
                  <div className={styles.overlay}></div>
                </div>
              ))}
            </div>
          </>
        )}

        {message.type === MessageType.FILE && (
          <div
            className={classNames({
              [styles.filesContainer]: true,
              [styles.highlight]: highlight,
            })}
          >
            {(message.content as IFile[]).map((item, index) => (
              <div className={styles.file} key={index}>
                <div className={styles.icon}>
                  <AiOutlineFile fontSize={"2rem"} />
                </div>
                <div className={styles.info}>
                  <p className={styles.name}>{item.name}</p>
                  <p className={styles.size}>{`${item.size} KB`}</p>
                </div>
                <div
                  className={styles.downloadIcon}
                  onClick={() =>
                    onDownloadFile ? onDownloadFile(item.data) : ""
                  }
                >
                  <BsDownload fontSize={"2rem"} />
                </div>

                <div
                  className={styles.progress}
                  style={
                    item.data === percentFileDownloading?.url
                      ? { width: `${percentFileDownloading?.percent || 0}%` }
                      : {}
                  }
                ></div>
              </div>
            ))}
          </div>
        )}

        {message.type !== MessageType.TEXT && reverse && (
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
    </div>
  );
}

export default memo(ChatMessage);
