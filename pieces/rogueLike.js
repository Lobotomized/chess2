
try{
    var {posValue: posValueImport} = require('../helperFunctions.js')
    if(typeof window === 'undefined'){
        global.posValue = posValueImport;
    }
}
catch(err){
}

var posValue = (typeof window !== 'undefined') ? window.posValue : (typeof global !== 'undefined') ? global.posValue : self.posValue;


function rogueLikePawnFactory(color, x, y) {
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
            if(direction){
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

function clownRoguelikeFactory(color,x,y){
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
                // Make an exception for simpleKingFactory
                if(friendlyPiece.icon && friendlyPiece.icon.includes('King')) {
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
        clownRoguelikeFactory,
        rogueLikePawnFactory
    }
}
catch(err){

}
