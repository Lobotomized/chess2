
import { Piece, Move, State } from "../types";
import { posValue, giveOppositeColor } from "../helperFunctions";
// import { Dragon } from "./animals"; // Circular dependency risk if animals imports medieval? No.
// But animals.ts doesn't import medieval.
// However, I'll just redefine moves or use factory pattern if I can import.
// I'll try to duplicate moves for Dragon to avoid dependency issues for now, or use a helper.

export class Swordsmen extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Swordsmen.png";
        this.value = 1;
        this.posValue = 0.1;
        
        if (color == 'black') {
            this.moves.push(new Move('absolute', 0, 1));
            this.moves.push(new Move('absolute', -1, 1));
            this.moves.push(new Move('absolute', 1, 1));
        } else {
            this.moves.push(new Move('absolute', 0, -1));
            this.moves.push(new Move('absolute', -1, -1));
            this.moves.push(new Move('absolute', 1, -1));
        }
    }
}

export class NorthernKing extends Piece {
    constructor(color: string, x: i32, y: i32, options: i32 = -1) {
        super(color, x, y);
        this.icon = color + "NorthernKing.png";
        this.value = 800;
        this.posValue = 1;
        this.yTrigger = options;
        
        if (color == 'black') {
            this.moves.push(new Move('absolute', 0, 1));
            this.moves.push(new Move('absolute', -1, 1));
            this.moves.push(new Move('absolute', 1, 1));
        } else {
            this.moves.push(new Move('absolute', 0, -1));
            this.moves.push(new Move('absolute', -1, -1));
            this.moves.push(new Move('absolute', 1, -1));
        }
    }
    
    afterThisPieceTaken(state: State): boolean {
        let find = false;
        for(let i=0; i<state.pieces.length; i++) {
            if (state.pieces[i].icon == this.color + 'PlagueDoctor.png') {
                find = true;
                break;
            }
        }
        if (!find) {
            state.won = giveOppositeColor(this.color);
        }
        return true;
    }
    
    afterPieceMove(state: State, move: Move, prevMove: Move): boolean {
        if (this.color == 'black') {
            if (this.y == 7) {
                this.value = 2000;
                state.won = 'black';
            } else {
                this.value = 800 + <f32>this.y;
            }
        } else if (this.color == 'white') {
             if (this.y == 0) {
                 this.value = 2000;
                 state.won = 'white';
             } else {
                 this.value = 800 + <f32>this.y;
             }
        }
        
        this.value += 2;
        
        let promoteCondition = (this.color == 'black' && this.y == 3) || (this.color == 'white' && this.y == 4);
        let fencerPower = this.color == 'black' ? this.y : 7 - this.y;
        
        if (this.yTrigger != -1) {
            promoteCondition = this.y == this.yTrigger;
        }
        
        if (promoteCondition) {
            for(let i=0; i<state.pieces.length; i++) {
                let piece = state.pieces[i];
                if (piece.color == this.color && (piece.icon == piece.color + 'Pikeman.png' || piece.icon == piece.color + 'Swordsmen.png')) {
                    piece.icon = piece.color + 'Knight.png';
                    piece.moves = [];
                    piece.moves.push(new Move('absolute', 1, 2));
                    piece.moves.push(new Move('absolute', -1, 2));
                    piece.moves.push(new Move('absolute', 1, -2));
                    piece.moves.push(new Move('absolute', -1, -2));
                    piece.moves.push(new Move('absolute', 2, 1));
                    piece.moves.push(new Move('absolute', -2, 1));
                    piece.moves.push(new Move('absolute', 2, -1));
                    piece.moves.push(new Move('absolute', -2, -1));
                    piece.value = <f32>fencerPower;
                    piece.posValue = posValue[3];
                }
            }
        }
        
        for(let i=0; i<state.pieces.length; i++) {
            let piece = state.pieces[i];
            if (piece.color == this.color && piece.icon == piece.color + 'Fencer.png') {
                piece.moves = [];
                for(let j = fencerPower; j > 0; j--) {
                    piece.moves.push(new Move('absolute', j, j));
                    piece.moves.push(new Move('absolute', -j, -j));
                    piece.moves.push(new Move('absolute', j, -j));
                    piece.moves.push(new Move('absolute', -j, j));
                }
                piece.value = <f32>fencerPower * 1.2;
            }
        }
        
        return true;
    }
}

