import Markdownit from 'markdown-it';
import matrix from '../matrix-src/readme.md';
import matrixContent from './matrix-content.js'

const md = new Markdownit();
const content = matrixContent.map(item => md.parse(item, {}));

const preparedContent = level => {
  const indexes = content.map(tokens => {
    const indexes = [];

    tokens.forEach((token, index) => {
      if (token.tag === 'h2' && token.type === "heading_open") {
        indexes.push(index);
      }
    });

    return indexes;
  });

  const levelIndexes = indexes.map(item => {
    return [item[level - 1], item[level]]
  });

  const result = content.map((tokens, index) => {
    const [start, end] = levelIndexes[index];

    // TODO: can be two mode: "only diff" or "all levels"
    return [...tokens.slice(0, 3), ...tokens.slice(start, end)];
  });

  return result;
};

const root = document.getElementById('root');

const renderIndex = () => {
  const result = md.render(matrix);

  root.innerHTML = result;
}

renderIndex();

const tables = document.querySelectorAll('table');

const selectedSubLevels = [];
const cellIndexes = [];

document.addEventListener('pointerdown', event => {
  const th = event.target.closest('th');

  if (th) {
    const { cellIndex } = th;
    const sublevel = th.innerText.toLocaleLowerCase().split(' ').join('-');

    if (selectedSubLevels.includes(sublevel)) {
      return;
    }

    // TODO: rethink data-structure
    selectedSubLevels.unshift(sublevel);
    cellIndexes.unshift(cellIndex);

    [...tables].slice(0, -1).forEach(table => {
      if (selectedSubLevels.length > 2) {
        table.classList.remove(selectedSubLevels[selectedSubLevels.length - 1]);
      }

      table.classList.add(sublevel);
    });

    if (selectedSubLevels.length > 2) {
      selectedSubLevels.pop();
      cellIndexes.pop();
    }
  }
});

const compare = () => {
  const subLevels = cellIndexes.reduce((accum, item, index) => {
    accum[item] = selectedSubLevels[index];
    return accum;
  }, {});

  const columns = [];

  Object.keys(subLevels).forEach(item => {
    const cellIndex = parseInt(item, 10);
    const selector = subLevels[cellIndex];
    const elements = document.querySelectorAll(`table.${selector} tr td:nth-child(${cellIndex + 1})`);

    // TODO: only first two tables
    columns.push(elements);
  });

  console.error('columns', columns);

  const [list1, list2] = columns;

  const arr1 = [...list1].map(item => item.innerText);
  const arr2 = [...list2].map(item => item.innerText);

  const result = diff(arr1, arr2);

  return result;
};

const diff = (arr1, arr2) => arr2.map((item, index) => {
  if (item - arr1[index] > 0) {
    return parseInt(item);
  }

  return 0;
});

document.addEventListener('keyup', event => {
  if (event.ctrlKey && event.code === 'KeyD') {
    const levels = compare();

    console.error('levels', levels);

    levels.forEach((level, index) => {
      if (level > 0) {
        const element = document.createElement('div');

        element.innerHTML = md.renderer.render(preparedContent(level)[index]);

        root.append(element);
      }
    });

    console.error('result', levels);
  }
}, false);
