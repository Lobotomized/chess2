import { 
    queenBugFactory,
     kingFactory,
     shroomFactory,
     pawnFactory,
     goliathBugFactory,
     antFactory,
     knightFactory,
     rookFactory,
    queenFactory,
     bishopFactory,
    weakPawn,
     dragonFactory,
    unpromotablePawn,
     mongolianKnightFactory,
    ricarFactory,
     horseFactory,
     ghostFactory,
     hatFactory,
     clownFactory,
    pigFactory,
    ladyBugFactory,
    spiderFactory,
    swordsMen,
    northernKing,
    pikeman,
    kolba,
    fencer,
    general,
    shield,
    plagueDoctor,
    starMan,
    sleepingDragon,
    cyborgFactory,
    crystalFactory,
    empoweredCrystalFactory,
    executorFactory,
    juggernautFactory,
        bootVesselFactory


} from "./pieceDefinitions.js";

export function getMaxX(arr,x) {
    return arr.reduce((max, p) => p[x] > max ? p[x] : max, arr[0][x]);
}

export function reverseNumber(number,size){
    let sizePlusOne = size;
    return (number - sizePlusOne)*-1
}

export function lightPieceMove(piece,color,board){

}

export function findSquareByXY(board,x,y){
    let index =  board.findIndex((square) => {
        return square.x == x && square.y == y;
    })
    return board[index]
}

