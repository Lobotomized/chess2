
try{
    var {playerMove} = require('../moveMethods.js')
    var {checkEmptyHorizontalBetween, isRoadAttacked, blockableCheck, areYouChecked, findPieceByXY, 
        findCopyPieceByXY, areYouCheckedWithoutTempMoves, isPositionAttacked, lightBoardFE, posValue: posValueImport, JSONfn: JSONfnImport} = require('../helperFunctions.js')
    
    if(typeof window === 'undefined'){
        global.JSONfn = JSONfnImport;
        global.posValue = posValueImport;
    }
}
catch(err){

}

var posValue = (typeof window !== 'undefined') ? window.posValue : (typeof global !== 'undefined') ? global.posValue : self.posValue;

function knightFactory(color, x, y) {
    return {
        icon: color + 'Knight.png',
        moves: [{ type: 'absolute', y: 2, x: 1 }, { type: 'absolute', y: 2, x: -1 },
        { type: 'absolute', y: -2, x: 1 }, { type: 'absolute', y: -2, x: -1 },
        { type: 'absolute', y: 1, x: 2 }, { type: 'absolute', y: 1, x: -2 },
        { type: 'absolute', y: -1, x: 2 }, { type: 'absolute', y: -1, x: -2 }],
        x: x,
        y: y,
        color: color,
        value:2.5,
        posValue:posValue[3]
    }
}

function pawnFactory(color, x, y) {
    let moves = [{ type: 'absolute', impotent: true, y: -1, x: 0 }, { type: 'takeMove', y: -1, x: -1 }, { type: 'takeMove', y: -1, x: 1 }]

    if (color == 'black') {
        moves = [{ type: 'absolute', impotent: true, y: 1, x: 0 }, { type: 'takeMove', y: 1, x: -1 }, { type: 'takeMove', y: 1, x: 1 }];
    }

    return {
        icon: color + 'Pawn.png',
        moves: moves,
        x: x,
        y: y,
        moved: false,
        enPassantMove:false,
        color: color,
        value:1,
        posValue:posValue[2],
        conditionalMoves: function (state) {
            let conditionalMoves = [];
            if(state){
                const enPassantCandidates = state.pieces.filter((piece) => {
                    return piece.icon == piece.color +'Pawn.png' && piece.enPassantMove && piece.y == this.y 
                    && (piece.x == this.x + 1 || piece.x == this.x -1) && piece.color   != this.color;
                })
                enPassantCandidates.forEach((candidate) => {
                    if(candidate.x > this.x){
                        if(this.color == 'black'){
                            conditionalMoves.push({ type: 'absolute', y: 1, x: 1 })
                        }
                        else{
                            conditionalMoves.push({ type: 'absolute', y: -1, x: 1 })
                        }
                    }
                    else if(candidate.x < this.x){
                        if(this.color == 'black'){
                            conditionalMoves.push({ type: 'absolute', y: 1, x: -1 })
                        }
                        else{
                            conditionalMoves.push({ type: 'absolute', y: -1, x: -1 })
                        }                
                    }
                })
            }
            
            if (!this.moved) {
                if (this.color == 'black') {
                    conditionalMoves.push(...[{ type: 'blockable', limit: 2, repeat: true, y: 1, x: 0, impotent: true }])

                }
                else if (this.color == 'white') {
                    conditionalMoves.push(...[{ type: 'blockable', repeat: true, limit: 2, y: -1, x: 0, impotent: true }])

                }
            }
            return conditionalMoves;
        },
        afterPieceMove: function (state, move, prevMove) {
            //return false if you want to prevent next turn and true if you want to continue it
            if (!this.moved) {
                this.moved = true;
            }

            let checkForLastRow = state.board.find((square) => {
                return square.x === move.x && square.y > move.y;
               })
               let isItLast = false;
               if(!checkForLastRow){
                isItLast = true;
               }
            if (this.color == 'black' && isItLast) {
                this.icon = color + 'Queen.png';
                this.moves.length = 0;
                this.moves.push({ type: 'blockable', repeat: true, x: 0, y: -1 }, { type: 'blockable', repeat: true, x: 0, y: 1 },
                    { type: 'blockable', repeat: true, x: -1, y: 0 }, { type: 'blockable', repeat: true, x: 1, y: 0 },
                    { type: 'blockable', repeat: true, x: -1, y: -1 }, { type: 'blockable', repeat: true, x: 1, y: 1 },
                    { type: 'blockable', repeat: true, x: -1, y: 1 }, { type: 'blockable', repeat: true, x: 1, y: -1 })
            }
            else if (this.color == 'white' && this.y == 0) {
                this.icon = color + 'Queen.png';
                this.moves.length = 0;
                this.moves.push({ type: 'blockable', repeat: true, x: 0, y: -1 }, { type: 'blockable', repeat: true, x: 0, y: 1 },
                    { type: 'blockable', repeat: true, x: -1, y: 0 }, { type: 'blockable', repeat: true, x: 1, y: 0 },
                    { type: 'blockable', repeat: true, x: -1, y: -1 }, { type: 'blockable', repeat: true, x: 1, y: 1 },
                    { type: 'blockable', repeat: true, x: -1, y: 1 }, { type: 'blockable', repeat: true, x: 1, y: -1 })
            }
            

            if(this.color == 'black'){

                const enemyPiece = state.pieces.find((piece) => {

                    return piece.x == move.x && piece.y == move.y-1 && piece.color != this.color && piece.enPassantMove //&& !findCopyPieceByXY(state.pieces,move.x,move.y)
                })
                if(enemyPiece){
                    state.pieces.splice(state.pieces.indexOf(enemyPiece),1);    
                    enemyPiece.x = undefined;
                    enemyPiece.y = undefined;
                }

            }
            else{


                const enemyPiece = state.pieces.find((piece) => {
                    return piece.x == move.x && piece.y == move.y  + 1 && piece.color != this.color  &&  piece.enPassantMove// && !findCopyPieceByXY(state.pieces,move.x,move.y)
                })
                if(enemyPiece){
                    state.pieces.splice(state.pieces.indexOf(enemyPiece),1);
                    enemyPiece.x = undefined;
                    enemyPiece.y = undefined;
                }

            }

            return true;
        },
        afterPlayerMove: function (state,move,prevMove){
            color = this.color;
            if(color == 'black'){
                direction = -1;
            }
            else{
                direction = 1;
            }
            if(!direction){
                this.value = 1 + this.y*0.1
            }
            else{
                this.value = 1 + (7-this.y)*0.1
            }
            if(this.color === state.turn){
                this.enPassantMove = false;
            }
            if(this.color === 'black'){
                if(this.y == prevMove.y + 2 && this.x === prevMove.x){
                    this.enPassantMove = true;
                }
            }

            if(this.color === 'white'){
                if(this.y == prevMove.y - 2 && this.x === prevMove.x){
                    this.enPassantMove = true;

                }
            }
        }
    }
}

