
import { Piece, Move, State, Square } from "../types";
import { posValue, cyborgTeleport, giveOppositeColor, findSquareByXY, findPieceByXY } from "../helperFunctions";

export class Cyborg extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Cyborg.png";
        this.value = 1.2;
        this.posValue = 0.1;
        
        if (color == 'black') {
            this.moves.push(new Move('absolute', 0, 2));
        } else {
            this.moves.push(new Move('absolute', 0, -2));
        }
    }
    
    conditionalMoves(state: State): Move[] {
        let toReturn: Move[] = [];
        cyborgTeleport(state, this, toReturn);
        return toReturn;
    }
    
    afterPieceMove(state: State, move: Move, prevMove: Move): boolean {
        if (this.color == 'black' && (this.y == 5 || this.y == 3 || this.y == 1)) {
            this.value = 2.0 + (<f32>this.y) * 0.25;
        } else if (this.color == 'white' && (this.y == 2 || this.y == 4 || this.y == 6)) {
            this.value = 2.0 + (7.0 - <f32>this.y) * 0.25;
        }
        return true;
    }
    
    afterPlayerMove(state: State, move: Move, prevMove: Move): boolean {
        if ((this.color == 'black' && this.y == 7) || (this.color == 'white' && this.y == 0)) {
            state.pieces.push(juggernautFactory(this.color, this.x, this.y));
            let idx = -1;
            for(let i=0; i<state.pieces.length; i++) if (state.pieces[i] == this) idx = i;
            if (idx != -1) state.pieces.splice(idx, 1);
        }
        return false;
    }
    
    friendlyPieceInteraction(state: State, friendlyPiece: Piece | null, prevMove: Move): boolean {
        if (friendlyPiece) {
            let ps = state.pieceSelected;
            if (ps && (friendlyPiece == ps || friendlyPiece.icon == ps.icon)) {
                return true;
            }
            friendlyPiece.x = prevMove.x;
            friendlyPiece.y = prevMove.y;
        }
        return false;
    }
}

// Helper function instead of closure
function isSquareTaken(state: State, x: i32, y: i32): boolean {
    let square = findSquareByXY(state.board, x, y);
    if (!square) return true;
    
    for(let i=0; i<state.pieces.length; i++) {
        if (state.pieces[i].x == x && state.pieces[i].y == y) return true;
    }
    return false;
}