export function raceChoiceChess(pieces, board,raceWhite,raceBlack){
    pieces.length = 0;
    if(raceBlack == 'classic'){
        pieces.push(
            rookFactory('black', 0,0), knightFactory('black', 1,0) ,
        bishopFactory('black', 2,0), queenFactory('black', 3,0),
        kingFactory('black', 4,0), bishopFactory('black', 5,0),
        knightFactory('black', 6,0), rookFactory('black', 7,0),
        pawnFactory('black', 0,1), pawnFactory('black', 1,1) ,
        pawnFactory('black', 2,1), pawnFactory('black', 3,1),
        pawnFactory('black', 4,1), pawnFactory('black', 5,1),
        pawnFactory('black', 6,1), pawnFactory('black', 7,1)

        
        )
    }
    else if(raceBlack == 'medieval'){
        pieces.push(
                                ghostFactory('black',2,2),ghostFactory('black',3,2),ghostFactory('black',4,2),ghostFactory('black',5,2),
                                pigFactory('black',2,1),  horseFactory('black',3,1),horseFactory('black',4,1),pigFactory('black',5,1),
            clownFactory('black',1,0),ricarFactory('black',2,0),hatFactory('black',3,0),hatFactory('black',4,0),ricarFactory('black',5,0),clownFactory('black',6,0),
            )
    }
    else if(raceBlack == 'bug'){
        pieces.push(
        antFactory('black',0,1),   queenBugFactory('black',1,1), antFactory('black',2,1),        antFactory('black',3,1),         antFactory('black',4,1),    antFactory('black',5,1),       queenBugFactory('black',6,1), antFactory('black',7,1),
        shroomFactory('black',0,0),spiderFactory('black',1,0),   ladyBugFactory('black',2,0),    goliathBugFactory('black',3,0),   goliathBugFactory('black',4,0),ladyBugFactory('black', 5,0), spiderFactory('black',6,0), shroomFactory('black',7,0)
        )
    }
    else if(raceBlack === 'promoters'){
        pieces.push(
            pikeman('black', 0,2), swordsMen('black',1,2),pikeman('black', 2,2), swordsMen('black',3,2),swordsMen('black', 4,2), pikeman('black',5,2),swordsMen('black', 6,2), pikeman('black',7,2),
                shield('black',1,1),                                                                                              shield('black',6,1),
        sleepingDragon('black',0,0),kolba('black',1,0),kolba('black',2,0), plagueDoctor('black',3,0),northernKing('black',4,0), fencer('black',5,0),fencer('black',6,0), sleepingDragon('black',7,0)
        )
    }
    else if(raceBlack == 'cyborgs'){        
        pieces.push(
            cyborgFactory('black',0,2),   cyborgFactory('black',1,2),cyborgFactory('black',2,2),        cyborgFactory('black',3,2),    cyborgFactory('black',4,2),      cyborgFactory('black',5,2), cyborgFactory('black',6,2),    cyborgFactory('black',7,2),
            juggernautFactory('black',0,0),crystalFactory('black',1,0),  executorFactory('black',2,0), bootVesselFactory('black',3,0),   bootVesselFactory('black',4,0),executorFactory('black', 5,0), empoweredCrystalFactory('black',6,0),juggernautFactory('black',7,0),
            )
    }


    if(raceWhite == 'classic'){
        pieces.push( rookFactory('white', 0,7), 
        knightFactory('white', 1,7) ,
        bishopFactory('white', 2,7), 
        queenFactory('white', 3,7),
        kingFactory('white', 4,7), bishopFactory('white', 5,7),
        knightFactory('white', 6,7), rookFactory('white', 7,7),
        pawnFactory('white', 0,6), pawnFactory('white', 1,6) ,
        pawnFactory('white', 2,6), pawnFactory('white', 3,6),
        pawnFactory('white', 4,6), pawnFactory('white', 5,6),
        pawnFactory('white', 6,6), pawnFactory('white', 7,6),
        
        )
    }
    else if(raceWhite == 'promoters'){
        pieces.push(
            pikeman('white', 0,5), swordsMen('white',1,5),pikeman('white', 2,5), swordsMen('white',3,5),swordsMen('white', 4,5), pikeman('white',5,5),swordsMen('white', 6,5), pikeman('white',7,5),
                    shield('white',1,6),                                                                                              shield('white',6,6),
        sleepingDragon('white',0,7),kolba('white',1,7),kolba('white',2,7), plagueDoctor('white',3,7),northernKing('white',4,7), fencer('white',5,7),fencer('white',6,7), sleepingDragon('white',7,7),
        )

    }
    else if(raceWhite == 'medieval'){
        pieces.push(
                                 ghostFactory('white',2,5),ghostFactory('white',3,5),ghostFactory('white',4,5),ghostFactory('white',5,5),
                                pigFactory('white',2,6),  horseFactory('white',3,6),horseFactory('white',4,6),pigFactory('white',5,6),
                 clownFactory('white',1,7),ricarFactory('white',2,7),hatFactory('white',3,7),hatFactory('white',4,7),ricarFactory('white',5,7),clownFactory('white',6,7)
            )
    }
    else if(raceWhite == 'bug'){
        pieces.push(
        antFactory('white',0,6),   queenBugFactory('white',1,6),antFactory('white',2,6),        antFactory('white',3,6),    antFactory('white',4,6),      antFactory('white',5,6), queenBugFactory('white',6,6),    antFactory('white',7,6),
        shroomFactory('white',0,7),spiderFactory('white',1,7),  ladyBugFactory('white',2,7), goliathBugFactory('white',3,7),   goliathBugFactory('white',4,7),ladyBugFactory('white', 5,7), spiderFactory('white',6,7),shroomFactory('white',7,7)
        )
    }

    else if(raceWhite == 'cyborgs'){        
        pieces.push(
            cyborgFactory('white',0,5),   cyborgFactory('white',1,5),cyborgFactory('white',2,5),        cyborgFactory('white',3,5),    cyborgFactory('white',4,5),      cyborgFactory('white',5,5), cyborgFactory('white',6,5),    cyborgFactory('white',7,5),
            juggernautFactory('white',0,7),crystalFactory('white',1,7),  executorFactory('white',2,7), bootVesselFactory('white',3,7),   bootVesselFactory('white',4,7),executorFactory('white', 5,7), empoweredCrystalFactory('white',6,7),juggernautFactory('white',7,7),
            )
    }


}

export function getParams (url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};

export function pieceFromSquare(square, pieces) {
    const piece = pieces.find((p) => {
        return square.x === p.x && square.y === p.y;
    })

    return piece;
}

