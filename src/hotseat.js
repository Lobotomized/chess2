
const AIColor = getParams(window.location.href).AIColor
let AIPower = getParams(window.location.href).AIPower;
if(AIPower === undefined || typeof AIPower === 'NaN'){
    AIPower = 1;
}
AIPower = parseInt(AIPower);

let ani = function(){
    animate(hotseatGame.returnState())
}

const startHotseat = function(){
    const g = getSinglePlayerGame();
    return g;
}


let squareLength = screen.width < screen.height? parseInt(screen.width/8) : parseInt(screen.height/12) 
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const exitButton = document.getElementById('exitButton')
const flagImage = document.getElementById('flagImage')
const hotseatGame = startHotseat();
let mouseX;
let mouseY;
let st = undefined;
let endGame = false;
let boardHeight;
let boardWidth;
let state;
let hoveredPiece;
let playerRef;
let w;



hotseatGame.join('white', 'white');
hotseatGame.join('black','black');

hotseatGame.state.pieces.length = 0;
hotseatGame.state.board.length = 0;

hotseatGame.state.pieces.push(kingFactory('white',1,1), hatFactory('white',1,2), shroomFactory('white', 1, 3))
hotseatGame.state.gameType = 'raceChoiceChess'
hotseatGame.state.turn = 'menu'
hotseatGame.state.whiteRace = getParams(window.location.href).whiteRace || 'medieval'
hotseatGame.state.blackRace = getParams(window.location.href).blackRace || 'bug'
hotseatGame.state.turn = 'black'
let comingGameType = getParams(window.location.href).gameType;
if(comingGameType){
    hotseatGame.state.gameType = comingGameType;
}


if(hotseatGame.state.gameType){
    window[hotseatGame.state.gameType](hotseatGame.state,hotseatGame.state.whiteRace,hotseatGame.state.blackRace)
}


const AIProps = {
state:undefined,
color:'white'
}


AIProps.hotseatGame = hotseatGame;
AIProps.color = AIColor;


function AIMove(pieceIndex, xClicked, yClicked, color){
    const hotseatGame = AIProps.hotseatGame;
    const theColor = color? color : AIProps.color;
    const state = hotseatGame.state;
    const myPieces = getColorPieces(AIProps.hotseatGame.state.pieces,theColor);
    selectPiece({x:myPieces[pieceIndex].x, y:myPieces[pieceIndex].y},state)

    const selectedPiece = state.pieceSelected;
    lightBoardFE(selectedPiece,{pieces:state.pieces, board:state.board, turn:state.turn})
    hotseatGame.move(state.turn,{ x: xClicked, y: yClicked });
}
function animate(secretState){
    //Draw the game
    const myTurnH1 = document.getElementById('turn');
    canvas.width = squareLength * boardWidth + squareLength;
    canvas.height = squareLength * boardHeight + squareLength;
    state = secretState;
    if(hoveredPiece){
        if(hoveredPiece.color != hotseatGame.state.turn && hotseatGame.state.turn != undefined){
            lightBoardFE(hoveredPiece,state,'red','grey')
        }
    }
    if (state.pieces) {
        if(exitButton.hasAttribute('style')){
            exitButton.removeAttribute('style')
        }
        //Draw Squares
        const me = document.getElementById('blackClock');
        const enemy = document.getElementById('whiteClock');
        const body = document.getElementsByTagName('body')[0];
        const forfeitTextButton = document.getElementById('forfeitText');
        if (state.turn == 'black') {
            body.style.background = backgroundColor
            me.style.color = whiteSquareColor;
            enemy.style.color = whiteSquareColor;
        }
        else {
            me.style.color = blackSquareColor;
            enemy.style.color = blackSquareColor;
            body.style.background = backgroundColor
        }
        myTurnH1.innerText = state.message || '';
        const height = getMaxX(state.board,'y')
        if(state.playerRef !== undefined){
            playerRef = state.playerRef
        }

        boardWidth  = state.board.reduce((accumulator, currentValue) => {
            if(accumulator > currentValue.x){
                return accumulator
            }
            else{
                return currentValue.x
            }
        })
        boardHeight  = state.board.reduce((accumulator, currentValue) => {
            if(accumulator > currentValue.y){
                return accumulator
            }
            else{
                return currentValue.y
            }
        })

        state.board.forEach((sq,index) => {
            let y = sq.y;
            let x = sq.x;


            let orderFirst = true;
            if(y%2 != 0){
                orderFirst = false;
            }
                if (!sq.light && !sq.special && !sq.red && !sq.grey) {
                if(orderFirst){
                    if(x % 2 != 0){
                        drawBlackSquare(x * squareLength, y * squareLength, squareLength)
                    }
                    else{
                        drawWhiteSquare(x * squareLength, y * squareLength, squareLength)
                    }
                }
                else{
                    if(x % 2 != 0){
                        drawWhiteSquare(x * squareLength, y * squareLength, squareLength)
                    }
                    else{
                        drawBlackSquare(x * squareLength, y * squareLength, squareLength)
                    }
                }
                if(state.pieceSelected){
                    if(x == state.pieceSelected.x && y == state.pieceSelected.y){
                        drawColoredSquare(x*squareLength, y*squareLength,availableSquareColor, squareLength)
                    }
                }
            }
            else if(sq.red){
                drawColoredSquare(x*squareLength, y * squareLength, dangerSquareColor, squareLength)
            }
            else if(sq.grey){
                drawColoredSquare(x*squareLength, y * squareLength, blockedSquareColor, squareLength)
            }
            else if(sq.special){
                drawColoredSquare(x*squareLength, y * squareLength, '#855bb3', squareLength)
            }
            else {
                drawLightedSquare(x * squareLength, y * squareLength, squareLength);
            }


            
            
        })
        if(state.oldMove){
            const oldSquare = findSquareByXY(state.board,state.oldMove.oldX, state.oldMove.oldY);
            const newSquare = findSquareByXY(state.board,state.oldMove.currentX, state.oldMove.currentY);

            if(hotseatGame.state.turn === 'black'){
                if(!oldSquare.light){
                    drawColoredSquare(state.oldMove.oldX*squareLength, state.oldMove.oldY*squareLength,oldMoveSquareColor, squareLength)
                }
                if(!newSquare.light){
                    drawColoredSquare(state.oldMove.currentX*squareLength, state.oldMove.currentY*squareLength,oldMoveSquareColor, squareLength)
                }
            }
            else if(hotseatGame.state.turn === 'white'){

                if(!oldSquare.light){
                    drawColoredSquare(state.oldMove.oldX*squareLength, state.oldMove.oldY*squareLength,oldMoveSquareColor, squareLength)
                }
                if(!newSquare.light){
                    drawColoredSquare(state.oldMove.currentX*squareLength, state.oldMove.currentY*squareLength,oldMoveSquareColor, squareLength)
                }
            }

        }

        //Draw Pieces
        state.pieces.forEach((piece) => {
            drawPiece(piece.x, piece.y, piece.icon, squareLength)
        })
        if (state.won) {
            if (state.won == 'black') {
                
                forfeitTextButton.innerText = 'Black Won'
            }
            else if (state.won == 'white') {

                forfeitTextButton.innerText = 'White Won'

            }
        }


    }
    else {
        myTurnH1.innerText = 'Waiting for Opponent'
    }

} 

