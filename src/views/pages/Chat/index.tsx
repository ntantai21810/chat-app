import * as React from "react";
import { AiOutlineSend } from "react-icons/ai";
import ChattedUserList from "../../components/ChattedUserList";
import Input from "../../components/common/Input";
import ConversationAction from "../../components/ConversationAction";
import ConversationContent from "../../components/ConversationContent";
import ConversationTitle from "../../components/ConversationTitle";
import OnlineUser from "../../components/OnlineUser";
import styles from "./style.module.scss";

export interface IChatPageProps {}

export default function ChatPage(props: IChatPageProps) {
  // const [message, setMessage] = useState("");
  // const [activeConversation, setActiveConversation] =
  //   useState<Pick<IConversation, "user" | "lastOnlineTime">>();

  // const auth = useAuth();
  // const onlineUser = useAppSelector(selectAllOnlineUsers);
  // const allMessages = useAppSelector((state) => state.message);
  // const conversations = useAppSelector((state) => state.conversation);

  // const dispatch = useAppDispatch();

  // //Socket
  // const { socket, setSocket } = React.useContext(SocketContext);

  // //DB
  // const db = React.useContext(DBContext);

  // //Handler
  // const handleChangeMessage = (e: React.ChangeEvent<any>) => {
  //   setMessage(e.target.value);
  // };

  // const handleSubmitMessage = () => {
  //   if (activeConversation) {
  //     const data: IMessage = {
  //       fromId: auth._id,
  //       toId: activeConversation.user._id,
  //       type: MessageType.TEXT,
  //       content: message,
  //       sendTime: Moment().toISOString(),
  //     };

  //     dispatch(addMessageBySend(data));

  //     if (db) {
  //       db.transaction("message", "readwrite").objectStore("message").add(data);
  //     }

  //     if (socket) {
  //       socket.emit(SOCKET_CONSTANTS.CHAT_MESSAGE, data);
  //     }

  //     //Update lastMessage
  //     if (conversations[data.toId]) {
  //       const updatedConversation = {
  //         ...conversations[data.toId],
  //         lastMessage: data,
  //       };

  //       dispatch(updateConversation(updatedConversation));

  //       if (db) {
  //         db.transaction("conversation", "readwrite")
  //           .objectStore("conversation")
  //           .put(updatedConversation);
  //       }
  //     }
  //     //Create conversation
  //     else {
  //       const updatedConversation = {
  //         user: activeConversation.user,
  //         lastMessage: data,
  //         lastOnlineTime: Moment().toISOString(),
  //       };

  //       dispatch(addConversation(updatedConversation));

  //       if (db) {
  //         db.transaction("conversation", "readwrite")
  //           .objectStore("conversation")
  //           .add(updatedConversation);
  //       }
  //     }
  //   }

  //   setMessage("");
  // };

  // const handleOnlineUserClick = (user: IUser) => {
  //   setActiveConversation({
  //     user: user,
  //     lastOnlineTime: Moment().toISOString(),
  //   });
  // };

  // const handleConversationClick = (user: IUser) => {
  //   setActiveConversation({
  //     user: user,
  //     lastOnlineTime: conversations[user._id].lastOnlineTime,
  //   });
  // };

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

  // //Get conversation from DB
  // React.useEffect(() => {
  //   if (db) {
  //     const request = db
  //       .transaction("conversation")
  //       .objectStore("conversation")
  //       .getAll();

  //     request.onsuccess = (event) => {
  //       dispatch(addConversation((event.target as IDBRequest).result));
  //     };

  //     request.onerror = (event) => {
  //       console.log(event);
  //     };
  //   }
  // }, [db, dispatch]);

  // // //Handle change conversation
  // React.useEffect(() => {
  //   if (
  //     db &&
  //     activeConversation &&
  //     !allMessages[activeConversation.user._id || ""]
  //   ) {
  //     const request = db
  //       .transaction("message")
  //       .objectStore("message")
  //       .index("messageId")
  //       .getAll(IDBKeyRange.only([auth._id, activeConversation.user._id]));

  //     request.onsuccess = (event) => {
  //       const data: IMessage[] = (event.target as IDBRequest).result;

  //       dispatch(
  //         addManyMessage({
  //           toUserId: activeConversation.user._id,
  //           messages: data,
  //         })
  //       );
  //     };

  //     const requestRevert = db
  //       .transaction("message")
  //       .objectStore("message")
  //       .index("messageId")
  //       .getAll(IDBKeyRange.only([activeConversation.user._id, auth._id]));

  //     requestRevert.onsuccess = (event) => {
  //       const data: IMessage[] = (event.target as IDBRequest).result;

  //       dispatch(
  //         addManyMessage({
  //           toUserId: activeConversation.user._id,
  //           messages: data,
  //         })
  //       );
  //     };
  //   }
  // }, [db, activeConversation, allMessages, auth.auth.user._id, dispatch]);

  return (
    // <div className={styles.container}>
    //   <div className={styles.userListSection}>
    //     {onlineUser.length > 0 && (
    //       <div className={styles.onlineUsers}>
    //         <OnlineUser
    //           users={onlineUser}
    //           onUserClick={handleOnlineUserClick}
    //         />
    //       </div>
    //     )}
    //     <div className={styles.chattedUserList}>
    //       <ChattedUserList
    //         conversations={Object.values(conversations)}
    //         onConversationClick={handleConversationClick}
    //       />
    //     </div>
    //   </div>

    //   <div className={styles.conversationSection}>
    //     <div className={styles.conversationTitle}>
    //       <ConversationTitle
    //         user={activeConversation?.user}
    //         lastOnlineTime={activeConversation?.lastOnlineTime}
    //       />
    //     </div>

    //     <div className={styles.conversationContent}>
    //       <ConversationContent
    //         messages={allMessages[activeConversation?.user._id || ""] || []}
    //         fromUser={{
    //           _id: auth.auth.user._id,
    //           avatar: auth.auth.user.avatar,
    //         }}
    //         toUserAvatar={activeConversation?.user.avatar || ""}
    //       />
    //     </div>

    //     {activeConversation && (
    //       <>
    //         <div className={styles.conversationAction}>
    //           <ConversationAction />
    //         </div>

    //         <div className={styles.conversationInput}>
    //           <Input
    //             border={false}
    //             icon={<AiOutlineSend />}
    //             placeholder="Nhập tin nhắn ..."
    //             value={message}
    //             onSubmit={handleSubmitMessage}
    //             onChange={handleChangeMessage}
    //           />
    //         </div>
    //       </>
    //     )}
    //   </div>
    // </div>
    <div>123</div>
  );
}
