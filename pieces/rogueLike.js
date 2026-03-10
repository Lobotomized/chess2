
try{
    var {posValue: posValueImport} = require('../helperFunctions.js')
    if(typeof window === 'undefined'){
        global.posValue = posValueImport;
    }
}
catch(err){
}

var posValue = (typeof window !== 'undefined') ? window.posValue : (typeof global !== 'undefined') ? global.posValue : self.posValue;

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
                console.log(friendlyPiece.icon)
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
        clownRoguelikeFactory
    }
}
catch(err){

}
