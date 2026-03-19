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
             
             if (isFriendly && !(magObj.options && magObj.options.onlyForEnemy)) {
                 magnifier += magObj.method(piece, pieces, board, piece.color, magObj.options);
             } else if (!isFriendly && !(magObj.options && magObj.options.onlyForMe)) {
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

function getMoveByValue(moves, weakest){
    if(!moves.length){
        return undefined;
    }
    return moves.reduce((max, move) => {
        if(!weakest){
            return max.value > move.value ? max : move;
        } else {
            return max.value < move.value ? max : move;
        }
    });
 }

function minimaxQuiescence(state, maximizer, depth, removedTurns, magnifiers, filters) {
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

    // Fast initial evaluation and sorting
    const len = firstGen.length;
    const scores = new Array(len);
    const movesWithScores = new Array(len);
    
    for (let i = 0; i < len; i++) {
        let move = firstGen[i];
        
        if (move.won && move.won === maximizer) {
            move.value = 9999999999999999999;
            return move;
        }
        
        let score = 0;
        const pieces = move.pieces;
        const pLen = pieces.length;
        
        for (let j = 0; j < pLen; j++) {
            const p = pieces[j];
            score += p.color === maximizer ? (p.value || 3) : -(p.value || 3);
        }
        
        if (move.xClicked !== undefined && move.yClicked !== undefined) {
            const centerDist = Math.abs(move.xClicked - 2.5) + Math.abs(move.yClicked - 2.5);
            score -= centerDist * 0.1;
        }
        
        scores[i] = score;
        movesWithScores[i] = {move, score};
    }
    
    movesWithScores.sort((a, b) => b.score - a.score);
    
    for (let i = 0; i < len; i++) {
        firstGen[i] = movesWithScores[i].move;
        firstGen[i]._score = movesWithScores[i].score;
    }

    let bestMove = undefined;
    let maxEval = -Infinity;
    let alpha = -Infinity;
    let beta = Infinity;

    for (let i = 0; i < len; i++) {
        let move = firstGen[i];
        
        if (maxEval !== -Infinity && scores[i] < maxEval - 500) {
            continue;
        }
        
        let evalBoard = alphaBetaQuiescence(
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
            if (alpha >= beta) {
                break;
            }
        }
    }

    return bestMove;
}

function alphaBetaQuiescence(state, depth, alpha, beta, isMaximizer, maximizerColor, filters, magnifiers) {
     if (state.won) {
         return state.won === maximizerColor ? 9999999999999999999 : -9999999999999999999;
     }
     
     if (depth <= 0) {
         return quiescenceSearch(state, alpha, beta, isMaximizer, maximizerColor, filters, magnifiers, 2);
     }
     
     const currentColor = isMaximizer ? maximizerColor : getEnemy(maximizerColor);
     const moves = generateMovesFromPiecesAlphaBeta(state, currentColor, filters);
     
     if (moves.length === 0) {
         return evaluateBoardUltraFast(maximizerColor, state.pieces, state.board, magnifiers);
     }
     
     const len = moves.length;
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
         
         for (let j = 0; j < pLen; j++) {
             const p = pieces[j];
             score += p.color === maximizerColor ? (p.value || 3) : -(p.value || 3);
         }
         scores[i] = score;
     }

     if (isMaximizer) {
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
             if (maxEval !== -Infinity && currentScore < maxEval - 500) continue;
             
             const evalBoard = alphaBetaQuiescence(
                 { pieces: m.pieces, board: state.board, turn: getEnemy(currentColor), won: m.won },
                 depth - 1, alpha, beta, false, maximizerColor, filters, magnifiers
             );
             
             if (evalBoard > maxEval) {
                 maxEval = evalBoard;
                 if (evalBoard > alpha) alpha = evalBoard;
             }
             if (beta <= alpha) break;
         }
         return maxEval;
     } else {
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
             if (minEval !== Infinity && currentScore > minEval + 500) continue;
             
             const evalBoard = alphaBetaQuiescence(
                 { pieces: m.pieces, board: state.board, turn: getEnemy(currentColor), won: m.won },
                 depth - 1, alpha, beta, true, maximizerColor, filters, magnifiers
             );
             
             if (evalBoard < minEval) {
                 minEval = evalBoard;
                 if (evalBoard < beta) beta = evalBoard;
             }
             if (beta <= alpha) break;
         }
         return minEval;
     }
 }

