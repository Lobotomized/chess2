//Options to change AI behavior
let positionMaskDefault = {
    'whitePawn.png':1,
    'blackPawn.png':1,
    'whiteKnight.png':4,
    'blackKnight.png':4,
    'whiteBishop.png':1.5,
    'blackBishop.png':1.5,
    'whiteQueen.png':0.1,
    'blackQueen.png':0.1,
    'whiteKing.png':3,
    'blackKing.png':3,
    'whiteRook.png':0.7,
    'blackRook.png':0.7,

    'whiteLadyBug.png':3,
    'blackLadyBug.png':3,
    'whiteAnt.png':1,
    'blackAnt.png':1,
    'whiteSpider.png':1,
    'blackSpider.png':1,
    'whiteGoliathBug.png':0.7,
    'blackGoliathBug.png':0.7,
    'whiteQueenBug.png':3,
    'blackQueenBug.png':3,


    'whitePig.png':3,
    'blackPig.png':3,
    'whiteGhost.png':1,
    'blackGhost.png':1,
    'whiteRicar.png':1,
    'blackRicar.png':1,
    'whiteHorse.png':0.7,
    'blackHorse.png':0.7,
    'whiteHat.png':0.4,
    'blackHat.png':0.4,
    'whiteClown.png':0.7,
    'blackClown.png':0.7,

    
    'whiteSwordsmen.png':1,
    'blackSwordsmen.png':1,
    'whitePikeman.png':4,
    'blackPikeman.png':4,
    'whiteShield.png':1,
    'blackShield.png':1,
    'whiteFencer.png':4,
    'blackFencer.png':4,
    'whiteKolba.png':2,
    'blackKolba.png':2,
    'whiteDragon.png':2,
    'blackDragon.png':2,



    'whiteBootvessel.png':4,
    'blackBootvessel.png':4,
    'whiteExecutor.png':2,
    'blackExecutor.png':2,
    'whiteCrystalEmpowered.png':1,
    'blackCrystalEmpowered.png':1,
    'whiteCrystal.png':1,
    'blackCrystal.png':1,
    'whiteJuggernaut.png':0.3,
    'blackJuggernaut.png':0.3,
    'whiteCyborg.png':1,
    'blackCyborg.png':1,


    'whiteElectricCat.png':1,
    'blackElectricCat.png':1,
    'whiteFatCat.png':3,
    'blackFatCat.png':3,
    'whiteLongCat':3,
    'blackLongCat.png':3,
    'whiteBlindCat.png':0,
    'blackBlindCat.png':0,
    'whiteScaryCat.png':1,
    'blackScaryCat.png':1,
    'whiteCuteCat.png':0.1,
    'blackCuteCat.png':0.1,



}





let defaultPieceValueThreshold = function(myPiecesLength){
    if(myPiecesLength > 14){
        return 0.5
    }
    else if(myPiecesLength > 10){
        return 1;
    }
    else if(myPiecesLength > 5){
        return 3;
    }
    else{
        return 6;
    }
}





//Code related variables
let boardHeight = undefined;
let boardWidth = undefined;



function setBoardDimensions(board){
    if(!boardHeight){
        boardHeight = Math.max(...board.map(o => o.y))
    }
    if(!boardWidth){
        boardWidth = Math.max(...board.map(o => o.x))
    }
    

}

function evaluationMagnifierMaxOptions(piece,pieces,board,colorPerspective,options){
    lightBoardFE(piece,{pieces:pieces, board:board, turn:piece.color},'allowedMove',undefined,true)
    const filtered = board.filter((square) => {
        return square['allowedMove']
    })
    let piecePosValue = piece.posValue;
    if(options.mask && options.mask[piece.icon]){
        piecePosValue = options.mask[piece.icon]
    }
    return filtered.length * options.posValue*piecePosValue;
}


