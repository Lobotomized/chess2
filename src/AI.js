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




function evaluateBoard(colorPerspective, pieces){
    let counter = 0;
    let valueTransformer = 1;
    let valueCounter = 0;
    
    while(pieces.length > counter){
        const piece = pieces[counter]
        if(colorPerspective === piece.color){
            valueTransformer = 1;
        }
        else{
            valueTransformer = -1;
        }
        valueCounter += valueTransformer;
        counter++;
    }
    return valueCounter;
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

function AIMove(pieceIndex, xClicked, yClicked){
    const hotseatGame = AIProps.hotseatGame;
    const state = hotseatGame.state;
    const myPieces = getColorPieces(AIProps.hotseatGame.state.pieces,AIProps.color);
    selectPiece({x:myPieces[pieceIndex].x, y:myPieces[pieceIndex].y},state)

    const selectedPiece = state.pieceSelected;

    lightBoard(selectedPiece,{pieces:state.pieces, board:state.board})
    hotseatGame.move(state.turn,{ x: xClicked, y: yClicked });
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
    const myPieces = !color ?state.pieces : getColorPieces(state.pieces,color) //getColorPieces(state.pieces,   color);
    while(myPieces.length > piecesCounter){
        let movesCounter = 0;
        let piece = myPieces[piecesCounter]
        lightBoardFE(piece,{pieces:state.pieces, board:state.board},'allowedMove')
        // console.log(piece.moves.length, movesCounter, '  piece')
                //     const result = playerMove({x:piece.x+move.x, y:piece.y+move.y},{board:state.board, pieces:newPieces, pieceSelected:piece},true, undefined, 'allowedMove')

        const allowedMoves = state.board.filter((square) => {
            return square.allowedMove;
        })
        while(allowedMoves.length > movesCounter){
            const newPieces = JSON.parse(JSON.stringify(state.pieces))
            let newMyPieces = getColorPieces(newPieces, color)
            piece = newMyPieces[piecesCounter];


            const square = allowedMoves[movesCounter]
            playerMove({x:square.x, y:square.y},{board:state.board, pieces:newPieces, pieceSelected:piece},true, undefined, 'allowedMove')


            if( square && square.allowedMove){
                movesAndPieces.push({pieceCounter:piecesCounter,pieces:newPieces, xClicked:square.x, yClicked:square.y})
            }
            movesCounter++
        }

        // while(piece.moves.length > movesCounter){
        //     const newPieces = JSON.parse(JSON.stringify(state.pieces))

        //     let newMyPieces = getColorPieces(newPieces, color)
        //     piece = newMyPieces[piecesCounter];
        //     const move = piece.moves[movesCounter]
        //     //Logic for check if move is possible
        //     const result = playerMove({x:piece.x+move.x, y:piece.y+move.y},{board:state.board, pieces:newPieces, pieceSelected:piece},true, undefined, 'allowedMove')

        //     if(result){
        //         // console.log(newPieces, '  novite figuri?')
        //     }
        //     const square = findSquareByXY(state.board,piece.x+move.x,piece.y+move.y)
        //     if( square && square.allowedMove){
        //         movesAndPieces.push({movesCounter:movesCounter, pieceCounter:piecesCounter,pieces:newPieces, xClicked:piece.x+move.x, yClicked:piece.y+move.y})
                
        //     }
        //     movesCounter++
        // }

        piecesCounter++
    }
    return movesAndPieces
}


function minimax(state,maximizer, depth){
    const moves = generateMovesFromPieces(state,maximizer)
                
    let selectedMove = undefined;
    let currValue = -999999;
    let badMoveResults= []
    let randomMoves = moves.slice(0,depth);
    let lowestBadMoveResult = 99999999;

    randomMoves.forEach((move, index) => {
        const badMoves = generateMovesFromPieces({board:state.board,pieces:move.pieces},'black')
        let bestBadMove = {};
        let badMoveValue = -999999;
        badMoves.forEach((badMove) => {

            let thisValue = evaluateBoard("black",badMove.pieces)
            if(thisValue > badMoveValue){
                badMoveValue = thisValue;
                bestBadMove = {moveCounter:index, value:badMoveValue,pieces:badMove.pieces}
            }
        })
        badMoveResults.push(bestBadMove)
    })
    badMoveResults.forEach((badMoveResult) => {
        console.log(moves[badMoveResult.moveCounter], badMoveResult, '  bad moves')

        if(badMoveResult.value < lowestBadMoveResult ){
            lowestBadMoveResult = badMoveResult.value;
            selectedMove = {moveCounter:badMoveResult.moveCounter, value:lowestBadMoveResult};
        }
    })
    // console.log(moves[selectedMove.moveCounter], selectedMove, badMoveResults, lowestBadMoveResult)
    return moves[selectedMove.moveCounter];
    // const move = moves[selectedMove.moveCounter]
    // return move

    // AIMove(move.pieceCounter, move.xClicked, move.yClicked)
}

// function minimax(state,depth,maximizer,counter){
// //Ako Depth 0
//     if(depth === 0){

//         /*
//             Ako Depth e 0 trqbva da se vyrne tekushtiqt hod, i valueto na tekushtiqt hod

//         */
//         let maximizingPieces = getColorPieces(state.pieces,'black').length
//         let minimizingPieces = getColorPieces(state.pieces, 'white').length
//         //Nameri koi si za da iz4islish value
//         return {value:Math.random(), moveCounter:counter} //EvaluateBoard(board)
//     }


// // Ako Depth ne e 0

// /* 
//     Ako Depth ne e 0 


//     Trqbva da se buubble upne valueto na vseki hod ot minimax i samiq hod da se podnovi s noviqt hod
// */


//    let value;
//    if(maximizer == 'black'){
//     value = {value:-999999};
//     let counter = 0;
//     const possibleMoves = generateMovesFromPieces(state,maximizer);
//     while(counter <= possibleMoves.length -1){
//         const moveAndValue = minimax({pieces:possibleMoves[counter].pieces, board:state.board},
//              depth-1,'white',counter);
//         value = max(value,moveAndValue)
//         counter++;
//     }
//     return value;
//    }


   
//    else{
//     value = {value:999999};
//     let counter = 0;
//     const possibleMoves = generateMovesFromPieces(state,maximizer);
//     while(counter <= possibleMoves.length -1){
//         const moveAndValue =  minimax({pieces:possibleMoves[counter].pieces, board:state.board}
//             ,depth-1,'black',counter);
//         value = min(value, moveAndValue)

//         counter++;
//     }
//     // console.log('gets here ever  ' , value)

//     return value;
//    }


//        //Trqbva da vryshta hod, koito da se igrae 

// }

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
