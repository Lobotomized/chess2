importScripts('/pieceDefinitions.js')
let globalPosValue = 0.1//Math.random();


function giveOppositeColor(color){
    if(color == 'white'){
        return 'black'
    }
    else if(color == 'black'){
        return 'white'
    }
}


const AIProps = {
    state:undefined,
    color:'white'
 }
 
 let pieceToValue = {
     
 }

 let JSONfn;
if (!JSONfn) {
    JSONfn = {};
}
function findCopyPieceByXY(pieces,x,y){
    return pieces.find((piece) => {
        return piece .x == x && piece.y == y;
    })
}

JSONfn.stringify = function(obj) {
    return JSON.stringify(obj,function(key, value){
            return (typeof value === 'function' ) ? value.toString() : value;
        });
}

JSONfn.parse = function(str) {
    return JSON.parse(str,function(key, value){
        if(typeof value != 'string') return value;
        return ( value.substring(0,8) == 'function') ? eval('('+value+')') : value;
    });
}
 
function evaluateBoard(colorPerspective, pieces, state){
    let counter = 0;
    let valueTransformer = 1;
    let valueCounter = 0;
    const board = state.board;

    while(pieces.length > counter){
        const piece = pieces[counter]
        if(colorPerspective === piece.color){
            lightBoardFE(piece,{pieces:pieces, board:board, turn:piece.color},'allowedMove')
            const filtered = board.filter((square) => {
                return square['allowedMove']
            })
            let magnifier = filtered.length * globalPosValue*piece.posValue;
            valueTransformer = piece.value ? piece.value + magnifier : 1 + magnifier;
            // let safety = safetyValue(piece.color,pieces,board);
            // valueTransformer += safety*100;
        }
        else{
            lightBoardFE(piece,{pieces:pieces, board:board, turn:piece.color},'allowedMove')
            const filtered = board.filter((square) => {
                return square['allowedMove']
            })
            let magnifier = filtered.length * globalPosValue*piece.posValue;
            valueTransformer = piece.value ? piece.value* -1 - magnifier : -1 - magnifier;
            // let safety = safetyValue(piece.color,pieces,board);
            // valueTransformer -= safety*100;
        }
        valueCounter += valueTransformer;
        counter++;
    }
    return valueCounter;
}

function safetyValue(colorPerspective, pieces,board){
    let valueToReturn = 0;
    let valuableEnemy= pieces.find((el)=> {
        return el.color != colorPerspective && el.value > 500;
    })
    if(valuableEnemy)
    {
        pieces.forEach((piece) => {
            if(piece.color != colorPerspective){
                lightBoardFE(piece,{pieces:pieces, board:board, turn:colorPerspective},'attackingValuableFake', 'attackingValuable')
            }
        })
        const filtered = board.filter((square) => {
            return square.attackingValuable;
        })
        filtered.forEach((square) => {
            if(square.x === valuableEnemy.x && square.y === valuableEnemy.y){
                valueToReturn+=1;
            }
        })
    }

    return valueToReturn;
}
 
