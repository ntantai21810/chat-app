/* eslint-disable */
function spellCheck(lang, text) {
  const words = text.split(/\s/);

  //Check space lien tiep
  console.log(words);

  const result = words
    .map((word) => {
      if (word === "") {
        return `<span>${word}</span>`;
      } else {
        const correct = lang.check(word);

        if (correct) {
          return `<span>${word}</span>`;
        } else {
          return `<span title="Did you mean ${lang
            .suggest(word, 5)
            .join(", ")}?" class="misspelled">${word}</span>`;
        }
      }
    })
    .join("");

  return result;
}
if ("function" === typeof self.importScripts) {
  self.importScripts(new URL("../js/BJSpell.js", import.meta.url));
  self.importScripts(new URL("../js/en_US.js", import.meta.url));

  const dictionary = "en_US";

  const lang = self.BJSpell(dictionary);

  self.addEventListener("message", (event) => {
    switch (event.data.type) {
      case "check":
        console.log("Worker: ", event.data.text);

        postMessage({
          type: "spellcheck-result",
          text: spellCheck(lang, event.data.text),
        });
        break;
    }
  });
}
