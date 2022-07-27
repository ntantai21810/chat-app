import * as React from "react";
import { AiOutlineArrowDown, AiOutlineSend } from "react-icons/ai";
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
  commonController,
  conversationController,
  databaseController,
  friendController,
  messageController,
  socketController,
  userController,
} from "../../../bootstrap";
import { IFile } from "../../../domains/common/helper";
import { IConversation } from "../../../domains/Conversation";
import {
  IMessage,
  IMessageThumb,
  MessageStatus,
  MessageType,
} from "../../../domains/Message";
import { IUser } from "../../../domains/User";
import {
  setShowNotification,
  setSocketConnect,
} from "../../../framework/redux/common";
import { removeAllMessage } from "../../../framework/redux/message";
import { SOCKET_CONSTANTS, tokenizer } from "../../../helper";
import styles from "../../assets/styles/ChatPage.module.scss";
import ChattedUserList from "../../components/ChattedUserList";
import AutoResizeInput from "../../components/common/AutoResizeInput";
import Banner from "../../components/common/Banner";
import Button from "../../components/common/Button";
import Image from "../../components/common/Image";
import Input from "../../components/common/Input";
import LoadingIcon from "../../components/common/LoadingIcon";
import Modal from "../../components/common/Modal";
import { default as NotificationComponent } from "../../components/common/Notification";
import TypingIcon from "../../components/common/Typing";
import ConversationAction from "../../components/ConversationAction";
import ConversationContent from "../../components/ConversationContent";
import ConversationTitle from "../../components/ConversationTitle";
import SearchMessageList from "../../components/SearchMessageList";
import SearchUserList from "../../components/SearchUserList";
import UserCard from "../../components/UserCard";

export interface IChatPageProps {}

