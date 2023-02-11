function findCopyPieceByXY(pieces,x,y){
    return pieces.find((piece) => {
        return piece .x == x && piece.y == y;
    })
}

function findCopySquareByXY(board,x,y){
    return board.find((square) => {
        return square .x == x && square.y == y;
    })
}

function findPieceByXY(pieces,x,y){
    let index =  pieces.findIndex((piece) => {
         return piece .x == x && piece.y == y;
     })
     return index
 }

 function findSquareByXY(pieces,x,y){
    let index =  pieces.findIndex((piece) => {
         return piece .x == x && piece.y == y;
     })
     return index
 }


 function checkEmptyHorizontalBetween(state,pieceOne, pieceTwo){

    let direction = false;
    let checker = true;
    let actor = pieceOne
    
    if(pieceOne.x > pieceTwo.x){
        direction = true;
    }
    let distance = 0;

    if(direction){
        distance = pieceOne.x - pieceTwo.x;
    }
    else{
        distance = pieceTwo.x - pieceOne.x;
        actor = pieceTwo
    }
    distance -=1;
    while(distance > 0){            
        if(state.pieces[findPieceByXY(state.pieces,actor.x-distance, actor.y)]){
            checker = false;
        }
        distance--;
    }
    return checker;
}


function giveOppositeColor (color){
    if(color == 'white'){
        return 'black'
    }
    else if(color == 'black'){
        return 'white'
    }
}

function areYouChecked (state,enemyColor,me){
    for (let i = state.pieces.length - 1; i >= 0; i--) {
        const piece = state.pieces[i]
        let tempMoves = [];
        if (piece.conditionalMoves) {
            tempMoves = piece.conditionalMoves(state);
        }
        for(let ii = [...piece.moves, ...tempMoves].length-1; ii>=0; ii--){
            const move = [...piece.moves, ...tempMoves][ii];
            if (piece.color == enemyColor) {
                if ((move.type == 'absolute' || move.type == 'takeMove') && !move.impotent) {
                    if(piece.x + move.x == me.x && piece.y + move.y == me.y){
                        return true;
                    }
                }
                else if (move.type == 'blockable' && !move.impotent) {
                    if (move.repeat) {
                        const limit = move.limit || 100;
                        const offsetX = move.offsetX || 0;
                        const offsetY = move.offsetY || 0;
                        if(blockableCheck(state, move.x, move.y, piece.x + offsetX, piece.y + offsetY, move, limit, me) == 'block'){
                            return true;
                        }
                    }
                }
            }
        }
    }

    return false

}

function areYouCheckedWithoutTempMoves(state,enemyColor,me, flag){
    let toReturn = false;
    for (let i = state.pieces.length - 1; i >= 0; i--) {
        const piece = state.pieces[i]

        for(let ii = [...piece.moves].length-1; ii>=0; ii--){
            const move = [...piece.moves][ii];
            if (piece.color == enemyColor) {

                if ((move.type == 'absolute' || move.type == 'takeMove') && !move.impotent) {
                    if(piece.x + move.x == me.x && piece.y + move.y == me.y){
                        toReturn =  true;
                    }
                }
                else if (move.type == 'blockable' && !move.impotent) {
                    if (move.repeat) {
                        const limit = move.limit || 100;
                        const offsetX = move.offsetX || 0;
                        const offsetY = move.offsetY || 0;
                        if(blockableCheck(state, move.x, move.y, piece.x + offsetX, piece.y + offsetY, move, limit, me,'rokado') == 'block'){
                            toReturn = true;
                        }
                    }
                }
            }
        }
    }

    return toReturn

}


function isRoadAttacked(state,enemyColor,pointOne,pointTwo){
    let direction = false;
    let checker = false;
    let actor = pointOne

    let myColor = 'white';
    if(enemyColor == 'white'){
        myColor = 'black'
    }
    
    if(pointOne.x > pointTwo.x){
        direction = true;
    }
    let distance = 0;

    if(direction){
        distance = pointOne.x - pointTwo.x;
    }
    else{
        distance = pointTwo.x - pointOne.x;
        actor = pointTwo
    }
    for(let c = distance-1; c > 0; c--){
        if(areYouCheckedWithoutTempMoves(state,enemyColor,{x:actor.x-c,y:actor.y,color:myColor}, 'rokado')){
            checker = true;
        }

    }
    return checker;
}

function pieceFromSquare(square, pieces) {
    const piece = pieces.find((p) => {
        return square.x === p.x && square.y === p.y;
    })  

    return piece;
}

function     blockableCheck(state, powerX, powerY, x, y, move, limit,myPiece, flag,counter) {
    let toReturn;
    let missedSquareX = move.missedSquareX;
    let missedSquareY = move.missedSquareY
    if (limit === 0) {
        return;
    }
    const square = state.board.find((el) => {
        return el.x === x + powerX && el.y === y + powerY;
    }) // Find a square for x/y
    if (!square) {
        return;
    }// If such a square does not exist return undefined
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

    if(!move.missedSquareX){
        missedSquareX = 0;
    }
    if(!move.missedSquareY){
        missedSquareY = 0;
    }

    const secondPiece = state.pieces[findPieceByXY(state.pieces,x+powerX, y + powerY)] // The piece on the attacked square
    //Find the direction in which we are going
    if (!secondPiece && !(x+powerX == myPiece.x && y+powerY == myPiece.y)) {
        //If there is  no such piece continue
        return blockableCheck(state, powerX+directionX+missedSquareX, powerY+directionY+missedSquareY, x, y, move, limit - 1, myPiece,flag,counter+1)
    }
    else{
        if(secondPiece){
            if(secondPiece.x == myPiece.x && secondPiece.y == myPiece.y){
                toReturn = 'block';
                return 'block'
            }
        }
        else{
            if(x+powerX == myPiece.x && y+powerY == myPiece.y){
                toReturn = 'block'
                return 'block'
            }
        }

    }
    return toReturn
}
try{
    module.exports = {
        findCopyPieceByXY,
        findCopySquareByXY,
        findPieceByXY,
        findSquareByXY,
        checkEmptyHorizontalBetween,
        giveOppositeColor,
        areYouChecked,
        areYouCheckedWithoutTempMoves,
        isRoadAttacked,
        pieceFromSquare,
        blockableCheck
    }
}
catch(err){

}