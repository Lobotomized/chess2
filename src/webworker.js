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

importScripts('/src/AI/general.js')

importScripts('/src/AI/magnifiers.js')
importScripts('/src/AI/filters.js')


function buildMagsFromLegacy(charConfig) {
    let mags = [];
    if(charConfig.posValueWeight !== undefined) mags.push({name:'MaxOptions', options:{posValue:charConfig.posValueWeight, useMask:true}});
    if(charConfig.pieceValueWeight !== undefined) mags.push({name:'Piece', options:{pieceValue:charConfig.pieceValueWeight}});
    if(charConfig.kingTropismWeight !== undefined) mags.push({name:'KingTropism', options:{relativeValue:charConfig.kingTropismWeight, onlyForEnemy:true, pieceValue:1}});
    if(charConfig.defendedWeight !== undefined) mags.push({name:'PieceDefended', options:{relativeValue:charConfig.defendedWeight}});
    if(charConfig.kingVulnAttackWeight !== undefined) mags.push({name:'KingVulnerability', options:{attackValue:charConfig.kingVulnAttackWeight, proximityValue:charConfig.kingVulnProxWeight||0}});
    return mags;
}

function parseMags(magsList, fallbackConfig) {
    if (!magsList || magsList.length === 0) {
        magsList = buildMagsFromLegacy(fallbackConfig);
    }
    if (!magsList || magsList.length === 0) {
        magsList = [{name:'Piece', options:{pieceValue:1}}]; 
    }
    return magsList.map(m => {
        let method;
        if (m.name === 'MaxOptions') method = evaluationMagnifierMaxOptions;
        else if (m.name === 'Piece') method = evaluationMagnifierPiece;
        else if (m.name === 'PieceDefended') method = evaluationMagnifierPieceDefended;
        else if (m.name === 'KingTropism') method = evaluationMagnifierKingTropism;
        else if (m.name === 'KingVulnerability') method = evaluationMagnifierKingVulnerability;
        else if (m.name === 'ThreatGeneration') method = evaluationMagnifierThreatGeneration;

        let opts = {...m.options};
        if (opts.useMask) opts.mask = positionMaskDefault;

        return { method: method, options: opts };
    });
}