export class Pikeman extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Pikeman.png";
        this.value = 1;
        this.posValue = 0.1;
        
        if (color == 'black') {
             let m1 = new Move('absolute', 0, 1); m1.impotent=true; this.moves.push(m1);
             let m2 = new Move('absolute', -1, 0); m2.impotent=true; this.moves.push(m2);
             let m3 = new Move('absolute', 1, 0); m3.impotent=true; this.moves.push(m3);
             
             this.moves.push(new Move('takeMove', 0, 2));
             this.moves.push(new Move('takeMove', 1, 2));
             this.moves.push(new Move('takeMove', -1, 2));
        } else {
             let m1 = new Move('absolute', 0, -1); m1.impotent=true; this.moves.push(m1);
             let m2 = new Move('absolute', -1, 0); m2.impotent=true; this.moves.push(m2);
             let m3 = new Move('absolute', 1, 0); m3.impotent=true; this.moves.push(m3);
             
             this.moves.push(new Move('takeMove', 0, -2));
             this.moves.push(new Move('takeMove', 1, -2));
             this.moves.push(new Move('takeMove', -1, -2));
        }
    }
}

export class Kolba extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Kolba.png";
        this.value = 999;
        this.posValue = 0.1;
    }
    
    afterPlayerMove(state: State, move: Move, prevMove: Move): boolean {
        let findRook: Piece | null = null;
        for(let i=0; i<state.pieces.length; i++) {
            if (state.pieces[i].icon == 'blackRook.png') {
                findRook = state.pieces[i];
                break;
            }
        }
        
        if (findRook) {
            this.value = 999 + <f32>(Math.abs(findRook.x - this.x) + Math.abs(findRook.y - this.y));
        } else {
            this.value = 9999;
        }
        return false;
    }
    
    afterThisPieceTaken(state: State): boolean {
        state.won = giveOppositeColor(this.color);
        return true;
    }
}

export class Gargoyle extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Gargoyle.png";
        this.value = 2.5;
        this.posValue = 0.1;
    }
}

export class Fencer extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Fencer.png";
        this.value = 1;
        this.posValue = 0.1;
    }
}

export class General extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "General.png";
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

export class Shield extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Shield.png";
        this.value = 2.5;
        this.posValue = 0.1;
        
        let m1 = new Move('blockable', -1, 0); m1.repeat=true; this.moves.push(m1);
        let m2 = new Move('blockable', 1, 0); m2.repeat=true; this.moves.push(m2);
        
        let m3 = new Move('blockable', 0, -1); m3.repeat=true; m3.limit=1; this.moves.push(m3);
        let m4 = new Move('blockable', 0, 1); m4.repeat=true; m4.limit=1; this.moves.push(m4);
    }
}

