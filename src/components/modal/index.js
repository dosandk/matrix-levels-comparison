export default class ModalDialog {
  constructor (domElement = {}) {
    this.subElements = {};
    this.isOpened = false;
    this.component = domElement;

    this.render();
    this.renderComponents();
    this.getSubElements();
    this.addEventListeners();
  }

  get template () {
    return `<div class="modal">
      <div class="modal_content" data-element="modalContainer"></div>
    </div>      
    `;
  }

  render () {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
  }

  getSubElements () {
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      this.subElements[subElement.dataset.element] = subElement;
    }
  }

  renderComponents () {
    const modalContainer = this.element.querySelector('[data-element="modalContainer"]');

    modalContainer.append(this.component);
  }

  addEventListeners () {
    document.addEventListener('pointerdown', event => {
      const isModal = event.target.closest('.modal_content');

      if (this.isOpened && !isModal) {
        this.remove();
      }
    });

    document.addEventListener('modal-close', event => {
      if (this.isOpened) {
        this.remove();
      }
    });

    this.subElements.close.addEventListener('click', event => {
      if (this.isOpened) {
        this.remove();
      }
    })
  }

  show () {
    document.body.append(this.element);
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';

    this.toggleModalState();
  }

  remove () {
    this.toggleModalState();

    document.body.style.cssText = '';

    this.element.remove();
  }

  toggleModalState () {
    this.isOpened = !this.isOpened;
  }
}