function evaluationMagnifierKingVulnerability(piece,pieces,board,colorPerspective,options){
    /*
        Rewards moves that put the enemy king in check or attack squares around it.
        options - 
        attackValue - Value for attacking the king directly (check)
        proximityValue - Value for attacking squares adjacent to the king
    */
    
    // We only care about our pieces attacking the enemy king
    if(piece.color !== colorPerspective){
        return 0;
    }

    // Find the enemy king
    let enemyKing = pieces.find(p => p.color !== colorPerspective && (p.icon.includes('King') || p.value > 500));
    
    if(!enemyKing){
        return 0;
    }

    // Generate moves for the current piece
    lightBoardFE(piece,{pieces:pieces, board:board, turn:piece.color},'allowedMove',undefined,true);
    
    // Check if any allowed move attacks the king or squares around it
    let score = 0;
    
    // Check for direct check (attacking king's position)
    let attacksKing = board.find(square => square.x === enemyKing.x && square.y === enemyKing.y && square.allowedMove);
    if(attacksKing){
        score += options.attackValue || 0;
    }

    // Check for attacking squares around the king (vulnerability)
    if(options.proximityValue){
        for(let dx = -1; dx <= 1; dx++){
            for(let dy = -1; dy <= 1; dy++){
                if(dx === 0 && dy === 0) continue; // Skip king's own square (handled above)
                
                let targetX = enemyKing.x + dx;
                let targetY = enemyKing.y + dy;
                
                let attacksProximity = board.find(square => square.x === targetX && square.y === targetY && square.allowedMove);
                if(attacksProximity){
                    score += options.proximityValue;
                }
            }
        }
    }

    return score;
}

function evaluationMagnifierPiece(piece,pieces,board,colorPerspective,options){
    // Fast path for most common case
    if (!options.whoHasMorePieces && !options.threshold) {
        return piece.value * options.pieceValue;
    }

    let myPieces;
    if(options.whoHasMorePieces || options.threshold){
        myPieces = pieces.filter((piece) => {
            return piece.color === colorPerspective;
        })
    }

    let pieceDifferenceChange = 1;
    if(options.whoHasMorePieces){
        pieceDifferenceChange = myPieces.length/(pieces.length-myPieces.length);
    }
    if(options.threshold){

        let quantifier = options.threshold(myPieces.length);
        

        return piece.value * quantifier*pieceDifferenceChange;
    }

    return piece.value*options.pieceValue;
}

function evaluationMagnifierThreatGeneration(piece,pieces,board,colorPerspective,options){
    /*
        Rewards pieces that attack enemy pieces, especially if the enemy is more valuable.
        options -
        threatMultiplier - Multiplier for the value difference or just the threat value.
        onlyValueDifference - If true, only rewards if the target is more valuable than the attacker.
        includeDefended - If true, only reward if the attacking piece is defended.
    */
    if(piece.color !== colorPerspective){
        return 0;
    }

    let score = 0;
    
    lightBoardFE(piece,{pieces:pieces, board:board, turn:piece.color},'allowedMove',undefined,true);

    const enemyPieces = pieces.filter(p => p.color !== colorPerspective);
    
    for(let i = 0; i < enemyPieces.length; i++){
        const enemy = enemyPieces[i];
        if(enemy.value > 500) continue; // Skip king (handled by KingVulnerability)

        const isAttacked = board.find(square => square.x === enemy.x && square.y === enemy.y && square.allowedMove);
        if(isAttacked){
            let valueDiff = enemy.value - piece.value;
            if(options.onlyValueDifference && valueDiff <= 0){
                continue;
            }
            let threatValue = options.onlyValueDifference ? valueDiff : enemy.value;
            
            if(options.includeDefended){
                if(!isPositionAttacked({board:board,pieces:pieces,turn:colorPerspective},piece.color,piece.x,piece.y)){
                    continue; 
                }
            }

            score += threatValue * (options.threatMultiplier || 1);
        }
    }

    return score;
}

//isPositionAttacked


function evaluationMagnifierPieceDefended(piece,pieces,board,colorPerspective,options){
    let enemyColor = 'black';
    if(piece.color === 'black'){
        enemyColor = 'white';
    }

    let colorToUse = enemyColor;
    if(options.pieceAttacked){
        colorToUse  = piece.color
    }
    if(isPositionAttacked({board:board,pieces:pieces,turn:colorPerspective},colorToUse,piece.x,piece.y)){
        if(options.pieceValue){
            return options.relativeValue * options.pieceValue*piece.value
        }

        return options.relativeValue
    }

    return 0
}

