import * as React from "react";
import { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { io } from "socket.io-client";
import { SocketContext } from "../../App";
import ChattedUserList from "../../components/ChattedUserList";
import Input from "../../components/common/Input";
import ConversationAction from "../../components/ConversationAction";
import ConversationContent from "../../components/ConversationContent";
import ConversationTitle from "../../components/ConversationTitle";
import OnlineUser from "../../components/OnlineUser";
import { SOCKET_CONSTANTS } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { IUser } from "../../models/User";
import {
  addManyOnlineUser,
  addOneOnlineUser,
  removeOneOnlineUser,
  selectAllOnlineUsers,
} from "../../redux/onlineUser";
import styles from "./style.module.scss";

export interface IChatPageProps {}

export default function ChatPage(props: IChatPageProps) {
  const [message, setMessage] = useState("");

  //Redux
  const auth = useAppSelector((state) => state.auth);
  const onlineUser = useAppSelector(selectAllOnlineUsers);
  const dispatch = useAppDispatch();

  //Socket
  const { socket, setSocket } = React.useContext(SocketContext);

  //Connect socket
  React.useEffect(() => {
    if (!socket && setSocket && auth._id) {
      const socket = io(
        process.env.REACT_APP_SOCKET_URL || "http://localhost:8000"
      );

      socket.emit(SOCKET_CONSTANTS.JOIN, auth._id);

      socket.on(SOCKET_CONSTANTS.USER_CONNECT, (users: IUser[] | IUser) => {
        if (Array.isArray(users)) dispatch(addManyOnlineUser(users));
        else dispatch(addOneOnlineUser(users));
      });

      socket.on(
        SOCKET_CONSTANTS.USER_DISCONNECT,
        (userId: string | undefined) => {
          if (userId) {
            dispatch(removeOneOnlineUser(userId));
          }
        }
      );

      setSocket(socket);
    }
  }, [auth._id, setSocket, socket, dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.userListSection}>
        {onlineUser.length > 0 && (
          <div className={styles.onlineUsers}>
            <OnlineUser users={onlineUser} />
          </div>
        )}
        <div className={styles.chattedUserList}>
          <ChattedUserList />
        </div>
      </div>

      <div className={styles.conversationSection}>
        <div className={styles.conversationTitle}>
          <ConversationTitle />
        </div>

        <div className={styles.conversationContent}>
          <ConversationContent />
        </div>

        <div className={styles.conversationAction}>
          <ConversationAction />
        </div>

        <div className={styles.conversationInput}>
          <Input
            border={false}
            icon={<AiOutlineSend />}
            placeholder="Nhập tin nhắn ..."
            value={message}
            onSubmit={() => {
              setMessage("");
            }}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
