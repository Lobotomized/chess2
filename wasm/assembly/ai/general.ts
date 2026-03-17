import { Piece, Square, State, Move, PlayerMove } from "../types";
import { FilterOptions, applyFilters } from "./filters";
import { MagnifierOptions, applyMagnifier } from "./magnifiers";
import { lightBoardFE, getEnemy } from "../helperFunctions";
import { playerMove } from "../moveMethods";

export class AiMove {
    pieceCounter: i32 = -1;
    pieces: Piece[] = [];
    xClicked: i32 = -1;
    yClicked: i32 = -1;
    won: string = "";
    value: f32 = 0.0;
    _score: f32 = 0.0;
}

export function evaluateBoardUltraFast(colorPerspective: string, pieces: Piece[], board: Square[], magnifiers: MagnifierOptions[]): f32 {
    let valueCounter: f32 = 0.0;
    let magLen = magnifiers.length;
    
    if (magLen == 0) {
        for (let i = 0; i < pieces.length; i++) {
            let piece = pieces[i];
            let pVal = piece.value == 0 ? 3.0 as f32 : piece.value;
            if (colorPerspective == piece.color) {
                valueCounter += pVal as f32;
            } else {
                valueCounter -= pVal as f32;
            }
        }
        return valueCounter;
    }
    
    for (let i = 0; i < pieces.length; i++) {
        let piece = pieces[i];
        let magnifier: f32 = 0.0;
        let isFriendly = colorPerspective == piece.color;
        
        for (let j = 0; j < magLen; j++) {
            let magObj = magnifiers[j];
            if (isFriendly && !magObj.onlyForEnemy) {
                magnifier += applyMagnifier(piece, pieces, board, colorPerspective, magObj);
            } else if (!isFriendly && !magObj.onlyForMe) {
                magnifier += applyMagnifier(piece, pieces, board, colorPerspective, magObj);
            }
        }
        
        let pVal = piece.value == 0 ? 3.0 as f32 : piece.value;
        if (isFriendly) {
            valueCounter += (pVal + magnifier) as f32;
        } else {
            valueCounter -= (pVal + magnifier) as f32;
        }
    }
    return valueCounter;
}

export function generateMovesFromPiecesAlphaBeta(state: State, color: string, filters: FilterOptions[]): AiMove[] {
    let movesAndPieces: AiMove[] = [];
    let piecesCounter = 0;
    
    for (let i = 0; i < state.pieces.length; i++) {
        let piece = state.pieces[i];
        if (piece.color != color) continue;
        
        let tempLightState = new State();
        tempLightState.pieces = state.pieces;
        tempLightState.board = state.board;
        tempLightState.turn = state.turn;
        lightBoardFE(piece, tempLightState, 'allowedMove', '', true);
        
        let allowedMoves: Square[] = [];
        for (let b = 0; b < state.board.length; b++) {
            if (state.board[b].allowedMove) allowedMoves.push(state.board[b]);
        }
        
        if (allowedMoves.length > 0) {
            // console.log("Piece " + piece.color + " " + piece.icon + " at " + piece.x.toString() + "," + piece.y.toString() + " has " + allowedMoves.length.toString() + " allowed moves");
        }
        if (filters.length > 0) {
            let filterOpts = new FilterOptions();
            filterOpts.allowedMoves = allowedMoves;
            filterOpts.piece = piece;
            filterOpts.color = color;
            filterOpts.state = state;
            allowedMoves = applyFilters(filters, filterOpts);
        }
        
        if (allowedMoves.length > 0) {
            // console.log("Piece " + piece.color + " has " + allowedMoves.length.toString() + " moves after filters");
        }
        
        for (let movesCounter = 0; movesCounter < allowedMoves.length; movesCounter++) {
            let newPieces: Piece[] = [];
            for (let k = 0; k < state.pieces.length; k++) {
                let p = state.pieces[k];
                let newP = p.clone(); // use clone method which handles all deep copy safely
                newPieces.push(newP);
            }
            
            let newPiece = newPieces[i];
            let square = allowedMoves[movesCounter];
            
            let tempState = new State();
            // Need a new board so flags aren't shared
            let newBoard: Square[] = [];
            for (let b = 0; b < state.board.length; b++) {
                let sq = state.board[b];
                let newSq = new Square(sq.x, sq.y);
                newSq.light = sq.light;
                newSq.special = sq.special;
                newSq.allowedMove = sq.allowedMove;
                newBoard.push(newSq);
            }
            tempState.board = newBoard;
            tempState.pieces = newPieces;
            tempState.pieceSelected = newPiece;
            tempState.turn = color;
            
            let moveOk = playerMove(new PlayerMove(square.x, square.y), tempState, true, null, 'allowedMove');
            // console.log("playerMove returned " + (moveOk ? "true" : "false"));
            if (moveOk) {
                let m = new AiMove();
                m.pieceCounter = piecesCounter;
                m.pieces = newPieces;
                m.xClicked = square.x;
                m.yClicked = square.y;
                m.won = tempState.won;
                movesAndPieces.push(m);
            }
        }
        piecesCounter++;
    }
    
    // console.log("Total valid AI moves found: " + movesAndPieces.length.toString());
    return movesAndPieces;
}

