import { Piece, Square, State } from "../types";
import { lightBoardFE, isPositionAttacked } from "../helperFunctions";

export class MagnifierOptions {
    type: string = "";
    onlyForEnemy: boolean = false;
    onlyForMe: boolean = false;
    
    posValue: f32 = 0.0;
    pieceValue: f32 = 0.0;
    relativeValue: f32 = 0.0;
    
    attackValue: f32 = 0.0;
    proximityValue: f32 = 0.0;
    
    defendersSearch: boolean = false;
    pieceAttacked: boolean = false;
    whoHasMorePieces: boolean = false;
    useThreshold: boolean = false;
    
    mask: Map<string, f32> | null = null;
}

let boardHeight: i32 = 0;
let boardWidth: i32 = 0;

export function setBoardDimensions(board: Square[]): void {
    let maxH = 0;
    let maxW = 0;
    for (let i = 0; i < board.length; i++) {
        if (board[i].y > maxH) maxH = board[i].y;
        if (board[i].x > maxW) maxW = board[i].x;
    }
    boardHeight = maxH;
    boardWidth = maxW;
}

export function evaluationMagnifierMaxOptions(piece: Piece, pieces: Piece[], board: Square[], colorPerspective: string, options: MagnifierOptions): f32 {
    let tempState = new State();
    tempState.pieces = pieces;
    tempState.board = board;
    tempState.turn = piece.color;
    
    lightBoardFE(piece, tempState, 'allowedMove', '', true);
    
    let allowedCount = 0;
    for (let i = 0; i < board.length; i++) {
        if (board[i].allowedMove) allowedCount++;
    }
    
    let piecePosValue = piece.posValue;
    if (options.mask && options.mask!.has(piece.icon)) {
        piecePosValue = options.mask!.get(piece.icon);
    }
    
    return <f32>allowedCount * options.posValue * piecePosValue;
}

export function evaluationMagnifierKingVulnerability(piece: Piece, pieces: Piece[], board: Square[], colorPerspective: string, options: MagnifierOptions): f32 {
    if (piece.color != colorPerspective) return 0.0;
    
    let enemyKing: Piece | null = null;
    for (let i = 0; i < pieces.length; i++) {
        let p = pieces[i];
        if (p.color != colorPerspective && (p.icon.includes('King') || p.value > 500)) {
            enemyKing = p;
            break;
        }
    }
    if (!enemyKing) return 0.0;
    
    let tempState = new State();
    tempState.pieces = pieces;
    tempState.board = board;
    tempState.turn = piece.color;
    lightBoardFE(piece, tempState, 'allowedMove', '', true);
    
    let score: f32 = 0.0;
    
    let attacksKing = false;
    for (let i = 0; i < board.length; i++) {
        if (board[i].x == enemyKing.x && board[i].y == enemyKing.y && board[i].allowedMove) {
            attacksKing = true;
            break;
        }
    }
    if (attacksKing) score += options.attackValue;
    
    if (options.proximityValue > 0) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx == 0 && dy == 0) continue;
                let targetX = enemyKing.x + dx;
                let targetY = enemyKing.y + dy;
                for (let i = 0; i < board.length; i++) {
                    if (board[i].x == targetX && board[i].y == targetY && board[i].allowedMove) {
                        score += options.proximityValue;
                        break;
                    }
                }
            }
        }
    }
    
    return score;
}

export function evaluationMagnifierPiece(piece: Piece, pieces: Piece[], board: Square[], colorPerspective: string, options: MagnifierOptions): f32 {
    if (!options.whoHasMorePieces && !options.useThreshold) {
        return piece.value * options.pieceValue;
    }
    
    let myPiecesCount: f32 = 0.0;
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].color == colorPerspective) myPiecesCount++;
    }
    
    let pieceDifferenceChange: f32 = 1.0;
    if (options.whoHasMorePieces) {
        let enemyCount = <f32>pieces.length - myPiecesCount;
        if (enemyCount > 0) pieceDifferenceChange = myPiecesCount / enemyCount;
    }
    
    if (options.useThreshold) {
        let quantifier: f32 = 6.0;
        if (myPiecesCount > 14) quantifier = 0.5;
        else if (myPiecesCount > 10) quantifier = 1.0;
        else if (myPiecesCount > 5) quantifier = 3.0;
        
        return piece.value * quantifier * pieceDifferenceChange;
    }
    
    return piece.value * options.pieceValue;
}

