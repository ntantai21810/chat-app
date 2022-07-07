import * as React from "react";
import { AiOutlineSend } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
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
import { IFile } from "../../../domains/common/helper";
import { IConversation } from "../../../domains/Conversation";
import { IMessage, MessageStatus, MessageType } from "../../../domains/Message";
import { IUser } from "../../../domains/User";
import {
  setShowNotification,
  setSocketConnect,
} from "../../../framework/redux/common";
import { removeAllMessage } from "../../../framework/redux/message";
import { SOCKET_CONSTANTS } from "../../../helper";
import styles from "../../assets/styles/ChatPage.module.scss";
import ChattedUserList from "../../components/ChattedUserList";
import AutoResizeInput from "../../components/common/AutoResizeInput";
import Banner from "../../components/common/Banner";
import Image from "../../components/common/Image";
import Input from "../../components/common/Input";
import Notification from "../../components/common/Notification";
import TypingIcon from "../../components/common/Typing";
import ConversationAction from "../../components/ConversationAction";
import ConversationContent from "../../components/ConversationContent";
import ConversationTitle from "../../components/ConversationTitle";
import SearchMessageList from "../../components/SearchMessageList";
import SearchUserList from "../../components/SearchUserList";

export interface IChatPageProps {}

const worker = new Worker(
  new URL("../../assets/js/spell.worker.js", import.meta.url)
);

const PAGE_SIZE = 20;

