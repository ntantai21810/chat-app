import classNames from "classnames";
import * as React from "react";
import { Moment } from "../../../configs/moment";
import { IMessage } from "../../../models/Message";
import { IUser } from "../../../models/User";
import Avatar from "../common/Avatar";
import styles from "./style.module.scss";

export interface IChattedUserItemProps {
  user: IUser;
  lastMessage: IMessage;
  onClick: (user: IUser) => any;
}

export default function ChattedUserItem(props: IChattedUserItemProps) {
  const { user, lastMessage, onClick } = props;

  return (
    <div
      className={classNames({
        [styles.container]: true,
        [styles.active]: false, //active
      })}
      onClick={() => onClick(user)}
    >
      <div>
        <Avatar
          src={
            user.avatar ||
            "https://images.unsplash.com/photo-1653257340129-148be674836c?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465"
          }
          alt="User avatar"
          width="5.6rem"
          hegiht="5.6rem"
        />
      </div>

      <div className={styles.right}>
        <div className={styles.content}>
          <p className={styles.title}>{user.fullName}</p>

          <p className={styles.message}>{lastMessage.content}</p>
        </div>
        <p className={styles.time}>{`${Math.floor(
          Moment().diff(Moment(lastMessage.sendTime)) / 1000 / 60
        )} phút`}</p>
      </div>
    </div>
  );
}