export class Juggernaut extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Juggernaut.png";
        this.value = 10;
        this.posValue = posValue[3];
    }
    
    friendlyPieceInteraction(state: State, friendlyPiece: Piece | null, prevMove: Move): boolean {
        if (friendlyPiece) {
            let ps = state.pieceSelected;
            if (ps && (friendlyPiece == ps || friendlyPiece.icon == ps.icon)) {
                return true;
            }
            friendlyPiece.x = prevMove.x;
            friendlyPiece.y = prevMove.y;
        }
        return false;
    }
    
    conditionalMoves(state: State): Move[] {
        let toReturn: Move[] = [];
        cyborgTeleport(state, this, toReturn);
        
        toReturn.push(new Move('absolute', 0, -1));
        if (!isSquareTaken(state, this.x, this.y - 1)) {
            toReturn.push(new Move('absolute', 0, -2));
            toReturn.push(new Move('absolute', 1, -1));
            toReturn.push(new Move('absolute', -1, -1));
            
            if (!isSquareTaken(state, this.x, this.y - 2)) {
                toReturn.push(new Move('absolute', 0, -3));
                toReturn.push(new Move('absolute', 1, -2));
                toReturn.push(new Move('absolute', -1, -2));
            }
            if (!isSquareTaken(state, this.x - 1, this.y - 1)) {
                toReturn.push(new Move('absolute', -2, -1));
                toReturn.push(new Move('absolute', -1, -2));
            }
            if (!isSquareTaken(state, this.x + 1, this.y - 1)) {
                toReturn.push(new Move('absolute', 2, -1));
                toReturn.push(new Move('absolute', 1, -2));
            }
        }
        
        toReturn.push(new Move('absolute', 0, 1));
        if (!isSquareTaken(state, this.x, this.y + 1)) {
            toReturn.push(new Move('absolute', 0, 2));
            toReturn.push(new Move('absolute', 1, 1));
            toReturn.push(new Move('absolute', -1, 1));
            
            if (!isSquareTaken(state, this.x, this.y + 2)) {
                toReturn.push(new Move('absolute', 0, 3));
                toReturn.push(new Move('absolute', 1, 2));
                toReturn.push(new Move('absolute', -1, 2));
            }
            if (!isSquareTaken(state, this.x - 1, this.y + 1)) {
                toReturn.push(new Move('absolute', -2, 1));
                toReturn.push(new Move('absolute', -1, 2));
            }
            if (!isSquareTaken(state, this.x + 1, this.y + 1)) {
                toReturn.push(new Move('absolute', 2, 1));
                toReturn.push(new Move('absolute', 1, 2));
            }
        }
        
        toReturn.push(new Move('absolute', -1, 0));
        if (!isSquareTaken(state, this.x - 1, this.y)) {
            toReturn.push(new Move('absolute', -2, 0));
            toReturn.push(new Move('absolute', -1, 1));
            toReturn.push(new Move('absolute', -1, -1));
            
            if (!isSquareTaken(state, this.x - 2, this.y)) {
                toReturn.push(new Move('absolute', -3, 0));
                toReturn.push(new Move('absolute', -2, 1));
                toReturn.push(new Move('absolute', -2, -1));
            }
            if (!isSquareTaken(state, this.x - 1, this.y - 1)) {
                toReturn.push(new Move('absolute', -1, -2));
                toReturn.push(new Move('absolute', -2, -1));
            }
            if (!isSquareTaken(state, this.x - 1, this.y + 1)) {
                toReturn.push(new Move('absolute', -1, 2));
                toReturn.push(new Move('absolute', -2, 1));
            }
        }
        
        toReturn.push(new Move('absolute', 1, 0));
        if (!isSquareTaken(state, this.x + 1, this.y)) {
            toReturn.push(new Move('absolute', 2, 0));
            toReturn.push(new Move('absolute', 1, 1));
            toReturn.push(new Move('absolute', 1, -1));
            
            if (!isSquareTaken(state, this.x + 2, this.y)) {
                toReturn.push(new Move('absolute', 3, 0));
                toReturn.push(new Move('absolute', 2, 1));
                toReturn.push(new Move('absolute', 2, -1));
            }
            if (!isSquareTaken(state, this.x + 1, this.y - 1)) {
                toReturn.push(new Move('absolute', 1, -2));
                toReturn.push(new Move('absolute', 2, -1));
            }
            if (!isSquareTaken(state, this.x + 1, this.y + 1)) {
                toReturn.push(new Move('absolute', 1, 2));
                toReturn.push(new Move('absolute', 2, 1));
            }
        }
        
        let unique: Move[] = [];
        for(let i=0; i<toReturn.length; i++) {
            let exists = false;
            for(let j=0; j<unique.length; j++) {
                if (unique[j].x == toReturn[i].x && unique[j].y == toReturn[i].y && unique[j].type == toReturn[i].type) {
                    exists = true;
                    break;
                }
            }
            if (!exists) unique.push(toReturn[i]);
        }
        
        return unique;
    }
}

