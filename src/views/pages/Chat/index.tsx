import * as React from "react";
import { AiOutlineSend } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
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
import TypingIcon from "../../components/common/Typing";
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
    React.useState<Pick<IConversation, "user">>();
  const typingRef = React.useRef<NodeJS.Timeout | undefined>();

  //Handler
  const handleChangeMessage = (e: React.ChangeEvent<any>) => {
    if (!typingRef.current) {
      messageController.sendTyping(activeConversation?.user._id || "", true);
    } else clearTimeout(typingRef.current);

    typingRef.current = setTimeout(() => {
      messageController.sendTyping(activeConversation?.user._id || "", false);
      typingRef.current = undefined;
    }, 2000);

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
    if (user._id !== activeConversation?.user._id) {
      setActiveConversation({
        user: user,
      });
    }
  };

  //Connect datasource
  React.useEffect(() => {
    if (auth.auth.accessToken) {
      if (!socket.isConnected) {
        socketController.connect(auth.auth.user._id, auth.auth.accessToken);
      }

      conversationController.connectDB("chatApp", auth.auth.user._id);
      messageController.connectDB("chatApp", auth.auth.user._id);
    }
  }, [auth.auth.accessToken, auth.auth.user._id, socket.isConnected]);

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
    if (activeConversation && messages.isDbLoaded && auth.auth.user._id) {
      //Get message
      messageController.getMessages(
        auth.auth.user._id,
        activeConversation.user._id
      );

      //Listen typing
      messageController.removeListenTyping();
      messageController.listenTyping(activeConversation.user._id);
    }
  }, [activeConversation, messages.isDbLoaded, auth.auth.user._id]);

  // Update last online time
  React.useEffect(() => {
    if (conversations.conversations[activeConversation?.user._id || ""]) {
      setActiveConversation({
        user: conversations.conversations[activeConversation?.user._id || ""]
          .user,
      });
    } else if (
      !onlineUsers.find((item) => item._id === activeConversation?.user._id) &&
      activeConversation
    ) {
      setActiveConversation((state) => ({
        user: {
          ...state!.user,
          lastOnlineTime: Moment().toString(),
        },
      }));
    }
  }, [conversations.conversations, onlineUsers]);

  return (
    <div className={styles.container}>
      <div className={styles.userListSection}>
        <div className={styles.search}>
          <Input
            placeholder="Tìm kiếm"
            endIcon={<BsSearch />}
            className={styles.searchInput}
            border={false}
          />
        </div>
        {onlineUsers.length > 0 && (
          <div className={styles.onlineUsers}>
            <OnlineUser users={onlineUsers} onUserClick={handleClickOnUser} />
          </div>
        )}
        <div className={styles.chattedUserList}>
          <ChattedUserList
            conversations={Object.values(conversations.conversations).sort(
              (c1, c2) =>
                Moment(c1.lastMessage.sendTime).unix() -
                Moment(c2.lastMessage.sendTime).unix()
            )}
            onConversationClick={handleClickOnUser}
          />
        </div>
      </div>

      {activeConversation ? (
        <div className={styles.conversationSection}>
          <div className={styles.conversationTitle}>
            <ConversationTitle
              user={activeConversation?.user}
              lastOnlineTime={
                onlineUsers.find(
                  (item) => item._id === activeConversation.user._id
                )
                  ? undefined
                  : activeConversation?.user.lastOnlineTime
              }
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

            {messages.isTyping && (
              <div className={styles.typing}>
                <span>
                  {activeConversation.user.fullName || ""} đang nhập ...
                </span>
                <div>
                  <TypingIcon />
                </div>
              </div>
            )}
          </div>

          {activeConversation && (
            <>
              <div className={styles.conversationAction}>
                <ConversationAction
                  onFileChange={(files) => console.log({ files })}
                />
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
