

try{
    var {playerMove} = require('./moveMethods.js')
    var {checkEmptyHorizontalBetween, isRoadAttacked, blockableCheck, areYouChecked, findPieceByXY, 
        findCopyPieceByXY, areYouCheckedWithoutTempMoves, isPositionAttacked, lightBoardFE} = require('./helperFunctions')
    
}
catch(err){

}
JSONfn = {};

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

function returnPieceWithColor(x,y,color,state){
    return state.pieces.find((el) => {
        return el.x === x && el.y === y && el.color === color;
    })
}

function conditionalSplice(array,index){
    if(index> -1){
        array.splice(index,1)
    }
}

function conditionalSpliceWithBonus(state,index,color){

    if(index> -1){
        if(state.pieces[index].afterThisPieceTaken){
            state.pieces[index].afterThisPieceTaken(state);
        }
        if(state.pieces[index].color != color || !color){
            state.pieces.splice(index,1)
        }
    }
}

function pieceAroundMe(state,aroundWhat,pieceTypeIcon){
    let gore =  state.pieces[findPieceByXY(state.pieces,aroundWhat.x,aroundWhat.y+1)]?.icon?.includes(pieceTypeIcon) && aroundWhat.color === state.pieces[findPieceByXY(state.pieces,aroundWhat.x,aroundWhat.y+1)]?.color;
    let dolu = state.pieces[findPieceByXY(state.pieces,aroundWhat.x,aroundWhat.y-1)]?.icon?.includes(pieceTypeIcon) && aroundWhat.color === state.pieces[findPieceByXY(state.pieces,aroundWhat.x,aroundWhat.y-1)]?.color;
    let lqvo = state.pieces[findPieceByXY(state.pieces,aroundWhat.x+1,aroundWhat.y)]?.icon?.includes(pieceTypeIcon)&& aroundWhat.color === state.pieces[findPieceByXY(state.pieces,aroundWhat.x+1,aroundWhat.y)]?.color;
    let dqsno = state.pieces[findPieceByXY(state.pieces,aroundWhat.x-1,aroundWhat.y)]?.icon?.includes(pieceTypeIcon) && aroundWhat.color === state.pieces[findPieceByXY(state.pieces,aroundWhat.x-1,aroundWhat.y)]?.color;;
    let lqvoGore = state.pieces[findPieceByXY(state.pieces,aroundWhat.x+1,aroundWhat.y+1)]?.icon?.includes(pieceTypeIcon)&& aroundWhat.color === state.pieces[findPieceByXY(state.pieces,aroundWhat.x+1,aroundWhat.y+1)]?.color;;
    let dqsnoGore = state.pieces[findPieceByXY(state.pieces,aroundWhat.x-1,aroundWhat.y+1)]?.icon?.includes(pieceTypeIcon)&& aroundWhat.color === state.pieces[findPieceByXY(state.pieces,aroundWhat.x-1,aroundWhat.y+1)]?.color;
    let lqvoDolu = state.pieces[findPieceByXY(state.pieces,aroundWhat.x+1,aroundWhat.y-1)]?.icon?.includes(pieceTypeIcon)&& aroundWhat.color === state.pieces[findPieceByXY(state.pieces,aroundWhat.x+1,aroundWhat.y-1)]?.color;;
    let dqsnoDolu = state.pieces[findPieceByXY(state.pieces,aroundWhat.x-1,aroundWhat.y-1)]?.icon?.includes(pieceTypeIcon)&& aroundWhat.color === state.pieces[findPieceByXY(state.pieces,aroundWhat.x-1,aroundWhat.y-1)]?.color;;
    
    return gore || dolu || lqvo || dqsno || lqvoGore || dqsnoGore || lqvoDolu || dqsnoDolu;
}