function evaluateBoardDve(colorPerspective, pieces, state){
    let counter = 0;
    let valueTransformer = 1;
    let valueCounter = 0;
    const board = state.board;
    let valuableEnemy= pieces.find((el)=> {
        return el.color != state.color && el.value > 500;
    })
    while(pieces.length > counter){
        const piece = pieces[counter]
        lightBoardFE(piece,{pieces:pieces, board:board, turn:state.turn},'allowedMove')

        let attackValue = 0;

        const filtered = board.filter((square) => {
            return square['allowedMove']
        })
        
        let findSpecialSquare = filtered.find((square) => {
            return square.x === valuableEnemy.x && square.y === valuableEnemy.y && square['allowedMove']
        })
        if(findSpecialSquare){
            attackValue = 10000;
        }
         let magnifier = filtered.length * globalPosValue*piece.posValue;

        if(colorPerspective === piece.color){
            valueTransformer = piece.value ? piece.value + magnifier : 1 + magnifier +attackValue;
        }
        else{
            valueTransformer = piece.value ? piece.value* -1 - magnifier : -1 - magnifier - attackValue;
        }



        
        valueCounter += valueTransformer;


        counter++;
    }
    return valueCounter;
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
         lightBoardFE(piece,{pieces:state.pieces, board:state.board,turn:state.turn},'allowedMove')
       
         const allowedMoves = state.board.filter((square) => {
             return square.allowedMove;
         })
         while(allowedMoves.length > movesCounter){
             const newPieces = JSONfn.parse(JSONfn.stringify(state.pieces))
             let newMyPieces = getColorPieces(newPieces, color)
             piece = newMyPieces[piecesCounter];
 
 
             const square = allowedMoves[movesCounter]
             playerMove({x:square.x, y:square.y},{board:state.board, pieces:newPieces, pieceSelected:piece , turn:color},true, undefined, 'allowedMove')
 
 
             if( square && square.allowedMove){
                 movesAndPieces.push({pieceCounter:piecesCounter,pieces:newPieces, xClicked:square.x, yClicked:square.y})
             }
             movesCounter++
         }
         piecesCounter++
     }
     return movesAndPieces
 }


 function minimaxDve(state,maximizer, depth, removedTurns){
    const moves = generateMovesFromPieces(state,maximizer)
    let enemy = 'black';
    if(maximizer === 'black'){
        enemy = 'white';
    }
                
    let selectedMove = undefined;
    let badMoveResults= []
    let slizedMoves = moves //.slice(0,depth);
    let lowestBadMoveResult = -999999;

    slizedMoves.forEach((move, index) => {
        let isItBanned;
        if(removedTurns){
            isItBanned = removedTurns.find((removedTurn) => {
                return move.xClicked === removedTurn.xClicked && move.yClicked === removedTurn.yClicked && removedTurn.pieceCounter === move.pieceCounter
            })
        }
        
        if(isItBanned){
            return;
        }

        const badMoves = generateMovesFromPieces({board:state.board,pieces:move.pieces},enemy)
        let bestBadMove = {};
        let badMoveValue = 999999;
        let goodMoveResults = [];
        badMoves.forEach((badMove) => {
            let goodMoves = generateMovesFromPieces({board:state.board, pieces:badMove.pieces}, maximizer)
            let bestGoodMove = {};
            let goodMoveValue = 999999;
            goodMoves.forEach((goodMove) => {
                let thisValue = evaluateBoard(maximizer,goodMove.pieces, state)
                if(thisValue < goodMoveValue){
                    goodMoveValue = thisValue;
                    bestGoodMove = {moveCounter:index, value:goodMoveValue,pieces:badMove.pieces}
                }
            })
            goodMoveResults.push(bestGoodMove)
        })
        
        if(!badMoves.length){
            bestBadMove = {moveCounter:index, value:20,pieces:state.pieces};
        }
        
        goodMoveResults.forEach((goodMoveResult) => {
            if(goodMoveResult.value < badMoveValue){
                badMoveValue = goodMoveResult.value;
                bestBadMove = {moveCounter:goodMoveResult.moveCounter, value:badMoveValue};
            }
        })

        
        badMoveResults.push(bestBadMove)
    })
    badMoveResults.forEach((badMoveResult) => {
        if(badMoveResult.value > lowestBadMoveResult ){
            lowestBadMoveResult = badMoveResult.value;
            selectedMove = {moveCounter:badMoveResult.moveCounter, value:lowestBadMoveResult};
        }
    })

    return moves[selectedMove.moveCounter];

}

 function minimax(state,maximizer, depth, removedTurns){    
    const moves = generateMovesFromPieces(state,maximizer)
    let enemy = 'black';
    if(maximizer === 'black'){
        enemy = 'white';
    }
                
    let selectedMove = undefined;
    let badMoveResults= []
    let slizedMoves = moves //.slice(0,depth);
    let lowestBadMoveResult = 999999;

    slizedMoves.forEach((move, index) => {
        let isItBanned;
        if(removedTurns){
            isItBanned = removedTurns.find((removedTurn) => {
                return move.xClicked === removedTurn.xClicked && move.yClicked === removedTurn.yClicked && removedTurn.pieceCounter === move.pieceCounter
            })
        }
        
        if(isItBanned){
            return;
        }

        const badMoves = generateMovesFromPieces({board:state.board,pieces:move.pieces},enemy)
        let bestBadMove = {};
        let badMoveValue = -999999;
        badMoves.forEach((badMove) => {

            let thisValue = evaluateBoard(enemy,badMove.pieces, state)
            if(thisValue > badMoveValue){
                badMoveValue = thisValue;
                bestBadMove = {moveCounter:index, value:badMoveValue,pieces:badMove.pieces}
            }
        })
        if(!badMoves.length){
            bestBadMove = {moveCounter:index, value:-20,pieces:state.pieces};
        }
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


function minimaxKing(state,maximizer, depth, removedTurns){
    if(state.pieces.length > 5){
        return minimax(state,maximizer, depth, removedTurns);
    }
    else{
        return minimaxDve(state,maximizer, depth, removedTurns);
    }
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
        if(typeof piece.conditionalMoves === 'string'){
            let midObj = {conditionalMoves:piece.conditionalMoves}
           piece.conditionalMoves = JSONfn.parse(JSONfn.stringify(midObj)).conditionalMoves;
           tempMoves =  piece.conditionalMoves(state)
        }

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
                    let checkForEnemies = innerPiece.color != piece.color && !move.friendlyPieces;
                    let checkForFriends = innerPiece.color === piece.color && move.friendlyPieces;
                    if ((checkForEnemies || checkForFriends) && !move.impotent) {
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
                    let checkForEnemies = innerPiece.color != piece.color && !move.friendlyPieces;
                    let checkForFriends = innerPiece.color === piece.color && move.friendlyPieces;
                    if ((checkForEnemies || checkForFriends) && !move.impotent) {
                        square[flag] = true;
                    }
                }
            }
        }
        else if (move.type == 'blockable') {
            if (move.repeat) {
                const limit = move.limit || 100;
                const offsetX = move.offsetX || 0;
                const offsetY = move.offsetY || 0;
                blockableSpecialFunction(state, move.x, move.y, piece.x + offsetX, piece.y + offsetY, move, limit, flag,blockedFlag, move.missedSquareX, move.missedSquareY);
            }
        }
    })
}

