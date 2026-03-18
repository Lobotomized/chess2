try{
    
    var {posValue: posValueImport, findCopyPieceByXY} = require('../helperFunctions.js')
    if(typeof window === 'undefined'){
        global.posValue = posValueImport;
    }
}
catch(err){
}

var posValue = (typeof window !== 'undefined') ? window.posValue : (typeof global !== 'undefined') ? global.posValue : self.posValue;

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

try{
    module.exports = {
        mongolianKnightFactory,
        weakPawn,
        unpromotablePawn,
        hatFactory,
        clownFactory,
        starMan
    }
}
catch(err){

}
