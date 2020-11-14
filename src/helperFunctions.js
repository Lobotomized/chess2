function getMaxX(arr,x) {
    return arr.reduce((max, p) => p[x] > max ? p[x] : max, arr[0][x]);
}

function reverseNumber(number,size){
    let sizePlusOne = size;
    return (number - sizePlusOne)*-1
}

function lightPieceMove(piece,color,board){

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
    board.forEach((square) => {
        square[flag] = false;
    })
}

function lightBoard(piece, state, flag,blockedFlag) {
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
                blockableFunction(state, move.x, move.y, piece.x, piece.y, move, limit, flag,blockedFlag);
            }
        }
    })
}


function blockableFunction(state, powerX, powerY, x, y, move, limit, flag,secondFlag) {
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


    if (!piece) {
        square[flag] = true;
        blockableFunction(state, powerX + directionX, powerY + directionY, x, y, move, limit - 1, flag,secondFlag)
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
        
        blockableFunction(state, powerX + directionX, powerY + directionY, x, y, move, limit - 1, secondFlag,secondFlag)
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

