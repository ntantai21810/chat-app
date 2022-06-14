import * as React from "react";
import { AiOutlineSend } from "react-icons/ai";
import {
  useAuth,
  useConversation,
  useMessage,
  useOnlineUser,
} from "../../../adapter/redux";
import { useSocket } from "../../../adapter/socketAdapter";
import {
  conversationController,
  messageController,
  socketController,
  userController,
} from "../../../bootstrap";
import { IConversation } from "../../../domains/Conversation";
import { MessageType } from "../../../domains/Message";
import { IUser } from "../../../domains/User";
import { Moment } from "../../../helper/configs/moment";
import ChattedUserList from "../../components/ChattedUserList";
import Banner from "../../components/common/Banner";
import Input from "../../components/common/Input";
import ConversationAction from "../../components/ConversationAction";
import ConversationContent from "../../components/ConversationContent";
import ConversationTitle from "../../components/ConversationTitle";
import OnlineUser from "../../components/OnlineUser";
import styles from "./style.module.scss";

export interface IChatPageProps {}

export default function ChatPage(props: IChatPageProps) {
  const conversations = useConversation();
  const auth = useAuth();
  const socket = useSocket();
  const messages = useMessage();
  const onlineUsers = useOnlineUser();
  const [message, setMessage] = React.useState("");
  const [activeConversation, setActiveConversation] =
    React.useState<Pick<IConversation, "user" | "lastOnlineTime">>();

  //Handler
  const handleChangeMessage = (e: React.ChangeEvent<any>) => {
    setMessage(e.target.value);
  };

  const handleSubmitMessage = () => {
    if (activeConversation && message)
      messageController.sendMessage({
        fromId: auth.auth.user._id,
        toId: activeConversation.user._id,
        type: MessageType.TEXT,
        content: message,
        sendTime: Moment().toISOString(),
      });

    setMessage("");
  };

  const handleClickOnUser = (user: IUser) => {
    setActiveConversation({
      user: user,
      lastOnlineTime: Date(),
    });
  };

  // //Connect socket
  // React.useEffect(() => {
  //   if (!socket && setSocket && auth._id && db) {
  //     const socket = io(
  //       process.env.REACT_APP_SOCKET_URL || "http://localhost:8000"
  //     );

  //     //Send info to server
  //     socket.emit(SOCKET_CONSTANTS.JOIN, auth._id);

  //     //Listen online user
  //     socket.on(SOCKET_CONSTANTS.USER_CONNECT, (users: IUser[] | IUser) => {
  //       if (Array.isArray(users)) dispatch(addManyOnlineUser(users));
  //       else dispatch(addOneOnlineUser(users));
  //     });

  //     //Listen disconnect user
  //     socket.on(
  //       SOCKET_CONSTANTS.USER_DISCONNECT,
  //       (userId: string | undefined) => {
  //         if (userId) {
  //           dispatch(removeOneOnlineUser(userId));
  //         }
  //       }
  //     );

  //     //Receive message
  //     socket.on(SOCKET_CONSTANTS.CHAT_MESSAGE, async (message: IMessage) => {
  //       console.log("Receive: ", message);
  //       dispatch(addMessageByReceive(message));

  //       if (db) {
  //         db.transaction("message", "readwrite")
  //           .objectStore("message")
  //           .add(message);
  //       }

  //       //Update lastMessage
  //       if (conversations[message.fromId]) {
  //         const updatedConversation = {
  //           ...conversations[message.fromId],
  //           lastMessage: message,
  //         };

  //         dispatch(updateConversation(updatedConversation));

  //         if (db) {
  //           db.transaction("conversation", "readwrite")
  //             .objectStore("conversation")
  //             .put(updatedConversation);
  //         }
  //       }
  //       //Create conversation
  //       else {
  //         const res = await getUser(message.fromId);
  //         const user = res.data;

  //         const updatedConversation = {
  //           user: user,
  //           lastMessage: message,
  //           lastOnlineTime: Moment().toISOString(),
  //         };

  //         dispatch(addConversation(updatedConversation));

  //         if (db) {
  //           db.transaction("conversation", "readwrite")
  //             .objectStore("conversation")
  //             .add(updatedConversation);
  //         }
  //       }
  //     });

  //     setSocket(socket);
  //   }
  // }, [auth.auth.user._id, setSocket, socket, dispatch, db, conversations]);

  //Connect socket
  React.useEffect(() => {
    if (auth.auth.accessToken) {
      socketController.connect(auth.auth.user._id, auth.auth.accessToken);
    }
  }, [auth.auth.accessToken, auth.auth.user._id]);

  //Listen socket
  React.useEffect(() => {
    if (socket.isConnected) {
      userController.listenUserOnline();
      userController.litenUserOffline();

      messageController.listenMessage();
    }
  }, [socket.isConnected]);

  //Get conversation from DB
  React.useEffect(() => {
    if (conversations.isDbLoaded) {
      conversationController.getConversations();
    }
  }, [conversations.isDbLoaded]);

  //Change conversation
  React.useEffect(() => {
    if (activeConversation && messages.isDbLoaded) {
      messageController.getMessages(
        auth.auth.user._id,
        activeConversation.user._id
      );
    }
  }, [activeConversation, messages.isDbLoaded, auth.auth.user._id]);

  return (
    <div className={styles.container}>
      <div className={styles.userListSection}>
        {onlineUsers.length > 0 && (
          <div className={styles.onlineUsers}>
            <OnlineUser users={onlineUsers} onUserClick={handleClickOnUser} />
          </div>
        )}
        <div className={styles.chattedUserList}>
          <ChattedUserList
            conversations={Object.values(conversations.conversations)}
            onConversationClick={handleClickOnUser}
          />
        </div>
      </div>

      {activeConversation ? (
        <div className={styles.conversationSection}>
          <div className={styles.conversationTitle}>
            <ConversationTitle
              user={activeConversation?.user}
              lastOnlineTime={activeConversation?.lastOnlineTime}
            />
          </div>

          <div className={styles.conversationContent}>
            <ConversationContent
              messages={
                messages.message[activeConversation?.user._id || ""] || []
              }
              fromUser={{
                _id: auth.auth.user._id,
                avatar: auth.auth.user.avatar,
              }}
              toUserAvatar={activeConversation?.user.avatar || ""}
            />
          </div>

          {activeConversation && (
            <>
              <div className={styles.conversationAction}>
                <ConversationAction />
              </div>

              <div className={styles.conversationInput}>
                <Input
                  border={false}
                  endIcon={<AiOutlineSend />}
                  placeholder="Nhập tin nhắn ..."
                  value={message}
                  onSubmit={handleSubmitMessage}
                  onChange={handleChangeMessage}
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <div className={styles.banner}>
          <Banner />
        </div>
      )}
    </div>
  );
}
