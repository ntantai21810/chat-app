function spellCheck(lang, text) {
  const words = text.split(/\s/);
  const result = words
    .map((word) => {
      const correct = lang.check(word);
      const title = correct
        ? "Correct spelling"
        : `Did you mean ${lang.suggest(word, 5).join(", ")}?`;
      return `<span title="${title}" class="${
        correct ? "correct" : "misspelled"
      }">${word}</span>`;
    })
    .join(" ");

  return result;
}

if ("function" === typeof importScripts) {
  console.log("Run worker");

  importScripts(new URL("../js/BJSpell.js", import.meta.url));
  importScripts(new URL("../js/en_US.js", import.meta.url));

  const dictionary =
    "https://rawcdn.githack.com/maheshmurag/bjspell/master/dictionary.js/en_US.js";

  const lang = new BJSpell(dictionary);

  addEventListener("message", (event) => {
    switch (event.data.type) {
      case "check":
        postMessage({
          type: "check-result",
          text: spellCheck(lang, event.data.data),
        });
        break;
    }
  });
}
