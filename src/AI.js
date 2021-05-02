const moveToValueMap = {
    'absolutePossible':0.5,
    'takeMovePossible':0.6,
    'blockablePossible':0.5,
    'absoluteOutOfBoard':0,
    'takeMoveOutOfBoard':0,
    'blockableOutOfBoard':0,
    'absoluteTaking':0.5,
    'takeMoveTaking':0.6,
    'blockableTaking':0.5,
    'absoluteAlly':0.4,
    'takeMoveAlly':0.4,
    'blockableAlly':0.4,
    'blockableBlocked':0.1
}




function evaluateBoard(colorPerspective, pieces, state){
    let counter = 0;
    let valueTransformer = 1;
    let valueCounter = 0;
    while(pieces.length > counter-1){
        const piece = pieces[counter]
        if(colorPerspective === piece.color){
            valueTransformer = 1;
        }
        else{
            valueTransformer = -1;
        }

        console.log(piece.conditionalMoves(state))
        /*  
           Go through all moves for all pieces and evaluate them using moveToValueMap
        */

        counter++;

    }
}