function quiescenceSearch(state, alpha, beta, isMaximizer, maximizerColor, filters, magnifiers, qDepth) {
    let standPat = evaluateBoardUltraFast(maximizerColor, state.pieces, state.board, magnifiers);

    if (isMaximizer) {
        if (standPat >= beta) return beta;
        if (alpha < standPat) alpha = standPat;
    } else {
        if (standPat <= alpha) return alpha;
        if (beta > standPat) beta = standPat;
    }
    
    if (qDepth <= 0) return standPat;

    let captureFilter = {
        method: removeNonAttackingMovesFilter, 
        options: { } 
    };
    
    let qFilters = filters ? [...filters, captureFilter] : [captureFilter];
    
    let currentColor = isMaximizer ? maximizerColor : getEnemy(maximizerColor);
    let moves = generateMovesFromPiecesAlphaBeta(state, currentColor, qFilters);
    
    const len = moves.length;
    if(len === 0) return standPat;

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
         
         for (let j = 0; j < pLen; j++) {
             const p = pieces[j];
             score += p.color === maximizerColor ? (p.value || 3) : -(p.value || 3);
         }
         scores[i] = score;
     }

     if (isMaximizer) {
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
    } else {
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
    }

    for (let i = 0; i < len; i++) {
        let m = moves[i];
        let evalBoard = quiescenceSearch(
            { pieces: m.pieces, board: state.board, turn: getEnemy(currentColor), won: m.won },
            alpha, beta, !isMaximizer, maximizerColor, filters, magnifiers, qDepth - 1
        );
        
        if (isMaximizer) {
             if (evalBoard >= beta) return beta;
             if (evalBoard > alpha) alpha = evalBoard;
        } else {
             if (evalBoard <= alpha) return alpha;
             if (evalBoard < beta) beta = evalBoard;
        }
    }
    
    return isMaximizer ? alpha : beta;
}

function proofNumberSearch(state, maximizer, depth, removedTurns, magnifiers, filters) {
    const maxNodes = depth * 500; // Heuristic node limit based on depth
    let root = new PnsNode(state, null, null, true, maximizer);
    
    // Initial expansion
    root.expand(maximizer, filters);

    let nodesCount = 1; // Root
    
    // Loop until solved or node limit reached
    while(nodesCount < maxNodes && root.pn !== 0 && root.dn !== 0) {
        let mostProving = root.selectMostProvingNode();
        if(!mostProving) break;
        
        // Expand the leaf
        // Determine turn for the leaf node
        let turn = mostProving.isOr ? maximizer : getEnemy(maximizer);
        
        mostProving.expand(turn, filters);
        nodesCount += mostProving.children.length;
        
        // Backpropagate values
        mostProving.updateAncestors();
    }
    
    // Select best move based on results
    let bestChild = null;
    
    if (root.pn === 0) {
        // We found a proven win
        bestChild = root.children.find(c => c.pn === 0);
    } else if (root.dn === 0) {
        // Proven loss - try to delay it (highest dn)
        bestChild = root.children.reduce((best, current) => {
            if (!best) return current;
            return current.dn > best.dn ? current : best;
        }, null);
    } else {
        // Unsolved - use heuristic: minimal PN (closest to win)
        // If tied, use maximal DN (hardest to lose)
        // Fallback: use static evaluation if PN/DN are equal (unexplored)
        
        bestChild = root.children.reduce((best, current) => {
            if (!best) return current;
            
            // Prioritize exploring promising nodes
            if (current.pn < best.pn) return current;
            if (current.pn > best.pn) return best;
            
            // Tie-break with disproof number
            if (current.dn > best.dn) return current;
            if (current.dn < best.dn) return best;
            
            // If still tied, use static evaluation if available, or just first one
            // We could run evaluateBoardUltraFast here for tie-breaking
            return best;
        }, null);
        
        // If we still have a tie (e.g. all 1/1), evaluate children statically
        if (bestChild && bestChild.pn === 1 && bestChild.dn === 1) {
             let bestScore = -Infinity;
             for (let child of root.children) {
                 let score = evaluateBoardUltraFast(maximizer, child.state.pieces, child.state.board, magnifiers);
                 if (score > bestScore) {
                     bestScore = score;
                     bestChild = child;
                 }
             }
        }
    }
    
    if (bestChild && bestChild.move) {
        return bestChild.move;
    }
    
    return undefined;
}

