try{
    var {posValue: posValueImport, pieceAroundMe, conditionalSplice, conditionalSpliceWithBonus, findPieceByXY} = require('../helperFunctions.js')
    if(typeof window === 'undefined'){
        global.posValue = posValueImport;
    }
}
catch(err){
}

var posValue = (typeof window !== 'undefined') ? window.posValue : (typeof global !== 'undefined') ? global.posValue : self.posValue;

function electriccatFactory(color, x, y) {

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

function scarycatFactory(color, x, y) {

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




function fatcatFactory(color, x, y) {

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


function longcatFactory(color, x, y) {
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


function blindcatFactory(color, x, y) {


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




function cutecatFactory(color, x, y) {

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

try{
    module.exports = {
        electriccatFactory,
        longcatFactory,
        blindcatFactory,
        cutecatFactory,
        fatcatFactory,
        scarycatFactory
    }
}
catch(err){

}
