


try{
    var {lightBoardFE} = require('./helperFunctions')
    
}
catch(err){

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

    const friendlyPieceOldX = friendlyPiece && friendlyPiece.x;
    const friendlyPieceOldY = friendlyPiece && friendlyPiece.y;
    const oldX = operatedPiece.x;
    const oldY = operatedPiece.y;

    operatedPiece.x = x;
    operatedPiece.y = y;

    let oldState = JSON.parse(JSON.stringify(state));
    let continueTurn = true;

    for (let i = state.pieces.length - 1; i >= 0; i--) {
        if (state.pieces[i].afterPlayerMove) {
            if(state.pieces[i].afterPlayerMove(state, playerMove, {x:oldX, y:oldY})){
                continueTurn = false;
            }
        }
    }
    if(operatedPiece.friendlyPieceInteraction){
        if(operatedPiece.friendlyPieceInteraction(state, friendlyPiece, {x:oldX, y:oldY})){
            if(friendlyPiece){
                friendlyPiece.x = friendlyPieceOldX;
                friendlyPiece.y = friendlyPieceOldY;
            }
            continueTurn = false;
        }    
    }
    if(!continueTurn){
        state = oldState;
        if(friendlyPiece){
            friendlyPiece.x = friendlyPieceOldX;
            friendlyPiece.y = friendlyPieceOldY;
        }
        operatedPiece.x = oldX;
        operatedPiece.y = oldY;
        return false;
    }
    else{
        if (enemyPiece) {
            if (enemyPiece.afterThisPieceTaken) {
                if(enemyPiece.afterThisPieceTaken(state)){
                    operatedPiece.x = oldX;
                    operatedPiece.y = oldY;
                    return false;
                }
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

    lightBoardFE(piece, state,undefined,undefined,true)
}

try{
    module.exports = {
        selectPiece: selectPiece,
        playerMove: playerMove,
        checkTurn: checkTurn,
        changeTurn: changeTurn,
        closeLights: closeLights,
        pickARace: pickARace
    }
}

catch(err){
    
}