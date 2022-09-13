
const {playerMove, lightBoard} = require('./selectAndMovemethods')
const {checkEmptyHorizontalBetween, isRoadAttacked, blockableCheck, areYouChecked, findPieceByXY, 
    findCopyPieceByXY, areYouCheckedWithoutTempMoves, giveOppositeColor} = require('./helperFunctions')
function knightFactory(color, x, y) {
    return {
        icon: color + 'Knight.png',
        moves: [{ type: 'absolute', y: 2, x: 1 }, { type: 'absolute', y: 2, x: -1 },
        { type: 'absolute', y: -2, x: 1 }, { type: 'absolute', y: -2, x: -1 },
        { type: 'absolute', y: 1, x: 2 }, { type: 'absolute', y: 1, x: -2 },
        { type: 'absolute', y: -1, x: 2 }, { type: 'absolute', y: -1, x: -2 }],
        x: x,
        y: y,
        color: color
    }
}

function mongolianKnightFactory(color, x, y) {
    return {
        icon: color + 'Knight.png',
        moves: [{ type: 'absolute', y: 2, x: 1 }, { type: 'absolute', y: 2, x: -1 },
        { type: 'absolute', y: -2, x: 1 }, { type: 'absolute', y: -2, x: -1 },
        { type: 'absolute', y: 1, x: 2 }, { type: 'absolute', y: 1, x: -2 },
        { type: 'absolute', y: -1, x: 2 }, { type: 'absolute', y: -1, x: -2 }],
        x: x,
        y: y,
        color: color,
        afterPieceMove: function(state, move, prevMove){
            if(prevMove.x == 5  && prevMove.y == 5){
                state.won = this.color
            }
            return true
        }
    }
}

function weakPawn(color,x,y){
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
        color: color,
        afterPieceMove: function (state, move) {
            //return false if you want to prevent next turn and true if you want to continue it
            if (!this.moved) {
                this.moved = true;
            }
            if (color == 'black' && state.pieceSelected.y == 1) {
                this.icon = color + 'Queen.png';
                this.moves.length = 0;
                this.moves.push({ type: 'blockable', repeat: true, x: 0, y: -1 }, { type: 'blockable', repeat: true, x: 0, y: 1 },
                    { type: 'blockable', repeat: true, x: -1, y: 0 }, { type: 'blockable', repeat: true, x: 1, y: 0 },
                    { type: 'blockable', repeat: true, x: -1, y: -1 }, { type: 'blockable', repeat: true, x: 1, y: 1 },
                    { type: 'blockable', repeat: true, x: -1, y: 1 }, { type: 'blockable', repeat: true, x: 1, y: -1 })
            }
            else if (color == 'white' && state.pieceSelected.y == 6) {
                this.icon = color + 'Queen.png';
                this.moves.length = 0;
                this.moves.push({ type: 'blockable', repeat: true, x: 0, y: -1 }, { type: 'blockable', repeat: true, x: 0, y: 1 },
                    { type: 'blockable', repeat: true, x: -1, y: 0 }, { type: 'blockable', repeat: true, x: 1, y: 0 },
                    { type: 'blockable', repeat: true, x: -1, y: -1 }, { type: 'blockable', repeat: true, x: 1, y: 1 },
                    { type: 'blockable', repeat: true, x: -1, y: 1 }, { type: 'blockable', repeat: true, x: 1, y: -1 })
            }

            return true;
        }
    }
}


function unpromotablePawn(color, x, y) {
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
        color: color,
        afterPieceMove: function(){
            if (!this.moved) {
                this.moved = true;
            }

            return true
        },
        conditionalMoves: function (state) {
            if (!this.moved) {
                if (this.color == 'black') {
                    return [{ type: 'blockable', limit: 2, repeat: true, y: 1, x: 0, impotent: true }]

                }
                else if (this.color == 'white') {
                    return [{ type: 'blockable', repeat: true, limit: 2, y: -1, x: 0, impotent: true }]
                }
            }
            else {
                return [];
            }
        }
    }
}

function ghostFactory(color,x,y){
    let moves = [{ type: 'absolute',y: -1, x: 0 }, { type: 'absolute', y: -2,x:0 }]

    if (color == 'black') {
        moves = [{ type: 'absolute', y: 1, x: 0 }, { type: 'absolute', y: 2, x: 0 }];
    }
    return {
        icon: color + 'Ghost.png',
        moves:moves,
        color:color,
        x:x,
        y:y
    }
}

