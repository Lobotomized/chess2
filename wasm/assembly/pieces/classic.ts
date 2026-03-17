
import { Piece, Move, State } from "../types";
import { posValue, findSquareByXY, findPieceByXY, checkEmptyHorizontalBetween, isRoadAttacked, areYouCheckedWithoutTempMoves, blockableCheck, areYouChecked, isPositionAttacked } from "../helperFunctions";

class Knight extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Knight.png";
        this.value = 2.5;
        this.posValue = posValue[3];
        
        this.moves.push(new Move('absolute', 1, 2));
        this.moves.push(new Move('absolute', -1, 2));
        this.moves.push(new Move('absolute', 1, -2));
        this.moves.push(new Move('absolute', -1, -2));
        this.moves.push(new Move('absolute', 2, 1));
        this.moves.push(new Move('absolute', -2, 1));
        this.moves.push(new Move('absolute', 2, -1));
        this.moves.push(new Move('absolute', -2, -1));
    }
}

class Pawn extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Pawn.png";
        this.value = 1.0;
        this.posValue = posValue[2];
        
        if (color == "black") {
             let m1 = new Move('absolute', 0, 1); m1.impotent = true;
             this.moves.push(m1);
             this.moves.push(new Move('takeMove', -1, 1));
             this.moves.push(new Move('takeMove', 1, 1));
        } else {
             let m1 = new Move('absolute', 0, -1); m1.impotent = true;
             this.moves.push(m1);
             this.moves.push(new Move('takeMove', -1, -1));
             this.moves.push(new Move('takeMove', 1, -1));
        }
    }
    
    conditionalMoves(state: State): Move[] {
        let moves: Move[] = [];
        // En passant logic omitted for brevity but structure supports it
        
        if (!this.moved) {
            if (this.color == "black") {
                let m = new Move('blockable', 0, 1);
                m.limit = 2;
                m.repeat = true;
                m.impotent = true;
                moves.push(m);
            } else {
                let m = new Move('blockable', 0, -1);
                m.limit = 2;
                m.repeat = true;
                m.impotent = true;
                moves.push(m);
            }
        }
        return moves;
    }

    afterPieceMove(state: State, move: Move, prevMove: Move): boolean {
        if (!this.moved) this.moved = true;
        
        // Check for last row (promotion)
        let isItLast = true;
        // Simplified check: if moving to last rank
        if (this.color == 'black' && move.y == 7) {
             // Promote to Queen logic
             this.icon = this.color + "Queen.png";
             this.moves = []; // Clear moves
             // Add Queen moves
             let m1 = new Move('blockable', 0, -1); m1.repeat = true; this.moves.push(m1);
             let m2 = new Move('blockable', 0, 1); m2.repeat = true; this.moves.push(m2);
             let m3 = new Move('blockable', -1, 0); m3.repeat = true; this.moves.push(m3);
             let m4 = new Move('blockable', 1, 0); m4.repeat = true; this.moves.push(m4);
             let m5 = new Move('blockable', -1, -1); m5.repeat = true; this.moves.push(m5);
             let m6 = new Move('blockable', 1, 1); m6.repeat = true; this.moves.push(m6);
             let m7 = new Move('blockable', -1, 1); m7.repeat = true; this.moves.push(m7);
             let m8 = new Move('blockable', 1, -1); m8.repeat = true; this.moves.push(m8);
        } else if (this.color == 'white' && move.y == 0) {
             // Promote to Queen logic
             this.icon = this.color + "Queen.png";
             this.moves = [];
             let m1 = new Move('blockable', 0, -1); m1.repeat = true; this.moves.push(m1);
             let m2 = new Move('blockable', 0, 1); m2.repeat = true; this.moves.push(m2);
             let m3 = new Move('blockable', -1, 0); m3.repeat = true; this.moves.push(m3);
             let m4 = new Move('blockable', 1, 0); m4.repeat = true; this.moves.push(m4);
             let m5 = new Move('blockable', -1, -1); m5.repeat = true; this.moves.push(m5);
             let m6 = new Move('blockable', 1, 1); m6.repeat = true; this.moves.push(m6);
             let m7 = new Move('blockable', -1, 1); m7.repeat = true; this.moves.push(m7);
             let m8 = new Move('blockable', 1, -1); m8.repeat = true; this.moves.push(m8);
        }

        return true;
    }
}

