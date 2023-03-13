


function evaluateBoard(colorPerspective, pieces, board,magnifierMethods){
    let counter = 0;
    let valueTransformer = 1;
    let valueCounter = 0;
    while(pieces.length > counter){
        const piece = pieces[counter]
        if(colorPerspective === piece.color){
            let magnifier = 0;
            magnifierMethods.forEach((magnifierObject) => {

                if(!magnifierObject.onlyForEnemy){

                    magnifier += magnifierObject.method(piece,pieces,board,piece.color,magnifierObject.options);
                }
            })

            valueTransformer = magnifier;
        }
        else{
            let magnifier = 0;

            magnifierMethods.forEach((magnifierObject) => {
                if(!magnifierObject.onlyForMe){
                    magnifier += magnifierObject.method(piece,pieces,board,piece.color,magnifierObject.options);
                }
            })

            valueTransformer = magnifier*-1;
        }
        valueCounter += valueTransformer;
        counter++;
    }
    return valueCounter;
}


 
 function generateMovesFromPieces(state,color, filters,enemy){
    if(!filters){
        filters = [];
    }
     const movesAndPieces = []
     let piecesCounter = 0;
     const myPieces = getColorPieces(state.pieces,color) 
     

     while(myPieces.length > piecesCounter){
         let movesCounter = 0;
         let piece = myPieces[piecesCounter]
         lightBoardFE(piece,{pieces:state.pieces, board:state.board,turn:state.turn},'allowedMove',undefined,true)
         let allowedMoves = state.board.filter((square) => {
             return square.allowedMove;
         })
         filters.forEach((filter) => {
            if(!enemy || filter.allowEnemy){
                allowedMoves = filter.method({
                    state,allowedMoves,myPieces,piecesCounter,piece,color,...filter.options
                })
            }
         })
         while(allowedMoves.length > movesCounter){
             const newPieces = JSONfn.parse(JSONfn.stringify(state.pieces))
             let newMyPieces = getColorPieces(newPieces, color)
             piece = newMyPieces[piecesCounter];
 
 
             const square = allowedMoves[movesCounter]
             playerMove({x:square.x, y:square.y},{board:state.board, pieces:newPieces, pieceSelected:piece , turn:color},true, undefined, 'allowedMove')
 
 
             if( square && square.allowedMove){
                 movesAndPieces.push({pieceCounter:piecesCounter,pieces:newPieces, xClicked:square.x, yClicked:square.y, parent:state.id, id:crypto.randomUUID()})
             }
             movesCounter++
         }
         piecesCounter++
     }
     if(movesAndPieces.length  === 0 && filters && filters.length > 0){
        return generateMovesFromPieces(state,color)
     }
     return movesAndPieces
 }


 function generateMovesFromMoves(moves, color,board,filters,enemy){
    let childMoves = [];
    moves.forEach((move) => {
        childMoves.push(...generateMovesFromPieces({pieces:move.pieces,board,turn:color, id:move.id},color,filters,enemy))
    })
    return childMoves
 }


 function evalMoves(moves,colorPerspective,board,magnifierMethods){
    moves.forEach((move) =>{
        move.value = evaluateBoard(colorPerspective,move.pieces,board,magnifierMethods);
    })
 }

 function evalParents(parentArray,childArray, weakest){
    parentArray.forEach((parentMove) => {

        childArray.forEach((chMove) => {
            if(chMove.parent === parentMove.id){
                if(parentMove.value === undefined || 
                    (parentMove.value < chMove.value && !weakest)   ||
                    (parentMove.value > chMove.value && weakest)  
                ){
                    parentMove.value = chMove.value;
                }
            }
        })
        if(parentMove.value === undefined && !weakest){
            parentMove.value = -99999;
        }
        else if(parentMove.value === undefined && weakest){
            parentMove.value = 999999;
        }

    })
 }

 function getMoveByValue(moves,weakest){
    if(!moves.length){
        return undefined
    }
    return moves.reduce((max, move) => {
        if(max.value > move.value && !weakest){
            return max;
        }
        else{
            return move;
        }
    });
 }

 function getEnemy(maximizer){
    let enemy = 'black';
    if(maximizer === 'black'){
        enemy = 'white';
    }
    return enemy;
 }