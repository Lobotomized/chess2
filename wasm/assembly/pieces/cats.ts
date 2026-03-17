
import { Piece, Move, State } from "../types";
import { posValue, pieceAroundMe, conditionalSplice, conditionalSpliceWithBonus, findPieceByXY } from "../helperFunctions";

export class ElectricCat extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "ElectricCat.png";
        this.value = 0.5;
        this.posValue = 1;
        
        if (color == 'black') {
            this.moves.push(new Move('absolute', 0, 1));
        } else {
            this.moves.push(new Move('absolute', 0, -1));
        }
    }
    
    conditionalMoves(state: State): Move[] {
        let toReturn: Move[] = [];
        
        if (pieceAroundMe(state, this, 'ScaryCat.png')) {
            let m: Move;
            if (this.color == 'black') {
                m = new Move('blockable', 0, 1);
            } else {
                m = new Move('blockable', 0, -1);
            }
            m.limit = 4;
            m.repeat = true;
            toReturn.push(m);
        }
        
        if (pieceAroundMe(state, this, 'LongCat.png')) {
             if (this.color == 'black') {
                 let m1 = new Move('blockable', -1, 1); m1.limit=3; m1.repeat=true; toReturn.push(m1);
                 let m2 = new Move('blockable', 1, 1); m2.limit=3; m2.repeat=true; toReturn.push(m2);
             } else {
                 let m1 = new Move('blockable', -1, -1); m1.limit=3; m1.repeat=true; toReturn.push(m1);
                 let m2 = new Move('blockable', 1, -1); m2.limit=3; m2.repeat=true; toReturn.push(m2);
             }
        }
        
        return toReturn;
    }
    
    afterPieceMove(state: State, move: Move, prevMove: Move): boolean {
        if (Math.abs(prevMove.y - move.y) > 1) {
            let idx = -1;
            for(let i=0; i<state.pieces.length; i++) {
                if (state.pieces[i] == this) {
                    idx = i;
                    break;
                }
            }
            if (idx != -1) state.pieces.splice(idx, 1);
        }
        return true;
    }
}

export class ScaryCat extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "ScaryCat.png";
        this.value = 6;
        this.posValue = 1;
        
        let m1 = new Move('blockable', 0, -1); m1.repeat=true; m1.limit=2; this.moves.push(m1);
        let m2 = new Move('blockable', 0, 1); m2.repeat=true; m2.limit=2; this.moves.push(m2);
        let m3 = new Move('blockable', -1, 0); m3.repeat=true; m3.limit=2; this.moves.push(m3);
        let m4 = new Move('blockable', 1, 0); m4.repeat=true; m4.limit=2; this.moves.push(m4);
        let m5 = new Move('blockable', -1, -1); m5.repeat=true; m5.limit=2; this.moves.push(m5);
        let m6 = new Move('blockable', 1, 1); m6.repeat=true; m6.limit=2; this.moves.push(m6);
        let m7 = new Move('blockable', -1, 1); m7.repeat=true; m7.limit=2; this.moves.push(m7);
        let m8 = new Move('blockable', 1, -1); m8.repeat=true; m8.limit=2; this.moves.push(m8);
    }
}

