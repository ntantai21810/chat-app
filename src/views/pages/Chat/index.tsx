import * as React from "react";
import { AiOutlineSend } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { getDispatch } from "../../../adapter/frameworkAdapter";
import {
  useAuth,
  useCommon,
  useConversation,
  useFriends,
  useMessage,
} from "../../../adapter/redux";
import {
  conversationController,
  databaseController,
  friendController,
  messageController,
  socketController,
  userController,
} from "../../../bootstrap";
import { IConversation } from "../../../domains/Conversation";
import { IMessage, MessageType } from "../../../domains/Message";
import { IUser } from "../../../domains/User";
import { removeAllMessage } from "../../../framework/redux/message";
import { Moment } from "../../../helper/configs/moment";
import { SOCKET_CONSTANTS } from "../../../helper/constants";
import ChattedUserList from "../../components/ChattedUserList";
import Banner from "../../components/common/Banner";
import Image from "../../components/common/Image";
import Input from "../../components/common/Input";
import ConversationAction from "../../components/ConversationAction";
import ConversationContent from "../../components/ConversationContent";
import ConversationTitle from "../../components/ConversationTitle";
import SearchUserList from "../../components/SearchUserList";
import styles from "./style.module.scss";
import { v4 as uuidv4 } from "uuid";

export interface IChatPageProps {}

interface IFile {
  name: string;
  size: number;
  type: string;
  data: string;
}

const PAGE_SIZE = 20;

