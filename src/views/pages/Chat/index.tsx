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
import {
  removeAllMessage,
  updateManyMessage,
} from "../../../framework/redux/message";
import { SOCKET_CONSTANTS, tokenizer } from "../../../helper";
import { API } from "../../../network";
import styles from "../../assets/styles/ChatPage.module.scss";
import ChattedUserList from "../../components/ChattedUserList";
import AutoResizeInput from "../../components/common/AutoResizeInput";
import Banner from "../../components/common/Banner";
import Button from "../../components/common/Button";
import Image from "../../components/common/Image";
import Input from "../../components/common/Input";
import LoadingIcon from "../../components/common/LoadingIcon";
import Modal from "../../components/common/Modal";
import Notification from "../../components/common/Notification";
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

function normalizeHTMLTag(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/>/g, "&gt;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

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

  const processMessages = async (messages: IMessage[]) => {
    const textMsg = messages.filter((item) => item.type === MessageType.TEXT);
    const updateInfo: {
      fromId: string;
      toId: string;
      clientId: string;
      content: string;
    }[] = [];

    for (let msg of textMsg) {
      const phonePostion = await commonController.detectPhone(
        msg.content as string
      );
      const urlPosition = await commonController.detectUrl(
        msg.content as string
      );
      const emailPosition = await commonController.detectEmail(
        msg.content as string
      );

      let content = "";

      for (let i = 0; i < (msg.content as string).length; i++) {
        const phonePos = phonePostion.find((item) => item.start === i);

        if (phonePos) {
          const phone = (msg.content as string).slice(
            phonePos.start,
            phonePos.start + phonePos.length
          );
          content += `<span class="highlight phone" data-phone="${phone}">${normalizeHTMLTag(
            phone
          )}</span>`;

          i += phonePos.length - 1;

          continue;
        }

        const urlPos = urlPosition.find((item) => item.start === i);

        if (urlPos) {
          const url = (msg.content as string).slice(
            urlPos.start,
            urlPos.start + urlPos.length
          );

          content += `<span class="highlight url" data-url="${url}">${normalizeHTMLTag(
            url
          )}</span>`;

          i += urlPos.length - 1;

          continue;
        }

        const emailPos = emailPosition.find((item) => item.start === i);

        if (emailPos) {
          const email = (msg.content as string).slice(
            emailPos.start,
            emailPos.start + emailPos.length
          );

          content += `<span class="highlight email" data-email="${email}">${normalizeHTMLTag(
            email
          )}</span>`;

          i += emailPos.length - 1;

          continue;
        }

        content += (msg.content as string)[i];
      }

      updateInfo.push({
        fromId: msg.fromId,
        toId: msg.toId,
        clientId: msg.clientId,
        content,
      });
    }

    dispatch(updateManyMessage(updateInfo as any));
  };

  const handleSubmitMessage = async (message: string) => {
    if (activeConversation) {
      if (message || files.length > 0) {
        setScrollTargetTopMessage("");
        setHighlightMessage("");
      }

      if (
        message &&
        message.trim() !== "" &&
        message.trim().charCodeAt(0) !== 10
      ) {
        let thumb: IMessageThumb | undefined = undefined;

        const regex = /\bhttps?:\/\/\S+/i;

        const url = message.replace(/\u00a0/g, " ").match(regex);

        if (url) {
          try {
            const metadata = await API.getIntance().get("/preview-link", {
              url: url[0],
            });

            thumb = metadata;
          } catch (e) {
            console.log(e);
          }
        }

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

        await messageController.sendMessage(newMessage);

        processMessages([newMessage]);
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

      if (messages.length > 0) {
        dispatch(removeAllMessage());
      }

      const res = await messageController.getMessagesByConversation(
        conversation.id,
        undefined,
        undefined,
        PAGE_SIZE
      );

      processMessages(res);
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
    setIsFullMessage(false);
    setIsTyping(false);

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

    processMessages(res);
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

      processMessages(res);
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

  const handleRetry = React.useCallback((message: IMessage) => {
    setScrollTargetTopMessage("");
    setHighlightMessage("");
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

    processMessages(result);
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
        async (message: IMessage) => {
          message.status = MessageStatus.RECEIVED;

          await messageController.receiveMessage(
            message,
            !activeConversation ||
              activeConversation.user._id !== message.fromId
          );

          socketController.send(SOCKET_CONSTANTS.ACK_MESSAGE, message);

          processMessages([message]);
        }
      );

      socketController.listen(
        SOCKET_CONSTANTS.UPDATE_MESSAGE,
        async (message: IMessage) => {
          messageController.updateMessage(message);
          processMessages([message]);
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
  }, [activeConversation, common.isSocketConnected, dispatch]);

  // Add listener event for phone detect
  React.useEffect(() => {
    let phoneMessages: NodeListOf<Element>;
    let urlMessages: NodeListOf<Element>;

    if (conversationContentRef.current) {
      phoneMessages = conversationContentRef.current.querySelectorAll(".phone");

      urlMessages = conversationContentRef.current.querySelectorAll(".url");

      phoneMessages.forEach((message) =>
        message.addEventListener("click", async () => {
          setIsLoadingUserModal(true);
          const phone = (message as any).dataset?.phone;

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
        })
      );

      urlMessages.forEach((message) =>
        message.addEventListener("click", async () => {
          const url = (message as any).dataset?.url;

          (window as any).electronAPI.openLink(url);
        })
      );
    }

    return () => {
      if (conversationContentRef.current && phoneMessages) {
        phoneMessages.forEach((message) =>
          message.replaceWith(message.cloneNode(true))
        );
      }

      if (conversationContentRef.current && urlMessages) {
        urlMessages.forEach((message) =>
          message.replaceWith(message.cloneNode(true))
        );
      }
    };
  }, [messages]);

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
                onImageClick={handleImageClick}
                percentFileDownloading={percentFileDownloading}
                scrollToElement={scrollToTargetMessage}
                highlightElement={highlightMessage}
                onScroll={handleConversationContentScroll}
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
                  onClick={() => {
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
        <Notification
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
