importScripts('/src/jsonfn.js')
importScripts('/helperFunctions.js')
importScripts('/moveMethods.js')

importScripts('/pieces/classic.js')
importScripts('/pieces/bugs.js')
importScripts('/pieces/animals.js')
importScripts('/pieces/cats.js')
importScripts('/pieces/medieval.js')
importScripts('/pieces/machines.js')
importScripts('/pieces/rogueLike.js')
importScripts('/pieces/misc.js')

importScripts('/src/AI/general.js')

importScripts('/src/AI/magnifiers.js')
importScripts('/src/AI/filters.js')


function minimaxDeep(state,maximizer, depth, removedTurns,magnifiers,filters){

    state.id = crypto.randomUUID()
    let enemy = getEnemy(maximizer);
    let firstGen = generateMovesFromPieces(state,maximizer,filters);

    if(removedTurns && removedTurns.length){
        firstGen = firstGen.filter((fgm) => {
            let findSame = removedTurns.find((rtm) => {
                return !(fgm.xClicked === rtm.xClicked && fgm.yClicked === rtm.yClicked && rtm.pieceCounter === fgm.pieceCounter)
            })
            return findSame !== undefined;
        })
    }
    if(depth === 2){

        const secondGen = generateMovesFromMoves(firstGen, enemy,state.board,filters, true);
    
        evalMoves(secondGen,maximizer,state.board,magnifiers);
        evalParents(firstGen,secondGen,true, maximizer);
        return getMoveByValue(firstGen)
    }
    else if(depth === 3){
        const secondGen = generateMovesFromMoves(firstGen, enemy,state.board,filters, true);
        const thirdGen = generateMovesFromMoves(secondGen, maximizer,state.board,filters);
        evalMoves(thirdGen,maximizer,state.board,magnifiers);
        evalParents(secondGen,thirdGen, false, maximizer);
        evalParents(firstGen,secondGen, true, maximizer);

        return getMoveByValue(firstGen)

    }

    else if(depth >= 4){
        const secondGen =generateMovesFromMoves(firstGen, enemy,state.board,filters, true);
        const thirdGen =generateMovesFromMoves(secondGen, maximizer,state.board,filters)
        const fourthGen = generateMovesFromMoves(thirdGen, enemy,state.board, filters, true);
        
        evalMoves(fourthGen,maximizer,state.board,defaultCharacter(0));
        evalParents(thirdGen, fourthGen,true, maximizer);
        evalParents(secondGen, thirdGen,false, maximizer);
        evalParents(firstGen,secondGen,true, maximizer);
    
        return getMoveByValue(firstGen)
    }
    else{
        evalMoves(firstGen,maximizer,state.board,magnifiers);
        firstGen.forEach(move => {
            if(move.won){
                if(move.won === maximizer){
                    move.value = 9999999999999999999;
                } else {
                    move.value = -9999999999999999999;
                }
            }
        });
        return getMoveByValue(firstGen)
    }
}

