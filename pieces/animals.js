try{
    var {posValue: posValueImport} = require('../helperFunctions.js')
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
        ghostFactory
    }
}
catch(err){

}
