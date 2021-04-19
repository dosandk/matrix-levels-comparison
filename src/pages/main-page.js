import Markdownit from 'markdown-it';
import matrix from '../../matrix-src/readme.md';
import ModalDialog from '../components/modal/index.js';
import { getParsedMarkdown } from '../utils/get-parsed-markdown.js';
import { compareLevels } from '../utils/compare-levels.js';

const md = new Markdownit();

export default class Page {
  subElements = {};
  selectedSubLevels = ['junior-l1', 'junior-l3'];
  cellIndexes = [1, 4];

  static levelIdToName (levelName) {
    return levelName.split('-').map(item => {
      return item[0].toUpperCase() + item.slice(1);
    }).join(' ');
  }

  static leveNamedToId (levelName) {
    return levelName.toLocaleLowerCase().split(' ').join('-');
  }

  // NOTE: disable navigation for all links
  onLinkClick = event => {
    const a = event.target.closest('a');

    if (a) event.preventDefault();
  }

  onTableClick = event => {
    const th = event.target.closest('th');
    const td = event.target.closest('td');
    const cell = th || td;

    if (!cell) return;

    const { cellIndex } = cell;
    const headerCell = this.element.querySelector(`table tr th:nth-child(${cellIndex + 1})`);
    const levelName = Page.leveNamedToId(headerCell.innerText);

    if (this.selectedSubLevels.includes(levelName)) {
      return;
    }

    // TODO: rethink data-structure. Maybe [['junior-l1', 1], ['middle-l2', 3]]
    this.selectedSubLevels.unshift(levelName);
    this.cellIndexes.unshift(cellIndex);

    this.subElements.tables.forEach(table => {
      if (this.selectedSubLevels.length > 2) {
        table.classList.remove(this.selectedSubLevels[this.selectedSubLevels.length - 1]);
      }

      table.classList.add(levelName);
    });

    if (this.selectedSubLevels.length > 2) {
      this.selectedSubLevels.pop();
      this.cellIndexes.pop();
    }
  }

  onKeyUp = event => {
    if (event.code === 'Escape') {
      document.dispatchEvent(new CustomEvent('close-modal', {
        bubbles: true
      }));

      return;
    }

    if (event.ctrlKey && event.code === 'KeyD') {
      const levelsTables = [...this.subElements.tables].slice(0, -1).map(item => item.cloneNode(true));

      const levels = compareLevels(levelsTables, this.cellIndexes, this.selectedSubLevels);

      const wrapper = document.createElement('div');
      const [levelId1, levelId2] = this.selectedSubLevels;

      wrapper.innerHTML = `
        <header style="display: flex; justify-content: space-between">
          <span>
            <strong>"${Page.levelIdToName(levelId1)}"</strong> 
            compare to 
            <strong>"${Page.levelIdToName(levelId2)}"</strong>
          </span>

          <span data-element="close" style="cursor: pointer">X</span>
        </header>
        <hr> 
      `;

      levels.forEach((level, index) => {
        if (level > 0) {
          const element = document.createElement('div');

          element.innerHTML = md.renderer.render(getParsedMarkdown(level)[index]);

          wrapper.append(element);
        }
      });

      const totalSore = levels.reduce((sum, item) => sum + item, 0);

      if (totalSore === 0) {
        const element = document.createElement('div');

        element.innerHTML = `
          <h1>There is no difference between levels</h1>;   
        `;

        wrapper.append(element.firstElementChild);
      }

      const modal = new ModalDialog(wrapper);

      modal.show();
    }
  }

  constructor () {
    this.render();
    this.initEventListens();
  }

  render () {
    this.element = document.createElement('div');
    this.element.innerHTML = md.render(matrix);
    this.subElements.tables = this.element.querySelectorAll('table');

    this.highlightLevels();
    this.addCompareButton();
  }

  highlightLevels () {
    this.subElements.tables.forEach((table, index) => {
      const [level1, level2] = this.selectedSubLevels;

      table.classList.add(level1);
      table.classList.add(level2);
    });
  }

  addCompareButton () {
    const table = this.element.querySelector('table');
    const h4 = document.createElement('h4');

    h4.innerHTML = `<button style="cursor: pointer">Compare!</button>`

    table.before(h4);

    h4.firstElementChild.onclick = () => h4.firstElementChild.dispatchEvent(new KeyboardEvent('keyup',{
      bubbles: true,
      ctrlKey: true,
      code: 'KeyD'
    }));
  }

  initEventListens () {
    document.addEventListener('click', this.onLinkClick);
    document.addEventListener('pointerdown', this.onTableClick);
    document.addEventListener('keyup', this.onKeyUp, false);
  }

  destroy () {
    document.removeEventListener('click', this.onLinkClick);
    document.removeEventListener('pointerdown', this.onTableClick);
    document.removeEventListener('keyup', this.onKeyUp, false);
  }
}
