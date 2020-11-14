class lobbyGame extends HTMLElement {
    constructor() {
      // Always call super first in constructor
      super();
      
      let shadowRoot = this.attachShadow({mode: 'open'});
      const game = JSON.parse(this.getAttribute('game'));
      shadowRoot.innerHTML = `
      <style>

        .lobbyGame{
          display:flex;
          flex-direction:column;
          border:solid;
          border: 2px 2px 2px 2px;
          border-color:white;
          border-radius:8px;
          padding:16px;
          color:white;
        }



        .linkHeader{
          text-align:center;
          color:white;
          text-decoration:none;
          text-weight:bold;
          font-size:25px;
          font-family:"Lucida Sans Unicode", "Lucida Grande", sans-serif;
        }
        .row{
          display:flex;
          flex-direction:row;
        }

        .startGame{
          color:white;
          border:solid;
          border-color:white;
          padding:15px;
          font-size:18px;
          border:2px 2px 2px 2px;
          cursor:pointer;
          text-decoration:none;
        }
        .startGame:hover{
          color:black;
          background:white;
        }
        span{
          margin-left:auto;
          margin-right:auto;
          margin-top:15px;
          margin-bottom:15px;
        }

        .games{
          display:flex;
          flex-direction:row;
          justify-content:space-around;
        }
        
      </style>
      
      
      
      
      
      
      
      <div class="lobbyGame"> <a class="linkHeader"  href="/play?roomId=${game.roomId}">${game.roomId}</a>
            <div class="row">
                <span> ${game.players.length} / 2 players</span>
            </div>
            <div class="row"> 
              <a class="startGame" href="/play?roomId=${game.roomId}">Start Game</a>
            </div>
        
      </div>`;
    }
  }


customElements.define('lobby-game',lobbyGame)
