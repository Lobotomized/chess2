import { State, Piece, Square } from "../types";
import { isPositionAttacked, findPieceByXY } from "../helperFunctions";

export class FilterOptions {
    allowedMoves: Square[] = [];
    piece: Piece | null = null;
    color: string = "";
    state: State | null = null;
    
    n: f32 = 0.0;
    maximum: i32 = 0;
    minPieceValue: f32 = 0.0;
    maxPieceValue: f32 = 0.0;
    randomException: f32 = 0.5;
    exceptions: string[] = []; // array of exception names
}

export function exceptionsChecker(options: FilterOptions): boolean {
    for (let i = 0; i < options.exceptions.length; i++) {
        let ex = options.exceptions[i];
        if (ex == "pieceValueMustBeBiggerThanException") {
            if (options.piece && options.piece!.value > options.minPieceValue) return true;
        } else if (ex == "pieceValueMustBeSmallerThanException") {
            if (options.piece && options.piece!.value < options.maxPieceValue) return true;
        } else if (ex == "pieceAttackedException") {
            if (options.piece && options.state && isPositionAttacked(options.state!, options.color, options.piece!.x, options.piece!.y)) return true;
        } else if (ex == "randomException") {
            if (Math.random() > options.randomException) return true;
        }
    }
    return false;
}

export function randomlyRemove1NthFilter(options: FilterOptions): Square[] {
    let allowedMoves = options.allowedMoves;
    if (exceptionsChecker(options)) return allowedMoves;
    
    let halfLength = <i32>Math.floor(<f32>allowedMoves.length / options.n);
    for (let i = 0; i < halfLength; i++) {
        if (allowedMoves.length > 0) {
            let randomIndex = <i32>Math.floor(Math.random() * <f64>allowedMoves.length);
            allowedMoves.splice(randomIndex, 1);
        }
    }
    return allowedMoves;
}

export function removeAttackedMovesFilter(options: FilterOptions): Square[] {
    let allowedMoves = options.allowedMoves;
    if (exceptionsChecker(options)) return allowedMoves;
    
    let res: Square[] = [];
    for (let i = 0; i < allowedMoves.length; i++) {
        let am = allowedMoves[i];
        if (!isPositionAttacked(options.state!, options.color, am.x, am.y)) {
            res.push(am);
        }
    }
    return res;
}

export function maxNumberOfMovesPerPieceFilter(options: FilterOptions): Square[] {
    let allowedMoves = options.allowedMoves;
    if (exceptionsChecker(options)) return allowedMoves;
    
    if (allowedMoves.length > options.maximum) {
        let sliced: Square[] = [];
        for (let i = 0; i < options.maximum; i++) sliced.push(allowedMoves[i]);
        return sliced;
    } else {
        return [];
    }
}

export function removeNonAttackingMovesFilter(options: FilterOptions): Square[] {
    let allowedMoves = options.allowedMoves;
    if (exceptionsChecker(options)) return allowedMoves;
    
    let res: Square[] = [];
    for (let i = 0; i < allowedMoves.length; i++) {
        let am = allowedMoves[i];
        let foundPieceIdx = findPieceByXY(options.state!.pieces, am.x, am.y);
        if (foundPieceIdx > -1 && options.state!.pieces[foundPieceIdx].color != options.color) {
            res.push(am);
        }
    }
    return res;
}

export function applyFilters(filters: FilterOptions[], options: FilterOptions): Square[] {
    let allowedMoves = options.allowedMoves;
    for (let i = 0; i < filters.length; i++) {
        let f = filters[i];
        f.allowedMoves = allowedMoves;
        f.piece = options.piece;
        f.color = options.color;
        f.state = options.state;
        
        let type = f.exceptions.length > 0 && f.exceptions[0].startsWith("type:") ? f.exceptions[0].substring(5) : "";
        if (type == "randomlyRemove1NthFilter") {
            allowedMoves = randomlyRemove1NthFilter(f);
        } else if (type == "removeAttackedMovesFilter") {
            allowedMoves = removeAttackedMovesFilter(f);
        } else if (type == "maxNumberOfMovesPerPieceFilter") {
            allowedMoves = maxNumberOfMovesPerPieceFilter(f);
        } else if (type == "removeNonAttackingMovesFilter") {
            allowedMoves = removeNonAttackingMovesFilter(f);
        }
    }
    return allowedMoves;
}
