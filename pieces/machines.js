try{
    var {posValue: posValueImport, cyborgTeleport} = require('../helperFunctions.js')
    if(typeof window === 'undefined'){
        global.posValue = posValueImport;
    }
}
catch(err){
}

var posValue = (typeof window !== 'undefined') ? window.posValue : (typeof global !== 'undefined') ? global.posValue : self.posValue;

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
                    let findSquare = state.board.find((item) =>{
                        return item.x === x && item.y === y;
                    })

                    if(!findSquare){
                        return true
                    }
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


function bootvesselFactory(color,x,y){
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
        value:2.5,
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

try{
    module.exports = {
        cyborgFactory,
        juggernautFactory,
        bootvesselFactory,
        executorFactory,
        crystalFactory,
        empoweredCrystalFactory
    }
}
catch(err){

}