export function pieceFromXY(x,y, pieces) {
    const piece = pieces.find((p) => {
        return x === p.x && y === p.y;
    })

    return piece;
}

export function closeLights(board, flag) {
    if (!flag) {
        flag = 'light'
    }
    if(board){
        board.forEach((square) => {
            square[flag] = false;
        })
    }

}

export function lightBoardFE(piece, state, flag,blockedFlag) {
    if (!flag) {
        flag = 'light'
    }
    closeLights(state.board, flag);
    if (!piece) {
        return;
    }
    let tempMoves = [];
    
    if (piece.conditionalMoves) {
        tempMoves = piece.conditionalMoves(state);
    }
    [...piece.moves, ...tempMoves].forEach((move) => {
        if (move.type == 'absolute') {
            const square = state.board.find((el) => {
                return el.x === piece.x + move.x && el.y === piece.y + move.y
            })
            if (square) {
                const innerPiece = pieceFromSquare(square, state.pieces)
                if (innerPiece) {
                    if (innerPiece.color != piece.color && !move.impotent) {
                        square[flag] = true;
                    }
                    else{

                        square[blockedFlag] = true;
                    }
                }
                else if (!innerPiece) {
                    square[flag] = true;
                }
            }
        }
        else if (move.type == 'allMine') {
            state.board.forEach((square) => {
                const innerPiece = pieceFromSquare(square, state.pieces);
                if (innerPiece) {
                    if (innerPiece.color == piece.color) {
                        square[flag] = true;
                    }
                }
            })
        }
        else if (move.type == 'takeMove') {
            const square = state.board.find((el) => {
                return el.x === piece.x + move.x && el.y === piece.y + move.y
            })
            if (square) {
                const innerPiece = pieceFromSquare(square, state.pieces)
                if (innerPiece) {
                    if (innerPiece.color != piece.color && !move.impotent) {
                        square[flag] = true;
                    }
                }
            }
        }
        else if (move.type == 'blockable') {
            if (move.repeat) {
                const limit = move.limit || 100;
                const offsetX = move.offsetX || 0;
                const offsetY = move.offsetY || 0;
                blockableSpecialFunction(state, move.x, move.y, piece.x + offsetX, piece.y + offsetY, move, limit, flag,blockedFlag, move.missedSquareX, move.missedSquareY);
            }
        }
    })
}
export function findCopyPieceByXY(pieces,x,y){
    return pieces.find((piece) => {
        return piece .x == x && piece.y == y;
    })
}

export function blockableSpecialFunction(state, powerX, powerY, x, y, move, limit, flag,secondFlag, missedSquareX, missedSquareY) {
    if (!flag) {
        flag = 'light'
    }
    if (limit === 0) {
        return;
    }
    const square = state.board.find((el) => {
        return el.x === x + powerX && el.y === y + powerY;
    })
    if (!square) {
        return;
    }
    const piece = pieceFromSquare(square, state.pieces)

    let directionX = 0;
    if (powerX < 0) {
        directionX = -1;
    }
    else if (powerX > 0) {
        directionX = 1;
    }

    let directionY = 0;

    if (powerY < 0) {
        directionY = -1;
    }
    else if (powerY > 0) {
        directionY = 1;
    }
    else {
        directionY = 0;
    }

    
    if(!missedSquareX){
        missedSquareX = 0;
    }

    if(!missedSquareY){
        missedSquareY = 0;
    }

    if (!piece) {
        square[flag] = true;
        const offsetX = move.offsetX || 0;
        const offsetY = move.offsetY || 0;
        blockableSpecialFunction(state, powerX + directionX, powerY + directionY, x+offsetX, y+offsetY, move, limit - 1, flag,secondFlag, missedSquareX, missedSquareY)
    }
    else if (!move.impotent) {
        // console.log(state, state.pieces)
        let selectedPiece = pieceFromXY(x,y,state.pieces)
        square[flag] = true;

        if(selectedPiece){
            if(selectedPiece.color == piece.color){
                square[secondFlag] = true;
                square[flag] = false;

            }
        }
        
        blockableSpecialFunction(state, powerX + directionX, powerY + directionY, x, y, move, limit - 1, secondFlag,secondFlag, missedSquareX, missedSquareY)
    }

    return;
}

