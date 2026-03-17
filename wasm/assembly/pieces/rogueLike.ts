
import { Piece, Move, State } from "../types";
import { posValue } from "../helperFunctions";

class RogueLikePawn extends Piece {
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
        // Similar to classic pawn
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
        // Promotion logic same as classic or different?
        // RogueLike pawn promotes to Queen too in JS code provided earlier?
        // JS says: if (this.color == 'black' && isItLast) { this.icon = color + 'Queen.png'; ... }
        // So yes, it promotes.
        
        let isItLast = false;
        // Check for last row
        // Simplified
        if (this.color == 'black' && move.y == 7) isItLast = true;
        if (this.color == 'white' && move.y == 0) isItLast = true;
        
        if (isItLast) {
             this.icon = this.color + "Queen.png";
             this.moves = [];
             // Add Queen moves
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

class RogueLikeAnt extends Piece {
    constructor(color: string, x: i32, y: i32, direction: string) {
        super(color, x, y);
        this.icon = color + "Ant.png";
        this.value = 0.6;
        this.posValue = posValue[2];
        this.direction = direction;
        
        if (this.direction == "") this.direction = color;
        
        if (this.direction == "black") {
             let m = new Move('blockable', 0, 1);
             m.repeat = true;
             m.limit = 2;
             this.moves.push(m);
        } else {
             let m = new Move('blockable', 0, -1);
             m.repeat = true;
             m.limit = 2;
             this.moves.push(m);
        }
    }
    
    afterPieceMove(state: State, move: Move, prevMove: Move): boolean {
        // Transformation logic
        // JS: if(this.direction == 'white' && move.y == 0 || this.direction == 'black' && isItLast)
        
        let isItLast = false;
        // Check for last row based on direction?
        // Actually JS code checks for board boundary basically.
        
        // Simple check
        if ((this.direction == 'white' && move.y == 0) || (this.direction == 'black' && move.y == 7)) {
            // Remove self
            let idx = -1;
            for(let i=0; i<state.pieces.length; i++) {
                if (state.pieces[i] == this) {
                    idx = i;
                    break;
                }
            }
            if (idx != -1) state.pieces.splice(idx, 1);
            
            // Add QueenBug
            let qb = roguelikeQueenbugFactory(this.color, move.x, move.y);
            state.pieces.push(qb);
        }
        
        return true;
    }
}

class RogueLikeQueenBug extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "QueenBug.png";
        this.value = 2.5;
        this.posValue = posValue[2];
        
        let m1 = new Move('absolute', 0, -1); m1.impotent = true; this.moves.push(m1);
        let m2 = new Move('absolute', 0, 1); m2.impotent = true; this.moves.push(m2);
        let m3 = new Move('absolute', -1, 0); m3.impotent = true; this.moves.push(m3);
        let m4 = new Move('absolute', 1, 0); m4.impotent = true; this.moves.push(m4);
    }
    
    afterPieceMove(state: State, move: Move, prevMove: Move): boolean {
        // Spawns Ant
        // const direction = this.y == 0  || this.y == 1 || this.y == 2? 'black' : 'white'
        let direction = 'white';
        if (this.y == 0 || this.y == 1 || this.y == 2) direction = 'black';
        
        let ant = roguelikeAntFactory(this.color, prevMove.x, prevMove.y, direction);
        state.pieces.push(ant);
        
        return true;
    }
}

export function rogueLikePawnFactory(color: string, x: i32, y: i32): Piece {
    return new RogueLikePawn(color, x, y);
}

export function roguelikeAntFactory(color: string, x: i32, y: i32, direction: string): Piece {
    return new RogueLikeAnt(color, x, y, direction);
}

export function roguelikeQueenbugFactory(color: string, x: i32, y: i32): Piece {
    return new RogueLikeQueenBug(color, x, y);
}
