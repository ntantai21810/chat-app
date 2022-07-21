import * as React from "react";

export interface IHighlightKeywordProps {
  text: string;
  keyword: string;
}

const normalize = (text: string) => {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
};

function normalizeHTMLTag(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/>/g, "&gt;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

const NUMBER_OF_WORDS = 6;

export default function HighlightKeyword(props: IHighlightKeywordProps) {
  const { text, keyword } = props;

  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const words = text
      .trim()
      .split(/\s/)
      .filter((item) => item !== "");

    const keywords = keyword
      .trim()
      .split(/\s/)
      .filter((item) => item !== "");

    const detected: { [key: number]: boolean } = {};

    const shows: { word: string; index: number }[] = [];

    for (let i = 0; i < keywords.length; i++) {
      if (i === keywords.length - 1) {
        const index = words.findIndex(
          (item, idx) =>
            normalize(item).startsWith(normalize(keywords[i])) && !detected[idx]
        );

        if (index !== -1) {
          shows.push({
            word: words[index].replace(
              words[index].slice(0, keywords[i].length),
              `<mark className="highlight">${normalizeHTMLTag(
                words[index].slice(0, keywords[i].length)
              )}</mark>`
            ),
            index: index,
          });

          detected[index] = true;

          if (shows.length >= NUMBER_OF_WORDS) break;
        }
      } else {
        const index = words.findIndex(
          (item, idx) =>
            normalize(item) === normalize(keywords[i]) && !detected[idx]
        );

        if (index !== -1) {
          shows.push({
            word: `<mark className="highlight">${normalizeHTMLTag(
              words[index]
            )}</mark>`,
            index: index,
          });

          detected[index] = true;

          if (shows.length >= NUMBER_OF_WORDS) break;
        }
      }
    }

    if (shows.length < NUMBER_OF_WORDS) {
      for (let i = 0; i < words.length; i++) {
        if (!detected[i]) shows.push({ word: words[i], index: i });

        if (shows.length >= NUMBER_OF_WORDS) break;
      }
    }

    let lastIdx = 0;

    const result = shows
      .sort((a, b) => a.index - b.index)
      .map((item, idx) => {
        if (idx === 0 && item.index !== 0) {
          item.word = "..." + item.word;
        }

        if (lastIdx !== 0 && lastIdx !== item.index - 1) {
          item.word = "..." + item.word;
        }

        lastIdx = item.index;

        return item.word;
      });

    if (ref.current) {
      ref.current.innerHTML = result.join(" ");
    }
  }, [text, keyword]);

  return <div ref={ref}></div>;
}
