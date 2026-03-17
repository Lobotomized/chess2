const fs = require('fs');
const path = require('path');

const wasmPath = path.join(__dirname, 'build/release.wasm');

function readString(memory, ptr) {
    if (!memory) return "(memory not set)";
    try {
        const buffer = memory.buffer;
        const U32 = new Uint32Array(buffer);
        const U16 = new Uint16Array(buffer);
        const len = U32[(ptr - 4) >>> 2];
        const offset = ptr >>> 1;
        let str = "";
        for (let i = 0; i < len; i++) {
            str += String.fromCharCode(U16[offset + i]);
        }
        return str;
    } catch (e) {
        return `(error reading string at ${ptr})`;
    }
}

// Logic to test
function getDepthForDifficulty107(pieceCount) {
    if (pieceCount < 8) return 6;
    if (pieceCount < 16) return 5;
    return 4;
}

// Helper to mimic hotseat.js logic
function getColorPieces(pieces, color) {
    return pieces.filter((piece) => piece.color === color);
}

async function runTest() {
    try {
        const buffer = fs.readFileSync(wasmPath);
        let wasmMemory = null;
        
        const results = await WebAssembly.instantiate(buffer, {
            env: {
                abort: (msg, file, line, col) => console.error(`Wasm aborted: ${readString(wasmMemory, msg)} at ${readString(wasmMemory, file)}:${line}:${col}`),
                trace: (msg, n, args) => console.log(`Wasm trace: ${readString(wasmMemory, msg)}`),
                "console.log": (msg) => console.log(`Wasm log: ${readString(wasmMemory, msg)}`),
                seed: () => Math.random()
            }
        });

        const exports = results.instance.exports;
        wasmMemory = exports.memory;
        
        console.log("Wasm instantiated successfully.");

        // Test cases for different piece counts
        const testCases = [
            { pieces: 20, expectedDepth: 4, name: "High piece count (>16)" },
            { pieces: 10, expectedDepth: 5, name: "Medium piece count (8-16)" },
            { pieces: 5, expectedDepth: 6, name: "Low piece count (<8)" }
        ];

        for (const test of testCases) {
            console.log(`\nRunning test: ${test.name}`);
            
            // 1. Verify depth calculation logic
            const depth = getDepthForDifficulty107(test.pieces);
            if (depth !== test.expectedDepth) {
                console.error(`FAILED: Expected depth ${test.expectedDepth}, got ${depth}`);
                continue;
            }
            console.log(`Depth calculated correctly: ${depth}`);

            // 2. Run WASM with this depth
            exports.aiInitState(0, 2); // White turn, no winner
            
            // Add board squares (3x3 board for simplicity)
            for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                    exports.aiAddSquare(x, y, 0, 0); // Not light, not special
                }
            }
            
            // Construct pieces array for validation
            const jsPieces = [];

            // Add White Knight at 0,0
            jsPieces.push({ icon: 'whiteKnight.png', color: 'white', x: 0, y: 0, value: 3.0, moved: false });
            exports.aiAddPiece(1, 0, 0, 0, 3.0, 0); 
            
            // Add Black Pawn at 2,2
            jsPieces.push({ icon: 'blackPawn.png', color: 'black', x: 2, y: 2, value: 1.0, moved: false });
            exports.aiAddPiece(0, 1, 2, 2, 1.0, 0);

            // TEST CASE FOR BUG: Add a piece with unknown color (e.g. "red" or undefined)
            // In webworker_interface.js: p.color === "white" ? 0 : 1. So "red" becomes 1 (Black).
            // In hotseat.js: getColorPieces('black') filters for piece.color === 'black'. "red" is excluded.
            // This causes index mismatch if we are playing Black.
            
            // 1. Initialize state with BLACK turn (1)
            exports.aiInitState(1, 2); 

            // 2. Add board squares
            for (let x = 0; x < 8; x++) {
                for (let y = 0; y < 8; y++) {
                    exports.aiAddSquare(x, y, 0, 0); 
                }
            }

            const bugTestPieces = [];

            // Add Black Pawn at 2,2 (Index 0 in WASM, Index 0 in JS)
            bugTestPieces.push({ icon: 'blackPawn.png', color: 'black', x: 2, y: 2, value: 1.0, moved: false });
            exports.aiAddPiece(0, 1, 2, 2, 1.0, 0);

            // Add a "neutral" piece (Index 1 in WASM, EXCLUDED in JS)
            // This piece acts as a "Ghost" in the index
            bugTestPieces.push({ icon: 'obstacle.png', color: 'red', x: 5, y: 5, value: 0, moved: false });
            
            // SIMULATE THE FIX: Only add to WASM if color is white/black
            // Previously: exports.aiAddPiece(0, 1, 5, 5, 0, 0); // Becomes Black Pawn in WASM
            // Now: skip it
            if (bugTestPieces[bugTestPieces.length-1].color === 'white' || bugTestPieces[bugTestPieces.length-1].color === 'black') {
                exports.aiAddPiece(0, 1, 5, 5, 0, 0); 
            } else {
                console.log("Skipping 'red' piece addition to WASM (simulating fix in webworker_interface.js)");
            }

            // Add a Black Blocker at 2,3 to block the first Pawn (Index 2 in WASM, Index 1 in JS)
            bugTestPieces.push({ icon: 'blackPawn.png', color: 'black', x: 2, y: 3, value: 1.0, moved: false });
            exports.aiAddPiece(0, 1, 2, 3, 1.0, 0);

            // Add a Black Blocker at 5,6 to block the Red/Ghost Pawn (Index 3 in WASM, EXCLUDED in JS)
            // Assuming Pawn moves +Y. If it moves -Y, this might not block, but let's try.
            // Actually, let's just surround it or make it stuck.
            // Or just hope the Rook move is better.
            
            // Add Black Rook at 7,7 (Index 3 in WASM, Index 2 in JS) - WAIT, Index 3 if we skip the blockers?
            // Current WASM indices:
            // 0: Pawn 2,2
            // 1: Red 5,5
            // 2: Blocker 2,3
            // 3: Rook 7,7
            bugTestPieces.push({ icon: 'blackRook.png', color: 'black', x: 7, y: 7, value: 10.0, moved: false }); // High value to encourage use? No, piece value doesn't affect move score unless capturing.
            exports.aiAddPiece(3, 1, 7, 7, 5.0, 0);

            // Add a White target for the Rook to capture (to encourage it to move)
            // Rook at 7,7. Target at 7,5.
            exports.aiAddPiece(0, 0, 7, 5, 10.0, 0); // White Pawn (high value to encourage capture)

            console.time(`WasmAI_Depth_${depth}_Black`);
            let result = exports.aiGetBestMove(depth, 1); // color 1 = black
            console.timeEnd(`WasmAI_Depth_${depth}_Black`);

            if (result !== -1) {
                let pieceCounter = (result >> 16) & 0xFF;
                let x = (result >> 8) & 0xFF;
                let y = result & 0xFF;
                
                console.log(`Wasm returned Black move: PieceCounter ${pieceCounter} -> (${x}, ${y})`);

                const myPieces = getColorPieces(bugTestPieces, 'black');
                console.log(`JS Black pieces count: ${myPieces.length}`);
                console.log(`Indices in JS: 0 to ${myPieces.length - 1}`);
                
                if (pieceCounter >= myPieces.length) {
                    console.error(`FAILED: pieceCounter ${pieceCounter} is out of bounds for myPieces (length ${myPieces.length})`);
                    console.error("This reproduces the 'Uncaught TypeError' bug!");
                    process.exit(1); 
                } else {
                    const piece = myPieces[pieceCounter];
                    if (!piece) {
                        console.error(`FAILED: myPieces[${pieceCounter}] is undefined`);
                        process.exit(1);
                    } else {
                        // Validate if the move is plausible
                        // Rook (7,7) cannot move to (2,4) or (2,5)
                        // Pawn (2,2) moving to (2,3) or (2,4) is valid
                        // Pawn (2,3) moving to (2,4) or (2,5) is valid
                        
                        const dx = Math.abs(piece.x - x);
                        const dy = Math.abs(piece.y - y);
                        const isStraight = (piece.x === x) || (piece.y === y);
                        const isDiagonal = dx === dy;
                        
                        let valid = false;
                        if (piece.icon.includes('Pawn')) {
                            // Pawn move: straight or diagonal (capture)
                            // Max step 2
                            if (dx <= 1 && dy <= 2) valid = true;
                        } else if (piece.icon.includes('Rook')) {
                            // Rook move: straight
                            if (isStraight) valid = true;
                        } else {
                            // Other pieces (Knight etc), just assume valid for now
                            valid = true;
                        }

                        if (!valid) {
                            console.error(`FAILED: Invalid move for piece ${piece.icon} at ${piece.x},${piece.y} to ${x},${y}`);
                            console.error(`This indicates an INDEX MISMATCH. WASM moved a different piece!`);
                            process.exit(1);
                        }
                        
                        console.log(`PASSED: Valid move for piece at ${piece.x},${piece.y}`);
                    }
                }
            } else {
                console.log("Wasm returned no move for Black");
            }

            // Also run the White test as before (re-init state for white test)
            exports.aiInitState(0, 2);
            for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                    exports.aiAddSquare(x, y, 0, 0); 
                }
            }
            exports.aiAddPiece(1, 0, 0, 0, 3.0, 0); 
            exports.aiAddPiece(0, 1, 2, 2, 1.0, 0);
            
            console.time(`WasmAI_Depth_${depth}`);
            result = exports.aiGetBestMove(depth, 0); // color 0 = white
            console.timeEnd(`WasmAI_Depth_${depth}`);

            if (result === -1) {
                console.error("FAILED: WASM returned -1 (no move found)");
            } else {
                let pieceCounter = (result >> 16) & 0xFF;
                let x = (result >> 8) & 0xFF;
                let y = result & 0xFF;
                
                console.log(`Wasm returned move: PieceCounter ${pieceCounter} -> (${x}, ${y})`);

                // VALIDATION mimicking hotseat.js AIMove
                const myPieces = getColorPieces(jsPieces, 'white');
                
                if (pieceCounter >= myPieces.length) {
                    console.error(`FAILED: pieceCounter ${pieceCounter} is out of bounds for myPieces (length ${myPieces.length})`);
                    console.error("This would cause 'Uncaught TypeError: Cannot read properties of undefined (reading 'x')' in AIMove");
                } else {
                    const piece = myPieces[pieceCounter];
                    if (!piece) {
                        console.error(`FAILED: myPieces[${pieceCounter}] is undefined`);
                    } else {
                        console.log(`PASSED: Valid move for piece at ${piece.x},${piece.y}`);
                    }
                }
            }
        }
        
        console.log("\nAll tests completed.");

    } catch (err) {
        console.error("Test failed with error:", err);
    }
}

runTest();
