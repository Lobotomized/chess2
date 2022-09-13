const { kingFactory, knightFactory, mongolianKnightFactory, bishopFactory, rookFactory, queenFactory, pawnFactory, weakPawn, dragonFactory ,unpromotablePawn,

        clownFactory, ricarFactory, horseFactory, hatFactory, ghostFactory, pigFactory, ladyBugFactory, queenBugFactory, goliathBugFactory, antFactory,
        shroomFactory, spiderFactory,

        swordsMen, pikeman, sleepingDragon,kolba,fencer, shield, plagueDoctor, northernKing

} = require('./pieceDefinitions')



function raceChess(pieces, board){
    pieces.length = 0;
    board.length = 0;
    for (let x = 1; x <= 8; x++) {
        for (let y = 1; y <= 8; y++) {
                board.push({ light: false, x: x, y: y })
        }
    }
    pieces.push(rookFactory('black', 1,1), knightFactory('black', 2,1) ,
    bishopFactory('black', 3,1), queenFactory('black', 4,1),
    kingFactory('black', 5,1), bishopFactory('black', 6,1),
    knightFactory('black', 7,1), rookFactory('black', 8,1),
    pawnFactory('black', 1,2), pawnFactory('black', 2,2) ,
    pawnFactory('black', 3,2), pawnFactory('black', 4,2),
    pawnFactory('black', 5,2), pawnFactory('black', 6,2),
    pawnFactory('black', 7,2), pawnFactory('black', 8,2))

    pieces.push(
    clownFactory('white',2,1),ghostFactory('white',3,6),ghostFactory('white',4,6),ghostFactory('white',5,6),ghostFactory('white',6,6),clownFactory('white',7,1),
                            pigFactory('white',3,7),horseFactory('white',4,7),horseFactory('white',5,7),pigFactory('white',6,7),
                            ricarFactory('white',3,8),hatFactory('white',4,8),hatFactory('white',5,8),ricarFactory('white',6,8)
    )
}

function raceChoiceChess(pieces, board,raceWhite,raceBlack){
    pieces.length = 0;
    if(raceBlack == 'classic'){
        pieces.push(rookFactory('black', 0,0), knightFactory('black', 1,0) ,
        bishopFactory('black', 2,0), queenFactory('black', 3,0),
        kingFactory('black', 4,0), bishopFactory('black', 5,0),
        knightFactory('black', 6,0), rookFactory('black', 7,0),
        pawnFactory('black', 0,1), pawnFactory('black', 1,1) ,
        pawnFactory('black', 2,1), pawnFactory('black', 3,1),
        pawnFactory('black', 4,1), pawnFactory('black', 5,1),
        pawnFactory('black', 6,1), pawnFactory('black', 7,1))
    }
    else if(raceBlack == 'medieval'){
        pieces.push(
                                ghostFactory('black',2,2),ghostFactory('black',3,2),ghostFactory('black',4,2),ghostFactory('black',5,2),
                                pigFactory('black',2,1),  horseFactory('black',3,1),horseFactory('black',4,1),pigFactory('black',5,1),
            clownFactory('black',1,0),ricarFactory('black',2,0),hatFactory('black',3,0),hatFactory('black',4,0),ricarFactory('black',5,0),clownFactory('black',6,0),
            )
    }
    else if(raceBlack == 'bug'){
        pieces.push(
        antFactory('black',0,1),   queenBugFactory('black',1,1), antFactory('black',2,1),        antFactory('black',3,1),         antFactory('black',4,1),    antFactory('black',5,1),       queenBugFactory('black',6,1), antFactory('black',7,1),
        shroomFactory('black',0,0),spiderFactory('black',1,0),   ladyBugFactory('black',2,0),    goliathBugFactory('black',3,0),   goliathBugFactory('black',4,0),ladyBugFactory('black', 5,0), spiderFactory('black',6,0), shroomFactory('black',7,0)
        )
    }
    else if(raceWhite === 'promoters'){
        pieces.push(
            pikeman('black', 0,2), swordsMen('black',1,2),pikeman('black', 2,2), swordsMen('black',3,2),swordsMen('black', 4,2), pikeman('black',5,2),swordsMen('black', 6,2), pikeman('black',7,2),
                shield('black',1,1),                                                                                              shield('black',6,1),
        sleepingDragon('black',0,0),kolba('black',1,0),kolba('black',2,0), plagueDoctor('black',3,0),northernKing('black',4,0), fencer('black',5,0),fencer('black',6,0), sleepingDragon('black',7,0)
        )
    }

    if(raceWhite == 'classic'){
        pieces.push( rookFactory('white', 0,7), 
        knightFactory('white', 1,7) ,
        bishopFactory('white', 2,7), 
        queenFactory('white', 3,7),
        kingFactory('white', 4,7), bishopFactory('white', 5,7),
        knightFactory('white', 6,7), rookFactory('white', 7,7),
        pawnFactory('white', 0,6), pawnFactory('white', 1,6) ,
        pawnFactory('white', 2,6), pawnFactory('white', 3,6),
        pawnFactory('white', 4,6), pawnFactory('white', 5,6),
        pawnFactory('white', 6,6), pawnFactory('white', 7,6),)
    }
    else if(raceWhite == 'medieval'){
        pieces.push(
                                ghostFactory('white',2,5),ghostFactory('white',3,5),ghostFactory('white',4,5),ghostFactory('white',5,5),
                                pigFactory('white',2,6),  horseFactory('white',3,6),horseFactory('white',4,6),pigFactory('white',5,6),
                clownFactory('white',1,7),ricarFactory('white',2,7),hatFactory('white',3,7),hatFactory('white',4,7),ricarFactory('white',5,7),clownFactory('white',6,7)
            )
    }
    else if(raceWhite == 'bug'){
        pieces.push(
        antFactory('white',0,6),   queenBugFactory('white',1,6),antFactory('white',2,6),        antFactory('white',3,6),    antFactory('white',4,6),      antFactory('white',5,6), queenBugFactory('white',6,6),    antFactory('white',7,6),
        shroomFactory('white',0,7),spiderFactory('white',1,7),  ladyBugFactory('white',2,7), goliathBugFactory('white',3,7),   goliathBugFactory('white',4,7),ladyBugFactory('white', 5,7), spiderFactory('white',6,7),shroomFactory('white',7,7)
        )
    }
    else if(raceWhite === 'promoters'){
        pieces.push(
            pikeman('white', 0,5), swordsMen('white',1,5),pikeman('white', 2,5), swordsMen('white',3,5),swordsMen('white', 4,5), pikeman('white',5,5),swordsMen('white', 6,5), pikeman('white',7,5),
                    shield('white',1,6),                                                                                              shield('white',6,6),
        sleepingDragon('white',0,7),kolba('white',1,7),kolba('white',2,7), plagueDoctor('white',3,7),northernKing('white',4,7), fencer('white',5,7),fencer('white',6,7), sleepingDragon('white',7,7),
        )
   
    }


}


