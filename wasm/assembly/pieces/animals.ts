
import { Piece, Move, State } from "../types";
import { posValue, findCopyPieceByXY } from "../helperFunctions";
// removed self import

export class Ghost extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Ghost.png";
        this.value = 0.6;
        this.posValue = posValue[2];
        
        if (color == 'black') {
            this.moves.push(new Move('absolute', 0, 1));
            this.moves.push(new Move('absolute', 0, 2));
        } else {
            this.moves.push(new Move('absolute', 0, -1));
            this.moves.push(new Move('absolute', 0, -2));
        }
    }
}

export class Pig extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Pig.png";
        this.value = 1.66;
        this.posValue = posValue[2];
        
        let m = new Move('blockable', 0, -1);
        if (color == 'black') {
            m = new Move('blockable', 0, 1);
        }
        m.repeat = true;
        this.moves.push(m);
    }
}

export class Ricar extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Ricar.png";
        this.value = 2.5;
        this.posValue = posValue[3];
        
        this.moves.push(new Move('absolute', 0, -2));
        this.moves.push(new Move('absolute', 0, 2));
        this.moves.push(new Move('absolute', -2, 0));
        this.moves.push(new Move('absolute', 2, 0));
        this.moves.push(new Move('absolute', -2, -2));
        this.moves.push(new Move('absolute', 2, 2));
        this.moves.push(new Move('absolute', -2, 2));
        this.moves.push(new Move('absolute', 2, -2));
    }
    
    afterPlayerMove(state: State, move: Move, prevMove: Move): boolean {
        let direction = 1;
        if (this.color == 'black') direction = -1;
        
        const copy = findCopyPieceByXY(state.pieces, this.x, this.y + direction);
        let squareCheck = false;
        for(let i=0; i<state.board.length; i++) {
            if (state.board[i].x == this.x && state.board[i].y == this.y + direction) {
                squareCheck = true;
                break;
            }
        }
        
        if (copy || squareCheck) {
            this.value = 4;
        } else {
            this.value = 2.5;
        }
        return false;
    }
    
    afterThisPieceTaken(state: State): boolean {
        let direction = 1;
        if (this.color == 'black') direction = -1;
        
        const copy = findCopyPieceByXY(state.pieces, this.x, this.y + direction);
        let squareCheck = false;
        for(let i=0; i<state.board.length; i++) {
            if (state.board[i].x == this.x && state.board[i].y == this.y + direction) {
                squareCheck = true;
                break;
            }
        }
        
        if (!copy && squareCheck) {
            state.pieces.push(ghostFactory(this.color, this.x, this.y + direction));
        }
        return true;
    }
}

export class Horse extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Horse.png";
        this.value = 5;
        this.posValue = posValue[3];
        
        let m1 = new Move('blockable', 0, -1); m1.repeat=true; m1.limit=3; this.moves.push(m1);
        let m2 = new Move('blockable', 0, 1); m2.repeat=true; m2.limit=3; this.moves.push(m2);
        let m3 = new Move('blockable', -1, 0); m3.repeat=true; m3.limit=3; this.moves.push(m3);
        let m4 = new Move('blockable', 1, 0); m4.repeat=true; m4.limit=3; this.moves.push(m4);
        let m5 = new Move('blockable', -1, -1); m5.repeat=true; m5.limit=3; this.moves.push(m5);
        let m6 = new Move('blockable', 1, 1); m6.repeat=true; m6.limit=3; this.moves.push(m6);
        let m7 = new Move('blockable', -1, 1); m7.repeat=true; m7.limit=3; this.moves.push(m7);
        let m8 = new Move('blockable', 1, -1); m8.repeat=true; m8.limit=3; this.moves.push(m8);
    }
}

export class Dragon extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Dragon.png";
        this.value = 8.5; // From logic in medieval.js it seems Dragon is strong. animals.js doesn't set value? Wait, animals.js says:
        // dragonFactory returns object with NO value property set explicitly in return?
        // Ah, animals.js:121 dragonFactory.
        // It returns { color, x, y, icon, moves }. No value.
        // Default value? 
        // I'll assume standard value or 5.
        // Actually medieval.js sets it to 8.5 when promoting.
        this.posValue = posValue[3];
        
        this.moves.push(new Move('blockable', 0, -1)); this.moves[0].repeat=true;
        this.moves.push(new Move('blockable', 0, 1)); this.moves[1].repeat=true;
        this.moves.push(new Move('blockable', -1, 0)); this.moves[2].repeat=true;
        this.moves.push(new Move('blockable', 1, 0)); this.moves[3].repeat=true;
        
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

export class SleepingDragon extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "SleepingDragon.png";
        this.value = 1;
        this.posValue = 0.1;
    }
}

export function ghostFactory(color: string, x: i32, y: i32): Piece {
    return new Ghost(color, x, y);
}

export function pigFactory(color: string, x: i32, y: i32): Piece {
    return new Pig(color, x, y);
}

export function ricarFactory(color: string, x: i32, y: i32): Piece {
    return new Ricar(color, x, y);
}

export function horseFactory(color: string, x: i32, y: i32): Piece {
    return new Horse(color, x, y);
}

export function dragonFactory(color: string, x: i32, y: i32): Piece {
    return new Dragon(color, x, y);
}

export function sleepingDragon(color: string, x: i32, y: i32): Piece {
    return new SleepingDragon(color, x, y);
}
