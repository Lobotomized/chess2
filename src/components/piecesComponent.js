class pieces extends HTMLElement {
    shadowRoot
    constructor(){
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});

        shadowRoot.innerHTML = `
        <style>        
            .piece > img{
                width:50vw;
                max-width:300px;
            }
            .pieces > h1{
                text-align:center; 
            }
            .piece{
                width:50vw;
                max-width:300px;
                color:var(--white-square-color);
                text-align:center;
                font-size:18px;
            }
        </style>
        <h1>Crusaders</h1>


        <p>
            The Crusaders are a tactical fraction with many mobile pieces. <br> <br>
            It has smaller taking potential than the other fractions, but they can organize their forces the quickest. 
            Use your clown to position your single-directional units.
            <br><br>
            The Crusaders are a fraction for players who want to make beautiful, multipiece attacks.
        </p>
        <div class="piece">
            <img src="/static/blackClown.png" alt="">
            <p>
                The Clown is one of the more unique units in the Crusader's arsenal.<br> <br>
                It can move as a Classic Queen, but it can't take enemy pieces.      <br>            
                Instead, it has the powerful ability to swap positions with any other piece you have.
            </p>
        </div>

        <div class="piece">
            <img src="/static/whiteRicar.png" alt="">
            <p>
                The Crusader is another piece with a unique ability.
                <br><br>
                
                It can jump-move(like the classic Knight) by two in any direction. This includes horizontal, vertical, and all four diagonals.
                <br><br>
                This means that this piece both has the limitations of the knight (it can't move quickly through the board) 
                AND the limitations of a bishop since it can never access half the squares.
                <br><br>
                What makes this piece strong is its special ability. After it gets taken it checks if the square behind it is empty and summons a Ghost of 
                the Vendetta right behind it. <br><br>
                Ready to avenge his comrade!                
            </p>
        </div>

        <div class="piece">
            <img src="/static/blackGhost.png" alt="">
            <p>
                The Ghost of the Vendetta is the weakest piece of the crusaders. 
                It can move one or two squares in front of itself, but it can also jump to the second while ignoring blockers.
            </p>
        </div>

        <div class="piece">
            <img src="/static/whiteHorse.png" alt="">
            <p>
                The Cavalry is moving like a small Queen.  In every direction and diagonal but with a limitation of 3 squares distance.

            </p>
        </div>


        <div class="piece">
            <img src="/static/blackPig.png" alt="">
            <p>
                The Pig can move and take forward until it is blocked. <br> <br>
                (Hint: Use the Clown to position it where you want the attack to happen.)
            </p>
        </div>

        <div class="piece">
            <img src="/static/whiteHat.png" alt="">
            <p>
                You have two magical hats! Losing any of them loses you the game.
                <br> <br>
                They move and take like a rook and also can move by one in each diagonal impotently (they can't take pieces).
            </p>
        </div>


        <h1>Insectoids <br> (Strategical Fraction)</h1>


        <p>
            The insectoids are a strategical, slow-play fraction they have the powerful ability to 
            spawn more pieces BUT also the horrible weakness of having immovable lose-condition pieces.
            <br><br>
            Insectoids are best for players who see a couple of threats in advance.            </p>


        <div class="piece">
            <img src="/static/blackAnt.png" alt="">
            <p>
                The ant is the basic piece of the insectoids. <br>
                It can move and take two forward (until it is blocked). If it gets to the last square it promotes itself to a Bug Queen.
                <br>
                If one of your shrooms is taken the Ant will be able to move and take only one square forward.
            </p>
        </div>

        <div class="piece">
            <img src="/static/whiteQueenBug.png" alt="">
            <p>
                The Bug Queen can't move, but it can spawn Ants in every nondiagonal square around it.                </p>
        </div>


        <div class="piece">
            <img src="/static/blackSpider.png" alt="">
            <p>
                If you have two shrooms the Spider is moving both like a Classic Knight and a Classic King.
                <br> <br>
                Else it moves only like a King.
            </p>
        </div>

        <div class="piece">
            <img src="/static/whiteLadyBug.png" alt=""> 
            <p>
                If you have two shrooms the Spider is moving both like a Classic Bishop and a Classic King.
                <br> <br>
                Else it moves only like a King.
            </p>
        </div>


        <div class="piece">
            <img src="/static/blackGoliathBug.png" alt=""> 
            <p>
                If you have two shrooms the Spider is moving both like a Classic Rook and a Classic King.
                <br> <br>
                Else it moves only like a King.
            </p>
        </div>


        <div class="piece">
            <img src="/static/whiteShroom.png" alt=""> 
            <p>
                The Shroom can't move. If you lose both - you lose the game. <br>
                If you lose one - all your pieces become much weaker.
            </p>
        </div>

        <h1>Classic </h1>


        <p>
            It's both the classic piece set AND the middle ground between tactical and startegical play. It has both end and early game mechanics.
        </p>
        <div class="piece">
            <img src="/static/blackPawn.png" alt=""> 
            <p>
                The Pawn is the basic piece of the Classic fraction.
                <br>
                It takes by one square diagonally infront of itself and  it moves  only forward. <br>
                If it never moved and it isn't blocked it can  move forward by two squares. If it gets to the end it promotes to Queen.
            </p>
        </div> 
        <div class="piece">
            <img src="/static/whiteKnight.png" alt=""> 
            <p>
                The Knight may move two squares vertically and one square horizontally, or two squares horizontally and one square vertically
                 (with both forming the shape of an L). While moving, the knight can jump over pieces to reach its destination.
            </p>
        </div> 

        <div class="piece">
            <img src="/static/blackBishop.png" alt=""> 
            <p>
               The bishop moves and takes diagonally until it is blocked
            </p>
        </div> 
        
        <div class="piece">
            <img src="/static/whiteRook.png" alt=""> 
            <p>
               The Rook moves and takes vertically and horizontally until it is blocked.
            </p>
        </div> 

        <div class="piece">
            <img src="/static/blackQueen.png" alt=""> 
            <p>
                The Queen is the most powerful piece in the game.

               <br> <br>
               It can move and take diagonally, vertically and horizontally until it is blocked.
            </p>
        </div> 

        <div class="piece">
            <img src="/static/whiteKing.png" alt=""> 
            <p>
                The King moves and takes one square in each direction.
                <br>
                The King can't finish its turn on an attacked square. <br>
                If such an event is inescapable you lose.

               <br>
               CHESS 2 removed the Draw option.
               <br>
                <br>
                There is no middle ground.
               <br><br>
               You win or You lose
            </p>
        </div> 

        
        `
    }
}

window.customElements.define('pieces-game',pieces)