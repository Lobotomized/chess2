
import { Piece, Move, State } from "../types";
import { posValue, giveOppositeColor } from "../helperFunctions";

export class Ant extends Piece {
    constructor(color: string, x: i32, y: i32, direction: string) {
        super(color, x, y);
        this.icon = color + "Ant.png";
        this.value = 0.6;
        this.posValue = posValue[2];
        this.direction = direction;
        
        if (this.direction == "") {
            this.direction = color;
        }

        let m: Move;
        if (this.direction == 'black') {
            m = new Move('blockable', 0, 1);
        } else {
            m = new Move('blockable', 0, -1);
        }
        m.repeat = true;
        m.limit = 2;
        this.moves.push(m);

        let wm: Move;
        if (this.direction == 'black') {
            wm = new Move('blockable', 0, 1);
        } else {
            wm = new Move('blockable', 0, -1);
        }
        wm.repeat = true;
        wm.limit = 1;
        this.weakMoves.push(wm);
    }

    afterPieceMove(state: State, move: Move, prevMove: Move): boolean {
        if (this.direction == "") {
            this.direction = this.color;
        }
        
        let checkForLastRow = false;
        for(let i=0; i<state.board.length; i++) {
            if (state.board[i].x == move.x && state.board[i].y > move.y) {
                checkForLastRow = true;
                break;
            }
        }
        
        let isItLast = false;
        if (!checkForLastRow) {
            isItLast = true;
        }

        if ((this.direction == 'white' && move.y == 0) || (this.direction == 'black' && isItLast)) {
            // Remove self
            let idx = -1;
            for(let i=0; i<state.pieces.length; i++) {
                if (state.pieces[i] == this) {
                    idx = i;
                    break;
                }
            }
            if (idx != -1) state.pieces.splice(idx, 1);
            
            state.pieces.push(queenbugFactory(this.color, move.x, move.y));
            return true;
        }
        return true;
    }
}

export class GoliathBug extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "GoliathBug.png";
        this.value = 7.5;
        this.posValue = posValue[3];
        
        // Moves
        this.moves.push(new Move('blockable', 0, -1)); this.moves[this.moves.length-1].repeat = true;
        this.moves.push(new Move('blockable', 0, 1)); this.moves[this.moves.length-1].repeat = true;
        this.moves.push(new Move('blockable', -1, 0)); this.moves[this.moves.length-1].repeat = true;
        this.moves.push(new Move('blockable', 1, 0)); this.moves[this.moves.length-1].repeat = true;
        
        this.moves.push(new Move('absolute', 0, -1));
        this.moves.push(new Move('absolute', 0, 1));
        this.moves.push(new Move('absolute', -1, 0));
        this.moves.push(new Move('absolute', 1, 0));
        this.moves.push(new Move('absolute', -1, -1));
        this.moves.push(new Move('absolute', 1, 1));
        this.moves.push(new Move('absolute', -1, 1));
        this.moves.push(new Move('absolute', 1, -1));

        // WeakMoves
        this.weakMoves.push(new Move('absolute', 0, -1));
        this.weakMoves.push(new Move('absolute', 0, 1));
        this.weakMoves.push(new Move('absolute', -1, 0));
        this.weakMoves.push(new Move('absolute', 1, 0));
        this.weakMoves.push(new Move('absolute', -1, -1));
        this.weakMoves.push(new Move('absolute', 1, 1));
        this.weakMoves.push(new Move('absolute', -1, 1));
        this.weakMoves.push(new Move('absolute', 1, -1));
    }
}

