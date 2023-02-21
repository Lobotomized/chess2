importScripts('/pieceDefinitions.js')
importScripts('/helperFunctions.js')
importScripts('/moveMethods.js')

importScripts('/src/jsonfn.js')

let globalPosValue = 0.1//Math.random();


function evaluationMagnifierMaxOptions(piece,state,colorPerspective){
    lightBoardFE(piece,{pieces:pieces, board:board, turn:piece.color},'allowedMove',undefined,true)
    const filtered = board.filter((square) => {
        return square['allowedMove']
    })
    return filtered.length * globalPosValue*piece.posValue;
}


function evaluateBoard(colorPerspective, pieces, state,simple){
    let counter = 0;
    let valueTransformer = 1;
    let valueCounter = 0;
    const board = state.board;

    while(pieces.length > counter){
        const piece = pieces[counter]
        if(colorPerspective === piece.color){
            let magnifier = 0;
            if(!simple){
                lightBoardFE(piece,{pieces:pieces, board:board, turn:piece.color},'allowedMove',undefined,true)
                const filtered = board.filter((square) => {
                    return square['allowedMove']
                })
                magnifier = filtered.length * globalPosValue*piece.posValue;
            }

            valueTransformer = piece.value ? piece.value + magnifier : 1 + magnifier;
            // let safety = safetyValue(piece.color,pieces,board);
            // valueTransformer += safety*100;
        }
        else{
            let magnifier = 0;
            if(!simple){
                lightBoardFE(piece,{pieces:pieces, board:board, turn:piece.color},'allowedMove',undefined,true)
                const filtered = board.filter((square) => {
                    return square['allowedMove']
                })
                magnifier = filtered.length * globalPosValue*piece.posValue;
            }

            valueTransformer = piece.value? piece.value* -1 - magnifier : -1 - magnifier;
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
                lightBoardFE(piece,{pieces:pieces, board:board, turn:colorPerspective},'attackingValuableFake', 'attackingValuable',undefined,true)
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
        lightBoardFE(piece,{pieces:pieces, board:board, turn:state.turn},'allowedMove',undefined,true)

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

 
 function generateMovesFromPieces(state,color){
     const movesAndPieces = []
     color = color ? color : getColorPieces.color;
     let piecesCounter = 0;
     const myPieces = !color ?state.pieces : getColorPieces(state.pieces,color) //getColorPieces(state.pieces,   color);
     while(myPieces.length > piecesCounter){
         let movesCounter = 0;
         let piece = myPieces[piecesCounter]
         lightBoardFE(piece,{pieces:state.pieces, board:state.board,turn:state.turn},'allowedMove',undefined,true)
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
    let slizedMoves = moves.slice(0,depth);
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
            // console.log(badMoves,enemy, '  wtf?!')

            let thisValue = evaluateBoard(enemy,badMove.pieces, state,false)
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
    // console.log(moves[selectedMove.moveCounter], )
    return moves[selectedMove.moveCounter];

}



function minimaxKing(state,maximizer, depth, removedTurns){
    if(state.pieces.length > 8){
        return minimax(state,maximizer, depth, removedTurns);
    }
    else{
        return minimaxDve(state,maximizer, depth, removedTurns);
    }
}


self.addEventListener("message", function(e) {
    let obj = JSON.parse(e.data)
    if(!obj.state.won){
        //generateMovesFromPieces(obj.state,'black')
            console.time('minimax')
            //generateMovesFromPieces(obj.state,'black')
            let move = minimaxKing(obj.state,obj.color,obj.depth, obj.removedTurns)
            console.timeEnd('minimax');

            move.removedTurns = obj.removedTurns;
            console.time('postMessage')
            postMessage(JSONfn.stringify(move))
            console.timeEnd('postMessage')

    }
})


