importScripts('/src/jsonfn.js')
importScripts('/src/coreAlgorithms.js')
importScripts('/helperFunctions.js')
importScripts('/moveMethods.js')

importScripts('/pieces/classic.js')
importScripts('/pieces/bugs.js')
importScripts('/pieces/animals.js')
importScripts('/pieces/cats.js')
importScripts('/pieces/medieval.js')
importScripts('/pieces/machines.js')
importScripts('/pieces/rogueLike.js')
importScripts('/pieces/misc.js')

importScripts('/boardGeneration.js')

importScripts('/src/AI/general.js')
importScripts('/src/AI/magnifiers.js')
importScripts('/src/AI/filters.js')

function characterToMagnifiers(charConfig) {
    let mags = [];
    if (charConfig.posValueWeight !== undefined) {
        mags.push({ method: evaluationMagnifierMaxOptions, options: { posValue: charConfig.posValueWeight } });
    }
    if (charConfig.pieceValueWeight !== undefined) {
        mags.push({ method: evaluationMagnifierPiece, options: { pieceValue: charConfig.pieceValueWeight } });
    }
    if (charConfig.kingTropismWeight !== undefined) {
        mags.push({ method: evaluationMagnifierKingTropism, options: { relativeValue: charConfig.kingTropismWeight, onlyForEnemy: true, pieceValue: 1 } });
    }
    if (charConfig.defendedWeight !== undefined) {
        mags.push({ method: evaluationMagnifierPieceDefended, options: { relativeValue: charConfig.defendedWeight } });
    }
    if (charConfig.kingVulnAttackWeight !== undefined) {
        mags.push({ method: evaluationMagnifierKingVulnerability, options: { attackValue: charConfig.kingVulnAttackWeight, proximityValue: charConfig.kingVulnProxWeight || 0 } });
    }
    return mags;
}

function characterToFilters(charConfig) {
    let filters = [];
    if (charConfig.useRemoveAttacked) {
        let exceptions = [];
        if (charConfig.raRandomException) exceptions.push(randomException);
        if (charConfig.raExceptionPieceValue) exceptions.push(pieceValueMustBeBiggerThanException);
        if (charConfig.raExceptionPieceValueSmaller) exceptions.push(pieceValueMustBeSmallerThanException);
        filters.push({ method: removeAttackedMovesFilter, options: { randomException: charConfig.raRandomException || 0.1, minPieceValue: 3, maxPieceValue: 5, exceptions: exceptions } });
    }
    if (charConfig.useRemoveNonAttacking) {
        let exceptions = [];
        if (charConfig.rnaExceptionRandom) exceptions.push(randomException);
        if (charConfig.rnaExceptionPieceValue) exceptions.push(pieceValueMustBeBiggerThanException);
        if (charConfig.rnaExceptionPieceValueSmaller) exceptions.push(pieceValueMustBeSmallerThanException);
        filters.push({ method: removeNonAttackingMovesFilter, options: { maxPieceValue: charConfig.rnaMaxPieceValue || 2, minPieceValue: 3, randomException: charConfig.rnaExceptionRandom, exceptions: exceptions } });
    }
    if (charConfig.useRandomlyRemove) {
        let exceptions = [];
        if (charConfig.rrExceptionAttacked) exceptions.push(pieceAttackedException);
        if (charConfig.rrExceptionPieceValueSmaller) exceptions.push(pieceValueMustBeSmallerThanException);
        if (charConfig.rrExceptionRandom) exceptions.push(randomException);
        filters.push({ method: randomlyRemove1NthFilter, options: { n: charConfig.rrN || 2, maxPieceValue: 4, randomException: charConfig.rrExceptionRandom, exceptions: exceptions } });
    }
    if (charConfig.useMaxMoves) {
        let exceptions = [];
        if (charConfig.mmExceptionAttacked) exceptions.push(pieceAttackedException);
        filters.push({ method: maxNumberOfMovesPerPieceFilter, options: { maximum: charConfig.mmMax || 2, exceptions: exceptions } });
    }
    if (charConfig.useNthChance) {
        let exceptions = [];
        if (charConfig.ncExceptionAttacked) exceptions.push(pieceAttackedException);
        if (charConfig.ncExceptionPieceValue) exceptions.push(pieceValueMustBeBiggerThanException);
        filters.push({ method: nthChanceToRemovePieceFilter, options: { n: charConfig.nthChance !== undefined ? charConfig.nthChance : 0.1, minPieceValue: 3, exceptions: exceptions } });
    }
    if (charConfig.useRemoveWellPositioned) {
        let exceptions = [];
        if (charConfig.rwpExceptionAttacked) exceptions.push(pieceAttackedException);
        filters.push({ method: removeWellPositionedPiecesFilter, options: { n: charConfig.rwpN || 3, exceptions: exceptions } });
    }
    return filters;
}

