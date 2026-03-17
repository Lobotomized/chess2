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

importScripts('/wasm/webworker_interface.js')

self.addEventListener("message", async function(e) {
    
    let obj = JSONfn.parse(e.data)
    if(!obj.state.won){
            
            // Allow bypassing to JS AI using a flag or if Wasm isn't ready
            if (obj.useWasm) {
                if (typeof wasmReadyPromise !== "undefined") {
                    await wasmReadyPromise;
                }
                let wasmMove = callWasmAI(obj);
                if (wasmMove) {
                    postMessage(JSONfn.stringify(wasmMove));
                    return;
                }
            }

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
            obj.AIPower = parseInt(obj.AIPower)
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
            else if(obj.AIPower === 107){
                console.time('107')
                
                // Ensure WASM is ready
                if (typeof wasmReadyPromise !== "undefined") {
                    await wasmReadyPromise;
                }
                
                let wasmMove = callWasmAI(obj);
                console.log(wasmMove, '  the move?! ', getColorPieces(obj.state.pieces, obj.state.turn))
               
                if (wasmMove) {
                    move = wasmMove;
                } else {
                    console.warn("WASM AI failed for difficulty 107, falling back to JS (diff 106)");
                    // Fallback to JS AI (same logic as 106)
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
                }
                console.timeEnd('107')
            }
            move.removedTurns = obj.removedTurns;
            postMessage(JSONfn.stringify(move));
    }
})


