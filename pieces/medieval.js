try{
    var {posValue: posValueImport, giveOppositeColor} = require('../helperFunctions.js')
    if(typeof window === 'undefined'){
        global.posValue = posValueImport;
    }
}
catch(err){
}

var posValue = (typeof window !== 'undefined') ? window.posValue : (typeof global !== 'undefined') ? global.posValue : self.posValue;

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
            else if(this.color === 'white'){
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
            let fencerPower = this.color === 'black' ? this.y : 7 -this.y;

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
            let kolbaPower = this.color === 'black' ? this.y : 7-this.y;
            if(promoteCondition){
                state.pieces.forEach((piece) => {
                    if(piece.color === this.color && piece.icon === piece.color + 'SleepingDragon.png'){
                        piece.icon =  piece.color+'Dragon.png';
                        piece.moves =  [
                        { type: 'blockable', repeat: true, x: 0, y: -1 }, { type: 'blockable', repeat: true, x: 0, y: 1 },
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

try{
    module.exports = {
        swordsMen,
        northernKing,
        pikeman,
        kolbaFactory,
        gargoyleFactory,
        fencer,
        general,
        shield,
        plagueDoctor
    }
}
catch(err){

}