export class Bootvessel extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Bootvessel.png";
        this.value = 2;
        this.posValue = 0.4;
        
        let m1 = new Move('blockable', 1, 1); m1.repeat=true; m1.missedSquareX=1; m1.missedSquareY=1; m1.offsetX=1; m1.offsetY=1; this.moves.push(m1);
        let m2 = new Move('blockable', -1, -1); m2.repeat=true; m2.missedSquareX=-1; m2.missedSquareY=-1; m2.offsetX=-1; m2.offsetY=-1; this.moves.push(m2);
        let m3 = new Move('blockable', 1, -1); m3.repeat=true; m3.missedSquareX=1; m3.missedSquareY=-1; m3.offsetX=1; m3.offsetY=-1; this.moves.push(m3);
        let m4 = new Move('blockable', -1, 1); m4.repeat=true; m4.missedSquareX=-1; m4.missedSquareY=1; m4.offsetX=-1; m4.offsetY=1; this.moves.push(m4);
    }
    
    conditionalMoves(state: State): Move[] {
        let toReturn: Move[] = [];
        cyborgTeleport(state, this, toReturn);
        return toReturn;
    }
    
    friendlyPieceInteraction(state: State, friendlyPiece: Piece | null, prevMove: Move): boolean {
        if (friendlyPiece) {
            let ps = state.pieceSelected;
            if (ps && (friendlyPiece == ps || friendlyPiece.icon == ps.icon)) {
                return true;
            }
            friendlyPiece.x = prevMove.x;
            friendlyPiece.y = prevMove.y;
        }
        return false;
    }
}

export class EmpoweredCrystal extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "CrystalEmpowered.png";
        this.value = 993;
        this.posValue = posValue[2];
        
        let m1 = new Move('blockable', 0, -1); m1.repeat=true; m1.missedSquareY=-1; m1.offsetY=-1; this.moves.push(m1);
        let m2 = new Move('blockable', 0, 1); m2.repeat=true; m2.missedSquareY=1; m2.offsetY=1; this.moves.push(m2);
        let m3 = new Move('blockable', -1, 0); m3.repeat=true; m3.missedSquareX=-1; m3.offsetX=-1; this.moves.push(m3);
        let m4 = new Move('blockable', 1, 0); m4.repeat=true; m4.missedSquareX=1; m4.offsetX=1; this.moves.push(m4);
        
        let m5 = new Move('blockable', -1, -1); m5.repeat=true; m5.missedSquareX=-1; m5.missedSquareY=-1; m5.offsetX=-1; m5.offsetY=-1; this.moves.push(m5);
        let m6 = new Move('blockable', 1, 1); m6.repeat=true; m6.missedSquareX=1; m6.missedSquareY=1; m6.offsetX=1; m6.offsetY=1; this.moves.push(m6);
        let m7 = new Move('blockable', -1, 1); m7.repeat=true; m7.missedSquareX=-1; m7.missedSquareY=1; m7.offsetX=-1; m7.offsetY=1; this.moves.push(m7);
        let m8 = new Move('blockable', 1, -1); m8.repeat=true; m8.missedSquareX=1; m8.missedSquareY=-1; m8.offsetX=1; m8.offsetY=-1; this.moves.push(m8);
    }
    
    friendlyPieceInteraction(state: State, friendlyPiece: Piece | null, prevMove: Move): boolean {
        if (friendlyPiece) {
            let ps = state.pieceSelected;
            if (ps && (friendlyPiece == ps || friendlyPiece.icon == ps.icon)) {
                return true;
            }
            friendlyPiece.x = prevMove.x;
            friendlyPiece.y = prevMove.y;
        }
        return false;
    }
    
    conditionalMoves(state: State): Move[] {
        let toReturn: Move[] = [];
        cyborgTeleport(state, this, toReturn);
        return toReturn;
    }
    
    afterThisPieceTaken(state: State): boolean {
        let hadIt = false;
        for(let i=0; i<state.pieces.length; i++) {
            let piece = state.pieces[i];
            if (piece.color == this.color && piece.icon.includes('Crystal.png') && piece != this) {
                piece.moves = [];
                for(let j=0; j<this.moves.length; j++) piece.moves.push(this.moves[j].clone());
                
                piece.icon = this.icon;
                piece.value = 993;
                hadIt = true;
            }
        }
        
        if (!hadIt) {
            state.won = giveOppositeColor(this.color);
        }
        return true;
    }
}