function bishopFactory(color, x, y) {
    return {
        icon: color + 'Bishop.png',
        moves: [{ type: 'blockable', repeat: true, x: -1, y: -1 }, { type: 'blockable', repeat: true, x: 1, y: 1 },
        { type: 'blockable', repeat: true, x: -1, y: 1 }, { type: 'blockable', repeat: true, x: 1, y: -1 }],
        x: x,
        y: y,
        value:3,
        posValue:posValue[3],
        color: color
    }
}

function rookFactory(color, x, y) {
    return {
        icon: color + 'Rook.png',
        moves: [
            { type: 'blockable', repeat: true, x: -1, y: 0 }, { type: 'blockable', repeat: true, x: 1, y: 0 },
        { type: 'blockable', repeat: true, x: 0, y: -1 }, { type: 'blockable', repeat: true, x: 0, y: 1 },
        ],
        x: x,
        y: y,
        value:5,
        posValue:posValue[2],
        moved:false,
        color: color,
        afterPieceMove:function(){
            this.moved = true;
            return true;
        }
    }
}

function queenFactory(color, x, y) {
    return {
        icon: color + 'Queen.png',
        moves: [{ type: 'blockable', repeat: true, x: 0, y: -1 }, { type: 'blockable', repeat: true, x: 0, y: 1 },
        { type: 'blockable', repeat: true, x: -1, y: 0 }, { type: 'blockable', repeat: true, x: 1, y: 0 },
        { type: 'blockable', repeat: true, x: -1, y: -1 }, { type: 'blockable', repeat: true, x: 1, y: 1 },
        { type: 'blockable', repeat: true, x: -1, y: 1 }, { type: 'blockable', repeat: true, x: 1, y: -1 }],
        x: x,
        y: y,
        value:9,
        posValue:0.05,
        color: color
    }
}