export class StrongLadyBug extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "LadyBug.png";
        this.value = 5.5;
        this.posValue = posValue[3];
        
        this.moves.push(new Move('absolute', 0, -1));
        this.moves.push(new Move('absolute', 0, 1));
        this.moves.push(new Move('absolute', -1, 0));
        this.moves.push(new Move('absolute', 1, 0));
        
        this.weakMoves.push(new Move('absolute', 0, -1));
        this.weakMoves.push(new Move('absolute', 0, 1));
        this.weakMoves.push(new Move('absolute', -1, 0));
        this.weakMoves.push(new Move('absolute', 1, 0));
        this.weakMoves.push(new Move('absolute', -1, -1));
        this.weakMoves.push(new Move('absolute', 1, 1));
        this.weakMoves.push(new Move('absolute', -1, 1));
        this.weakMoves.push(new Move('absolute', 1, -1));
    }
    
    conditionalMoves(state: State): Move[] {
        let arrToReturn: Move[] = [];
        
        let blockedUp = false;
        let blockedDown = false;
        let blockedLeft = false;
        let blockedRight = false;
        
        for(let i=0; i<state.pieces.length; i++) {
            let p = state.pieces[i];
            if (p.y == this.y + 1 && this.x == p.x) blockedUp = true;
            if (p.y == this.y - 1 && this.x == p.x) blockedDown = true;
            if (p.y == this.y && this.x == p.x + 1) blockedLeft = true;
            if (p.y == this.y && this.x == p.x - 1) blockedRight = true;
        }

        if(!blockedUp){
            let m1 = new Move('blockable', 1, 1); m1.repeat=true; m1.offsetY=1; m1.limit=2; m1.offsetCountsAsBlock=true; arrToReturn.push(m1);
            let m2 = new Move('blockable', -1, 1); m2.repeat=true; m2.offsetY=1; m2.limit=2; m2.offsetCountsAsBlock=true; arrToReturn.push(m2);
        }

        if(!blockedDown){
            let m1 = new Move('blockable', 1, -1); m1.repeat=true; m1.offsetY=-1; m1.limit=2; m1.offsetCountsAsBlock=true; arrToReturn.push(m1);
            let m2 = new Move('blockable', -1, -1); m2.repeat=true; m2.offsetY=-1; m2.limit=2; m2.offsetCountsAsBlock=true; arrToReturn.push(m2);
        }

        if(!blockedRight){
            let m1 = new Move('blockable', 1, 1); m1.repeat=true; m1.offsetX=1; m1.limit=2; m1.offsetCountsAsBlock=true; arrToReturn.push(m1);
            let m2 = new Move('blockable', 1, -1); m2.repeat=true; m1.offsetX=1; m1.limit=2; m1.offsetCountsAsBlock=true; arrToReturn.push(m2);
        }

        if(!blockedLeft){
            let m1 = new Move('blockable', -1, -1); m1.repeat=true; m1.offsetX=-1; m1.limit=2; m1.offsetCountsAsBlock=true; arrToReturn.push(m1);
            let m2 = new Move('blockable', -1, 1); m2.repeat=true; m1.offsetX=-1; m1.limit=2; m1.offsetCountsAsBlock=true; arrToReturn.push(m2);
        }

        return arrToReturn;
    }
}

export class LadyBug extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "LadyBug.png";
        this.value = 7.5;
        this.posValue = posValue[3];
        
        this.moves.push(new Move('absolute', 0, -1));
        this.moves.push(new Move('absolute', 0, 1));
        this.moves.push(new Move('absolute', -1, 0));
        this.moves.push(new Move('absolute', 1, 0));
        
        this.weakMoves.push(new Move('absolute', 0, -1));
        this.weakMoves.push(new Move('absolute', 0, 1));
        this.weakMoves.push(new Move('absolute', -1, 0));
        this.weakMoves.push(new Move('absolute', 1, 0));
        this.weakMoves.push(new Move('absolute', -1, -1));
        this.weakMoves.push(new Move('absolute', 1, 1));
        this.weakMoves.push(new Move('absolute', -1, 1));
        this.weakMoves.push(new Move('absolute', 1, -1));
    }

    conditionalMoves(state: State): Move[] {
        let arrToReturn: Move[] = [];
        
        let shroomsCount = 0;
        for(let i=0; i<state.pieces.length; i++) {
            if (state.pieces[i].color == this.color && state.pieces[i].icon == this.color + "Shroom.png") {
                shroomsCount++;
            }
        }
        
        if (shroomsCount < 2) return [];

        let blockedUp = false;
        let blockedDown = false;
        let blockedLeft = false;
        let blockedRight = false;
        
        for(let i=0; i<state.pieces.length; i++) {
            let p = state.pieces[i];
            if (p.y == this.y + 1 && this.x == p.x) blockedUp = true;
            if (p.y == this.y - 1 && this.x == p.x) blockedDown = true;
            if (p.y == this.y && this.x == p.x + 1) blockedLeft = true;
            if (p.y == this.y && this.x == p.x - 1) blockedRight = true;
        }

        if(!blockedUp){
            let m1 = new Move('blockable', 1, 1); m1.repeat=true; m1.offsetY=1; m1.limit=2; m1.offsetCountsAsBlock=true; arrToReturn.push(m1);
            let m2 = new Move('blockable', -1, 1); m2.repeat=true; m2.offsetY=1; m2.limit=2; m2.offsetCountsAsBlock=true; arrToReturn.push(m2);
        }

        if(!blockedDown){
            let m1 = new Move('blockable', 1, -1); m1.repeat=true; m1.offsetY=-1; m1.limit=2; m1.offsetCountsAsBlock=true; arrToReturn.push(m1);
            let m2 = new Move('blockable', -1, -1); m2.repeat=true; m2.offsetY=-1; m2.limit=2; m2.offsetCountsAsBlock=true; arrToReturn.push(m2);
        }

        if(!blockedRight){
            let m1 = new Move('blockable', 1, 1); m1.repeat=true; m1.offsetX=1; m1.limit=2; m1.offsetCountsAsBlock=true; arrToReturn.push(m1);
            let m2 = new Move('blockable', 1, -1); m2.repeat=true; m1.offsetX=1; m1.limit=2; m1.offsetCountsAsBlock=true; arrToReturn.push(m2);
        }

        if(!blockedLeft){
            let m1 = new Move('blockable', -1, -1); m1.repeat=true; m1.offsetX=-1; m1.limit=2; m1.offsetCountsAsBlock=true; arrToReturn.push(m1);
            let m2 = new Move('blockable', -1, 1); m2.repeat=true; m1.offsetX=-1; m1.limit=2; m1.offsetCountsAsBlock=true; arrToReturn.push(m2);
        }

        return arrToReturn;
    }
}