export class Executor extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Executor.png";
        this.value = 2.5;
        this.posValue = posValue[3];
        
        let m1 = new Move('blockable', 0, -1); m1.repeat=true; m1.offsetY=-1; m1.missedSquareY=-1; this.moves.push(m1);
        let m2 = new Move('blockable', 0, 1); m2.repeat=true; m2.offsetY=1; m2.missedSquareY=1; this.moves.push(m2);
        let m3 = new Move('blockable', -1, 0); m3.repeat=true; m3.offsetX=-1; m3.missedSquareX=-1; this.moves.push(m3);
        let m4 = new Move('blockable', 1, 0); m4.repeat=true; m4.offsetX=1; m4.missedSquareX=1; this.moves.push(m4);
    }
    
    conditionalMoves(state: State): Move[] {
        let toReturn: Move[] = [];
        cyborgTeleport(state, this, toReturn);
        return toReturn;
    }
    
    friendlyPieceInteraction(state: State, friendlyPiece: Piece | null, prevMove: Move): boolean {
        if (friendlyPiece) {
            let ps = state.pieceSelected;
            if (ps && (friendlyPiece == ps || friendlyPiece.icon == ps.icon)) {
                return true;
            }
            friendlyPiece.x = prevMove.x;
            friendlyPiece.y = prevMove.y;
        }
        return false;
    }
}

export class Crystal extends Piece {
    constructor(color: string, x: i32, y: i32) {
        super(color, x, y);
        this.icon = color + "Crystal.png";
        this.value = 1000;
        this.posValue = posValue[3];
        this.vulnerable = true;
        
        this.moves.push(new Move('absolute', 0, -1));
        this.moves.push(new Move('absolute', 0, 1));
        this.moves.push(new Move('absolute', -1, 0));
        this.moves.push(new Move('absolute', 1, 0));
        this.moves.push(new Move('absolute', -1, -1));
        this.moves.push(new Move('absolute', 1, 1));
        this.moves.push(new Move('absolute', -1, 1));
        this.moves.push(new Move('absolute', 1, -1));
    }
    
    conditionalMoves(state: State): Move[] {
        let toReturn: Move[] = [];
        cyborgTeleport(state, this, toReturn);
        return toReturn;
    }
    
    afterThisPieceTaken(state: State): boolean {
        let hadIt = false;
        
        for(let i=0; i<state.pieces.length; i++) {
            let piece = state.pieces[i];
            if (piece.color == this.color && piece.icon.includes('CrystalEmpowered.png') && piece != this) {
                piece.moves = [];
                for(let j=0; j<this.moves.length; j++) piece.moves.push(this.moves[j].clone());
                
                piece.icon = this.icon;
                piece.value = 1000;
                piece.posValue = this.posValue;
                hadIt = true;
            }
        }
        
        if (!hadIt) {
            state.won = giveOppositeColor(this.color);
        }
        return true;
    }
    
    friendlyPieceInteraction(state: State, friendlyPiece: Piece | null, prevMove: Move): boolean {
        if (friendlyPiece) {
            let ps = state.pieceSelected;
            if (ps && (friendlyPiece == ps || friendlyPiece.icon == ps.icon)) {
                return true;
            }
            friendlyPiece.x = prevMove.x;
            friendlyPiece.y = prevMove.y;
        }
        return false;
    }
}

export function cyborgFactory(color: string, x: i32, y: i32): Piece {
    return new Cyborg(color, x, y);
}

export function juggernautFactory(color: string, x: i32, y: i32): Piece {
    return new Juggernaut(color, x, y);
}

export function bootvesselFactory(color: string, x: i32, y: i32): Piece {
    return new Bootvessel(color, x, y);
}

export function empoweredCrystalFactory(color: string, x: i32, y: i32): Piece {
    return new EmpoweredCrystal(color, x, y);
}

export function executorFactory(color: string, x: i32, y: i32): Piece {
    return new Executor(color, x, y);
}

export function crystalFactory(color: string, x: i32, y: i32): Piece {
    return new Crystal(color, x, y);
}
