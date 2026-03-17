
import { Piece, Move, State } from "../types";
import { posValue, giveOppositeColor } from "../helperFunctions";

export class MongolianKnight extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Knight.png";
        this.value = 2.5;
        this.posValue = 0.1;
        
        this.moves.push(new Move('absolute', 1, 2));
        this.moves.push(new Move('absolute', -1, 2));
        this.moves.push(new Move('absolute', 1, -2));
        this.moves.push(new Move('absolute', -1, -2));
        this.moves.push(new Move('absolute', 2, 1));
        this.moves.push(new Move('absolute', -2, 1));
        this.moves.push(new Move('absolute', 2, -1));
        this.moves.push(new Move('absolute', -2, -1));
    }
    
    afterPieceMove(state: State, move: Move, prevMove: Move): boolean {
        if (prevMove.x == 5 && prevMove.y == 5) {
            state.won = this.color;
        }
        if (move.x == 5 && move.y == 5) {
            this.value = 2000;
        } else {
            this.value = 2.5;
        }
        return true;
    }
}

export class WeakPawn extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Pawn.png";
        this.value = 1;
        this.posValue = 1;
        
        if (color == 'black') {
            let m1 = new Move('absolute', 0, 1); m1.impotent=true; this.moves.push(m1);
            this.moves.push(new Move('takeMove', -1, 1));
            this.moves.push(new Move('takeMove', 1, 1));
        } else {
            let m1 = new Move('absolute', 0, -1); m1.impotent=true; this.moves.push(m1);
            this.moves.push(new Move('takeMove', -1, -1));
            this.moves.push(new Move('takeMove', 1, -1));
        }
    }
    
    afterPieceMove(state: State, move: Move, prevMove: Move): boolean {
        if (!this.moved) this.moved = true;
        
        // Check promotion
        // JS logic: if (this.color == 'black' && state.pieceSelected.y == 1)
        // In AS, `state.pieceSelected` might be null or this piece.
        // Assuming `this` is the piece.
        
        if (this.color == 'black' && this.y == 1) {
            this.icon = this.color + 'Queen.png';
            this.moves = [];
            this.moves.push(new Move('blockable', 0, -1)); this.moves[0].repeat=true;
            this.moves.push(new Move('blockable', 0, 1)); this.moves[1].repeat=true;
            this.moves.push(new Move('blockable', -1, 0)); this.moves[2].repeat=true;
            this.moves.push(new Move('blockable', 1, 0)); this.moves[3].repeat=true;
            this.moves.push(new Move('blockable', -1, -1)); this.moves[4].repeat=true;
            this.moves.push(new Move('blockable', 1, 1)); this.moves[5].repeat=true;
            this.moves.push(new Move('blockable', -1, 1)); this.moves[6].repeat=true;
            this.moves.push(new Move('blockable', 1, -1)); this.moves[7].repeat=true;
        } else if (this.color == 'white' && this.y == 6) {
            this.icon = this.color + 'Queen.png';
            this.moves = [];
            this.moves.push(new Move('blockable', 0, -1)); this.moves[0].repeat=true;
            this.moves.push(new Move('blockable', 0, 1)); this.moves[1].repeat=true;
            this.moves.push(new Move('blockable', -1, 0)); this.moves[2].repeat=true;
            this.moves.push(new Move('blockable', 1, 0)); this.moves[3].repeat=true;
            this.moves.push(new Move('blockable', -1, -1)); this.moves[4].repeat=true;
            this.moves.push(new Move('blockable', 1, 1)); this.moves[5].repeat=true;
            this.moves.push(new Move('blockable', -1, 1)); this.moves[6].repeat=true;
            this.moves.push(new Move('blockable', 1, -1)); this.moves[7].repeat=true;
        }
        
        return true;
    }
}

export class UnpromotablePawn extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Pawn.png";
        this.value = 1;
        this.posValue = 1;
        
        if (color == 'black') {
            let m1 = new Move('absolute', 0, 1); m1.impotent=true; this.moves.push(m1);
            this.moves.push(new Move('takeMove', -1, 1));
            this.moves.push(new Move('takeMove', 1, 1));
        } else {
            let m1 = new Move('absolute', 0, -1); m1.impotent=true; this.moves.push(m1);
            this.moves.push(new Move('takeMove', -1, -1));
            this.moves.push(new Move('takeMove', 1, -1));
        }
    }
    
    afterPieceMove(state: State, move: Move, prevMove: Move): boolean {
        if (!this.moved) this.moved = true;
        return true;
    }
    
    conditionalMoves(state: State): Move[] {
        if (!this.moved) {
            if (this.color == 'black') {
                let m = new Move('blockable', 0, 1);
                m.limit = 2;
                m.repeat = true;
                m.impotent = true;
                return [m];
            } else {
                let m = new Move('blockable', 0, -1);
                m.limit = 2;
                m.repeat = true;
                m.impotent = true;
                return [m];
            }
        }
        return [];
    }
}

