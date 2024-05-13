
const AIColor = getParams(window.location.href).AIColor
let AIPowerWhite = getParams(window.location.href).AIPowerWhite;
let AIPowerBlack = getParams(window.location.href).AIPowerBlack;
let whoStarts = getParams(window.location.href).starts;

let aiPowers = {
    white:AIPowerWhite ? AIPowerWhite : 3 ,

    black:AIPowerBlack ? AIPowerBlack : 3
}

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

function drawBoard(squares) {
    // 1. Try to find an existing board container
    let boardContainer = document.querySelector('.board-container');
  
    // If it doesn't exist, create it as before
    if (!boardContainer) {
      boardContainer = document.createElement('div');
      boardContainer.classList.add('board-container');
      document.body.appendChild(boardContainer);
  
      // 2. Calculate grid properties (optional, adjust as needed)
      const columns = Math.max(...squares.map(square => square.x)) + 1;
      const rows = Math.max(...squares.map(square => square.y)) + 1;
  
      // 3. Set up CSS grid styles for the container
      boardContainer.style.display = 'grid';
      boardContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
      boardContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  
        // 6. Make the grid responsive using CSS (move here)
    const boardStyle = document.createElement('style');
    boardStyle.textContent = `
      .board-container {
        width: 90vw; /* Adjust width as needed */
        max-width: 600px; /* Set a maximum width */
        aspect-ratio: 1 / 1; /* Maintain a square aspect ratio */
      }
      .square {
        width: 100%; /* Make squares fill their grid cells */
        height: 100%; 
      }
    `;
    document.head.appendChild(boardStyle);
  
    }
  
    // 4. Clear existing squares from the board
    boardContainer.innerHTML = ''; // Remove any previous squares
  
    // 5. (Re)create and style squares
    squares.forEach(square => {
      const squareDiv = document.createElement('div');
      squareDiv.classList.add('square');
      squareDiv.style.gridColumn = `${square.x + 1}`; 
      squareDiv.style.gridRow = `${square.y + 1}`;   
      if (square.light) {
          squareDiv.style.backgroundColor = lightedSquareColor;
      } else if (square.special) {
          squareDiv.style.backgroundColor = specialSquareColor;
      } else {
          squareDiv.style.backgroundColor = square.color || ((square.x + square.y) % 2 === 0 ? whiteSquareColor : blackSquareColor); 
      }
      boardContainer.appendChild(squareDiv);
    });
  
     // 7. Add click event listener to the board container
     boardContainer.addEventListener('click', (event) => {
      const clickedSquare = event.target; 
      if (clickedSquare.classList.contains('square')) {
        const x = parseInt(clickedSquare.style.gridColumn, 10) - 1;
        const y = parseInt(clickedSquare.style.gridRow, 10) - 1;
        handleSquareClick(x, y); 
      }
    });
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

      drawBoard(state.board)
    //     state.board.forEach((sq,index) => {
    //         let y = sq.y;
    //         let x = sq.x;


    //         let orderFirst = true;
    //         if(y%2 != 0){
    //             orderFirst = false;
    //         }
    //             if (!sq.light && !sq.special && !sq.red && !sq.grey) {
    //             if(orderFirst){
    //                 if(x % 2 != 0){
    //                     drawBlackSquare(x * squareLength, y * squareLength, squareLength)
    //                 }
    //                 else{
    //                     drawWhiteSquare(x * squareLength, y * squareLength, squareLength)
    //                 }
    //             }
    //             else{
    //                 if(x % 2 != 0){
    //                     drawWhiteSquare(x * squareLength, y * squareLength, squareLength)
    //                 }
    //                 else{
    //                     drawBlackSquare(x * squareLength, y * squareLength, squareLength)
    //                 }
    //             }
    //             if(state.pieceSelected){
    //                 if(x == state.pieceSelected.x && y == state.pieceSelected.y){
    //                     drawColoredSquare(x*squareLength, y*squareLength,availableSquareColor, squareLength)
    //                 }
    //             }
    //         }
    //         else if (sq.light) {
    //             drawLightedSquare(x * squareLength, y * squareLength, squareLength);
    //         }
    //         else if(sq.red){
    //             drawColoredSquare(x*squareLength, y * squareLength, dangerSquareColor, squareLength)
    //         }
    //         else if(sq.grey){
    //             drawColoredSquare(x*squareLength, y * squareLength, blockedSquareColor, squareLength)
    //         }
    //         else if(sq.special){
    //             drawColoredSquare(x*squareLength, y * squareLength, specialSquareColor, squareLength)
    //         }
    //     })
    //     if(state.oldMove){
    //         const oldSquare = findSquareByXY(state.board,state.oldMove.oldX, state.oldMove.oldY);
    //         const newSquare = findSquareByXY(state.board,state.oldMove.currentX, state.oldMove.currentY);

    //         if(hotseatGame.state.turn === 'black'){
    //             if(!oldSquare.light){
    //                 drawColoredSquare(state.oldMove.oldX*squareLength, state.oldMove.oldY*squareLength,oldMoveSquareColor, squareLength)
    //             }
    //             if(!newSquare.light){
    //                 drawColoredSquare(state.oldMove.currentX*squareLength, state.oldMove.currentY*squareLength,oldMoveSquareColor, squareLength)
    //             }
    //         }
    //         else if(hotseatGame.state.turn === 'white'){

    //             if(!oldSquare.light){
    //                 drawColoredSquare(state.oldMove.oldX*squareLength, state.oldMove.oldY*squareLength,oldMoveSquareColor, squareLength)
    //             }
    //             if(!newSquare.light){
    //                 drawColoredSquare(state.oldMove.currentX*squareLength, state.oldMove.currentY*squareLength,oldMoveSquareColor, squareLength)
    //             }
    //         }

    //     }

    //     //Draw Pieces
    //     state.pieces.forEach((piece) => {
    //         drawPiece(piece.x, piece.y, piece.icon, squareLength)
    //     })
    //     if (state.won) {
    //         if (state.won == 'black') {
                
    //             forfeitTextButton.innerText = 'Black Won'
    //         }
    //         else if (state.won == 'white') {

    //             forfeitTextButton.innerText = 'White Won'

    //         }
    //         else if(state.won === 'tie'){
    //             forfeitTextButton.innerText = 'Game ended in a draw'
    //         }
            
    //     }


    // }
    // else {
    //     myTurnH1.innerText = 'Waiting for Opponent'
    // }

} 

if(whoStarts === 'whiteStarts'){
    hotseatGame.state.turn = 'white'
}
else{
    hotseatGame.state.turn = 'black';
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
            w.postMessage(JSONfn.stringify({state:state, color:AIColor, AIPower:aiPowers[state.turn]}));

            w.onmessage = function(event){
                let move = JSONfn.parse(event.data)
                AIMove(move.pieceCounter, move.xClicked, move.yClicked, AIColor)
                if(state.turn === AIColor){
                    let removedTurns = [{...move}]
                    
                    if(move.removedTurns){
                        removedTurns = [...removedTurns, ...move.removedTurns]
                    }
                    w.postMessage(JSONfn.stringify({state:state, color:AIColor, AIPower:aiPowers[state.turn], removedTurns:removedTurns}));
                }
            }
        }
        else if(AIColor === 'allAI'){
            w.postMessage(JSONfn.stringify({state:state, color:state.turn, AIPower:aiPowers[state.turn]}));
            w.onmessage = function(event){
                let move = JSONfn.parse(event.data)
                AIMove(move.pieceCounter, move.xClicked, move.yClicked, state.turn)
                w.postMessage(JSONfn.stringify({state:state, color:state.turn, AIPower:aiPowers[state.turn]}));
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

