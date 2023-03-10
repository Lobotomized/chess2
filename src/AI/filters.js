function randomlyRemove1NthFilter(options) {
    let {allowedMoves,n} = options;
    if(exceptionsChecker(options)){
      return allowedMoves;
    }
    const halfLength = Math.floor(allowedMoves.length / n); // calculate the half length of the array
    
    for (let i = 0; i < halfLength; i++) {
      const randomIndex = Math.floor(Math.random() * allowedMoves.length); // generate a random index within the remaining length of the array
      allowedMoves.splice(randomIndex, 1); // remove the element at the random index from the array
    }

    return allowedMoves
  }

  

function maxNumberOfMovesPerPieceFilter(options){
  let {allowedMoves,maximum,} = options;
  if(exceptionsChecker(options)){
    return allowedMoves;
  }
  if(allowedMoves.length > maximum){
    allowedMoves.length = maximum;
  }
  else{
    allowedMoves.length = 0;
  }
  return allowedMoves
}

function nthChanceToRemovePieceFilter(options){
  let {allowedMoves,n} = options;
  if(exceptionsChecker(options)){
    return allowedMoves;
  }
  if(Math.random()<n){
    allowedMoves.length = 0;
  }
  return allowedMoves
}

function removeNonAttackingMovesFilter(options){
  let {allowedMoves, color,state} = options;
  if(exceptionsChecker(options)){
    return allowedMoves;
  }
  allowedMoves = allowedMoves.filter((am) => {
    let foundPiece = findPieceByXY(state.pieces,am.x,am.y);
    if(!(foundPiece > -1) || state.pieces[foundPiece].color === color){
      return false;
    }
    return true;
  })
  return allowedMoves
}

function removeWellPositionedPiecesFilter(options){
  let {allowedMoves,n} = options;
  if(exceptionsChecker(options)){
    return allowedMoves;
  }
  if(allowedMoves.length > n){
    return [];
  }
  return allowedMoves
}

function pieceValueMustBeSmallerThanException(options){
    return options.piece.value > options.minPieceValue;
}

function pieceValueMustBeBiggerThanException(options){
  return options.piece.value < options.maxPieceValue;
}

function pieceAttackedException(options){
  return isPositionAttacked(options.state,options.color,options.piece.x, options.piece.y)
}

function tooLittleFriendlyPiecesException(options){
  if(options.myPieces.length < options.n){
    return true
  }
  return false;
}

function randomException(options){
  let toUse = 0.5;
  if(options.randomException){
    toUse = options.randomException
  }
  if(Math.random() > toUse){
    return true;
  }

  return false
}


function exceptionsChecker(options){
  let exceptions = options.exceptions;
  if(!exceptions || !exceptions.length){
    return;
  }
  for(let i=0; i<=exceptions.length-1; i++){
    let exception = exceptions[i];
    if(exception && exception(options)){
      return true;
    }
  }
}