export class FatCat extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "FatCat.png";
        this.value = 4;
        this.posValue = 1;
        
        let m1 = new Move('blockable', -1, 0); m1.repeat=true; m1.limit=3; this.moves.push(m1);
        let m2 = new Move('blockable', 1, 0); m2.repeat=true; m2.limit=3; this.moves.push(m2);
        let m3 = new Move('blockable', 0, -1); m3.repeat=true; m3.limit=3; this.moves.push(m3);
        let m4 = new Move('blockable', 0, 1); m4.repeat=true; m4.limit=3; this.moves.push(m4);
        
        let m5 = new Move('blockable', -1, 0); m5.repeat=true; m5.limit=3; m5.friendlyPieces=true; this.moves.push(m5);
        let m6 = new Move('blockable', 1, 0); m6.repeat=true; m6.limit=3; m6.friendlyPieces=true; this.moves.push(m6);
        let m7 = new Move('blockable', 0, -1); m7.repeat=true; m7.limit=3; m7.friendlyPieces=true; this.moves.push(m7);
        let m8 = new Move('blockable', 0, 1); m8.repeat=true; m8.limit=3; m8.friendlyPieces=true; this.moves.push(m8);
    }
    
    conditionalMoves(state: State): Move[] {
        let toReturn: Move[] = [];
        
        if (pieceAroundMe(state, this, 'ScaryCat.png')) {
             let m1 = new Move('blockable', -1, 0); m1.repeat=true; m1.limit=4; toReturn.push(m1);
             let m2 = new Move('blockable', 1, 0); m2.repeat=true; m2.limit=4; toReturn.push(m2);
             let m3 = new Move('blockable', 0, -1); m3.repeat=true; m3.limit=4; toReturn.push(m3);
             let m4 = new Move('blockable', 0, 1); m4.repeat=true; m4.limit=4; toReturn.push(m4);
             
             let m5 = new Move('blockable', -1, 0); m5.repeat=true; m5.limit=4; m5.friendlyPieces=true; toReturn.push(m5);
             let m6 = new Move('blockable', 1, 0); m6.repeat=true; m6.limit=4; m6.friendlyPieces=true; toReturn.push(m6);
             let m7 = new Move('blockable', 0, -1); m7.repeat=true; m7.limit=4; m7.friendlyPieces=true; toReturn.push(m7);
             let m8 = new Move('blockable', 0, 1); m8.repeat=true; m8.limit=4; m8.friendlyPieces=true; toReturn.push(m8);
        }
        
        if (pieceAroundMe(state, this, 'LongCat.png')) {
             let m1 = new Move('blockable', -1, -1); m1.repeat=true; m1.limit=3; toReturn.push(m1);
             let m2 = new Move('blockable', 1, 1); m2.repeat=true; m2.limit=3; toReturn.push(m2);
             let m3 = new Move('blockable', -1, 1); m3.repeat=true; m3.limit=3; toReturn.push(m3);
             let m4 = new Move('blockable', 1, -1); m4.repeat=true; m4.limit=3; toReturn.push(m4);
        }
        
        return toReturn;
    }
    
    friendlyPieceInteraction(state: State, friendlyPiece: Piece | null, prevMove: Move): boolean {
        if (friendlyPiece && friendlyPiece.icon.includes("ElectricCat.png")) {
             let idx = -1;
             for(let i=0; i<state.pieces.length; i++) if (state.pieces[i] == friendlyPiece) idx = i;
             conditionalSpliceWithBonus(state, idx, this.color);
             
             conditionalSpliceWithBonus(state, findPieceByXY(state.pieces, this.x, this.y+1), this.color);
             conditionalSpliceWithBonus(state, findPieceByXY(state.pieces, this.x, this.y-1), this.color);
             conditionalSpliceWithBonus(state, findPieceByXY(state.pieces, this.x+1, this.y), this.color);
             conditionalSpliceWithBonus(state, findPieceByXY(state.pieces, this.x-1, this.y), this.color);
             conditionalSpliceWithBonus(state, findPieceByXY(state.pieces, this.x+1, this.y+1), this.color);
             conditionalSpliceWithBonus(state, findPieceByXY(state.pieces, this.x-1, this.y+1), this.color);
             conditionalSpliceWithBonus(state, findPieceByXY(state.pieces, this.x+1, this.y-1), this.color);
             conditionalSpliceWithBonus(state, findPieceByXY(state.pieces, this.x-1, this.y-1), this.color);
             return true; // Stop turn? JS returns undefined (void) here but loop continues if true? 
             // JS logic: if(operatedPiece.friendlyPieceInteraction(...)) { continueTurn = false; }
             // But JS helperFunctions `conditionalSpliceWithBonus` returns nothing.
             // JS `friendlyPieceInteraction` returns true or undefined.
             // If returns true, continueTurn = false.
             // Here we splice pieces, so we probably want to stop movement (return true).
             // But JS code has: 
             // else if(friendlyPiece){ return true; }
             // If electric cat, it splices and falls through. So it returns undefined (falsy).
             // So turn continues?
             // Actually, if it returns falsy, `continueTurn` remains true.
             // So piece MOVES to the square?
             // `friendlyPiece` was spliced. So square is empty.
             // `operatedPiece` moves to `x, y`.
             // Yes.
             return false; // Return false means continueTurn = true? No.
             // AS `playerMove`: if (operatedPiece.friendlyPieceInteraction(...)) { continueTurn = false; }
             // So if I return true, turn ends.
             // If I return false, turn continues.
             // JS: if returns nothing (undefined), it's false.
             // So turn continues.
        } else if (friendlyPiece) {
            return true;
        }
        return false;
    }
}