class Bishop extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Bishop.png";
        this.value = 3.0;
        this.posValue = posValue[3];
        
        let m1 = new Move('blockable', -1, -1); m1.repeat = true; this.moves.push(m1);
        let m2 = new Move('blockable', 1, 1); m2.repeat = true; this.moves.push(m2);
        let m3 = new Move('blockable', -1, 1); m3.repeat = true; this.moves.push(m3);
        let m4 = new Move('blockable', 1, -1); m4.repeat = true; this.moves.push(m4);
    }
}

class Rook extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Rook.png";
        this.value = 5.0;
        this.posValue = posValue[2];
        
        let m1 = new Move('blockable', -1, 0); m1.repeat = true; this.moves.push(m1);
        let m2 = new Move('blockable', 1, 0); m2.repeat = true; this.moves.push(m2);
        let m3 = new Move('blockable', 0, -1); m3.repeat = true; this.moves.push(m3);
        let m4 = new Move('blockable', 0, 1); m4.repeat = true; this.moves.push(m4);
    }

    afterPieceMove(state: State, move: Move, prevMove: Move): boolean {
        this.moved = true;
        return true;
    }
}

class Queen extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Queen.png";
        this.value = 9.0;
        this.posValue = 0.05;
        
        let m1 = new Move('blockable', 0, -1); m1.repeat = true; this.moves.push(m1);
        let m2 = new Move('blockable', 0, 1); m2.repeat = true; this.moves.push(m2);
        let m3 = new Move('blockable', -1, 0); m3.repeat = true; this.moves.push(m3);
        let m4 = new Move('blockable', 1, 0); m4.repeat = true; this.moves.push(m4);
        let m5 = new Move('blockable', -1, -1); m5.repeat = true; this.moves.push(m5);
        let m6 = new Move('blockable', 1, 1); m6.repeat = true; this.moves.push(m6);
        let m7 = new Move('blockable', -1, 1); m7.repeat = true; this.moves.push(m7);
        let m8 = new Move('blockable', 1, -1); m8.repeat = true; this.moves.push(m8);
    }
}

class King extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "King.png";
        this.value = 2000.0;
        this.posValue = posValue[3];
        this.vulnerable = true;
        
        this.moves.push(new Move('absolute', 0, 1));
        this.moves.push(new Move('absolute', 1, 0));
        this.moves.push(new Move('absolute', 1, 1));
        this.moves.push(new Move('absolute', -1, -1));
        this.moves.push(new Move('absolute', 0, -1));
        this.moves.push(new Move('absolute', -1, 0));
        this.moves.push(new Move('absolute', -1, 1));
        this.moves.push(new Move('absolute', 1, -1));
    }
    
    conditionalMoves(state: State): Move[] {
        let toReturn: Move[] = [];
        // Castling logic, etc.
        // For brevity, simple moves only, but castling can be implemented here checking `isPositionAttacked`
        return toReturn;
    }
    
    afterThisPieceTaken(state: State): boolean {
        if (this.color == 'white') {
            state.won = 'black';
        } else if (this.color == 'black') {
            state.won = 'white';
        }
        return false;
    }
}

export function knightFactory(color: string, x: i32, y: i32): Piece {
    return new Knight(color, x, y);
}

export function pawnFactory(color: string, x: i32, y: i32): Piece {
    console.log('pawn')
    return new Pawn(color, x, y);
}

export function bishopFactory(color: string, x: i32, y: i32): Piece {
    return new Bishop(color, x, y);
}

export function rookFactory(color: string, x: i32, y: i32): Piece {
    return new Rook(color, x, y);
}

export function queenFactory(color: string, x: i32, y: i32): Piece {
    return new Queen(color, x, y);
}

export function kingFactory(color: string, x: i32, y: i32): Piece {
    return new King(color, x, y);
}
