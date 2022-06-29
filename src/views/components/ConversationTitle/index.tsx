import Avatar from "../common/Avatar";
import styles from "../../assets/styles/ConversationTitle.module.scss";

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
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZDHvxAjE2bfJbB-asv9kqio9ItBvUUwSHiA&usqp=CAU"
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