function simpleKingFactory(color, x, y){
    return {
        icon: color + 'King.png',
        vulnerable: true,
        moved: false,
        value:1000,
        posValue:1,
        x: x,
        y: y,
        color:color,
        maxY:0,
        moves: [ 
            { type: 'absolute', x: 0, y: 1 },{ type: 'absolute', x: 1, y: 0 },{ type: 'absolute', x: 1, y: 1 },
            { type: 'absolute', x: -1, y: -1 },{ type: 'absolute', x: 0, y: -1 },{ type: 'absolute', x: -1, y: 0 },
            { type: 'absolute', x: -1, y: 1 },{ type: 'absolute', x: 1, y: -1 }
        ],
        afterThisPieceTaken: function (state) {
            if (this.color == 'white') {
                state.won = 'black';
             }
            else if (this.color == 'black') {
                state.won = 'white';
            }
            return false;
        },
    }
}

function kingLikeFactory(color, x, y){
    return {
        icon: color + 'SleepingDragon.png',
        vulnerable: true,
        moved: false,
        value:5,
        posValue:1,
        color:color,
        x: x,
        y: y,
        moves: [ 
            { type: 'absolute', x: 0, y: 1 },{ type: 'absolute', x: 1, y: 0 },{ type: 'absolute', x: 1, y: 1 },
            { type: 'absolute', x: -1, y: -1 },{ type: 'absolute', x: 0, y: -1 },{ type: 'absolute', x: -1, y: 0 },
            { type: 'absolute', x: -1, y: 1 },{ type: 'absolute', x: 1, y: -1 }
        ],

    }
}

