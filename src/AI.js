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

const AIProps = {
   state:undefined,
   color:'white'
}




function evaluateBoard(colorPerspective, pieces, state){
    let counter = 0;
    let valueTransformer = 1;
    let valueCounter = 0;
    while(pieces.length-1 > counter){
        const piece = pieces[counter]
        if(colorPerspective === piece.color){
            valueTransformer = 1;
        }
        else{
            valueTransformer = -1;
        }
        // if(piece.conditionalMoves){
        //     console.log(piece.conditionalMoves(state))
        // }
        /*  
           Go through all moves for all pieces and evaluate them using moveToValueMap
        */

        counter++;

    }
}

//How Does a move look? 
/*
    MovedPiece,
    MoveIndex
    But than what if move blockable?
*/


/*
    Function that fake moves and generates new board and pieces after that
    (move) => {
        return {board:board,pieces:pieces}
    }
*/

/*
    Function that actually moves

    //Select A Piece

    //Move It

*/

function AISetup(hotseatGame, AIColor){
    AIProps.hotseatGame = hotseatGame;
    AIProps.color = AIColor;
}

function AIMove(pieceIndex,moveIndex, power){
    const hotseatGame = AIProps.hotseatGame;
    const state = hotseatGame.state;
    const myPieces = AIProps.hotseatGame.state.pieces//getColorPieces(state.pieces,AIProps.color);
    selectPiece({x:myPieces[pieceIndex].x, y:myPieces[pieceIndex].y},state)
    if(!power){
        power = {x:0,y:0}
    }
    const selectedPiece = state.pieceSelected;
    const move = selectedPiece.moves[moveIndex];
        switch(move.type){
            case 'blockable':
                hotseatGame.move(state.turn,{ x: selectedPiece.x+move.x*power.x, y: selectedPiece.y+move.y*power.y });
                break;
            default:
                hotseatGame.move(state.turn,{ x: selectedPiece.x+move.x, y: selectedPiece.y+move.y });
                break;
        }
}

function getColorPieces(pieces,color){
    const myPieces = pieces.filter((piece) => {
        if(color === piece.color){
            return true;
        }
    })

    return myPieces
}


function generateMovesFromPieces(state,color){
    const movesAndPieces = []
    color = color ? color : AIProps.color;
    let piecesCounter = 0;
    const myPieces = state.pieces //getColorPieces(state.pieces,   color);
    while(myPieces.length > piecesCounter){
        let movesCounter = 0;
        let piece = myPieces[piecesCounter]
        while(piece.moves.length > movesCounter){
            const newPieces = JSON.parse(JSON.stringify(myPieces))
            piece = newPieces[piecesCounter];
            lightBoard(piece,{pieces:newPieces, board:state.board},'allowedMove')
            const move = piece.moves[movesCounter]
            //Logic for check if move is possible
            
            const square = findSquareByXY(state.board,piece.x + move.x,piece.y + move.y)
            if( square && square.allowedMove){
                playerMove(move,{board:state.board, pieces:newPieces},true,piece);

                movesAndPieces.push({movesCounter:movesCounter, pieceCounter:piecesCounter,pieces:newPieces})
            }
            movesCounter++
        }

        piecesCounter++
    }
    return movesAndPieces



    
}

function minimax(state,depth,maximizer,counter){
//Ako Depth 0
    if(depth === 0){

        /*
            Ako Depth e 0 trqbva da se vyrne tekushtiqt hod, i valueto na tekushtiqt hod

        */
        let maximizingPieces = getColorPieces(state.pieces,'black').length
        let minimizingPieces = getColorPieces(state.pieces, 'white').length
        //Nameri koi si za da iz4islish value
        return {value:maximizingPieces - minimizingPieces, moveCounter:counter} //EvaluateBoard(board)
    }


// Ako Depth ne e 0

/* 
    Ako Depth ne e 0 


    Trqbva da se buubble upne valueto na vseki hod ot minimax i samiq hod da se podnovi s noviqt hod
*/


   let value;
   if(maximizer == 'black'){
    value = {value:-999999};
    let counter = 0;
    const possibleMoves = generateMovesFromPieces(state,maximizer);
    while(counter <= possibleMoves.length -1){
        const moveAndValue = minimax({pieces:possibleMoves[counter].pieces, board:state.board},
             depth-1,'white',counter);
        value = max(value,moveAndValue)
        counter++;
    }
    return value;
   }


   
   else{
    value = {value:999999};
    let counter = 0;
    const possibleMoves = generateMovesFromPieces(state,maximizer);
    while(counter <= possibleMoves.length -1){
        const moveAndValue =  minimax({pieces:possibleMoves[counter].pieces, board:state.board}
            ,depth-1,'black',counter);
        value = min(value, moveAndValue)

        counter++;
    }
    // console.log('gets here ever  ' , value)

    return value;
   }


       //Trqbva da vryshta hod, koito da se igrae 

}

function max(objOne, objTwo){
    if(objOne.value > objTwo.value){
        return objOne
    }
    else{
        return objTwo
    }
}

function min(objOne, objTwo){
    if(objOne.value < objTwo.value){
        return objOne
    }
    else{
        return objTwo
    }
}
