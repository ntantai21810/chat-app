import classNames from "classnames";
import { IMessage, MessageType } from "../../../domains/Message";
import { IUser } from "../../../domains/User";
import { getRemainingTime } from "../../../helper/function";
import Avatar from "../common/Avatar";
import styles from "../../assets/styles/ChattedUserItem.module.scss";

export interface IChattedUserItemProps {
  user: IUser;
  lastMessage: IMessage;
  onClick?: Function;
  active?: boolean;
}

export default function ChattedUserItem(props: IChattedUserItemProps) {
  const { user, lastMessage, onClick, active } = props;

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
          width="5.6rem"
          hegiht="5.6rem"
        />
      </div>

      <div className={styles.right}>
        <div className={styles.content}>
          <p className={styles.title}>{user?.fullName || ""}</p>

          <p className={styles.message}>
            {lastMessage?.type === MessageType.TEXT &&
              ((lastMessage?.content as string) || "")}

            {lastMessage?.type === MessageType.IMAGE && "Đã gửi ảnh"}

            {lastMessage?.type === MessageType.FILE && "Đã gửi file"}
          </p>
        </div>
        <p className={styles.time}>
          {getRemainingTime(new Date(lastMessage.sendTime).getTime())}
        </p>
      </div>
    </div>
  );
}