function kingFactory(color, x, y, options) {
    return {
        icon: color + 'King.png',
        vulnerable: true,
        moved: false,
        moves: [ 
                 { type: 'absolute', x: 0, y: 1 },{ type: 'absolute', x: 1, y: 0 },{ type: 'absolute', x: 1, y: 1 },
                 { type: 'absolute', x: -1, y: -1 },{ type: 'absolute', x: 0, y: -1 },{ type: 'absolute', x: -1, y: 0 },
                 { type: 'absolute', x: -1, y: 1 },{ type: 'absolute', x: 1, y: -1 }
               ],
        x: x,
        y: y,
        value:2000,
        posValue:posValue[3],
        color: color,
        options:options,
        conditionalMoves: function(state){
            let toReturn = []
            
            // PREVENT PRE-SELECTION CHECK MOVES
            // The logic: if the currently selected piece is friendly, we simulate its moves.
            // If a move results in a check, we modify the board to turn off the light.
            if (state.pieceSelected && state.pieceSelected.color === this.color && !state._kingIsCheckingMoves) {
                state._kingIsCheckingMoves = true; // Prevent infinite recursion
                let enemyColor = this.color === 'white' ? 'black' : 'white';
                let piece = state.pieceSelected;
                
                // Temporarily light the board to see what moves are possible
                lightBoardFE(piece, state, 'temp_light', 'temp_blocked', true);
                
                state.board.forEach(sq => {
                    if (sq.temp_light) {
                        // Simulate the move
                        const oldX = piece.x;
                        const oldY = piece.y;
                        const targetX = sq.x;
                        const targetY = sq.y;
                        
                        let takenPiece = null;
                        let takenIndex = -1;
                        for (let i = 0; i < state.pieces.length; i++) {
                            if (state.pieces[i].x === targetX && state.pieces[i].y === targetY) {
                                takenPiece = state.pieces[i];
                                takenIndex = i;
                                break;
                            }
                        }
                        
                        piece.x = targetX;
                        piece.y = targetY;
                        if (takenPiece) {
                            takenPiece.x = -1;
                            takenPiece.y = -1;
                        }
                        
                        let kingToCheck = this;
                        if (piece === this) {
                            kingToCheck = { x: targetX, y: targetY, color: this.color };
                        }
                        
                        let isChecked = areYouChecked(state, enemyColor, kingToCheck);
                        
                        piece.x = oldX;
                        piece.y = oldY;
                        if (takenPiece) {
                            takenPiece.x = targetX;
                            takenPiece.y = targetY;
                        }
                        
                        // If the move leaves us in check, mark this square so we can un-light it later
                        if (isChecked) {
                            sq._kingInvalidMove = true;
                        }
                    }
                    sq.temp_light = false;
                    sq.temp_blocked = false;
                });
                
                // Add a micro-task to clean up the lights right after lightBoardFE finishes
                setTimeout(() => {
                    state.board.forEach(sq => {
                        if (sq._kingInvalidMove) {
                            sq.light = false;
                            sq._kingInvalidMove = false;
                        }
                    });
                }, 0);
                
                state._kingIsCheckingMoves = false;
            }

            let enemyKing = state.pieces.find((piece) => {
                return piece.icon.includes('King.png') && piece.color != this.color
            })

            let squaresToRemove = []
            
            if(enemyKing){
                squaresToRemove = [
                    {
                        x:enemyKing.x+1,
                        y:enemyKing.y
                    },
                    {
                        x:enemyKing.x-1,
                        y:enemyKing.y
                    },
                    {
                        x:enemyKing.x,
                        y:enemyKing.y + 1
                    },
                    {
                        x:enemyKing.x + 1,
                        y:enemyKing.y + 1
                    },
                    {
                        x:enemyKing.x-1,
                        y:enemyKing.y + 1
                    },
                    {
                        x:enemyKing.x,
                        y:enemyKing.y-1
                    },
                    {
                        x:enemyKing.x+1,
                        y:enemyKing.y-1
                    },
                    {
                        x:enemyKing.x-1,
                        y:enemyKing.y-1
                    },
                ]
            }

            if(!isPositionAttacked(state,this.color,this.x,this.y+1) && 
                !squaresToRemove.find((sq) => {
                    return sq.x === this.x && sq.y === this.y+1
                })
            ){
                toReturn.push({ type: 'absolute', x: 0, y: 1 });
            }
            if(!isPositionAttacked(state,this.color,this.x+1,this.y) && 
                !squaresToRemove.find((sq) => {
                    return sq.x === this.x+1 && sq.y === this.y
                })
            ){
                toReturn.push({ type: 'absolute', x: 1, y: 0 });
            }
            if(!isPositionAttacked(state,this.color,this.x+1,this.y+1) && 
                !squaresToRemove.find((sq) => {
                    return sq.x === this.x+1 && sq.y === this.y+1
                })
            ){
                toReturn.push({ type: 'absolute', x: 1, y: 1 });
            }
            if(!isPositionAttacked(state,this.color,this.x-1,this.y-1) && 
                !squaresToRemove.find((sq) => {
                    return sq.x === this.x-1 && sq.y === this.y-1
                })
            ){
                toReturn.push({ type: 'absolute', x: -1, y: -1 });
            }
            if(!isPositionAttacked(state,this.color,this.x,this.y-1) && 
                !squaresToRemove.find((sq) => {
                    return sq.x === this.x && sq.y === this.y-1
                })
            ){
                toReturn.push({ type: 'absolute', x: 0, y: -1 });
            }
            if(!isPositionAttacked(state,this.color,this.x-1,this.y)  && 
                !squaresToRemove.find((sq) => {
                    return sq.x === this.x-1 && sq.y === this.y
                })
            ){
                toReturn.push({ type: 'absolute', x: -1, y: 0 });
            }
            if(!isPositionAttacked(state,this.color,this.x-1,this.y+1) && 
                !squaresToRemove.find((sq) => {
                    return sq.x === this.x-1 && sq.y === this.y+1
                })
            ){
                toReturn.push({ type: 'absolute', x: -1, y: 1 });
            }
            if(!isPositionAttacked(state,this.color,this.x+1,this.y-1) && 
                !squaresToRemove.find((sq) => {
                    return sq.x === this.x + 1 && sq.y === this.y-1
                })
                ){
                toReturn.push({ type: 'absolute', x: 1, y: -1 });
            }
            if(!this.moved){
                const availableRooks = state.pieces.filter((piece) => {
                    let enemyColor = 'black'
                    if(this.color == 'black'){
                        enemyColor = 'white';
                    }
                    const isItMyRook = piece.icon == this.color+'Rook.png';
                    if(!isItMyRook){
                        return false;
                    }
                    if(piece.moved){
                        return false
                    }

                    const isTheRoadEmpty = checkEmptyHorizontalBetween(state,this,piece);
                    const isTheCastleCrossed = isRoadAttacked(state,enemyColor,this,piece)
                    const amIChecked = areYouCheckedWithoutTempMoves(state,enemyColor,this)
                    if(isTheRoadEmpty && !isTheCastleCrossed && !amIChecked){
                        return true
                    }
                })

                availableRooks.forEach((rook) => {
                    if(rook.x > this.x){
                        toReturn.push({type:'blockable',x:1,y:0, repeat:true, limit:2})
                    }
                    else{
                        toReturn.push({type:'blockable',x:-1,y:0,repeat:true,limit:2})
                    }
                })

                 
            }
            

            return toReturn;
        },
        afterThisPieceTaken: function (state) {
            if (this.color == 'white') {
                state.won = 'black';
                if(this.options){
                    this.options?.gameEndedEvent(state.won);
                }            }
            else if (this.color == 'black') {
                state.won = 'white';
                if(this.options){
                    this.options?.gameEndedEvent(state.won);
                }
            }
        },
        afterEnemyPlayerMove: function(state, move) {
            let enemyColor = 'black';
            if (this.color == 'black') {
                enemyColor = 'white'
            }

            // 1. Idea 2: Make King the absolute master of game-over states (Checkmate & Stalemate)
            let possibleEscape = false;
            let fakeState = JSONfn.parse(JSONfn.stringify(state));
            for (let i = fakeState.pieces.length - 1; i >= 0; i--) {
                let friendlyPiece = fakeState.pieces[i];
                if (friendlyPiece.color == this.color) {
                    fakeState.turn = this.color;
                    fakeState.pieceSelected = friendlyPiece;
                    lightBoardFE(friendlyPiece, fakeState, 'light', undefined, true);

                    const lightedSquares = fakeState.board.filter((sq) => sq.light == true);

                    for (let j = 0; j < lightedSquares.length; j++) {
                        let sq = lightedSquares[j];
                        friendlyPiece = fakeState.pieces[i];
                        fakeState.pieceSelected = friendlyPiece;
                        lightBoardFE(friendlyPiece, fakeState, 'light', undefined, true);

                        let fakeKing = fakeState.pieces.find((piece) => piece.x == this.x && piece.y == this.y);
                        
                        let moveResult = playerMove({ x: sq.x, y: sq.y }, fakeState);
                        if (moveResult && !areYouChecked(fakeState, enemyColor, fakeKing)) {
                            possibleEscape = true;
                            break;
                        }
                        fakeState = JSONfn.parse(JSONfn.stringify(state));
                    }
                }
                if (possibleEscape) break;
            }

            if (!possibleEscape) {
                if (areYouChecked(state, enemyColor, this)) {
                    state.won = enemyColor; // Checkmate
                } else {
                    state.won = 'tie'; // Stalemate
                }
                if (this.options) {
                    this.options?.gameEndedEvent(state.won);
                }
            }
        },
        afterPieceMove: function(state, move,prevMove){
            this.moved = true;
            const caseOne = prevMove.x > move.x+1;
            const caseTwo = prevMove.x < move.x-1;
            let row = 0;
            if(this.color == 'white'){
                row = 7
            }
            if(caseOne){
                let rook 
                
                if(state.pieces[findPieceByXY(state.pieces,0,row)]){
                    rook = state.pieces[findPieceByXY(state.pieces,0,row)];
                }
                if(rook){
                    rook.x = 3;
                }
            }
            else if(caseTwo){
                let rook 
                
                if(state.pieces[findPieceByXY(state.pieces,7,row)]){
                    rook = state.pieces[findPieceByXY(state.pieces,7,row)];
                }
                if(rook){
                    rook.x = 5;
                }
            }
            return true
        },
        afterPlayerMove: function (state, attemptMove) {
            let enemyColor = 'black';
            if (this.color == 'black') {
                enemyColor = 'white'
            }

            if(state.turn != this.color){
                return;
            }
            
            for (let i = state.pieces.length - 1; i >= 0; i--) {
                const piece = state.pieces[i]
                let tempMoves = [];
                if (piece.conditionalMoves) {
                    tempMoves = piece.conditionalMoves(state);
                }
            
                
                for(let ii = [...piece.moves, ...tempMoves].length-1; ii>=0; ii--){
                    const move = [...piece.moves, ...tempMoves][ii];
                    if (piece.color == enemyColor) {

                        if ((move.type == 'absolute' || move.type == 'takeMove') && !move.friendlyPieces && !move.impotent && !(attemptMove.x == piece.x && attemptMove.y == piece.y)) {
                            if(piece.x + move.x === this.x && piece.y + move.y === this.y){
                                state.message = "Playing this move will leave you checked!"
                                return true
                            }
                        }
                        else if (move.type == 'blockable'&& !move.friendlyPieces  && !move.impotent && !(attemptMove.x == piece.x && attemptMove.y == piece.y)) {
                            if (move.repeat) {

                                const limit = move.limit || 100;
                                const offsetX = move.offsetX || 0;
                                const offsetY = move.offsetY || 0;
                                if(blockableCheck(state, move.x, move.y, piece.x+offsetX, piece.y+offsetY, move, limit, this) == 'block'){
                                    state.message = "Playing this move will leave you checked!"
                                    return true
                                }
                            }
                        }
                    }
                }
            }
            return
        }
    }
}

try{
    module.exports = {
        knightFactory,
        pawnFactory,
        bishopFactory,
        rookFactory,
        queenFactory,
        simpleKingFactory,
        kingLikeFactory,
        kingFactory
    }
}
catch(err){

}