function mongolianChess(pieces,board){
    pieces.length = 0;
    board.length = 0;
    for (let x = 1; x <= 9; x++) {
        for (let y = 1; y <= 9; y++) {
            if(x == 5 && y == 5){
                board.push({ light: false, x: x, y: y, special:true })
            }
            else{
                board.push({ light: false, x: x, y: y })
            }
        }
    }

    for(let i = 9; i>0; i--){
        pieces.push(mongolianKnightFactory('black',i,1))
    }

    for(let i = 9; i>0; i--){
        pieces.push(mongolianKnightFactory('white',i,9))
    }
}

function miniChess(pieces, board){
    pieces.length = 0;
    board.length = 0;
    for (let x = 1; x <= 6; x++) {
        for (let y = 1; y <= 6; y++) {
            board.push({ light: false, x: x, y: y })
        }
    }

    pieces.push(
        rookFactory('black', 1,1), rookFactory('black', 6,1), 
        knightFactory('black', 2,1), knightFactory('black', 5,1),
        queenFactory('black', 3,1), kingFactory('black', 4,1),
    
        weakPawn('black', 1,2), weakPawn('black', 2,2), 
        weakPawn('black', 3,2), weakPawn('black', 4,2),
    
        weakPawn('black', 5,2), weakPawn('black', 6,2),
    
        rookFactory('white', 1,6), rookFactory('white', 6,6), 
        knightFactory('white', 2,6), knightFactory('white', 5,6),
        queenFactory('white', 3,6), kingFactory('white', 4,6),
    
        weakPawn('white', 1,5), weakPawn('white', 2,5), 
        weakPawn('white', 3,5), weakPawn('white', 4,5),
    
        weakPawn('white', 5,5), weakPawn('white', 6,5)
        )
}

function classicChess(pieces, board){
    pieces.length = 0;
    board.length = 0;

    for (let x = 1; x <= 8; x++) {
        for (let y = 1; y <= 8; y++) {
            board.push({ light: false, x: x, y: y })
        }
    }
    pieces.push(
        rookFactory('white', 1,8), 
        knightFactory('white', 2,8) ,
        bishopFactory('white', 3,8), 
        queenFactory('white', 4,8),
        kingFactory('white', 5,8), bishopFactory('white', 6,8),
        knightFactory('white', 7,8), rookFactory('white', 8,8),
        pawnFactory('white', 1,7), pawnFactory('white', 2,7) ,
        pawnFactory('white', 3,7), pawnFactory('white', 4,7),
        pawnFactory('white', 5,7), pawnFactory('white', 6,7),
        pawnFactory('white', 7,7), pawnFactory('white', 8,7),

        pawnFactory('black', 1,2), pawnFactory('black', 2,2) ,
        pawnFactory('black', 3,2), pawnFactory('black', 4,2),
        pawnFactory('black', 5,2), pawnFactory('black', 6,2),
        pawnFactory('black', 7,2), pawnFactory('black', 8,2),



       rookFactory('black', 1,1), knightFactory('black', 2,1) ,
        bishopFactory('black', 3,1), queenFactory('black', 4,1),
        kingFactory('black', 5,1), bishopFactory('black', 6,1),
        knightFactory('black', 7,1), rookFactory('black', 8,1)
    )
  
}