export class LongCat extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "LongCat.png";
        this.value = 6;
        this.posValue = 1;
        
        let m1 = new Move('blockable', -1, -1); m1.repeat=true; this.moves.push(m1);
        let m2 = new Move('blockable', 1, 1); m2.repeat=true; this.moves.push(m2);
        let m3 = new Move('blockable', -1, 1); m3.repeat=true; this.moves.push(m3);
        let m4 = new Move('blockable', 1, -1); m4.repeat=true; this.moves.push(m4);
    }
}

export class BlindCat extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "BlindCat.png";
        this.value = 2000;
        this.posValue = 0.0001;
        
        this.moves.push(new Move('allMine', 0, 0));
    }
    
    friendlyPieceInteraction(state: State, friendlyPiece: Piece | null, prevMove: Move): boolean {
        if (friendlyPiece) {
             if (state.pieceSelected && friendlyPiece == state.pieceSelected) return true;
             
             let idx = -1;
             for(let i=0; i<state.pieces.length; i++) if (state.pieces[i] == friendlyPiece) idx = i;
             conditionalSplice(state.pieces, idx);
        }
        return false;
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

export class CuteCat extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "CuteCat.png";
        this.value = 6;
        this.posValue = 1;
        
        let m1 = new Move('blockable', 0, -1); m1.repeat=true; this.moves.push(m1);
        let m2 = new Move('blockable', 0, 1); m2.repeat=true; this.moves.push(m2);
        let m3 = new Move('blockable', -1, 0); m3.repeat=true; this.moves.push(m3);
        let m4 = new Move('blockable', 1, 0); m4.repeat=true; this.moves.push(m4);
        let m5 = new Move('blockable', -1, -1); m5.repeat=true; this.moves.push(m5);
        let m6 = new Move('blockable', 1, 1); m6.repeat=true; this.moves.push(m6);
        let m7 = new Move('blockable', -1, 1); m7.repeat=true; this.moves.push(m7);
        let m8 = new Move('blockable', 1, -1); m8.repeat=true; this.moves.push(m8);
    }
    
    afterEnemyPieceTaken(enemyPiece: Piece, state: State): void {
        this.moves = [];
        for(let i=0; i<enemyPiece.moves.length; i++) {
            this.moves.push(enemyPiece.moves[i].clone());
        }
        
        let iconCode = enemyPiece.icon.replace('black', '');
        iconCode = iconCode.replace('white', '');
        
        this.icon = this.color + iconCode;
        this.value = enemyPiece.value;
        this.posValue = enemyPiece.posValue;
    }
}

export function electricCatFactory(color: string, x: i32, y: i32): Piece {
    return new ElectricCat(color, x, y);
}

export function scaryCatFactory(color: string, x: i32, y: i32): Piece {
    return new ScaryCat(color, x, y);
}

export function fatCatFactory(color: string, x: i32, y: i32): Piece {
    return new FatCat(color, x, y);
}

export function longCatFactory(color: string, x: i32, y: i32): Piece {
    return new LongCat(color, x, y);
}

export function blindCatFactory(color: string, x: i32, y: i32): Piece {
    return new BlindCat(color, x, y);
}

export function cuteCatFactory(color: string, x: i32, y: i32): Piece {
    return new CuteCat(color, x, y);
}
