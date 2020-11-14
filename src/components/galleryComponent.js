class gallery  extends HTMLElement {
    shadowRoot 
    constructor() {
      // Always call super first in constructor
      super();
      const shadowRoot = this.attachShadow({mode: 'open'});
      this.shadowRoot = shadowRoot;
      let background = this.getAttribute('background') ? this.getAttribute('background') : lightedSquareColor
      let selectedBackground = this.getAttribute('selectedBackground') ? this.getAttribute('selectedBackground') : blackSquareColor
      let itemBackground = this.getAttribute('itemBackground') ? this.getAttribute('itemBackground') : whiteSquareColor
      let hoveredHeaderBackground = this.getAttribute('hoveredHeaderBackground') ? this.getAttribute('hoveredHeaderBackground') : dangerSquareColor
      let elements = [];


      this.onClick =  function(e, item){
        const selected = shadowRoot.querySelector('.selected');
        if(selected){
            selected.classList.remove('selected');
        }
        e.path[0].classList.add('selected')
        // console.log(item)
        elements.forEach((el, index) => {
            elements[index].style = "display:none;"
        })
        elements.forEach((el, index) => {
                if(index == item){
                    elements[item].style = ""
                }
        })
      }
      
      shadowRoot.addEventListener('slotchange', (e) => {
        elements = e.target.assignedElements();
        elements.forEach((el, index) => {
                elements[index].style = "display:none;"
        })
      })
      shadowRoot.innerHTML = `
        <style>
            .mainBoard{
                background:${background};
                display:flex;
                flex-direction:column;
                
            }
            .navigation{
                display:flex;
                flex-direction:row;
                justify-content:space-around;
                flex-wrap:wrap;
            }
            .itemHeader{
                cursor:pointer;
                padding-top:20px;
                padding-bottom:20px;
                padding-left:40px;
                padding-right:40px;
                border-radius:20px;
                background:${itemBackground};
                color:${blackSquareColor};
                text-align:center;
            }
            .itemHeader:hover{
                color:${itemBackground};
                background:${hoveredHeaderBackground};
            }

            .selected{
                background:${selectedBackground};
                color:${itemBackground};
            }

            .content{
                margin-left:auto;
                margin-right:auto;
            }
        </style>
        <div class="mainBoard">
            <div class="navigation" id="navigation">
            </div>

            <div id="content" class="content">
                <slot id="slot" />
            </div>

        </div>
      `;
    
    }

    connectedCallback(){
        const navigation = this.shadowRoot.querySelector('#navigation');
        const headerNames = JSON.parse(this.getAttribute('headings')) || [];
        headerNames.forEach((name) => {
            navigation.insertAdjacentHTML('beforeend',`<h1 class="itemHeader">${name}</h1>`)
        })
        const items = this.shadowRoot.querySelectorAll('.itemHeader')
        let that = this;
        items.forEach((item, index) => {
            item.onclick = ((e) => {
                return that.onClick(e,index)})
        })
        
        // const slot = this.shadowRoot.querySelector('#slot')
        // console.log(slot)
        this.background = this.getAttribute('background') ? this.getAttribute('background') : 'rgb(0,0,0,0.8)'
        this.selectedBackground = this.getAttribute('selectedBackground') ? this.getAttribute('selectedBackground') : 'black'
        this.itemBackground = this.getAttribute('itemBackground') ? this.getAttribute('itemBackground') : 'white'
        this.hoveredHeaderBackground = this.getAttribute('hoveredHeaderBackground') ? this.getAttribute('hoveredHeaderBackground') : 'black'
    }

  }


customElements.define('gallery-game',gallery)
