importScripts('/pieceDefinitions.js')
importScripts('/helperFunctions.js')
importScripts('/moveMethods.js')
importScripts('/src/AI/general.js')

importScripts('/src/AI/magnifiers.js')
importScripts('/src/AI/filters.js')


importScripts('/src/jsonfn.js')



function minimaxDeep(state,maximizer, depth, removedTurns,magnifiers,filters){
    state.id = crypto.randomUUID()
    let enemy = getEnemy(maximizer);
    let firstGen = generateMovesFromPieces(state,maximizer,filters);
    

    if(removedTurns && removedTurns.length){
        firstGen = firstGen.filter((fgm) => {
            let findSame = removedTurns.find((rtm) => {
                return fgm.xClicked === rtm.xClicked && fgm.yClicked === rtm.yClicked && rtm.pieceCounter === fgm.pieceCounter
            })
            return findSame !== undefined;
        })
    }
    if(depth === 2){

        const secondGen = generateMovesFromMoves(firstGen, enemy,state.board,filters, true);
    
        evalMoves(secondGen,maximizer,state.board,magnifiers);
        evalParents(firstGen,secondGen,true);
        return getMoveByValue(firstGen)
    }
    else if(depth === 3){
        const secondGen = generateMovesFromMoves(firstGen, enemy,state.board,filters, true);
        const thirdGen = generateMovesFromMoves(secondGen, maximizer,state.board,filters);
    
        evalMoves(thirdGen,maximizer,state.board,magnifiers);
        evalParents(secondGen,thirdGen);
        evalParents(firstGen,secondGen, true);

        return getMoveByValue(firstGen)

    }

    else if(depth >= 4){
        const secondGen =generateMovesFromMoves(firstGen, enemy,state.board,filters, true);
        const thirdGen =generateMovesFromMoves(secondGen, maximizer,state.board,filters)
        const fourthGen = generateMovesFromMoves(thirdGen, enemy,state.board, filters, true);
        
        evalMoves(fourthGen,maximizer,state.board,defaultCharacter(0));
        evalParents(thirdGen, fourthGen,true);
        evalParents(secondGen, thirdGen,false);
        evalParents(firstGen,secondGen,true);
    
        return getMoveByValue(firstGen)
    }
    else{
        return getMoveByValue(firstGen)
    }
}


self.addEventListener("message", function(e) {
    let obj = JSON.parse(e.data)
    if(!obj.state.won){

            let move;
            let methods = {
                undefined:defaultCharacter,
                defaultCharacter:defaultCharacter,
                offensiveCharacter:offensiveCharacter,
                defensiveCharacter:defensiveCharacter,
                positionalCharacter:positionalCharacter
            }
            if(obj.AIPower === 0){
                move = minimaxDeep(obj.state,obj.color,1, obj.removedTurns,methods[obj.AICharacter](0))
            }
            else if(obj.AIPower === 1){
                move = minimaxDeep(obj.state,obj.color,2, obj.removedTurns,
                    methods[obj.AICharacter](0),
                    [
                    {method:removeNonAttackingMovesFilter, options:{maximum:2,minPieceValue:2,randomException:0.3, filterDepth:1,
                    exceptions:[pieceValueMustBeSmallerThanException,randomException]}},
                    {method:randomlyRemove1NthFilter,options:{n:1.2,minPieceValue:4, exceptions:[pieceValueMustBeSmallerThanException, pieceAttackedException]}}
                    ]
                )
            }
            else if(obj.AIPower === 2){

                move = minimaxDeep(obj.state,obj.color,2, obj.removedTurns,
                    methods[obj.AICharacter](2),
                    [
                    {method:removeNonAttackingMovesFilter, options:{maximum:2,minPieceValue:2,randomException:0.3, 
                    exceptions:[pieceValueMustBeSmallerThanException,randomException]}},
                    {method:randomlyRemove1NthFilter,options:{n:1.2,minPieceValue:4, exceptions:[pieceValueMustBeSmallerThanException, pieceAttackedException]}}
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
                    methods[obj.AICharacter](2),
                    []
                )
            }

            move.removedTurns = obj.removedTurns;
            postMessage(JSONfn.stringify(move))

    }
})


