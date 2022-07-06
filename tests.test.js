const board = require('./exportsMock').board;
const singleWhiteHorse = require('./exportsMock').singleWhiteHorse;
const twoWhiteHorses = require('./exportsMock').twoWhiteHorses;
const singleBlackQueen = require('./exportsMock').singleBlackQueen;
const whiteAndBlackHorse = require('./exportsMock').whiteAndBlackHorse;



function minimax(state,maximizer, depth){
    const moves = generateMovesFromPieces(state,maximizer)
                
    let selectedMove = undefined;
    let currValue = -999999;
    let badMoveResults= []
    let randomMoves = moves.slice(0,depth);
    let lowestBadMoveResult = 99999999;

    moves.forEach((move, index) => {
        const badMoves = generateMovesFromPieces({board:state.board,pieces:move.pieces},'black')
        let bestBadMove = {};
        let badMoveValue = -999999;
        badMoves.forEach((badMove) => {

            let thisValue = evaluateBoard("black",badMove.pieces)
            if(thisValue > currValue){
                badMoveValue = thisValue;
                bestBadMove = {moveCounter:index, value:badMoveValue}
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
}

function pieceFromXY(x,y, pieces) {
    const piece = pieces.find((p) => {
        return x === p.x && y === p.y;
    })

    return piece;
}

function getColorPieces(pieces,color){
    const myPieces = pieces.filter((piece) => {
        if(color === piece.color){
            return true;
        }
    })

    return myPieces
}

function closeLights(board, flag) {
    if (!flag) {
        flag = 'light'
    }
    board.forEach((square) => {
        square[flag] = false;
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

function pieceFromSquare(square, pieces) {
    const piece = pieces.find((p) => {
        return square.x === p.x && square.y === p.y;
    })

    return piece;
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

function generateMovesFromPieces(state,color){
    const movesAndPieces = []
    color = color ? color : AIProps.color;
    let piecesCounter = 0;
    const myPieces = !color ?state.pieces : getColorPieces(state.pieces,color) //getColorPieces(state.pieces,   color);
    while(myPieces.length > piecesCounter){
        let movesCounter = 0;
        let piece = myPieces[piecesCounter]
        lightBoardFE(piece,{pieces:state.pieces, board:state.board},'allowedMove')
        const allowedMoves = state.board.filter((square) => {
            return square.allowedMove;
        })
        while(allowedMoves.length > movesCounter){
            const newPieces = JSON.parse(JSON.stringify(state.pieces))
            let newMyPieces = getColorPieces(newPieces, color)
            piece = newMyPieces[piecesCounter];


            const square = allowedMoves[movesCounter]
            playerMove({x:square.x, y:square.y},{board:state.board, pieces:newPieces, pieceSelected:piece},true, undefined, 'allowedMove')


            if( square && square.allowedMove){
                movesAndPieces.push({pieceCounter:piecesCounter,pieces:newPieces, xClicked:square.x, yClicked:square.y})
            }
            movesCounter++
        }
        piecesCounter++
    }
    return movesAndPieces
}


function evaluateBoard(colorPerspective, pieces){
    let counter = 0;
    let valueTransformer = 1;
    let valueCounter = 0;
    
    while(pieces.length > counter){
        const piece = pieces[counter]
        if(colorPerspective === piece.color){
            valueTransformer = 1;
        }
        else{
            valueTransformer = -1;
        }
        valueCounter += valueTransformer;
        counter++;
    }
    return valueCounter;
}



test('Test Evaluate board', () => {
    let pieces = [
        {color:'black'},
        {color:'white'}
    ]
    
    expect(evaluateBoard('black',pieces)).toBe(0);


    pieces = [
        {color:'black'},
        {color:'black'},
        {color:'white'}
    ]
    
    expect(evaluateBoard('white',pieces)).toBe(-1);
  });


  
test('Generate moves from pieces', () => {

    let state = {
        board:board,
        pieces:singleWhiteHorse
    }
    
    expect(generateMovesFromPieces(state,'white').length).toBe(18);

    state = {
        ...state,
        pieces:twoWhiteHorses
    }

    expect(generateMovesFromPieces(state,'white').length).toBe(30);

    state = {
        ...state,
        pieces:singleBlackQueen
    }
    expect(generateMovesFromPieces(state,'black').length).toBe(4);

    const newBlackQueenBug = {
        ...singleBlackQueen[0],
        x:0,
        y:0
    }
    state = {
        ...state,
        pieces:[newBlackQueenBug]
    }
    expect(generateMovesFromPieces(state,'black').length).toBe(2);

  });


    
// test('Minimax', () => {
//     let state = {
//         board:board,
//         pieces:whiteAndBlackHorse
//     }
//     console.log(minimax(state,'white',5))
//     expect(minimax(state,'black',5).xClicked).toBe(4)
//     expect(minimax(state,'black',5).yClicked).toBe(6)

//   });

