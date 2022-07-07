export function tokenizer(text: string): { [key: string]: number } {
  const tokens: { [key: string]: number } = {};

  const transform = text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .split(/\s/)
    .filter((item) => item !== "");

  transform.forEach((item) => {
    if (tokens[item]) {
      tokens[item]++;
    } else {
      tokens[item] = 1;
    }
  });

  return tokens;
}