export default function ChatPage(props: IChatPageProps) {
  const conversations = useConversation();
  const auth = useAuth();
  const common = useCommon();
  const messages = useMessage();
  const friend = useFriends();
  const dispatch = getDispatch();

  const [isTyping, setIsTyping] = React.useState(false);
  const [isFullMessage, setIsFullMessage] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [message, setMessage] = React.useState({ message: "", checked: "" });
  const [files, setFiles] = React.useState<IFile[]>([]);
  const [searchUsers, setSearchUsers] = React.useState<IUser[]>([]);
  const [searchConversations, setSearchConversations] = React.useState<
    IConversation[]
  >([]);
  const [searchMessages, setSearchMessages] = React.useState<IMessage[]>([]);
  const [activeConversation, setActiveConversation] = React.useState<{
    id: string;
    user: IUser;
  }>();
  const [percentFileDownloading, setPercentFileDownloading] = React.useState<{
    url: string;
    percent: number;
  }>({
    url: "",
    percent: 0,
  });
  const [scrollToTargetMessage, setScrollTargetTopMessage] = React.useState("");
  const [highlightMessage, setHighlightMessage] = React.useState("");

  const typingRef = React.useRef<NodeJS.Timeout>();
  const searchRef = React.useRef<NodeJS.Timeout>();

  //Handler
  const handleChangeMessage = (value: string) => {
    if (!typingRef.current) {
      socketController.send(SOCKET_CONSTANTS.TYPING, {
        isTyping: true,
        toUserId: activeConversation?.user._id,
      });
    } else clearTimeout(typingRef.current);

    typingRef.current = setTimeout(() => {
      socketController.send(SOCKET_CONSTANTS.TYPING, {
        isTyping: false,
        toUserId: activeConversation?.user._id,
      });

      typingRef.current = undefined;
    }, 2000);

    setMessage((state) => ({
      ...state,
      message: value.replaceAll("\n", ""),
    }));

    if (value.replaceAll("\n", ""))
      worker.postMessage({
        type: "check",
        text: value.replaceAll("\n", ""),
      });
  };

  const handleChangeSearch = async (e: React.ChangeEvent<any>) => {
    setSearch(e.target.value);

    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }

    searchRef.current = setTimeout(async () => {
      const startTime = new Date().getTime();

      const result = await messageController.searchMessage(e.target.value);

      const endTime = new Date().getTime();

      console.log(`Search took ${endTime - startTime} milliseconds`);

      setSearchMessages(result);
      setSearchConversations(
        conversations.filter((item) =>
          friend
            .find((f) => f._id === item.userId)
            ?.fullName.toLowerCase()
            .trim()
            .includes(e.target.value.toLowerCase().trim())
        )
      );

      if (e.target.value?.length === 10 || e.target.value?.length === 11) {
        const res = await userController.getUserByPhone(e.target.value);

        setSearchUsers(res);
      } else {
        setSearchUsers([]);
      }
    }, 500);
  };

  const handleSubmitMessage = () => {
    if (activeConversation) {
      if (message.message || files.length > 0) {
        setScrollTargetTopMessage("");
        setHighlightMessage("");
      }

      if (
        message.message &&
        message.message.trim() !== "" &&
        message.message.trim().charCodeAt(0) !== 10
      ) {
        messageController.sendMessage({
          fromId: auth.auth.user._id,
          toId: activeConversation.user._id,
          type: MessageType.TEXT,
          content: message.message,
          conversationId: "",
          sendTime: new Date().toISOString(),
          clientId: uuidv4(),
          status: MessageStatus.PENDING,
        });
      }

      if (files.length > 0) {
        messageController.sendMessage({
          fromId: auth.auth.user._id,
          toId: activeConversation.user._id,
          type: MessageType.IMAGE,
          content: files,
          sendTime: new Date().toISOString(),
          conversationId: "",
          clientId: uuidv4(),
          status: MessageStatus.PENDING,
        });

        setScrollTargetTopMessage("");
        setHighlightMessage("");
      }
    }

    setFiles([]);
    setMessage({
      message: "",
      checked: "",
    });
  };

  const handleImageClick = React.useCallback((image: IFile) => {
    (window as any).electronAPI.viewPhoto(image.data);
  }, []);

  const handleSubmitFiles = (files: IFile[]) => {
    if (activeConversation && files.length > 0) {
      setScrollTargetTopMessage("");
      setHighlightMessage("");

      if (files[0].type.startsWith("image/")) {
        messageController.sendMessage({
          fromId: auth.auth.user._id,
          toId: activeConversation.user._id,
          type: MessageType.IMAGE,
          content: files,
          sendTime: new Date().toISOString(),
          conversationId: "",
          clientId: uuidv4(),
          status: MessageStatus.PENDING,
        });
      } else {
        messageController.sendMessage({
          fromId: auth.auth.user._id,
          toId: activeConversation.user._id,
          type: MessageType.FILE,
          content: files,
          sendTime: new Date().toISOString(),
          conversationId: "",
          clientId: uuidv4(),
          status: MessageStatus.PENDING,
        });
      }
    }
  };

  const handlePaste: React.ClipboardEventHandler<HTMLSpanElement> = (e) => {
    const file = e.clipboardData.files[0];

    if (file) e.preventDefault();

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
      setScrollTargetTopMessage("");
      setHighlightMessage("");
      messageController.addMessageToCache(messages.slice(-20));
    }
  };

  const handleCancleFile = (index: number) => {
    setFiles((state) => {
      return state.filter((_, i) => i !== index);
    });
  };

  const handleClickOnSearchUser = async (user: IUser) => {
    setScrollTargetTopMessage("");
    setHighlightMessage("");

    let conversationId = "";

    const userFriend = friend.find((item) => item._id === user._id);

    if (userFriend) {
      conversationId = conversations.find(
        (item) => item.userId === user._id
      )!.id;
      setActiveConversation({
        id: conversationId,
        user: userFriend,
      });
    } else if (!userFriend) {
      const res = await userController.getUserById(user._id);

      setActiveConversation({
        id: "",
        user: res!,
      });
    }

    messageController.addMessageToCache(messages.slice(-20));

    if (messages.length > 0) {
      dispatch(removeAllMessage());
    }

    messageController.getMessagesByConversation(
      conversationId,
      undefined,
      undefined,
      PAGE_SIZE
    );
  };

  const handleScrollToTop = React.useCallback(async () => {
    if (messages[0] && activeConversation && !isFullMessage) {
      const res = await messageController.loadMoreMessage(
        activeConversation.id,
        messages[0],
        PAGE_SIZE
      );
      if (res.length <= 1) {
        setIsFullMessage(true);
      }
      setScrollTargetTopMessage(
        `message-${
          messages[0].fromId + messages[0].toId + messages[0].clientId
        }`
      );
    }
  }, [messages, activeConversation, isFullMessage]);

  const handleRetry = React.useCallback((message: IMessage) => {
    messageController.retryMessage(message);
  }, []);

  const handleDownloadFile = React.useCallback((url: string) => {
    setPercentFileDownloading({
      url: url,
      percent: 0,
    });

    (window as any).electronAPI.download(url);
  }, []);

  const handleClickOnSearchMessage = async (message: IMessage) => {
    dispatch(removeAllMessage());

    const res = await messageController.getMessagesByConversation(
      message.conversationId,
      message,
      undefined,
      undefined,
      undefined,
      false
    );

    setScrollTargetTopMessage(
      `message-${message.fromId + message.toId + message.clientId}`
    );

    setHighlightMessage(
      `message-${message.fromId + message.toId + message.clientId}`
    );

    if (res.length <= 15) {
      messageController.getMessagesByConversation(
        message.conversationId,
        undefined,
        message,
        10,
        true,
        false
      );
    }

    setActiveConversation({
      id: message.conversationId,
      user: friend.find(
        (item) =>
          item._id ===
          (message.toId === auth.auth.user._id ? message.fromId : message.toId)
      )!,
    });
  };

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

  //Notification
  React.useEffect(() => {
    if (common.showNotification) {
      setTimeout(() => {
        dispatch(setShowNotification(false));
      }, 2000);
    }
  }, [common.showNotification]);

  //Get data from DB
  React.useEffect(() => {
    if (common.isDatabaseConnected) {
      conversationController.getAllConversations();
      friendController.getAllFriend();
    }
  }, [common.isDatabaseConnected]);

  React.useEffect(() => {
    socketController.listen("connect", () => dispatch(setSocketConnect(true)));
    socketController.listen("disconnect", () =>
      dispatch(setSocketConnect(false))
    );
    socketController.listen("connect_error", () =>
      dispatch(setSocketConnect(false))
    );

    (window as any).electronAPI?.removeDownloadFileListener();

    (window as any).electronAPI?.onDownloadFileProgress((percent: number) => {
      setPercentFileDownloading((state) => ({ ...state, percent }));
    });

    worker.addEventListener("message", (ev) => {
      console.log("Main: ", ev.data.text);

      setMessage((state) => ({ ...state, checked: ev.data.text }));
    });
  }, []);

  //Sync message
  React.useEffect(() => {
    if (common.isDatabaseConnected && common.isSocketConnected) {
      messageController.syncMessage();
    }
  }, [common.isDatabaseConnected, common.isSocketConnected]);

  //Change conversation socket
  React.useEffect(() => {
    if (common.isSocketConnected) {
      socketController.removeListener(SOCKET_CONSTANTS.CHAT_MESSAGE);
      socketController.removeListener(SOCKET_CONSTANTS.UPDATE_MESSAGE);
      socketController.removeListener(SOCKET_CONSTANTS.TYPING);

      socketController.listen(
        SOCKET_CONSTANTS.CHAT_MESSAGE,
        (message: IMessage) => {
          message.status = MessageStatus.RECEIVED;

          messageController.receiveMessage(
            message,
            !activeConversation ||
              activeConversation.user._id !== message.fromId
          );

          socketController.send(SOCKET_CONSTANTS.ACK_MESSAGE, message);
        }
      );

      socketController.listen(
        SOCKET_CONSTANTS.UPDATE_MESSAGE,
        (message: IMessage) => {
          messageController.updateMessage(
            message,
            !activeConversation || activeConversation.user._id !== message.toId
          );
        }
      );

      socketController.listen(
        SOCKET_CONSTANTS.TYPING,
        (data: { isTyping: boolean; fromUserId: string }) => {
          if (activeConversation?.user._id === data.fromUserId)
            setIsTyping(data.isTyping);
        }
      );
    }
  }, [activeConversation, common.isSocketConnected]);

  //Change conversation database
  React.useEffect(() => {
    setIsFullMessage(false);
    setIsTyping(false);

    if (activeConversation && common.isDatabaseConnected && !search) {
      //Get message
      setScrollTargetTopMessage("");
      setHighlightMessage("");

      if (messages.length > 0) {
        dispatch(removeAllMessage());
      }

      messageController.getMessagesByConversation(
        activeConversation.id,
        undefined,
        undefined,
        PAGE_SIZE
      );
    }
  }, [activeConversation, common.isDatabaseConnected, dispatch]);

  return (
    <>
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
            />
          </div>
          {search ? (
            <div className={styles.searchResult}>
              <p className={styles.title}>Người dùng</p>
              <SearchUserList
                users={searchUsers}
                onClick={handleClickOnSearchUser}
              />

              <SearchUserList
                users={searchConversations.map(
                  (item) => friend.find((f) => f._id === item.userId)!
                )}
                onClick={handleClickOnSearchUser}
              />

              <p className={styles.title}>Tin nhắn</p>

              <SearchMessageList
                messages={searchMessages.map((item) => ({
                  ...item,
                  conversation: conversations.find(
                    (c) => c.id === item.conversationId
                  ) as IConversation,
                  user:
                    friend.find((u) => u._id === item.fromId) || auth.auth.user,
                }))}
                onClick={handleClickOnSearchMessage}
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
                currentConversationId={activeConversation?.id}
              />
            </div>
          )}
        </div>

        {activeConversation ? (
          <div className={styles.conversationSection}>
            <div className={styles.conversationTitle}>
              <ConversationTitle
                name={activeConversation?.user.fullName || ""}
              />
            </div>

            <div className={styles.conversationContent}>
              <ConversationContent
                messages={messages}
                currentUserId={auth.auth.user._id}
                currentUserAvatar={auth.auth.user.avatar || ""}
                chattingUserAvatar={activeConversation?.user.avatar || ""}
                onScrollToTop={handleScrollToTop}
                onRetry={handleRetry}
                onDownloadFile={handleDownloadFile}
                onImageClick={handleImageClick}
                percentFileDownloading={percentFileDownloading}
                scrollToElement={scrollToTargetMessage}
                highlightElement={highlightMessage}
              />

              {isTyping && (
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

            <div className={styles.conversationAction}>
              <ConversationAction onFileChange={handleSubmitFiles} />
            </div>

            <div className={styles.conversationInput}>
              {/* <Input
                border={false}
                endIcon={<AiOutlineSend />}
                placeholder="Nhập tin nhắn ..."
                value={message}
                onSubmit={handleSubmitMessage}
                onChange={handleChangeMessage}
                onPaste={handlePaste}
                onDrop={handleDrop}
              /> */}

              <AutoResizeInput
                endIcon={<AiOutlineSend />}
                value={message.checked}
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

      {common.showNotification && (
        <Notification type="error" message="Tải ảnh lên thất bại" />
      )}
    </>
  );
}
