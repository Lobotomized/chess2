importScripts('/src/jsonfn.js')
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


function minimaxDeep(state,maximizer, depth, removedTurns,magnifiers,filters){

    state.id = crypto.randomUUID()
    let enemy = getEnemy(maximizer);
    let firstGen = generateMovesFromPieces(state,maximizer,filters);

    if(removedTurns && removedTurns.length){
        firstGen = firstGen.filter((fgm) => {
            let findSame = removedTurns.find((rtm) => {
                return !(fgm.xClicked === rtm.xClicked && fgm.yClicked === rtm.yClicked && rtm.pieceCounter === fgm.pieceCounter)
            })
            return findSame !== undefined;
        })
    }
    if(depth === 2){

        const secondGen = generateMovesFromMoves(firstGen, enemy,state.board,filters, true);
    
        evalMoves(secondGen,maximizer,state.board,magnifiers);
        evalParents(firstGen,secondGen,true, maximizer);
        return getMoveByValue(firstGen)
    }
    else if(depth === 3){
        const secondGen = generateMovesFromMoves(firstGen, enemy,state.board,filters, true);
        const thirdGen = generateMovesFromMoves(secondGen, maximizer,state.board,filters);
        evalMoves(thirdGen,maximizer,state.board,magnifiers);
        evalParents(secondGen,thirdGen, false, maximizer);
        evalParents(firstGen,secondGen, true, maximizer);

        return getMoveByValue(firstGen)

    }

    else if(depth >= 4){
        const secondGen =generateMovesFromMoves(firstGen, enemy,state.board,filters, true);
        const thirdGen =generateMovesFromMoves(secondGen, maximizer,state.board,filters)
        const fourthGen = generateMovesFromMoves(thirdGen, enemy,state.board, filters, true);
        
        evalMoves(fourthGen,maximizer,state.board,defaultCharacter(0));
        evalParents(thirdGen, fourthGen,true, maximizer);
        evalParents(secondGen, thirdGen,false, maximizer);
        evalParents(firstGen,secondGen,true, maximizer);
    
        return getMoveByValue(firstGen)
    }
    else{
        evalMoves(firstGen,maximizer,state.board,magnifiers);
        firstGen.forEach(move => {
            if(move.won){
                if(move.won === maximizer){
                    move.value = 9999999999999999999;
                } else {
                    move.value = -9999999999999999999;
                }
            }
        });
        return getMoveByValue(firstGen)
    }
}

self.addEventListener("message", function(e) {
    let obj = JSONfn.parse(e.data)
    console.log('obj', obj.AICharacter)
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
                 if(obj.state.pieces.length < 8){
                    depth = 4;
                }
                else if(obj.state.pieces.length < 16){
                    depth = 3;
                }
                move = minimaxDeep(obj.state,obj.color,depth, obj.removedTurns,
                    character(0),
                    [
                    ]
                )
                console.timeEnd('105')
            }
            move.removedTurns = obj.removedTurns;
            postMessage(JSONfn.stringify(move));

    }
})