export function evaluationMagnifierPieceDefended(piece: Piece, pieces: Piece[], board: Square[], colorPerspective: string, options: MagnifierOptions): f32 {
    let enemyColor = piece.color == 'black' ? 'white' : 'black';
    let colorToUse = options.pieceAttacked ? piece.color : enemyColor;
    
    let tempState = new State();
    tempState.board = board;
    tempState.pieces = pieces;
    tempState.turn = colorPerspective;
    
    if (isPositionAttacked(tempState, colorToUse, piece.x, piece.y)) {
        if (options.pieceValue > 0) {
            return options.relativeValue * options.pieceValue * piece.value;
        }
        return options.relativeValue;
    }
    return 0.0;
}

export function evaluationMagnifierKingTropism(piece: Piece, pieces: Piece[], board: Square[], colorPerspective: string, options: MagnifierOptions): f32 {
    let target: Piece | null = null;
    let shortestDistance: i32 = 100;
    
    if (boardHeight == 0) setBoardDimensions(board);
    
    for (let i = 0; i < pieces.length; i++) {
        let el = pieces[i];
        let valid = false;
        if (!options.defendersSearch) {
            if (el.color != colorPerspective && el.value > 500) valid = true;
        } else {
            if (el.color == colorPerspective && el.value > 500) valid = true;
        }
        
        if (valid) {
            let distanceX = Math.abs(<f64>piece.x - <f64>el.x) as i32;
            let distanceY = Math.abs(<f64>piece.y - <f64>el.y) as i32;
            let maxDist = distanceX > distanceY ? distanceX : distanceY;
            
            if (maxDist < shortestDistance) {
                shortestDistance = maxDist;
                target = el;
            }
        }
    }
    
    if (!target) return 0.0;
    
    let distanceX = Math.abs(<f64>piece.x - <f64>target.x) as i32;
    let distanceY = Math.abs(<f64>piece.y - <f64>target.y) as i32;
    let tempPieceValue = piece.value;
    if (tempPieceValue > 500) tempPieceValue = 0.0001;
    
    if (distanceX > distanceY) {
        if (options.pieceValue > 0) {
            return (<f32>boardWidth * options.relativeValue - <f32>distanceX * options.relativeValue) * options.pieceValue * tempPieceValue;
        }
        return <f32>boardWidth * options.relativeValue - <f32>distanceX * options.relativeValue;
    } else {
        if (options.pieceValue > 0) {
            return (<f32>boardHeight * options.relativeValue - <f32>distanceY * options.relativeValue) * options.pieceValue * tempPieceValue;
        }
        return <f32>boardHeight * options.relativeValue - <f32>distanceY * options.relativeValue;
    }
}

export function applyMagnifier(piece: Piece, pieces: Piece[], board: Square[], colorPerspective: string, options: MagnifierOptions): f32 {
    if (options.type == "evaluationMagnifierMaxOptions") return evaluationMagnifierMaxOptions(piece, pieces, board, colorPerspective, options);
    if (options.type == "evaluationMagnifierPiece") return evaluationMagnifierPiece(piece, pieces, board, colorPerspective, options);
    if (options.type == "evaluationMagnifierKingTropism") return evaluationMagnifierKingTropism(piece, pieces, board, colorPerspective, options);
    if (options.type == "evaluationMagnifierPieceDefended") return evaluationMagnifierPieceDefended(piece, pieces, board, colorPerspective, options);
    if (options.type == "evaluationMagnifierKingVulnerability") return evaluationMagnifierKingVulnerability(piece, pieces, board, colorPerspective, options);
    return 0.0;
}