function alphaBeta(state, depth, alpha, beta, isMaximizer, maximizerColor, filters, magnifiers) {
    if (state.won) {
        return state.won === maximizerColor ? 9999999999999999999 : -9999999999999999999;
    }
    
    if (depth <= 0) {
        return evaluateBoard(maximizerColor, state.pieces, state.board, magnifiers);
    }
    
    let currentColor = isMaximizer ? maximizerColor : getEnemy(maximizerColor);
    let moves = generateMovesFromPiecesAlphaBeta(state, currentColor, filters);
    
    if (moves.length === 0) {
        return evaluateBoard(maximizerColor, state.pieces, state.board, magnifiers);
    }
    
    // Evaluate moves superficially for extremely fast sorting
    const len = moves.length;
    for (let i = 0; i < len; i++) {
        let m = moves[i];
        if (m.won) {
            m._score = isMaximizer ? 100000 : -100000;
            continue;
        }
        let score = 0;
        let pLen = m.pieces.length;
        for (let j = 0; j < pLen; j++) {
            let p = m.pieces[j];
            score += p.color === maximizerColor ? (p.value || 3) : -(p.value || 3);
        }
        m._score = score;
    }

    if (isMaximizer) {
        moves.sort((a, b) => b._score - a._score);
        let maxEval = -Infinity;
        for (let i = 0; i < len; i++) {
            let m = moves[i];
            let evalBoard = alphaBeta(
                { pieces: m.pieces, board: state.board, turn: getEnemy(currentColor), won: m.won },
                depth - 1, alpha, beta, false, maximizerColor, filters, magnifiers
            );
            if (evalBoard > maxEval) maxEval = evalBoard;
            if (evalBoard > alpha) alpha = evalBoard;
            if (beta <= alpha) break; // Beta cut-off
        }
        return maxEval;
    } else {
        moves.sort((a, b) => a._score - b._score);
        let minEval = Infinity;
        for (let i = 0; i < len; i++) {
            let m = moves[i];
            let evalBoard = alphaBeta(
                { pieces: m.pieces, board: state.board, turn: getEnemy(currentColor), won: m.won },
                depth - 1, alpha, beta, true, maximizerColor, filters, magnifiers
            );
            if (evalBoard < minEval) minEval = evalBoard;
            if (evalBoard < beta) beta = evalBoard;
            if (beta <= alpha) break; // Alpha cut-off
        }
        return minEval;
    }
}

function minimaxAlphaBeta(state, maximizer, depth, removedTurns, magnifiers, filters) {
    state.id = crypto.randomUUID();
    let enemy = getEnemy(maximizer);
    
    // Generate moves with early filtering
    let firstGen = generateMovesFromPiecesAlphaBeta(state, maximizer, filters);

    // Filter out removed turns if specified
    if (removedTurns && removedTurns.length) {
        const removedSet = new Set();
        const rtLen = removedTurns.length;
        for (let i = 0; i < rtLen; i++) {
            const rtm = removedTurns[i];
            removedSet.add(`${rtm.xClicked},${rtm.yClicked},${rtm.pieceCounter}`);
        }
        
        const filteredMoves = [];
        const fgLen = firstGen.length;
        for (let i = 0; i < fgLen; i++) {
            const fgm = firstGen[i];
            const key = `${fgm.xClicked},${fgm.yClicked},${fgm.pieceCounter}`;
            if (!removedSet.has(key)) {
                filteredMoves.push(fgm);
            }
        }
        firstGen = filteredMoves;
    }

    if (!firstGen || firstGen.length === 0) return undefined;

    // Fast initial evaluation and sorting - optimized version
    const len = firstGen.length;
    
    // Pre-allocate arrays for better performance
    const scores = new Array(len);
    const movesWithScores = new Array(len);
    
    for (let i = 0; i < len; i++) {
        let move = firstGen[i];
        
        // Immediate win detection
        if (move.won && move.won === maximizer) {
            move.value = 9999999999999999999;
            return move;
        }
        
        // Fast material evaluation
        let score = 0;
        const pieces = move.pieces;
        const pLen = pieces.length;
        
        for (let j = 0; j < pLen; j++) {
            const p = pieces[j];
            score += p.color === maximizer ? (p.value || 3) : -(p.value || 3);
        }
        
        // Add positional bonuses for better move ordering
        if (move.xClicked !== undefined && move.yClicked !== undefined) {
            // Center control bonus
            const centerDist = Math.abs(move.xClicked - 2.5) + Math.abs(move.yClicked - 2.5);
            score -= centerDist * 0.1;
        }
        
        scores[i] = score;
        movesWithScores[i] = {move, score};
    }
    
    // Sort moves by score (descending) for better alpha-beta pruning
    movesWithScores.sort((a, b) => b.score - a.score);
    
    // Reconstruct sorted moves array
    for (let i = 0; i < len; i++) {
        firstGen[i] = movesWithScores[i].move;
        firstGen[i]._score = movesWithScores[i].score;
    }

    let bestMove = undefined;
    let maxEval = -Infinity;
    let alpha = -Infinity;
    let beta = Infinity;

    // Alpha-beta search with optimized move ordering
    for (let i = 0; i < len; i++) {
        let move = firstGen[i];
        
        // Skip if this move cannot possibly improve our position (alpha-beta pruning)
        if (maxEval !== -Infinity && scores[i] < maxEval - 500) {
            continue;
        }
        
        let evalBoard = alphaBetaOptimized(
            { pieces: move.pieces, board: state.board, turn: enemy, won: move.won },
            depth - 1, alpha, beta, false, maximizer, filters, magnifiers
        );
        
        move.value = evalBoard;
        
        if (evalBoard > maxEval || bestMove === undefined) {
            maxEval = evalBoard;
            bestMove = move;
        }
        
        if (evalBoard > alpha) {
            alpha = evalBoard;
            
            // Beta cutoff - if we found a move that's too good for the opponent
            if (alpha >= beta) {
                break;
            }
        }
    }

    return bestMove;
}

