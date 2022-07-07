/* eslint-disable */
function spellCheck(lang, text) {
  let str = "";

  const words = text.split(/\s/);

  for (let word of words) {
    if (word !== "" && !lang.check(word)) {
      str += `<span title="Did you mean ${lang
        .suggest(word, 1)
        .join(", ")}" class="misspelled">${word}</span>&nbsp;`;
    } else {
      str += `<span>${word}</span>&nbsp;`;
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
