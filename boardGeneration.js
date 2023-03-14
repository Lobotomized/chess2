try{
    var { kingFactory, knightFactory, mongolianKnightFactory, bishopFactory, rookFactory, queenFactory, pawnFactory, weakPawn, dragonFactory ,unpromotablePawn,

        clownFactory, ricarFactory, horseFactory, hatFactory, ghostFactory, pigFactory, ladyBugFactory, queenBugFactory, goliathBugFactory, antFactory,
        shroomFactory, spiderFactory,
    
        swordsMen, pikeman, sleepingDragon,gargoyleFactory,fencer, shield, plagueDoctor, northernKing,
    
        cyborgFactory, executorFactory,crystalFactory,empoweredCrystalFactory,juggernautFactory,bootVesselFactory, electricCatFactory, scaryCatFactory, longCatFactory,
        fatCatFactory,
        blindCatFactory,
        cuteCatFactory,
        strongLadyBugFactory

        
    
    } = require('./pieceDefinitions')
}

catch(err){
}

function prohodBoard(board){
    board.length = 0;
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
            if(!((y===4 && !(x==4 || x==3)) || (y===3 && !(x==4 || x==3)))){
                board.push({ light: false, x: x, y: y })
            }

        }
    }
}

function xyBoard(byX,byY,board){
    board.length = 0;
    for (let x = 0; x <= byX; x++) {
        for (let y = 0; y <= byY; y++) {
                
                board.push({ light: false, x: x, y: y })
        }
    }
}

