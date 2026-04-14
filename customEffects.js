const conditions = {
    ifEmpty: function(state, piece, settings) {
        // Calculate direction based on piece color (so forward is relative)
        // Note: For white pieces, "forward" is generally decreasing Y (up the screen),
        // and for black pieces, "forward" is increasing Y (down the screen).
        // Since Y=0 is at the top of the board, standard movement logic usually treats:
        // White moving +Y as "backwards" or "down".
        // Let's match the standard convention used in animals.js where Black direction = 1, White direction = -1
        // OR we can explicitly define that "offsetY: 1" means "1 square forward relative to the piece's starting side".
        
        let direction = -1; // Assuming White moves UP the board (decreasing Y)
        if (piece.color === 'black' && settings.flipForBlack !== false) {
            direction = 1; // Black moves DOWN the board (increasing Y)
        }
        
        const targetX = piece.x + (settings.offsetX || 0);
        const targetY = piece.y + ((settings.offsetY || 0) * direction);

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

const effects = {
    spawn: function(state, piece, settings) {
        // Assume offsetY = 1 means "1 square forward"
        // White starts at bottom (high Y), so moving forward means decreasing Y (-1).
        // Black starts at top (low Y), so moving forward means increasing Y (+1).
        let direction = -1;
        if (piece.color === 'black' && settings.flipForBlack !== false) {
            direction = 1;
        }
        
        const targetX = piece.x + (settings.offsetX || 0);
        const targetY = piece.y + ((settings.offsetY || 0) * direction);
        
        // Piece type to spawn, passed in settings.pieceType (e.g., 'ghostFactory')
        const factoryName = settings.pieceType;
        const _globalObj = typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : global);
        const factoryFunc = _globalObj[factoryName];
        
        if (typeof factoryFunc === 'function') {
            const spawnedPiece = factoryFunc(piece.color, targetX, targetY);
            
            // Ensure the spawned piece gets tracked correctly
            // Important for logic calculating distances and preventing tracking bugs
            spawnedPiece.initialX = targetX;
            spawnedPiece.initialY = targetY;
            
            // Also ensure it gets a unique ID if it needs one so find functions don't get confused
            if (!spawnedPiece.id) {
                spawnedPiece.id = "spawned_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
            }
            
            // Re-apply custom effects logic if the spawned piece factory actually returned
            // a custom piece definition. (Most standard factories don't have customDef).
            if (spawnedPiece.customDef && typeof _globalObj.applyCustomEffects === 'function') {
                _globalObj.applyCustomEffects(spawnedPiece, spawnedPiece.customDef);
            }
            
            state.pieces.push(spawnedPiece);
        } else {
            console.error(`customEffects spawn error: Factory function '${factoryName}' not found.`);
        }
    },
    morph: function(state, piece, settings) {
        const factoryName = settings.pieceType;
        const _globalObj = typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : global);
        const factoryFunc = _globalObj[factoryName];
        
        if (typeof factoryFunc === 'function') {
            const newPiece = factoryFunc(piece.color, piece.x, piece.y);
            
            // Retain tracked values
            newPiece.initialX = piece.initialX;
            newPiece.initialY = piece.initialY;
            newPiece.id = piece.id || ("morphed_" + Date.now() + "_" + Math.floor(Math.random() * 1000));
            
            // Delete customDef to prevent infinite loop recursion (e.g. morphing into Queen every turn on rank 8)
            delete newPiece.customDef;
            
            // Replace the piece in state.pieces
            const index = state.pieces.indexOf(piece);
            if (index !== -1) {
                state.pieces[index] = newPiece;
            } else {
                state.pieces.push(newPiece);
            }
            
            // Immediately execute the hook on the new piece if it has one
            // so things like checkmate detection can fire off the new piece
            // This happens naturally if it replaces the piece, but we need to ensure the old piece
            // stops processing its turn if needed.
            
            // If this piece was the selected one (e.g. the one the player just moved)
            if (state.pieceSelected === piece) {
                state.pieceSelected = newPiece;
            }
        } else {
            console.error(`customEffects morph error: Factory function '${factoryName}' not found.`);
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
        const wrapperString = `function(state, ...args) {
            let returnVal;
            if (typeof this._original_${hookName} === 'function') {
                returnVal = this._original_${hookName}(state, ...args);
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
                    effFunc(state, this, effSettings);
                } else {
                    console.error("customEffects error: Effect function not found:", '${effectDef.name}');
                }
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