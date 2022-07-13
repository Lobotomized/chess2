let globalPosValue = 0.1//Math.random();

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
        posValue:3
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
        value:1,
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
        posValue:1,
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
        y:y,
        value:0.6,
        posValue:1
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
        y:y,
        value:2,
        posValue:1.5
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
        y:y,
        value:5,
        posValue:3
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
        value:2.5,
        posValue:3,
        afterThisPieceTaken:function(state){
            color = this.color;
            let direction = 1;

            if(color == 'black'){
                direction = -1;
            }
            else{
                direction = 1;
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
        value:50000,
        posValue:1.5,
        x:x,
        y:y,
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
        posValue:0.1,
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
        moved: false,
        enPassantMove:false,
        color: color,
        value:1,
        posValue:1,
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

            if(this.enPassantMove){
                this.enPassantMove = false;
            }
            if(this.color == 'black'){
                if(move.y == prevMove.y + 2){
                    this.enPassantMove = true;
                }

                const enemyPiece = state.pieces.find((piece) => {
                    return piece.x == move.x && piece.y == move.y -1 && piece.color != this.color && !findCopyPieceByXY(state.pieces,move.x,move.y)
                })
                if(enemyPiece){
                    state.pieces.splice(state.pieces.indexOf(enemyPiece),1);
                    enemyPiece.x = undefined;
                    enemyPiece.y = undefined;
                }

            }
            else{
                if(move.y == prevMove.y -2){
                    this.enPassantMove = true;
                }

                const enemyPiece = state.pieces.find((piece) => {
                    return piece.x == move.x && piece.y == move.y  + 1 && piece.color != this.color && !findCopyPieceByXY(state.pieces,move.x,move.y)
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
        posValue:2,
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
        posValue:3,
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
        posValue:2,
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
        value:500,
        posValue:1,
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
                console.log(piece.conditionalMoves);

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
        posValue:1,
        afterPieceMove: function(state,move,prevMove) {
            let direction = this.color;
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
        posValue:3,
        value:7,
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
        posValue:3,
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
        value:4.5,
        posValue:3,
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
        posValue:1,
        afterThisPieceTaken:function(state){
            state.pieces.forEach((piece) => {
                if(piece.color == this.color){
                    if(piece.weakMoves){
                        if(piece.moves == piece.weakMoves){
                            state.won = giveOppositeColor(this.color)
                        }
                        else{
                            piece.moves = piece.weakMoves;
                        }
                    }
                }
            })
        }
    }
}

function giveOppositeColor(color){
    if(color == 'white'){
        return 'black'
    }
    else if(color == 'black'){
        return 'white'
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
        value:2.5,
        posValue:1,
        afterPieceMove:function(state, move, prevMove) {
            const direction = this.y == 0  || this.y == 1 || this.y == 2? 'black' : 'white'
            this.x = prevMove.x;
            this.y = prevMove.y;
            const ant = antFactory(this.color,move.x,move.y,direction)
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




const AIProps = {
    state:undefined,
    color:'white'
 }
 
 let pieceToValue = {
     
 }

 let JSONfn;
if (!JSONfn) {
    JSONfn = {};
}
function findCopyPieceByXY(pieces,x,y){
    return pieces.find((piece) => {
        return piece .x == x && piece.y == y;
    })
}

JSONfn.stringify = function(obj) {
    return JSON.stringify(obj,function(key, value){
            return (typeof value === 'function' ) ? value.toString() : value;
        });
}

JSONfn.parse = function(str) {
    return JSON.parse(str,function(key, value){
        if(typeof value != 'string') return value;
        return ( value.substring(0,8) == 'function') ? eval('('+value+')') : value;
    });
}
 
function evaluateBoard(colorPerspective, pieces, board){
    let counter = 0;
    let valueTransformer = 1;
    let valueCounter = 0;

    while(pieces.length > counter){
        const piece = pieces[counter]
        lightBoardFE(piece,{pieces:pieces, board:board},'allowedMove')
        const filtered = board.filter((square) => {
            return square['allowedMove']
        })
         let magnifier = filtered.length * globalPosValue*piece.posValue;
        if(colorPerspective === piece.color){
            valueTransformer = piece.value ? piece.value + magnifier : 1 + magnifier;
        }
        else{
            valueTransformer = piece.value ? piece.value* -1 - magnifier : -1 - magnifier;
        }
        valueCounter += valueTransformer;
        counter++;
    }
    return valueCounter;
}
 
 //How Does a move look? 
 /*
     MovedPiece,
     MoveIndex
     But than what if move blockable?
 */
 
 
 /*
     Function that fake moves and generates new board and pieces after that
     (move) => {
         return {board:board,pieces:pieces}
     }
 */
 
 /*
     Function that actually moves
 
     //Select A Piece
 
     //Move It
 
 */
 
 function AISetup(hotseatGame, AIColor){
     AIProps.hotseatGame = hotseatGame;
     AIProps.color = AIColor;
 }
 
 function AIMove(pieceIndex, xClicked, yClicked){
     const hotseatGame = AIProps.hotseatGame;
     const state = hotseatGame.state;
     const myPieces = getColorPieces(AIProps.hotseatGame.state.pieces,AIProps.color);
     selectPiece({x:myPieces[pieceIndex].x, y:myPieces[pieceIndex].y},state)
 
     const selectedPiece = state.pieceSelected;
 
     lightBoard(selectedPiece,{pieces:state.pieces, board:state.board})
     hotseatGame.move(state.turn,{ x: xClicked, y: yClicked });
 }
 
 function getColorPieces(pieces,color){
     const myPieces = pieces.filter((piece) => {
         if(color === piece.color){
             return true;
         }
     })
 
     return myPieces
 }
 
 
 function generateMovesFromPieces(state,color){
     const movesAndPieces = []
     color = color ? color : AIProps.color;
     let piecesCounter = 0;
     const myPieces = !color ?state.pieces : getColorPieces(state.pieces,color) //getColorPieces(state.pieces,   color);
     while(myPieces.length > piecesCounter){
         let movesCounter = 0;
         let piece = myPieces[piecesCounter]
         lightBoardFE(piece,{pieces:state.pieces, board:state.board},'allowedMove')
         // console.log(piece.moves.length, movesCounter, '  piece')
                 //     const result = playerMove({x:piece.x+move.x, y:piece.y+move.y},{board:state.board, pieces:newPieces, pieceSelected:piece},true, undefined, 'allowedMove')
 
         const allowedMoves = state.board.filter((square) => {
             return square.allowedMove;
         })
         while(allowedMoves.length > movesCounter){
             const newPieces = JSONfn.parse(JSONfn.stringify(state.pieces))
             let newMyPieces = getColorPieces(newPieces, color)
             piece = newMyPieces[piecesCounter];
 
 
             const square = allowedMoves[movesCounter]
             playerMove({x:square.x, y:square.y},{board:state.board, pieces:newPieces, pieceSelected:piece , turn:color},true, undefined, 'allowedMove')
 
 
             if( square && square.allowedMove){
                 movesAndPieces.push({pieceCounter:piecesCounter,pieces:newPieces, xClicked:square.x, yClicked:square.y})
             }
             movesCounter++
         }
 
         // while(piece.moves.length > movesCounter){
         //     const newPieces = JSON.parse(JSON.stringify(state.pieces))
 
         //     let newMyPieces = getColorPieces(newPieces, color)
         //     piece = newMyPieces[piecesCounter];
         //     const move = piece.moves[movesCounter]
         //     //Logic for check if move is possible
         //     const result = playerMove({x:piece.x+move.x, y:piece.y+move.y},{board:state.board, pieces:newPieces, pieceSelected:piece},true, undefined, 'allowedMove')
 
         //     if(result){
         //         // console.log(newPieces, '  novite figuri?')
         //     }
         //     const square = findSquareByXY(state.board,piece.x+move.x,piece.y+move.y)
         //     if( square && square.allowedMove){
         //         movesAndPieces.push({movesCounter:movesCounter, pieceCounter:piecesCounter,pieces:newPieces, xClicked:piece.x+move.x, yClicked:piece.y+move.y})
                 
         //     }
         //     movesCounter++
         // }
 
         piecesCounter++
     }
     return movesAndPieces
 }
 
 function minimax(state,maximizer, depth, removedTurns){
    const moves = generateMovesFromPieces(state,maximizer)
    let enemy = 'black';
    if(maximizer === 'black'){
        enemy = 'white';
    }
                
    let selectedMove = undefined;
    let badMoveResults= []
    let slizedMoves = moves.slice(0,depth);
    let lowestBadMoveResult = 99999999;

    slizedMoves.forEach((move, index) => {
        let isItBanned;
        if(removedTurns){
            isItBanned = removedTurns.find((removedTurn) => {
                return move.xClicked === removedTurn.xClicked && move.yClicked === removedTurn.yClicked && removedTurn.pieceCounter === move.pieceCounter
            })
        }

        if(isItBanned){
            return;
        }
        const badMoves = generateMovesFromPieces({board:state.board,pieces:move.pieces},enemy)
        let bestBadMove = {};
        let badMoveValue = -999999;
        badMoves.forEach((badMove) => {

            let thisValue = evaluateBoard(enemy,badMove.pieces, state.board)
            if(thisValue > badMoveValue){
                badMoveValue = thisValue;
                bestBadMove = {moveCounter:index, value:badMoveValue,pieces:badMove.pieces}
            }
        })
        badMoveResults.push(bestBadMove)
    })
    badMoveResults.forEach((badMoveResult) => {
        if(badMoveResult.value < lowestBadMoveResult ){
            lowestBadMoveResult = badMoveResult.value;
            selectedMove = {moveCounter:badMoveResult.moveCounter, value:lowestBadMoveResult};
        }
    })
   // if(lowestBadMoveResult > 2000){
        // badMoveResults.forEach((badMoveResult) => {
        //     if(badMoveResult.value > lowestBadMoveResult ){
        //         lowestBadMoveResult = badMoveResult.value;
        //         selectedMove = {moveCounter:badMoveResult.moveCounter, value:lowestBadMoveResult};
        //     }
        // })
   // }
    return moves[selectedMove.moveCounter];
    // const move = moves[selectedMove.moveCounter]
    // return move

    // AIMove(move.pieceCounter, move.xClicked, move.yClicked)
}


 function lightBoardFE(piece, state, flag,blockedFlag) {
    if (!flag) {
        flag = 'light'
    }
    closeLights(state.board, flag);
    if (!piece) {
        return;
    }
    let tempMoves = [];
    if (piece.conditionalMoves) {
        if(typeof piece.conditionalMoves === 'string'){
            let midObj = {conditionalMoves:piece.conditionalMoves}
           piece.conditionalMoves = JSONfn.parse(JSONfn.stringify(midObj)).conditionalMoves;
           tempMoves =  piece.conditionalMoves(state)
        }
        //tempMoves = piece.conditionalMoves(state);
    }
    [...piece.moves, ...tempMoves].forEach((move) => {
        if (move.type == 'absolute') {
            const square = state.board.find((el) => {
                return el.x === piece.x + move.x && el.y === piece.y + move.y
            })
            if (square) {
                const innerPiece = pieceFromSquare(square, state.pieces)
                if (innerPiece) {
                    if (innerPiece.color != piece.color && !move.impotent) {
                        square[flag] = true;
                    }
                    else{

                        square[blockedFlag] = true;
                    }
                }
                else if (!innerPiece) {
                    square[flag] = true;
                }
            }
        }
        else if (move.type == 'allMine') {
            state.board.forEach((square) => {
                const innerPiece = pieceFromSquare(square, state.pieces);
                if (innerPiece) {
                    if (innerPiece.color == piece.color) {
                        square[flag] = true;
                    }
                }
            })
        }
        else if (move.type == 'takeMove') {
            const square = state.board.find((el) => {
                return el.x === piece.x + move.x && el.y === piece.y + move.y
            })
            if (square) {
                const innerPiece = pieceFromSquare(square, state.pieces)
                if (innerPiece) {
                    if (innerPiece.color != piece.color && !move.impotent) {
                        square[flag] = true;
                    }
                }
            }
        }
        else if (move.type == 'blockable') {
            if (move.repeat) {
                const limit = move.limit || 100;
                blockableSpecialFunction(state, move.x, move.y, piece.x, piece.y, move, limit, flag,blockedFlag);
            }
        }
    })
}

function blockableSpecialFunction(state, powerX, powerY, x, y, move, limit, flag,secondFlag) {
    if (!flag) {
        flag = 'light'
    }
    if (limit === 0) {
        return;
    }
    const square = state.board.find((el) => {
        return el.x === x + powerX && el.y === y + powerY;
    })
    if (!square) {
        return;
    }
    const piece = pieceFromSquare(square, state.pieces)

    let directionX = 0;
    if (powerX < 0) {
        directionX = -1;
    }
    else if (powerX > 0) {
        directionX = 1;
    }

    let directionY = 0;

    if (powerY < 0) {
        directionY = -1;
    }
    else if (powerY > 0) {
        directionY = 1;
    }
    else {
        directionY = 0;
    }


    if (!piece) {
        square[flag] = true;
        blockableSpecialFunction(state, powerX + directionX, powerY + directionY, x, y, move, limit - 1, flag,secondFlag)
    }
    else if (!move.impotent) {
        // console.log(state, state.pieces)
        let selectedPiece = pieceFromXY(x,y,state.pieces)
        square[flag] = true;

        if(selectedPiece){
            if(selectedPiece.color == piece.color){
                square[secondFlag] = true;
                square[flag] = false;

            }
        }
        
        blockableSpecialFunction(state, powerX + directionX, powerY + directionY, x, y, move, limit - 1, secondFlag,secondFlag)
    }

    return;
}


function playerMove(playerMove, state,alwaysLight,selectedForced, specialFlag) {
    // if legal move return true else return false
    let light = specialFlag || 'light';
    const x = playerMove.x;
    const y = playerMove.y;
    const operatedPiece = selectedForced ? selectedForced : state.pieceSelected
    const square = state.board.find((sq) => {
        return sq.x === x && sq.y === y;
    })

    if (!square) {
        return false;
    }
    if (!square[light] && !alwaysLight) {
        return false; // Square wasn't lighted in the lightBoard stage so the move is not legal
    }

    const enemyPiece = state.pieces.find((ePiece) => {
        return ePiece.x === x && ePiece.y === y && ePiece.color != operatedPiece.color
    })


    const friendlyPiece = state.pieces.find((ePiece) => {
        return ePiece.x === x && ePiece.y === y && ePiece.color == operatedPiece.color
    })

    const oldX = operatedPiece.x;
    const oldY = operatedPiece.y;

    operatedPiece.x = x;
    operatedPiece.y = y;
    let continueTurn = true;

    for (let i = state.pieces.length - 1; i >= 0; i--) {
        if (state.pieces[i].afterPlayerMove) {
            if(state.pieces[i].afterPlayerMove(state, playerMove, {x:oldX, y:oldY})){
                continueTurn = false;
            }
        }

        if(state.pieces[i].friendlyPieceInteraction){
            if(state.pieces[i].friendlyPieceInteraction(state, friendlyPiece, {x:oldX, y:oldY})){
                continueTurn = false;
            }    
        }
    }
    if(!continueTurn){

        operatedPiece.x = oldX;
        operatedPiece.y = oldY;
        return false;
    }
    else{
        if (enemyPiece) {
            if (enemyPiece.afterThisPieceTaken) {
                enemyPiece.afterThisPieceTaken(state)
            }
            if (operatedPiece.afterEnemyPieceTaken) {
                operatedPiece.afterEnemyPieceTaken(enemyPiece, state);
            }
            enemyPiece.x = undefined;
            enemyPiece.y = undefined;
            
            state.pieces.splice(state.pieces.indexOf(enemyPiece), 1)
        }
    }
    if (operatedPiece.afterPieceMove) {
        const continueTurn = operatedPiece.afterPieceMove(state, playerMove, {x:oldX, y:oldY});

        if (!continueTurn) {
            operatedPiece.x = oldX;
            operatedPiece.y = oldY;
            return false;
        }
    }
    state.oldMove = {oldX:oldX,oldY:oldY,currentY:operatedPiece.y,currentX:operatedPiece.x}
    state.pieceSelected = undefined;
    closeLights(state.board)

    return true;
}
function pieceFromXY(x,y, pieces) {
    const piece = pieces.find((p) => {
        return x === p.x && y === p.y;
    })

    return piece;
}


function pieceFromSquare(square, pieces) {
    const piece = pieces.find((p) => {
        return square.x === p.x && square.y === p.y;
    })  

    return piece;
}
 
function closeLights(board, flag) {
    if (!flag) {
        flag = 'light'
    }
    board.forEach((square) => {
        square[flag] = false;
    })
}
 function max(objOne, objTwo){
     if(objOne.value > objTwo.value){
         return objOne
     }
     else{
         return objTwo
     }
 }
 
 function min(objOne, objTwo){
     if(objOne.value < objTwo.value){
         return objOne
     }
     else{
         return objTwo
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
        y:y,
        value:0.6,
        posValue:1
    }
}

 

self.addEventListener("message", function(e) {
    let obj = JSON.parse(e.data)
    let move = JSONfn.stringify(minimax(obj.state,obj.color,obj.depth, obj.removedTurns))
    postMessage(move)
})

// function timedCount() {
//   i = i + 1;
//   postMessage(i);
// }

// timedCount();

function blockableCheck(state, powerX, powerY, x, y, move, limit,myPiece, flag,counter) {
    let toReturn;
    if (limit === 0) {
        return;
    }
    const square = state.board.find((el) => {
        return el.x === x + powerX && el.y === y + powerY;
    }) // Find a square for x/y
    if (!square) {
        return;
    }// If such a square does not exist return undefined
    let directionX = 0;
    if (powerX < 0) {
        directionX = -1;
    }
    else if (powerX > 0) {
        directionX = 1;
    }

    let directionY = 0;
    
    if (powerY < 0) {
        directionY = -1;
    }
    else if (powerY > 0) {
        directionY = 1;
    }
    else { 
        directionY = 0;
    }
    const secondPiece = state.pieces[findPieceByXY(state.pieces,x+powerX, y + powerY)] // The piece on the attacked square
    //Find the direction in which we are going
    if (!secondPiece && !(x+powerX == myPiece.x && y+powerY == myPiece.y)) {
        //If there is  no such piece continue
        return blockableCheck(state, powerX+directionX, powerY+directionY, x, y, move, limit - 1, myPiece,flag,counter+1)
    }
    else{
        if(secondPiece){
            if(secondPiece.x == myPiece.x && secondPiece.y == myPiece.y){
                toReturn = 'block';
                return 'block'
            }
        }
        else{
            if(x+powerX == myPiece.x && y+powerY == myPiece.y){
                toReturn = 'block'
                return 'block'
            }
        }

    }
    return toReturn
}

function checkEmptyHorizontalBetween(state,pieceOne, pieceTwo){

    let direction = false;
    let checker = true;
    let actor = pieceOne
    
    if(pieceOne.x > pieceTwo.x){
        direction = true;
    }
    let distance = 0;

    if(direction){
        distance = pieceOne.x - pieceTwo.x;
    }
    else{
        distance = pieceTwo.x - pieceOne.x;
        actor = pieceTwo
    }
    distance -=1;
    while(distance > 0){            
        if(state.pieces[findPieceByXY(state.pieces,actor.x-distance, actor.y)]){
            checker = false;
        }
        distance--;
    }
    return checker;
}

function findPieceByXY(pieces,x,y){
    let index =  pieces.findIndex((piece) => {
         return piece .x == x && piece.y == y;
     })
     return index
 }

 function isRoadAttacked(state,enemyColor,pointOne,pointTwo){
    let direction = false;
    let checker = false;
    let actor = pointOne

    let myColor = 'white';
    if(enemyColor == 'white'){
        myColor = 'black'
    }
    
    if(pointOne.x > pointTwo.x){
        direction = true;
    }
    let distance = 0;

    if(direction){
        distance = pointOne.x - pointTwo.x;
    }
    else{
        distance = pointTwo.x - pointOne.x;
        actor = pointTwo
    }
    for(let c = distance-1; c > 0; c--){
        if(areYouCheckedWithoutTempMoves(state,enemyColor,{x:actor.x-c,y:actor.y,color:myColor}, 'rokado')){
            checker = true;
        }

    }
    return checker;
}

function areYouCheckedWithoutTempMoves(state,enemyColor,me, flag){
    let toReturn = false;
    for (let i = state.pieces.length - 1; i >= 0; i--) {
        const piece = state.pieces[i]

        for(let ii = [...piece.moves].length-1; ii>=0; ii--){
            const move = [...piece.moves][ii];
            if (piece.color == enemyColor) {

                if ((move.type == 'absolute' || move.type == 'takeMove') && !move.impotent) {
                    if(piece.x + move.x == me.x && piece.y + move.y == me.y){
                        toReturn =  true;
                    }
                }
                else if (move.type == 'blockable' && !move.impotent) {
                    if (move.repeat) {
                        const limit = move.limit || 100;
                        if(blockableCheck(state, move.x, move.y, piece.x, piece.y, move, limit, me,'rokado') == 'block'){
                            toReturn = true;
                        }
                    }
                }
            }
        }
    }

    return toReturn

}