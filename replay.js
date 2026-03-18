const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('gameId');

let gameData = null;
let currentMoveIndex = 0;
let isPlaying = false;
let playInterval = null;
let squareLength = 600 / 8;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let gameState = {
    board: [],
    pieces: [],
    turn: 'white',
    won: false
};

async function init() {
    if(!gameId) {
        document.getElementById('status').innerText = 'No Game ID provided.';
        return;
    }
    
    // Load images first
    await waitForImages();

    fetch(`/game/${gameId}`)
    .then(res => res.json())
    .then(data => {
        gameData = data;
        document.getElementById('status').innerText = `${data.whiteRace} vs ${data.blackRace} - Winner: ${data.winner}`;
        
        // Initialize board
        gameState.whiteRace = data.whiteRace;
        gameState.blackRace = data.blackRace;
        gameState.gameType = 'raceChoiceChess';
        
        // Reset board
        raceChoiceChess(gameState, data.whiteRace, data.blackRace);
        
        drawBoard();
    })
    .catch(err => {
        console.error(err);
        document.getElementById('status').innerText = 'Error loading game data.';
    });
}

const waitForImages = async () => {
    if (document.readyState !== 'complete') {
         await new Promise(resolve => window.addEventListener('load', resolve));
    }
    if(window.imagesLoaded){
        await window.imagesLoaded;
    }
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw squares
    for(let y=0; y<8; y++) {
        for(let x=0; x<8; x++) {
            if((x+y)%2 === 0) {
                drawWhiteSquare(x*squareLength, y*squareLength, squareLength);
            } else {
                drawBlackSquare(x*squareLength, y*squareLength, squareLength);
            }
        }
    }
    
    // Draw pieces
    gameState.pieces.forEach(p => {
        drawPiece(p.x, p.y, p.icon, squareLength);
    });
}

function nextMove() {
    if(!gameData || currentMoveIndex >= gameData.moves.length) return;
    
    let move = gameData.moves[currentMoveIndex];
    
    // We stored {color, from, to, pieceIndex}
    // We need to find the piece at 'from' and move it to 'to'
    // Since we are replaying, we trust the move is valid
    
    // Note: pieceIndex might be unreliable if pieces array order changes (e.g. captured pieces removed)
    // Safer to find piece at 'from' coordinates
    
    let piece = gameState.pieces.find(p => p.x === move.from.x && p.y === move.from.y);
    
    // In some edge cases or special moves, the piece might not be found by pure x,y.
    // E.g., if a piece was teleported or created. We also fall back to checking color and icon.
    if(!piece) {
        piece = gameState.pieces.find(p => p.color === move.color && p.x === move.from.x && p.y === move.from.y);
    }

    if(piece) {
        gameState.pieceSelected = piece;
        playerMove({x: move.to.x, y: move.to.y}, gameState, true);
        
        // Emulate worker loop
        for (let i = gameState.pieces.length - 1; i >= 0; i--) {
            if(gameState.pieces[i].color !== gameState.turn){
                if (gameState.pieces[i].afterEnemyPlayerMove) {
                    gameState.pieces[i].afterEnemyPlayerMove(gameState, {x: move.to.x, y: move.to.y});
                }
            }
        }
        
        changeTurn(gameState);
        
        document.getElementById('moveInfo').innerText = `Move ${currentMoveIndex+1}: ${move.color} piece from ${move.from.x},${move.from.y} to ${move.to.x},${move.to.y}`;
        currentMoveIndex++;
        drawBoard();
    } else {
        console.error("Could not execute move", move);
        document.getElementById('moveInfo').innerText = `ERROR: Missing piece at ${move.from.x},${move.from.y} for ${move.color}`;
        currentMoveIndex++; // Skip to avoid stuck loop
    }
}

function prevMove() {
    // Implementing stepping back is hard because game state is mutable.
    // Easiest way: Reset board and fast-forward to (currentMoveIndex - 1)
    if(currentMoveIndex <= 0) return;
    
    let targetIndex = currentMoveIndex - 1;
    
    // Reset
    currentMoveIndex = 0;
    gameState.pieces = [];
    gameState.board = [];
    gameState.turn = 'white';
    gameState.won = false;
    raceChoiceChess(gameState, gameData.whiteRace, gameData.blackRace);
    
    // Fast forward
    while(currentMoveIndex < targetIndex) {
        nextMove();
    }
    drawBoard();
}

function togglePlay() {
    if(isPlaying) {
        clearInterval(playInterval);
        isPlaying = false;
        document.getElementById('playBtn').innerText = 'Play';
    } else {
        isPlaying = true;
        document.getElementById('playBtn').innerText = 'Pause';
        playInterval = setInterval(() => {
            if(currentMoveIndex >= gameData.moves.length) {
                togglePlay();
                return;
            }
            nextMove();
        }, 500);
    }
}

// Helper drawing wrappers (mocking hotseat.js logic)
function drawBlackSquare(x, y, w) {
    ctx.fillStyle = '#b58863';
    ctx.fillRect(x, y, w, w);
}
function drawWhiteSquare(x, y, w) {
    ctx.fillStyle = '#f0d9b5';
    ctx.fillRect(x, y, w, w);
}
function drawPiece(x, y, icon, w) {
    let img = new Image();
    // Icon path usually like '/static/lg/whiteKing.png'
    // If icon is just 'whiteKing.png', prepend path
    if(!icon.includes('/')) icon = '/static/lg/' + icon;
    img.src = icon;
    // We can't wait for load inside draw loop efficiently, but browser caches it.
    // If not loaded yet, it won't draw this frame.
    ctx.drawImage(img, x * w, y * w, w, w);
}

window.onload = init;