// Ultra-optimized alpha-beta pruning function
 function alphaBetaOptimized(state, depth, alpha, beta, isMaximizer, maximizerColor, filters, magnifiers) {
     // Terminal node checks with immediate returns
     if (state.won) {
         return state.won === maximizerColor ? 9999999999999999999 : -9999999999999999999;
     }
     
     if (depth <= 0) {
         return evaluateBoardUltraFast(maximizerColor, state.pieces, state.board, magnifiers);
     }
     
     const currentColor = isMaximizer ? maximizerColor : getEnemy(maximizerColor);
     const moves = generateMovesFromPiecesAlphaBeta(state, currentColor, filters);
     
     if (moves.length === 0) {
         return evaluateBoardUltraFast(maximizerColor, state.pieces, state.board, magnifiers);
     }
     
     const len = moves.length;
     
     // Fast move evaluation with pre-allocated arrays
     const scores = new Array(len);
     
     for (let i = 0; i < len; i++) {
         const m = moves[i];
         if (m.won) {
             scores[i] = isMaximizer ? 100000 : -100000;
             continue;
         }
         
         let score = 0;
         const pieces = m.pieces;
         const pLen = pieces.length;
         
         // Unrolled loop for better performance
         for (let j = 0; j < pLen; j++) {
             const p = pieces[j];
             score += p.color === maximizerColor ? (p.value || 3) : -(p.value || 3);
         }
         scores[i] = score;
     }

     if (isMaximizer) {
         // Insertion sort for better performance on partially sorted arrays
         for (let i = 1; i < len; i++) {
             const currentScore = scores[i];
             const currentMove = moves[i];
             let j = i - 1;
             
             while (j >= 0 && scores[j] < currentScore) {
                 scores[j + 1] = scores[j];
                 moves[j + 1] = moves[j];
                 j--;
             }
             scores[j + 1] = currentScore;
             moves[j + 1] = currentMove;
         }
         
         let maxEval = -Infinity;
         
         for (let i = 0; i < len; i++) {
             const m = moves[i];
             const currentScore = scores[i];
             
             // Aggressive pruning: skip moves that can't possibly improve
             if (maxEval !== -Infinity && currentScore < maxEval - 500) {
                 continue;
             }
             
             const evalBoard = alphaBetaOptimized(
                 { pieces: m.pieces, board: state.board, turn: getEnemy(currentColor), won: m.won },
                 depth - 1, alpha, beta, false, maximizerColor, filters, magnifiers
             );
             
             if (evalBoard > maxEval) {
                 maxEval = evalBoard;
                 if (evalBoard > alpha) alpha = evalBoard;
             }
             
             // Early beta cutoff
             if (beta <= alpha) {
                 break;
             }
         }
         return maxEval;
     } else {
         // Insertion sort for minimizer (ascending order)
         for (let i = 1; i < len; i++) {
             const currentScore = scores[i];
             const currentMove = moves[i];
             let j = i - 1;
             
             while (j >= 0 && scores[j] > currentScore) {
                 scores[j + 1] = scores[j];
                 moves[j + 1] = moves[j];
                 j--;
             }
             scores[j + 1] = currentScore;
             moves[j + 1] = currentMove;
         }
         
         let minEval = Infinity;
         
         for (let i = 0; i < len; i++) {
             const m = moves[i];
             const currentScore = scores[i];
             
             // Aggressive pruning for minimizer
             if (minEval !== Infinity && currentScore > minEval + 500) {
                 continue;
             }
             
             const evalBoard = alphaBetaOptimized(
                 { pieces: m.pieces, board: state.board, turn: getEnemy(currentColor), won: m.won },
                 depth - 1, alpha, beta, true, maximizerColor, filters, magnifiers
             );
             
             if (evalBoard < minEval) {
                 minEval = evalBoard;
                 if (evalBoard < beta) beta = evalBoard;
             }
             
             // Early alpha cutoff
             if (beta <= alpha) {
                 break;
             }
         }
         return minEval;
     }
 }