self.addEventListener("message", async function(e) {
    
    let obj = JSONfn.parse(e.data)
    if(!obj.state.won){
            

            let move;
            let methods = {
                undefined:defaultCharacter,
                defaultCharacter:defaultCharacter,
                offensiveCharacter:offensiveCharacter,
                defensiveCharacter:defensiveCharacter,
                positionalCharacter:positionalCharacter,
                positionalOffeniveCharacter:positionalOffensiveCharacter,
                noPosition:noPosition
            }
            if(obj.AIPower !== 'customEvolution') {
                obj.AIPower = parseInt(obj.AIPower)
            }
            if(obj.AIPower === -1){
                if(obj.state.pieces.length > 20){
                    obj.AIPower = 1;
                }
                else if(obj.state.pieces.length > 13){
                    obj.AIPower = 3;
                }
                else if(obj.state.pieces.length > 8){
                    obj.AIPower = 4;
                }
                else{
                    obj.AIPower = 5;
                }
            }

            if(obj.AIPower === -5){
                move = minimaxDeep(obj.state,obj.color,3, obj.removedTurns,
                    [{method:evaluationMagnifierPiece, options:{pieceValue:1}}],
                    [
                        {method:removeNonAttackingMovesFilter, options:{maxPieceValue:2,
                        exceptions:[randomException,pieceValueMustBeSmallerThanException]}},
                        {method:randomlyRemove1NthFilter,options:{n:1.2,maxPieceValue:20, exceptions:[pieceValueMustBeSmallerThanException, pieceAttackedException]}}
                    ]
                )
            }

            if(obj.AIPower === -4){
                move = minimaxDeep(obj.state,obj.color,3, obj.removedTurns,
                    [{method:evaluationMagnifierPiece, options:{pieceValue:1}}],
                    [
                        {method:removeNonAttackingMovesFilter, options:{minPieceValue:20,
                        exceptions:[randomException, pieceValueMustBeSmallerThanException]}},
                        {method:randomlyRemove1NthFilter,options:{n:1.2,maxPieceValue:20, exceptions:[pieceValueMustBeSmallerThanException, pieceAttackedException]}}
                    ]
                )

            }


            if(obj.AIPower === -3){
                move = minimaxDeep(obj.state,obj.color,3, obj.removedTurns,
                    positionalCharacter(2),
                    [
                        // {method:removeNonAttackingMovesFilter, options:{minPieceValue:2,
                        // exceptions:[randomException]}},
                        // {method:randomlyRemove1NthFilter,options:{n:1.2,minPieceValue:4, exceptions:[pieceValueMustBeSmallerThanException, pieceAttackedException]}}
                    ]
                )

            }

            if(obj.AIPower === -2){
                move = minimaxDeep(obj.state,obj.color,2, obj.removedTurns,
                    methods[obj.AICharacter](0),
                    [
                        {method:removeNonAttackingMovesFilter, options:{maximum:2,minPieceValue:5, filterDepth:1,
                        exceptions:[pieceValueMustBeBiggerThanException]}},
                    ]
                )
            }
            if(obj.AIPower === 0){
                move = minimaxDeep(obj.state,obj.color,1, obj.removedTurns,methods[obj.AICharacter](0))
            }
            else if(obj.AIPower === 1){
                move = minimaxDeep(obj.state,obj.color,2, obj.removedTurns,
                    methods[obj.AICharacter](0),
                    [
                        {method:removeNonAttackingMovesFilter, options:{maximum:2,maxPieceValue:2,randomException:0.3, filterDepth:1,
                        exceptions:[pieceValueMustBeSmallerThanException,randomException]}},
                        {method:randomlyRemove1NthFilter,options:{n:1.2,maxPieceValue:4, exceptions:[pieceValueMustBeSmallerThanException, pieceAttackedException]}}
                    ]
                )
            }
            else if(obj.AIPower === 2){

                move = minimaxDeep(obj.state,obj.color,2, obj.removedTurns,
                    methods[obj.AICharacter](1),
                    [
                        {method:removeNonAttackingMovesFilter, options:{maximum:2,maxPieceValue:2,randomException:0.3, 
                        exceptions:[pieceValueMustBeSmallerThanException,randomException]}},
                        {method:randomlyRemove1NthFilter,options:{n:1.2,maxPieceValue:4, exceptions:[pieceValueMustBeSmallerThanException, pieceAttackedException]}}
                    ]
                )

            }
            else if(obj.AIPower === 3){
                move = minimaxDeep(obj.state,obj.color,2, obj.removedTurns,
                    methods[obj.AICharacter](0),
                    []
                )
            }
            else if(obj.AIPower === 4){
                move = minimaxDeep(obj.state,obj.color,2, obj.removedTurns,
                    methods[obj.AICharacter](1),
                    []
                )
            }
            else if(obj.AIPower === 5){

                move = minimaxDeep(obj.state,obj.color,3, obj.removedTurns,
                    methods[obj.AICharacter](0),
                    [
                        // {method:removeAttackedMovesFilter, options:{randomException:0.6,exceptions:[randomException]}},
                        // {method:removeNonAttackingMovesFilter, options:{randomException:0.5, 
                        //     exceptions:[pieceAttackedException,randomException]}},
                    ]
                )
            }
            else if(obj.AIPower === 6){
                move = minimaxDeep(obj.state,obj.color,4, obj.removedTurns,
                    [{method:evaluationMagnifierPiece, options:{pieceValue:1 }}],
                    
                    [
                        // {method:removeAttackedMovesFilter, options:{randomException:0.6,exceptions:[randomException]}},
                        // {method:removeNonAttackingMovesFilter, options:{randomException:0.5, 
                        //     exceptions:[pieceAttackedException,randomException]}},
                    ]
                )
            }
            if(obj.AIPower === 101){

                console.time('101')
                move = minimaxDeep(obj.state,obj.color,2, obj.removedTurns,
                    methods[obj.AICharacter](0),
                    [
                        {method:removeNonAttackingMovesFilter, options:{maximum:2,maxPieceValue:2,randomException:0.3, filterDepth:1,
                        exceptions:[pieceValueMustBeSmallerThanException,randomException]}},
                        {method:randomlyRemove1NthFilter,options:{n:1.2,minPieceValue:4, exceptions:[pieceValueMustBeBiggerThanException, pieceAttackedException]}}
                    ]
                )
                console.timeEnd('101')
            }

            else if(obj.AIPower === 102){
                console.time('102')
                move = minimaxDeep(obj.state,obj.color,3, obj.removedTurns,
                    methods[obj.AICharacter](0),
                    [
                        {method:removeNonAttackingMovesFilter, options:{maximum:2,maxPieceValue:2,randomException:0.3, filterDepth:1,
                        exceptions:[pieceValueMustBeSmallerThanException,randomException]}},
                        {method:randomlyRemove1NthFilter,options:{n:1.2,minPieceValue:4, exceptions:[pieceValueMustBeBiggerThanException, pieceAttackedException]}}
                    ]
                )
                console.timeEnd('102')
            }
            else if(obj.AIPower === 103){
                console.time('103')
                move = minimaxDeep(obj.state,obj.color,3, obj.removedTurns,
                    methods[obj.AICharacter](0),
                    [
                    ]
                )
                console.timeEnd('103')
            }
            else if(obj.AIPower === 104){
                console.time('104')
                let depth = 2;
                if(obj.state.pieces.length < 8){
                    depth = 4;
                }
                else if(obj.state.pieces.length < 16){
                    depth = 3;
                }

                move = minimaxDeep(obj.state,obj.color,depth, obj.removedTurns,
                    methods[obj.AICharacter](0),
                    []
                )
                console.timeEnd('104')
            }

            else if(obj.AIPower === 105){
                console.time('105')
                let character = methods[obj.AICharacter];
                if(!obj.AICharacter){
                    character = rogueLikeCharacter;
                }
                let depth = 2;
                if(obj.state.pieces.length < 16 && obj.state.pieces.length > 8){
                    depth = 4;
                }
                else if(obj.state.pieces.length < 8){
                    depth = 3;
                }
                move = minimaxDeep(obj.state,obj.color,depth, obj.removedTurns,
                    character(0),
                    [
                    ]
                )
                console.timeEnd('105')
            }

            else if(obj.AIPower === 106){
                console.time('106')
                let character = methods[obj.AICharacter];
                if(!obj.AICharacter){
                    character = rogueLikeCharacter;
                }
                let depth = 3;
                 if(obj.state.pieces.length < 16  && obj.state.pieces.length > 8){
                    depth = 4;
                }
                else if(obj.state.pieces.length < 8){
                    depth = 5;
                }
                move = minimaxAlphaBeta(obj.state,obj.color,depth, obj.removedTurns,
                    character(0),
                    [
                    ]
                )
                console.timeEnd('106')
            }
            else if(obj.AIPower === 'customEvolution'){
                console.time('customEvolution');
                
                // Read custom AI configuration
                let charWhiteStr = obj.customEvolutionWhite;
                let charBlackStr = obj.customEvolutionBlack;
                let charConfigStr = obj.color === 'white' ? charWhiteStr : charBlackStr;
                
                let moveFallback = false;

                if (charConfigStr) {
                    try {
                        let charConfig = JSON.parse(charConfigStr);
                        
                        // Build magnifiers
                        let mags = parseMags(charConfig.magnifiers, charConfig);
                        console.log(mags, charConfig, '  mags?')
                        // Build filters
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

                        let depth = charConfig.depth || 2;
                        let algorithm = charConfig.algorithm || 'minimaxAlphaBeta';
                        
                        let phases = charConfig.phases;
                        let numPieces = obj.state.pieces.length;
                        
                        let currentDepth = depth;
                        let currentMags = mags;
                        let currentFilters = filters;
                        
                        // Handle legacy
                        if (!phases && charConfig.altAlgorithm) {
                            phases = [{threshold: charConfig.altPieceThreshold || 10, algorithm: charConfig.altAlgorithm}];
                        }
                        
                        if (phases && phases.length > 0) {
                            // Sorted descending by default
                            for(let i=0; i<phases.length; i++) {
                                if (numPieces <= phases[i].threshold) {
                                    if (phases[i].algorithm) algorithm = phases[i].algorithm;
                                    if (phases[i].depth) currentDepth = phases[i].depth;
                                    
                                    // Override magnifiers if specified in phase
                                    if (phases[i].magnifiers && phases[i].magnifiers.length > 0) {
                                        currentMags = parseMags(phases[i].magnifiers, phases[i]);
                                    } else if (phases[i].posValueWeight !== undefined || 
                                        phases[i].pieceValueWeight !== undefined ||
                                        phases[i].kingTropismWeight !== undefined || 
                                        phases[i].defendedWeight !== undefined || 
                                        phases[i].kingVulnAttackWeight !== undefined) {
                                        currentMags = parseMags(buildMagsFromLegacy(phases[i]), phases[i]);
                                    } else if (phases[i].weights) {
                                        // Legacy support for the brief period where we used 'weights' object
                                        let w = phases[i].weights;
                                        let legacyConfig = {
                                            posValueWeight: w.pos !== undefined ? w.pos : undefined,
                                            pieceValueWeight: w.piece !== undefined ? w.piece : undefined,
                                            kingTropismWeight: w.kingTrop !== undefined ? w.kingTrop : undefined,
                                            defendedWeight: w.def !== undefined ? w.def : undefined,
                                            kingVulnAttackWeight: w.vulnAtt !== undefined ? w.vulnAtt : undefined,
                                            kingVulnProxWeight: w.vulnProx !== undefined ? w.vulnProx : undefined
                                        };
                                        currentMags = parseMags(buildMagsFromLegacy(legacyConfig), legacyConfig);
                                    }
                                    
                                    // Rebuild Filters based on phase overrides
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
                                        let newFilters = [];
                                        let fs = p.filters;
                                        
                                        if (fs.includes('RA')) {
                                            let exceptions = [];
                                            if (charConfig.raRandomException) exceptions.push(randomException);
                                            if (charConfig.raExceptionPieceValue) exceptions.push(pieceValueMustBeBiggerThanException);
                                            if (charConfig.raExceptionPieceValueSmaller) exceptions.push(pieceValueMustBeSmallerThanException);
                                            newFilters.push({ method: removeAttackedMovesFilter, options: { randomException: charConfig.raRandomException || 0.1, minPieceValue: 3, maxPieceValue: 5, exceptions: exceptions } });
                                        }
                                        // ... other legacy cases ...
                                        // Since we just updated the UI to use the object format, we can skip full legacy implementation here
                                        // unless strictly needed. The new UI writes the new format.
                                        currentFilters = newFilters;
                                    }
                                } else {
                                    break;
                                }
                            }
                        }

                        if (algorithm === 'minimaxDeep') {
                            move = minimaxDeep(obj.state, obj.color, currentDepth, obj.removedTurns, currentMags, currentFilters);
                        } else if (algorithm === 'minimaxQuiescence') {
                            move = minimaxQuiescence(obj.state, obj.color, currentDepth, obj.removedTurns, currentMags, currentFilters);
                        } else if (algorithm === 'proofNumberSearch') {
                            move = proofNumberSearch(obj.state, obj.color, currentDepth, obj.removedTurns, currentMags, currentFilters);
                        } else if (algorithm === 'bestFirstSearch') {
                            move = bestFirstSearch(obj.state, obj.color, currentDepth, obj.removedTurns, currentMags, currentFilters);
                        } else if (algorithm === 'principalVariationSearch') {
                            move = principalVariationSearch(obj.state, obj.color, currentDepth, obj.removedTurns, currentMags, currentFilters);
                        } else {
                            move = minimaxAlphaBeta(obj.state, obj.color, currentDepth, obj.removedTurns, currentMags, currentFilters);
                        }
                    } catch(e) {
                        console.error("Failed parsing custom AI config", e);
                        moveFallback = true;
                    }
                } else {
                    moveFallback = true;
                }

                if (moveFallback) {
                    // Fallback to medium AI if no config found
                    move = minimaxDeep(obj.state,obj.color,3, obj.removedTurns, methods[obj.AICharacter](0), []);
                }

                console.timeEnd('customEvolution');
            }
            move.removedTurns = obj.removedTurns;
            postMessage(JSONfn.stringify(move));
    }
})


