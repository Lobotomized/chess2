function getMaxX(arr,x) {
    return arr.reduce((max, p) => p[x] > max ? p[x] : max, arr[0][x]);
}

function reverseNumber(number,size){
    let sizePlusOne = size;
    return (number - sizePlusOne)*-1
}

function lightPieceMove(piece,color,board){

}

function findSquareByXY(board,x,y){
    let index =  board.findIndex((square) => {
        return square.x == x && square.y == y;
    })
    return board[index]
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


function drawPiece(x, y, img, size) {
    if(size == undefined){
        size = 50
    }
    switch (img) {
        case 'blackBishop.png':
            
            ctx.drawImage(bBishop, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'dragonImage':
            ctx.drawImage(dragonImage, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whiteBishop.png':
            ctx.drawImage(wBishop, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackKnight.png':
            ctx.drawImage(bKnight, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whiteKnight.png':
            wKnight.width = size;
            wKnight.height = size;
            ctx.drawImage(wKnight, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackRook.png':
            ctx.drawImage(bRook, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whiteRook.png':
            ctx.drawImage(wRook, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackPawn.png':
            ctx.drawImage(bPawn, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whitePawn.png':
            ctx.drawImage(wPawn, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackQueen.png':
            ctx.drawImage(bQueen, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whiteQueen.png':
            ctx.drawImage(wQueen, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackKing.png':
            ctx.drawImage(bKing, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whiteKing.png':
            ctx.drawImage(wKing, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackPig.png':
            ctx.drawImage(bPig, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whitePig.png':
            ctx.drawImage(wPig, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackHorse.png':
            ctx.drawImage(bHorse, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whiteHorse.png':
            ctx.drawImage(wHorse, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackRicar.png':
            ctx.drawImage(bRicar, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whiteRicar.png':
            ctx.drawImage(wRicar, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackPlagueDoctor.png':
            ctx.drawImage(bPlagueDoctor, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whitePlagueDoctor.png':
            ctx.drawImage(wPlagueDoctor, 0, 0, 500, 500, x * size, y * size, size, size);
            break;

        case 'blackStarMan.png':
            ctx.drawImage(bStarMan, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whiteStarMan.png':
            ctx.drawImage(wStarMan, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackClown.png':
            ctx.drawImage(bClown, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whiteClown.png':
            ctx.drawImage(wClown, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackGhost.png':
            ctx.drawImage(bGhost, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whiteGhost.png':
            ctx.drawImage(wGhost, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackHat.png':
            ctx.drawImage(bHat, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whiteHat.png':
            ctx.drawImage(wHat, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        // 
        case 'blackAnt.png':
            ctx.drawImage(bAnt, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackGoliathBug.png':
            ctx.drawImage(bGoliathBug, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackLadyBug.png':
            ctx.drawImage(bLadyBug, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackSpider.png':
            ctx.drawImage(bSpider, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackQueenBug.png':
            ctx.drawImage(bQueenBug, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackShroom.png':
            ctx.drawImage(bShroom, 0, 0, 500, 500, x * size, y * size, size, size);
            break;

        case 'whiteAnt.png':
            ctx.drawImage(wAnt, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whiteGoliathBug.png':
            ctx.drawImage(wGoliathBug, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whiteLadyBug.png':
            ctx.drawImage(wLadyBug, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whiteSpider.png':
            ctx.drawImage(wSpider, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whiteQueenBug.png':
            ctx.drawImage(wQueenBug, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whiteShroom.png':
            ctx.drawImage(wShroom, 0, 0, 500, 500, x * size, y * size, size, size);
            break;

            //New
        case 'whiteSwordsmen.png':
            ctx.drawImage(wSwordsmen, 0, 0, 700, 700, x * size, y * size, size, size);
            break;
        case 'blackSwordsmen.png':
            ctx.drawImage(bSwordsmen, 0, 0, 700, 700, x * size, y * size, size, size);
            break;
        case 'whitePlagueDoctor.png':
            ctx.drawImage(wSwordsmen, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackPlagueDoctor.png':
            ctx.drawImage(bSwordsmen, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'whiteStarMan.png':
            ctx.drawImage(wStarMan, 0, 0, 500, 500, x * size, y * size, size, size);
            break;
        case 'blackStarMan.png':
            ctx.drawImage(bStarMan, 0, 0, 500, 500, x * size, y * size, size, size);
            break;

        case 'whiteKolba.png':
            ctx.drawImage(wKolba, 0, 0,1050, 1050, x * size, y * size, size, size);
            break;
        case 'blackKolba.png':
            ctx.drawImage(bKolba, 0, 0, 1050, 1050, x * size, y * size, size, size);
            break;
            
        case 'whiteFencer.png':
            ctx.drawImage(wFencer, 0, 0, 700, 700, x * size, y * size, size, size);
            break;
        case 'blackFencer.png':
            ctx.drawImage(bFencer, 0, 0, 700, 700, x * size, y * size, size, size);
            break;

        case 'whiteNorthernKing.png':
            ctx.drawImage(wNorthernKing, 0, 0, 700, 700, x * size, y * size, size, size);
            break;
        case 'blackNorthernKing.png':
            ctx.drawImage(bNorthernKing, 0, 0, 700, 700, x * size, y * size, size, size);
            break;
        case 'whiteShield.png':
            ctx.drawImage(wShield, 0, 0, 700, 700, x * size, y * size, size, size);
            break;
        case 'blackShield.png':
            ctx.drawImage(bShield, 0, 0, 700, 700, x * size, y * size, size, size);
            break;
        case 'whitePikeman.png':
            ctx.drawImage(wPikeman, 0, 0, 800, 800, x * size, y * size, size, size);
            break;
        case 'blackPikeman.png':
            ctx.drawImage(bPikeman, 0, 0, 800, 800, x * size, y * size, size, size);
            break;

        case 'whiteGeneral.png':
            ctx.drawImage(wGeneral, 0, 0, 600, 600, x * size, y * size, size, size);
            break;
        case 'blackGeneral.png':
            ctx.drawImage(bGeneral, 0, 0, 600, 600, x * size, y * size, size, size);
            break;

        case 'whiteDragon.png':
            ctx.drawImage(wDragon, 0, 0, 600, 600, x * size, y * size, size, size);
            break;
        case 'blackDragon.png':
            ctx.drawImage(bDragon, 0, 0, 600, 600, x * size, y * size, size, size);
            break;
        case 'whiteSleepingDragon.png':
            ctx.drawImage(wSleepingDragon, 0, 0, 600, 600, x * size, y * size, size, size);
            break;
        case 'blackSleepingDragon.png':
            ctx.drawImage(bSleepingDragon, 0, 0, 600, 600, x * size, y * size, size, size);
            break;

        //
        case 'whiteCyborg.png':
            ctx.drawImage(wCyborg, 0, 0, 600, 600, x * size, y * size, size, size);
        break;
        case 'blackCyborg.png':
            ctx.drawImage(bCyborg, 0, 0, 600, 600, x * size, y * size, size, size);
        break;

        case 'whiteBootvessel.png':
            ctx.drawImage(wBootvessel, -40, -80, 600, 600, x * size, y * size, size, size);
        break;
        case 'blackBootvessel.png':
            ctx.drawImage(bBootvessel, -40, -80, 600, 600, x * size, y * size, size, size);
        break;

        case 'blackCrystal.png':
            ctx.drawImage(bCrystal, -40, -40, 600, 600, x * size, y * size, size, size);
        break;
        case 'whiteCrystal.png':
            ctx.drawImage(wCrystal, -40, -40, 600, 600, x * size, y * size, size, size);
        break;

        case 'blackCrystalEmpowered.png':
            ctx.drawImage(bCrystalEmpowered, -40, -40, 600, 600, x * size, y * size, size, size);
        break;
        case 'whiteCrystalEmpowered.png':
            ctx.drawImage(wCrystalEmpowered, -40, -40, 600, 600, x * size, y * size, size, size);
        break;

        case 'blackJuggernaut.png':
            ctx.drawImage(bJuggernaut, -70, -50, 600, 600, x * size, y * size, size, size);
        break;
        case 'whiteJuggernaut.png':
            ctx.drawImage(wJuggernaut, -70, -80, 600, 600, x * size, y * size, size, size);
        break;

        case 'blackExecutor.png':
            ctx.drawImage(bExecutor,-100, -100, 600, 600, x * size, y * size, size, size);
        break;
        case 'whiteExecutor.png':
            ctx.drawImage(wExecutor, -100, -100, 600, 600, x * size, y * size, size, size);
        break;
    }
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

function pieceFromSquare(square, pieces) {
    const piece = pieces.find((p) => {
        return square.x === p.x && square.y === p.y;
    })

    return piece;
}

function pieceFromXY(x,y, pieces) {
    const piece = pieces.find((p) => {
        return x === p.x && y === p.y;
    })

    return piece;
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

function lightBoardFE(piece, state, flag,blockedFlag) {
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
function findCopyPieceByXY(pieces,x,y){
    return pieces.find((piece) => {
        return piece .x == x && piece.y == y;
    })
}

function blockableSpecialFunction(state, powerX, powerY, x, y, move, limit, flag,secondFlag, missedSquareX, missedSquareY) {
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

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function findPieceByXY(pieces,x,y){
    let index =  pieces.findIndex((piece) => {
         return piece .x == x && piece.y == y;
     })
     return index
 }

 function areYouChecked(state,enemyColor,me){
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

function blockableCheck(state, powerX, powerY, x, y, move, limit,myPiece, flag) {
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