class PnsNode {
    constructor(state, move, parent, isOr, maximizerColor) {
        this.state = state;
        this.move = move;
        this.parent = parent;
        this.children = [];
        this.isOr = isOr; // OR node = maximizer's turn
        this.maximizerColor = maximizerColor;
        this.expanded = false;
        
        this.pn = 1;
        this.dn = 1;
        
        this.evaluateTerminal();
    }
    
    evaluateTerminal() {
        if (this.state.won) {
            if (this.state.won === this.maximizerColor) {
                this.pn = 0;
                this.dn = Infinity;
            } else if (this.state.won === 'tie') {
                this.pn = Infinity;
                this.dn = Infinity;
            } else {
                this.pn = Infinity;
                this.dn = 0;
            }
        }
    }
    
    expand(turn, filters) {
        if (this.expanded || this.pn === 0 || this.dn === 0) return;
        
        let moves = generateMovesFromPiecesAlphaBeta(this.state, turn, filters);
        
        if (moves.length === 0 && !this.state.won) {
             // No moves available but not marked won/lost yet
             // Assume loss for current player 'turn'
             if (turn === this.maximizerColor) {
                 this.pn = Infinity;
                 this.dn = 0;
             } else {
                 this.pn = 0;
                 this.dn = Infinity;
             }
             this.expanded = true;
             return;
        }
        
        for (let m of moves) {
            let nextState = {
                pieces: m.pieces,
                board: this.state.board,
                turn: getEnemy(turn),
                won: m.won
            };
            
            let child = new PnsNode(nextState, m, this, !this.isOr, this.maximizerColor);
            this.children.push(child);
        }
        
        this.expanded = true;
        this.updateValue();
    }
    
    updateValue() {
        if (this.children.length === 0) return;
        
        if (this.isOr) {
            // OR node: pn = min(children.pn), dn = sum(children.dn)
            let minPn = Infinity;
            let sumDn = 0;
            for (let c of this.children) {
                if (c.pn < minPn) minPn = c.pn;
                sumDn += c.dn;
            }
            this.pn = minPn;
            this.dn = sumDn;
        } else {
            // AND node: pn = sum(children.pn), dn = min(children.dn)
            let sumPn = 0;
            let minDn = Infinity;
            for (let c of this.children) {
                sumPn += c.pn;
                if (c.dn < minDn) minDn = c.dn;
            }
            this.pn = sumPn;
            this.dn = minDn;
        }
    }
    
    updateAncestors() {
        let curr = this;
        while (curr.parent) {
            let parent = curr.parent;
            let oldPn = parent.pn;
            let oldDn = parent.dn;
            
            parent.updateValue();
            
            if (parent.pn === oldPn && parent.dn === oldDn) break;
            curr = parent;
        }
    }
    