function raceChess(state){
    pieces = state.pieces;
    board = state.board;
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

function prohodRaceChoiceChess(state,raceWhite,raceBlack){
    raceChoiceChess(state,raceWhite,raceBlack);
    board.length = 0;
    prohodBoard(board)

}





function raceChoiceChess(state,raceWhite,raceBlack){
    pieces = state.pieces;
    console.log(state)
    board = state.board;
    pieces.length = 0;
    if(!board.length){
        for (let x = 0; x <= 7; x++) {
            for (let y = 0; y <= 7; y++) {
                    
                    board.push({ light: false, x: x, y: y })
            }
        }
    }

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
    else if(raceBlack === 'promoters'){
        pieces.push(
            pikeman('black', 0,2), swordsMen('black',1,2),pikeman('black', 2,2), swordsMen('black',3,2),swordsMen('black', 4,2), pikeman('black',5,2),swordsMen('black', 6,2), pikeman('black',7,2),
                shield('black',1,1),                                                                                              shield('black',6,1),
        sleepingDragon('black',0,0),gargoyleFactory('black',1,0),gargoyleFactory('black',2,0), plagueDoctor('black',3,0),northernKing('black',4,0), fencer('black',5,0),fencer('black',6,0), sleepingDragon('black',7,0)
        )
    }
    else if(raceBlack == 'cyborgs'){
       pieces.push(
            cyborgFactory('black',0,2),   cyborgFactory('black',1,2),cyborgFactory('black',2,2),        cyborgFactory('black',3,2),    cyborgFactory('black',4,2),      cyborgFactory('black',5,2), cyborgFactory('black',6,2),    cyborgFactory('black',7,2),
            juggernautFactory('black',0,0),crystalFactory('black',1,0),  executorFactory('black',2,0), bootVesselFactory('black',3,0),   bootVesselFactory('black',4,0),executorFactory('black', 5,0), empoweredCrystalFactory('black',6,0),juggernautFactory('black',7,0),
            )
    }
    else if(raceBlack==='cat'){
        pieces.push(
            electricCatFactory('black', 0, 2),electricCatFactory('black', 1, 1),electricCatFactory('black', 2, 2),electricCatFactory('black', 3, 1),
            electricCatFactory('black', 4, 1),electricCatFactory('black', 5, 2),electricCatFactory('black', 6, 1),electricCatFactory('black', 7, 2),

            fatCatFactory('black', 0, 0),scaryCatFactory('black', 1, 0),longCatFactory('black', 2, 0),cuteCatFactory('black', 3, 0),
            blindCatFactory('black', 4, 0),longCatFactory('black', 5, 0),scaryCatFactory('black', 6, 0),fatCatFactory('black', 7, 0),
             )
    }
    else if(raceBlack == 'test'){
        pieces.push(
            pikeman('black', 2,2), rookFactory('white', 0, 2),rookFactory('white', 0, 6),rookFactory('black',0,0),rookFactory('black',7,7)

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
        sleepingDragon('white',0,7),gargoyleFactory('white',1,7),gargoyleFactory('white',2,7), plagueDoctor('white',3,7),northernKing('white',4,7), fencer('white',5,7),fencer('white',6,7), sleepingDragon('white',7,7),
        )
   
    }
    else if(raceWhite === 'cyborgs'){
        pieces.push(
            cyborgFactory('white',0,5),   cyborgFactory('white',1,5),cyborgFactory('white',2,5),        cyborgFactory('white',3,5),    cyborgFactory('white',4,5),      cyborgFactory('white',5,5), cyborgFactory('white',6,5),    cyborgFactory('white',7,5),
            juggernautFactory('white',0,7),crystalFactory('white',1,7),  executorFactory('white',2,7), bootVesselFactory('white',3,7),   bootVesselFactory('white',4,7),executorFactory('white', 5,7), empoweredCrystalFactory('white',6,7),juggernautFactory('white',7,7),
            )
    }
    else if(raceWhite == 'cat'){
        pieces.push(
            electricCatFactory('white', 0, 5),electricCatFactory('white', 1, 6),electricCatFactory('white', 2, 5),electricCatFactory('white', 3, 6),
            electricCatFactory('white', 4, 6),electricCatFactory('white', 5, 5),electricCatFactory('white', 6, 6),electricCatFactory('white', 7, 5),

            fatCatFactory('white', 0, 7),scaryCatFactory('white', 1, 7),longCatFactory('white', 2, 7),cuteCatFactory('white', 3, 7),
            blindCatFactory('white', 4, 7),longCatFactory('white', 5, 7),scaryCatFactory('white', 6, 7),fatCatFactory('white', 7, 7),
             )
    }
    else if(raceWhite == 'test'){
        pieces.push(
            crystalFactory('black', 0, 4)
            ,swordsMen('black', 6, 4),longCatFactory('white', 2, 7),cuteCatFactory('white', 3, 7)
             )
    }


}


function mongolianChess(state){
    pieces = state.pieces;
    board = state.board;
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

function miniChess(state){
    pieces = state.pieces;
    board = state.board;
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

function classicChess(state){
    pieces = state.pieces;
    board = state.board;
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

function randomChess(state){
    pieces = state.pieces;
    board = state.board;
    pieces.length = 0;
    board.length = 0;

    for (let x = 0; x <= 5; x++) {
        for (let y = 0; y <= 5; y++) {
            board.push({ light: false, x: x, y: y })
        }
    }
    pieces.push(kingFactory('black', 5, 0), kingFactory('white', 0, 5))

    for (let i = 0; i < 6; i++) {
        placeRandomFrontPiece(pieces,i,5,5)
        if(i>0){
            placeRandomPieces(pieces, i,5,5);
        }
    }

}

function hugeRandomChess(state){
    pieces = state.pieces;
    board = state.board;
    pieces.length = 0;
    board.length = 0;

    for (let x = 0; x <= 8; x++) {
        for (let y = 0; y <= 8; y++) {
            board.push({ light: false, x: x, y: y })
        }
    }
    pieces.push(kingFactory('black', 8, 0), kingFactory('white', 0, 8))

    for (let i = 0; i < 9; i++) {
        placeRandomFrontPiece(pieces,i,8,8)
        if(i>0){
            placeRandomPieces(pieces, i,8,8);
        }
    }

}

function grandRandomChess(state){
    pieces = state.pieces;
    board = state.board;
    pieces.length = 0;
    board.length = 0;

    for (let x = 0; x <= 10; x++) {
        for (let y = 0; y <= 10; y++) {
            board.push({ light: false, x: x, y: y })
        }
    }
    pieces.push(kingFactory('black', 10, 0), kingFactory('white', 0, 10))

    for (let i = 0; i < 9; i++) {
        placeRandomFrontPiece(pieces,i,10,10)
        if(i>0){
            placeRandomPieces(pieces, i,10,10);
        }
    }

}

function catchTheDragon(state){
    pieces = state.pieces;
    board = state.board;

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

function makeBoard(state) {
    pieces = state.pieces;
    board = state.board;
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

function placeRandomBug(pieces,x,y){
    const which = getRndInteger(1, 7)

    switch(which){
        case 1,2: pieces.push(strongLadyBugFactory('white',x,y))
        break;
        case 3,4: pieces.push(spiderFactory('white',x,y))
        break;
        case 5,6: pieces.push(goliathBugFactory('white',x,y))
        break;
        case 7: pieces.push(antFactory('white',x,y))
        break;
    }
}   

function placeRandomFrontPiece(pieces,next,maxX, maxY) {
    const which = getRndInteger(1, 7)

    let blackNext = {
        x: next,
        y: 1
    };

    let whiteNext = {
        x: next,
        y: maxY-1
    }
    if (next > maxX) {
        blackNext.x -= maxX;
        whiteNext.x -= maxX;
        blackNext.y = 1;
        whiteNext.y = maxY-1;
    }

    switch (which) {
        case 1:
            pieces.push(
                pawnFactory('black', maxX-blackNext.x, blackNext.y),
                pawnFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 2:
            pieces.push(
                ghostFactory('black', maxX-blackNext.x, blackNext.y),
                ghostFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 3:
            pieces.push(
                swordsMen('black', maxX-blackNext.x, blackNext.y),
                swordsMen('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 4:
            pieces.push(
                pikeman('black', maxX-blackNext.x, blackNext.y),
                pikeman('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 5:
            pieces.push(
                queenBugFactory('black', maxX-blackNext.x, blackNext.y),
                queenBugFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 6:
            pieces.push(
                antFactory('black', maxX-blackNext.x, blackNext.y),
                antFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 7:
            pieces.push(
                shield('black', maxX-blackNext.x, blackNext.y),
                shield('white', whiteNext.x, whiteNext.y)
            )
            break;
    

    }
}

function placeRandomPieces(pieces, next,maxX, maxY) {
    const which = getRndInteger(1, 18)

    let blackNext = {
        x: next,
        y: 0
    };

    let whiteNext = {
        x: next,
        y: maxY
    }
    if (next > maxX) {
        blackNext.x -= maxX;
        whiteNext.x -= maxX;
        blackNext.y = 1;
        whiteNext.y = maxY;
    }

    switch (which) {
        case 1:
            pieces.push(
                bishopFactory('black', maxX-blackNext.x, blackNext.y),
                bishopFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 2:
            pieces.push(
                bishopFactory('black', maxX-blackNext.x, blackNext.y),
                bishopFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 3:
            pieces.push(
                rookFactory('black', maxX-blackNext.x, blackNext.y),
                rookFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 4:
            pieces.push(
                rookFactory('black', maxX-blackNext.x, blackNext.y),
                rookFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 5:
            pieces.push(
                knightFactory('black', maxX-blackNext.x, blackNext.y),
                knightFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 6:
            pieces.push(
                knightFactory('black', maxX-blackNext.x, blackNext.y),
                knightFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 7:
            pieces.push(
                knightFactory('black', maxX-blackNext.x, blackNext.y),
                knightFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 8:
            pieces.push(
                bishopFactory('black', maxX-blackNext.x, blackNext.y),
                bishopFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 9:
            pieces.push(
                queenFactory('black', maxX-blackNext.x, blackNext.y),
                queenFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 10:
            pieces.push(
                juggernautFactory('black', maxX-blackNext.x, blackNext.y),
                juggernautFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 11:
            pieces.push(
                executorFactory('black', maxX-blackNext.x, blackNext.y),
                executorFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 12:
            pieces.push(
                bootVesselFactory('black', maxX-blackNext.x, blackNext.y),
                bootVesselFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 13:
            pieces.push(
                ricarFactory('black', maxX-blackNext.x, blackNext.y),
                ricarFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 14:
            pieces.push(
                horseFactory('black', maxX-blackNext.x, blackNext.y),
                horseFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 15:
            pieces.push(
                queenBugFactory('black', maxX-blackNext.x, blackNext.y),
                queenBugFactory('white', whiteNext.x, whiteNext.y)
            )
            break;
        case 16:
            pieces.push(
                pigFactory('black',maxX-blackNext.x,blackNext.y),
                pigFactory('white',whiteNext.x,whiteNext.y)
            )
            break;
        case 17:
            pieces.push(
                shield('black',maxX-blackNext.x,blackNext.y),
                shield('white',whiteNext.x,whiteNext.y)            
            )
            break;
        case 18:
            pieces.push(
                clownFactory('black',maxX-blackNext.x,blackNext.y),
                clownFactory('white',whiteNext.x,whiteNext.y)            
            )
            break;
        
    }
}

function missionOne(state){
    pieces = state.pieces;
    board = state.board;
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
            const shirinni = !(x==4 || x==3|| x==2)
            const viso4inni = y ===0 || y ===1 || y === 2
            if(!((viso4inni && shirinni))){
                board.push({ light: false, x: x, y: y })
            }

        }
    }

    state.specialOnMoveEffects = [
        function(state){
            if(state.pieces.length){
                let whitePiece = state.pieces.find((piece) => {
                    return piece.color === 'white'
                })

                if(!whitePiece){
                    state.won = 'black';
                }
            }
        }
    ]
    pieces.length = 0;

    pieces.push(
        pawnFactory('black',2,2),pawnFactory('black',3,2),pawnFactory('black',4,2),
        knightFactory('black',2,1),knightFactory('black',3,1),knightFactory('black',4,1),
        rookFactory('black',2,0 ),kingFactory('black',3,0), rookFactory('black',4,0)
    )

    pieces.push(
        bishopFactory('white',7,6),bishopFactory('white',0,4),
        bishopFactory('white',7,5),bishopFactory('white',0,5),
        pawnFactory('white',2,4),pawnFactory('white',3,4),pawnFactory('white',4,4),
        pawnFactory('white',2,5),pawnFactory('white',3,5),pawnFactory('white',4,5),
    )

}


function missionTwo(state){
    pieces = state.pieces;
    board = state.board;
    xyBoard(7,7,board)
    pieces.length = 0;

    state.specialOnMoveEffects = [
        function(state){
            if(state.pieces.length){
                let whitePiece = state.pieces.find((piece) => {
                    return piece.color === 'white'
                })

                if(!whitePiece){
                    state.won = 'black';
                }
            }
        }
    ]

    pieces.push(
        knightFactory('black',0,0),knightFactory('black',0,2),knightFactory('black',0,1),
        knightFactory('black',1,0),knightFactory('black',1,2),knightFactory('black',1,1),
        knightFactory('black',2,0 ),knightFactory('black',2,1),knightFactory('black',2,2),

        pawnFactory('black',3,2),pawnFactory('black',4,2),
        knightFactory('black',3,1),knightFactory('black',4,1),
        kingFactory('black',4,0), queenFactory('black',3,0),

        knightFactory('black',5,0),knightFactory('black',5,1),knightFactory('black',5,2),
        knightFactory('black',6,0),knightFactory('black',6,1),knightFactory('black',6,2),
        knightFactory('black',7,0 ),knightFactory('black',7,1),knightFactory('black',7,2),
    )

    pieces.push(

        pawnFactory('white',0,7),pawnFactory('white',1,7),pawnFactory('white',2,7),
        pawnFactory('white',3,7),pawnFactory('white',4,7),pawnFactory('white',5,7),
        pawnFactory('white',6,7),pawnFactory('white',7,7),

        pawnFactory('white',0,6),pawnFactory('white',1,6),pawnFactory('white',2,6),
        pawnFactory('white',3,6),pawnFactory('white',4,6),pawnFactory('white',5,6),
        pawnFactory('white',6,6),pawnFactory('white',7,6),

        pawnFactory('white',0,5),pawnFactory('white',1,5),pawnFactory('white',2,5),
        pawnFactory('white',3,5),pawnFactory('white',4,5),pawnFactory('white',5,5),
        pawnFactory('white',6,5),pawnFactory('white',7,5),
        
    )
}




function missionClassicBugsOne(state){
    pieces = state.pieces;
    board = state.board;
    xyBoard(5,5,board)
    pieces.length = 0;
    state.specialOnMoveEffects = [
        function(state){
            if(state.pieces.length){
                let queenBug = state.pieces.find((piece) => {
                    return piece.icon.includes('QueenBug')
                })

                if(!queenBug){
                    state.won = 'black'
                }

                let blackPiece = state.pieces.find((piece) => {
                    return piece.color === 'black';
                })

                if(!blackPiece){
                    state.won = 'white'
                }
            }
        }
    ]

    pieces.push(
        knightFactory('black',4,5),
        
    )

    pieces.push(
        queenBugFactory('white',0,0),
        queenBugFactory('white',2,0),
        queenBugFactory('white',4,0)
    )

}

function missionClassicBugsTwo(state){
    pieces = state.pieces;
    board = state.board;
    xyBoard(4,6,board)
    pieces.length = 0;

    state.specialOnMoveEffects = [
        function(state){
            if(state.pieces.length){
                let whitePiece = state.pieces.find((piece) => {
                    return piece.color === 'white'
                })

                let endOfLine = state.pieces.find((piece) => {
                    return piece.icon.includes('King.png') && piece.y === 6
                })

                if(!whitePiece || endOfLine){
                    state.won = 'black';
                }

                
            }
        }
    ]

    pieces.push(
        pawnFactory('black',4,1),
        pawnFactory('black',3,1),
        pawnFactory('black',2,1),
        pawnFactory('black',1,1),
        pawnFactory('black',0,1),

        bishopFactory('black',0,0),
        knightFactory('black', 1,0),
        kingFactory('black',2,0),
        knightFactory('black', 3,0),
        bishopFactory('black', 4,0)
    )

    pieces.push(
        spiderFactory('white',0,6),
        spiderFactory('white',2,6),
        spiderFactory('white',4,6)
    )

}

function missionClassicBugsThree(state){
    pieces = state.pieces;
    board = state.board;
    xyBoard(7,7,board)
    pieces.length = 0;

    state.specialOnMoveEffects = [
        function(state){
            if(state.pieces.length){
                let whitePiece = state.pieces.find((piece) => {
                    return piece.color === 'white'
                })

                if(!whitePiece){
                    state.won = 'black';
                }
            }
        }
    ]

    pieces.push(

        knightFactory('black',7,1),
        knightFactory('black',6,1),
        knightFactory('black',7,0),
        knightFactory('black', 6,0),
        

        rookFactory('black',3,0),

        pawnFactory('black',3,1),
        pawnFactory('black',2,1),
        pawnFactory('black',4,1),
        pawnFactory('black',5,1),

        knightFactory('black',1,1),
        knightFactory('black',0,1),
        knightFactory('black',0,0),
        knightFactory('black', 1,0),

        bishopFactory('black',2,0),
        bishopFactory('black', 5,0),


        kingFactory('black',4,0),

    )

    pieces.push(
        queenBugFactory('white',0,7),
        goliathBugFactory('white',1,7),
        queenBugFactory('white',2,7),
        goliathBugFactory('white',3,7),
        queenBugFactory('white',4,7),
        goliathBugFactory('white',5,7),
        queenBugFactory('white',6,7),
        goliathBugFactory('white',7,7),

        antFactory('white',0,6),
        antFactory('white',1,6),
        antFactory('white',2,6),
        antFactory('white',3,6),
        antFactory('white',4,6),
        antFactory('white',5,6),
        antFactory('white',6,6),
        antFactory('white',7,6)        


    )

}

function missionClassicBugsFive(state){
    pieces = state.pieces;
    board = state.board;
    pieces.length = 0;
    board.length = 0;
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
            if(!((y===5 && !(x==4 || x==3 || x==2 || x==5)) || (y===4 && !(x==4 || x==3 || x==2 || x==5)))){
                board.push({ light: false, x: x, y: y })
            }
        }
    }

    state.countDown = 34;
    state.specialOnMoveEffects = [
        function(state){
            state.countDown -=1;
            if(state.countDown === 0){
                state.pieces = state.pieces.filter((piece) =>{
                    return !(piece.color === 'white' && piece.y === 7)
                })

                for(let i = 7; i>=0 ; i--){
                    state.pieces.push(knightFactory('black',i,7))
                }
            }
            else if(state.countDown > 0){
                state.pieces.forEach((piece) => {

                    if(piece.color === 'white'){
                        piece.value = 0.0001;
                    }
    
                })
                if(findPieceByXY(state.pieces,2,7) === -1){
                    placeRandomBug(state.pieces,2,7)
                }
                if(findPieceByXY(state.pieces,3,7) === -1){
                    placeRandomBug(state.pieces,3,7)
                }
                if(findPieceByXY(state.pieces,4,7) === -1){
                    placeRandomBug(state.pieces,4,7)
                }
                if(findPieceByXY(state.pieces,5,7) === -1){
                    placeRandomBug(state.pieces,5,7)
                }
            }
            else{
                state.pieces.forEach((piece) => {

                    if(piece.icon.includes('Ladybug.png')){
                        piece.value = 7.5;
                    }
                    else if(piece.icon.includes('Spider.png')){
                        piece.value= 5.5;
                    }
                    else if(piece.icon.includes('Ant.png')){
                        piece.value = 0.6;
                    }
                    else if(piece.icon.includes('GoliathBug.png')){
                        piece.value = 7.5;
                    }
    
                })
            }
            


        }
    ]


    pieces.push(
        spiderFactory('white',0,7),spiderFactory('white',1,7),
        spiderFactory('white',6,7),spiderFactory('white',7,7)
    )

    pieces.push(
        pawnFactory('black',2,4),pawnFactory('black',3,4),pawnFactory('black',4,4),pawnFactory('black',5,4),
        pawnFactory('black',1,3),pawnFactory('black',2,3),pawnFactory('black',3,3),pawnFactory('black',4,3),pawnFactory('black',5,3),pawnFactory('black',6,3),

        kingFactory('black',4,0),

        rookFactory('black',2,0),rookFactory('black',5,0),
        bishopFactory('black',0,0),bishopFactory('black',7,0)
    )
}


function missionClassicBugsFour(state){
    pieces = state.pieces;
    board = state.board;
    xyBoard(7,7,board)
    pieces.length = 0;
    

    state.specialOnMoveEffects = [
        function(state){
            if(state.pieces.length){
                let whitePiece = state.pieces.find((piece) => {
                    return piece.color === 'white'
                })

                let endOfLine = state.pieces.find((piece) => {
                    return piece.icon.includes('King.png') && piece.y !== 7
                })

                if(!whitePiece || !endOfLine){
                    state.won = 'black';
                }
            }
        }
    ]

    pieces.push(
        pawnFactory('black',3,4),
        pawnFactory('black',4,4),
        pawnFactory('black',5,4),
        pawnFactory('black',2,4),
        pawnFactory('black',3,2),
        pawnFactory('black',4,2),
        pawnFactory('black',5,2),
        pawnFactory('black',2,2),
        rookFactory('black',2,3),
        rookFactory('black',5,3),
        kingFactory('black',4,3),
        kingFactory('black',3,3),
    )

    pieces.push(
        strongLadyBugFactory('white',0,7),
        strongLadyBugFactory('white',7,7),
        strongLadyBugFactory('white',7,0),
        strongLadyBugFactory('white',0,0),
    )

}


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
try{
    module.exports = {
        miniChess:miniChess,
        randomChess: randomChess,
        catchTheDragon:catchTheDragon,
        mongolianChess:mongolianChess,
        classicChess : classicChess,
        raceChess: raceChess,
        raceChoiceChess: raceChoiceChess,
        hugeRandomChess:hugeRandomChess,
        grandRandomChess:grandRandomChess,
        prohodRaceChoiceChess:prohodRaceChoiceChess,
        missionOne:missionOne,
        missionTwo:missionTwo,
        missionClassicBugsOne:missionClassicBugsOne,
        missionClassicBugsTwo:missionClassicBugsTwo,
        missionClassicBugsThree:missionClassicBugsThree,
        missionClassicBugsFour:missionClassicBugsFour
    };
}
catch(err){

}