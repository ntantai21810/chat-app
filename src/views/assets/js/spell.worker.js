/* eslint-disable */
function normalize(text) {
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
    if (/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(word)) {
      str += `<span class="phone spell-check">${normalize(word)}</span>&nbsp;`;
    } else if (word !== "" && !lang.check(word)) {
      str += `<span title="Did you mean ${lang
        .suggest(word, 1)
        .join(", ")}" class="misspelled spell-check" data-spell="${lang.suggest(
        word,
        1
      )}">${normalize(word)}</span>&nbsp;`;
    } else {
      str += `<span>${normalize(word)}</span>&nbsp;`;
    }
  }

  return str.slice(0, -6);
}
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
    }
  });
}