function randomChess(pieces,board){
    pieces.length = 0;
    board.length = 0;

    for (let x = 1; x <= 6; x++) {
        for (let y = 1; y <= 6; y++) {
            board.push({ light: false, x: x, y: y })
        }
    }
    pieces.push(kingFactory('black', 6, 1), kingFactory('white', 1, 6))
    pieces.push(
        weakPawn('white', 1,5), weakPawn('white', 2,5) ,
        weakPawn('white', 3,5), weakPawn('white', 4,5),
    
        weakPawn('white', 5,5), weakPawn('white', 6,5),
    
        weakPawn('black', 1,2), weakPawn('black', 2,2) ,
        weakPawn('black', 3,2), weakPawn('black', 4,2),
    
        weakPawn('black', 5,2), weakPawn('black', 6,2)
    )
    for (let i = 2; i <= 6; i++) {
        placeRandomPieces(pieces, i);
    }

}

function catchTheDragon(pieces, board){

    pieces.length = 0;
    board.length = 0;

    for (let x = 1; x <= 8; x++) {
        for (let y = 1; y <= 8; y++) {
            board.push({ light: false, x: x, y: y })
        }
    }
    for(let i = 1; i <= 8; i++){
        pieces.push(unpromotablePawn('white',i,7))
    }
    pieces.push(bishopFactory('white',3,8),bishopFactory('white',6,8))
    pieces.push(knightFactory('white',2,8),knightFactory('white',7,8))
    pieces.push(rookFactory('white',8,8),rookFactory('white',1,8))
    pieces.push(queenFactory('white',4,8),kingFactory('white',5,8))

    pieces.push(dragonFactory('black',5,1))


}

function makeBoard(pieces, board) {
    pieces.length = 0;
    board.length = 0;
    for (let x = 1; x <= 6; x++) {
        for (let y = 1; y <= 6; y++) {
            board.push({ light: false, x: x, y: y })
        }
    }

    //- RANDOM PIECES
    // pieces.push(kingFactory('black', 1, 1), kingFactory('white', 1, 8))

    // for (let i = 2; i <= 16; i++) {
    //     placeRandomPieces(pieces, i);
    // }


    pieces.push(
    rookFactory('black', 1,1), rookFactory('black', 6,1), 
    knightFactory('black', 2,1), knightFactory('black', 5,1),
    queenFactory('black', 3,1), kingFactory('black', 4,1),

    weakPawn('black', 1,2), weakPawn('black', 2,2), 
    weakPawn('black', 3,2), weakPawn('black', 4,2),

    weakPawn('black', 5,2), weakPawn('black', 6,2),

    rookFactory('white', 1,6), rookFactory('white', 6,6), 
    knightFactory('white', 2,6), knightFactory('white', 5,6),
    queenFactory('white', 3,6), kingFactory('white', 4,6),

    weakPawn('white', 1,5), weakPawn('white', 2,5), 
    weakPawn('white', 3,5), weakPawn('white', 4,5),

    weakPawn('white', 5,5), weakPawn('white', 6,5)
    )
    
    // TESTING
    // pieces.push(rookFactory('black',1,1), rookFactory('black',1,2))
    // pieces.push(kingFactory('white',8,8),rookFactory('white',8,1))
}

function placeRandomPieces(pieces, next) {
    const which = getRndInteger(1, 9)

    let blackNext = {
        x: next,
        y: 1
    };

    let whiteNext = {
        x: next,
        y: 6
    }
    if (next > 6) {
        blackNext.x -= 6;
        whiteNext.x -= 6;
        blackNext.y = 2;
        whiteNext.y = 5;
    }

    switch (which) {
        case 1:
            pieces.push(
                bishopFactory('black', 7-blackNext.x, blackNext.y),
                bishopFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 2:
            pieces.push(
                bishopFactory('black', 7-blackNext.x, blackNext.y),
                bishopFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 3:
            pieces.push(
                rookFactory('black', 7-blackNext.x, blackNext.y),
                rookFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 4:
            pieces.push(
                rookFactory('black', 7-blackNext.x, blackNext.y),
                rookFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 5:
            pieces.push(
                knightFactory('black', 7-blackNext.x, blackNext.y),
                knightFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 6:
            pieces.push(
                knightFactory('black', 7-blackNext.x, blackNext.y),
                knightFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 7:
            pieces.push(
                knightFactory('black', 7-blackNext.x, blackNext.y),
                knightFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 8:
            pieces.push(
                bishopFactory('black', 7-blackNext.x, blackNext.y),
                bishopFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 9:
            pieces.push(
                queenFactory('black', 7-blackNext.x, blackNext.y),
                queenFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    miniChess:miniChess,
    randomChess: randomChess,
    catchTheDragon:catchTheDragon,
    mongolianChess:mongolianChess,
    classicChess : classicChess,
    raceChess: raceChess,
    raceChoiceChess: raceChoiceChess
};