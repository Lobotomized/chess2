

const AIProps = {
    state:undefined,
    color:'white'
 }
 
 let pieceToValue = {
     
 }
 
 
 function evaluateBoard(colorPerspective, pieces){
     let counter = 0;
     let valueTransformer = 1;
     let valueCounter = 0;
 
     while(pieces.length > counter){
         const piece = pieces[counter]
         if(colorPerspective === piece.color){
             valueTransformer = piece.value ? piece.value : 1;
         }
         else{
             valueTransformer = piece.value ? piece.value* -1 : -1;
         }
         valueCounter += valueTransformer;
         counter++;
     }
     return valueCounter;
 }
 
 //How Does a move look? 
 /*
     MovedPiece,
     MoveIndex
     But than what if move blockable?
 */
 
 
 /*
     Function that fake moves and generates new board and pieces after that
     (move) => {
         return {board:board,pieces:pieces}
     }
 */
 
 /*
     Function that actually moves
 
     //Select A Piece
 
     //Move It
 
 */
 
 function AISetup(hotseatGame, AIColor){
     AIProps.hotseatGame = hotseatGame;
     AIProps.color = AIColor;
 }
 
 function AIMove(pieceIndex, xClicked, yClicked){
     const hotseatGame = AIProps.hotseatGame;
     const state = hotseatGame.state;
     const myPieces = getColorPieces(AIProps.hotseatGame.state.pieces,AIProps.color);
     selectPiece({x:myPieces[pieceIndex].x, y:myPieces[pieceIndex].y},state)
 
     const selectedPiece = state.pieceSelected;
 
     lightBoard(selectedPiece,{pieces:state.pieces, board:state.board})
     hotseatGame.move(state.turn,{ x: xClicked, y: yClicked });
 }
 
 function getColorPieces(pieces,color){
     const myPieces = pieces.filter((piece) => {
         if(color === piece.color){
             return true;
         }
     })
 
     return myPieces
 }
 
 
 function generateMovesFromPieces(state,color){
     const movesAndPieces = []
     color = color ? color : AIProps.color;
     let piecesCounter = 0;
     const myPieces = !color ?state.pieces : getColorPieces(state.pieces,color) //getColorPieces(state.pieces,   color);
     while(myPieces.length > piecesCounter){
         let movesCounter = 0;
         let piece = myPieces[piecesCounter]
         lightBoardFE(piece,{pieces:state.pieces, board:state.board},'allowedMove')
         // console.log(piece.moves.length, movesCounter, '  piece')
                 //     const result = playerMove({x:piece.x+move.x, y:piece.y+move.y},{board:state.board, pieces:newPieces, pieceSelected:piece},true, undefined, 'allowedMove')
 
         const allowedMoves = state.board.filter((square) => {
             return square.allowedMove;
         })
         while(allowedMoves.length > movesCounter){
             const newPieces = JSON.parse(JSON.stringify(state.pieces))
             let newMyPieces = getColorPieces(newPieces, color)
             piece = newMyPieces[piecesCounter];
 
 
             const square = allowedMoves[movesCounter]
             playerMove({x:square.x, y:square.y},{board:state.board, pieces:newPieces, pieceSelected:piece , turn:color},true, undefined, 'allowedMove')
 
 
             if( square && square.allowedMove){
                 movesAndPieces.push({pieceCounter:piecesCounter,pieces:newPieces, xClicked:square.x, yClicked:square.y})
             }
             movesCounter++
         }
 
         // while(piece.moves.length > movesCounter){
         //     const newPieces = JSON.parse(JSON.stringify(state.pieces))
 
         //     let newMyPieces = getColorPieces(newPieces, color)
         //     piece = newMyPieces[piecesCounter];
         //     const move = piece.moves[movesCounter]
         //     //Logic for check if move is possible
         //     const result = playerMove({x:piece.x+move.x, y:piece.y+move.y},{board:state.board, pieces:newPieces, pieceSelected:piece},true, undefined, 'allowedMove')
 
         //     if(result){
         //         // console.log(newPieces, '  novite figuri?')
         //     }
         //     const square = findSquareByXY(state.board,piece.x+move.x,piece.y+move.y)
         //     if( square && square.allowedMove){
         //         movesAndPieces.push({movesCounter:movesCounter, pieceCounter:piecesCounter,pieces:newPieces, xClicked:piece.x+move.x, yClicked:piece.y+move.y})
                 
         //     }
         //     movesCounter++
         // }
 
         piecesCounter++
     }
     return movesAndPieces
 }
 
 
 function minimax(state,maximizer, depth){
     const moves = generateMovesFromPieces(state,maximizer)
     let enemy = 'black';
     if(maximizer === 'black'){
         enemy = 'white';
     }
                 
     let selectedMove = undefined;
     let badMoveResults= []
     let slizedMoves = moves.slice(0,depth);
     let lowestBadMoveResult = 99999999;
 
     slizedMoves.forEach((move, index) => {
         const badMoves = generateMovesFromPieces({board:state.board,pieces:move.pieces},enemy)
         let bestBadMove = {};
         let badMoveValue = -999999;
         badMoves.forEach((badMove) => {
 
             let thisValue = evaluateBoard(enemy,badMove.pieces)
             if(thisValue > badMoveValue){
                 badMoveValue = thisValue;
                 bestBadMove = {moveCounter:index, value:badMoveValue,pieces:badMove.pieces}
             }
         })
         badMoveResults.push(bestBadMove)
     })
     badMoveResults.forEach((badMoveResult) => {
         if(badMoveResult.value < lowestBadMoveResult ){
             lowestBadMoveResult = badMoveResult.value;
             selectedMove = {moveCounter:badMoveResult.moveCounter, value:lowestBadMoveResult};
         }
     })
     return moves[selectedMove.moveCounter];
     // const move = moves[selectedMove.moveCounter]
     // return move
 
     // AIMove(move.pieceCounter, move.xClicked, move.yClicked)
 }
 
 // function minimax(state,depth,maximizer,counter){
 // //Ako Depth 0
 //     if(depth === 0){
 
 //         /*
 //             Ako Depth e 0 trqbva da se vyrne tekushtiqt hod, i valueto na tekushtiqt hod
 
 //         */
 //         let maximizingPieces = getColorPieces(state.pieces,'black').length
 //         let minimizingPieces = getColorPieces(state.pieces, 'white').length
 //         //Nameri koi si za da iz4islish value
 //         return {value:Math.random(), moveCounter:counter} //EvaluateBoard(board)
 //     }
 
 
 // // Ako Depth ne e 0
 
 // /* 
 //     Ako Depth ne e 0 
 
 
 //     Trqbva da se buubble upne valueto na vseki hod ot minimax i samiq hod da se podnovi s noviqt hod
 // */
 
 
 //    let value;
 //    if(maximizer == 'black'){
 //     value = {value:-999999};
 //     let counter = 0;
 //     const possibleMoves = generateMovesFromPieces(state,maximizer);
 //     while(counter <= possibleMoves.length -1){
 //         const moveAndValue = minimax({pieces:possibleMoves[counter].pieces, board:state.board},
 //              depth-1,'white',counter);
 //         value = max(value,moveAndValue)
 //         counter++;
 //     }
 //     return value;
 //    }
 
 
    
 //    else{
 //     value = {value:999999};
 //     let counter = 0;
 //     const possibleMoves = generateMovesFromPieces(state,maximizer);
 //     while(counter <= possibleMoves.length -1){
 //         const moveAndValue =  minimax({pieces:possibleMoves[counter].pieces, board:state.board}
 //             ,depth-1,'black',counter);
 //         value = min(value, moveAndValue)
 
 //         counter++;
 //     }
 //     // console.log('gets here ever  ' , value)
 
 //     return value;
 //    }
 
 
 //        //Trqbva da vryshta hod, koito da se igrae 
 
 // }

 function lightBoardFE(piece, state, flag,blockedFlag) {
    if (!flag) {
        flag = 'light'
    }
    closeLights(state.board, flag);
    if (!piece) {
        return;
    }
    let tempMoves = [];
    if (piece.conditionalMoves) {
        tempMoves = piece.conditionalMoves(state);
    }
    [...piece.moves, ...tempMoves].forEach((move) => {
        if (move.type == 'absolute') {
            const square = state.board.find((el) => {
                return el.x === piece.x + move.x && el.y === piece.y + move.y
            })
            if (square) {
                const innerPiece = pieceFromSquare(square, state.pieces)
                if (innerPiece) {
                    if (innerPiece.color != piece.color && !move.impotent) {
                        square[flag] = true;
                    }
                    else{

                        square[blockedFlag] = true;
                    }
                }
                else if (!innerPiece) {
                    square[flag] = true;
                }
            }
        }
        else if (move.type == 'allMine') {
            state.board.forEach((square) => {
                const innerPiece = pieceFromSquare(square, state.pieces);
                if (innerPiece) {
                    if (innerPiece.color == piece.color) {
                        square[flag] = true;
                    }
                }
            })
        }
        else if (move.type == 'takeMove') {
            const square = state.board.find((el) => {
                return el.x === piece.x + move.x && el.y === piece.y + move.y
            })
            if (square) {
                const innerPiece = pieceFromSquare(square, state.pieces)
                if (innerPiece) {
                    if (innerPiece.color != piece.color && !move.impotent) {
                        square[flag] = true;
                    }
                }
            }
        }
        else if (move.type == 'blockable') {
            if (move.repeat) {
                const limit = move.limit || 100;
                blockableSpecialFunction(state, move.x, move.y, piece.x, piece.y, move, limit, flag,blockedFlag);
            }
        }
    })
}