export function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

export function findPieceByXY(pieces,x,y){
    let index =  pieces.findIndex((piece) => {
         return piece .x == x && piece.y == y;
     })
     return index
 }

 export function areYouChecked(state,enemyColor,me){
    for (let i = state.pieces.length - 1; i >= 0; i--) {
        const piece = state.pieces[i]
        let tempMoves = [];
        if (piece.conditionalMoves) {
            tempMoves = piece.conditionalMoves(state);
        }

        for(let ii = [...piece.moves, ...tempMoves].length-1; ii>=0; ii--){
            const move = [...piece.moves, ...tempMoves][ii];
            if (piece.color == enemyColor) {
                if ((move.type == 'absolute' || move.type == 'takeMove') && !move.impotent) {
                    if(piece.x + move.x == me.x && piece.y + move.y == me.y){
                        return true;
                    }
                }
                else if (move.type == 'blockable' && !move.impotent) {
                    if (move.repeat) {
                        const limit = move.limit || 100;
                        const offsetX = move.offsetX || 0;
                        const offsetY = move.offsetY || 0;
                        if(blockableCheck(state, move.x, move.y, piece.x + offsetX, piece.y + offsetY, move, limit, me) == 'block'){
                            console.log(piece)
                            return true;
                        }
                    }
                }
            }
        }
    }

    return false

}

 export function areYouCheckedWithoutTempMoves(state,enemyColor,me, flag){
    let toReturn = false;
    for (let i = state.pieces.length - 1; i >= 0; i--) {
        const piece = state.pieces[i]

        for(let ii = [...piece.moves].length-1; ii>=0; ii--){
            const move = [...piece.moves][ii];
            if (piece.color == enemyColor) {

                if ((move.type == 'absolute' || move.type == 'takeMove') && !move.impotent) {
                    if(piece.x + move.x == me.x && piece.y + move.y == me.y){
                        toReturn =  true;
                    }
                }
                else if (move.type == 'blockable' && !move.impotent) {
                    if (move.repeat) {
                        const limit = move.limit || 100;
                        const offsetX = move.offsetX || 0;
                        const offsetY = move.offsetY || 0;
                        if(blockableCheck(state, move.x, move.y, piece.x + offsetX, piece.y + offsetY, move, limit, me,'rokado') == 'block'){
                            toReturn = true;
                        }
                    }
                }
            }
        }
    }

    return toReturn

}

 export function isRoadAttacked(state,enemyColor,pointOne,pointTwo){
    let direction = false;
    let checker = false;
    let actor = pointOne

    let myColor = 'white';
    if(enemyColor == 'white'){
        myColor = 'black'
    }
    
    if(pointOne.x > pointTwo.x){
        direction = true;
    }
    let distance = 0;

    if(direction){
        distance = pointOne.x - pointTwo.x;
    }
    else{
        distance = pointTwo.x - pointOne.x;
        actor = pointTwo
    }
    for(let c = distance-1; c > 0; c--){
        if(areYouCheckedWithoutTempMoves(state,enemyColor,{x:actor.x-c,y:actor.y,color:myColor}, 'rokado')){
            checker = true;
        }

    }
    return checker;
}
 export function checkEmptyHorizontalBetween(state,pieceOne, pieceTwo){

    let direction = false;
    let checker = true;
    let actor = pieceOne
    
    if(pieceOne.x > pieceTwo.x){
        direction = true;
    }
    let distance = 0;

    if(direction){
        distance = pieceOne.x - pieceTwo.x;
    }
    else{
        distance = pieceTwo.x - pieceOne.x;
        actor = pieceTwo
    }
    distance -=1;
    while(distance > 0){            
        if(state.pieces[findPieceByXY(state.pieces,actor.x-distance, actor.y)]){
            checker = false;
        }
        distance--;
    }
    return checker;
}