// Ultra-fast evaluation function with maximum optimization
 function evaluateBoardUltraFast(colorPerspective, pieces, board, magnifierMethods) {
     let valueCounter = 0;
     const len = pieces.length;
     const magLen = magnifierMethods ? magnifierMethods.length : 0;
     
     // Pre-check for common case (no magnifiers)
     if (magLen === 0) {
         for (let i = 0; i < len; i++) {
             const piece = pieces[i];
             if (colorPerspective === piece.color) {
                 valueCounter += piece.value || 3;
             } else {
                 valueCounter -= piece.value || 3;
             }
         }
         return valueCounter;
     }
     
     // With magnifiers
     for (let i = 0; i < len; i++) {
         const piece = pieces[i];
         let magnifier = 0;
         
         // Optimized magnifier loop
         for (let j = 0; j < magLen; j++) {
             const magObj = magnifierMethods[j];
             const isFriendly = colorPerspective === piece.color;
             
             if (isFriendly && !magObj.onlyForEnemy) {
                 magnifier += magObj.method(piece, pieces, board, piece.color, magObj.options);
             } else if (!isFriendly && !magObj.onlyForMe) {
                 magnifier += magObj.method(piece, pieces, board, piece.color, magObj.options);
             }
         }

         if (colorPerspective === piece.color) {
             valueCounter += (piece.value || 3) + magnifier;
         } else {
             valueCounter -= (piece.value || 3) + magnifier;
         }
     }
     return valueCounter;
 }