canvas.addEventListener('click', (e) => {
    const hotseat = true;
    const state = hotseatGame.state;
    if(!w){
        w = new Worker("src/webworker.js");
    }
    if(hotseat || state.turn !=  AIColor){
        var element = canvas, offsetX = 0, offsetY = 0, mx, my;
        // Compute the total offset. It's possible to cache this if you want
        if (element.offsetParent !== undefined) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
            } while ((element = element.offsetParent));
        }

        mx = e.pageX - offsetX;
        my = e.pageY - offsetY;

        hotseatGame.move(hotseatGame.state.turn,{ x: parseInt(mx / squareLength), y: parseInt(my / squareLength) })
        state.pieces = state.pieces.sort((a, b) => 0.5 - Math.random());
        if(state.turn === AIColor){
            w.postMessage(JSONfn.stringify({state:state, color:AIColor, AIPower:AIPower}));

            w.onmessage = function(event){
                let move = JSONfn.parse(event.data)

                AIMove(move.pieceCounter, move.xClicked, move.yClicked, AIColor)
                if(state.turn === AIColor){
                    let removedTurns = [{...move}]
                    
                    if(move.removedTurns){
                        removedTurns = [...removedTurns, ...move.removedTurns]
                    }
                    w.postMessage(JSONfn.stringify({state:state, color:AIColor, AIPower:AIPower, removedTurns:removedTurns}));
                }
            }
        }
        else if(AIColor === 'allAI'){
            w.postMessage(JSONfn.stringify({state:state, color:state.turn, AIPower:AIPower}));
            w.onmessage = function(event){
                let move = JSONfn.parse(event.data)
                AIMove(move.pieceCounter, move.xClicked, move.yClicked, state.turn)
                w.postMessage(JSONfn.stringify({state:state, color:state.turn, AIPower:AIPower}));
            }
        }
    }

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    
    
    //
    // hotseatGame.move('black',  { x: parseInt(mx / squareLength), y: parseInt(my / squareLength) })
    //evaluateBoard('white',state.pieces,state);

})

canvas.addEventListener('mousemove', (e) => {
    let {x, y} = getMousePos(canvas,e);
    if(!state || !state.pieces){
        return;
    }
    hoveredPiece = pieceFromXY(parseInt(x / squareLength), parseInt(y / squareLength),state.pieces)
    // animate(state)
})

setInterval(ani, 100)