function pigFactory(color,x,y){
    let moves = [{ type: 'blockable', repeat: true, x: 0, y: -1 }]
    if (color == 'black') {
        moves = [{ type: 'blockable', repeat: true, x: 0, y: 1 }];
    }

    return {
        icon: color + 'Pig.png',
        moves:moves,
        color:color,
        x:x,
        y:y
    }
}

function horseFactory(color,x,y){
    const moves = [{ type: 'blockable', repeat: true, x: 0, y: -1, limit:3 }, { type: 'blockable', repeat: true, x: 0, y: 1,limit:3 },
    { type: 'blockable', repeat: true, x: -1, y: 0 ,limit:3}, { type: 'blockable', repeat: true, x: 1, y: 0 ,limit:3},
    { type: 'blockable', repeat: true, x: -1, y: -1 ,limit:3}, { type: 'blockable', repeat: true, x: 1, y: 1 ,limit:3},
    { type: 'blockable', repeat: true, x: -1, y: 1 ,limit:3}, { type: 'blockable', repeat: true, x: 1, y: -1 ,limit:3}]

    return {
        icon: color + 'Horse.png',
        moves:moves,
        color:color,
        x:x,
        y:y
    }
}

function ricarFactory(color,x,y){
    let direction = 1;
    if(color == 'black'){
        direction = -1;
    }

    return {
        icon: color + 'Ricar.png',
        moves: [{ type: 'absolute', x: 0, y: -2 }, { type: 'absolute', x: 0, y: 2 },
        { type: 'absolute', x: -2, y: 0 }, { type: 'absolute', x: 2, y: 0 },
        { type: 'absolute', x: -2, y: -2 }, { type: 'absolute', x: 2, y: 2 },
        { type: 'absolute', x: -2, y: 2 }, { type: 'absolute', x: 2, y: -2 }],
        color:color,
        x:x,
        y:y,
        
        afterThisPieceTaken:function(state){
            if(direction === undefined){
                let direction = 1;
                if(color == 'black'){
                    direction = -1;
                }
            }
            const copy = findCopyPieceByXY(state.pieces,this.x,this.y + direction);
            const squareCheck = state.board.find((sq) => {
                return sq.x == this.x && sq.y == this.y + direction;
            })
            if(!copy && squareCheck != undefined){
                state.pieces.push(ghostFactory(color,this.x,this.y + direction));
            }
        }
    }

}

function hatFactory(color,x,y){
    const moves = [{ type: 'blockable', repeat: true, x: 0, y: -1 }, { type: 'blockable', repeat: true, x: 0, y: 1 },
        { type: 'blockable', repeat: true, x: -1, y: 0 }, { type: 'blockable', repeat: true, x: 1, y: 0 },
    
    {type:'absolute',impotent:true, x:-1,y:1} , {type:'absolute',impotent:true, x:-1,y:-1} , 
    {type:'absolute',impotent:true, x:1,y:1} , {type:'absolute',impotent:true, x:1,y:-1}]

    return {
        icon: color + 'Hat.png',
        moves:moves,
        color:color,
        x:x,
        y:y,
        value:500,
        afterThisPieceTaken: function (state) {
            if (this.color == 'white') {
                state.won = 'black';
            }
            else if (this.color == 'black') {
                state.won = 'white';
            }
        }
    }
}

