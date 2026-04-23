


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
                if (!(magObj.options && magObj.options.onlyForEnemy)) {
                    magnifier += magObj.method(piece, pieces, board, piece.color, magObj.options);
                }
            } else {
                if (!(magObj.options && magObj.options.onlyForMe)) {
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
             
             // Safer Optimization:
             // Clone the array structure, but ONLY clone the move objects if they are NOT the standard prototype moves.
             // Most moves are static. But here they are on the instance.
             
             // Let's stick to the array loop but optimize the property access.
             const pLen = state.pieces.length;
             for(let k=0; k<pLen; k++){
                let p = state.pieces[k];
                // Shallow copy piece object
                let newP = {
                    icon: p.icon,
                    name: p.name,
                    id: p.id,
                    initialX: p.initialX,
                    initialY: p.initialY,
                    customDef: p.customDef,
                    moves: p.moves, // Reference for now
                    specialMoves: p.specialMoves,
                    weakMoves: p.weakMoves, // Reference for now
                    x: p.x,
                    y: p.y,
                    color: p.color,
                    value: p.value,
                    posValue: p.posValue,
                    // Copy other props if they exist
                    moved: p.moved,
                    enPassantMove: p.enPassantMove,
                    direction: p.direction,
                    // Copy methods (references)
                    conditionalMoves: p.conditionalMoves,
                    afterPieceMove: p.afterPieceMove,
                    afterThisPieceTaken: p.afterThisPieceTaken,
                    friendlyPieceInteraction: p.friendlyPieceInteraction,
                    afterEnemyPieceTaken: p.afterEnemyPieceTaken,
                    afterPlayerMove: p.afterPlayerMove,
                    afterEnemyPlayerMove: p.afterEnemyPlayerMove,
                    // Ensure tracking properties for dynamic pieces are cloned
                    initialX: p.initialX,
                    initialY: p.initialY,
                    id: p.id,
                    customDef: p.customDef
                };

                if(p.moves){
                    const mLen = p.moves.length;
                    const newMoves = new Array(mLen);
                    for(let m=0; m<mLen; m++){
                        const move = p.moves[m];
                        newMoves[m] = (move && typeof move === 'object') ? {...move} : move;
                    }
                    newP.moves = newMoves;
                }
                
                if(p.weakMoves){
                    const wLen = p.weakMoves.length;
                    const newWeakMoves = new Array(wLen);
                    for(let m=0; m<wLen; m++){
                        const move = p.weakMoves[m];
                        newWeakMoves[m] = (move && typeof move === 'object') ? {...move} : move;
                    }
                    newP.weakMoves = newWeakMoves;
                }
                
                newPieces[k] = newP;
             }

             let newPiece = newPieces[i];
             const square = allowedMoves[movesCounter]
             
             let tempState = {board:state.board, pieces:newPieces, pieceSelected:newPiece , turn:color};
             if(playerMove({x:square.x, y:square.y},tempState,true, undefined, 'allowedMove')){
                 let won = tempState.won;
                 movesAndPieces.push({pieceCounter:piecesCounter,pieces:newPieces, xClicked:square.x, yClicked:square.y, parent:state.id, id:crypto.randomUUID(), won:won})
             }
         }
         piecesCounter++;
     }
     
     if(movesAndPieces.length  === 0 && filters && filters.length > 0){
        return generateMovesFromPieces(state,color)
     }
     
     return movesAndPieces
 }

 function generateMovesFromPiecesAlphaBeta(state,color, filters,enemy){
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
         let saveMove =  false 
         
         if(allowedMoves.length > 0){
            saveMove = allowedMoves[Math.floor(Math.random() * allowedMoves.length)]
         }
         // Apply filters early if possible
         if (filters.length > 0) {
             for (let f = 0; f < filters.length; f++) {
                 let options = filters[f].options || {};
                 options.allowedMoves = allowedMoves;
                 options.piece = piece;
                 options.color = color;
                 options.state = state;
                 allowedMoves = filters[f].method(options);
             }
         }
         // If no moves are allowed after filtering, return array with 1 random move
         if (allowedMoves.length === 0 && filters.length > 0 && saveMove) {
             // Pick one random move from the board as a fallback move
             allowedMoves = [saveMove]
         }
         // Using for loop for speed
         for(let movesCounter = 0; movesCounter < allowedMoves.length; movesCounter++){
             const newPieces = new Array(state.pieces.length);
             
             // Safer Optimization:
             // Clone the array structure, but ONLY clone the move objects if they are NOT the standard prototype moves.
             // Most moves are static. But here they are on the instance.
             
             // Let's stick to the array loop but optimize the property access.
             const pLen = state.pieces.length;
             for(let k=0; k<pLen; k++){
                let p = state.pieces[k];
                // Shallow copy piece object
                let newP = {
                    icon: p.icon,
                    name: p.name,
                    id: p.id,
                    initialX: p.initialX,
                    initialY: p.initialY,
                    customDef: p.customDef,
                    moves: p.moves, // Reference for now
                    specialMoves: p.specialMoves,
                    weakMoves: p.weakMoves, // Reference for now
                    x: p.x,
                    y: p.y,
                    color: p.color,
                    value: p.value,
                    posValue: p.posValue,
                    // Copy other props if they exist
                    moved: p.moved,
                    enPassantMove: p.enPassantMove,
                    direction: p.direction,
                    // Copy methods (references)
                    conditionalMoves: p.conditionalMoves,
                    afterPieceMove: p.afterPieceMove,
                    afterThisPieceTaken: p.afterThisPieceTaken,
                    friendlyPieceInteraction: p.friendlyPieceInteraction,
                    afterEnemyPieceTaken: p.afterEnemyPieceTaken,
                    afterPlayerMove: p.afterPlayerMove,
                    afterEnemyPlayerMove: p.afterEnemyPlayerMove,
                    // Ensure tracking properties for dynamic pieces are cloned
                    initialX: p.initialX,
                    initialY: p.initialY,
                    id: p.id,
                    customDef: p.customDef
                };

                // Deep copy moves/weakMoves arrays to prevent mutation leaks ONLY for the piece moving
                // because playerMove might modify its moves (like pawns).
                // Or if it's interacting with another piece, we might need it.
                // Doing this for all pieces is too slow.
                if (k === i) {
                    if(p.moves){
                        const mLen = p.moves.length;
                        const newMoves = new Array(mLen);
                        for(let m=0; m<mLen; m++){
                            const move = p.moves[m];
                            newMoves[m] = (move && typeof move === 'object') ? {...move} : move;
                        }
                        newP.moves = newMoves;
                    }
                    
                    if(p.weakMoves){
                        const wLen = p.weakMoves.length;
                        const newWeakMoves = new Array(wLen);
                        for(let m=0; m<wLen; m++){
                            const move = p.weakMoves[m];
                            newWeakMoves[m] = (move && typeof move === 'object') ? {...move} : move;
                        }
                        newP.weakMoves = newWeakMoves;
                    }
                }
                newPieces[k] = newP;
             }

             let newPiece = newPieces[i];
             const square = allowedMoves[movesCounter]
             
             let tempState = {board:state.board, pieces:newPieces, pieceSelected:newPiece , turn:color};
             if(playerMove({x:square.x, y:square.y},tempState,true, undefined, 'allowedMove')){
                 let won = tempState.won;
                 movesAndPieces.push({pieceCounter:piecesCounter,pieces:newPieces, xClicked:square.x, yClicked:square.y, parent:state.id, id:crypto.randomUUID(), won:won})
             }
         }
         piecesCounter++;
     }
     // If we applied filters early, we don't need this fallback check which calls it again without filters
     return movesAndPieces
 }


 function generateMovesFromMoves(moves, color,board,filters,enemy){
    let childMoves = [];
    moves.forEach((move) => {
        if(move.won){
            return;
        }
        childMoves.push(...generateMovesFromPieces({pieces:move.pieces,board,turn:color, id:move.id},color,filters,enemy))
    })
    return childMoves
 }


 function evalMoves(moves,colorPerspective,board,magnifierMethods){
    moves.forEach((move) =>{
        move.value = evaluateBoard(colorPerspective,move.pieces,board,magnifierMethods);
    })
 }

 function evalParents(parentArray, childArray, weakest, maximizerColor) {
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
        
        if(parentMove.won){
            if(parentMove.won === maximizerColor){
                parentMove.value = 9999999999999999999;
            }
            else{
                parentMove.value = -9999999999999999999;
            }
            continue;
        }

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