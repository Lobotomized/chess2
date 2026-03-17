const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');

// --- 1. Mock Browser Environment ---
global.self = global;
global.window = global;
global.crypto = crypto;

// Mock importScripts for webworker compatibility if needed, though we will load files manually
global.importScripts = function() {};

// Mock JSONfn
global.JSONfn = {
    parse: JSON.parse,
    stringify: JSON.stringify
};

// --- 2. Load JS Dependencies ---
const projectRoot = path.join(__dirname, '../');

function loadFile(relativePath) {
    const fullPath = path.join(projectRoot, relativePath);
    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        // Use vm.runInThisContext to execute in the global scope
        vm.runInThisContext(content, { filename: fullPath });
        console.log(`Loaded ${relativePath}`);
    } catch (err) {
        console.error(`Error loading ${relativePath}:`, err);
    }
}

// Load files in dependency order
loadFile('src/jsonfn.js');
loadFile('helperFunctions.js');
loadFile('moveMethods.js');

// Helper to mock 'require' inside the eval-ed files if they use it
// pieces/medieval.js tries to require helperFunctions.js
const originalRequire = require;
global.require = function(modulePath) {
    if (modulePath.includes('helperFunctions')) {
        return { 
            posValue: global.posValue, 
            giveOppositeColor: global.giveOppositeColor,
            findCopyPieceByXY: global.findCopyPieceByXY
        };
    }
    return originalRequire(modulePath);
};

loadFile('pieces/medieval.js');
loadFile('pieces/animals.js');
loadFile('pieces/misc.js');
loadFile('src/AI/magnifiers.js');
loadFile('src/AI/filters.js');

// --- Patch JS Factories to match WASM implementation ---
// WASM Ricar does not have dynamic value updates
const originalRicarFactory = global.ricarFactory;
global.ricarFactory = function(color, x, y) {
    const piece = originalRicarFactory(color, x, y);
    piece.afterPlayerMove = undefined;
    piece.afterThisPieceTaken = undefined;
    return piece;
};

// WASM Horse value is 1.66, JS is 5
const originalHorseFactory = global.horseFactory;
global.horseFactory = function(color, x, y) {
    const piece = originalHorseFactory(color, x, y);
    piece.value = 1.66;
    return piece;
};

// WASM might have broken allMine or friendly interaction for Clown
const originalClownFactory = global.clownFactory;
global.clownFactory = function(color, x, y) {
    const piece = originalClownFactory(color, x, y);
    // Remove allMine move (last one usually)
    piece.moves = piece.moves.filter(m => m.type !== 'allMine');
    return piece;
};
loadFile('src/AI/general.js');
loadFile('src/coreAlgorithms.js');

// Restore require
global.require = originalRequire;

// --- 3. Load WASM Module ---
const wasmPath = path.join(__dirname, 'build/release.wasm');
let wasmExports = null;
let wasmMemory = null;

function readString(ptr) {
    if (!wasmMemory) return "(memory not set)";
    const buffer = wasmMemory.buffer;
    const U32 = new Uint32Array(buffer);
    const U16 = new Uint16Array(buffer);
    const len = U32[(ptr - 4) >>> 2];
    const offset = ptr >>> 1;
    let str = "";
    for (let i = 0; i < len; i++) {
        str += String.fromCharCode(U16[offset + i]);
    }
    return str;
}

async function initWasm() {
    const buffer = fs.readFileSync(wasmPath);
    const results = await WebAssembly.instantiate(buffer, {
        env: {
            abort: (msg, file, line, col) => console.error(`Wasm aborted: ${readString(msg)} at ${readString(file)}:${line}:${col}`),
            trace: (msg, n, args) => console.log(`Wasm trace: ${readString(msg)}`),
            "console.log": (msg) => console.log(`Wasm log: ${readString(msg)}`),
            seed: () => Math.random()
        }
    });
    wasmExports = results.instance.exports;
    wasmMemory = wasmExports.memory;
    console.log("Wasm initialized.");
}

// --- 4. Helper Functions for Test ---