export function alphaBetaOptimized(state: State, depth: i32, alpha: f32, beta: f32, isMaximizer: boolean, maximizerColor: string, filters: FilterOptions[], magnifiers: MagnifierOptions[]): f32 {
    if (state.won != "") {
        return state.won == maximizerColor ? 9999999.0 : -9999999.0;
    }
    if (depth <= 0) {
        return evaluateBoardUltraFast(maximizerColor, state.pieces, state.board, magnifiers);
    }
    
    let currentColor = isMaximizer ? maximizerColor : getEnemy(maximizerColor);
    let moves = generateMovesFromPiecesAlphaBeta(state, currentColor, filters);
    
    if (moves.length == 0) {
        return evaluateBoardUltraFast(maximizerColor, state.pieces, state.board, magnifiers);
    }
    
    let len = moves.length;
    for (let i = 0; i < len; i++) {
        let m = moves[i];
        if (m.won != "") {
            m._score = isMaximizer ? 100000.0 : -100000.0;
            continue;
        }
        let score: f32 = 0.0;
        for (let j = 0; j < m.pieces.length; j++) {
            let p = m.pieces[j];
            let pVal = p.value == 0 ? 3.0 as f32 : p.value;
            score += p.color == maximizerColor ? pVal as f32 : -pVal as f32;
        }
        m._score = score;
    }
    
    if (isMaximizer) {
        // Insertion sort descending
        for (let i = 1; i < len; i++) {
            let currentMove = moves[i];
            let currentScore = currentMove._score;
            let j = i - 1;
            while (j >= 0 && moves[j]._score < currentScore) {
                moves[j + 1] = moves[j];
                j--;
            }
            moves[j + 1] = currentMove;
        }
        
        let maxEval: f32 = -Infinity;
        for (let i = 0; i < len; i++) {
            let m = moves[i];
            if (maxEval != -Infinity && m._score < maxEval - 500.0) continue;
            
            let nextState = new State();
            nextState.pieces = m.pieces;
            nextState.board = state.board;
            nextState.turn = getEnemy(currentColor);
            nextState.won = m.won;
            
            let evalBoard = alphaBetaOptimized(nextState, depth - 1, alpha, beta, false, maximizerColor, filters, magnifiers);
            
            if (evalBoard > maxEval) {
                maxEval = evalBoard;
                if (evalBoard > alpha) alpha = evalBoard;
            }
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        // Insertion sort ascending
        for (let i = 1; i < len; i++) {
            let currentMove = moves[i];
            let currentScore = currentMove._score;
            let j = i - 1;
            while (j >= 0 && moves[j]._score > currentScore) {
                moves[j + 1] = moves[j];
                j--;
            }
            moves[j + 1] = currentMove;
        }
        
        let minEval: f32 = Infinity;
        for (let i = 0; i < len; i++) {
            let m = moves[i];
            if (minEval != Infinity && m._score > minEval + 500.0) continue;
            
            let nextState = new State();
            nextState.pieces = m.pieces;
            nextState.board = state.board;
            nextState.turn = getEnemy(currentColor);
            nextState.won = m.won;
            
            let evalBoard = alphaBetaOptimized(nextState, depth - 1, alpha, beta, true, maximizerColor, filters, magnifiers);
            
            if (evalBoard < minEval) {
                minEval = evalBoard;
                if (evalBoard < beta) beta = evalBoard;
            }
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

export function minimaxAlphaBeta(state: State, maximizer: string, depth: i32, magnifiers: MagnifierOptions[], filters: FilterOptions[]): AiMove | null {
    // console.log('minimaxAlphaBeta starting for ' + maximizer);
    let enemy = getEnemy(maximizer);
    let firstGen = generateMovesFromPiecesAlphaBeta(state, maximizer, filters);

    if (firstGen.length == 0) {
        // console.log("No valid moves returned from generateMovesFromPiecesAlphaBeta");
        return null;
    } else {
        // console.log("minimaxAlphaBeta generated " + firstGen.length.toString() + " moves");
    }
    let len = firstGen.length;
    for (let i = 0; i < len; i++) {
        let m = firstGen[i];
        if (m.won != "" && m.won == maximizer) {
            m.value = 9999999.0;
            return m;
        }
        
        let score: f32 = 0.0;
        for (let j = 0; j < m.pieces.length; j++) {
            let p = m.pieces[j];
            let pVal = p.value == 0 ? 3.0 as f32 : p.value;
            score += p.color == maximizer ? pVal as f32 : -pVal as f32;
        }
        let centerDist = Math.abs(<f32>m.xClicked - 2.5 as f32) + Math.abs(<f32>m.yClicked - 2.5 as f32);
        score -= centerDist * 0.1 as f32;
        m._score = score;
    }
    
    // Sort descending
    for (let i = 1; i < len; i++) {
        let currentMove = firstGen[i];
        let currentScore = currentMove._score;
        let j = i - 1;
        while (j >= 0 && firstGen[j]._score < currentScore) {
            firstGen[j + 1] = firstGen[j];
            j--;
        }
        firstGen[j + 1] = currentMove;
    }
    
    let bestMove: AiMove | null = null;
    let maxEval: f32 = -Infinity;
    let alpha: f32 = -Infinity;
    let beta: f32 = Infinity;
    
    for (let i = 0; i < len; i++) {
        let m = firstGen[i];
        if (maxEval != -Infinity && m._score < maxEval - 500.0) continue;
        
        let nextState = new State();
        nextState.pieces = m.pieces;
        nextState.board = state.board;
        nextState.turn = enemy;
        nextState.won = m.won;
        
        let evalBoard = alphaBetaOptimized(nextState, depth - 1, alpha, beta, false, maximizer, filters, magnifiers);
        m.value = evalBoard;
        
        if (evalBoard > maxEval || bestMove == null) {
            maxEval = evalBoard;
            bestMove = m;
        }
        
        if (evalBoard > alpha) {
            alpha = evalBoard;
            if (alpha >= beta) break;
        }
    }
    
    return bestMove;
}
