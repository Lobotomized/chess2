let memoizedSquares = {};
let memoizedPieces = {};


function findSquareByXY(board,x,y){
    // Optimized search for typical 8x8 or similar board
    // Assuming board is somewhat ordered or small enough, but simple loop is O(N)
    // Board is usually 64 elements, so native .find is fast, but we can try to be faster if we know the structure.
    // However, the current bottleneck is likely the repeated calls to .find() in loops.
    // If the board array is fixed, we can just index it if it was a 2D array or 1D mapped array.
    // But since it's an array of objects with x,y properties, we have to search.
    
    // Fast path for standard loop
    for (let i = 0; i < board.length; i++) {
        if (board[i].x === x && board[i].y === y) return board[i];
    }
    return undefined;
 }


function findCopyPieceByXY(pieces,x,y){
    return pieces.find((piece) => {
        return piece.x == x && piece.y == y;
    })
}


function findPieceByXY(pieces,x,y){
    let index =  pieces.findIndex((piece) => {
         return piece .x == x && piece.y == y;
     })
     return index
 }




 function checkEmptyHorizontalBetween(state,pieceOne, pieceTwo){

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


function giveOppositeColor (color){
    if(color == 'white'){
        return 'black'
    }
    else if(color == 'black'){
        return 'white'
    }
}

function areYouChecked (state,enemyColor,me){
    for (let i = state.pieces.length - 1; i >= 0; i--) {
        const piece = state.pieces[i]
        let tempMoves = [];
        if (piece.conditionalMoves) {
            if(typeof piece.conditionalMoves === 'string'){
                let midObj = {conditionalMoves:piece.conditionalMoves}
               piece.conditionalMoves = JSONfnHelper.parse(JSONfnHelper.stringify(midObj)).conditionalMoves;
            }
    
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
                            return true;
                        }
                    }
                }
            }
        }
    }

    return false

}

