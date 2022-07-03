export function tokenizer(text: string): string[] {
  const tokens: string[] = [];

  const transform = text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .split(/[^a-zA-Z0-9]/)
    .map((item) => {
      const _ngram = [];

      if (item.length >= 2) {
        for (let index = 0; index <= item.length - 2 + 1; index++) {
          _ngram.push(item[index]);
          _ngram.push(item.slice(index, index + 2));
        }
      } else {
        if (item.length > 0) {
          _ngram.push(item[0]);
        }

        _ngram.push(item);
      }

      return _ngram;
    });

  transform.forEach((item) => tokens.push(...item));

  const filter = tokens.filter((c, index) => {
    return tokens.indexOf(c) === index;
  });

  return filter;
}