export class PlagueDoctor extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "PlagueDoctor.png";
        this.value = 800;
        this.posValue = 1;
        
        if (color == 'black') {
            this.moves.push(new Move('absolute', 0, 1));
            this.moves.push(new Move('absolute', -1, 1));
            this.moves.push(new Move('absolute', 1, 1));
        } else {
            this.moves.push(new Move('absolute', 0, -1));
            this.moves.push(new Move('absolute', -1, -1));
            this.moves.push(new Move('absolute', 1, -1));
        }
    }
    
    afterThisPieceTaken(state: State): boolean {
        let find = false;
        for(let i=0; i<state.pieces.length; i++) {
            if (state.pieces[i].icon == this.color + 'NorthernKing.png') {
                find = true;
                break;
            }
        }
        if (!find) {
            state.won = giveOppositeColor(this.color);
        }
        return true;
    }
    
    afterPieceMove(state: State, move: Move, prevMove: Move): boolean {
        if (this.color == 'black') {
            if (this.y == 7) {
                this.value = 1000;
                state.won = 'black';
            } else {
                this.value = 800 + <f32>this.y;
            }
        } else if (this.color == 'white') {
             if (this.y == 0) {
                 this.value = 1000;
                 state.won = 'white';
             } else {
                 this.value = 800 + <f32>this.y;
             }
        }
        
        this.value += 2;
        
        let promoteCondition = (this.color == 'black' && this.y == 3) || (this.color == 'white' && this.y == 4);
        let kolbaPower = this.color == 'black' ? this.y : 7 - this.y;
        
        if (promoteCondition) {
            for(let i=0; i<state.pieces.length; i++) {
                let piece = state.pieces[i];
                if (piece.color == this.color && piece.icon == piece.color + 'SleepingDragon.png') {
                    piece.icon = piece.color + 'Dragon.png';
                    piece.moves = [];
                    // Dragon moves
                    let m1 = new Move('blockable', 0, -1); m1.repeat=true; piece.moves.push(m1);
                    let m2 = new Move('blockable', 0, 1); m2.repeat=true; piece.moves.push(m2);
                    let m3 = new Move('blockable', -1, 0); m3.repeat=true; piece.moves.push(m3);
                    let m4 = new Move('blockable', 1, 0); m4.repeat=true; piece.moves.push(m4);
                    
                    piece.moves.push(new Move('absolute', 1, 2));
                    piece.moves.push(new Move('absolute', -1, 2));
                    piece.moves.push(new Move('absolute', 1, -2));
                    piece.moves.push(new Move('absolute', -1, -2));
                    piece.moves.push(new Move('absolute', 2, 1));
                    piece.moves.push(new Move('absolute', -2, 1));
                    piece.moves.push(new Move('absolute', 2, -1));
                    piece.moves.push(new Move('absolute', -2, -1));
                    
                    piece.value = 8.5;
                    piece.posValue = posValue[3];
                }
            }
        }
        
        for(let i=0; i<state.pieces.length; i++) {
            let piece = state.pieces[i];
            if (piece.color == this.color && piece.icon == piece.color + 'Gargoyle.png') {
                for(let j = kolbaPower; j > 0; j--) {
                    piece.moves.push(new Move('absolute', 0, j));
                    piece.moves.push(new Move('absolute', 0, -j));
                    piece.moves.push(new Move('absolute', j, 0));
                    piece.moves.push(new Move('absolute', -j, 0));
                }
                piece.value = <f32>kolbaPower;
            }
        }
        
        return true;
    }
}

export function swordsMen(color: string, x: i32, y: i32): Piece {
    return new Swordsmen(color, x, y);
}

export function northernKing(color: string, x: i32, y: i32, options: i32 = -1): Piece {
    return new NorthernKing(color, x, y, options);
}

export function pikeman(color: string, x: i32, y: i32): Piece {
    return new Pikeman(color, x, y);
}

export function kolbaFactory(color: string, x: i32, y: i32): Piece {
    return new Kolba(color, x, y);
}

export function gargoyleFactory(color: string, x: i32, y: i32): Piece {
    return new Gargoyle(color, x, y);
}

export function fencer(color: string, x: i32, y: i32): Piece {
    return new Fencer(color, x, y);
}

export function general(color: string, x: i32, y: i32): Piece {
    return new General(color, x, y);
}

export function shield(color: string, x: i32, y: i32): Piece {
    return new Shield(color, x, y);
}

export function plagueDoctor(color: string, x: i32, y: i32): Piece {
    return new PlagueDoctor(color, x, y);
}
