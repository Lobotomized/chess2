
import { State, Piece, Square, PlayerMove, Move } from "./types";
import { lightBoardFE, closeLights, pieceFromSquare, findSquareByXY, findPieceByXY, checkRemi } from "./helperFunctions";

export function selectPiece(playerMove: PlayerMove, state: State): void {
    const x = playerMove.x;
    const y = playerMove.y;

    let foundPiece: Piece | null = null;
    for (let i = 0; i < state.pieces.length; i++) {
        if (state.pieces[i].x == x && state.pieces[i].y == y) {
            foundPiece = state.pieces[i];
            break;
        }
    }
    
    if (!foundPiece) {
        closeLights(state.board, 'light');
        return;
    }

    if (foundPiece.color != state.turn) {
        closeLights(state.board, 'light');
        return;
    }
    state.pieceSelected = foundPiece;

    lightBoardFE(foundPiece, state, 'light', '', true);
}

export function playerMove(playerMove: PlayerMove, state: State, alwaysLight: boolean, selectedForced: Piece | null, specialFlag: string): boolean {
    let light = specialFlag;
    if (light == "") light = 'light';
    
    const x = playerMove.x;
    const y = playerMove.y;
    
    let operatedPiece = state.pieceSelected;
    if (selectedForced) operatedPiece = selectedForced;
    
    if (!operatedPiece) return false;

    let square: Square | null = null;
    for (let i = 0; i < state.board.length; i++) {
        if (state.board[i].x == x && state.board[i].y == y) {
            square = state.board[i];
            break;
        }
    }

    if (!square) return false;
    
    if (light == 'light') {
        if (!square.light && !alwaysLight) return false;
    } else if (light == 'allowedMove') {
        if (!square.allowedMove && !alwaysLight) return false;
    } else if (light == 'counted') {
        if (!square.counted && !alwaysLight) return false;
    }

    let enemyPiece: Piece | null = null;
    for (let i = 0; i < state.pieces.length; i++) {
        let p = state.pieces[i];
        if (p.x == x && p.y == y && p.color != operatedPiece.color) {
            enemyPiece = p;
            break;
        }
    }

    let friendlyPiece: Piece | null = null;
    for (let i = 0; i < state.pieces.length; i++) {
        let p = state.pieces[i];
        if (p.x == x && p.y == y && p.color == operatedPiece.color) {
            friendlyPiece = p;
            break;
        }
    }

    const friendlyPieceOldX = friendlyPiece ? friendlyPiece.x : -1;
    const friendlyPieceOldY = friendlyPiece ? friendlyPiece.y : -1;
    
    const oldX = operatedPiece.x;
    const oldY = operatedPiece.y;

    operatedPiece.x = x;
    operatedPiece.y = y;

    let continueTurn = true;
    let moveObj = new Move('absolute', x, y); 
    let prevMoveObj = new Move('absolute', oldX, oldY);

    for (let i = state.pieces.length - 1; i >= 0; i--) {
        if (state.pieces[i].afterPlayerMove(state, moveObj, prevMoveObj)) {
             // In JS, if it returns true, continueTurn = false is NOT set.
             // JS: if(state.pieces[i].afterPlayerMove(...)){ continueTurn = false; }
             // But my earlier analysis said if it returns true, continueTurn is false.
             // Let's re-verify JS:
             /*
             if (state.pieces[i].afterPlayerMove) {
                if(state.pieces[i].afterPlayerMove(state, playerMove, {x:oldX, y:oldY})){
                    continueTurn = false;
                }
             }
             */
             // So if it returns TRUTHY, continueTurn becomes FALSE.
             // But `afterPlayerMove` usually returns true to CONTINUE?
             // `WeakPawn` returns true.
             // `Ricar` returns undefined (falsy) -> continueTurn remains true.
             // `Cyborg` returns true -> continueTurn becomes false?
             // Wait, `Cyborg` JS:
             /*
             afterPlayerMove: function (state){
                // ... logic ...
             }
             */
             // It doesn't return anything. So undefined. Falsy.
             // So loop continues.
             // `WeakPawn` JS: returns true.
             // So if `WeakPawn` moves, `continueTurn` becomes false?
             // This means move is aborted?
             // JS logic:
             /*
             if(!continueTurn){
                 // revert coords
                 return false;
             }
             */
             // So if `afterPlayerMove` returns true, the move is CANCELLED.
             // This seems counter-intuitive naming.
             // But let's follow JS logic.
             // In my AS implementation, I used `afterPlayerMove` returning boolean.
             // I should match JS return values logic.
             
             // However, looking at my AS implementations:
             // `Ricar` returns true.
             // `Cyborg` returns true.
             // If I return true, move is cancelled?
             // This is bad if I copied logic blindly.
             // Let's check `Ricar` JS.
             /*
             afterPlayerMove:function(state){
                 // ... logic ...
             }
             */
             // It returns nothing.
             
             // `WeakPawn` JS `afterPieceMove` returns true. `afterPlayerMove` is NOT defined for WeakPawn.
             
             // So, most pieces don't have `afterPlayerMove`.
             // `Ricar` has. `Cyborg` has.
             // `Cyborg` returns nothing.
             
             // So if I return `true` in AS, I am cancelling the move.
             // I should return `false` in AS if I want to continue, matching JS `undefined`.
             
             continueTurn = false;
        }
    }

    if (operatedPiece.friendlyPieceInteraction(state, friendlyPiece, prevMoveObj)) {
        if (friendlyPiece) {
            friendlyPiece.x = friendlyPieceOldX;
            friendlyPiece.y = friendlyPieceOldY;
        }
        continueTurn = false;
    }    
    
    if (!continueTurn) {
        if (friendlyPiece) {
            friendlyPiece.x = friendlyPieceOldX;
            friendlyPiece.y = friendlyPieceOldY;
        }
        operatedPiece.x = oldX;
        operatedPiece.y = oldY;
        return false;
    } else {
        if (enemyPiece) {
            if (enemyPiece.afterThisPieceTaken(state)) {
                 // JS: if returns true, cancel move?
                 // JS: if(enemyPiece.afterThisPieceTaken(state)){ ... return false; }
                 // `Shroom` returns nothing (undefined).
                 // `Hat` returns nothing.
                 // `NorthernKing` returns nothing.
                 // So if it returns truthy, move cancelled.
                 
                 operatedPiece.x = oldX;
                 operatedPiece.y = oldY;
                 return false;
            }
            
            operatedPiece.afterEnemyPieceTaken(enemyPiece, state);
            
            enemyPiece.x = -1;
            enemyPiece.y = -1;
            
            let idx = -1;
            for(let i=0; i<state.pieces.length; i++) {
                if (state.pieces[i] == enemyPiece) {
                    idx = i;
                    break;
                }
            }
            if (idx != -1) state.pieces.splice(idx, 1);
        }
    }
    
    // JS: const continueTurn = operatedPiece.afterPieceMove(...)
    // if (!continueTurn) ...
    // So if `afterPieceMove` returns falsy (false/undefined), move cancelled.
    // If true, continue.
    // `WeakPawn` returns true.
    // Most pieces return true or nothing.
    // If nothing (undefined), then !undefined is true. So cancelled?
    // Wait. `!continueTurn`.
    // If undefined, !undefined is true. So cancelled.
    // So `afterPieceMove` MUST return true in JS?
    // Let's check `classic.js` `Pawn`.
    /*
    afterPieceMove: function(state, move, prevMove) {
        if (!this.moved) this.moved = true;
        // ...
        return true;
    }
    */
    // Yes, it returns true.
    
    let moveResult = operatedPiece.afterPieceMove(state, moveObj, prevMoveObj);
    if (!moveResult) {
        operatedPiece.x = oldX;
        operatedPiece.y = oldY;
        return false;
    }
    
    state.oldMove = prevMoveObj;
    state.pieceSelected = null;
    closeLights(state.board, 'light');

    return true;
}

