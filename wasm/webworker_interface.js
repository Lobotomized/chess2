let wasmExports = null;
let wasmMemory = null;

function readString(ptr) {
    if (!wasmMemory) return "(memory not set)";
    try {
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
    } catch (e) {
        return `(error reading string at ${ptr})`;
    }
}

let wasmReadyPromise = fetch('/wasm/build/release.wasm?v=' + Date.now())
    .then(response => {
        console.log("Wasm fetch response:", response.status);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.arrayBuffer();
    })
    .then(bytes => {
        console.log("Wasm bytes loaded, instantiating...");
        return WebAssembly.instantiate(bytes, {
            env: {
                abort: (msg, file, line, col) => console.error(`Wasm aborted: ${readString(msg)} at ${readString(file)}:${line}:${col}`),
                trace: (msg, n, args) => console.log(`Wasm trace: ${readString(msg)}`),
                "console.log": (msg) => console.log(`Wasm log!: ${readString(msg)}`),
                seed: () => Math.random()
            }
        });
    })
    .then(results => {
        console.log("Wasm instantiated successfully");
        wasmExports = results.instance.exports;
        wasmMemory = wasmExports.memory;
        return wasmExports;
    })
    .catch(err => console.error("Failed to load Wasm AI module:", err));

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

function callWasmAI(obj) {
    if (!wasmExports) {
        console.warn("Wasm AI not loaded yet, falling back to JS");
        return null;
    }

    const { state, color, AIPower } = obj;
    
    const turnId = state.turn === "white" ? 0 : 1;
    const wonId = state.won === "white" ? 0 : (state.won === "black" ? 1 : 2);
    const colorId = color === "white" ? 0 : 1;

    // Init state
    wasmExports.aiInitState(turnId, wonId);

    // Add board squares
    if (state.board) {
        for (let i = 0; i < state.board.length; i++) {
            let sq = state.board[i];
            wasmExports.aiAddSquare(sq.x, sq.y, sq.light ? 1 : 0, sq.special ? 1 : 0);
        }
    }

    // Add pieces
    if (state.pieces) {
        for (let i = 0; i < state.pieces.length; i++) {
            let p = state.pieces[i];
            let iconId = getIconId(p.icon);
            // Only add pieces that are strictly white or black to align with JS indexing
            if (p.color === "white" || p.color === "black") {
                let pColorId = p.color === "white" ? 0 : 1;
                let pVal = p.value || 3.0;
                wasmExports.aiAddPiece(iconId, pColorId, p.x, p.y, pVal, p.moved ? 1 : 0);
            }
        }
    }

    // Determine depth based on AIPower
    let depth = 2;
    if (AIPower === 104) depth = state.pieces.length < 8 ? 4 : 3;
    else if (AIPower === 106) depth = state.pieces.length < 8 ? 5 : (state.pieces.length < 16 ? 4 : 3);
    else if (AIPower === 107) depth = 4//state.pieces.length < 8 ? 6 : (state.pieces.length < 16 ? 5 : 3);
    else if (AIPower >= 5) depth = 3;

    // Call Wasm minimax
    console.time('WasmAI');
    // console.log(`Calling aiGetBestMove with depth ${depth} and colorId ${colorId}`);
    let result = wasmExports.aiGetBestMove(depth, colorId);
    console.log(result, '  result')
    // console.log("aiGetBestMove returned:", result);
    console.timeEnd('WasmAI');

    if (result === -1) return null;

    let pieceCounter = (result >> 16) & 0xFF;
    let xClicked = (result >> 8) & 0xFF;
    let yClicked = result & 0xFF;

    return {
        pieceCounter: pieceCounter,
        xClicked: xClicked,
        yClicked: yClicked,
        removedTurns: obj.removedTurns
    };
}
