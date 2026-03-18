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
    
    while (!state.won && turns < turnLimit) {
        let isWhite = state.turn === 'white';
        let depth = isWhite ? charWhite.depth : charBlack.depth;
        let algorithm = isWhite ? charWhite.algorithm : charBlack.algorithm;
        if (!algorithm) algorithm = 'minimaxAlphaBeta'; // default
        
        let magnifiers = isWhite ? whiteMagnifiers : blackMagnifiers;
        let filters = isWhite ? whiteFilters : blackFilters;
        
        self.postMessage(JSONfn.stringify({ type: 'thinking', color: state.turn, turns: turns }));

        let move;
        if (algorithm === 'minimaxDeep') {
            move = minimaxDeep(state, state.turn, depth, [], magnifiers, filters);
        } else {
            // Note: In your code, `minimaxAlphaBeta` calls `alphaBetaOptimized`
            // So they are essentially the same for getting a move
            move = minimaxAlphaBeta(state, state.turn, depth, [], magnifiers, filters);
        }
        
        if (!move) {
            state.won = isWhite ? 'black' : 'white';
            break;
        }
        
        let piece = state.pieces[move.pieceCounter];
        state.pieceSelected = piece;
        playerMove({x: move.xClicked, y: move.yClicked}, state, true);
        
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
    
    self.postMessage(JSONfn.stringify({
        type: 'result',
        winner: state.won,
        turns: turns
    }));
});