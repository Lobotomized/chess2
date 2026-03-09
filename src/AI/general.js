


 function evaluateBoard(colorPerspective, pieces, board, magnifierMethods) {
    let valueCounter = 0;
    const len = pieces.length;
    const magLen = magnifierMethods.length;
    
    for (let i = 0; i < len; i++) {
        const piece = pieces[i];
        let magnifier = 0;
        
        // Unroll/Optimize loop over magnifiers
        for (let j = 0; j < magLen; j++) {
            const magObj = magnifierMethods[j];
            if (colorPerspective === piece.color) {
                if (!magObj.onlyForEnemy) {
                    magnifier += magObj.method(piece, pieces, board, piece.color, magObj.options);
                }
            } else {
                if (!magObj.onlyForMe) {
                    magnifier += magObj.method(piece, pieces, board, piece.color, magObj.options);
                }
            }
        }

        if (colorPerspective === piece.color) {
            valueCounter += magnifier;
        } else {
            valueCounter -= magnifier;
        }
    }
    return valueCounter;
}


 
 function generateMovesFromPieces(state,color, filters,enemy){
    if(!filters){
        filters = [];
    }
     const movesAndPieces = []
     
     // Removed redundant getColorPieces call since we iterate directly now
     let piecesCounter = 0;
     for(let i = 0; i < state.pieces.length; i++){
         let piece = state.pieces[i];
         if(piece.color !== color) continue;

         lightBoardFE(piece,{pieces:state.pieces, board:state.board,turn:state.turn},'allowedMove',undefined,true)
         let allowedMoves = state.board.filter((square) => {
             return square.allowedMove;
         })
         
         // Using for loop for speed
         for(let movesCounter = 0; movesCounter < allowedMoves.length; movesCounter++){
             const newPieces = new Array(state.pieces.length);
             for(let k=0; k<state.pieces.length; k++){
                let p = state.pieces[k];
                let moves = p.moves;
                let weakMoves = p.weakMoves;
                
                // Optimized copy of moves
                if(moves){
                    let newMoves = new Array(moves.length);
                    for(let m=0; m<moves.length; m++){
                        let move = moves[m];
                        if(typeof move === 'object' && move !== null){
                             newMoves[m] = {...move};
                        } else {
                            newMoves[m] = move;
                        }
                    }
                    moves = newMoves;
                }
                
                if(weakMoves){
                    let newWeakMoves = new Array(weakMoves.length);
                    for(let m=0; m<weakMoves.length; m++){
                        let move = weakMoves[m];
                        if(typeof move === 'object' && move !== null){
                             newWeakMoves[m] = {...move};
                        } else {
                            newWeakMoves[m] = move;
                        }
                    }
                    weakMoves = newWeakMoves;
                }
                newPieces[k] = {...p, moves:moves, weakMoves:weakMoves};
             }

             let newPiece = newPieces[i];
             const square = allowedMoves[movesCounter]
             
             // We use state.board directly (no clone) as playerMove cleans up lights anyway
             // and we reconstruct the state wrapper for each move
             if(playerMove({x:square.x, y:square.y},{board:state.board, pieces:newPieces, pieceSelected:newPiece , turn:color},true, undefined, 'allowedMove')){
                 movesAndPieces.push({pieceCounter:piecesCounter,pieces:newPieces, xClicked:square.x, yClicked:square.y, parent:state.id, id:crypto.randomUUID()})
             }
         }
         piecesCounter++;
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

 function evalParents(parentArray, childArray, weakest) {
    // Optimization: Pre-group child moves by parent ID to avoid nested loops (O(N*M) -> O(N+M))
    const childrenByParent = new Map();
    const cLen = childArray.length;
    for(let i = 0; i < cLen; i++) {
        const child = childArray[i];
        // Optimized Map access: get array directly or create
        let arr = childrenByParent.get(child.parent);
        if (!arr) {
            arr = [];
            childrenByParent.set(child.parent, arr);
        }
        arr.push(child);
    }

    const pLen = parentArray.length;
    for(let i = 0; i < pLen; i++) {
        const parentMove = parentArray[i];
        const children = childrenByParent.get(parentMove.id);

        if (children) {
            const chLen = children.length;
            for(let j = 0; j < chLen; j++) {
                const chMove = children[j];
                // Simplified comparison logic
                if (parentMove.value === undefined) {
                    parentMove.value = chMove.value;
                } else if (!weakest && chMove.value > parentMove.value) {
                    parentMove.value = chMove.value;
                } else if (weakest && chMove.value < parentMove.value) {
                    parentMove.value = chMove.value;
                }
            }
        }
        
        if (parentMove.value === undefined) {
             parentMove.value = weakest ? 9999999999999999999 : -9999999999999999999;
        }
    }
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