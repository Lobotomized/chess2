
import { State, Piece, Square, Move } from "./types";

export const posValue: f32[] = [
    0.1,
    0.5,
    1.0,
    2.0,
    3.0,
    4.0
];

export function findSquareByXY(board: Square[], x: i32, y: i32): Square | null {
    for (let i = 0; i < board.length; i++) {
        if (board[i].x == x && board[i].y == y) return board[i];
    }
    // console.log("Square not found: " + x.toString() + "," + y.toString());
    return null;
}

export function findPieceByXY(pieces: Piece[], x: i32, y: i32): i32 {
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].x == x && pieces[i].y == y) return i;
    }
    return -1;
}

export function findCopyPieceByXY(pieces: Piece[], x: i32, y: i32): Piece | null {
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].x == x && pieces[i].y == y) return pieces[i];
    }
    return null;
}

export function pieceFromSquare(square: Square, pieces: Piece[]): Piece | null {
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].x == square.x && pieces[i].y == square.y) return pieces[i];
    }
    return null;
}

export function pieceFromXY(x: i32, y: i32, pieces: Piece[]): Piece | null {
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].x == x && pieces[i].y == y) return pieces[i];
    }
    return null;
}

export function returnPieceWithColor(x: i32, y: i32, color: string, state: State): Piece | null {
    for (let i = 0; i < state.pieces.length; i++) {
        let p = state.pieces[i];
        if (p.x == x && p.y == y && p.color == color) return p;
    }
    return null;
}

export function getColorPieces(pieces: Piece[], color: string): Piece[] {
    let result: Piece[] = [];
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].color == color) result.push(pieces[i]);
    }
    return result;
}

export function closeLights(board: Square[], flag: string = 'light'): void {
    for (let i = 0; i < board.length; i++) {
        if (flag == 'light') board[i].light = false;
        else if (flag == 'allowedMove') board[i].allowedMove = false;
        else if (flag == 'blocked') board[i].blocked = false; 
        else if (flag == 'counted') board[i].counted = false;
    }
}

export function checkEmptyHorizontalBetween(state: State, pieceOne: Piece, pieceTwo: Piece): boolean {
    let direction = false;
    let checker = true;
    let actor = pieceOne;
    
    if (pieceOne.x > pieceTwo.x) {
        direction = true;
    }
    
    let distance: i32 = 0;
    
    if (direction) {
        distance = pieceOne.x - pieceTwo.x;
    } else {
        distance = pieceTwo.x - pieceOne.x;
        actor = pieceTwo;
    }
    
    distance -= 1;
    while (distance > 0) {
        let idx = findPieceByXY(state.pieces, actor.x - distance, actor.y);
        if (idx != -1) {
            checker = false;
        }
        distance--;
    }
    return checker;
}

export function giveOppositeColor(color: string): string {
    if (color == 'white') {
        return 'black';
    }
    return 'white';
}

export function getEnemy(color: string): string {
    return giveOppositeColor(color);
}

export function blockableCheck(state: State, powerX: i32, powerY: i32, x: i32, y: i32, move: Move, limit: i32, myPiece: Piece, flag: string, counter: i32 = 0, minimal: boolean = false, secondFlag: string = ""): string | null {
    let toReturn: string | null = null;
    let missedSquareX = move.missedSquareX;
    let missedSquareY = move.missedSquareY;

    if (limit == 0) {
        return null;
    }

    const square = findSquareByXY(state.board, powerX + x, powerY + y);
    if (!square) {
        return null;
    }

    let directionX = 0;
    if (powerX < 0) directionX = -1;
    else if (powerX > 0) directionX = 1;

    let directionY = 0;
    if (powerY < 0) directionY = -1;
    else if (powerY > 0) directionY = 1;

    // Default to 0 if not set
    
    const secondPiece = findCopyPieceByXY(state.pieces, x + powerX, y + powerY);

    if (!secondPiece && !(x + powerX == myPiece.x && y + powerY == myPiece.y)) {
        return blockableCheck(state, powerX + directionX + missedSquareX, powerY + directionY + missedSquareY, x, y, move, limit - 1, myPiece, flag, counter + 1, minimal, secondFlag);
    } else {
        if (secondPiece) {
            if (secondPiece.x == myPiece.x && secondPiece.y == myPiece.y) {
                toReturn = 'block';
                return 'block';
            }
        } else {
            if (x + powerX == myPiece.x && y + powerY == myPiece.y) {
                toReturn = 'block';
                return 'block';
            }
        }
    }
    return toReturn;
}

