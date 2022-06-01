import * as React from "react";
import { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { io } from "socket.io-client";
import { DBContext, SocketContext } from "../../App";
import ChattedUserList from "../../components/ChattedUserList";
import Input from "../../components/common/Input";
import ConversationAction from "../../components/ConversationAction";
import ConversationContent from "../../components/ConversationContent";
import ConversationTitle from "../../components/ConversationTitle";
import OnlineUser from "../../components/OnlineUser";
import { Moment } from "../../configs/moment";
import { SOCKET_CONSTANTS } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { IConversation } from "../../models/Conversation";
import { MessageType } from "../../models/Message";
import { IUser } from "../../models/User";
import { addConversation } from "../../redux/conversation";
import { addMessage } from "../../redux/message";
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
  const [activeConversation, setActiveConversation] = useState<IConversation>();

  //Redux
  const auth = useAppSelector((state) => state.auth);
  const onlineUser = useAppSelector(selectAllOnlineUsers);
  const allMessages = useAppSelector((state) => state.message);
  const conversations = useAppSelector(
    (state) => state.conversation.conversations
  );
  const activeConversationId = useAppSelector(
    (state) => state.conversation.activeConversationId
  );

  console.log(allMessages);

  const dispatch = useAppDispatch();

  //Socket
  const { socket, setSocket } = React.useContext(SocketContext);

  //DB
  const db = React.useContext(DBContext);

  //Handler
  const handleChangeMessage = (e: React.ChangeEvent<any>) => {
    setMessage(e.target.value);
  };

  const handleSubmitMessage = () => {
    dispatch(
      addMessage({
        fromId: auth._id,
        toId: "123",
        type: MessageType.TEXT,
        content: message,
        sendTime: Moment().toDate(),
      })
    );
  };

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

  //Get conversation from DB
  React.useEffect(() => {
    if (db) {
      const request = db
        .transaction("conversation")
        .objectStore("conversation")
        .getAll();

      request.onsuccess = (event) => {
        dispatch(addConversation((event.target as IDBRequest).result));
      };

      request.onerror = (event) => {
        console.log(event);
      };
    }
  }, [db, dispatch]);

  //Handle change conversation
  React.useEffect(() => {
    setActiveConversation(conversations[activeConversationId]);
  }, [conversations, activeConversationId]);

  return (
    <div className={styles.container}>
      <div className={styles.userListSection}>
        {onlineUser.length > 0 && (
          <div className={styles.onlineUsers}>
            <OnlineUser users={onlineUser} />
          </div>
        )}
        <div className={styles.chattedUserList}>
          <ChattedUserList conversations={Object.values(conversations)} />
        </div>
      </div>

      <div className={styles.conversationSection}>
        <div className={styles.conversationTitle}>
          <ConversationTitle
            user={activeConversation?.user}
            lastOnlineTime={activeConversation?.lastOnlineTime}
          />
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
            onSubmit={handleSubmitMessage}
            onChange={handleChangeMessage}
          />
        </div>
      </div>
    </div>
  );
}
