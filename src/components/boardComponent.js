class board  extends HTMLElement {
    constructor() {
      // Always call super first in constructor
      super();
      
      let shadowRoot = this.attachShadow({mode: 'open'});
      shadowRoot.innerHTML = `
        Board  
      `;
    }
  }


customElements.define('board-game',board)
