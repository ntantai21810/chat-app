import classNames from "classnames";
import { IFile } from "../../../domains";
import { IMessage, MessageType } from "../../../domains/Message";
import { IUser } from "../../../domains/User";
import { getRemainingTime } from "../../../helper";
import styles from "../../assets/styles/ChattedUserItem.module.scss";
import Avatar from "../common/Avatar";
import HighlightKeyword from "../common/HighlightKeyword";

export interface IChattedUserItemProps {
  user: IUser;
  lastMessage: IMessage;
  onClick?: Function;
  active?: boolean;
  keywords?: string;
}

export default function ChattedUserItem(props: IChattedUserItemProps) {
  const { user, lastMessage, onClick, active, keywords } = props;

  return (
    <div
      className={classNames({
        [styles.container]: true,
        [styles.active]: active, //active
      })}
      onClick={() => (onClick ? onClick() : "")}
    >
      <div>
        <Avatar
          src={
            user?.avatar ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZDHvxAjE2bfJbB-asv9kqio9ItBvUUwSHiA&usqp=CAU"
          }
          alt="User avatar"
          width="5rem"
          hegiht="5rem"
        />
      </div>

      <div className={styles.right}>
        <div className={styles.content}>
          <div className={styles.info}>
            <p className={styles.title}>{user?.fullName || ""}</p>
            <p className={styles.time}>
              {getRemainingTime(new Date(lastMessage.sendTime).getTime())}
            </p>
          </div>

          <div className={styles.message}>
            {lastMessage?.type === MessageType.TEXT &&
              (keywords ? (
                <HighlightKeyword
                  text={lastMessage.content as string}
                  keyword={keywords || ""}
                />
              ) : (
                (lastMessage.content as string)
              ))}

            {lastMessage?.type === MessageType.IMAGE && "Đã gửi ảnh"}

            {lastMessage?.type === MessageType.FILE &&
              (keywords ? (
                <HighlightKeyword
                  text={(lastMessage.content as IFile[])[0]?.name || ""}
                  keyword={keywords || ""}
                />
              ) : (
                (lastMessage.content as IFile[])[0]?.name || ""
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