function clownFactory(color,x,y){
    const moves= [{ type: 'blockable', repeat: true, x: 0, y: -1, impotent:true }, { type: 'blockable', repeat: true, x: 0, y: 1, impotent:true },
    { type: 'blockable', repeat: true, x: -1, y: 0, impotent:true }, { type: 'blockable', repeat: true, x: 1, y: 0, impotent:true },
    { type: 'blockable', repeat: true, x: -1, y: -1, impotent:true }, { type: 'blockable', repeat: true, x: 1, y: 1, impotent:true },
    { type: 'blockable', repeat: true, x: -1, y: 1, impotent:true }, { type: 'blockable', repeat: true, x: 1, y: -1, impotent:true },{
        type:'allMine'
    }]

    return {
        icon: color + 'Clown.png',
        moves:moves,
        color:color,
        x:x,
        y:y,
        value:2,
        friendlyPieceInteraction: function(state,friendlyPiece,prevMove) {
            if(friendlyPiece)
            {
                if(friendlyPiece == state.pieceSelected){
                    return true;
                }
                friendlyPiece.x = prevMove.x;
                friendlyPiece.y = prevMove.y;
            }
        }
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
        value:1,
        moved: false,
        enPassantMove:false,
        color: color,
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
                    // console.log(conditionalMoves)

                }
            }
            return conditionalMoves;
        },
        afterPieceMove: function (state, move, prevMove) {
            //return false if you want to prevent next turn and true if you want to continue it
            if (!this.moved) {
                this.moved = true;
            }
            if (this.color == 'black' && this.y == 7) {
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
                    return piece.x == move.x && piece.y == move.y-1 && piece.color != this.color //&& !findCopyPieceByXY(state.pieces,move.x,move.y)
                })
                if(enemyPiece){
                    state.pieces.splice(state.pieces.indexOf(enemyPiece),1);    
                    enemyPiece.x = undefined;
                    enemyPiece.y = undefined;
                }

            }
            else{


                const enemyPiece = state.pieces.find((piece) => {
                    return piece.x == move.x && piece.y == move.y  + 1 && piece.color != this.color //&& !findCopyPieceByXY(state.pieces,move.x,move.y)
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
            this.enPassantMove = false;
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

function dragonFactory(color,x,y){
 return {
        color: color,
        x:x,
        y:y,
        icon:'dragonImage',
        moves: [{ type: 'blockable', repeat: true, x: 0, y: -1 }, { type: 'blockable', repeat: true, x: 0, y: 1 },
        { type: 'blockable', repeat: true, x: -1, y: 0 }, { type: 'blockable', repeat: true, x: 1, y: 0 },
        { type: 'blockable', repeat: true, x: -1, y: -1 }, { type: 'blockable', repeat: true, x: 1, y: 1 },
        { type: 'blockable', repeat: true, x: -1, y: 1 }, { type: 'blockable', repeat: true, x: 1, y: -1 },
        { type: 'absolute', y: 2, x: 1 }, { type: 'absolute', y: 2, x: -1 },
        { type: 'absolute', y: -2, x: 1 }, { type: 'absolute', y: -2, x: -1 },
        { type: 'absolute', y: 1, x: 2 }, { type: 'absolute', y: 1, x: -2 },
        { type: 'absolute', y: -1, x: 2 }, { type: 'absolute', y: -1, x: -2 }],

        afterPlayerMove: function (state, move) {
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

                        if ((move.type == 'absolute' || move.type == 'takeMove') && !move.impotent) {
                            if(piece.x + move.x === this.x && piece.y + move.y === this.y){
                                state.message = "Playing this move will leave you checked!"
                                return true
                            }
                        }
                        else if (move.type == 'blockable'  && !move.impotent) {
                            if (move.repeat) {
                                const limit = move.limit || 100;
                                if(blockableCheck(state, move.x, move.y, piece.x, piece.y, move, limit, this) == 'block'){
                                    state.message = "Playing this move will leave you checked!"
                                    return true
                                }
                            }
                        }
                    }
                }
            }
            return
        },
        
    afterEnemyPlayerMove: function(state,move){
        let enemyColor = 'black';
        if (this.color == 'black') {
            enemyColor = 'white'
        }
        if(areYouChecked(state,enemyColor,this)){
            let fakeState = JSON.parse(JSON.stringify(state));
            let possibleEscape = false;
            for(let i = fakeState.pieces.length - 1; i>=0; i--){
                let friendlyPiece = fakeState.pieces[i];
                let tempMoves = [];

                if(friendlyPiece.color == this.color){
                    if (friendlyPiece.conditionalMoves) {
                        tempMoves = friendlyPiece.conditionalMoves(state); //  If the piece is from your team we gonna need it's conditional moves.
                    }
                    fakeState.turn = this.color;

                    fakeState.pieceSelected = friendlyPiece;

                    lightBoard(friendlyPiece,fakeState, 'light')

                    const lightedSquares = fakeState.board.filter((sq) => {
                        return sq.light == true;
                    })

                    lightedSquares.forEach((sq) => {
                        friendlyPiece = fakeState.pieces[i];
                        fakeState.pieceSelected = friendlyPiece;
                        lightBoard(friendlyPiece,fakeState, 'light')

                        fakeKing = fakeState.pieces.find((piece) => {
                            return piece.x == this.x && piece.y == this.y
                        });
                        playerMove({x:sq.x, y:sq.y},fakeState)

                        if(!areYouChecked(fakeState,enemyColor,fakeKing)){
                            possibleEscape = true;
                        }
                        fakeState = JSON.parse(JSON.stringify(state));
                    })

                }
            }
            if(!possibleEscape){
                state.won = enemyColor
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
        color: color
    }
}

function rookFactory(color, x, y) {
    return {
        icon: color + 'Rook.png',
        moves: [{ type: 'blockable', repeat: true, x: 0, y: -1 }, { type: 'blockable', repeat: true, x: 0, y: 1 },
        { type: 'blockable', repeat: true, x: -1, y: 0 }, { type: 'blockable', repeat: true, x: 1, y: 0 }],
        x: x,
        y: y,
        value:5,
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
        color: color
    }
}




function kingFactory(color, x, y) {
    return {
        icon: color + 'King.png',
        vulnerable: true,
        moved: false,
        moves: [{ type: 'absolute', x: 0, y: -1 }, { type: 'absolute', x: 0, y: 1 },
        { type: 'absolute', x: -1, y: 0 }, { type: 'absolute', x: 1, y: 0 },
        { type: 'absolute', x: -1, y: -1 }, { type: 'absolute', x: 1, y: 1 },
        { type: 'absolute', x: -1, y: 1 }, { type: 'absolute', x: 1, y: -1 }],
        x: x,
        y: y,
        value:100000,
        color: color,

        conditionalMoves: function(state){
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

                let toReturn = []
                availableRooks.forEach((rook) => {
                    if(rook.x > this.x){
                        toReturn.push({type:'blockable',x:1,y:0, repeat:true, limit:2})
                    }
                    else{
                        toReturn.push({type:'blockable',x:-1,y:0,repeat:true,limit:2})
                    }
                })

                return toReturn
                 
            }
            else{
                return [];
            }
        },
        afterThisPieceTaken: function (state) {
            if (this.color == 'white') {
                state.won = 'black';
            }
            else if (this.color == 'black') {
                state.won = 'white';
            }
        },
        afterEnemyPlayerMove: function(state,move){
            let enemyColor = 'black';
            if (this.color == 'black') {
                enemyColor = 'white'
            }
            if(areYouChecked(state,enemyColor,this)){
                let fakeState = JSON.parse(JSON.stringify(state));
                let possibleEscape = false;
                for(let i = fakeState.pieces.length - 1; i>=0; i--){
                    let friendlyPiece = fakeState.pieces[i];    
                    if(friendlyPiece.color == this.color){
                        if (friendlyPiece.conditionalMoves) {
                            tempMoves = friendlyPiece.conditionalMoves(state); //  If the piece is from your team we gonna need it's conditional moves.
                        }
                        fakeState.turn = this.color;
    
                        fakeState.pieceSelected = friendlyPiece;
    
                        lightBoard(friendlyPiece,fakeState, 'light')
    
                        const lightedSquares = fakeState.board.filter((sq) => {
                            return sq.light == true;
                        })
    
                        lightedSquares.forEach((sq) => {
                            friendlyPiece = fakeState.pieces[i];
                            fakeState.pieceSelected = friendlyPiece;
                            lightBoard(friendlyPiece,fakeState, 'light')
    
                            fakeKing = fakeState.pieces.find((piece) => {
                                return piece.x == this.x && piece.y == this.y
                            });
                            playerMove({x:sq.x, y:sq.y},fakeState)
                            if(!areYouChecked(fakeState,enemyColor,fakeKing)){
                                possibleEscape = true;
                            }
                            fakeState = JSON.parse(JSON.stringify(state));
                        })
    
                    }
                }
                if(!possibleEscape){
                    state.won = enemyColor
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
                rook.x = 3;
            }
            else if(caseTwo){
                let rook 
                
                if(state.pieces[findPieceByXY(state.pieces,7,row)]){
                    rook = state.pieces[findPieceByXY(state.pieces,7,row)];
                }
                rook.x = 5;
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

                        if ((move.type == 'absolute' || move.type == 'takeMove') && !move.impotent && !(attemptMove.x == piece.x && attemptMove.y == piece.y)) {
                            if(piece.x + move.x === this.x && piece.y + move.y === this.y){
                                state.message = "Playing this move will leave you checked!"
                                return true
                            }
                        }
                        else if (move.type == 'blockable'  && !move.impotent && !(attemptMove.x == piece.x && attemptMove.y == piece.y)) {
                            if (move.repeat) {

                                const limit = move.limit || 100;
                                if(blockableCheck(state, move.x, move.y, piece.x, piece.y, move, limit, this) == 'block'){
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

function antFactory(color,x,y, direction){
    if(direction === undefined){
        let direction = 1;
        if(color == 'black'){
            direction = -1;
        }
    }
    if(!direction){
        direction =  color
    }
    let moves = [{ type: 'blockable', repeat:true,limit:2, y: -1, x: 0 }]

    if (direction == 'black') {
        moves = [{ type: 'blockable', repeat:true, limit:2, y: 1, x: 0 }]
    }
    let weakMoves = [{ type: 'blockable', repeat:true, limit:1, y: -1, x: 0 }]

    if (direction == 'black') {
        weakMoves = [{ type: 'blockable', repeat:true, limit:1, y: 1, x: 0 }]
    }
    return {
        icon: color+'Ant.png',
        moves:moves,
        weakMoves: weakMoves,
        color:color,
        x:x,
        y:y,
        value:0.6,
        afterPieceMove: function(state,move,prevMove) {
            if(direction == 'white' && move.y == 0 || direction == 'black' && move.y == 7)
            {
                const me = state.pieces.find((piece) => {
                    return piece.x == move.x && piece.y == move.y
                })
                state.pieces.splice(state.pieces.indexOf(me),1);
                state.pieces.push(queenBugFactory(this.color,move.x,move.y));
                return true;
            }
            return true;
        }
    }
}

function goliathBugFactory(color,x,y){
    let moves = [{ type: 'blockable', repeat: true, x: 0, y: -1 }, { type: 'blockable', repeat: true, x: 0, y: 1 },
        { type: 'blockable', repeat: true, x: -1, y: 0 }, { type: 'blockable', repeat: true, x: 1, y: 0 },
        { type: 'absolute', x: 0, y: -1 }, { type: 'absolute', x: 0, y: 1 },
        { type: 'absolute', x: -1, y: 0 }, { type: 'absolute', x: 1, y: 0 },
        { type: 'absolute', x: -1, y: -1 }, { type: 'absolute', x: 1, y: 1 },
        { type: 'absolute', x: -1, y: 1 }, { type: 'absolute', x: 1, y: -1 }]

    let weakMoves = [{ type: 'absolute', x: 0, y: -1 }, { type: 'absolute', x: 0, y: 1 },
    { type: 'absolute', x: -1, y: 0 }, { type: 'absolute', x: 1, y: 0 },
    { type: 'absolute', x: -1, y: -1 }, { type: 'absolute', x: 1, y: 1 },
    { type: 'absolute', x: -1, y: 1 }, { type: 'absolute', x: 1, y: -1 }]

    return {
        icon: color+'GoliathBug.png',
        moves:moves,
        color:color,
        weakMoves:weakMoves,
        x:x,
        y:y,
        value:7
    }
}

function ladyBugFactory(color,x,y){
    let moves = [{ type: 'blockable', repeat: true, x: -1, y: -1 }, { type: 'blockable', repeat: true, x: 1, y: 1 },
    { type: 'blockable', repeat: true, x: -1, y: 1 }, { type: 'blockable', repeat: true, x: 1, y: -1 }, 
    { type: 'absolute', x: 0, y: -1 }, { type: 'absolute', x: 0, y: 1 },
    { type: 'absolute', x: -1, y: 0 }, { type: 'absolute', x: 1, y: 0 },
    { type: 'absolute', x: -1, y: -1 }, { type: 'absolute', x: 1, y: 1 },
    { type: 'absolute', x: -1, y: 1 }, { type: 'absolute', x: 1, y: -1 }]

    let weakMoves = [{ type: 'absolute', x: 0, y: -1 }, { type: 'absolute', x: 0, y: 1 },
    { type: 'absolute', x: -1, y: 0 }, { type: 'absolute', x: 1, y: 0 },
    { type: 'absolute', x: -1, y: -1 }, { type: 'absolute', x: 1, y: 1 },
    { type: 'absolute', x: -1, y: 1 }, { type: 'absolute', x: 1, y: -1 }]

    return {
        icon: color+'LadyBug.png',
        moves:moves,
        color:color,
        weakMoves:weakMoves,
        x:x,
        y:y,
        value:5,
    }
}

function spiderFactory(color,x,y){
    let moves = [{ type: 'absolute', y: 2, x: 1 }, { type: 'absolute', y: 2, x: -1 },
    { type: 'absolute', y: -2, x: 1 }, { type: 'absolute', y: -2, x: -1 },
    { type: 'absolute', y: 1, x: 2 }, { type: 'absolute', y: 1, x: -2 },
    { type: 'absolute', y: -1, x: 2 }, { type: 'absolute', y: -1, x: -2 }, 
    { type: 'absolute', x: 0, y: -1 }, { type: 'absolute', x: 0, y: 1 },
    { type: 'absolute', x: -1, y: 0 }, { type: 'absolute', x: 1, y: 0 },
    { type: 'absolute', x: -1, y: -1 }, { type: 'absolute', x: 1, y: 1 },
    { type: 'absolute', x: -1, y: 1 }, { type: 'absolute', x: 1, y: -1 }]

    let weakMoves = [{ type: 'absolute', x: 0, y: -1 }, { type: 'absolute', x: 0, y: 1 },
    { type: 'absolute', x: -1, y: 0 }, { type: 'absolute', x: 1, y: 0 },
    { type: 'absolute', x: -1, y: -1 }, { type: 'absolute', x: 1, y: 1 },
    { type: 'absolute', x: -1, y: 1 }, { type: 'absolute', x: 1, y: -1 }]

    return {
        icon: color+'Spider.png',
        moves:moves,
        color:color,
        weakMoves:weakMoves,
        x:x,
        y:y,
        value:5
    }
}

function shroomFactory(color,x,y){
    return {
        icon: color+'Shroom.png',
        moves:[],
        color:color,
        x:x,
        y:y,
        value:5000,
        afterThisPieceTaken:function(state){
            state.pieces.forEach((piece) => {
                if(piece.color == this.color){
                    if(piece.weakMoves){
                        if(piece.moves == piece.weakMoves){
                            state.won = giveOppositeColor(this.color)
                        }
                        else{
                            piece.moves = piece.weakMoves;
                            if(piece.icon.contains('Ant.png')){
                                piece.value = 0.4
                            }
                            else if(piece.icon.contains('Shroom.ong')){
                                piece.value = 5000;
                            }
                            else{
                                piece.value = 2.5;
                            }
                        }
                    }
                }
            })
        }
    }
}


function queenBugFactory(color,x,y){
    return {
        icon: color+'QueenBug.png',
        moves: [{ type: 'absolute', x: 0, y: -1, impotent:true }, { type: 'absolute', x: 0, y: 1 , impotent:true},
        { type: 'absolute', x: -1, y: 0, impotent:true }, { type: 'absolute', x: 1, y: 0, impotent:true }],
        color:color,
        x:x,
        y:y,
        value:2,
        
        afterPieceMove:function(state, move, prevMove) {
            if(direction === undefined){
                let direction = 1;
                if(color == 'black'){
                    direction = -1;
                }
            }
            const direction = this.y == 0  || this.y == 1 || this.y == 2? 'black' : 'white'
            this.x = prevMove.x;
            this.y = prevMove.y;
            const ant = antFactory(color,move.x,move.y,direction)
            state.pieces.push(ant);
            const currentShrooms = state.pieces.filter((shroom) => {
                return shroom.icon == this.color + 'Shroom.png';
            })
            if(currentShrooms.length == 1){
                ant.moves = ant.weakMoves;
            }
            state.turn = giveOppositeColor(state.turn)
            return false;
        }
    }
}


function swordsMen(color, x, y){
    let moves = [{ type: 'absolute',  y: -1, x: 0 }, { type: 'absolute', y: -1, x: -1 }, { type: 'absolute', y: -1, x: 1 }]

    if (color == 'black') {
        moves = [{ type: 'absolute',  y: 1, x: 0 }, { type: 'absolute', y: 1, x: -1 }, { type: 'absolute', y: 1, x: 1 }];
    }
    return {
        icon: color + 'Swordsmen.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:1,
        posValue:0.1,
    }
}


function northernKing(color, x, y){
    let moves = [{ type: 'absolute',  y: -1, x: 0 }]

    if (color == 'black') {
        moves = [{ type: 'absolute',  y: 1, x: 0 }];
    }
    return {
        icon: color + 'NorthernKing.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:250,
        afterThisPieceTaken: function (state) {

            let find = state.pieces.find((el) => {
                el.icon === this.color + 'PlagueDoctor.png'
            })
            if(!find){
                state.won = giveOppositeColor(this.color);
            }

        },
        afterPieceMove:function(state, move, prevMove){
            let promoteCondition = this.color === 'black' && this.y === 3 || this.color === 'white' && this.y === 4;
            let fencerPower = this.color === 'black' ? this.y : 7-this.y;


            if(promoteCondition){
                state.pieces.forEach((piece) => {
                    if(piece.color === this.color && (piece.icon === piece.color + 'Pikeman.png' || piece.icon === piece.color + 'Swordsmen.png')){
                        piece.icon =  piece.color+'Knight.png';
                        piece.moves = [{ type: 'absolute', y: 2, x: 1 }, { type: 'absolute', y: 2, x: -1 },
                        { type: 'absolute', y: -2, x: 1 }, { type: 'absolute', y: -2, x: -1 },
                        { type: 'absolute', y: 1, x: 2 }, { type: 'absolute', y: 1, x: -2 },
                        { type: 'absolute', y: -1, x: 2 }, { type: 'absolute', y: -1, x: -2 }]
                        piece.value = 2.5;
                        piece.posValue = 0.3;
                    }
                })
            }


            state.pieces.forEach((piece) => {
                if(piece.color === this.color && piece.icon === piece.color + 'Fencer.png'){
                    piece.moves =  [];
                    for(let i = fencerPower; i>=0; i--){
                        piece.moves.push(
                            {type: 'absolute', y: i, x: i },
                            {type: 'absolute', y:-i, x:-i},
                            {type: 'absolute', y:-i, x:i},
                            {type: 'absolute', y:i, x:-i},
                              )
                    }
                    piece.value = fencerPower*1.2
                   
                }
            })
            return true;
        }
    }
}

function pikeman(color, x, y){
    let moves = [{ type: 'absolute', impotent: true, y: -1, x: 0 }, { type: 'takeMove', y: -2, x: -1 }, { type: 'takeMove', y: -2, x: 1 }, { type: 'takeMove', y: -2, x: 0 }]

    if (color == 'black') {
        moves = [{ type: 'absolute', impotent: true, y: 1, x: 0 }, { type: 'takeMove', y: 2, x: -1 }, { type: 'takeMove', y: 2, x: 1 }, { type: 'takeMove', y: 2, x: 0 }];
    }

    return {
        icon: color + 'Pikeman.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:1,
        posValue:0.1,
    }
}

function kolba(color, x, y){
    let moves = []

    return {
        icon: color + 'Kolba.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:0.8,
        posValue:0.1,
        afterEnemyPieceTaken:function(enemyPiece,state){
            this.moves = enemyPiece.moves;
            let iconCode = enemyPiece.icon.replace('black', '');
            iconCode = iconCode.replace('white', "");

            this.icon = this.color + iconCode;
            this.value = enemyPiece.value;
            this.posValue = enemyPiece.posValue;
            console.log('vliza tuka')
        }
    }
}

function fencer(color, x, y){
    let moves = []

    return {
        icon: color + 'Fencer.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:1,
        posValue:0.1,
    }
}

function general(color, x, y){
    let moves = [{ type: 'absolute', impotent: true, y: -1, x: 0 }, { type: 'absolute', y: -1, x: -1 }, { type: 'absolute', y: -1, x: 1 }]

    if (color == 'black') {
        moves = [{ type: 'absolute', impotent: true, y: 1, x: 0 }, { type: 'absolute', y: 1, x: -1 }, { type: 'absolute', y: 1, x: 1 }];
    }
    return {
        icon: color + 'General.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:1,
        posValue:0.1,
    }
}

function shield(color, x, y){
    let moves = [{ type: 'blockable', repeat: true, x: -1, y: 0 }, { type: 'blockable', repeat: true, x: 1, y: 0 },{ type: 'blockable', 
    repeat:true, limit:1, y: -1, x: 0}, { type: 'blockable', repeat:true, limit:1, y: 1, x: 0 }]

    return {
        icon: color + 'Shield.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:1,
        posValue:0.1,
    }
}

function plagueDoctor(color, x, y){
    let moves = [{ type: 'absolute',  y: -1, x: 0 }]

    if (color == 'black') {
        moves = [{ type: 'absolute',  y: 1, x: 0 }];
    }
    return {
        icon: color + 'PlagueDoctor.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:250,
        afterThisPieceTaken: function (state) {
            let find = state.pieces.find((el) => {
                el.icon === this.color + 'NorthernKing.png'
            })
            if(!find){
                state.won = giveOppositeColor(this.color);
            }
        },
        afterPieceMove:function(state, move, prevMove){
            let promoteCondition = this.color === 'black' && this.y === 3 || this.color === 'white' && this.y === 4;
            let kolbaPower = this.color === 'black' ? this.y : 7-this.y;
            if(promoteCondition){
                state.pieces.forEach((piece) => {
                    if(piece.color === this.color && piece.icon === piece.color + 'SleepingDragon.png'){
                        piece.icon =  piece.color+'Dragon.png';
                        piece.moves =  [{ type: 'blockable', repeat: true, x: 0, y: -1 }, { type: 'blockable', repeat: true, x: 0, y: 1 },
                        { type: 'blockable', repeat: true, x: -1, y: 0 }, { type: 'blockable', repeat: true, x: 1, y: 0 },
                        { type: 'absolute', y: 2, x: 1 }, { type: 'absolute', y: 2, x: -1 },
                        { type: 'absolute', y: -2, x: 1 }, { type: 'absolute', y: -2, x: -1 },
                        { type: 'absolute', y: 1, x: 2 }, { type: 'absolute', y: 1, x: -2 },
                        { type: 'absolute', y: -1, x: 2 }, { type: 'absolute', y: -1, x: -2 }
                    ],
                        piece.value = 8.5;
                        piece.posValue = 0.3;
                    }
                })
            }
            state.pieces.forEach((piece) => {
                if(piece.color === this.color && piece.icon === piece.color + 'Kolba.png'){
                    piece.moves = [{ type: 'blockable', repeat: true, x: 0, y: -1, limit:kolbaPower }, { type: 'blockable', repeat: true, x: 0, y: 1,limit:kolbaPower },
                    { type: 'blockable', repeat: true, x: -1, y: 0 ,limit:kolbaPower}, { type: 'blockable', repeat: true, x: 1, y: 0 ,limit:kolbaPower},
                    { type: 'blockable', repeat: true, x: -1, y: -1 ,limit:kolbaPower}, { type: 'blockable', repeat: true, x: 1, y: 1 ,limit:kolbaPower},
                    { type: 'blockable', repeat: true, x: -1, y: 1 ,limit:kolbaPower}, { type: 'blockable', repeat: true, x: 1, y: -1 ,limit:kolbaPower}];
                    piece.value = kolbaPower*1
                   
                }
            })
            return true;
        }
    }
}

function starMan(color, x, y){
    let moves = [{ type: 'absolute', impotent: true, y: -1, x: 0 }, { type: 'absolute', y: -1, x: -1 }, { type: 'absolute', y: -1, x: 1 }]

    if (color == 'black') {
        moves = [{ type: 'absolute', impotent: true, y: 1, x: 0 }, { type: 'absolute', y: 1, x: -1 }, { type: 'absolute', y: 1, x: 1 }];
    }
    return {
        icon: color + 'StarMan.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:1,
        posValue:0.1,
    }
}


function sleepingDragon(color,x,y){
    let moves = []

    return {
        icon: color + 'SleepingDragon.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:1,
        posValue:0.1,
    }
}
module.exports = {
    queenBugFactory:queenBugFactory,
    kingFactory: kingFactory,
    shroomFactory: shroomFactory,
    pawnFactory: pawnFactory,
    goliathBugFactory: goliathBugFactory,
    antFactory: antFactory,
    knightFactory: knightFactory,
    rookFactory: rookFactory,
    queenFactory: queenFactory,
    bishopFactory: bishopFactory,
    weakPawn: weakPawn,
    dragonFactory: dragonFactory,
    unpromotablePawn:unpromotablePawn,
    mongolianKnightFactory: mongolianKnightFactory,
    ricarFactory: ricarFactory,
    horseFactory: horseFactory,
    ghostFactory: ghostFactory,
    hatFactory: hatFactory,
    clownFactory: clownFactory,
    pigFactory:pigFactory,
    ladyBugFactory:ladyBugFactory,
    spiderFactory: spiderFactory,
    swordsMen:swordsMen,
    northernKing:northernKing,
    pikeman:pikeman,
    kolba:kolba,
    fencer:fencer,
    general:general,
    shield:shield,
    plagueDoctor:plagueDoctor,
    starMan:starMan,
    sleepingDragon:sleepingDragon
}