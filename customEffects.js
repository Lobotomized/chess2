const conditions = {
    ifEmpty: function(state, piece, settings) {
        // Calculate direction based on piece color (so forward is relative)
        // Note: For white pieces, "forward" is generally decreasing Y (up the screen),
        // and for black pieces, "forward" is increasing Y (down the screen).
        // Since Y=0 is at the top of the board, standard movement logic usually treats:
        // White moving +Y as "backwards" or "down".
        // Let's match the standard convention used in animals.js where Black direction = 1, White direction = -1
        // OR we can explicitly define that "offsetY: 1" means "1 square forward relative to the piece's starting side".
        
        let directionY = -1; // Assuming White moves UP the board (decreasing Y)
        let directionX = 1;
        if (piece.color === 'black' && settings.flipForBlack !== false) {
            directionY = 1; // Black moves DOWN the board (increasing Y)
            directionX = -1; // Black's X is mirrored
        } 
        
        const targetX = piece.x + ((settings.offsetX || 0) * directionX);
        const targetY = piece.y + ((settings.offsetY || 0) * directionY);

        // Check if the target square exists on the board
        const squareExists = state.board.find(sq => sq.x === targetX && sq.y === targetY);
        if (!squareExists) return false;

        // Check if there is any piece on that target square
        const pieceOnSquare = state.pieces.find(p => p.x === targetX && p.y === targetY);
        
        // Return true only if no piece is there
        return !pieceOnSquare;
    },
    Rank: function(state, piece, settings) {
        // Calculate original starting position
        // When pieces are restored or parsed, they don't explicitly store their initial position natively,
        // but we can look it up from state.initialPieces if available, or infer from board size.
        // However, the cleanest way to measure "squares moved from start" without keeping complex history
        // is to compare current position against the initial position saved in state.
        
        let initialX, initialY;
        
        if (state.initialPieces) {
            // Find the original piece that corresponds to this one.
            // Since piece instances can be morphed or replaced, we might have to rely on ID if we added one,
            // or we just find the piece that started at this piece's exact starting location.
            // Since we need to know *this* piece's start location, and we might not have an ID,
            // the best way is to inject an initialX/initialY property onto custom pieces when they are created
            // in boardGeneration.js. Assuming that is done:
            
            initialX = piece.initialX !== undefined ? piece.initialX : piece.x;
            initialY = piece.initialY !== undefined ? piece.initialY : piece.y;
        } else {
            // Fallback if state.initialPieces isn't tracking it properly
            initialX = piece.initialX !== undefined ? piece.initialX : piece.x;
            initialY = piece.initialY !== undefined ? piece.initialY : piece.y;
        }

        const requiredRank = parseInt(settings.rank) || 0;
        const axis = settings.axis || 'Vertical';
        
        // Calculate the absolute distance moved from the starting position
        let distance = 0;
        if (axis === 'Vertical') {
            distance = Math.abs(piece.y - initialY);
        } else {
            distance = Math.abs(piece.x - initialX);
        }
        
        return distance >= requiredRank;
    }
};

const _ceUnitImages = {
    queenBugImage: "QueenBug.png",
    kingImage: "King.png",
    shroomImage: "Shroom.png",
    pawnImage: "Pawn.png",
    goliathBugImage: "GoliathBug.png",
    antImage: "Ant.png",
    knightImage: "Knight.png",
    rookImage: "Rook.png",
    queenImage: "Queen.png",
    bishopImage: "Bishop.png",
    dragonImage: "Dragon.png",
    ricarImage: "Ricar.png",
    horseImage: "Horse.png",
    ghostImage: "Ghost.png",
    hatImage: "Hat.png",
    clownImage: "Clown.png",
    pigImage: "Pig.png",
    ladyBugImage: "LadyBug.png",
    spiderImage: "Spider.png",
    swordsMenImage: "Swordsmen.png",
    northernKingImage: "NorthernKing.png",
    pikemanImage: "Pikeman.png",
    gargoyleImage: "Gargoyle.png",
    fencerImage: "Fencer.png",
    generalImage: "General.png",
    shieldImage: "Shield.png",
    plagueDoctorImage: "PlagueDoctor.png",
    starManImage: "StarMan.png",
    sleepingDragonImage: "SleepingDragon.png",
    cyborgImage: "Cyborg.png",
    crystalImage: "Crystal.png",
    empoweredCrystalImage: "CrystalEmpowered.png",
    executorImage: "Executor.png",
    juggernautImage: "Juggernaut.png",
    bootVesselImage: "Bootvessel.png",

    electricCatImage: "ElectricCat.png",
    longCatImage: "LongCat.png",
    scaryCatImage: "ScaryCat.png",
    blindCatImage: "BlindCat.png",
    fatCatImage: "FatCat.png",
    cuteCatImage: "CuteCat.png"
};