export default function ChatPage(props: IChatPageProps) {
  const conversations = useConversation();
  const auth = useAuth();
  const common = useCommon();
  const messages = useMessage();
  const friend = useFriends();
  const dispatch = getDispatch();

  const [page, setPage] = React.useState(1);
  const [isFullMessage, setIsFullMessage] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [files, setFiles] = React.useState<IFile[]>([]);
  const [searchUsers, setSearchUsers] = React.useState<IUser[]>([]);
  const [activeConversation, setActiveConversation] = React.useState<{
    id: string;
    user: IUser;
  }>();
  // const typingRef = React.useRef<NodeJS.Timeout | undefined>();

  //Handler
  const handleChangeMessage = (e: React.ChangeEvent<any>) => {
    // if (!typingRef.current) {
    //   messageController.sendTyping(activeConversation?.user._id || "", true);
    // } else clearTimeout(typingRef.current);

    // typingRef.current = setTimeout(() => {
    //   messageController.sendTyping(activeConversation?.user._id || "", false);
    //   typingRef.current = undefined;
    // }, 2000);

    setMessage(e.target.value);
  };

  const handleChangeSearch = (e: React.ChangeEvent<any>) => {
    setSearch(e.target.value);

    if (!e.target.value) {
      setSearchUsers([]);
    }
  };

  const handleSubmitSearch = async () => {
    const res = await userController.getUserByPhone(search);

    setSearchUsers(res);
  };

  const handleSubmitMessage = () => {
    if (activeConversation) {
      if (message) {
        messageController.sendMessage({
          fromId: auth.auth.user._id,
          toId: activeConversation.user._id,
          type: MessageType.TEXT,
          content: message,
          sendTime: Moment().toISOString(),
          conversationId: "",
          clientId: uuidv4(),
        });
      }

      if (files.length > 0) {
        messageController.sendMessage({
          fromId: auth.auth.user._id,
          toId: activeConversation.user._id,
          type: MessageType.IMAGE,
          content: files.map((file) => file.data).join("-"),
          sendTime: Moment().toISOString(),
          conversationId: "",
          clientId: uuidv4(),
        });
      }
    }

    setFiles([]);
    setMessage("");
  };

  const handleSubmitFiles = (files: string[]) => {
    if (activeConversation && files.length > 0) {
      messageController.sendMessage({
        fromId: auth.auth.user._id,
        toId: activeConversation.user._id,
        type: MessageType.IMAGE,
        content: files.join("-"),
        sendTime: Moment().toISOString(),
        conversationId: "",
        clientId: uuidv4(),
      });
    }
  };

  const handlePaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    const file = e.clipboardData.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = function () {
        if (
          reader.result &&
          typeof reader.result === "string" &&
          file.type.startsWith("image/")
        ) {
          const currentSize = files.reduce((size, file) => size + file.size, 0);

          //5mb
          if (currentSize + file.size <= 5000000) {
            setFiles((state) => [
              ...state,
              {
                name: file.name,
                type: file.type,
                size: file.size,
                data: reader.result as string,
              },
            ]);
          } else {
            //Handle error oversize
          }
        }
      };

      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    }
  };

  const handleDrop: React.DragEventHandler<HTMLInputElement> = (e) => {
    if (!e.dataTransfer.files) return;

    const currentSize = files.reduce((size, file) => size + file.size, 0);
    const incomingSize = Array.from(e.dataTransfer.files).reduce(
      (size, file) => size + file.size,
      0
    );

    // 5 mb
    if (currentSize + incomingSize > 5000000) return;

    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      const reader = new FileReader();

      const file = e.dataTransfer.files[i];

      reader.readAsDataURL(file);

      reader.onload = function () {
        if (
          reader.result &&
          typeof reader.result === "string" &&
          file.type.startsWith("image/")
        ) {
          setFiles((state) => [
            ...state,
            {
              name: file.name,
              size: file.size,
              type: file.type,
              data: reader.result as string,
            },
          ]);
        }
      };

      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    }
  };

  const handleClickOnConversation = (conversation: IConversation) => {
    if (conversation.userId !== activeConversation?.user._id) {
      setActiveConversation({
        id: conversation.id,
        user: friend.find((item) => item._id === conversation.userId)!,
      });

      messageController.addMessageToCache(messages.slice(-10));
    }
  };

  const handleCancleFile = (index: number) => {
    setFiles((state) => {
      return state.filter((_, i) => i !== index);
    });
  };

  const handleClickOnSearchUser = async (user: IUser) => {
    const userFriend = friend.find((item) => item._id === user._id);

    if (userFriend) {
      setActiveConversation({
        id: conversations.find((item) => item.userId === user._id)!.id,
        user: userFriend,
      });
    } else {
      const res = await userController.getUserById(user._id);

      setActiveConversation({
        id: "",
        user: res!,
      });
    }

    messageController.addMessageToCache(messages.slice(-10));
  };

  const handleScrollToTop = React.useCallback(
    () => setPage((state) => state + 1),
    []
  );

  //Connect datasource
  React.useEffect(() => {
    if (auth.auth.accessToken) {
      if (!common.isSocketConnected) {
        socketController.connect(auth.auth.user._id, auth.auth.accessToken);
      }

      if (!common.isDatabaseConnected) {
        databaseController.connect("chatApp", auth.auth.user._id);
      }
    }
  }, [auth.auth.accessToken, auth.auth.user._id, common]);

  //Get data from DB
  React.useEffect(() => {
    if (common.isDatabaseConnected) {
      conversationController.getAllConversations();
      friendController.getAllFriend();
    }
  }, [common.isDatabaseConnected]);

  //Change conversation socket
  React.useEffect(() => {
    if (common.isSocketConnected) {
      socketController.removeAllListener(SOCKET_CONSTANTS.CHAT_MESSAGE);

      socketController.listen(
        SOCKET_CONSTANTS.CHAT_MESSAGE,
        (message: IMessage) => {
          messageController.receiveMessage(
            message,
            !activeConversation ||
              activeConversation.user._id !== message.fromId
          );
        }
      );
    }
  }, [activeConversation, common.isSocketConnected]);

  //Change conversation database
  React.useEffect(() => {
    if (activeConversation && common.isDatabaseConnected) {
      //Get message

      setPage(1);
      setIsFullMessage(false);

      if (messages.length > 0) {
        dispatch(removeAllMessage());
      }

      messageController.getMessagesByConversation(activeConversation.id, {
        paginate: {
          page: 1,
          pageSize: PAGE_SIZE,
        },
      });
    }
  }, [activeConversation, common.isDatabaseConnected, dispatch]);

  // Scroll top
  React.useEffect(() => {
    const loadMore = async () => {
      if (page !== 1 && activeConversation && !isFullMessage) {
        const res = await messageController.getMessagesByConversationFromDB(
          activeConversation.id,
          {
            paginate: { page: page, pageSize: PAGE_SIZE },
          }
        );

        if (res.length === 0) {
          setIsFullMessage(true);
        }
      }
    };

    loadMore();
  }, [page, isFullMessage]);

  return (
    <div className={styles.container}>
      <div className={styles.userListSection}>
        <div className={styles.search}>
          <Input
            placeholder="Tìm kiếm"
            endIcon={<BsSearch />}
            className={styles.searchInput}
            border={false}
            value={search}
            onChange={handleChangeSearch}
            onSubmit={handleSubmitSearch}
          />
        </div>
        {search ? (
          <div className={styles.searchUser}>
            <p className={styles.title}>Kết quả tìm kiếm</p>
            <SearchUserList
              users={searchUsers}
              onClick={handleClickOnSearchUser}
            />
          </div>
        ) : (
          <div className={styles.chattedUserList}>
            <ChattedUserList
              conversations={conversations.map((item) => ({
                ...item,
                user: friend.find((f) => f._id === item.userId)!,
              }))}
              onConversationClick={handleClickOnConversation}
            />
          </div>
        )}
      </div>

      {activeConversation ? (
        <div className={styles.conversationSection}>
          <div className={styles.conversationTitle}>
            <ConversationTitle name={activeConversation?.user.fullName || ""} />
          </div>

          <div className={styles.conversationContent}>
            <ConversationContent
              messages={messages}
              currentUserId={auth.auth.user._id}
              currentUserAvatar={auth.auth.user.avatar || ""}
              chattingUserAvatar={activeConversation?.user.avatar || ""}
              onScrollToTop={handleScrollToTop}
            />

            {/* {messages.isTyping && (
              <div className={styles.typing}>
                <span>
                  {activeConversation.user.fullName || ""} đang nhập ...
                </span>
                <div>
                  <TypingIcon />
                </div>
              </div>
            )} */}
          </div>

          <div className={styles.conversationAction}>
            <ConversationAction onFileChange={handleSubmitFiles} />
          </div>

          <div className={styles.conversationInput}>
            <Input
              border={false}
              endIcon={<AiOutlineSend />}
              placeholder="Nhập tin nhắn ..."
              value={message}
              onSubmit={handleSubmitMessage}
              onChange={handleChangeMessage}
              onPaste={handlePaste}
              onDrop={handleDrop}
            />

            {files.length > 0 && (
              <div className={styles.images}>
                <div className={styles.title}>
                  <span>{files.length}</span> ảnh được chọn
                </div>
                <div className={styles.imagesContainer}>
                  {files.map((file, index) => (
                    <div className={styles.image} key={index}>
                      <Image
                        src={file.data}
                        alt="Image from clipboard"
                        width="100%"
                        height="100%"
                        closable={true}
                        onClose={() => handleCancleFile(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.banner}>
          <Banner />
        </div>
      )}
    </div>
  );
}
