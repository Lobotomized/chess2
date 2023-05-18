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
      let buttonText = this.getAttribute('buttonText') ? this.getAttribute('buttonText') : 'Back';
      let hideBackButton = this.getAttribute('hideBackButton') ? true : false;
      
      this.resetToStart = function(){
        const navigation = this.shadowRoot.querySelector('#navigation');

        elements.forEach((el, index) => {
            elements[index].style = "display:none;"
        })
        navigation.classList.remove('hide')

      }
      
      this.backClick = function(e){
        const navigation = this.shadowRoot.querySelector('#navigation');
        const backButton = this.shadowRoot.querySelector('#back');


        if(e.target.classList.contains('back')){
            elements.forEach((el, index) => {
                elements[index].style = "display:none;"
            })
            
            navigation.classList.remove('hide')
            backButton.classList.add('hide');
        }

        elements.forEach((el) => {
            if(el.resetToStart){
                el.resetToStart();
            }
        })        
      }

      this.onClick =  function(e, item){
        const navigation = this.shadowRoot.querySelector('#navigation');
        const backButton = this.shadowRoot.querySelector('#back');

        if(!this.hideBackButton){
            backButton.classList.remove('hide');
        }
        if(this.hideOnClick && elements[item] !== undefined){
            navigation.classList.add('hide')
        }
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
                align-items:center;
                justify-content:center;

                
            }
            .navigation{
                display:flex;
                flex-direction:column;
                max-width:300px;
                align-content:center;
                justify-content:space-around;
                flex-wrap:wrap;
            }

            .hide{
                display:none;
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
            
            <div class="back hide" id="back">
                <h1 class="itemHeader back">${buttonText}</h1>
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
                return that.onClick(e,index)
            })
        })

        const backButton = this.shadowRoot.querySelectorAll('#back');
        backButton[0].onclick = ((e) => {
            return that.backClick(e);
        })
        

        this.background = this.getAttribute('background') ? this.getAttribute('background') : 'rgb(0,0,0,0.8)'
        this.selectedBackground = this.getAttribute('selectedBackground') ? this.getAttribute('selectedBackground') : 'black'
        this.itemBackground = this.getAttribute('itemBackground') ? this.getAttribute('itemBackground') : 'white'
        this.hoveredHeaderBackground = this.getAttribute('hoveredHeaderBackground') ? this.getAttribute('hoveredHeaderBackground') : 'black'
        this.hideOnClick=  this.getAttribute('hideOnClick') ? true : false
        this.buttonText = this.getAttribute('buttonText') ? this.getAttribute('buttonText') : 'Back';
        this.hideBackButton = this.getAttribute('hideBackButton') ? true : false;
        this.shadowRoot.querySelector('#back').innerHTML = `<h1 class="itemHeader back">${this.buttonText}</h1>`
    }

  }


customElements.define('gallery-game',gallery)