function evaluationMagnifierKingTropism(piece,pieces,board,colorPerspective,options){

    /*
        options - 
        pieceValue - Колко релативна стойност отделя на стойността на фигурите
        relativeValue - Колко релативна стойност се отделя на близостта до царя
        defendersSearch - Колко защитника има около приятелския цар, а не нападателя около противниковия

    */
   let targets = []
   let target = undefined;
   let shortestDistance = 100;


   setBoardDimensions(board);
   targets= pieces.filter((el)=> {
        if(!options.defendersSearch){
            return el.color != colorPerspective && el.value > 500;
        }
        else{
            return el.color === colorPerspective && el.value > 500;
        }
    })


   targets.forEach((innerTarget) => {
        let distanceX = Math.abs(piece.x-innerTarget.x);
        let distanceY = Math.abs(piece.y-innerTarget.y);
        if(distanceX > distanceY){
            if(distanceX < shortestDistance){
                shortestDistance = distanceX;
                target = innerTarget;
            }
        }
        else{
            if(distanceY < shortestDistance){
                shortestDistance = distanceY;
                target = innerTarget;
            }
        }
   })
   

    if(!target){
        return 0;
    }
    let distanceX = Math.abs(piece.x - target.x);
    let distanceY = Math.abs(piece.y - target.y);
    let tempPieceValue = piece.value;
    if(tempPieceValue>500){
        tempPieceValue = 0.0001;
    }
    if(distanceX > distanceY){
        if(options.pieceValue){

            return (boardWidth*options.relativeValue - distanceX * options.relativeValue)* options.pieceValue * tempPieceValue;
        }
        return boardWidth*options.relativeValue - distanceX * options.relativeValue;
    }
    else{
        if(options.pieceValue){
            return (boardHeight*options.relativeValue -distanceY * options.relativeValue)*options.pieceValue * tempPieceValue
        }
        return boardHeight*options.relativeValue -distanceY * options.relativeValue
    }
    
}


function defensiveCharacter(weight){
    if(!weight){
        weight = 0;
    }
    switch(weight){
        default:
        case 0:
            return [
                {method:evaluationMagnifierMaxOptions,options:{posValue:0.1, mask:positionMaskDefault}}, 
                {method:evaluationMagnifierPiece, options:{pieceValue:1}},
                {method:evaluationMagnifierKingTropism, options:{relativeValue:0.2,defendersSearch:true, onlyForMe:true}}
            ]
        case 1:
            return [
                {method:evaluationMagnifierMaxOptions,options:{posValue:0.1, mask:positionMaskDefault}}, 
                {method:evaluationMagnifierPiece, options:{pieceValue:1}},
                {method:evaluationMagnifierKingTropism, options:{relativeValue:0.2,defendersSearch:true, onlyForMe:true}},
                {method:evaluationMagnifierKingTropism, options:{relativeValue:0.1, onlyForMe:true}}
            ]

        case 2:
            return [
                {method:evaluationMagnifierMaxOptions,options:{posValue:0.1, mask:positionMaskDefault}}, 
                {method:evaluationMagnifierPiece, options:{pieceValue:4 }},
                {method:evaluationMagnifierKingTropism, options:{relativeValue:0.2,defendersSearch:true, onlyForMe:true}},
                {method:evaluationMagnifierKingTropism, options:{relativeValue:0.1, onlyForMe:true}},
                {method:evaluationMagnifierPieceDefended, options:{relativeValue:0.1, onlyForMe:true}}
            ]
    }
}


function offensiveCharacter(weight){
    if(!weight){
        weight = 0;
    }
    switch(weight){
        default:
        case 0:
            return [
                {method:evaluationMagnifierMaxOptions,options:{mask:positionMaskDefault,posValue:0.1}}, 
                {method:evaluationMagnifierPiece, options:{pieceValue:1 }},
                {method:evaluationMagnifierKingTropism, options:{relativeValue:0.3, onlyForEnemy:true, pieceValue:1}}
            ]
        case 1:
            return [
                {method:evaluationMagnifierMaxOptions,options:{mask:positionMaskDefault,posValue:0.1}}, 
                {method:evaluationMagnifierPiece, options:{pieceValue:1 }},
                {method:evaluationMagnifierKingTropism, options:{relativeValue:0.1, onlyForEnemy:true, pieceValue:1}},
                {method:evaluationMagnifierKingTropism, options:{relativeValue:0.1,defendersSearch:true, onlyForEnemy:true, pieceValue:1}},
            ]
        case 2:
            return [
                {method:evaluationMagnifierMaxOptions,options:{mask:positionMaskDefault,posValue:0.1}}, 
                {method:evaluationMagnifierPiece, options:{pieceValue:2 }},
                {method:evaluationMagnifierKingTropism, options:{relativeValue:0.1, onlyForEnemy:true, pieceValue:1}},
                {method:evaluationMagnifierKingTropism, options:{relativeValue:0.1,defendersSearch:true, onlyForEnemy:true, pieceValue:1}},
                {method:evaluationMagnifierPieceDefended, options:{relativeValue:0.1, onlyForEnemy:true,pieceAttacked:true}}
            ]
    }
}

