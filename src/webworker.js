importScripts('/pieceDefinitions.js')
importScripts('/helperFunctions.js')
importScripts('/moveMethods.js')
importScripts('/src/AI/general.js')

importScripts('/src/AI/magnifiers.js')
importScripts('/src/AI/filters.js')


importScripts('/src/jsonfn.js')



 function minimax(state,maximizer, depth, removedTurns){
    const moves = generateMovesFromPieces(state,maximizer)
    let enemy = 'black';
    if(maximizer === 'black'){
        enemy = 'white';
    }
    let selectedMove = undefined;
    let badMoveResults= []
    let slizedMoves = moves.slice(0,depth);
    let lowestBadMoveResult = 999999;

    slizedMoves.forEach((move, index) => {
        let isItBanned;
        if(removedTurns && removedTurns.length){
            isItBanned = removedTurns.find((removedTurn) => {
                return move.xClicked === removedTurn.xClicked && move.yClicked === removedTurn.yClicked && removedTurn.pieceCounter === move.pieceCounter
            })
        }
        
        if(isItBanned){
            return;
        }

        const badMoves = generateMovesFromPieces({board:state.board,pieces:move.pieces},enemy)
        let bestBadMove = {};
        let badMoveValue = -999999;
        badMoves.forEach((badMove) => {
            let thisValue = undefined;
            if(maximizer === 'white'){
                thisValue = evaluateBoard(enemy,badMove.pieces, state.board,
                    positionalCharacter(0)
                    )
            }
            else{
                thisValue = evaluateBoard(enemy,badMove.pieces, state.board,
                    defensiveCharacter(0)
                ) 
            }
            if(thisValue > badMoveValue){
                badMoveValue = thisValue;
                bestBadMove = {moveCounter:index, value:badMoveValue,pieces:badMove.pieces}
            }
        })
        if(!badMoves.length){
            bestBadMove = {moveCounter:index, value:-20,pieces:state.pieces};
        }
        badMoveResults.push(bestBadMove)
    })
    badMoveResults.forEach((badMoveResult) => {
        if(badMoveResult.value < lowestBadMoveResult ){
            lowestBadMoveResult = badMoveResult.value;
            selectedMove = {moveCounter:badMoveResult.moveCounter, value:lowestBadMoveResult};
        }
    })
    // console.log(moves[selectedMove.moveCounter], )
    return moves[selectedMove.moveCounter];

}


function minimaxDeep(state,maximizer, depth, removedTurns,magnifiers,filters, filtersDepth,filtersEnemy){
    state.id = crypto.randomUUID()
    let enemy = getEnemy(maximizer);
    let firstGen = generateMovesFromPieces(state,maximizer,filters);
    if(!filtersDepth){
        filtersDepth === 4;
    }
    

    if(removedTurns && removedTurns.length){
        firstGen = firstGen.filter((fgm) => {
            let findSame = removedTurns.find((rtm) => {
                return fgm.xClicked === rtm.xClicked && fgm.yClicked === rtm.yClicked && rtm.pieceCounter === fgm.pieceCounter
            })
            return findSame !== undefined;
        })
    }
    if(depth === 2){

        const secondGen = filtersDepth >= 2 && filtersEnemy ? generateMovesFromMoves(firstGen, enemy,state.board,filters) : generateMovesFromMoves(firstGen, enemy,state.board);
    
        evalMoves(secondGen,maximizer,state.board,magnifiers);
        evalParents(firstGen,secondGen,true);
        return getMoveByValue(firstGen)
    }
    else if(depth === 3){
        const secondGen = filtersDepth >= 2 && filtersEnemy ? generateMovesFromMoves(firstGen, enemy,state.board,filters) : generateMovesFromMoves(firstGen, enemy,state.board);
        const thirdGen =filtersDepth >= 3? generateMovesFromMoves(secondGen, maximizer,state.board,filters) : generateMovesFromMoves(secondGen, maximizer,state.board);
    
        evalMoves(thirdGen,maximizer,state.board,magnifiers);
        evalParents(secondGen,thirdGen);
        evalParents(firstGen,secondGen, true);

        return getMoveByValue(firstGen)

    }

    else if(depth >= 4){
        const secondGen = filtersDepth >= 2 && filtersEnemy ? generateMovesFromMoves(firstGen, enemy,state.board,filters) : generateMovesFromMoves(firstGen, enemy,state.board);
        const thirdGen =filtersDepth >= 3? generateMovesFromMoves(secondGen, maximizer,state.board,filters) : generateMovesFromMoves(secondGen, maximizer,state.board);
        const fourthGen = filtersDepth >= 4 && filtersEnemy ?generateMovesFromMoves(thirdGen, enemy,state.board, filters) : generateMovesFromMoves(thirdGen, enemy,state.board, filters);
        
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
            if(obj.AIPower === 0){
                move = minimaxDeep(obj.state,obj.color,1, obj.removedTurns,)
            }
            else if(obj.AIPower === 1){
                move = minimaxDeep(obj.state,obj.color,2, obj.removedTurns,
                    defaultCharacter(0),
                    [
                    {method:removeNonAttackingMovesFilter, options:{maximum:2,minPieceValue:2,randomException:0.3, filterDepth:1,
                    exceptions:[pieceValueMustBeSmallerThanException,randomException]}},
                    {method:randomlyRemove1NthFilter,options:{n:1.2,minPieceValue:4, exceptions:[pieceValueMustBeSmallerThanException, pieceAttackedException]}}
                    ]
                )
            }
            else if(obj.AIPower === 2){

                move = minimaxDeep(obj.state,obj.color,2, obj.removedTurns,
                    defaultCharacter(3),
                    [
                    {method:removeNonAttackingMovesFilter, options:{maximum:2,minPieceValue:2,randomException:0.3, 
                    exceptions:[pieceValueMustBeSmallerThanException,randomException]}},
                    {method:randomlyRemove1NthFilter,options:{n:1.2,minPieceValue:4, exceptions:[pieceValueMustBeSmallerThanException, pieceAttackedException]}}
                    ]
                )

            }
            else if(obj.AIPower === 3){
                move = minimaxDeep(obj.state,obj.color,2, obj.removedTurns,
                    defaultCharacter(0),
                    []
                )
            }
            else if(obj.AIPower === 4){
                move = minimaxDeep(obj.state,obj.color,2, obj.removedTurns,
                    defaultCharacter(3),
                    []
                )
            }

            move.removedTurns = obj.removedTurns;
            postMessage(JSONfn.stringify(move))

    }
})