export class Hat extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Hat.png";
        this.value = 2000;
        this.posValue = posValue[4];
        
        let m1 = new Move('blockable', 0, -1); m1.repeat=true; this.moves.push(m1);
        let m2 = new Move('blockable', 0, 1); m2.repeat=true; this.moves.push(m2);
        let m3 = new Move('blockable', -1, 0); m3.repeat=true; this.moves.push(m3);
        let m4 = new Move('blockable', 1, 0); m4.repeat=true; this.moves.push(m4);
        
        let m5 = new Move('absolute', -1, 1); m5.impotent=true; this.moves.push(m5);
        let m6 = new Move('absolute', -1, -1); m6.impotent=true; this.moves.push(m6);
        let m7 = new Move('absolute', 1, 1); m7.impotent=true; this.moves.push(m7);
        let m8 = new Move('absolute', 1, -1); m8.impotent=true; this.moves.push(m8);
    }
    
    afterThisPieceTaken(state: State): boolean {
        state.won = giveOppositeColor(this.color);
        return true;
    }
}

export class Clown extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Clown.png";
        this.value = 2;
        this.posValue = posValue[2];
        
        let m1 = new Move('blockable', 0, -1); m1.repeat=true; m1.impotent=true; this.moves.push(m1);
        let m2 = new Move('blockable', 0, 1); m2.repeat=true; m2.impotent=true; this.moves.push(m2);
        let m3 = new Move('blockable', -1, 0); m3.repeat=true; m3.impotent=true; this.moves.push(m3);
        let m4 = new Move('blockable', 1, 0); m4.repeat=true; m4.impotent=true; this.moves.push(m4);
        let m5 = new Move('blockable', -1, -1); m5.repeat=true; m5.impotent=true; this.moves.push(m5);
        let m6 = new Move('blockable', 1, 1); m6.repeat=true; m6.impotent=true; this.moves.push(m6);
        let m7 = new Move('blockable', -1, 1); m7.repeat=true; m7.impotent=true; this.moves.push(m7);
        let m8 = new Move('blockable', 1, -1); m8.repeat=true; m8.impotent=true; this.moves.push(m8);
        
        this.moves.push(new Move('allMine', 0, 0));
    }
    
    friendlyPieceInteraction(state: State, friendlyPiece: Piece | null, prevMove: Move): boolean {
        if (friendlyPiece) {
            if (friendlyPiece.icon == this.icon) {
                return true;
            }
            friendlyPiece.x = prevMove.x;
            friendlyPiece.y = prevMove.y;
        }
        return false;
    }
}

export class StarMan extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "StarMan.png";
        this.value = 1;
        this.posValue = 0.1;
        
        if (color == 'black') {
            let m1 = new Move('absolute', 0, 1); m1.impotent=true; this.moves.push(m1);
            this.moves.push(new Move('absolute', -1, 1));
            this.moves.push(new Move('absolute', 1, 1));
        } else {
            let m1 = new Move('absolute', 0, -1); m1.impotent=true; this.moves.push(m1);
            this.moves.push(new Move('absolute', -1, -1));
            this.moves.push(new Move('absolute', 1, -1));
        }
    }
}

export function mongolianKnightFactory(color: string, x: i32, y: i32): Piece {
    return new MongolianKnight(color, x, y);
}

export function weakPawn(color: string, x: i32, y: i32): Piece {
    return new WeakPawn(color, x, y);
}

export function unpromotablePawn(color: string, x: i32, y: i32): Piece {
    return new UnpromotablePawn(color, x, y);
}

export function hatFactory(color: string, x: i32, y: i32): Piece {
    return new Hat(color, x, y);
}

export function clownFactory(color: string, x: i32, y: i32): Piece {
    return new Clown(color, x, y);
}

export function starMan(color: string, x: i32, y: i32): Piece {
    return new StarMan(color, x, y);
}