function positionalOffensiveCharacter(weight){
    if(!weight){
        weight = 0;
    }
    switch(weight){
        default:
        case 0:
            return [
                {method:evaluationMagnifierMaxOptions,options:{mask:positionMaskDefault,posValue:0.2}}, 
                {method:evaluationMagnifierPiece, options:{pieceValue:1, }},
                {method:evaluationMagnifierKingTropism, options:{relativeValue:0.1, onlyForEnemy:true, pieceValue:2}}
            ]

        case 1:
            return [
                {method:evaluationMagnifierMaxOptions,options:{mask:positionMaskDefault,posValue:0.2,onlyForMe:true}}, 
                {method:evaluationMagnifierMaxOptions,options:{mask:positionMaskDefault,posValue:0.1,onlyForEnemy:true}}, 
                {method:evaluationMagnifierKingTropism, options:{relativeValue:0.1, onlyForEnemy:true, pieceValue:2}},
                {method:evaluationMagnifierPiece, options:{pieceValue:1 }},
                {method:evaluationMagnifierPieceDefended, options:{relativeValue:0.1, onlyForMe:true}}
            ]
    }
}

function positionalCharacter(weight){
    if(!weight){
        weight = 0;
    }
    switch(weight){
        default:
        case 0:
            return [
                {method:evaluationMagnifierMaxOptions,options:{mask:positionMaskDefault,posValue:0.2}}, 
                {method:evaluationMagnifierPiece, options:{pieceValue:1}}
            ]
        case 1:
            return [
                {method:evaluationMagnifierMaxOptions,options:{mask:positionMaskDefault,posValue:0.3,onlyForMe:true}}, 
                {method:evaluationMagnifierMaxOptions,options:{mask:positionMaskDefault,posValue:0.1,onlyForEnemy:true}}, 
                {method:evaluationMagnifierPiece, options:{pieceValue:1.5}},
                {method:evaluationMagnifierPieceDefended, options:{relativeValue:0.1}}
            ]
        case 2:
            return [
                {method:evaluationMagnifierMaxOptions,options:{mask:positionMaskDefault,posValue:0.3,onlyForMe:true}}, 
                {method:evaluationMagnifierMaxOptions,options:{mask:positionMaskDefault,posValue:0.1,onlyForEnemy:true}}, 
                {method:evaluationMagnifierPiece, options:{pieceValue:1.5}},
                {method:evaluationMagnifierPieceDefended, options:{relativeValue:0.1}},
                {method:evaluationMagnifierPieceDefended, options:{relativeValue:0.1, pieceAttacked:true,pieceValue:1}}

            ]
    }
}

function defaultCharacter(weight){
    
    switch(weight){
        default:
        case 0:
            return [
                {method:evaluationMagnifierMaxOptions,options:{posValue:0.1}},
                {method:evaluationMagnifierPiece, options:{pieceValue:1.5 }}
            ]
        case 1:
            return [
                {method:evaluationMagnifierMaxOptions,options:{posValue:0.1}},
                {method:evaluationMagnifierPiece, options:{pieceValue:1.5 }},
                {method:evaluationMagnifierPieceDefended, options:{relativeValue:0.1}}
            ]
        case 2:
            return [
                {method:evaluationMagnifierMaxOptions,options:{posValue:0.1}},
                {method:evaluationMagnifierPiece, options:{pieceValue:2 }},
                {method:evaluationMagnifierPieceDefended, options:{relativeValue:0.1}},
                {method:evaluationMagnifierPieceDefended, options:{relativeValue:0.1, pieceAttacked:true,pieceValue:1, onlyForMe:true}}
            ]
    }

}


function noPosition(){
    return [
        {method:evaluationMagnifierPiece, options:{pieceValue:1.1 }},
        // {method:evaluationMagnifierPieceDefended, options:{relativeValue:0.1}}
    ]
}


function maskedDefaultCharacter(weight){
    switch(weight){
        default:
        case 0:
            return [
                {method:evaluationMagnifierMaxOptions,options:{posValue:0.1,mask:positionMaskDefault}},
                {method:evaluationMagnifierPiece, options:{pieceValue:1 }}
            ]
    }
}

function rogueLikeCharacter(weight){
    switch(weight){
        default:
        case 0:
            return [
                {method:evaluationMagnifierMaxOptions,options:{posValue:0.1}},
                {method:evaluationMagnifierPiece, options:{pieceValue:1.5 }},
                {method:evaluationMagnifierKingVulnerability, options:{attackValue:2, proximityValue:0.3}}

            ]
    }
}