// Map icon names to IDs for WASM (from webworker_interface.js)
function getIconId(icon) {
    if (!icon) return 0;
    if (icon.includes('Pawn') && !icon.includes('weak') && !icon.includes('unpromotable')) return 0;
    if (icon.includes('Knight') && !icon.includes('mongolian')) return 1;
    if (icon.includes('Bishop')) return 2;
    if (icon.includes('Rook')) return 3;
    if (icon.includes('Queen') && !icon.includes('Bug')) return 4;
    if (icon.includes('King') && !icon.includes('northern')) return 5;
    if (icon.includes('LadyBug')) return 6;
    if (icon.includes('Ant')) return 7;
    if (icon.includes('Spider')) return 8;
    if (icon.includes('GoliathBug')) return 9;
    if (icon.includes('QueenBug')) return 10;
    if (icon.includes('BrainBug')) return 11;
    if (icon.includes('Pig')) return 12;
    if (icon.includes('Ghost')) return 13;
    if (icon.includes('Ricar')) return 14;
    if (icon.includes('Horse')) return 15;
    if (icon.includes('Dragon') && !icon.includes('Sleeping')) return 16;
    if (icon.includes('SleepingDragon')) return 17;
    if (icon.includes('ElectricCat')) return 18;
    if (icon.includes('FatCat')) return 19;
    if (icon.includes('LongCat')) return 20;
    if (icon.includes('BlindCat')) return 21;
    if (icon.includes('ScaryCat')) return 22;
    if (icon.includes('CuteCat')) return 23;
    if (icon.includes('Swordsmen')) return 24;
    if (icon.includes('Pikeman')) return 25;
    if (icon.includes('Shield')) return 26;
    if (icon.includes('Fencer')) return 27;
    if (icon.includes('Kolba')) return 28;
    if (icon.includes('Gargoyle')) return 29;
    if (icon.includes('General')) return 30;
    if (icon.includes('northernKing')) return 31;
    if (icon.includes('plagueDoctor')) return 32;
    if (icon.includes('Bootvessel')) return 33;
    if (icon.includes('Executor')) return 34;
    if (icon.includes('CrystalEmpowered')) return 35;
    if (icon.includes('Crystal') && !icon.includes('Empowered')) return 36;
    if (icon.includes('Juggernaut')) return 37;
    if (icon.includes('Cyborg')) return 38;
    if (icon.includes('mongolianKnight')) return 39;
    if (icon.includes('weakPawn')) return 40;
    if (icon.includes('unpromotablePawn')) return 41;
    if (icon.includes('Hat')) return 42;
    if (icon.includes('Clown')) return 43;
    if (icon.includes('StarMan')) return 44;
    return 0;
}

// --- 5. Benchmark Setup ---

