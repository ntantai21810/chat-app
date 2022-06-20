import Avatar from "../common/Avatar";
import styles from "./style.module.scss";

export interface IConversationTitleProps {
  name: string;
  avatar?: string;
  lastOnlineTime?: string;
}

export default function ConversationTitle(props: IConversationTitleProps) {
  const { name, avatar, lastOnlineTime } = props;

  // const lastOnlineMinutes = Math.floor(
  //   Moment().diff(Moment(lastOnlineTime)) / 1000 / 60
  // );

  return (
    <div className={styles.container}>
      {name && (
        <>
          <Avatar
            src={
              avatar ||
              "https://images.unsplash.com/photo-1652533881170-e72a154abbe1?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465"
            }
            alt="Conversation avatar"
          />
          <div className={styles.header}>
            <p className={styles.name}>{name}</p>

            {/* <p className={styles.onlineTime}>
              {lastOnlineTime
                ? `Truy cập ${lastOnlineMinutes} phút trước`
                : "Đang hoạt động"}
            </p> */}
          </div>
        </>
      )}
    </div>
  );
}
