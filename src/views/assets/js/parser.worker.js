import { MessageType } from "../../../domains";

/* eslint-disable */
if ("function" === typeof self.importScripts) {
  self.importScripts(new URL("../js/BJSpell.js", import.meta.url));
  self.importScripts(new URL("../js/en_US.js", import.meta.url));

  const dictionary = "en_US";

  const lang = self.BJSpell(dictionary);

  self.addEventListener("message", (event) => {
    switch (event.data.type) {
      case "check":
        postMessage({
          type: "spellcheck-result",
          text: spellCheck(lang, event.data.text),
        });
        break;

      case "phone-detect":
        postMessage({
          type: "phone-detect-result",
          messages: transformMessages(event.data.messages),
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

function spellCheck(lang, text) {
  let str = "";

  const words = text.split(/\s/);

  for (let word of words) {
    if (/(84|0[3|5|7|8|9])+([0-9]{8})/.test(word) || urlDetect(word)) {
      str += `${processMessage(
        normalizeHTMLTag(word),
        "phone spell-check"
      )}&nbsp;`;
    } else if (word !== "" && !lang.check(word)) {
      str += `<span title="Did you mean ${lang
        .suggest(word, 1)
        .join(", ")}" class="misspelled spell-check" data-spell="${lang.suggest(
        word,
        1
      )}">${normalizeHTMLTag(word)}</span>&nbsp;`;
    } else {
      str += `<span>${normalizeHTMLTag(word)}</span>&nbsp;`;
    }
  }

  return str.slice(0, -6);
}

function processMessage(text, className) {
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

      continue;
    }

    const url = urlDetect(text.slice(i));

    if (url && url[0] === text.slice(i, i + url[0].length)) {
      result += `<span class="url" data-url="${url[0]}">${url[0]}</span>`;

      i += url[0].length - 1;

      continue;
    }

    result += normalizeHTMLTag(text[i]);
  }

  return result;
}

function urlDetect(text) {
  const regex = /\bhttps?:\/\/\S+/i;

  return text.match(regex);
}

function transformMessages(messages) {
  return messages.map((message) =>
    message.type === MessageType.TEXT
      ? {
          ...message,
          content: processMessage(message.content, "phone-number-message"),
        }
      : message
  );
}