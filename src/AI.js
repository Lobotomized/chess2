const moveToValueMap = {
    'absolute':0.3,
    'takeMove':0.1,
    'blockable':0.2
}




function evaluateBoard(colorPerspective, pieces){
    let counter = 0;
    let valueTransformer = 1;
    let valueCounter = 0;
    while(pieces.length > counter-1){

        if(colorPerspective === pieces[counter].color){
            valueTransformer = 1;
        }
        else{
            valueTransformer = -1;
        }

        // valueCounter += getValueForPiece(piece)*valueTransformer

        /*  
            getValueForPiece  => A function similair to lightBoard that gives value for every move in the piece and additional value for possible moves
        */

        counter++;

    }
}

function getAbsolutePieceValue(piece){
    let counter = 0;
    let valueCounter = 0;
    while(counter < piece.moves.length-1){
        const move = piece.moves[counter];
        let turnValueCounter = 0;
        if(move.type === 'blockable'){
            turnValueCounter += moveToValueMap['absolute']
            const mnojitel = move.limit === undefined ? 7 : move.limit;
            turnValueCounter += moveToValueMap['blockable'] * mnojitel;
        }
        else{
            turnValueCounter = moveToValueMap[move.type]
        }
        if(move.impotent){
            turnValueCounter = turnValueCounter / 5
        }
        valueCounter += turnValueCounter;
        counter++
    }
    return valueCounter;
}

function createPieceToValueMap(pieces){
    let counter = 0;
    const pieceToValueMap = {};
    console.log(pieces.length-1)
    while(counter < pieces.length-1){
        const piece = pieces[counter];
        if(!pieceToValueMap[piece.icon]){
            pieceToValueMap[piece.icon] = getAbsolutePieceValue(piece);
        }
        counter++;
    }
    return pieceToValueMap
}
