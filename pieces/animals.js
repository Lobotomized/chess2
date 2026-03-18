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

function dragonFactory(color,x,y){
    return {
                color: color,
                x:x,
                y:y,
                icon:color+'Dragon.png',
                moves: [
                    { type: 'blockable', repeat: true, x: 0, y: -1 }, { type: 'blockable', repeat: true, x: 0, y: 1 },
                    { type: 'blockable', repeat: true, x: -1, y: 0 }, { type: 'blockable', repeat: true, x: 1, y: 0 },
                    { type: 'absolute', y: 2, x: 1 }, { type: 'absolute', y: 2, x: -1 },
                    { type: 'absolute', y: -2, x: 1 }, { type: 'absolute', y: -2, x: -1 },
                    { type: 'absolute', y: 1, x: 2 }, { type: 'absolute', y: 1, x: -2 },
                    { type: 'absolute', y: -1, x: 2 }, { type: 'absolute', y: -1, x: -2 }
                ],
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

try{
    module.exports = {
        pigFactory,
        horseFactory,
        dragonFactory,
        sleepingDragon,
        ghostFactory,
        ricarFactory
    }
}
catch(err){

}