function cyborgTeleport(state,me,toReturn){
    let piece = returnPieceWithColor(me.x+0,me.y-1,me.color,state);
    if(piece && piece?.icon != me.icon){
        toReturn.push({ type: 'takeMove', x: 0, y: -1, friendlyPieces:true })
    }
    piece = returnPieceWithColor(me.x+0,me.y+1,me.color,state)
    if(piece && piece?.icon != me.icon){
        toReturn.push({ type: 'takeMove', x: 0, y: 1, friendlyPieces:true })
    }
    piece = returnPieceWithColor(me.x+1,me.y-1,me.color,state)
    if(piece && piece?.icon != me.icon){
        toReturn.push({ type: 'takeMove', x: 1, y: -1, friendlyPieces:true })
    }
    piece = returnPieceWithColor(me.x+1,me.y+1,me.color,state)
    if(piece && piece?.icon != me.icon){
        toReturn.push({ type: 'takeMove', x: 1, y: 1, friendlyPieces:true })
    }
    piece = returnPieceWithColor(me.x+1,me.y+0,me.color,state)
    if(piece && piece?.icon != me.icon){
        toReturn.push({ type: 'takeMove', x: 1, y: 0, friendlyPieces:true })
    }
    piece = returnPieceWithColor(me.x-1,me.y+0,me.color,state)
    if(piece && piece?.icon != me.icon){
        toReturn.push({ type: 'takeMove', x: -1, y: 0, friendlyPieces:true })
    }
    piece = returnPieceWithColor(me.x-1,me.y-1,me.color,state)

    if(piece && piece?.icon != me.icon){
        toReturn.push({ type: 'takeMove', x: -1, y:-1, friendlyPieces:true })
    }
    piece = returnPieceWithColor(me.x-1,me.y+1,me.color,state)

    if(piece && piece?.icon != me.icon){
        toReturn.push({ type: 'takeMove', x: -1, y: 1, friendlyPieces:true })
    }
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let posValue = [
    0.1,
    0.5,
    1,
    2,
    3,
    4
]

    
    
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
        value:2.5,
        posValue:0.1,
        afterPieceMove: function(state, move, prevMove){
            if(prevMove.x == 5  && prevMove.y == 5){
                state.won = this.color
            }
            if(move.x === 5 && move.y === 5){
                this.value = 2000;
            }
            else{
                this.value = 2.5;
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
        posValue:1,
        afterPieceMove: function (state, move) {
            //return false if you want to prevent next turn and true if you want to continue it
            if (!this.moved) {
                this.moved = true;
            }
            if (this.color == 'black' && state.pieceSelected.y == 1) {
                this.icon = this.color + 'Queen.png';
                this.moves.length = 0;
                this.moves.push({ type: 'blockable', repeat: true, x: 0, y: -1 }, { type: 'blockable', repeat: true, x: 0, y: 1 },
                    { type: 'blockable', repeat: true, x: -1, y: 0 }, { type: 'blockable', repeat: true, x: 1, y: 0 },
                    { type: 'blockable', repeat: true, x: -1, y: -1 }, { type: 'blockable', repeat: true, x: 1, y: 1 },
                    { type: 'blockable', repeat: true, x: -1, y: 1 }, { type: 'blockable', repeat: true, x: 1, y: -1 })
            }
            else if (this.color == 'white' && state.pieceSelected.y == 6) {
                this.icon = this.color + 'Queen.png';
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
        value:1,
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
        posValue:posValue[2]
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
        value:1.66,
        posValue:posValue[2]
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
        posValue:posValue[3]
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
        posValue:posValue[3],
        afterPlayerMove:function(state){
            color = this.color;
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
            if(copy || squareCheck != undefined){
                this.value = 4;
            }
            else{
                this.value = 2.5;
            }
        },
        
        afterThisPieceTaken:function(state){
            color = this.color;
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
        value:2000,
        posValue:posValue[4],
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
        posValue:posValue[2],
        friendlyPieceInteraction: function(state,friendlyPiece,prevMove) {
            if(friendlyPiece)
            {
                if(friendlyPiece.icon === this.icon){
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
                                const offsetX = move.offsetX || 0;
                                const offsetY = move.offsetY || 0;
                                
                                if(blockableCheck(state, move.x, move.y, piece.x + offsetX, piece.y + offsetY, move, limit, this) == 'block'){
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

                    lightBoardFE(friendlyPiece,fakeState, 'light',undefined,true)

                    const lightedSquares = fakeState.board.filter((sq) => {
                        return sq.light == true;
                    })

                    lightedSquares.forEach((sq) => {
                        friendlyPiece = fakeState.pieces[i];
                        fakeState.pieceSelected = friendlyPiece;
                        lightBoardFE(friendlyPiece,fakeState, 'light',undefined,true)

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




function kingFactory(color, x, y, options) {
    return {
        icon: color + 'King.png',
        vulnerable: true,
        moved: false,
        moves: [ 
                // { type: 'absolute', x: 0, y: 1 },{ type: 'absolute', x: 1, y: 0 },{ type: 'absolute', x: 1, y: 1 },
                //  { type: 'absolute', x: -1, y: -1 },{ type: 'absolute', x: 0, y: -1 },{ type: 'absolute', x: -1, y: 0 },
                //  { type: 'absolute', x: -1, y: 1 },{ type: 'absolute', x: 1, y: -1 }
                ],
        x: x,
        y: y,
        value:2000,
        posValue:posValue[3],
        color: color,
        options:options,
        conditionalMoves: function(state){
            let toReturn = []
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
        afterEnemyPlayerMove: function(state,move){
            let enemyColor = 'black';
            if (this.color == 'black') {
                enemyColor = 'white'
            }
            if(areYouChecked(state,enemyColor,this)){
                let fakeState = JSONfn.parse(JSONfn.stringify(state));
                let possibleEscape = false;
                for(let i = fakeState.pieces.length - 1; i>=0; i--){
                    let friendlyPiece = fakeState.pieces[i];    
                    if(friendlyPiece.color == this.color){
                        // if (friendlyPiece.conditionalMoves) {
                        //     tempMoves = friendlyPiece.conditionalMoves(state); //  If the piece is from your team we gonna need it's conditional moves.
                        // }
                        fakeState.turn = this.color;
    
                        fakeState.pieceSelected = friendlyPiece;
    
                        lightBoardFE(friendlyPiece,fakeState, 'light',undefined,true)
    
                        const lightedSquares = fakeState.board.filter((sq) => {
                            return sq.light == true;
                        })
    
                        lightedSquares.forEach((sq) => {
                            friendlyPiece = fakeState.pieces[i];
                            fakeState.pieceSelected = friendlyPiece;
                            lightBoardFE(friendlyPiece,fakeState, 'light',undefined,true)
    
                            fakeKing = fakeState.pieces.find((piece) => {
                                return piece.x == this.x && piece.y == this.y
                            });
                            playerMove({x:sq.x, y:sq.y},fakeState)
                            if(!areYouChecked(fakeState,enemyColor,fakeKing)){
                                possibleEscape = true;
                            }
                            fakeState = JSONfn.parse(JSONfn.stringify(state));
                        })
    
                    }
                }
                if(!possibleEscape){
                    state.won = enemyColor
                    if(this.options){
                        this.options?.gameEndedEvent(state.won);
                    }                
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
        posValue:posValue[2],
        direction:direction,
        afterPieceMove: function(state,move,prevMove) {
            let color = this.color;
            if(!this.direction){
                this.direction =  color
            }
           let checkForLastRow = state.board.find((square) => {
            return square.x === move.x && square.y > move.y;
           })
           let isItLast = false;
           if(!checkForLastRow){
            isItLast = true;
           }

            if(this.direction == 'white' && move.y == 0 || this.direction == 'black' && isItLast)
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
        posValue:posValue[3],
        value:7.5,
    }
}


function strongLadyBugFactory(color,x,y){
    let moves = [
        { type: 'absolute', x: 0, y: -1 }, { type: 'absolute', x: 0, y: 1 },
        { type: 'absolute', x: -1, y: 0 }, { type: 'absolute', x: 1, y: 0 },
    ]

    let weakMoves = [{ type: 'absolute', x: 0, y: -1 }, { type: 'absolute', x: 0, y: 1 },
    { type: 'absolute', x: -1, y: 0 }, { type: 'absolute', x: 1, y: 0 },
    { type: 'absolute', x: -1, y: -1 }, { type: 'absolute', x: 1, y: 1 },
    { type: 'absolute', x: -1, y: 1 }, { type: 'absolute', x: 1, y: -1 }]

    return {
        conditionalMoves: function (state) {
            const arrToReturn =[]

            const blockedUp = state.pieces.find((piece) => {
                return piece.y === this.y + 1 && this.x === piece.x;
            })

            const blockedDown = state.pieces.find((piece) => {
                return piece.y === this.y - 1 && this.x === piece.x;
            })

            const blockedLeft = state.pieces.find((piece) => {
                return piece.y === this.y && this.x === piece.x + 1;
            })

            const blockedRight = state.pieces.find((piece) => {
                return piece.y === this.y && this.x === piece.x - 1;
            })

            if(!blockedUp){
                arrToReturn.push(
                    { type: 'blockable', repeat: true, x: 1, y: 1, offsetY:1, limit:2, offsetCountsAsBlock:true },
                    { type: 'blockable', repeat: true, x: -1, y: 1, offsetY:1, limit:2, offsetCountsAsBlock:true },
                )
            }

            if(!blockedDown){
                arrToReturn.push(
                    { type: 'blockable', repeat: true, x: 1, y: -1, offsetY:-1, limit:2, offsetCountsAsBlock:true },
                    { type: 'blockable', repeat: true, x: -1, y: -1, offsetY:-1, limit:2, offsetCountsAsBlock:true },
                )
            }

            if(!blockedRight){
                arrToReturn.push(
                    { type: 'blockable', repeat: true, x: 1, y: 1, offsetX:1, limit:2, offsetCountsAsBlock:true },
                    { type: 'blockable', repeat: true, x: 1, y: -1, offsetX:1, limit:2, offsetCountsAsBlock:true },

                )
            }

            if(!blockedLeft){
                arrToReturn.push(
                    { type: 'blockable', repeat: true, x: -1, y: -1, offsetX:-1, limit:2, offsetCountsAsBlock:true },
                    { type: 'blockable', repeat: true, x: -1, y: 1, offsetX:-1, limit:2, offsetCountsAsBlock:true },
                )
            }

            return arrToReturn

        },
        icon: color+'LadyBug.png',
        moves:moves,
        color:color,
        weakMoves:weakMoves,
        x:x,
        y:y,
        value:5.5,
        posValue:posValue[3],
    }
}

function ladyBugFactory(color,x,y){
    let moves = [
        { type: 'absolute', x: 0, y: -1 }, { type: 'absolute', x: 0, y: 1 },
        { type: 'absolute', x: -1, y: 0 }, { type: 'absolute', x: 1, y: 0 },
    ]

    let weakMoves = [{ type: 'absolute', x: 0, y: -1 }, { type: 'absolute', x: 0, y: 1 },
    { type: 'absolute', x: -1, y: 0 }, { type: 'absolute', x: 1, y: 0 },
    { type: 'absolute', x: -1, y: -1 }, { type: 'absolute', x: 1, y: 1 },
    { type: 'absolute', x: -1, y: 1 }, { type: 'absolute', x: 1, y: -1 }]

    return {
        conditionalMoves: function (state) {
            const arrToReturn =[]

            const shrooms = state.pieces.filter((piece)=> {
                return piece.color === this.color && piece.icon === this.color+'Shroom.png'
            })

            if(shrooms.length < 2){
                return [];
            }

            const blockedUp = state.pieces.find((piece) => {
                return piece.y === this.y + 1 && this.x === piece.x;
            })

            const blockedDown = state.pieces.find((piece) => {
                return piece.y === this.y - 1 && this.x === piece.x;
            })

            const blockedLeft = state.pieces.find((piece) => {
                return piece.y === this.y && this.x === piece.x + 1;
            })

            const blockedRight = state.pieces.find((piece) => {
                return piece.y === this.y && this.x === piece.x - 1;
            })

            if(!blockedUp){
                arrToReturn.push(
                    { type: 'blockable', repeat: true, x: 1, y: 1, offsetY:1, limit:2, offsetCountsAsBlock:true },
                    { type: 'blockable', repeat: true, x: -1, y: 1, offsetY:1, limit:2, offsetCountsAsBlock:true },
                )
            }

            if(!blockedDown){
                arrToReturn.push(
                    { type: 'blockable', repeat: true, x: 1, y: -1, offsetY:-1, limit:2, offsetCountsAsBlock:true },
                    { type: 'blockable', repeat: true, x: -1, y: -1, offsetY:-1, limit:2, offsetCountsAsBlock:true },
                )
            }

            if(!blockedRight){
                arrToReturn.push(
                    { type: 'blockable', repeat: true, x: 1, y: 1, offsetX:1, limit:2, offsetCountsAsBlock:true },
                    { type: 'blockable', repeat: true, x: 1, y: -1, offsetX:1, limit:2, offsetCountsAsBlock:true },

                )
            }

            if(!blockedLeft){
                arrToReturn.push(
                    { type: 'blockable', repeat: true, x: -1, y: -1, offsetX:-1, limit:2, offsetCountsAsBlock:true },
                    { type: 'blockable', repeat: true, x: -1, y: 1, offsetX:-1, limit:2, offsetCountsAsBlock:true },
                )
            }

            return arrToReturn

        },
        icon: color+'LadyBug.png',
        moves:moves,
        color:color,
        weakMoves:weakMoves,
        x:x,
        y:y,
        value:7.5,
        posValue:posValue[3],
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
        value:5,
        posValue:posValue[3],
    }
}

function shroomFactory(color,x,y){
    return {
        icon: color+'Shroom.png',
        moves:[],
        color:color,
        x:x,
        y:y,
        value:1000,
        posValue:1,
        afterThisPieceTaken:function(state){
            state.pieces.forEach((piece) => {
                if(piece.color == this.color){
                    if(piece.weakMoves){
                        if(piece.moves == piece.weakMoves){
                            state.won = giveOppositeColor(this.color)
                        }
                        else{
                            if(piece.icon.includes('Ant.png')){
                                piece.value = 0.4
                            }
                            else if(piece.icon.includes('Shroom.png')){
                                piece.value = 2000;
                            }
                            else{
                                piece.value = 2.5;
                            }
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
        posValue:posValue[2],
        afterPieceMove:function(state, move, prevMove) {
            let color = this.color;
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


function northernKing(color, x, y, options){
    let moves = [{ type: 'absolute',  y: -1, x: 0 },{ type: 'absolute',  y: -1, x: -1 },{ type: 'absolute',  y: -1, x: 1 }]

    if (color == 'black') {
        moves = [{ type: 'absolute',  y: 1, x: 0 },{ type: 'absolute',  y: 1, x: -1 },{ type: 'absolute',  y: 1, x: 1 }];
    }
    return {
        icon: color + 'NorthernKing.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:800,
        posValue:1,
        options:options,
        afterThisPieceTaken: function (state) {
            
            let find = state.pieces.find((el) => {
                return el.icon === this.color + 'PlagueDoctor.png'
            })
            if(!find){
                state.won = giveOppositeColor(this.color);
            }

        },
        afterPieceMove:function(state, move, prevMove){
            if(this.color === 'black'){
                if(this.y === 7){
                    this.value = 2000;
                    state.won = 'black';
                }
                else{
                    this.value = 800 + 1*this.y;
                }
            }
            else if(this.color === 'white' && this.y === 0){
                if(this.y === 0){
                    this.value = 2000;
                    state.won = 'white';
                }
                else{
                    this.value = 800 + 1*this.y;
                }            
            }

            this.value += 2;
            
            let promoteCondition = this.color === 'black' && this.y === 3 || this.color === 'white' && this.y === 4;
            let fencerPower = this.color === 'black' ? this.y+1 : 8 -this.y;

            if(this.options && this.options.yTrigger){
                promoteCondition = this.y === this.options.yTrigger;
            }


            if(promoteCondition){
                state.pieces.forEach((piece) => {
                    if(piece.color === this.color && (piece.icon === piece.color + 'Pikeman.png' || piece.icon === piece.color + 'Swordsmen.png')){
                        piece.icon =  piece.color+'Knight.png';
                        piece.moves = [
                        { type: 'absolute', y: 2, x: 1 }, { type: 'absolute', y: 2, x: -1 },
                        { type: 'absolute', y: -2, x: 1 }, { type: 'absolute', y: -2, x: -1 },
                        { type: 'absolute', y: 1, x: 2 }, { type: 'absolute', y: 1, x: -2 },
                        { type: 'absolute', y: -1, x: 2 }, { type: 'absolute', y: -1, x: -2 }]
                        piece.value = fencerPower;
                        piece.posValue = posValue[3];
                    }
                })
            }


            state.pieces.forEach((piece) => {
                if(piece.color === this.color && piece.icon === piece.color + 'Fencer.png'){
                    piece.moves =  [];
                    for(let i = fencerPower; i>0; i--){
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
    let moves = [
        { type: 'absolute', impotent: true, y: -1, x: 0, impotent:true }, { type: 'absolute', impotent: true, y: 0, x: -1, impotent:true }, { type: 'absolute', impotent: true, y: 0, x: 1, impotent:true }, 
        {type:'takeMove', y:-2, x:0}, {type:'takeMove', y:-2, x:1}, {type:'takeMove', y:-2, x:-1}
                ]

    if (color == 'black') {
        moves = [{ type: 'absolute', impotent: true, y: 1, x: 0, impotent:true },{ type: 'absolute', impotent: true, y: 0, x: -1, impotent:true }, { type: 'absolute', impotent: true, y: 0, x: 1, impotent:true }, 
         {type:'takeMove', y:2, x:0}, {type:'takeMove', y:2, x:1}, {type:'takeMove', y:2, x:-1}]}
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

function kolbaFactory(color, x, y){
    let moves = []

    return {
        icon: color + 'Kolba.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:999,
        posValue:0.1,
        afterPlayerMove:function(state){
            let findRook = state.pieces.find((piece) => {
                return piece.icon === 'blackRook.png'
            })

            if(findRook){
                this.value = 999 + (Math.abs(findRook.x - this.x) + Math.abs(findRook.y - this.y));

            }
            else{
                this.value = 9999;
            }
        },
        afterThisPieceTaken:function(state){
            state.won = giveOppositeColor(this.color);
        }
    }
}


function gargoyleFactory(color, x, y){
    let moves = []

    return {
        icon: color + 'Gargoyle.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:2.5,
        posValue:0.1,
        // afterEnemyPieceTaken:function(enemyPiece,state){
        //     this.moves = enemyPiece.moves;
        //     let iconCode = enemyPiece.icon.replace('black', '');
        //     iconCode = iconCode.replace('white', "");

        //     this.icon = this.color + iconCode;
        //     this.value = enemyPiece.value;
        //     this.posValue = enemyPiece.posValue;
        // }
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
        value:2.5,
        posValue:0.1,
    }
}

function plagueDoctor(color, x, y){
    let moves = [{ type: 'absolute',  y: -1, x: 0 },{ type: 'absolute',  y: -1, x: -1 },{ type: 'absolute',  y: -1, x: 1 }]

    if (color == 'black') {
        moves = [{ type: 'absolute',  y: 1, x: 0 },{ type: 'absolute',  y: 1, x: -1 },{ type: 'absolute',  y: 1, x: 1 }]
    }
    return {
        icon: color + 'PlagueDoctor.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:800,
        posValue:1,
        afterThisPieceTaken: function (state) {
            let find = state.pieces.find((el) => {
                return el.icon === this.color + 'NorthernKing.png'
            })
            if(!find){
                state.won = giveOppositeColor(this.color);
            }
        },
        afterPieceMove:function(state, move, prevMove){

            if(this.color === 'black'){
                if(this.y === 7){
                    this.value = 1000;
                    state.won = 'black';
                }
                else{
                    this.value = 800 + 1*this.y;
                }
            }
            else if(this.color === 'white' && this.y === 0){
                if(this.y === 0){
                    this.value = 1000;
                    state.won = 'white';
                }
                else{
                    this.value = 800 + 1*this.y;
                }            
            }
            this.value += 2;
            let promoteCondition = this.color === 'black' && this.y === 3 || this.color === 'white' && this.y === 4;
            let kolbaPower = this.color === 'black' ? this.y+1 : 8-this.y;
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
                        piece.posValue = posValue[3];
                    }
                })
            }
            state.pieces.forEach((piece) => {
                if(piece.color === this.color && piece.icon === piece.color + 'Gargoyle.png'){
                    for(let i = kolbaPower; i>0; i--){
                        piece.moves.push(
                            {type: 'absolute', y: i, x: 0 },
                            {type: 'absolute', y:-i, x:0},
                            {type: 'absolute', y:0, x:i},
                            {type: 'absolute', y:0, x:-i},
                              )
                    }
                    piece.value = kolbaPower 
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


function cyborgFactory(color,x,y){
    let moves = [{ type: 'absolute', y: -2, x: 0 },

    ]

    if (color == 'black') {
        moves = [{ type: 'absolute',  y: 2, x: 0 }, 
    ];
    }
    return {
        icon: color + 'Cyborg.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:1.2,
        posValue:0.1,
        conditionalMoves:function(state){
           let toReturn = [];

            cyborgTeleport(state,this,toReturn)

            return toReturn;
        },
        afterPieceMove: function(state){
            if(this.color == 'black' && (this.y === 5 || this.y ===3 || this.y === 1)){
                this.value = 2 + this.y*0.25;
            }
            else if(this.color == 'white' && (this.y === 2 || this.y ===4 || this.y === 6)){
                this.value = 2 + (7-this.y)*0.25;
            }
            return true;
        },
        afterPlayerMove: function (state){

            if (this.color == 'black' && this.y == 7) {
                state.pieces.push(juggernautFactory(this.color,this.x,this.y));
                state.pieces.splice(state.pieces.indexOf(this),1);
            }
            else if (this.color == 'white' && this.y == 0) {
                state.pieces.push(juggernautFactory(this.color,this.x,this.y));
                state.pieces.splice(state.pieces.indexOf(this),1);
            }
            

        },
        friendlyPieceInteraction: function(state,friendlyPiece,prevMove) {
            if(friendlyPiece)
            {
                if(friendlyPiece == state.pieceSelected || friendlyPiece.icon === state.pieceSelected.icon){
                    return true;
                }
                friendlyPiece.x = prevMove.x;
                friendlyPiece.y = prevMove.y;
            }
        }
    }
}

function bootVesselFactory(color,x,y){
    let moves = [
    { type: 'blockable', repeat: true, x: 1, y: 1, missedSquareX:1, missedSquareY:1, offsetX:1, offsetY:1 }, 
    { type: 'blockable', repeat: true, x: -1, y: -1, missedSquareX:-1, missedSquareY:-1, offsetX:-1, offsetY:-1 },
    { type: 'blockable', repeat: true, x: 1, y: -1, missedSquareX:1, missedSquareY:-1, offsetX:1, offsetY:-1 },
    { type: 'blockable', repeat: true, x: -1, y: 1, missedSquareX:-1, missedSquareY:1, offsetX:-1, offsetY:1 },
    ]

    return{
        icon: color + 'Bootvessel.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:2,
        posValue:0.4,
        conditionalMoves: function(state){
            let toReturn = [];
            cyborgTeleport(state,this,toReturn)
            return toReturn;
        },
        friendlyPieceInteraction: function(state,friendlyPiece,prevMove) {
            if(friendlyPiece)
            {
                if(friendlyPiece == state.pieceSelected || friendlyPiece.icon === state.pieceSelected.icon){
                    return true;
                }
                friendlyPiece.x = prevMove.x;
                friendlyPiece.y = prevMove.y;
            }
        }
    }
}

function empoweredCrystalFactory(color,x,y){
    let moves = [
        { type: 'blockable', repeat: true, x: 0, y: -1, missedSquareY:-1, offsetY:-1 }, { type: 'blockable', repeat: true, x: 0, y: 1, missedSquareY:1, offsetY:1 },
        { type: 'blockable', repeat: true, x: -1, y: 0, missedSquareX:-1 , offsetX:-1 }, { type: 'blockable', repeat: true, x: 1, y: 0, missedSquareX:1, offsetX:1 },
        
        { type: 'blockable', repeat: true, x: -1, y: -1, missedSquareX:-1 ,missedSquareY:-1 , offsetX:-1, offsetY:-1 }, { type: 'blockable', repeat: true, x: 1, y: 1 , missedSquareX:1 , missedSquareY:1 ,offsetX:1, offsetY:1},
        { type: 'blockable', repeat: true, x: -1, y: 1, missedSquareX:-1 ,missedSquareY:1 , offsetX:-1, offsetY:1  }, { type: 'blockable', repeat: true, x: 1, y: -1, missedSquareX:1 ,missedSquareY:-1 , offsetX:1, offsetY:-1  },
        

    ]

    return{
        icon: color + 'CrystalEmpowered.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:993,
        posValue:posValue[2],
        friendlyPieceInteraction: function(state,friendlyPiece,prevMove) {
            if(friendlyPiece)
            {
                if(friendlyPiece == state.pieceSelected || friendlyPiece.icon === state.pieceSelected.icon){
                    return true;
                }
                friendlyPiece.x = prevMove.x;
                friendlyPiece.y = prevMove.y;
            }
        },
        conditionalMoves: function(state){
            let toReturn = [];
            cyborgTeleport(state,this,toReturn)
            return toReturn;
        },
        afterThisPieceTaken:function(state){
            let hadIt=  false;
            state.pieces.forEach((piece) => {
                if(piece.color == this.color && piece.icon.includes('Crystal.png') && piece != this){
                    piece.moves = this.moves;
                    piece.icon = this.icon;
                    piece.value = 993;
                    hadIt = true;
                }
            })


            if(!hadIt){
                if (this.color == 'white') {
                    state.won = 'black';
                }
                else if (this.color == 'black') {
                    state.won = 'white';
                }
            }
        }
    }
}


function executorFactory(color,x,y){
    let moves = [
        { type: 'blockable', repeat: true, x: 0, y: -1, offsetY:-1, missedSquareY:-1 }, { type: 'blockable', repeat: true, x: 0, y: 1,offsetY:1, missedSquareY:1 },
        { type: 'blockable', repeat: true, x: -1, y: 0, offsetX:-1, missedSquareX:-1 }, { type: 'blockable', repeat: true, x: 1, y: 0, missedSquareX:1 , offsetX:1, },
    ]

    return{
        icon: color + 'Executor.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:5,
        posValue:posValue[3],
        conditionalMoves: function(state){
            let toReturn = [];
            cyborgTeleport(state,this,toReturn)
            return toReturn;
        },
        friendlyPieceInteraction: function(state,friendlyPiece,prevMove) {
            if(friendlyPiece)
            {
                if(friendlyPiece == state.pieceSelected || friendlyPiece.icon === state.pieceSelected.icon){
                    return true;
                }
                friendlyPiece.x = prevMove.x;
                friendlyPiece.y = prevMove.y;
            }
        }
    }
}

function crystalFactory(color,x,y){
    return {
        icon: color + 'Crystal.png',
        vulnerable: true,
        moved: false,
        moves: [{ type: 'absolute', x: 0, y: -1 }, { type: 'absolute', x: 0, y: 1 },
        { type: 'absolute', x: -1, y: 0 }, { type: 'absolute', x: 1, y: 0 },
        { type: 'absolute', x: -1, y: -1 }, { type: 'absolute', x: 1, y: 1 },
        { type: 'absolute', x: -1, y: 1 }, { type: 'absolute', x: 1, y: -1 },

    ],
        x: x,
        y: y,
        value:1000,
        posValue:posValue[3],
        color: color,
        conditionalMoves: function(state){
            let toReturn = [];
            cyborgTeleport(state,this,toReturn)
            return toReturn;
        },

        afterThisPieceTaken:function(state){
            let hadIt = false;

            state.pieces.forEach((piece) => {
                if(piece.color == this.color && piece.icon.includes('CrystalEmpowered.png') && piece != this){
                    piece.moves = this.moves;
                    piece.icon = this.icon;
                    piece.value = 1000;
                    piece.posValue = this.posValue;
                    hadIt = true;
                }
            })
            if(!hadIt){
                if (this.color == 'white') {
                    state.won = 'black';
                }
                else if (this.color == 'black') {
                    state.won = 'white';
                }
            }
        },
        friendlyPieceInteraction: function(state,friendlyPiece,prevMove) {
            if(friendlyPiece)
            {
                if(friendlyPiece == state.pieceSelected || friendlyPiece.icon === state.pieceSelected.icon){
                    return true;
                }
                friendlyPiece.x = prevMove.x;
                friendlyPiece.y = prevMove.y;
            }
        }
    }
}


function juggernautFactory(color,x,y){
    

    return {
        icon: color + 'Juggernaut.png',
        moves: [],
        x: x,
        y: y,
        color: color,
        value:10,
        posValue:posValue[3],

        
        friendlyPieceInteraction: function(state,friendlyPiece,prevMove) {
            if(friendlyPiece)
            {
                if(friendlyPiece == state.pieceSelected || friendlyPiece.icon === state.pieceSelected.icon){
                    return true;
                }
                friendlyPiece.x = prevMove.x;
                friendlyPiece.y = prevMove.y;
            }
        }
        ,

        conditionalMoves: function (state) {
            let toReturn = [];
            cyborgTeleport(state,this,toReturn);
            const takenSquare = (x,y) =>{
                return state.pieces.find((piece) => {
                    return piece.y === y  && x === piece.x;
                })

            } 
            toReturn.push({ type: 'absolute', y: -1, x: 0 })
            if(!takenSquare(this.x,this.y-1)){
                toReturn.push(
                    
                    { type: 'absolute', y: -2, x: 0 },
                    { type: 'absolute', y: -1, x: 1 },
                    { type: 'absolute', y: -1, x: -1 }
                )
                if(!takenSquare(this.x,this.y-2)){
                    toReturn.push(
                        { type: 'absolute', y: -3, x: 0 },
                        { type: 'absolute', y: -2, x: 1 },
                        { type: 'absolute', y: -2, x: -1 }
                    )
                }
                if(!takenSquare(this.x-1,this.y-1)){
                    toReturn.push(
                        { type: 'absolute', y: -1, x: -2 },
                        { type: 'absolute', y: -2, x: -1 }
                    )
                }
                if(!takenSquare(this.x+1,this.y-1)){
                    toReturn.push(
                        { type: 'absolute', y: -1, x: 2 },
                        { type: 'absolute', y: -2, x: 1 }
                    )
                }       
            }

            toReturn.push({ type: 'absolute', y: 1, x: 0 })
            if(!takenSquare(this.x,this.y+1)){
                toReturn.push(
                    
                    { type: 'absolute', y: 2, x: 0 },
                    { type: 'absolute', y: 1, x: 1 },
                    { type: 'absolute', y: 1, x: -1 }
                )
                if(!takenSquare(this.x,this.y+2)){
                    toReturn.push(
                        { type: 'absolute', y: 3, x: 0 },
                        { type: 'absolute', y: 2, x: 1 },
                        { type: 'absolute', y: 2, x: -1 }
                    )
                }
                if(!takenSquare(this.x-1,this.y+1)){
                    toReturn.push(
                        { type: 'absolute', y: 1, x: -2 },
                        { type: 'absolute', y: 2, x: -1 },
                    )
                }
                if(!takenSquare(this.x+1,this.y+1)){
                    toReturn.push(
                        { type: 'absolute', y: 1, x: 2 },
                        { type: 'absolute', y: 2, x: 1 },
                    )
                }       
            }


            toReturn.push({ type: 'absolute', x: -1, y: 0 })
            if(!takenSquare(this.x -1,this.y)){
                toReturn.push(
                    
                    { type: 'absolute', x: -2, y: 0 },
                    { type: 'absolute', x: -1, y: 1 },
                    { type: 'absolute', x: -1, y: -1 }
                )
                if(!takenSquare(this.x-2,this.y)){
                    toReturn.push(
                        { type: 'absolute', x: -3, y: 0 },
                        { type: 'absolute', x: -2, y: 1 },
                        { type: 'absolute', x: -2, y: -1 }
                    )
                }
                if(!takenSquare(this.x-1,this.y-1)){
                    toReturn.push(
                        { type: 'absolute', x: -1, y: -2 },
                        { type: 'absolute', x: -2, y: -1 },
                    )
                }
                if(!takenSquare(this.x-1,this.y+1)){
                    toReturn.push(
                        { type: 'absolute', x: -1, y: 2 },
                        { type: 'absolute', x: -2, y: 1 },
                    )
                }       
            }

            toReturn.push({ type: 'absolute', x: 1, y: 0 })
            if(!takenSquare(this.x +1,this.y)){
                toReturn.push(
                    
                    { type: 'absolute', x: 2, y: 0 },
                    { type: 'absolute', x: 1, y: 1 },
                    { type: 'absolute', x: 1, y: -1 }
                )
                if(!takenSquare(this.x+2,this.y)){
                    toReturn.push(
                        { type: 'absolute', x: 3, y: 0 },
                        { type: 'absolute', x: 2, y: 1 },
                        { type: 'absolute', x: 2, y: -1 }
                    )
                }
                if(!takenSquare(this.x+1,this.y-1)){
                    toReturn.push(
                        { type: 'absolute', x: 1, y: -2 },
                        { type: 'absolute', x: 2, y: -1 },
                    )
                }
                if(!takenSquare(this.x+1,this.y+1)){
                    toReturn.push(
                        { type: 'absolute', x: 1, y: 2 },
                        { type: 'absolute', x: 2, y: 1 },
                    )
                }       
            }

            toReturn = toReturn.filter((move, index, self) =>
                index === self.findIndex((t) => (
                    t.type === move.type && t.x === move.x && t.y === move.y
                ))
            )
            return toReturn;
        }
    }
}


function electricCatFactory(color, x, y) {

    let moves = [{ type: 'absolute',  y: -1, x: 0 }]

    if (color == 'black') {
        moves = [{ type: 'absolute', y: 1, x: 0 }];
    }
    return {
        icon: color + 'ElectricCat.png',
        moves: moves,
        x: x,
        y: y,
        color: color,
        value:0.5,
        posValue:1,
        conditionalMoves:function(state){
            let toReturn = [];

            if(pieceAroundMe(state,this,'ScaryCat.png')){
                
                if (this.color == 'black') {
                    toReturn.push({ type: 'blockable',limit:4, repeat:true, y: 1, x: 0 })
                }
                else{
                    toReturn.push({ type: 'blockable',limit:4, repeat:true, y: -1, x: 0 })
                }
            }

            if(pieceAroundMe(state,this,'LongCat.png')){
                if (this.color == 'black') {
                    toReturn.push({ type: 'blockable',limit:3, repeat:true, y: 1, x: -1 })
                    toReturn.push({ type: 'blockable',limit:3, repeat:true, y: 1, x: 1 })
                }
                else{
                    toReturn.push({ type: 'blockable',limit:3, repeat:true, y: -1, x: -1 })
                    toReturn.push({ type: 'blockable',limit:3, repeat:true, y: -1, x: 1 })
                }
            }  
            
            return toReturn
        },

        afterPieceMove:function(state, move, prevMove){
            if(prevMove.y - move.y > 1 || move.y-prevMove.y > 1){
                state.pieces.splice(state.pieces.indexOf(this),1);
            }
            return true;
        }
        ,
        // afterThisPieceTaken:function(state){
        //     if(pieceAroundMe(state,this,'FatCat.png')){
        //         return true;
        //     }                
        // }
    }
}

function scaryCatFactory(color, x, y) {

    return {
        icon: color + 'ScaryCat.png',
        moves: [{ type: 'blockable', repeat: true, x: 0, y: -1, limit:2 }, { type: 'blockable', repeat: true, x: 0, y: 1, limit:2 },
        { type: 'blockable', repeat: true, x: -1, y: 0, limit:2 }, { type: 'blockable', repeat: true, x: 1, y: 0, limit:2 },
        { type: 'blockable', repeat: true, x: -1, y: -1 , limit:2}, { type: 'blockable', repeat: true, x: 1, y: 1, limit:2 },
        { type: 'blockable', repeat: true, x: -1, y: 1 , limit:2}, { type: 'blockable', repeat: true, x: 1, y: -1, limit:2 }],
        x: x,
        y: y,
        color: color,
        value:6,
        posValue:1
    }
}




function fatCatFactory(color, x, y) {

    return {
        icon: color + 'FatCat.png',
        moves: [
            { type: 'blockable', repeat: true, x: -1, y: 0, limit:3 }, { type: 'blockable', repeat: true, x: 1, y: 0, limit:3 },
            { type: 'blockable', repeat: true, x: 0, y: -1 , limit:3}, { type: 'blockable', repeat: true, x: 0, y: 1 , limit:3},
            { type: 'blockable', repeat: true, x: -1, y: 0, limit:3 ,friendlyPieces:true }, { type: 'blockable', repeat: true, x: 1, y: 0, limit:3 ,friendlyPieces:true },
            { type: 'blockable', repeat: true, x: 0, y: -1 , limit:3 ,friendlyPieces:true}, { type: 'blockable', repeat: true, x: 0, y: 1 , limit:3 ,friendlyPieces:true},
        ],
        conditionalMoves:function(state){
            let toReturn = [];

            if(pieceAroundMe(state,this,'ScaryCat.png')){
                toReturn.push(
                    { type: 'blockable', repeat: true, x: -1, y: 0, limit:4 }, { type: 'blockable', repeat: true, x: 1, y: 0, limit:4 },
                    { type: 'blockable', repeat: true, x: 0, y: -1 , limit:4}, { type: 'blockable', repeat: true, x: 0, y: 1 , limit:4},
                    { type: 'blockable', repeat: true, x: -1, y: 0, limit:4 ,friendlyPieces:true }, { type: 'blockable', repeat: true, x: 1, y: 0, limit:4 ,friendlyPieces:true },
                    { type: 'blockable', repeat: true, x: 0, y: -1 , limit:4 ,friendlyPieces:true}, { type: 'blockable', repeat: true, x: 0, y: 1 , limit:4 ,friendlyPieces:true},
                )
            }

            
            if(pieceAroundMe(state,this,'LongCat.png')){
                toReturn.push({ type: 'blockable', repeat: true, x: -1, y: -1 , limit:3}, { type: 'blockable', repeat: true, x: 1, y: 1 , limit:3},
                { type: 'blockable', repeat: true, x: -1, y: 1, limit:3 }, { type: 'blockable', repeat: true, x: 1, y: -1 , limit:3})
            }  
            

            return toReturn
        },
        friendlyPieceInteraction:function(state,friendlyPiece,prevMove){
            if(friendlyPiece && friendlyPiece.icon.includes("ElectricCat.png"))
            { 
                conditionalSpliceWithBonus(state,state.pieces.indexOf(friendlyPiece))
                conditionalSpliceWithBonus(state,findPieceByXY(state.pieces,this.x,this.y+1),this.color)  
                conditionalSpliceWithBonus(state,findPieceByXY(state.pieces,this.x,this.y-1),this.color)  
                conditionalSpliceWithBonus(state,findPieceByXY(state.pieces,this.x+1,this.y),this.color)  
                conditionalSpliceWithBonus(state,findPieceByXY(state.pieces,this.x-1,this.y),this.color)  
                conditionalSpliceWithBonus(state,findPieceByXY(state.pieces,this.x,this.y+1),this.color)  
                conditionalSpliceWithBonus(state,findPieceByXY(state.pieces,this.x+1,this.y+1),this.color)  
                conditionalSpliceWithBonus(state,findPieceByXY(state.pieces,this.x-1,this.y+1),this.color)  
                conditionalSpliceWithBonus(state,findPieceByXY(state.pieces,this.x+1,this.y-1),this.color)  
                conditionalSpliceWithBonus(state,findPieceByXY(state.pieces,this.x-1,this.y-1),this.color)

            }
            else if(friendlyPiece){
                return true;
            }

        },
        
        x: x,
        y: y,
        color: color,
        value:4,
        posValue:1
    }
}


function longCatFactory(color, x, y) {
    return {
        icon: color + 'LongCat.png',
        moves: [{ type: 'blockable', repeat: true, x: -1, y: -1 }, { type: 'blockable', repeat: true, x: 1, y: 1 },
        { type: 'blockable', repeat: true, x: -1, y: 1 }, { type: 'blockable', repeat: true, x: 1, y: -1 }],
        x: x,
        y: y,

        color: color,
        value:6,
        posValue:1
    }
}


function blindCatFactory(color, x, y) {


    return {
        icon: color + 'BlindCat.png',
        moves: [{
            type:'allMine'
        }],
        x: x,
        y: y,
        color: color,
        value:2000,
        posValue:0.0001,
        friendlyPieceInteraction: function(state,friendlyPiece,prevMove) {
            if(friendlyPiece)
            {
                if(friendlyPiece == state.pieceSelected){
                    return true;
                }
                conditionalSplice(state.pieces,state.pieces.indexOf(friendlyPiece))
            }
        },
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




function cuteCatFactory(color, x, y) {

    return {
        icon: color + 'CuteCat.png',
        moves: [
            { type: 'blockable', repeat: true, x: 0, y: -1 }, { type: 'blockable', repeat: true, x: 0, y: 1 },
            { type: 'blockable', repeat: true, x: -1, y: 0 }, { type: 'blockable', repeat: true, x: 1, y: 0 },
            { type: 'blockable', repeat: true, x: -1, y: -1 }, { type: 'blockable', repeat: true, x: 1, y: 1 },
            { type: 'blockable', repeat: true, x: -1, y: 1 }, { type: 'blockable', repeat: true, x: 1, y: -1 }
        ],
        x: x,
        y: y,
        color: color,
        value:6,
        posValue:1,

        afterEnemyPieceTaken:function(enemyPiece,state){
            this.moves = enemyPiece.moves;
            let iconCode = enemyPiece.icon.replace('black', '');
            iconCode = iconCode.replace('white', "");

            this.icon = this.color + iconCode;
            this.value = enemyPiece.value;
            this.posValue = enemyPiece.posValue;
        }
    }
}


function newBrainBugFactory(color,x,y){
    return {
        icon:color+'BrainBug.png',
        x:x,
        y:y,
        color:color,
        value:3,
        posValue:0.1,
        moves:[
            {
                x:1,y:1,type:'takeMove',repeat:true,
            },

        ]
    }
}
try{
    module.exports = {
        queenBugFactory:queenBugFactory,
        kingFactory: kingFactory,
        //brainBugFactory: brainBugFactory,
        shroomFactory:shroomFactory,
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
        gargoyleFactory:gargoyleFactory,
        fencer:fencer,
        general:general,
        shield:shield,
        plagueDoctor:plagueDoctor,
        starMan:starMan,
        sleepingDragon:sleepingDragon,
        cyborgFactory:cyborgFactory,
        crystalFactory:crystalFactory,
        empoweredCrystalFactory:empoweredCrystalFactory,
        executorFactory:executorFactory,
        juggernautFactory:juggernautFactory,
        bootVesselFactory:bootVesselFactory,

        electricCatFactory:electricCatFactory,
        longCatFactory:longCatFactory,
        scaryCatFactory:scaryCatFactory,
        blindCatFactory:blindCatFactory,
        fatCatFactory:fatCatFactory,
        cuteCatFactory:cuteCatFactory,
        strongLadyBugFactory:strongLadyBugFactory,
        newBrainBugFactory:newBrainBugFactory
        
    }
}
catch(err){

}
