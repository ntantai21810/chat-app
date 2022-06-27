import classNames from "classnames";
import * as React from "react";
import { IMessage, MessageType } from "../../../domains/Message";
import { IUser } from "../../../domains/User";
import { Moment } from "../../../helper/configs/moment";
import Avatar from "../common/Avatar";
import styles from "./style.module.scss";

export interface IChattedUserItemProps {
  user: IUser;
  lastMessage: IMessage;
  onClick?: Function;
}

export default function ChattedUserItem(props: IChattedUserItemProps) {
  const { user, lastMessage, onClick } = props;

  return (
    <div
      className={classNames({
        [styles.container]: true,
        [styles.active]: false, //active
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
          </p>
        </div>
        <p className={styles.time}>{`${Math.floor(
          Moment().diff(Moment(lastMessage.sendTime)) / 1000 / 60
        )} phút`}</p>
      </div>
    </div>
  );
}
