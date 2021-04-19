const diff = (arr1, arr2) => {
  return arr2.map((item, index) => {
    if (item - arr1[index] > 0) {
      return parseInt(item);
    }

    return 0;
  });
};

export const compareLevels = (levelsTables, cellIndexes, selectedSubLevels) => {
  const subLevels = cellIndexes.reduce((accum, item, index) => {
    accum[item] = selectedSubLevels[index];
    return accum;
  }, {});

  const columns = [];
  const fragment = document.createDocumentFragment();

  fragment.append(...levelsTables);

  Object.keys(subLevels).forEach(item => {
    const cellIndex = parseInt(item, 10);
    const selector = subLevels[cellIndex];
    const column = fragment.querySelectorAll(`table.${selector} tr td:nth-child(${cellIndex + 1})`);

    columns.push(column);
  });

  const [list1, list2] = columns;

  const arr1 = [...list1].slice(0, -1).map(item => item.innerText);
  const arr2 = [...list2].slice(0, -1).map(item => item.innerText);

  return diff(arr1, arr2);
};
