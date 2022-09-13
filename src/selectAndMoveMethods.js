
function lightBoard(piece, state, flag) {
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
                blockableFunction(state, move.x, move.y, piece.x, piece.y, move, limit, flag);
            }
        }
    })
}



function blockableFunction(state, powerX, powerY, x, y, move, limit, flag) {
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
        blockableFunction(state, powerX + directionX, powerY + directionY, x, y, move, limit - 1, flag)
    }
    else if (piece.color != state.turn && !move.impotent) {
        square[flag] = true;
    }

    return;
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

function changeTurn(state) {
    if (state.turn == 'white') {
        state.turn = 'black'
    }
    else {
        state.turn = 'white'
    }
}

function checkTurn(state, playerRef) {

    //Return true if it's your turn and false if it's not
    if (state.turn == 'white' && state.white == playerRef || state.turn == 'black' && state.black == playerRef) {
        return true
    }
    return false
}

function pickARace(race,state,playerRef){
    if(state.white == playerRef){
        state.whiteRace  = race;
    }
    else if(state.black == playerRef){
        state.blackRace = race;
    }
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
        // console.log(operatedPiece)
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

function selectPiece(playerMove, state) {
    const x = playerMove.x;
    const y = playerMove.y;

    const piece = state.pieces.find((el) => {
        return x == el.x && y == el.y;
    })
    if (!piece) {
        closeLights(state.board);
        return;
    }

    if (piece.color !== state.turn) {
        closeLights(state.board);
        return;
    }
    state.pieceSelected = piece;
    lightBoard(piece, state, 'light')
}