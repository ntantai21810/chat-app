import { MessageType } from "../../../domains";

/* eslint-disable */
if ("function" === typeof self.importScripts) {
  self.addEventListener("message", (event) => {
    switch (event.data.type) {
      case "phone-detect-messages":
        postMessage({
          type: "phone-detect-messages-result",
          messages: detectPhoneMessages(event.data.messages),
        });
        break;
      case "phone-detect":
        postMessage({
          type: "phone-detect-result",
          text: processPhoneNumber(event.data.text),
        });
        break;

      case "url-detect-messages":
        postMessage({
          type: "url-detect-messages-result",
          messages: detectUrlMessages(event.data.messages),
        });
        break;
      case "url-detect":
        postMessage({
          type: "url-detect-result",
          text: processUrl(event.data.text),
        });
        break;
    }
  });
}

function normalizeHTMLTag(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/>/g, "&gt;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

function processPhoneNumber(text, className) {
  let result = "";

  for (let i = 0; i < text.length; i++) {
    if (
      ["0", "3", "5", "7", "8", "9"].includes(text[i]) &&
      /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(text.slice(i, i + 10))
    ) {
      result += `<span class="${className}" data-phone="${text.slice(
        i,
        i + 10
      )}">${text.slice(i, i + 10)}</span>`;

      i += 9;
    } else result += normalizeHTMLTag(text[i]);
  }

  return result;
}

function processUrl(text, className) {
  let result = "";

  for (let i = 0; i < text.length; i++) {
    const regex = /\bhttps?:\/\/\S+/i;

    const url = text.slice(i).match(regex);

    if (url && url[0] === text.slice(i, i + url[0].length)) {
      result += `<span class="${className}" data-url="${url[0]}">${url[0]}</span>`;

      i += url[0].length - 1;

      continue;
    }

    result += normalizeHTMLTag(text[i]);
  }

  return result;
}

function detectPhoneMessages(messages) {
  return messages.map((message) =>
    message.type === MessageType.TEXT
      ? {
          ...message,
          content: processPhoneNumber(message.content, "highlight phone"),
        }
      : message
  );
}

function detectUrlMessages(messages) {
  return messages.map((message) =>
    message.type === MessageType.TEXT
      ? {
          ...message,
          content: processUrl(message.content, "highlight url"),
        }
      : message
  );
}