export function blockableSpecialFunction(properties: BlockableProps): void {
    let state = properties.state;
    let powerX = properties.powerX;
    let powerY = properties.powerY;
    let x = properties.x;
    let y = properties.y;
    let move = properties.move;
    let limit = properties.limit;
    let flag = properties.flag;
    let secondFlag = properties.secondFlag;
    let operatedPiece = properties.operatedPiece;
    let offsetX = properties.offsetX;
    let offsetY = properties.offsetY;
    let missedSquareX = properties.missedSquareX;
    let missedSquareY = properties.missedSquareY;

    if (flag == "") flag = 'light';
    if (limit == 0) return;

    const square = findSquareByXY(state.board, powerX + x, powerY + y);
    if (!square) return;
    
    const piece = pieceFromSquare(square, state.pieces);

    let directionX = 0;
    if (powerX < 0) directionX = -1;
    else if (powerX > 0) directionX = 1;

    let directionY = 0;
    if (powerY < 0) directionY = -1;
    else if (powerY > 0) directionY = 1;

    if (!piece) {
        if (flag == 'light') square.light = true;
        else if (flag == 'allowedMove') square.allowedMove = true;
        else if (flag == 'blocked') square.blocked = true;
        else if (flag == 'counted') square.counted = true;

        let props = new BlockableProps(state, powerX + directionX + missedSquareX, powerY + directionY + missedSquareY, x, y, move, limit - 1, flag, secondFlag, missedSquareX, missedSquareY, properties.minimal, operatedPiece, offsetX, offsetY);
        blockableSpecialFunction(props);
    } else if (((piece.color != operatedPiece.color && !move.friendlyPieces) || (piece.color == operatedPiece.color && move.friendlyPieces)) && properties.minimal && !move.impotent) {
        if (flag == 'light') square.light = true;
        else if (flag == 'allowedMove') square.allowedMove = true;
        else if (flag == 'blocked') square.blocked = true;
        else if (flag == 'counted') square.counted = true;
    } else if (piece && !move.impotent && !properties.minimal) {
        let selectedPiece = pieceFromXY(x - offsetX, y - offsetY, state.pieces);
        
        if (selectedPiece) {
            if (!((selectedPiece.color == piece.color && !move.friendlyPieces) || (selectedPiece.color != piece.color && move.friendlyPieces))) {
                if (secondFlag != "") {
                    if (secondFlag == 'light') square.light = true;
                    else if (secondFlag == 'allowedMove') square.allowedMove = true;
                    else if (secondFlag == 'blocked') square.blocked = true;
                    else if (secondFlag == 'counted') square.counted = true;
                }
                if (flag == 'light') square.light = true;
                else if (flag == 'allowedMove') {
                    // console.log("Marking square " + square.x.toString() + "," + square.y.toString() + " as allowedMove");
                    square.allowedMove = true;
                }
                else if (flag == 'blocked') square.blocked = true;
                else if (flag == 'counted') square.counted = true;
            }
        }
        if (secondFlag != "") {
             if (flag == 'light') square.light = true;
             else if (flag == 'allowedMove') square.allowedMove = true;
             else if (flag == 'blocked') square.blocked = true;
             else if (flag == 'counted') square.counted = true;
             
             let props = new BlockableProps(state, move.x + directionX + missedSquareX, move.y + directionY + missedSquareY, x, y, move, limit - 1, secondFlag, "", missedSquareX, missedSquareY, properties.minimal, operatedPiece, offsetX, offsetY);
             blockableSpecialFunction(props);
        }
    }
}

// Helper class for passing args to blockableSpecialFunction
export class BlockableProps {
    state: State;
    powerX: i32;
    powerY: i32;
    x: i32;
    y: i32;
    move: Move;
    limit: i32;
    flag: string;
    secondFlag: string;
    missedSquareX: i32;
    missedSquareY: i32;
    minimal: boolean;
    operatedPiece: Piece;
    offsetX: i32;
    offsetY: i32;

