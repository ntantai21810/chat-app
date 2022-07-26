import classNames from "classnames";
import { useEffect, useRef } from "react";
import { commonController } from "../../../bootstrap";
import { IMessage, MessageStatus } from "../../../domains/Message";
import { normalizeHTMLTag } from "../../../helper";
import styles from "../../assets/styles/Message.module.scss";
import PreviewLink from "../common/PreviewLink";
import { v4 as uuidv4 } from "uuid";

export interface IMessageProps {
  bgColor?: string;
  message: IMessage;
  showStatus: boolean;
  highlight?: boolean;
  onRetry?: (message: IMessage) => any;
  onPhoneClick?: (phone: string) => any;
  onUrlClick?: (url: string) => any;
}

const processMessage = async (text: string) => {
  const phonePostion = await commonController.detectPhone(uuidv4(), text);
  const urlPosition = await commonController.detectUrl(uuidv4(), text);
  const emailPosition = await commonController.detectEmail(uuidv4(), text);

  let content = "";

  for (let i = 0; i < text.length; i++) {
    const phonePos = phonePostion.find((item) => item.start === i);

    if (phonePos) {
      const phone = text.slice(
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
      const url = text.slice(urlPos.start, urlPos.start + urlPos.length);

      content += `<span class="highlight url" data-url="${url}">${normalizeHTMLTag(
        url
      )}</span>`;

      i += urlPos.length - 1;

      continue;
    }

    const emailPos = emailPosition.find((item) => item.start === i);

    if (emailPos) {
      const email = text.slice(
        emailPos.start,
        emailPos.start + emailPos.length
      );

      content += `<span class="highlight email" data-email="${email}">${normalizeHTMLTag(
        email
      )}</span>`;

      i += emailPos.length - 1;

      continue;
    }

    content += normalizeHTMLTag(text[i]);
  }

  return content;
};

export default function Message(props: IMessageProps) {
  const {
    bgColor = "#fff",
    message,
    showStatus,
    onRetry,
    highlight,
    onPhoneClick,
    onUrlClick,
  } = props;

  const ref = useRef<HTMLDivElement | null>(null);

  const handleClickUrl = (url: string) => {
    (window as any).electronAPI.openLink(url);
  };

  useEffect(() => {
    let phoneMessages: NodeListOf<Element>;
    let urlMessages: NodeListOf<Element>;

    const handleValueChange = async () => {
      if (!ref.current) return () => {};

      ref.current.innerHTML = (
        await processMessage(message.content as string)
      ).replace(/\u00a0/g, " ");

      phoneMessages = ref.current.querySelectorAll(".phone");

      urlMessages = ref.current.querySelectorAll(".url");

      phoneMessages.forEach((message) =>
        message.addEventListener("click", async () => {
          const phone = (message as any).dataset?.phone;

          if (onPhoneClick) onPhoneClick(phone);
        })
      );

      urlMessages.forEach((message) =>
        message.addEventListener("click", async () => {
          const url = (message as any).dataset?.url;

          if (onUrlClick) onUrlClick(url);
        })
      );
    };

    handleValueChange();

    return () => {
      if (ref.current && phoneMessages) {
        phoneMessages.forEach((message) =>
          message.replaceWith(message.cloneNode(true))
        );
      }

      if (ref.current && urlMessages) {
        urlMessages.forEach((message) =>
          message.replaceWith(message.cloneNode(true))
        );
      }
    };
  }, [message]);

  return (
    <div
      className={classNames({
        [styles.container]: true,
      })}
      style={{ backgroundColor: highlight ? "rgb(255 199 0)" : bgColor }}
    >
      <div ref={ref} className={styles.textContainer}>
        {message.content as string}
      </div>

      {message.thumb && (
        <div className={styles.previewLink}>
          <PreviewLink
            title={message.thumb.title}
            description={message.thumb.description}
            image={message.thumb.image}
            url={message.thumb.url}
            onClick={handleClickUrl}
          />
        </div>
      )}

      {showStatus && (
        <div
          className={classNames({
            [styles.status]: true,
            [styles.error]: message.status === MessageStatus.ERROR,
          })}
          onClick={() =>
            message.status === MessageStatus.ERROR && onRetry
              ? onRetry(message)
              : ""
          }
        >
          {message.status === MessageStatus.PENDING && "Đang gửi"}
          {message.status === MessageStatus.SENT && "Đã gửi"}
          {message.status === MessageStatus.RECEIVED && "Đã nhận"}
          {message.status === MessageStatus.ERROR && "Thử lại"}
        </div>
      )}
    </div>
  );
}
