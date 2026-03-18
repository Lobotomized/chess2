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
                        let mags = [];
                        if (charConfig.posValueWeight !== undefined) mags.push({ method: evaluationMagnifierMaxOptions, options: { posValue: charConfig.posValueWeight } });
                        if (charConfig.pieceValueWeight !== undefined) mags.push({ method: evaluationMagnifierPiece, options: { pieceValue: charConfig.pieceValueWeight } });
                        if (charConfig.kingTropismWeight !== undefined) mags.push({ method: evaluationMagnifierKingTropism, options: { relativeValue: charConfig.kingTropismWeight, onlyForEnemy: true, pieceValue: 1 } });
                        if (charConfig.defendedWeight !== undefined) mags.push({ method: evaluationMagnifierPieceDefended, options: { relativeValue: charConfig.defendedWeight } });
                        if (charConfig.kingVulnAttackWeight !== undefined) mags.push({ method: evaluationMagnifierKingVulnerability, options: { attackValue: charConfig.kingVulnAttackWeight, proximityValue: charConfig.kingVulnProxWeight || 0 } });
                        
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

                        if (algorithm === 'minimaxDeep') {
                            move = minimaxDeep(obj.state, obj.color, depth, obj.removedTurns, mags, filters);
                        } else {
                            move = minimaxAlphaBeta(obj.state, obj.color, depth, obj.removedTurns, mags, filters);
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