    constructor(state: State, powerX: i32, powerY: i32, x: i32, y: i32, move: Move, limit: i32, flag: string, secondFlag: string, missedSquareX: i32, missedSquareY: i32, minimal: boolean, operatedPiece: Piece, offsetX: i32, offsetY: i32) {
        this.state = state;
        this.powerX = powerX;
        this.powerY = powerY;
        this.x = x;
        this.y = y;
        this.move = move;
        this.limit = limit;
        this.flag = flag;
        this.secondFlag = secondFlag;
        this.missedSquareX = missedSquareX;
        this.missedSquareY = missedSquareY;
        this.minimal = minimal;
        this.operatedPiece = operatedPiece;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
}

export function areYouChecked(state: State, enemyColor: string, me: Piece): boolean {
    for (let i = state.pieces.length - 1; i >= 0; i--) {
        const piece = state.pieces[i];
        let tempMoves: Move[] = [];
        // Conditional moves logic requires state
        let condMoves = piece.conditionalMoves(state);
        for(let j=0; j<condMoves.length; j++) tempMoves.push(condMoves[j]);
        
        let allMoves: Move[] = [];
        for(let j=0; j<piece.moves.length; j++) allMoves.push(piece.moves[j]);
        for(let j=0; j<tempMoves.length; j++) allMoves.push(tempMoves[j]);

        for (let ii = allMoves.length - 1; ii >= 0; ii--) {
            const move = allMoves[ii];
            if (piece.color == enemyColor) {
                if ((move.type == 'absolute' || move.type == 'takeMove') && !move.impotent) {
                    if (piece.x + move.x == me.x && piece.y + move.y == me.y) {
                        return true;
                    }
                } else if (move.type == 'blockable' && !move.impotent) {
                    if (move.repeat) {
                        const limit = move.limit == 0 ? 100 : move.limit;
                        const offsetX = move.offsetX;
                        const offsetY = move.offsetY;
                        if (blockableCheck(state, move.x, move.y, piece.x + offsetX, piece.y + offsetY, move, limit, me, 'rokado') == 'block') {
                            return true;
                        }
                    }
                }
            }
        }
    }

    return false;
}

export function areYouCheckedWithoutTempMoves(state: State, enemyColor: string, me: Piece, flag: string): boolean {
    let toReturn = false;
    for (let i = state.pieces.length - 1; i >= 0; i--) {
        const piece = state.pieces[i];

        for (let ii = piece.moves.length - 1; ii >= 0; ii--) {
            const move = piece.moves[ii];
            if (piece.color == enemyColor) {

                if ((move.type == 'absolute' || move.type == 'takeMove') && !move.impotent) {
                    if (piece.x + move.x == me.x && piece.y + move.y == me.y) {
                        toReturn = true;
                    }
                } else if (move.type == 'blockable' && !move.impotent) {
                    if (move.repeat) {
                        const limit = move.limit == 0 ? 100 : move.limit;
                        const offsetX = move.offsetX;
                        const offsetY = move.offsetY;
                        if (blockableCheck(state, move.x, move.y, piece.x + offsetX, piece.y + offsetY, move, limit, me, 'rokado') == 'block') {
                            toReturn = true;
                        }
                    }
                }
            }
        }
    }

    return toReturn;
}

export function isPositionAttacked(state: State, myColor: string, x: i32, y: i32): boolean {
    let enemyColor = 'white';
    if (myColor == 'white') {
        enemyColor = 'black';
    }
    let dummy = new Piece(myColor, x, y);
    if (areYouCheckedWithoutTempMoves(state, enemyColor, dummy, 'rokado')) {
        return true;
    }
    return false;
}

export function isPositionAttackedWithTempMoves(state: State, myColor: string, x: i32, y: i32): boolean {
    let enemyColor = 'white';
    if (myColor == 'white') {
        enemyColor = 'black';
    }
    let dummy = new Piece(myColor, x, y);
    if (areYouChecked(state, enemyColor, dummy)) {
        return true;
    }
    return false;
}

export function isRoadAttacked(state: State, enemyColor: string, pointOne: Piece, pointTwo: Piece): boolean {
    let direction = false;
    let checker = false;
    let actor = pointOne;

    let myColor = 'white';
    if (enemyColor == 'white') {
        myColor = 'black';
    }
    
    if (pointOne.x > pointTwo.x) {
        direction = true;
    }
    let distance: i32 = 0;

    if (direction) {
        distance = pointOne.x - pointTwo.x;
    } else {
        distance = pointTwo.x - pointOne.x;
        actor = pointTwo;
    }
    for (let c = distance - 1; c > 0; c--) {
        let dummy = new Piece(myColor, actor.x - c, actor.y);
        if (areYouCheckedWithoutTempMoves(state, enemyColor, dummy, 'rokado')) {
            checker = true;
        }
    }
    return checker;
}

export function lightBoardFE(piece: Piece, state: State, flag: string = 'light', blockedFlag: string = '', minimal: boolean = false): void {
    if (flag == '') flag = 'light';
    closeLights(state.board, flag);
    if (!piece) return;
    
    // Process regular moves
    for (let i = 0; i < piece.moves.length; i++) {
        let m = piece.moves[i];
        // console.log("Processing: " + m.type + " x: " + m.x.toString() + " y: " + m.y.toString());
        processMove(m, piece, state, flag, blockedFlag, minimal);
    }
    
    // Process conditional moves
    let condMoves = piece.conditionalMoves(state);
    for (let i = 0; i < condMoves.length; i++) {
        processMove(condMoves[i], piece, state, flag, blockedFlag, minimal);
    }
}

export function processMove(move: Move, piece: Piece, state: State, flag: string, blockedFlag: string, minimal: boolean): void {
    if (move.type == 'absolute') {
        const targetX = piece.x + move.x;
        const targetY = piece.y + move.y;
        const square = findSquareByXY(state.board, targetX, targetY);
        // console.log("Checking absolute move to " + targetX.toString() + "," + targetY.toString() + " (Square found: " + (square ? "yes" : "no") + ")");
        if (square) {
            const innerPiece = pieceFromSquare(square, state.pieces);
            if (innerPiece) {
                if (innerPiece.color != piece.color && !move.impotent) {
                    let checkForEnemies = innerPiece.color != piece.color && !move.friendlyPieces && !move.impotent;
                    let checkForFriends = innerPiece.color == piece.color && move.friendlyPieces && !move.impotent;
                    if ((checkForFriends || checkForEnemies) && !move.impotent) {
                        // console.log("Marking absolute move on occupied square: " + square.x.toString() + "," + square.y.toString());
                        if (flag == 'light') square.light = true;
                        else if (flag == 'allowedMove') square.allowedMove = true;
                        else if (flag == 'blocked') square.blocked = true;
                        else if (flag == 'counted') square.counted = true;
                    } else {
                         if (blockedFlag == 'light') square.light = true;
                         else if (blockedFlag == 'allowedMove') square.allowedMove = true;
                         else if (blockedFlag == 'blocked') square.blocked = true;
                         else if (blockedFlag == 'counted') square.counted = true;
                    }   
                } else {
                    if (blockedFlag == 'light') square.light = true;
                    else if (blockedFlag == 'allowedMove') square.allowedMove = true;
                    else if (blockedFlag == 'blocked') square.blocked = true;
                    else if (blockedFlag == 'counted') square.counted = true;
                }
            } else if (!innerPiece) {
                // console.log("Marking absolute move on empty square: " + square.x.toString() + "," + square.y.toString());
                if (flag == 'light') square.light = true;
                else if (flag == 'allowedMove') {
                    // console.log("Marking square " + square.x.toString() + "," + square.y.toString() + " as allowedMove");
                    square.allowedMove = true;
                }
                else if (flag == 'blocked') square.blocked = true;
                else if (flag == 'counted') square.counted = true;
            }
        }
    } else if (move.type == 'allMine') {
        const boardLen = state.board.length;
        for (let i = 0; i < boardLen; i++) {
            const square = state.board[i];
            const innerPiece = pieceFromSquare(square, state.pieces);
            if (innerPiece) {
                if (innerPiece.color == piece.color && innerPiece.icon != piece.icon) {
                    if (flag == 'light') square.light = true;
                    else if (flag == 'allowedMove') square.allowedMove = true;
                    else if (flag == 'blocked') square.blocked = true;
                    else if (flag == 'counted') square.counted = true;
                }
            }
        }
    } else if (move.type == 'takeMove') {
        const square = findSquareByXY(state.board, piece.x + move.x, piece.y + move.y);
        if (square) {
            const innerPiece = pieceFromSquare(square, state.pieces);

            if (innerPiece) {
                let checkForEnemies = innerPiece.color != piece.color && !move.friendlyPieces;
                let checkForFriends = innerPiece.color == piece.color && move.friendlyPieces;

                if ((checkForFriends || checkForEnemies) && !move.impotent) {
                    if (flag == 'light') square.light = true;
                    else if (flag == 'allowedMove') square.allowedMove = true;
                    else if (flag == 'blocked') square.blocked = true;
                    else if (flag == 'counted') square.counted = true;
                }
            } else {
                if (blockedFlag == 'light') square.light = true;
                else if (blockedFlag == 'allowedMove') square.allowedMove = true;
                else if (blockedFlag == 'blocked') square.blocked = true;
                else if (blockedFlag == 'counted') square.counted = true;
            }
        }
    } else if (move.type == 'blockable') {
        if (move.repeat) {
            const limit = move.limit == 0 ? 100 : move.limit;
            const offsetX = move.offsetX;
            const offsetY = move.offsetY;
            const properties = new BlockableProps(
                state,
                move.x,
                move.y,
                piece.x + offsetX,
                piece.y + offsetY,
                move,
                limit,
                flag,
                blockedFlag,
                move.missedSquareX,
                move.missedSquareY,
                minimal,
                piece,
                offsetX,
                offsetY
            );
            blockableSpecialFunction(properties);
        }
    }
}

export function getRndInteger(min: i32, max: i32): i32 {
    return <i32>(Math.floor(Math.random() * <f64>(max - min + 1)) + min);
}

export function pieceAroundMe(state: State, aroundWhat: Piece, pieceTypeIcon: string): boolean {
    let offsetsX: i32[] = [0, 0, 1, -1, 1, -1, 1, -1];
    let offsetsY: i32[] = [1, -1, 0, 0, 1, 1, -1, -1];
    
    for(let i=0; i<8; i++) {
        let p = findCopyPieceByXY(state.pieces, aroundWhat.x + offsetsX[i], aroundWhat.y + offsetsY[i]);
        if (p && p.icon.includes(pieceTypeIcon) && p.color == aroundWhat.color) {
            return true;
        }
    }
    
    return false;
}

export function conditionalSplice(array: Piece[], index: i32): void {
    if (index > -1) {
        array.splice(index, 1);
    }
}

export function conditionalSpliceWithBonus(state: State, index: i32, color: string): void {
    if (index > -1) {
        if (state.pieces[index].afterThisPieceTaken(state)) {
            // Logic handled in afterThisPieceTaken
        }
        if (state.pieces[index].color != color || color == "") {
             state.pieces.splice(index, 1);
        }
    }
}

export function cyborgTeleport(state: State, me: Piece, toReturn: Move[]): void {
    let offsetsX: i32[] = [0, 0, 1, 1, 1, -1, -1, -1];
    let offsetsY: i32[] = [-1, 1, -1, 1, 0, 0, -1, 1];
    
    for(let i=0; i<8; i++) {
        let p = returnPieceWithColor(me.x + offsetsX[i], me.y + offsetsY[i], me.color, state);
        if (p && p.icon != me.icon) {
            let m = new Move('takeMove', offsetsX[i], offsetsY[i]);
            m.friendlyPieces = true;
            toReturn.push(m);
        }
    }
}

export function checkRemi(state: State): boolean {
    let yourPieces = getColorPieces(state.pieces, state.turn);
    let i = yourPieces.length - 1;
    let isItRemi = true;
    while (i >= 0) {
        lightBoardFE(yourPieces[i], state, 'counted');
        
        let availableSquaresCount = 0;
        for(let j=0; j<state.board.length; j++) {
            if (state.board[j].counted) availableSquaresCount++;
        }
        
        if (availableSquaresCount > 0) {
            isItRemi = false;
            i = -1; // break
        }
        i--;
    }
    
    if (yourPieces.length == 0) {
        isItRemi = false;
    }
    
    return isItRemi;
}