function blockableSpecialFunction(state, powerX, powerY, x, y, move, limit, flag,secondFlag) {
    if (!flag) {
        flag = 'light'
    }
    if (limit === 0) {
        return;
    }
    const square = state.board.find((el) => {
        return el.x === x + powerX && el.y === y + powerY;
    })
    if (!square) {
        return;
    }
    const piece = pieceFromSquare(square, state.pieces)

    let directionX = 0;
    if (powerX < 0) {
        directionX = -1;
    }
    else if (powerX > 0) {
        directionX = 1;
    }

    let directionY = 0;

    if (powerY < 0) {
        directionY = -1;
    }
    else if (powerY > 0) {
        directionY = 1;
    }
    else {
        directionY = 0;
    }


    if (!piece) {
        square[flag] = true;
        blockableSpecialFunction(state, powerX + directionX, powerY + directionY, x, y, move, limit - 1, flag,secondFlag)
    }
    else if (!move.impotent) {
        // console.log(state, state.pieces)
        let selectedPiece = pieceFromXY(x,y,state.pieces)
        square[flag] = true;

        if(selectedPiece){
            if(selectedPiece.color == piece.color){
                square[secondFlag] = true;
                square[flag] = false;

            }
        }
        
        blockableSpecialFunction(state, powerX + directionX, powerY + directionY, x, y, move, limit - 1, secondFlag,secondFlag)
    }

    return;
}