const effects = {
    spawn: function(state, piece, settings) {
        // Assume offsetY = 1 means "1 square forward"
        // White starts at bottom (high Y), so moving forward means decreasing Y (-1).
        // Black starts at top (low Y), so moving forward means increasing Y (+1).
        let directionY = -1;
        let directionX = 1;
        if (piece.color === 'black' && settings.flipForBlack !== false) {
            directionY = 1;
            directionX = -1;
        }
        
        const targetX = piece.x + ((settings.offsetX || 0) * directionX);
        const targetY = piece.y + ((settings.offsetY || 0) * directionY);
        
        // Piece type to spawn, passed in settings.pieceType (e.g., 'ghostFactory')
        const factoryName = settings.pieceType;
        
        let spawnedPiece;
        if (factoryName === 'customPiece' && settings.customDef) {
            // It's a custom piece
            let adjustedMoves = JSON.parse(JSON.stringify(settings.customDef.moves));
            if (piece.color === 'black') {
                adjustedMoves = adjustedMoves.map(move => {
                    if (move.y !== undefined) move.y = -move.y;
                    if (move.offsetY !== undefined) move.offsetY = -move.offsetY;
                    if (move.x !== undefined) move.x = -move.x;
                    if (move.offsetX !== undefined) move.offsetX = -move.offsetX;
                    return move;
                });
            }
            let finalIcon = '';
            if (settings.customDef.imageUrl) {
                if (piece.color === 'black' && settings.customDef.blackImageUrl) {
                    finalIcon = settings.customDef.blackImageUrl;
                } else {
                    finalIcon = settings.customDef.imageUrl;
                }
            } else {
                finalIcon = piece.color + (_ceUnitImages[settings.customDef.imageName] || settings.customDef.imageName);
            }

            spawnedPiece = {
                x: targetX,
                y: targetY,
                initialX: targetX,
                initialY: targetY,
                color: piece.color,
                moves: adjustedMoves,
                name: settings.customDef.name,
                icon: finalIcon,
                value: settings.customDef.value !== undefined ? settings.customDef.value : 3,
                posValue: settings.customDef.posValue !== undefined ? settings.customDef.posValue : 2,
                customDef: settings.customDef,
                isCustom: true,
                id: "spawned_" + Date.now() + "_" + Math.floor(Math.random() * 1000)
            };
        } else {
            const _globalObj = typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : global);
            const factoryFunc = _globalObj[factoryName];
            
            if (typeof factoryFunc === 'function') {
                spawnedPiece = factoryFunc(piece.color, targetX, targetY);
                spawnedPiece.initialX = targetX;
                spawnedPiece.initialY = targetY;
                if (!spawnedPiece.id) {
                    spawnedPiece.id = "spawned_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
                }
            } else {
                console.error(`customEffects spawn error: Factory function '${factoryName}' not found.`);
                return;
            }
        }
        
        // Re-apply custom effects logic if the spawned piece actually returned a custom piece definition.
        if (spawnedPiece.customDef) {
            const _globalObj = typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : global);
            if (typeof _globalObj.applyCustomEffects === 'function') {
                _globalObj.applyCustomEffects(spawnedPiece, spawnedPiece.customDef);
            } else if (typeof applyCustomEffects === 'function') {
                applyCustomEffects(spawnedPiece, spawnedPiece.customDef);
            }
        }
        
        state.pieces.push(spawnedPiece);
    },
    morph: function(state, piece, settings) {
        const factoryName = settings.pieceType;
        
        let newPiece;
        if (factoryName === 'customPiece' && settings.customDef) {
            let adjustedMoves = JSON.parse(JSON.stringify(settings.customDef.moves));
            if (piece.color === 'black') {
                adjustedMoves = adjustedMoves.map(move => {
                    if (move.y !== undefined) move.y = -move.y;
                    if (move.offsetY !== undefined) move.offsetY = -move.offsetY;
                    if (move.x !== undefined) move.x = -move.x;
                    if (move.offsetX !== undefined) move.offsetX = -move.offsetX;
                    return move;
                });
            }
            let finalIcon = '';
            if (settings.customDef.imageUrl) {
                if (piece.color === 'black' && settings.customDef.blackImageUrl) {
                    finalIcon = settings.customDef.blackImageUrl;
                } else {
                    finalIcon = settings.customDef.imageUrl;
                }
            } else {
                finalIcon = piece.color + (_ceUnitImages[settings.customDef.imageName] || settings.customDef.imageName);
            }

            newPiece = {
                x: piece.x,
                y: piece.y,
                initialX: piece.initialX,
                initialY: piece.initialY,
                color: piece.color,
                moves: adjustedMoves,
                name: settings.customDef.name,
                icon: finalIcon,
                value: settings.customDef.value !== undefined ? settings.customDef.value : 3,
                posValue: settings.customDef.posValue !== undefined ? settings.customDef.posValue : 2,
                isCustom: true,
                customDef: settings.customDef,
                id: piece.id || ("morphed_" + Date.now() + "_" + Math.floor(Math.random() * 1000))
            };
            // Note: morph intentionally removes customDef to prevent infinite loops (see original comment)
            // Wait, we need customDef to render custom pieces correctly. We shouldn't remove it entirely if it's a custom piece,
            // we just need to ensure the morph effect itself doesn't infinite loop. Let's keep it.
        } else {
            const _globalObj = typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : global);
            const factoryFunc = _globalObj[factoryName];
            
            if (typeof factoryFunc === 'function') {
                newPiece = factoryFunc(piece.color, piece.x, piece.y);
                newPiece.initialX = piece.initialX;
                newPiece.initialY = piece.initialY;
                newPiece.id = piece.id || ("morphed_" + Date.now() + "_" + Math.floor(Math.random() * 1000));
                delete newPiece.customDef;
            } else {
                console.error(`customEffects morph error: Factory function '${factoryName}' not found.`);
                return;
            }
        }
        
        // Replace the piece in state.pieces
        const index = state.pieces.indexOf(piece);
        if (index !== -1) {
            state.pieces[index] = newPiece;
        } else {
            state.pieces.push(newPiece);
        }
        
        if (state.pieceSelected === piece) {
            state.pieceSelected = newPiece;
        }
    },
    causeVictory: function(state, piece, settings) {
        console.log('wtf?')
        const param = settings.pieceType; // Re-using pieceType to store 'You' or 'Enemy'
        if (param === 'You') {
            state.won = piece.color;
        } else {
            state.won = piece.color === 'white' ? 'black' : 'white';
        }
        
        if (piece.options && typeof piece.options.gameEndedEvent === 'function') {
            piece.options.gameEndedEvent(state.won);
        }
        console.log(state)
    }
};

