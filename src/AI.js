

const AIProps = {
   state:undefined,
   color:'white',
   positionValue: 0.1//Math.random()
}

let pieceToValue = {
    
}


function evaluateBoard(colorPerspective, pieces, board){
    let counter = 0;
    let valueTransformer = 1;
    let valueCounter = 0;

    while(pieces.length > counter){
        const piece = pieces[counter]
        lightBoardFE(piece,{pieces:pieces, board:board},'allowedMove')
        const filtered = board.filter((square) => {
            return square['allowedMove']
        })
         let magnifier = filtered.length * AIProps.positionValue*piece.posValue;
        if(colorPerspective === piece.color){
            valueTransformer = piece.value ? piece.value + magnifier : 1 + magnifier;
        }
        else{
            valueTransformer = piece.value ? piece.value* -1 - magnifier : -1 - magnifier;
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

function AIMove(pieceIndex, xClicked, yClicked, color){
    const hotseatGame = AIProps.hotseatGame;
    const theColor = color? color : AIProps.color;
    const state = hotseatGame.state;
    const myPieces = getColorPieces(AIProps.hotseatGame.state.pieces,theColor);
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
            const newPieces = []//JSON.parse(JSON.stringify(state.pieces))

            state.pieces.forEach((piece) => {
                newPieces.push({...piece})
            })
            let newMyPieces = getColorPieces(newPieces, color)
            piece = newMyPieces[piecesCounter];


            const square = allowedMoves[movesCounter]
            playerMove({x:square.x, y:square.y},{board:state.board, pieces:newPieces, pieceSelected:piece , turn:color},false, undefined, 'allowedMove')
            // console.log(newPieces, '  new pieces?')
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