self.addEventListener("message", function(e) {
    let data = JSONfn.parse(e.data);
    let charWhite = data.charWhite;
    let charBlack = data.charBlack;
    let whiteRace = data.whiteRace;
    let blackRace = data.blackRace;
    
    let state = {
        pieces: [],
        board: [],
        turn: 'white',
        won: false
    };
    
    try {
        raceChoiceChess(state, whiteRace, blackRace);
    } catch(err) {
        // Fallback or ignore
    }
    
    let whiteMagnifiers = characterToMagnifiers(charWhite);
    let blackMagnifiers = characterToMagnifiers(charBlack);
    
    let whiteFilters = characterToFilters(charWhite);
    let blackFilters = characterToFilters(charBlack);

    let turnLimit = 100; // 50 turns per side
    let turns = 0;
    let movesHistory = [];
    
    while (!state.won && turns < turnLimit) {
        let isWhite = state.turn === 'white';
        let depth = isWhite ? charWhite.depth : charBlack.depth;
        if (!depth) depth = 2; // Default depth if undefined
        let algorithm = isWhite ? charWhite.algorithm : charBlack.algorithm;
        if (!algorithm) algorithm = 'minimaxAlphaBeta'; // default
        
        let phases = isWhite ? charWhite.phases : charBlack.phases;
        let numPieces = state.pieces.length;
        
        // Base config references
        let currentDepth = depth;
        let currentMags = isWhite ? whiteMagnifiers : blackMagnifiers;
        let currentFilters = isWhite ? whiteFilters : blackFilters;
        
        // Handle legacy altAlgorithm
        if (!phases && (isWhite ? charWhite.altAlgorithm : charBlack.altAlgorithm)) {
             let altAlg = isWhite ? charWhite.altAlgorithm : charBlack.altAlgorithm;
             let altThresh = isWhite ? charWhite.altPieceThreshold : charBlack.altPieceThreshold;
             phases = [{threshold: altThresh || 10, algorithm: altAlg}];
        }
        
        if (phases && phases.length > 0) {
            for(let i=0; i<phases.length; i++) {
                if (numPieces <= phases[i].threshold) {
                    // Update current configuration from phase settings
                    if (phases[i].algorithm) algorithm = phases[i].algorithm;
                    if (phases[i].depth) currentDepth = phases[i].depth;
                    
                    // Rebuild Magnifiers based on phase overrides
                    // If phase has magnifier weights, we rebuild the whole array.
                    // If not, we keep the previous/base magnifiers.
                    if (phases[i].posValueWeight !== undefined || 
                        phases[i].pieceValueWeight !== undefined ||
                        phases[i].kingTropismWeight !== undefined || 
                        phases[i].defendedWeight !== undefined || 
                        phases[i].kingVulnAttackWeight !== undefined) {
                        
                        let pConfig = phases[i];
                        let newMags = [];
                        
                        let pvw = pConfig.posValueWeight;
                        if(pvw === undefined) pvw = isWhite ? charWhite.posValueWeight : charBlack.posValueWeight;
                        if(pvw !== undefined) newMags.push({ method: evaluationMagnifierMaxOptions, options: { posValue: pvw } });
                        
                        let pcv = pConfig.pieceValueWeight;
                        if(pcv === undefined) pcv = isWhite ? charWhite.pieceValueWeight : charBlack.pieceValueWeight;
                        if(pcv !== undefined) newMags.push({ method: evaluationMagnifierPiece, options: { pieceValue: pcv } });
                        
                        let ktv = pConfig.kingTropismWeight;
                        if(ktv === undefined) ktv = isWhite ? charWhite.kingTropismWeight : charBlack.kingTropismWeight;
                        if(ktv !== undefined) newMags.push({ method: evaluationMagnifierKingTropism, options: { relativeValue: ktv, onlyForEnemy: true, pieceValue: 1 } });
                        
                        let def = pConfig.defendedWeight;
                        if(def === undefined) def = isWhite ? charWhite.defendedWeight : charBlack.defendedWeight;
                        if(def !== undefined) newMags.push({ method: evaluationMagnifierPieceDefended, options: { relativeValue: def } });
                        
                        let kva = pConfig.kingVulnAttackWeight;
                        let kvp = pConfig.kingVulnProxWeight;
                        if(kva === undefined) kva = isWhite ? charWhite.kingVulnAttackWeight : charBlack.kingVulnAttackWeight;
                        if(kvp === undefined) kvp = isWhite ? charWhite.kingVulnProxWeight : charBlack.kingVulnProxWeight;
                        if(kva !== undefined) newMags.push({ method: evaluationMagnifierKingVulnerability, options: { attackValue: kva, proximityValue: kvp || 0 } });
                        
                        currentMags = newMags;
                    } else if (phases[i].weights) {
                        // Legacy support for the brief period where we used 'weights' object
                        let w = phases[i].weights;
                        let newMags = [];
                        let pvw = w.pos !== undefined ? w.pos : (isWhite ? charWhite.posValueWeight : charBlack.posValueWeight);
                        let pcv = w.piece !== undefined ? w.piece : (isWhite ? charWhite.pieceValueWeight : charBlack.pieceValueWeight);
                        let ktv = w.kingTrop !== undefined ? w.kingTrop : (isWhite ? charWhite.kingTropismWeight : charBlack.kingTropismWeight);
                        let def = w.def !== undefined ? w.def : (isWhite ? charWhite.defendedWeight : charBlack.defendedWeight);
                        let kva = w.vulnAtt !== undefined ? w.vulnAtt : (isWhite ? charWhite.kingVulnAttackWeight : charBlack.kingVulnAttackWeight);
                        let kvp = w.vulnProx !== undefined ? w.vulnProx : (isWhite ? charWhite.kingVulnProxWeight : charBlack.kingVulnProxWeight);
                        
                        if (pvw !== undefined) newMags.push({ method: evaluationMagnifierMaxOptions, options: { posValue: pvw } });
                        if (pcv !== undefined) newMags.push({ method: evaluationMagnifierPiece, options: { pieceValue: pcv } });
                        if (ktv !== undefined) newMags.push({ method: evaluationMagnifierKingTropism, options: { relativeValue: ktv, onlyForEnemy: true, pieceValue: 1 } });
                        if (def !== undefined) newMags.push({ method: evaluationMagnifierPieceDefended, options: { relativeValue: def } });
                        if (kva !== undefined) newMags.push({ method: evaluationMagnifierKingVulnerability, options: { attackValue: kva, proximityValue: kvp || 0 } });
                        
                        currentMags = newMags;
                    }
                    
                    // Rebuild Filters based on phase overrides
                    // If the phase has ANY filter flags set to true, we rebuild the filter list from that phase config
                    // Otherwise we check for legacy 'filters' array support
                    // Note: This logic implies that if you set ANY filter in a phase, you must set ALL filters you want for that phase.
                    // It does NOT merge with base filters (which is usually safer to avoid duplicates).
                    
                    let p = phases[i];
                    if (p.useRemoveAttacked || p.useRemoveNonAttacking || p.useRandomlyRemove || p.useMaxMoves || p.useNthChance || p.useRemoveWellPositioned) {
                        let newFilters = [];
                        if (p.useRemoveAttacked) {
                            let exceptions = [];
                            if (p.raRandomException) exceptions.push(randomException);
                            if (p.raExceptionPieceValue) exceptions.push(pieceValueMustBeBiggerThanException);
                            if (p.raExceptionPieceValueSmaller) exceptions.push(pieceValueMustBeSmallerThanException);
                            newFilters.push({ method: removeAttackedMovesFilter, options: { randomException: p.raRandomException || 0.1, minPieceValue: 3, maxPieceValue: 5, exceptions: exceptions } });
                        }
                        if (p.useRemoveNonAttacking) {
                            let exceptions = [];
                            if (p.rnaExceptionRandom) exceptions.push(randomException);
                            if (p.rnaExceptionPieceValue) exceptions.push(pieceValueMustBeBiggerThanException);
                            if (p.rnaExceptionPieceValueSmaller) exceptions.push(pieceValueMustBeSmallerThanException);
                            newFilters.push({ method: removeNonAttackingMovesFilter, options: { maxPieceValue: p.rnaMaxPieceValue || 2, minPieceValue: 3, randomException: p.rnaExceptionRandom, exceptions: exceptions } });
                        }
                        if (p.useRandomlyRemove) {
                            let exceptions = [];
                            if (p.rrExceptionAttacked) exceptions.push(pieceAttackedException);
                            if (p.rrExceptionPieceValueSmaller) exceptions.push(pieceValueMustBeSmallerThanException);
                            if (p.rrExceptionRandom) exceptions.push(randomException);
                            newFilters.push({ method: randomlyRemove1NthFilter, options: { n: p.rrN || 2, maxPieceValue: 4, randomException: p.rrExceptionRandom, exceptions: exceptions } });
                        }
                        if (p.useMaxMoves) {
                            let exceptions = [];
                            if (p.mmExceptionAttacked) exceptions.push(pieceAttackedException);
                            newFilters.push({ method: maxNumberOfMovesPerPieceFilter, options: { maximum: p.mmMax || 2, exceptions: exceptions } });
                        }
                        if (p.useNthChance) {
                            let exceptions = [];
                            if (p.ncExceptionAttacked) exceptions.push(pieceAttackedException);
                            if (p.ncExceptionPieceValue) exceptions.push(pieceValueMustBeBiggerThanException);
                            newFilters.push({ method: nthChanceToRemovePieceFilter, options: { n: p.nthChance !== undefined ? p.nthChance : 0.1, minPieceValue: 3, exceptions: exceptions } });
                        }
                        if (p.useRemoveWellPositioned) {
                            let exceptions = [];
                            if (p.rwpExceptionAttacked) exceptions.push(pieceAttackedException);
                            newFilters.push({ method: removeWellPositionedPiecesFilter, options: { n: p.rwpN || 3, exceptions: exceptions } });
                        }
                        currentFilters = newFilters;
                    } else if (p.filters && p.filters.length > 0) {
                         // Legacy string array support
                         // ... (existing code for string array)
                         // For now we can rely on the previous implementation for this part if needed, 
                         // but ideally we just use the full object structure now.
                    }
                    
                } else {
                    break; 
                }
            }
        }
        
        self.postMessage(JSONfn.stringify({ type: 'thinking', color: state.turn, turns: turns }));

        let move;
        if (algorithm === 'minimaxDeep') {
            move = minimaxDeep(state, state.turn, currentDepth, [], currentMags, currentFilters);
        } else if (algorithm === 'minimaxQuiescence') {
            move = minimaxQuiescence(state, state.turn, currentDepth, [], currentMags, currentFilters);
        } else if (algorithm === 'proofNumberSearch') {
            move = proofNumberSearch(state, state.turn, currentDepth, [], currentMags, currentFilters);
        } else if (algorithm === 'bestFirstSearch') {
            move = bestFirstSearch(state, state.turn, currentDepth, [], currentMags, currentFilters);
        } else {
            move = minimaxAlphaBeta(state, state.turn, currentDepth, [], currentMags, currentFilters);
        }
        
        if (!move) {
            state.won = isWhite ? 'black' : 'white';
            break;
        }
        
        // Store before moving
        let myPieces = state.pieces.filter(p => p.color === state.turn);
        let movedPiece = myPieces[move.pieceCounter];
        
        if (!movedPiece) {
            // Failsafe in case of mismatch
            state.won = isWhite ? 'black' : 'white';
            break;
        }

        let fromX = movedPiece.x;
        let fromY = movedPiece.y;
        
        state.pieceSelected = movedPiece;
        playerMove({x: move.xClicked, y: move.yClicked}, state, true);
        
        movesHistory.push({
            color: state.turn,
            from: {x: fromX, y: fromY},
            pieceIndex: move.pieceCounter,
            to: {x: move.xClicked, y: move.yClicked}
        });

        if (checkRemi(state)) {
            state.won = 'tie';
            break;
        }
        
        for (let i = state.pieces.length - 1; i >= 0; i--) {
            if(state.pieces[i].color !== state.turn){
                if (state.pieces[i].afterEnemyPlayerMove) {
                    state.pieces[i].afterEnemyPlayerMove(state, {x: move.xClicked, y: move.yClicked});
                }
            }
        }
        
        changeTurn(state);
        turns++;
    }
    
    if (!state.won) {
        state.won = 'tie';
    }
    
    // Store game history if it was an evolution match
    // Note: worker can't save to DB directly, so we pass data back to main thread
    
    self.postMessage(JSONfn.stringify({
        type: 'result',
        winner: state.won,
        turns: turns,
        history: {
            whiteId: charWhite.id,
            blackId: charBlack.id,
            whiteRace: whiteRace,
            blackRace: blackRace,
            winner: state.won,
            turns: turns,
            moves: movesHistory 
        }
    }));
});