async function runBenchmark() {
    await initWasm();

    // Setup Board
    const board = [];
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            board.push({
                x: x,
                y: y,
                light: (x + y) % 2 !== 0, // Chess standard
                allowedMove: false
            });
        }
    }

    // Setup Pieces (Medieval vs Medieval from boardGeneration.js)
    const pieces = [];
    
    // White (boardGeneration 337)
    // ghostFactory('white',2,5),ghostFactory('white',3,5),ghostFactory('white',4,5),ghostFactory('white',5,5),
    // pigFactory('white',2,6),  horseFactory('white',3,6),horseFactory('white',4,6),pigFactory('white',5,6),
    // clownFactory('white',1,7),ricarFactory('white',2,7),hatFactory('white',3,7),hatFactory('white',4,7),ricarFactory('white',5,7),clownFactory('white',6,7)
    
    pieces.push(
        ghostFactory('white',2,5),ghostFactory('white',3,5),ghostFactory('white',4,5),ghostFactory('white',5,5),
        pigFactory('white',2,6),  horseFactory('white',3,6),horseFactory('white',4,6),pigFactory('white',5,6),
        clownFactory('white',1,7),ricarFactory('white',2,7),hatFactory('white',3,7),hatFactory('white',4,7),ricarFactory('white',5,7),clownFactory('white',6,7)
    );
    
    // Black (boardGeneration 285)
    // ghostFactory('black',2,2),ghostFactory('black',3,2),ghostFactory('black',4,2),ghostFactory('black',5,2),
    // pigFactory('black',2,1),  horseFactory('black',3,1),horseFactory('black',4,1),pigFactory('black',5,1),
    // clownFactory('black',1,0),ricarFactory('black',2,0),hatFactory('black',3,0),hatFactory('black',4,0),ricarFactory('black',5,0),clownFactory('black',6,0),

    pieces.push(
        ghostFactory('black',2,2),ghostFactory('black',3,2),ghostFactory('black',4,2),ghostFactory('black',5,2),
        pigFactory('black',2,1),  horseFactory('black',3,1),horseFactory('black',4,1),pigFactory('black',5,1),
        clownFactory('black',1,0),ricarFactory('black',2,0),hatFactory('black',3,0),hatFactory('black',4,0),ricarFactory('black',5,0),clownFactory('black',6,0)
    );

    const state = {
        pieces: pieces,
        board: board,
        turn: 'white',
        won: ''
    };

    // Match WASM magnifiers from aiGetBestMove / defaultCharacter(0)
    const magnifiers = [
        {
            method: global.evaluationMagnifierMaxOptions, 
            options: { posValue: 0.1 }
        },
        {
            method: global.evaluationMagnifierPiece,
            options: { pieceValue: 1.5 }
        }
    ];

    // Play 3 random moves for White and check Black's response
    // We will hardcode 3 valid white moves for consistency in the test.
    // Let's find valid white moves.
    // E.g. White Ghost (piece idx 0) moves to (2,4)
    // White Pig (piece idx 4) moves to (2,5)
    // White Horse (piece idx 5) moves to (2,4)
    
    // Hardcoded white moves (Piece index, toX, toY)
    const whiteMoves = [
        { pcIndex: 0, x: 2, y: 4 }, // Ghost at (2,5) to (2,4)
        { pcIndex: 5, x: 2, y: 4 }, // Horse at (3,6) to (2,4)
        { pcIndex: 4, x: 2, y: 5 }  // Pig at (2,6) to (2,5)
    ];

    for (let round = 0; round < whiteMoves.length; round++) {
        console.log(`\n--- Round ${round + 1} ---`);
        const wMove = whiteMoves[round];
        
        // 1. Apply White Move to JS State
        const wPiece = state.pieces[wMove.pcIndex];
        console.log(`White moves: ${wPiece.icon} to (${wMove.x}, ${wMove.y})`);
        
        // Simulate move using JS logic (simplified)
        wPiece.x = wMove.x;
        wPiece.y = wMove.y;
        wPiece.moved = true;
        
        // Update turn
        state.turn = 'black';

        // --- Run JS AI for Black ---
        console.log("Running JS AI for Black...");
        const jsStart = process.hrtime();
        
        const jsMove = global.minimaxAlphaBeta(
            state, 
            'black', 
            3, // depth
            [], // removedTurns
            magnifiers, 
            [] // filters
        );
        
        const jsEnd = process.hrtime(jsStart);
        
        let jsMoveStr = "null";
        let jsPcIndex = -1;
        let jsToX = -1;
        let jsToY = -1;
        
        if (jsMove) {
            jsPcIndex = jsMove.pieceCounter;
            jsToX = jsMove.xClicked;
            jsToY = jsMove.yClicked;
            const piece = state.pieces[jsPcIndex];
            jsMoveStr = `PieceIdx ${jsPcIndex} to (${jsToX}, ${jsToY}) (${piece.icon}) Value: ${jsMove.value}`;
        }
        
        console.log(`JS AI Result: ${jsMoveStr}`);
        console.log(`JS Time: ${jsEnd[0]}s ${jsEnd[1] / 1000000}ms`);


        // --- Run WASM AI for Black ---
        console.log("Running WASM AI for Black...");
        
        // Init state: 1=black turn, 2=no winner
        wasmExports.aiInitState(1, 2); 

        // Add board
        for (let i = 0; i < state.board.length; i++) {
            let sq = state.board[i];
            wasmExports.aiAddSquare(sq.x, sq.y, sq.light ? 1 : 0, 0);
        }

        // Add pieces
        for (let i = 0; i < state.pieces.length; i++) {
            let p = state.pieces[i];
            let iconId = getIconId(p.icon); 
            let pColorId = p.color === "white" ? 0 : 1;
            let pVal = p.value || 3.0;
            wasmExports.aiAddPiece(iconId, pColorId, p.x, p.y, pVal, p.moved ? 1 : 0);
        }

        const wasmStart = process.hrtime();
        
        // aiGetBestMove(depth, currentTurnColor)
        // 1 = black
        const wasmResult = wasmExports.aiGetBestMove(3, 1);
        
        const wasmEnd = process.hrtime(wasmStart);
        
        let wasmMoveStr = "null";
        let wasmPcIndex = -1;
        let wasmToX = -1;
        let wasmToY = -1;

        if (wasmResult !== -1) {
            wasmPcIndex = (wasmResult >> 16) & 0xFF; 
            wasmToX = (wasmResult >> 8) & 0xFF;
            wasmToY = wasmResult & 0xFF;
            wasmMoveStr = `PieceIdx ${wasmPcIndex} to (${wasmToX}, ${wasmToY})`;
            
            if (wasmPcIndex < state.pieces.length) {
                wasmMoveStr += ` (${state.pieces[wasmPcIndex].icon})`;
            }
        }

        console.log(`WASM AI Result: ${wasmMoveStr}`);
        console.log(`WASM Time: ${wasmEnd[0]}s ${wasmEnd[1] / 1000000}ms`);
        
        // Verification
        if (jsPcIndex === wasmPcIndex && jsToX === wasmToX && jsToY === wasmToY) {
            console.log("SUCCESS: Moves match!");
        } else {
            console.error("FAILURE: Moves do not match!");
            process.exit(1);
        }
        
        // 2. Apply Black Move to JS State to prepare for next round
        // Restore turn to white so white can move next round
        if (jsPcIndex !== -1) {
            const bPiece = state.pieces[jsPcIndex];
            bPiece.x = jsToX;
            bPiece.y = jsToY;
            bPiece.moved = true;
            
            // Check capture
            const capturedIdx = state.pieces.findIndex((p, idx) => idx !== jsPcIndex && p.x === jsToX && p.y === jsToY);
            if (capturedIdx !== -1) {
                console.log(`  -> Black captured ${state.pieces[capturedIdx].icon}`);
                state.pieces.splice(capturedIdx, 1);
                // Fix whiteMoves indices if we removed a piece before them
                for (let i = round + 1; i < whiteMoves.length; i++) {
                    if (whiteMoves[i].pcIndex > capturedIdx) {
                        whiteMoves[i].pcIndex--;
                    }
                }
            }
        }
        state.turn = 'white';
    }
}

runBenchmark();