export function blockableCheck(state, powerX, powerY, x, y, move, limit,myPiece, flag) {
    let toReturn;
    let missedSquareX = move.missedSquareX;
    let missedSquareY = move.missedSquareY;
    if (limit === 0) {
        return;
    }
    const square = state.board.find((el) => {
        return el.x === x + powerX && el.y === y + powerY;
    }) // Find a square for x/y
    if (!square) {
        return;
    }// If such a square does not exist return undefined
    let directionX = 0;
    if (powerX < 0) {
        directionX = -1;
    }
    else if (powerX > 0) {
        directionX = 1;
    }

    let directionY = 0;
    
    if (powerY < 0) {
        directionY = -1;
    }
    else if (powerY > 0) {
        directionY = 1;
    }
    else { 
        directionY = 0;
    }

    if(!move.missedSquareX){
        missedSquareX = 0;
    }
    if(!move.missedSquareY){
        missedSquareY = 0;
    }
    const secondPiece = state.pieces[findPieceByXY(state.pieces,x+powerX, y + powerY)] // The piece on the attacked square
    //Find the direction in which we are going
    if (!secondPiece && !(x+powerX == myPiece.x && y+powerY == myPiece.y)) {
        //If there is  no such piece continue
        return blockableCheck(state, powerX+directionX + missedSquareX, powerY+directionY + missedSquareY, x, y, move, limit - 1, myPiece,flag)
    }
    else{
        if(secondPiece){
            if(secondPiece.x == myPiece.x && secondPiece.y == myPiece.y){
                console.log(secondPiece)
                toReturn = 'block';
                return 'block'
            }
        }
        else{
            if(x+powerX == myPiece.x && y+powerY == myPiece.y){
                toReturn = 'block'
                return 'block'
            }
        }

    }
    return toReturn
}


