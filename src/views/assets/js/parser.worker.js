/* eslint-disable */
if ("function" === typeof self.importScripts) {
  self.addEventListener("message", (event) => {
    switch (event.data.type) {
      case "phone-detect":
        postMessage({
          type: "phone-detect-result",
          result: {
            text: processPhoneNumber(event.data.text.text),
            id: event.data.text.id,
          },
        });
        break;

      case "url-detect":
        postMessage({
          type: "url-detect-result",
          result: {
            text: processUrl(event.data.text.text),
            id: event.data.text.id,
          },
        });
        break;

      case "email-detect":
        postMessage({
          type: "email-detect-result",
          result: {
            text: processEmail(event.data.text.text),
            id: event.data.text.id,
          },
        });
        break;
    }
  });
}

function processPhoneNumber(text) {
  const position = [];

  for (let i = 0; i < text.length; i++) {
    if (
      ["0", "3", "5", "7", "8", "9"].includes(text[i]) &&
      /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(text.slice(i, i + 10))
    ) {
      position.push({
        start: i,
        length: 10,
      });

      i += 9;
    }
  }

  return position;
}

function processUrl(text) {
  const position = [];

  for (let i = 0; i < text.length; i++) {
    const regex = /\bhttps?:\/\/\S+/i;

    const url = text.slice(i).match(regex);

    if (url && url[0] === text.slice(i, i + url[0].length)) {
      position.push({ start: i, length: url[0].length });

      i += url[0].length - 1;
    }
  }

  return position;
}

function processEmail(text) {
  const position = [];

  for (let i = 0; i < text.length; i++) {
    const regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

    const email = text.slice(i).match(regex);

    if (email && email[0] === text.slice(i, i + email[0].length)) {
      position.push({ start: i, length: email[0].length });

      i += email[0].length - 1;
    }
  }

  return position;
}