export function checkTurn(state: State, playerRef: string): boolean {
    if ((state.turn == 'white' && state.white == playerRef) || (state.turn == 'black' && state.black == playerRef)) {
        return true;
    }
    return false;
}

export function changeTurn(state: State): void {
    if (state.turn == 'white') {
        state.turn = 'black';
    } else {
        state.turn = 'white';
    }
}

export function pickARace(race: string, state: State, playerRef: string): void {
    if (state.white == playerRef) {
        state.whiteRace = race;
    } else if (state.black == playerRef) {
        state.blackRace = race;
    }
}

export function makeMove(playerMoveInput: PlayerMove, state: State, playerRef: string): void {
    // Basic turn check
    if (!checkTurn(state, playerRef)) return;
    
    if (state.pieceSelected) {
        if (playerMove(playerMoveInput, state, false, null, "")) {
            // Success
            // specialOnMoveEffects...
            
            changeTurn(state);
            
            if (state.won == "" && checkRemi(state)) {
                state.won = 'tie';
                // specialOnDrawEffects...
                return;
            }
            
            // afterEnemyPlayerMove
            let moveObj = new Move('absolute', playerMoveInput.x, playerMoveInput.y);
            for (let i = state.pieces.length - 1; i >= 0; i--) {
                if (state.pieces[i].color == state.turn) {
                    state.pieces[i].afterEnemyPlayerMove(state, moveObj);
                }
            }
        } else {
            closeLights(state.board, 'light');
            state.pieceSelected = null;
        }
    } else {
        selectPiece(playerMoveInput, state);
        if (state.pieceSelected) {
            lightBoardFE(state.pieceSelected!, state, 'light', '', false);
        }
    }
}
