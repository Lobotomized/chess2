try{
    var {playerMove} = require('../moveMethods.js')
    var {checkEmptyHorizontalBetween, isRoadAttacked, blockableCheck, areYouChecked, findPieceByXY, 
        findCopyPieceByXY, areYouCheckedWithoutTempMoves, isPositionAttacked, lightBoardFE, posValue: posValueImport, JSONfn: JSONfnImport} = require('../helperFunctions.js')
    if(typeof window === 'undefined'){
        global.posValue = posValueImport;
    }
}
catch(err){
}

var posValue = (typeof window !== 'undefined') ? window.posValue : (typeof global !== 'undefined') ? global.posValue : self.posValue;


function antFactory(color,x,y, direction){
    if(!direction){
        direction =  color
    }
    let moves = [{ type: 'blockable', repeat:true,limit:2, y: -1, x: 0 }]

    if (direction == 'black') {
        moves = [{ type: 'blockable', repeat:true, limit:2, y: 1, x: 0 }]
    }
    return {
        icon: color+'Ant.png',
        moves:moves,
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
                state.pieces.push(queenbugFactory(this.color,move.x,move.y));
                return true;
            }
            return true;
        }
    }
}

function goliathbugFactory(color,x,y){
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


function strongladybugFactory(color,x,y){
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

function ladybugFactory(color,x,y){
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
            let shroomsLeft = state.pieces.filter(p => p.color === this.color && p.icon.includes('Shroom.png'));
            if (shroomsLeft.length <= 1) {
                state.won = giveOppositeColor(this.color);
            }
            
            state.pieces.forEach((piece) => {
                if(piece.color == this.color){
                    if(piece.weakMoves){
                        if(!piece.isWeakened){
                            piece.isWeakened = true;
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

function queenbugFactory(color,x,y){
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
            return true;
        }
    }
}

function brainbugFactory(color,x,y){
    return {
        icon:color+'BrainBug.png',
        x:x,
        y:y,
        color:color,
        value:4,
        posValue:0.1,

        moves:[
                { type: 'absolute', x: 0, y: 1 },{ type: 'absolute', x: 1, y: 0 },{ type: 'absolute', x: 1, y: 1 },
                { type: 'absolute', x: -1, y: -1 },{ type: 'absolute', x: 0, y: -1 },{ type: 'absolute', x: -1, y: 0 },
                { type: 'absolute', x: -1, y: 1 },{ type: 'absolute', x: 1, y: -1 }
            ],
        afterEnemyPieceTaken:function(enemyPiece, state, prevMove){
            let color = this.color;
            if(!prevMove) return; // Fallback just in case
            
            const copy = findCopyPieceByXY(state.pieces, prevMove.x, prevMove.y);
            const squareCheck = state.board.find((sq) => {
                return sq.x == prevMove.x && sq.y == prevMove.y;
            })
            if(!copy && squareCheck != undefined){
                state.pieces.push(queenbugFactory(color, prevMove.x, prevMove.y));
            }
        },

    }
}

try{
    module.exports = {
        antFactory,
        goliathbugFactory,
        strongladybugFactory,
        ladybugFactory,
        spiderFactory,
        shroomFactory,
        queenbugFactory,
        brainbugFactory
    }
}
catch(err){

}
