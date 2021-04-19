import Markdownit from 'markdown-it';
import matrixMarkdown from '../matrix-markdown.js';

const md = new Markdownit();
const parsedMarkdown = matrixMarkdown.map(item => md.parse(item, {}));

const getIndexes = content => content.map(tokens => {
  const result = [];

  tokens.forEach((token, index) => {
    if (token.tag === 'h2' && token.type === 'heading_open') {
      result.push(index);
    }
  });

  return result;
});

const indexes = getIndexes(parsedMarkdown);

export const getParsedMarkdown = level => {
  const levelIndexes = indexes.map(item => [item[level - 1], item[level]]);

  const result = parsedMarkdown.map((tokens, index) => {
    const [start, end] = levelIndexes[index];
    const h1Content = tokens.slice(0, 3);
    const levelContent = tokens.slice(start, end);

    // TODO: can be two mode: "only diff" or "all levels"
    return [...h1Content, ...levelContent];
  });

  return result;
};