self.addEventListener("message", function(e) {
    let obj = JSONfn.parse(e.data)
    if(!obj.state.won){

            let move;
            let methods = {
                undefined:defaultCharacter,
                defaultCharacter:defaultCharacter,
                offensiveCharacter:offensiveCharacter,
                defensiveCharacter:defensiveCharacter,
                positionalCharacter:positionalCharacter,
                positionalOffeniveCharacter:positionalOffensiveCharacter,
                noPosition:noPosition
            }
            obj.AIPower = parseInt(obj.AIPower)
            if(obj.AIPower === -1){
                if(obj.state.pieces.length > 20){
                    obj.AIPower = 1;
                }
                else if(obj.state.pieces.length > 13){
                    obj.AIPower = 3;
                }
                else if(obj.state.pieces.length > 8){
                    obj.AIPower = 4;
                }
                else{
                    obj.AIPower = 5;
                }
            }

            if(obj.AIPower === -5){
                move = minimaxDeep(obj.state,obj.color,3, obj.removedTurns,
                    [{method:evaluationMagnifierPiece, options:{pieceValue:1}}],
                    [
                        {method:removeNonAttackingMovesFilter, options:{maxPieceValue:2,
                        exceptions:[randomException,pieceValueMustBeSmallerThanException]}},
                        {method:randomlyRemove1NthFilter,options:{n:1.2,maxPieceValue:20, exceptions:[pieceValueMustBeSmallerThanException, pieceAttackedException]}}
                    ]
                )
            }

            if(obj.AIPower === -4){
                move = minimaxDeep(obj.state,obj.color,3, obj.removedTurns,
                    [{method:evaluationMagnifierPiece, options:{pieceValue:1}}],
                    [
                        {method:removeNonAttackingMovesFilter, options:{minPieceValue:20,
                        exceptions:[randomException, pieceValueMustBeSmallerThanException]}},
                        {method:randomlyRemove1NthFilter,options:{n:1.2,maxPieceValue:20, exceptions:[pieceValueMustBeSmallerThanException, pieceAttackedException]}}
                    ]
                )

            }


            if(obj.AIPower === -3){
                move = minimaxDeep(obj.state,obj.color,3, obj.removedTurns,
                    positionalCharacter(2),
                    [
                        // {method:removeNonAttackingMovesFilter, options:{minPieceValue:2,
                        // exceptions:[randomException]}},
                        // {method:randomlyRemove1NthFilter,options:{n:1.2,minPieceValue:4, exceptions:[pieceValueMustBeSmallerThanException, pieceAttackedException]}}
                    ]
                )

            }

            if(obj.AIPower === -2){
                move = minimaxDeep(obj.state,obj.color,2, obj.removedTurns,
                    methods[obj.AICharacter](0),
                    [
                        {method:removeNonAttackingMovesFilter, options:{maximum:2,minPieceValue:5, filterDepth:1,
                        exceptions:[pieceValueMustBeBiggerThanException]}},
                    ]
                )
            }
            if(obj.AIPower === 0){
                move = minimaxDeep(obj.state,obj.color,1, obj.removedTurns,methods[obj.AICharacter](0))
            }
            else if(obj.AIPower === 1){
                move = minimaxDeep(obj.state,obj.color,2, obj.removedTurns,
                    methods[obj.AICharacter](0),
                    [
                        {method:removeNonAttackingMovesFilter, options:{maximum:2,maxPieceValue:2,randomException:0.3, filterDepth:1,
                        exceptions:[pieceValueMustBeSmallerThanException,randomException]}},
                        {method:randomlyRemove1NthFilter,options:{n:1.2,maxPieceValue:4, exceptions:[pieceValueMustBeSmallerThanException, pieceAttackedException]}}
                    ]
                )
            }
            else if(obj.AIPower === 2){

                move = minimaxDeep(obj.state,obj.color,2, obj.removedTurns,
                    methods[obj.AICharacter](1),
                    [
                        {method:removeNonAttackingMovesFilter, options:{maximum:2,maxPieceValue:2,randomException:0.3, 
                        exceptions:[pieceValueMustBeSmallerThanException,randomException]}},
                        {method:randomlyRemove1NthFilter,options:{n:1.2,maxPieceValue:4, exceptions:[pieceValueMustBeSmallerThanException, pieceAttackedException]}}
                    ]
                )

            }
            else if(obj.AIPower === 3){
                move = minimaxDeep(obj.state,obj.color,2, obj.removedTurns,
                    methods[obj.AICharacter](0),
                    []
                )
            }
            else if(obj.AIPower === 4){
                move = minimaxDeep(obj.state,obj.color,2, obj.removedTurns,
                    methods[obj.AICharacter](1),
                    []
                )
            }
            else if(obj.AIPower === 5){

                move = minimaxDeep(obj.state,obj.color,3, obj.removedTurns,
                    methods[obj.AICharacter](0),
                    [
                        // {method:removeAttackedMovesFilter, options:{randomException:0.6,exceptions:[randomException]}},
                        // {method:removeNonAttackingMovesFilter, options:{randomException:0.5, 
                        //     exceptions:[pieceAttackedException,randomException]}},
                    ]
                )
            }
            else if(obj.AIPower === 6){
                move = minimaxDeep(obj.state,obj.color,4, obj.removedTurns,
                    [{method:evaluationMagnifierPiece, options:{pieceValue:1 }}],
                    
                    [
                        // {method:removeAttackedMovesFilter, options:{randomException:0.6,exceptions:[randomException]}},
                        // {method:removeNonAttackingMovesFilter, options:{randomException:0.5, 
                        //     exceptions:[pieceAttackedException,randomException]}},
                    ]
                )
            }
            if(obj.AIPower === 101){

                console.time('101')
                move = minimaxDeep(obj.state,obj.color,2, obj.removedTurns,
                    methods[obj.AICharacter](0),
                    [
                        {method:removeNonAttackingMovesFilter, options:{maximum:2,maxPieceValue:2,randomException:0.3, filterDepth:1,
                        exceptions:[pieceValueMustBeSmallerThanException,randomException]}},
                        {method:randomlyRemove1NthFilter,options:{n:1.2,minPieceValue:4, exceptions:[pieceValueMustBeBiggerThanException, pieceAttackedException]}}
                    ]
                )
                console.timeEnd('101')
            }

            else if(obj.AIPower === 102){
                console.time('102')
                move = minimaxDeep(obj.state,obj.color,3, obj.removedTurns,
                    methods[obj.AICharacter](0),
                    [
                        {method:removeNonAttackingMovesFilter, options:{maximum:2,maxPieceValue:2,randomException:0.3, filterDepth:1,
                        exceptions:[pieceValueMustBeSmallerThanException,randomException]}},
                        {method:randomlyRemove1NthFilter,options:{n:1.2,minPieceValue:4, exceptions:[pieceValueMustBeBiggerThanException, pieceAttackedException]}}
                    ]
                )
                console.timeEnd('102')
            }
            else if(obj.AIPower === 103){
                console.time('103')
                move = minimaxDeep(obj.state,obj.color,3, obj.removedTurns,
                    methods[obj.AICharacter](0),
                    [
                    ]
                )
                console.timeEnd('103')
            }
            else if(obj.AIPower === 104){
                console.time('104')
                let depth = 2;
                if(obj.state.pieces.length < 8){
                    depth = 4;
                }
                else if(obj.state.pieces.length < 16){
                    depth = 3;
                }

                move = minimaxDeep(obj.state,obj.color,depth, obj.removedTurns,
                    methods[obj.AICharacter](0),
                    []
                )
                console.timeEnd('104')
            }

            else if(obj.AIPower === 105){
                console.time('105')
                let character = methods[obj.AICharacter];
                if(!obj.AICharacter){
                    character = rogueLikeCharacter;
                }
                let depth = 2;
                if(obj.state.pieces.length < 16 && obj.state.pieces.length > 8){
                    depth = 4;
                }
                else if(obj.state.pieces.length < 8){
                    depth = 3;
                }
                move = minimaxDeep(obj.state,obj.color,depth, obj.removedTurns,
                    character(0),
                    [
                    ]
                )
                console.timeEnd('105')
            }

            else if(obj.AIPower === 106){
                console.time('106')
                let character = methods[obj.AICharacter];
                if(!obj.AICharacter){
                    character = rogueLikeCharacter;
                }
                let depth = 3;
                 if(obj.state.pieces.length < 16  && obj.state.pieces.length > 8){
                    depth = 4;
                }
                else if(obj.state.pieces.length < 8){
                    depth = 5;
                }
                move = minimaxAlphaBeta(obj.state,obj.color,depth, obj.removedTurns,
                    character(0),
                    [
                    ]
                )
                console.timeEnd('106')
            }
            move.removedTurns = obj.removedTurns;
            postMessage(JSONfn.stringify(move));
    }
})