function playerMove(playerMove, state,alwaysLight,selectedForced, specialFlag) {
    // if legal move return true else return false
    let light = specialFlag || 'light';
    const x = playerMove.x;
    const y = playerMove.y;
    const operatedPiece = selectedForced ? selectedForced : state.pieceSelected
    const square = state.board.find((sq) => {
        return sq.x === x && sq.y === y;
    })

    if (!square) {
        return false;
    }
    if (!square[light] && !alwaysLight) {
        return false; // Square wasn't lighted in the lightBoard stage so the move is not legal
    }

    const enemyPiece = state.pieces.find((ePiece) => {
        return ePiece.x === x && ePiece.y === y && ePiece.color != operatedPiece.color
    })


    const friendlyPiece = state.pieces.find((ePiece) => {
        return ePiece.x === x && ePiece.y === y && ePiece.color == operatedPiece.color
    })

    const oldX = operatedPiece.x;
    const oldY = operatedPiece.y;

    operatedPiece.x = x;
    operatedPiece.y = y;
    let continueTurn = true;

    for (let i = state.pieces.length - 1; i >= 0; i--) {
        if (state.pieces[i].afterPlayerMove) {
            if(state.pieces[i].afterPlayerMove(state, playerMove, {x:oldX, y:oldY})){
                continueTurn = false;
            }
        }

        if(state.pieces[i].friendlyPieceInteraction){
            if(state.pieces[i].friendlyPieceInteraction(state, friendlyPiece, {x:oldX, y:oldY})){
                continueTurn = false;
            }    
        }
    }
    if(!continueTurn){

        operatedPiece.x = oldX;
        operatedPiece.y = oldY;
        return false;
    }
    else{
        if (enemyPiece) {
            if (enemyPiece.afterThisPieceTaken) {
                enemyPiece.afterThisPieceTaken(state)
            }
            if (operatedPiece.afterEnemyPieceTaken) {
                operatedPiece.afterEnemyPieceTaken(enemyPiece, state);
            }
            enemyPiece.x = undefined;
            enemyPiece.y = undefined;
            
            state.pieces.splice(state.pieces.indexOf(enemyPiece), 1)
        }
    }

    if (operatedPiece.afterPieceMove) {
        const continueTurn = operatedPiece.afterPieceMove(state, playerMove, {x:oldX, y:oldY});

        if (!continueTurn) {
            operatedPiece.x = oldX;
            operatedPiece.y = oldY;
            return false;
        }
    }
    state.oldMove = {oldX:oldX,oldY:oldY,currentY:operatedPiece.y,currentX:operatedPiece.x}
    state.pieceSelected = undefined;
    closeLights(state.board)

    return true;
}
function pieceFromXY(x,y, pieces) {
    const piece = pieces.find((p) => {
        return x === p.x && y === p.y;
    })

    return piece;
}


function pieceFromSquare(square, pieces) {
    const piece = pieces.find((p) => {
        return square.x === p.x && square.y === p.y;
    })  

    return piece;
}
 
function closeLights(board, flag) {
    if (!flag) {
        flag = 'light'
    }
    board.forEach((square) => {
        square[flag] = false;
    })
}
 function max(objOne, objTwo){
     if(objOne.value > objTwo.value){
         return objOne
     }
     else{
         return objTwo
     }
 }
 
 function min(objOne, objTwo){
     if(objOne.value < objTwo.value){
         return objOne
     }
     else{
         return objTwo
     }
 }
 
 

self.addEventListener("message", function(e) {
    let obj = JSON.parse(e.data)
    console.log(obj.depth)
    let move = minimax(obj.state,obj.color,obj.depth)
    postMessage(move)
})

// function timedCount() {
//   i = i + 1;
//   postMessage(i);
// }

// timedCount();