export class Spider extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Spider.png";
        this.value = 5;
        this.posValue = posValue[3];
        
        this.moves.push(new Move('absolute', 1, 2));
        this.moves.push(new Move('absolute', -1, 2));
        this.moves.push(new Move('absolute', 1, -2));
        this.moves.push(new Move('absolute', -1, -2));
        this.moves.push(new Move('absolute', 2, 1));
        this.moves.push(new Move('absolute', -2, 1));
        this.moves.push(new Move('absolute', 2, -1));
        this.moves.push(new Move('absolute', -2, -1));
        this.moves.push(new Move('absolute', 0, -1));
        this.moves.push(new Move('absolute', 0, 1));
        this.moves.push(new Move('absolute', -1, 0));
        this.moves.push(new Move('absolute', 1, 0));
        this.moves.push(new Move('absolute', -1, -1));
        this.moves.push(new Move('absolute', 1, 1));
        this.moves.push(new Move('absolute', -1, 1));
        this.moves.push(new Move('absolute', 1, -1));
        
        this.weakMoves.push(new Move('absolute', 0, -1));
        this.weakMoves.push(new Move('absolute', 0, 1));
        this.weakMoves.push(new Move('absolute', -1, 0));
        this.weakMoves.push(new Move('absolute', 1, 0));
        this.weakMoves.push(new Move('absolute', -1, -1));
        this.weakMoves.push(new Move('absolute', 1, 1));
        this.weakMoves.push(new Move('absolute', -1, 1));
        this.weakMoves.push(new Move('absolute', 1, -1));
    }
}

export class Shroom extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Shroom.png";
        this.value = 1000;
        this.posValue = 1;
    }
    
    afterThisPieceTaken(state: State): boolean {
        for(let i=0; i<state.pieces.length; i++) {
            let piece = state.pieces[i];
            if(piece.color == this.color) {
                if(piece.weakMoves.length > 0) {
                    if(piece.moves.length == piece.weakMoves.length) { 
                        // Simplified check, normally should check content
                        state.won = giveOppositeColor(this.color);
                    } else {
                        if(piece.icon.includes('Ant.png')) {
                            piece.value = 0.4;
                        } else if(piece.icon.includes('Shroom.png')) {
                            piece.value = 2000;
                        } else {
                            piece.value = 2.5;
                        }
                        // Assign weakMoves to moves
                        piece.moves = [];
                        for(let j=0; j<piece.weakMoves.length; j++) {
                            piece.moves.push(piece.weakMoves[j].clone());
                        }
                    }
                }
            }
        }
        return true;
    }
}

export class QueenBug extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "QueenBug.png";
        this.value = 2.5;
        this.posValue = posValue[2];
        
        let m1 = new Move('absolute', 0, -1); m1.impotent=true; this.moves.push(m1);
        let m2 = new Move('absolute', 0, 1); m2.impotent=true; this.moves.push(m2);
        let m3 = new Move('absolute', -1, 0); m3.impotent=true; this.moves.push(m3);
        let m4 = new Move('absolute', 1, 0); m4.impotent=true; this.moves.push(m4);
    }
    
    afterPieceMove(state: State, move: Move, prevMove: Move): boolean {
        let color = this.color;
        let direction = 'white';
        if (this.y == 0 || this.y == 1 || this.y == 2) direction = 'black';
        
        this.x = prevMove.x;
        this.y = prevMove.y;
        
        let ant = antFactory(color, move.x, move.y, direction);
        state.pieces.push(ant);
        
        let shroomsCount = 0;
        for(let i=0; i<state.pieces.length; i++) {
            if (state.pieces[i].icon == color + 'Shroom.png') shroomsCount++;
        }
        
        if (shroomsCount < 2) {
            ant.moves = [];
            for(let j=0; j<ant.weakMoves.length; j++) {
                ant.moves.push(ant.weakMoves[j].clone());
            }
        }
        return true;
    }
}

export class NewBrainBug extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "BrainBug.png";
        this.value = 3;
        this.posValue = 0.1;
        
        let m = new Move('takeMove', 1, 1);
        m.repeat = true;
        this.moves.push(m);
    }
}

export function antFactory(color: string, x: i32, y: i32, direction: string): Piece {
    return new Ant(color, x, y, direction);
}

export function goliathBugFactory(color: string, x: i32, y: i32): Piece {
    return new GoliathBug(color, x, y);
}

export function strongLadyBugFactory(color: string, x: i32, y: i32): Piece {
    return new StrongLadyBug(color, x, y);
}

export function ladyBugFactory(color: string, x: i32, y: i32): Piece {
    return new LadyBug(color, x, y);
}

export function spiderFactory(color: string, x: i32, y: i32): Piece {
    return new Spider(color, x, y);
}

export function shroomFactory(color: string, x: i32, y: i32): Piece {
    return new Shroom(color, x, y);
}

export function queenbugFactory(color: string, x: i32, y: i32): Piece {
    return new QueenBug(color, x, y);
}

export function newBrainBugFactory(color: string, x: i32, y: i32): Piece {
    return new NewBrainBug(color, x, y);
}
