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

try {
    const buffer = fs.readFileSync(wasmPath);
    let wasmMemory = null;
    WebAssembly.instantiate(buffer, {
        env: {
            abort: (msg, file, line, col) => console.error(`Wasm aborted: ${readString(wasmMemory, msg)} at ${readString(wasmMemory, file)}:${line}:${col}`),
            trace: (msg, n, args) => console.log(`Wasm trace: ${readString(wasmMemory, msg)}`),
            "console.log": (msg) => console.log(`Wasm log: ${readString(wasmMemory, msg)}`),
            seed: () => Math.random()
        }
    }).then(results => {
        const exports = results.instance.exports;
        wasmMemory = exports.memory;
        
        console.log("Wasm instantiated successfully. Running test...");
        
        // Init state: white turn, no one won
        exports.aiInitState(0, 2);
        
        // Add board squares (3x3 board for simplicity)
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                exports.aiAddSquare(x, y, 0, 0); // Not light, not special
            }
        }
        
        // Add a White Knight at 0, 0
        // Icon ID for Knight is 1. Color white is 0.
        exports.aiAddPiece(1, 0, 0, 0, 3.0, 0); // Knight
        
        // Add a Black Pawn at 2, 2
        // Icon ID for Pawn is 0. Color black is 1.
        exports.aiAddPiece(0, 1, 2, 2, 1.0, 0); // Pawn
        
        console.log("Calling aiGetBestMove...");
        let result = exports.aiGetBestMove(2, 0); // depth 2, white
        console.log("Result:", result);
        
        if (result === -1) {
            console.error("Test FAILED: returned -1 (no best move found).");
        } else {
            let pc = (result >> 16) & 0xFF;
            let x = (result >> 8) & 0xFF;
            let y = result & 0xFF;
            console.log(`Test PASSED: best move is Piece ${pc} -> (${x}, ${y})`);
        }
    }).catch(err => {
        console.error("Instantiation failed:", err);
    });
} catch (err) {
    console.error("Failed to read file:", err);
}
