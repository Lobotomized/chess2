//Options to change AI behavior
let globalPosValue = 0.1//Math.random();
let kingTropism = 0.01;

let boardHeight = undefined;
let boardWidth = undefined;


//Code related variables
let valuableEnemy = false;
let valuableAlly = false;


const testFunk = function(){
    console.log('test fuk')
}

function setBoardDimensions(board){
    if(!boardHeight){
        boardHeight = Math.max(...board.map(o => o.y))
    }
    if(!boardWidth){
        boardWidth = Math.max(...board.map(o => o.x))
    }
    

}

function evaluationMagnifierMaxOptions(piece,pieces,state,colorPerspective,options){
    lightBoardFE(piece,{pieces:pieces, board:state.board, turn:piece.color},'allowedMove',undefined,true)
    const filtered = state.board.filter((square) => {
        return square['allowedMove']
    })
    return filtered.length * options.posValue*piece.posValue;
}

function evaluationMagnifierPiece(piece,pieces,state,colorPerspective,options){

    if(options.adaptive){
        return (piece.value * options.pieceValue) / (pieces.length * options.acceleration)
    }

    return piece.value*options.pieceValue;
}



function evaluationMagnifierKingTropism(piece,pieces,state,colorPerspective,options){

    /*
        options - 
        discriminating - дали се интересува от стойността на фигурата или не.  true ако се интересува.
        pieceValue - Колко релативна стойност отделя на стойността на фигурите
        relativeValue - Колко релативна стойност се отделя на близостта до царя
        defendersSearch - Колко защитника има около приятелския цар, а не нападателя около противниковия

    */
   let target = valuableEnemy;
   if(options.defendersSearch){
    target = valuableAlly
   }

    setBoardDimensions(state.board);
    if(!target){
        target= pieces.find((el)=> {
            if(!options.defendersSearch){
                return el.color != colorPerspective && el.value > 500;
            }
            else{
                return el.color === colorPerspective && el.value > 500;
            }
        })
    }
    if(!target){
        return 0;
    }
    let distanceX = Math.abs(piece.x - target.x);
    let distanceY = Math.abs(piece.y - target.y);

    if(distanceX > distanceY){
        if(options.discriminating){
            return (boardWidth*options.relativeValue - distanceX * options.relativeValue)*piece.value * options.pieceValue;
        }
        return boardWidth*options.relativeValue - distanceX * options.relativeValue;
    }
    else{
        if(options.discriminating){
            return (boardHeight*options.relativeValue -distanceY * options.relativeValue)*piece.value * options.pieceValue
        }
        return boardHeight*options.relativeValue -distanceY * options.relativeValue
    }
    
}