function areYouCheckedWithoutTempMoves(state,enemyColor,me, flag){
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

function isPositionAttacked(state,myColor,x,y){
    let enemyColor = 'white';
    if(myColor == 'white'){
        enemyColor = 'black'
    }
    if(areYouCheckedWithoutTempMoves(state,enemyColor,{x:x,y:y,color:myColor}, 'rokado')){
        return true;
    }
    return false;
}

function isPositionAttackedWithTempMoves(state,myColor,x,y){
    let enemyColor = 'white';
    if(myColor == 'white'){
        enemyColor = 'black'
    }
    if(areYouChecked(state,enemyColor,{x:x,y:y,color:myColor}, 'rokado')){
        return true;
    }
    return false;
}

function isRoadAttacked(state,enemyColor,pointOne,pointTwo){
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

function pieceFromSquare(square, pieces) {
    const piece = pieces.find((p) => {
        return square.x === p.x && square.y === p.y;
    })  

    return piece;
}

function blockableCheck(state, powerX, powerY, x, y, move, limit,myPiece, flag,counter) {
    let toReturn;
    let missedSquareX = move.missedSquareX;
    let missedSquareY = move.missedSquareY
    if (limit === 0) {
        return;
    }
    const square = findSquareByXY(state.board,powerX+x,powerY+y)

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
        return blockableCheck(state, powerX+directionX+missedSquareX, powerY+directionY+missedSquareY, x, y, move, limit - 1, myPiece,flag,counter+1)
    }
    else{
        if(secondPiece){
            if(secondPiece.x == myPiece.x && secondPiece.y == myPiece.y){
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


function getParams (url) {
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


function checkRemi(state){
    let yourPieces = state.pieces.filter((piece) => {
        return piece.color === state.turn;
    })
    let i = yourPieces.length -1;
    let isItRemi = true;
    while(i >= 0){
        lightBoardFE(yourPieces[i],state,'counted');

        let availableSquares = state.board.filter((sq) => {
            return sq.counted;
        });

        if(availableSquares.length){
            isItRemi = false;
            i = -1;
        }
        i--;
    }
    if(!yourPieces.length){
        isItRemi = false;
    }

    return isItRemi;
}

function getSinglePlayerGame() {
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
            started:false,
            recordMoves: true,
            gameRecordId: Date.now() + '_' + Math.random(),
            gameMetadata: {
                mode: window.location.href.includes('rpg') ? 'rpg' : (getParams(window.location.href).gameType ? 'campaign' : 'hotseat'),
                vsBot: window.location.href.includes('rpg') ? true : (getParams(window.location.href).AIColor !== undefined && getParams(window.location.href).AIColor !== 'none')
            }
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
                    raceChoiceChess(state,state.whiteRace,state.blackRace)
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
                console.log('2')
                if (state.pieceSelected) {
                    if (playerMove(move, state)) {
                        if(state.specialOnMoveEffects && state.specialOnMoveEffects.length){
                            state.specialOnMoveEffects.forEach((effect) => {
                                effect(state);
                            })
                        }
                        console.log('wtf? ', state.won, checkRemi(state)    , ' here?')
                        changeTurn(state)
                        if(!state.won && checkRemi(state)){
                            state.won = 'tie'
                            if(state.specialOnDrawEffects){
                                state.specialOnDrawEffects.forEach((effect) => {
                                    effect(state);
                                })
                            }
                            return;
                        }

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
                        lightBoardFE(state.pieceSelected, state)
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
                else if(roomData.mode == 'randomchess' || roomData.mode == 'randomChess'){
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
                else if(roomData.mode == 'morphingRaceChoiceChess'){
                    state.pieces.length = 0;
                    state.board.length = 0;
                    for (let x = 0; x <= 7; x++) {
                        for (let y = 0; y <= 7; y++) {
                                state.board.push({ light: false, x: x, y: y })
                        }
                    }

                    state.pieces.push(kingFactory('white',1,1), hatFactory('white',1,2), shroomFactory('white', 1, 3))
                    state.gameType = 'morphingRaceChoiceChess'
                    state.turn = 'menu'
                }
                else if(roomData.mode == 'customMap'){
                    state.gameType = 'customMap';
                    state.customGameId = roomData.customGameId;
                    state.board.length = 0;
                    state.pieces.length = 0;
                    
                    let MapModel, pDefs, applyEffectsFunc;
                    if (typeof module !== 'undefined' && module.exports) {
                        MapModel = require('./models/map');
                        pDefs = require('./pieceDefinitions.js');
                        applyEffectsFunc = require('./customEffects.js').applyCustomEffects;
                    }
                    
                    if (MapModel) {
                        MapModel.findById(state.customGameId).then(json => {
                            if (!json) return;
                            const thePieces = json.pieces.map((piece) => {
                                if (piece.isCustom) {
                                    let adjustedMoves = JSON.parse(JSON.stringify(piece.customDef.moves));
                                    if (piece.color === 'black' && piece.customDef.flipForBlack !== false) {
                                        adjustedMoves = adjustedMoves.map(move => {
                                            if (move.y !== undefined) move.y = -move.y;
                                            if (move.offsetY !== undefined) move.offsetY = -move.offsetY;
                                            if (move.x !== undefined) move.x = -move.x;
                                            if (move.offsetX !== undefined) move.offsetX = -move.offsetX;
                                            return move;
                                        });
                                    }
                                    let pieceIcon = piece.color + piece.pieceType;
                                    if (piece.customDef.imageUrl) {
                                        if (piece.color === 'black' && piece.customDef.blackImageUrl) {
                                            pieceIcon = piece.customDef.blackImageUrl;
                                        } else {
                                            pieceIcon = piece.customDef.imageUrl;
                                        }
                                    }
                                    const newPiece = {
                                        x: piece.x, y: piece.y, initialX: piece.x, initialY: piece.y, color: piece.color,
                                        moves: adjustedMoves, name: piece.customDef.name, icon: pieceIcon,
                                        value: piece.customDef.value !== undefined ? piece.customDef.value : 3,
                                        posValue: piece.customDef.posValue !== undefined ? piece.customDef.posValue : 2,
                                        isCustom: true,
                                        customDef: piece.customDef
                                    };
                                    
                                    if (typeof applyEffectsFunc === 'function') {
                                        applyEffectsFunc(newPiece, piece.customDef);
                                    }
                                    return newPiece;
                                }
                                let pieceString = piece.pieceType.slice(0, -4).toLowerCase() + 'Factory';
                                if (pDefs && pDefs[pieceString]) {
                                    return pDefs[pieceString](piece.color, piece.x, piece.y);
                                } else {
                                    console.error("Factory not found:", pieceString);
                                }
                            });
                            state.board.push(...json.squares);
                            state.pieces.push(...thePieces.filter(p => p));
                        }).catch(err => console.error('Error loading custom map:', err));
                    }
                }
            }
        },
        rooms:true,
        delay: 100
    })
    return g;
}

function getMaxX(arr,x) {
    return arr.reduce((max, p) => p[x] > max ? p[x] : max, arr[0][x]);
}

function drawWhiteSquare(x, y, size) {
    if(size == undefined){
        size = 50;
    }
    ctx.fillStyle = whiteSquareColor;

    ctx.beginPath();
    ctx.fillRect(x, y, size, size);
    ctx.stroke();

    ctx.fillStyle = whiteSquareColor;

    ctx.beginPath();
    ctx.fillRect(x+1, y+1, size-2, size-2);
    ctx.stroke();
}

function drawColoredSquare(x, y, color, size) {
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.fillRect(x, y, size, size);
    ctx.stroke();

    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.fillRect(x+1, y+1, size-2, size-2);
    ctx.stroke();
}

function drawBlackSquare(x, y, size) {
    if(size == undefined){
        size = 50;
    }
    ctx.fillStyle = blackSquareColor;

    ctx.beginPath();
    ctx.fillRect(x, y, size, size);
    ctx.stroke();

    ctx.fillStyle = blackSquareColor;

    ctx.beginPath();
    ctx.fillRect(x+1, y+1, size-2, size-2);
    ctx.stroke();
}

function drawLightedSquare(x, y, size) {
    if(size == undefined){
        size = 50;
    }
    ctx.fillStyle = lightedSquareColor;

    ctx.beginPath();
    ctx.fillRect(x, y, size, size);
    ctx.stroke();
    ctx.fillStyle = lightedSquareColor;

    ctx.beginPath();
    ctx.fillRect(x+1, y+1, size-2, size-2);
    ctx.stroke();
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}


function pieceFromXY(x,y, pieces) {
    const piece = pieces.find((p) => {
        return x === p.x && y === p.y;
    })

    return piece;
}


function lightBoardFE(piece, state, flag,blockedFlag, minimal) {
    if (!flag) {
        flag = 'light'
    }
    closeLights(state.board, flag);
    if (!piece) {
        return;
    }
    let tempMoves = null;
    
    if (piece.conditionalMoves) {
        if(typeof piece.conditionalMoves === 'string'){
            let midObj = {conditionalMoves:piece.conditionalMoves}
           piece.conditionalMoves = JSONfnHelper.parse(JSONfnHelper.stringify(midObj)).conditionalMoves;
        }

        tempMoves = piece.conditionalMoves(state);
    }
    
    const moves = piece.moves;
    const movesLen = moves.length;
    
    // Process regular moves
    for (let i = 0; i < movesLen; i++) {
        processMove(moves[i], piece, state, flag, blockedFlag, minimal);
    }
    
    // Process conditional moves if any
    if (tempMoves) {
        const tempLen = tempMoves.length;
        for (let i = 0; i < tempLen; i++) {
            processMove(tempMoves[i], piece, state, flag, blockedFlag, minimal);
        }
    }
}

function processMove(move, piece, state, flag, blockedFlag, minimal) {
    if (move.type == 'absolute') {
            const square = findSquareByXY(state.board, piece.x + move.x, piece.y + move.y);
            if (square) {
                const innerPiece = pieceFromSquare(square, state.pieces)
                if (innerPiece) {
                    if (innerPiece.color != piece.color && !move.impotent) {
                        let checkForEnemies = innerPiece.color != piece.color && !move.friendlyPieces && !move.impotent;
                        let checkForFriends = innerPiece.color === piece.color && move.friendlyPieces && !move.impotent;
                        if ((checkForFriends || checkForEnemies) && !move.impotent) {
                            square[flag] = true;
                        }    
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
            const boardLen = state.board.length;
            for (let i = 0; i < boardLen; i++) {
                const square = state.board[i];
                const innerPiece = pieceFromSquare(square, state.pieces);
                if (innerPiece) {
                    if (innerPiece.color == piece.color && innerPiece.icon != piece.icon) {
                        square[flag] = true;
                    }
                }
            }
        }
        else if (move.type == 'takeMove') {
            const square = findSquareByXY(state.board, piece.x + move.x, piece.y + move.y);
            if (square) {
                const innerPiece = pieceFromSquare(square, state.pieces)

                if (innerPiece) {
                    let checkForEnemies = innerPiece.color != piece.color && !move.friendlyPieces;
                    let checkForFriends = innerPiece.color === piece.color && move.friendlyPieces;

                    if ((checkForFriends || checkForEnemies) && !move.impotent) {
                        square[flag] = true;
                    }
                }
                else{
                    square[blockedFlag] = true;
                }
            }
        }
        else if (move.type == 'blockable') {
            if (move.repeat) {
                const limit = move.limit || 100;
                const offsetX = move.offsetX || 0;
                const offsetY = move.offsetY || 0;
                const properties = {
                    state:state,
                    powerX:move.x,
                    powerY:move.y,
                    x:piece.x+offsetX,
                    y:piece.y+offsetY,
                    move:move,
                    limit:limit,
                    flag:flag,
                    secondFlag:blockedFlag,
                    missedSquareX:move.missedSquareX,
                    missedSquareY:move.missedSquareY,
                    minimal:minimal,
                    operatedPiece:piece,
                    offsetX:offsetX,
                    offsetY:offsetY
                }
                blockableSpecialFunction(properties);
            }
        }
}

function blockableSpecialFunction(properties) {
    let {state, powerX, powerY, x, y, move, limit, flag,secondFlag,operatedPiece,offsetX,offsetY} = properties;
    let missedSquareX = properties.missedSquareX;
    let missedSquareY = properties.missedSquareY;
    /*
    properties

        state:state,
        powerX:move.x,
        powerY:move.y,
        x:piece.x+offsetX,
        y:piece.y+offsetY,
        move:move,
        limit:limit,
        flag:flag,
        blockedFlag:blockedFlag,
        missedSquareX:missedSquareX,
        missedSquareY:missedSquareY

    */

    if (!flag) {
        flag = 'light'
    }
    if (limit === 0) {
        return;
    }
    
    
    if(!missedSquareX){
        missedSquareX = 0;
    }

    if(!missedSquareY){
        missedSquareY = 0;
    }
    const square = findSquareByXY(state.board,powerX+x,powerY+y)

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


    if (!piece) {
        square[flag] = true;
        const props = {
            state:state,
            powerX:powerX+ directionX+missedSquareX,
            powerY:powerY+ directionY+missedSquareY,
            x:x,
            y:y,
            move:move,
            limit:limit-1,
            flag:flag,
            secondFlag:secondFlag,
            missedSquareX:missedSquareX,
            missedSquareY:missedSquareY,
            minimal:properties.minimal,
            operatedPiece:operatedPiece,
            offsetX:offsetX,
            offsetY:offsetY
        }

        blockableSpecialFunction(props)
    }
    else if((piece.color != operatedPiece.color  && !move.friendlyPieces || piece.color === operatedPiece.color  && move.friendlyPieces) && properties.minimal  && !move.impotent){
        square[flag] = true;
    }
    else if (piece && !move.impotent && !properties.minimal) {
        let selectedPiece = pieceFromXY(x-offsetX,y-offsetY,state.pieces)
        // let checkForEnemies = innerPiece.color != piece.color && !move.friendlyPieces;
        // let checkForFriends = innerPiece.color === piece.color && move.friendlyPieces;
        // square[flag] = true;

        
        if(selectedPiece){
            if(!(selectedPiece.color == piece.color && !move.friendlyPieces || selectedPiece.color != piece.color && move.friendlyPieces) ){
                if(secondFlag){

                    square[secondFlag] = true;
                }
                square[flag] = true;
            }
        }
        if(secondFlag){
            square[flag] = true;
            const props = {
                state:state,
                powerX:move.x+ directionX+missedSquareX,
                powerY:move.y+ directionY+missedSquareY,
                x:x,
                y:y,
                move:move,
                limit:limit-1,
                flag:secondFlag,
                missedSquareX:missedSquareX,
                missedSquareY:missedSquareY,
                minimal:properties.minimal,
                operatedPiece:operatedPiece
            }
            blockableSpecialFunction(props)
        }
    }

    return;
}

function closeLights(board, flag) {
    if (!flag) {
        flag = 'light'
    }
    if(board){
        board.forEach((square) => {
            square[flag] = false;
        })
    }

}

function reverseNumber(number,size){
    let sizePlusOne = size;
    return (number - sizePlusOne)*-1
}

function getColorPieces(pieces,color){
    const myPieces = pieces.filter((piece) => {
        if(color === piece.color){
            return true;
        }
    })

    return myPieces
}


function copyLinkToClipboard(){
    navigator.clipboard.writeText(window.location)
}

function returnPieceWithColor(x,y,color,state){
    return state.pieces.find((el) => {
        return el.x === x && el.y === y && el.color === color;
    })
}

function conditionalSplice(array,index){
    if(index> -1){
        array.splice(index,1)
    }
}

function conditionalSpliceWithBonus(state,index,color){

    if(index> -1){
        if(state.pieces[index].afterThisPieceTaken){
            state.pieces[index].afterThisPieceTaken(state);
        }
        if(state.pieces[index].color != color || !color){
            state.pieces.splice(index,1)
        }
    }
}

function pieceAroundMe(state,aroundWhat,pieceTypeIcon){
    let gore =  state.pieces[findPieceByXY(state.pieces,aroundWhat.x,aroundWhat.y+1)]?.icon?.includes(pieceTypeIcon) && aroundWhat.color === state.pieces[findPieceByXY(state.pieces,aroundWhat.x,aroundWhat.y+1)]?.color;
    let dolu = state.pieces[findPieceByXY(state.pieces,aroundWhat.x,aroundWhat.y-1)]?.icon?.includes(pieceTypeIcon) && aroundWhat.color === state.pieces[findPieceByXY(state.pieces,aroundWhat.x,aroundWhat.y-1)]?.color;
    let lqvo = state.pieces[findPieceByXY(state.pieces,aroundWhat.x+1,aroundWhat.y)]?.icon?.includes(pieceTypeIcon)&& aroundWhat.color === state.pieces[findPieceByXY(state.pieces,aroundWhat.x+1,aroundWhat.y)]?.color;
    let dqsno = state.pieces[findPieceByXY(state.pieces,aroundWhat.x-1,aroundWhat.y)]?.icon?.includes(pieceTypeIcon) && aroundWhat.color === state.pieces[findPieceByXY(state.pieces,aroundWhat.x-1,aroundWhat.y)]?.color;;
    let lqvoGore = state.pieces[findPieceByXY(state.pieces,aroundWhat.x+1,aroundWhat.y+1)]?.icon?.includes(pieceTypeIcon)&& aroundWhat.color === state.pieces[findPieceByXY(state.pieces,aroundWhat.x+1,aroundWhat.y+1)]?.color;;
    let dqsnoGore = state.pieces[findPieceByXY(state.pieces,aroundWhat.x-1,aroundWhat.y+1)]?.icon?.includes(pieceTypeIcon)&& aroundWhat.color === state.pieces[findPieceByXY(state.pieces,aroundWhat.x-1,aroundWhat.y+1)]?.color;
    let lqvoDolu = state.pieces[findPieceByXY(state.pieces,aroundWhat.x+1,aroundWhat.y-1)]?.icon?.includes(pieceTypeIcon)&& aroundWhat.color === state.pieces[findPieceByXY(state.pieces,aroundWhat.x+1,aroundWhat.y-1)]?.color;;
    let dqsnoDolu = state.pieces[findPieceByXY(state.pieces,aroundWhat.x-1,aroundWhat.y-1)]?.icon?.includes(pieceTypeIcon)&& aroundWhat.color === state.pieces[findPieceByXY(state.pieces,aroundWhat.x-1,aroundWhat.y-1)]?.color;;
    
    return gore || dolu || lqvo || dqsno || lqvoGore || dqsnoGore || lqvoDolu || dqsnoDolu;
}

function cyborgTeleport(state,me,toReturn){
    let piece = returnPieceWithColor(me.x+0,me.y-1,me.color,state);
    if(piece && piece?.icon != me.icon){
        toReturn.push({ type: 'takeMove', x: 0, y: -1, friendlyPieces:true })
    }
    piece = returnPieceWithColor(me.x+0,me.y+1,me.color,state)
    if(piece && piece?.icon != me.icon){
        toReturn.push({ type: 'takeMove', x: 0, y: 1, friendlyPieces:true })
    }
    piece = returnPieceWithColor(me.x+1,me.y-1,me.color,state)
    if(piece && piece?.icon != me.icon){
        toReturn.push({ type: 'takeMove', x: 1, y: -1, friendlyPieces:true })
    }
    piece = returnPieceWithColor(me.x+1,me.y+1,me.color,state)
    if(piece && piece?.icon != me.icon){
        toReturn.push({ type: 'takeMove', x: 1, y: 1, friendlyPieces:true })
    }
    piece = returnPieceWithColor(me.x+1,me.y+0,me.color,state)
    if(piece && piece?.icon != me.icon){
        toReturn.push({ type: 'takeMove', x: 1, y: 0, friendlyPieces:true })
    }
    piece = returnPieceWithColor(me.x-1,me.y+0,me.color,state)
    if(piece && piece?.icon != me.icon){
        toReturn.push({ type: 'takeMove', x: -1, y: 0, friendlyPieces:true })
    }
    piece = returnPieceWithColor(me.x-1,me.y-1,me.color,state)

    if(piece && piece?.icon != me.icon){
        toReturn.push({ type: 'takeMove', x: -1, y:-1, friendlyPieces:true })
    }
    piece = returnPieceWithColor(me.x-1,me.y+1,me.color,state)

    if(piece && piece?.icon != me.icon){
        toReturn.push({ type: 'takeMove', x: -1, y: 1, friendlyPieces:true })
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var posValue = [
    0.1,
    0.5,
    1,
    2,
    3,
    4
]

var JSONfnHelper = (typeof JSONfn !== 'undefined') ? JSONfn : {};

JSONfnHelper.stringify = function(obj) {
    return JSON.stringify(obj,function(key, value){
            return (typeof value === 'function' ) ? value.toString() : value;
        });
}

JSONfnHelper.parse = function(str) {
    return JSON.parse(str,function(key, value){
        if(typeof value != 'string') return value;
        return ( value.substring(0,8) == 'function') ? eval('('+value+')') : value;
    });
}

try{
    module.exports = {
        JSONfn: JSONfnHelper,
        returnPieceWithColor,
        conditionalSplice,
        conditionalSpliceWithBonus,
        pieceAroundMe,
        cyborgTeleport,
        getRndInteger,
        posValue,
        findCopyPieceByXY,
        findPieceByXY,
        findSquareByXY,
        checkEmptyHorizontalBetween,
        giveOppositeColor,
        areYouChecked,
        areYouCheckedWithoutTempMoves,
        isRoadAttacked,
        pieceFromSquare,
        blockableCheck,
        lightBoardFE,
        isPositionAttacked,
        checkRemi,
        getColorPieces
    }
}
catch(err){

}