    selectMostProvingNode() {
        let curr = this;
        while (curr.expanded && curr.children.length > 0) {
            if (curr.pn === 0 || curr.dn === 0) return curr; // Solved
            
            if (curr.isOr) {
                // OR node: select child with min pn
                let best = curr.children[0];
                for (let c of curr.children) {
                    if (c.pn < best.pn) best = c;
                }
                curr = best;
            } else {
                // AND node: select child with min dn
                let best = curr.children[0];
                for (let c of curr.children) {
                    if (c.dn < best.dn) best = c;
                }
                curr = best;
            }
        }
        return curr;
    }
}

function bestFirstSearch(state, maximizer, depth, removedTurns, magnifiers, filters) {
    const maxNodes = depth * 1000; // Allow more nodes than PNS since expansion is lighter
    
    // Priority queue for open nodes
    let openList = [];
    
    // Initial expansion
    let root = {
        state: state,
        move: null,
        score: evaluateBoardUltraFast(maximizer, state.pieces, state.board, magnifiers),
        depth: 0,
        id: crypto.randomUUID()
    };
    
    // Generate initial moves
    let firstMoves = generateMovesFromPiecesAlphaBeta(state, maximizer, filters);
    
    if (firstMoves.length === 0) return undefined;
    
    // Populate open list with depth 1 moves
    for (let m of firstMoves) {
        let score = 0;
        if (m.won === maximizer) score = 999999;
        else if (m.won) score = -999999;
        else {
            // Heuristic: Material + positional + random noise to break ties
            score = evaluateBoardUltraFast(maximizer, m.pieces, state.board, magnifiers);
        }
        
        let node = {
            state: {
                pieces: m.pieces,
                board: state.board,
                turn: getEnemy(maximizer),
                won: m.won
            },
            move: m, // Store the root move that led here
            rootMove: m, // Keep track of the first move
            score: score,
            depth: 1
        };
        openList.push(node);
    }
    
    // Sort descending (higher score is better for maximizer)
    openList.sort((a, b) => b.score - a.score);
    
    let nodesCount = firstMoves.length;
    let bestMove = openList[0].rootMove;
    let bestScore = openList[0].score;
    
    while (nodesCount < maxNodes && openList.length > 0) {
        // Pop best node
        let current = openList.shift();
        
        // Update best found so far
        if (current.score > bestScore) {
            bestScore = current.score;
            bestMove = current.rootMove;
        }
        
        // If winning node, return immediately
        if (current.score > 900000) return current.rootMove;
        
        // If max depth reached, continue to next node
        if (current.depth >= depth + 2) continue; // Allow slight extension
        
        let turn = current.state.turn;
        let nextMoves = generateMovesFromPiecesAlphaBeta(current.state, turn, filters);
        
        if (nextMoves.length === 0) {
            // If no moves and it's enemy turn -> we win (mate)
            // If no moves and it's our turn -> we lose (mate)
            // But BFS is usually greedy, so we just evaluate terminal state
            if (turn !== maximizer) {
                // Enemy cannot move -> Checkmate or Stalemate
                // For simplicity assuming checkmate is good
                return current.rootMove;
            }
            continue;
        }
        
        for (let m of nextMoves) {
            let nextState = {
                pieces: m.pieces,
                board: state.board,
                turn: getEnemy(turn),
                won: m.won
            };
            
            let score = evaluateBoardUltraFast(maximizer, m.pieces, state.board, magnifiers);
            
            // Penalize score by depth to prefer faster wins / delayed losses
            // score -= current.depth * 0.1;
            
            let child = {
                state: nextState,
                move: m,
                rootMove: current.rootMove,
                score: score,
                depth: current.depth + 1
            };
            
            // Insert into sorted list (binary search insert would be faster, but simple push+sort for now)
            // Optimization: Only add if promising enough or list not full
            openList.push(child);
            nodesCount++;
        }
        
        // Re-sort periodically or use a Heap (simulated here by sorting)
        // Optimization: Sort only every N expansions or use binary insert
        openList.sort((a, b) => b.score - a.score);
        
        // Pruning: Keep only top N nodes to prevent memory explosion
        if (openList.length > 5000) {
            openList.length = 5000;
        }
    }
    
    return bestMove;
}