export function getSinglePlayerGame() {
    const g = new newGame({
        baseState: {
            //Starting State
            gameType:'classic',
            board: [],
            pieceSelected: undefined,
            turn: 'white',
            white: undefined,
            black: undefined,
            whiteRace:undefined,
            blackRace: undefined,
            whiteClock: 6000,
            blackClock: 6000,
            pieces: [],
            won: undefined,
            message:'',
            started:false
        },
        moveFunction: function (player, move, state) {
            if(state.turn == 'menu'){

                    if(player.ref == state.white){
                        if(move.x == 1  && move.y == 1){
                            state.whiteRace = 'classic'
                        }
                        else if(move.x === 1 && move.y ==2){
                            state.whiteRace = 'medieval'
                        }
                        else if(move.x === 1 && move.y ==3){
                            state.whiteRace = 'bug'
                        }
                    }
                    else if(player.ref == state.black){
                        if(move.x  == 1 && move.y == 1){
                            state.blackRace = 'classic'
                        }
                        else if(move.x == 1 && move.y == 2){
                            state.blackRace = 'medieval'
                        }
                        else if(move.x === 1 && move.y ==3){
                            state.blackRace = 'bug'
                        }
                    }

                if(state.whiteRace && state.blackRace){
                    state.turn = 'white'
                    raceChoiceChess(state.pieces,state.board,state.whiteRace,state.blackRace)
                }
            }   
            else{
                const cont = checkTurn(state, player.ref);
                if (!cont) {
                    return
                }
                if(state.on){
                    return;
                }
                if (state.pieceSelected) {
                    if (playerMove(move, state)) {
                        changeTurn(state)
                        for (let i = state.pieces.length - 1; i >= 0; i--) {
                            if(state.pieces[i].color ==  state.turn){
                                if (state.pieces[i].afterEnemyPlayerMove) {
                                    state.pieces[i].afterEnemyPlayerMove(state, playerMove)
                                }
                            }
                        }
                    }
                    else {
                        closeLights(state.board);
                        state.pieceSelected = undefined;
                    }
                }
                else {
                    selectPiece(move, state)
                    if (state.pieceSelected) {
                        lightBoard(state.pieceSelected, state)
                    }
                }
            }
        },
        maxPlayers: 2, // Number of Players you want in a single game

        statePresenter: function (copyState, playerRef) {
            let search = {x:undefined,y:undefined}
            copyState.playerRef = playerRef;
            if(!copyState.blackRace || !copyState.whiteRace){
                if(copyState.black == playerRef){
                    if(copyState.blackRace == 'medieval'){
                        search.x = 1;
                        search.y = 2;
                    }
                    else if(copyState.blackRace == 'classic'){
                        search.x = 1;
                        search.y = 1;
                    }
                    else if(copyState.blackRace == 'bug'){
                        search.x = 1;
                        search.y = 3;
                    }
                }
                else{
                    if(copyState.whiteRace == 'medieval'){
                        search.x = 1;
                        search.y = 2;
                    }
                    else if(copyState.whiteRace == 'classic'){
                        search.x = 1;
                        search.y = 1;
                    }
                    else if(copyState.whiteRace == 'bug'){
                        search.x = 1;
                        search.y = 3;
                    }
                }
            }
            copyState.board.forEach((sq) => {
                if(sq.x == search.x && sq.y == search.y){
                    sq.light = true;
                }
            })
            if (checkTurn(copyState, playerRef)) {
                copyState.yourTurn = true;

                return copyState
            }

            copyState.yourTurn = false;
            return copyState;

        },
        timeFunction: function (state) {
            
            if(state.gameType == 'raceChoiceChess'){
                if(state.blackRace && state.whiteRace){
                    if (state.turn == 'white') {
                        state.whiteClock -= 1;
                        if (state.whiteClock < 0) {
                            state.won = 'black'
                        }
                        return
                    }
            
                    state.blackClock -= 1;
                    if (state.blackClock < 0) {
                        state.won = 'white'
                    }
                    return
                }
            }
            else{
                if (state.turn == 'white') {
                    state.whiteClock -= 1;
                    if (state.whiteClock < 0) {
                        state.won = 'black'
                    }
                    return
                }
        
                state.blackClock -= 1;
                if (state.blackClock < 0) {
                    state.won = 'white'
                }
                return
            }
        },
        exitFunction: function(state,playerRef){
            io.emit(lobby.games)

            if(state.white == playerRef){
                state.won = 'black'
            }
            else{
                state.won = 'white'
            }
        },
        connectFunction: function (state, playerRef) {
            const roomData = {mode:'raceChoiceChess'}
            if (!state.white) {
                state.white = playerRef;
            }
            else if (!state.black) {
                state.black = playerRef;
                if(roomData.mode == 'minichess'){
                    state.gameType = 'minichess'
                    miniChess(state.pieces, state.board);
                }
                else if(roomData.mode == 'randomchess'){
                    state.gameType = 'randomchess'
                    randomChess(state.pieces,state.board)
                }
                else if(roomData.mode == 'catchthedragon'){
                    state.gameType = 'catchthedragon'
                    catchTheDragon(state.pieces,state.board)
                }
                else if(roomData.mode == 'mongolianChess'){
                    state.gameType = 'mongolianChess'
                    mongolianChess(state.pieces,state.board)
                }
                else if(roomData.mode == 'classicChess'){
                    state.gameType = 'classiChess'
                    classicChess(state.pieces,state.board)
                }
                else if(roomData.mode == 'raceChess'){
                    state.gameType = 'raceChess'
                    raceChess(state.pieces,state.board)
                }
                else if(roomData.mode == 'raceChoiceChess'){
                    state.pieces.length = 0;
                    state.board.length = 0;
                    for (let x = 0; x <= 7; x++) {
                        for (let y = 0; y <= 7; y++) {
                                state.board.push({ light: false, x: x, y: y })
                        }
                    }

                    state.pieces.push(kingFactory('white',1,1), hatFactory('white',1,2), shroomFactory('white', 1, 3))
                    state.gameType = 'raceChoiceChess'
                    state.turn = 'menu'
                }
            }
        },
        rooms:true,
        delay: 100
    })
    return g;
}