function applyCustomEffects(piece, customDef) {
    if (!customDef || !customDef.specialMoves) return;

    customDef.specialMoves.forEach(specialMove => {
        const hookName = specialMove.hook;
        // Support legacy single condition format or new array format
        const conditionsList = specialMove.condition ? (Array.isArray(specialMove.condition) ? specialMove.condition : [specialMove.condition]) : [];
        const effectDef = specialMove.effect;
        
        if (!hookName || !effectDef) return;
        
        // Save the original hook if the piece already has one
        const originalHook = piece[hookName];
        
        // Create a self-contained stringified function for JSONfn serialization
        // This avoids closure scope issues when the AI worker parses the state
        const wrapperString = `function(...args) {
            let state;
            if ('${hookName}' === 'afterEnemyPieceTaken') {
                state = args[1];
            } else {
                state = args[0];
            }

            let returnVal;
            if (typeof this._original_${hookName} === 'function') {
                returnVal = this._original_${hookName}(...args);
            }
            
            // Re-resolve condition and effect functions from global scope during evaluation
            // WebWorkers use 'self', Node uses 'global', Browsers use 'window'
            const _globalObj = typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : global);
            
            const conditionsList = ${JSON.stringify(conditionsList)};
            
            let allConditionsMet = true;
            for (const condDef of conditionsList) {
                const condFunc = _globalObj.conditions[condDef.name];
                if (condFunc) {
                    const result = condFunc(state, this, condDef.settings);
                    if (!result) {
                        allConditionsMet = false;
                        break;
                    }
                } else {
                    console.error("customEffects error: Condition function not found:", condDef.name);
                    allConditionsMet = false;
                    break;
                }
            }

            if (allConditionsMet) {
                const effFunc = _globalObj.effects['${effectDef.name}'];
                const effSettings = ${JSON.stringify(effectDef.settings)};
                if (effFunc) {
                    let effectReturn = effFunc(state, this, effSettings);
                    if (effectReturn !== undefined) returnVal = effectReturn;
                } else {
                    console.error("customEffects error: Effect function not found:", '${effectDef.name}');
                }
            }
                
            
            // For hooks like afterPieceMove that require a truthy return value to validate the move
            if (returnVal === undefined && '${hookName}' === 'afterPieceMove') {
                return true;
            }
            return returnVal;
        }`;

        // Assign the original hook to a hidden property so the eval'd string can access it
        if (typeof originalHook === 'function') {
            piece[`_original_${hookName}`] = originalHook;
        }

        // Evaluate the wrapper string into a real function and attach it
        piece[hookName] = eval('(' + wrapperString + ')');
    });
}

try {
    module.exports = {
        conditions,
        effects,
        applyCustomEffects
    };
} catch(err) {
    // Ignore in browser environment
}

const _globalEnv = typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : global);
if (_globalEnv) {
    _globalEnv.conditions = conditions;
    _globalEnv.effects = effects;
    _globalEnv.applyCustomEffects = applyCustomEffects;
}