export const parserWorker = new Worker(
  new URL("../../assets/js/parser.worker.js", import.meta.url)
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
  const [images, setImages] = React.useState<IFile[]>([]);
  const [searchUsers, setSearchUsers] = React.useState<IUser[]>([]);
  const [searchConversations, setSearchConversations] = React.useState<
    IConversation[]
  >([]);
  const [thumb, setThumb] = React.useState<IMessageThumb>();
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
  const [userModal, setUserModal] = React.useState<IUser>();
  const [notification, setNotification] = React.useState<{
    type: "error" | "success";
    message: string;
  }>();
  const [isLoadingUserModal, setIsLoadingUserModal] = React.useState(false);
  const [showScrollBtn, setShowScrollBtn] = React.useState(false);
  const [render, forceRender] = React.useState({});

  const typingRef = React.useRef<NodeJS.Timeout>();
  const showTypingRef = React.useRef<NodeJS.Timeout>();
  const searchRef = React.useRef<NodeJS.Timeout>();
  const conversationInputRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLSpanElement | null>(null);
  const conversationContentRef = React.useRef<HTMLDivElement | null>(null);
  const showScrollBtnRef = React.useRef(false);
  const lastNotiRef = React.useRef<Notification>();
  const sendingMessage = React.useRef(false);

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
  };

  const handleChangeSearch = async (e: React.ChangeEvent<any>) => {
    if (!e.target.value) {
      setSearch("");
      clearTimeout(searchRef.current);
    }

    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }

    searchRef.current = setTimeout(async () => setSearch(e.target.value), 200);
  };

  const handleSubmitMessage = async (message: string) => {
    if (activeConversation) {
      if (message || images.length > 0) {
        setScrollTargetTopMessage("");
        setHighlightMessage("");
      }

      if (
        message &&
        message.trim() !== "" &&
        message.trim().charCodeAt(0) !== 10
      ) {
        const newMessage: IMessage = {
          fromId: auth.auth.user._id,
          toId: activeConversation.user._id,
          type: MessageType.TEXT,
          content: message.replace(/\u00a0/g, " "),
          conversationId: "",
          sendTime: new Date().toISOString(),
          clientId: uuidv4(),
          status: MessageStatus.PENDING,
          thumb: thumb,
        };

        try {
          await messageController.sendMessage(newMessage);

          await messageController.createMessageThumb([newMessage]);
        } catch (e) {
          setNotification({
            type: "error",
            message: "Gửi tin nhắn thất bại",
          });
          dispatch(setShowNotification(true));
        }
      }

      if (images.length > 0 && !sendingMessage.current) {
        sendingMessage.current = true;

        for (let image of images.reverse()) {
          try {
            messageController.sendMessage({
              fromId: auth.auth.user._id,
              toId: activeConversation.user._id,
              type: MessageType.IMAGE,
              content: [image],
              sendTime: new Date().toISOString(),
              conversationId: "",
              clientId: uuidv4(),
              status: MessageStatus.PENDING,
            });
          } catch (e) {
            setNotification({
              type: "error",
              message: "Gửi tin nhắn thất bại",
            });
            dispatch(setShowNotification(true));
          }
        }
      }

      setImages([]);
      setThumb(undefined);
      sendingMessage.current = false;
    }
  };

  const handleClickOnPhone = React.useCallback(async (phone: string) => {
    setIsLoadingUserModal(true);
    const user = await userController.getOneUserByPhone(phone);
    setIsLoadingUserModal(false);

    if (user) {
      setUserModal(user);
    } else {
      dispatch(setShowNotification(true));
      setNotification({
        type: "error",
        message: "Không tìm thấy người dùng với số điện thoại này",
      });
    }
  }, []);

  const handleClickOnLink = React.useCallback(async (url: string) => {
    (window as any).electronAPI.openLink(url);
  }, []);

  const handleImageMessageClick = React.useCallback(
    async (image: IFile, message: IMessage) => {
      const res = await messageController.getMessagesTypeByConversation(
        message.conversationId,
        MessageType.IMAGE,
        message,
        10
      );

      let idx = 0;

      const resReverse = res.reverse();

      for (let msg of resReverse) {
        if (
          msg.fromId === message.fromId &&
          msg.toId === message.toId &&
          msg.clientId === message.clientId
        ) {
          idx +=
            (msg.content as IFile[]).length -
            (msg.content as IFile[]).findIndex(
              (item) => item.data === image.data
            );

          break;
        } else {
          idx += (msg.content as IFile[]).length;
        }
      }

      idx -= 1;

      const urls = resReverse
        .map((item) => (item.content as IFile[]).map((f) => f.data).reverse())
        .flat();

      (window as any).electronAPI.viewPhoto(urls, idx);
    },
    []
  );

  const handleSubmitFiles = async (files: IFile[]) => {
    if (!sendingMessage.current) {
      sendingMessage.current = true;
      if (activeConversation && files.length > 0) {
        setScrollTargetTopMessage("");
        setHighlightMessage("");
        setThumb(undefined);

        if (files[0].type.startsWith("image/")) {
          for (let file of files.reverse()) {
            try {
              messageController.sendMessage({
                fromId: auth.auth.user._id,
                toId: activeConversation.user._id,
                type: MessageType.IMAGE,
                content: [file],
                sendTime: new Date().toISOString(),
                conversationId: "",
                clientId: uuidv4(),
                status: MessageStatus.PENDING,
              });
            } catch (e) {
              setNotification({
                type: "error",
                message: "Gửi tin nhắn thất bại",
              });
              dispatch(setShowNotification(true));
            }
          }
        } else {
          for (let file of files.reverse()) {
            try {
              messageController.sendMessage({
                fromId: auth.auth.user._id,
                toId: activeConversation.user._id,
                type: MessageType.FILE,
                content: [file],
                sendTime: new Date().toISOString(),
                conversationId: "",
                clientId: uuidv4(),
                status: MessageStatus.PENDING,
              });
            } catch (e) {
              setNotification({
                type: "error",
                message: "Gửi tin nhắn thất bại",
              });
              dispatch(setShowNotification(true));
            }
          }
        }
      }
      sendingMessage.current = false;
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
          const currentSize = images.reduce(
            (size, file) => size + file.size,
            0
          );

          //5mb
          if (currentSize + file.size <= 5000000) {
            setImages((state) => [
              ...state,
              {
                name: file.name,
                type: file.type,
                size: file.size,
                data: reader.result as string,
                path: file.path,
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

    const currentSize = images.reduce((size, file) => size + file.size, 0);
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
          setImages((state) => [
            ...state,
            {
              name: file.name,
              size: file.size,
              type: file.type,
              data: reader.result as string,
              path: file.path,
            },
          ]);
        }
      };

      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    }
  };

  const handleClickOnConversation = async (conversation: IConversation) => {
    if (conversation.userId !== activeConversation?.user._id) {
      setIsFullMessage(false);
      setIsTyping(false);
      setActiveConversation({
        id: conversation.id,
        user: friend.find((item) => item._id === conversation.userId)!,
      });
      setScrollTargetTopMessage("");
      setHighlightMessage("");
      if (inputRef.current) (inputRef.current as any).reset();

      if (messages.length > 0) {
        dispatch(removeAllMessage());
      }

      const res = await messageController.getMessagesByConversation(
        conversation.id,
        undefined,
        undefined,
        PAGE_SIZE
      );

      messageController.createMessageThumb(res);
    }
  };

  const handleCancleFile = (index: number) => {
    setImages((state) => {
      return state.filter((_, i) => i !== index);
    });
  };

  const handleClickOnSearchUser = async (user: IUser) => {
    setScrollTargetTopMessage("");
    setHighlightMessage("");
    setIsFullMessage(false);
    setIsTyping(false);
    if (inputRef.current) (inputRef.current as any).reset();

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

    if (messages.length > 0) {
      dispatch(removeAllMessage());
    }

    const res = await messageController.getMessagesByConversation(
      conversationId,
      undefined,
      undefined,
      PAGE_SIZE
    );

    messageController.createMessageThumb(res);
  };

  const handleScrollToTop = React.useCallback(async () => {
    if (messages[0] && activeConversation && !isFullMessage) {
      const res = await messageController.loadMoreMessage(
        activeConversation.id,
        messages[0],
        PAGE_SIZE
      );

      if (res.length === 0) {
        setIsFullMessage(true);
      }

      setScrollTargetTopMessage(
        `message-${
          messages[0].fromId + messages[0].toId + messages[0].clientId
        }`
      );

      messageController.createMessageThumb(res);
    }
  }, [messages, activeConversation, isFullMessage, dispatch]);

  const handleConversationContentScroll: React.UIEventHandler =
    React.useCallback(
      (e) => {
        const el = e.target as HTMLDivElement;

        if (
          el.scrollTop + el.offsetHeight < el.scrollHeight - 200 &&
          !showScrollBtnRef.current
        ) {
          showScrollBtnRef.current = true;
          setShowScrollBtn(true);
        }

        if (
          el.scrollTop + el.offsetHeight >= el.scrollHeight - 50 &&
          showScrollBtnRef.current
        ) {
          setShowScrollBtn(false);
          showScrollBtnRef.current = false;
        }
      },
      [render]
    );

  const handleRetry = React.useCallback(async (message: IMessage) => {
    setScrollTargetTopMessage("#");
    setHighlightMessage("");

    const clonedMsg = structuredClone(message);

    if (clonedMsg.type === MessageType.FILE) {
      for (let file of clonedMsg.content as IFile[]) {
        try {
          const res = await (window as any).electronAPI.openFile(
            file.path,
            file.type
          );

          file.data = res;
        } catch (e) {
          console.log(e);
          setNotification({ type: "error", message: "Không tìm thấy file" });
          dispatch(setShowNotification(true));

          //delete message
          messageController.deleteMessage(message);
          return;
        }
      }
    }

    try {
      await messageController.retryMessage(clonedMsg);
      setScrollTargetTopMessage("");
    } catch {
      setNotification({ type: "error", message: "Gửi lại thất bại" });
      dispatch(setShowNotification(true));
    }
  }, []);

  const handleDownloadFile = React.useCallback((url: string) => {
    setScrollTargetTopMessage("#");
    setPercentFileDownloading({
      url: url,
      percent: 0,
    });

    (window as any).electronAPI.download(url);
  }, []);

  const handleClickOnSearchMessage = async (message: IMessage) => {
    dispatch(removeAllMessage());
    setIsFullMessage(false);
    if (inputRef.current) (inputRef.current as any).reset();

    const result: IMessage[] = [];

    const res = await messageController.getMessagesByConversation(
      message.conversationId,
      message,
      undefined,
      undefined,
      undefined
    );

    result.push(...res);

    setScrollTargetTopMessage(
      `message-${message.fromId + message.toId + message.clientId}`
    );

    setHighlightMessage(
      `message-${message.fromId + message.toId + message.clientId}`
    );

    if (res.length <= 15) {
      const resMore = await messageController.getMessagesByConversation(
        message.conversationId,
        undefined,
        message,
        10,
        true
      );

      result.push(...resMore);
    }

    setActiveConversation({
      id: message.conversationId,
      user: friend.find(
        (item) =>
          item._id ===
          (message.toId === auth.auth.user._id ? message.fromId : message.toId)
      )!,
    });

    messageController.createMessageThumb(result);
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
        setNotification(undefined);
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
    socketController.listen("connect", (e: any) => {
      dispatch(setSocketConnect(true));
    });
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

    (window as any).electronAPI?.onDownloadFileDone(() => {
      dispatch(setShowNotification(true));
      setNotification({
        type: "success",
        message: "Tải xuống thành công",
      });
    });

    (window as any).electronAPI?.onDownloadFileError((percent: number) => {
      dispatch(setShowNotification(true));
      setNotification({
        type: "error",
        message: "Tải xuống thất bại",
      });
    });
  }, []);

  React.useEffect(() => {
    const handleSearch = async () => {
      const startTime = new Date().getTime();

      const result = await messageController.searchMessage(search);

      const endTime = new Date().getTime();

      console.log(`Search took ${endTime - startTime} milliseconds`);

      setSearchMessages(result);
      setSearchConversations(
        conversations.filter((item) => {
          const user = friend.find((f) => f._id === item.userId);

          if (!user) return false;

          const keywords = Object.keys(tokenizer(search));
          const words = Object.keys(tokenizer(user.fullName));

          for (let i = 0; i < keywords.length; i++) {
            if (i !== keywords.length - 1) {
              if (!words.find((item) => item === keywords[i])) return false;
            } else {
              if (!words.find((item) => item.startsWith(keywords[i])))
                return false;
            }
          }

          return true;
        })
      );

      const phonePos = await commonController.detectPhone(
        uuidv4(),
        search.replace(/[^\w]/gi, "")
      );

      const phone =
        phonePos.length > 0
          ? search
              .replace(/[^\w]/gi, "")
              .slice(phonePos[0].start, phonePos[0].start + phonePos[0].length)
          : undefined;

      const nums = search.replace(/[^0-9]/g, "");

      if (phone && (nums.length === 10 || nums.length === 11)) {
        const res = await userController.getUsersByPhone(phone);

        setSearchUsers(res);
      } else {
        setSearchUsers([]);
      }
    };

    handleSearch();
  }, [search]);

  //Sync message
  React.useEffect(() => {
    if (common.isDatabaseConnected && common.isSocketConnected) {
      messageController.syncMessage(activeConversation?.user._id || "");
    }
  }, [
    common.isDatabaseConnected,
    common.isSocketConnected,
    auth.auth,
    activeConversation,
  ]);

  //Change conversation socket
  React.useEffect(() => {
    if (common.isSocketConnected) {
      socketController.removeListener(SOCKET_CONSTANTS.CHAT_MESSAGE);
      socketController.removeListener(SOCKET_CONSTANTS.UPDATE_MESSAGE);
      socketController.removeListener(SOCKET_CONSTANTS.TYPING);

      socketController.listen(
        SOCKET_CONSTANTS.CHAT_MESSAGE,
        async (message: IMessage, callback: any) => {
          try {
            message.status = MessageStatus.RECEIVED;

            const msg = await messageController.receiveMessage(
              message,
              !activeConversation ||
                activeConversation.user._id !== message.fromId
            );

            socketController.send(SOCKET_CONSTANTS.ACK_MESSAGE, message);

            if (lastNotiRef.current) lastNotiRef.current.close();

            lastNotiRef.current = new Notification(
              friend.find((item) => item._id === message.fromId)!.fullName,
              {
                body:
                  message.type === MessageType.FILE
                    ? "Đã gửi file"
                    : message.type === MessageType.IMAGE
                    ? "Đã gửi ảnh"
                    : (message.content as string),
              }
            );

            lastNotiRef.current.onclick = async () => {
              setActiveConversation({
                id: conversations.find(
                  (item) => item.userId === message.fromId
                )!.id,
                user: friend.find((item) => item._id === message.fromId)!,
              });
              setScrollTargetTopMessage("");
              setHighlightMessage("");
              setIsFullMessage(false);

              if (inputRef.current) (inputRef.current as any).reset();

              if (messages.length > 0) {
                dispatch(removeAllMessage());
              }

              const res = await messageController.getMessagesByConversation(
                conversations.find((item) => item.userId === message.fromId)!
                  .id,
                undefined,
                undefined,
                PAGE_SIZE
              );

              await messageController.createMessageThumb(res);
            };

            callback({ status: 200 });

            messageController.createMessageThumb([msg]);
          } catch (e) {
            console.log(e);
          }
        }
      );

      socketController.listen(
        SOCKET_CONSTANTS.UPDATE_MESSAGE,
        async (message: IMessage) => {
          messageController.updateMessage(message);
          // processMessages([message]);
        }
      );

      socketController.listen(
        SOCKET_CONSTANTS.TYPING,
        (data: { isTyping: boolean; fromUserId: string }) => {
          if (data.isTyping === true) {
            showTypingRef.current = setTimeout(() => {
              setIsTyping(false);
            }, 3000);
          }

          if (data.isTyping === false) {
            clearTimeout(showTypingRef.current);
          }

          if (activeConversation?.user._id === data.fromUserId)
            setIsTyping(data.isTyping);
        }
      );
    }
  }, [
    activeConversation,
    common.isSocketConnected,
    dispatch,
    friend,
    conversations,
  ]);

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
                keywords={search}
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
                keywords={search}
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
                avatar={activeConversation?.user.avatar || ""}
              />
            </div>

            <div
              className={styles.conversationContent}
              ref={conversationContentRef}
            >
              <ConversationContent
                messages={messages}
                currentUserId={auth.auth.user._id}
                currentUserAvatar={auth.auth.user.avatar || ""}
                chattingUserAvatar={activeConversation?.user.avatar || ""}
                onScrollToTop={handleScrollToTop}
                onRetry={handleRetry}
                onDownloadFile={handleDownloadFile}
                onImageClick={handleImageMessageClick}
                percentFileDownloading={percentFileDownloading}
                scrollToElement={scrollToTargetMessage}
                highlightElement={highlightMessage}
                onScroll={handleConversationContentScroll}
                onPhoneClick={handleClickOnPhone}
                onUrlClick={handleClickOnLink}
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

              {showScrollBtn && (
                <div
                  className={styles.scrollIcon}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setScrollTargetTopMessage("");
                    forceRender({});
                  }}
                >
                  <AiOutlineArrowDown fontSize={"1.8rem"} />
                </div>
              )}
            </div>

            <div className={styles.conversationAction}>
              <ConversationAction onFileChange={handleSubmitFiles} />
            </div>

            <div
              className={styles.conversationInput}
              ref={conversationInputRef}
            >
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
                onSubmit={handleSubmitMessage}
                onChange={handleChangeMessage}
                onPaste={handlePaste}
                onDrop={handleDrop}
                ref={inputRef}
                onThumbDone={(thumb) => setThumb(thumb)}
              />

              {images.length > 0 && (
                <div className={styles.images}>
                  <div className={styles.title}>
                    <span>{images.length}</span> ảnh được chọn
                  </div>
                  <div className={styles.imagesContainer}>
                    {images.map((file, index) => (
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
        <NotificationComponent
          type={notification ? notification.type : "error"}
          message={notification ? notification.message : "Tải ảnh lên thất bại"}
        />
      )}

      <Modal
        show={!!userModal || isLoadingUserModal}
        className={styles.userModal}
        height="auto"
        onClose={() => setUserModal(undefined)}
      >
        {isLoadingUserModal ? (
          <div className={styles.loading}>
            <LoadingIcon />
          </div>
        ) : (
          <div className={styles.userInfo}>
            {userModal && (
              <div className={styles.card}>
                <UserCard user={userModal} />
              </div>
            )}

            {userModal && userModal._id !== auth.auth.user._id && (
              <div className={styles.action}>
                <Button
                  onClick={() => {
                    handleClickOnSearchUser(userModal);
                    setUserModal(undefined);
                  }}
                >
                  Nhắn tin
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