function blockableSpecialFunction(state, powerX, powerY, x, y, move, limit, flag,secondFlag,missedSquareX,missedSquareY) {
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


    
    if(!missedSquareX){
        missedSquareX = 0;
    }

    if(!missedSquareY){
        missedSquareY = 0;
    }
    
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
        blockableSpecialFunction(state, powerX + directionX + missedSquareX, powerY + directionY + missedSquareY, x, y, move, limit - 1, flag,secondFlag,missedSquareX,missedSquareY)
    }
    else if (((state.turn != piece.color && !move.friendlyPieces) || (state.turn === piece.color && move.friendlyPieces)) && !move.impotent) {
        let selectedPiece = pieceFromXY(x,y,state.pieces)
        square[flag] = true;

        if(selectedPiece){
            if(selectedPiece.color == piece.color){
                square[secondFlag] = true;
                square[flag] = false;

            }
        }
        
        blockableSpecialFunction(state, powerX + directionX + missedSquareX, powerY + directionY + missedSquareY, x, y, move, limit - 1, secondFlag,secondFlag,missedSquareX,missedSquareY)
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

        if(state.pieces[i].friendlyPieceInteraction){
            if(state.pieces[i].friendlyPieceInteraction(state, friendlyPiece, {x:oldX, y:oldY})){
                if(friendlyPiece){
                    friendlyPiece.x = friendlyPieceOldX;
                    friendlyPiece.y = friendlyPieceOldY;
                }
                continueTurn = false;
            }    
        }

    }
    if(!continueTurn){
        state = oldState;
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
    if(!obj.state.won){
        let move = minimaxKing(obj.state,obj.color,obj.depth, obj.removedTurns)
        move.removedTurns = obj.removedTurns;

        postMessage(JSONfn.stringify(move))
    }
})



function blockableCheck(state, powerX, powerY, x, y, move, limit,myPiece, flag) {
    let toReturn;
    let missedSquareX = move.missedSquareX;
    let missedSquareY = move.missedSquareY;
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
        return blockableCheck(state, powerX+directionX + missedSquareX, powerY+directionY + missedSquareY, x, y, move, limit - 1, myPiece,flag)
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

function findPieceByXY(pieces,x,y){
    let index =  pieces.findIndex((piece) => {
         return piece .x == x && piece.y == y;
     })
     return index
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