import * as React from "react";
import { IUser } from "../../../domains";
import styles from "../../assets/styles/UserCard.module.scss";
import Avatar from "../common/Avatar";

export interface IUserCardProps {
  user: IUser;
}

export default function UserCard(props: IUserCardProps) {
  const { user } = props;

  return (
    <div className={styles.container}>
      <div
        className={styles.background}
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1657143376804-2c8ef7bfa72d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")',
        }}
      ></div>
      <div className={styles.info}>
        <div className={styles.avatar}>
          <Avatar
            src={
              user.avatar ||
              "https://images.unsplash.com/photo-1655365225179-fbc453d3bd58?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            }
            alt="User avatar"
            width="8rem"
            hegiht="8rem"
          />
        </div>

        <p className={styles.fullName}>{user.fullName}</p>
        <p className={styles.phone}>{user.phone}</p>
      </div>
    </div>
  );
}
