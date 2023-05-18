try{
    var { kingFactory, knightFactory, mongolianKnightFactory, bishopFactory, rookFactory, queenFactory, pawnFactory, weakPawn, dragonFactory ,unpromotablePawn,

        clownFactory, ricarFactory, horseFactory, hatFactory, ghostFactory, pigFactory, ladyBugFactory, queenBugFactory, goliathBugFactory, antFactory,
        shroomFactory, spiderFactory,
    
        swordsMen, pikeman, sleepingDragon,gargoyleFactory,fencer, shield, plagueDoctor, northernKing,
    
        cyborgFactory, executorFactory,crystalFactory,empoweredCrystalFactory,juggernautFactory,bootVesselFactory, electricCatFactory, scaryCatFactory, longCatFactory,
        fatCatFactory,
        blindCatFactory,
        cuteCatFactory,
        strongLadyBugFactory,
        newBrainBugFactory

        
    
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
    return board
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


function morphingRaceChoiceChess(state,raceWhite,raceBlack){
    raceChoiceChess(state,raceWhite,raceBlack);

    buildModal([
        {type:'objectives', classes:"",text:`After every move one of your pieces mutates to another one.`}
     ])

    state.specialOnMoveEffects= [
        function(state){
            let thePiece = getRandomPiece(state.pieces,state.turn)
            let morphIntoFunc = returnMorphingPoolPiece(thePiece)
            if(morphIntoFunc){
                let morphInto = returnMorphingPoolPiece(thePiece)(thePiece.color,thePiece.x,thePiece.y);
                state.pieces.splice(state.pieces.indexOf(thePiece),1);
                state.pieces.push(morphInto)

                state.board.forEach((square) => {
                    if(square.x != thePiece.x || square.y != thePiece.y){
                        square.special= false;
                    }
                    else{
                        square.special = true;
                    }
                })


            }


        }
    ]

    //Pick random piece

    //Pick
}

function returnMorphingPoolPiece(piece){
    let key = piece.icon.replace('white','').replace('black', '').replace('.png','');
    let arr = [];
    switch(key){
        case 'Pawn':
                arr = [cyborgFactory, antFactory, ghostFactory, swordsMen, pikeman]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'Knight':
                arr = [bootVesselFactory, executorFactory, spiderFactory, ricarFactory, pigFactory]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'Bishop':
                arr = [bootVesselFactory, executorFactory, spiderFactory, ricarFactory, pigFactory]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'Rook':
                arr = [goliathBugFactory, strongLadyBugFactory, horseFactory, dragonFactory]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'Queen':
                arr = [juggernautFactory, goliathBugFactory, dragonFactory]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'Ant':
                arr = [cyborgFactory, pawnFactory, ghostFactory, swordsMen, pikeman]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'GoliathBug':
                arr = [queenFactory, juggernautFactory, dragonFactory]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'Spider':
                arr = [knightFactory, bishopFactory, bootVesselFactory, executorFactory, ricarFactory]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'QueenBug':
                arr = [bishopFactory, bootVesselFactory, executorFactory, ricarFactory, pigFactory]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'LadyBug':
                arr = [rookFactory, horseFactory, dragonFactory, pigFactory]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'Ghost':
                arr = [cyborgFactory, pawnFactory, antFactory, swordsMen, pikeman]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'Horse':
                arr = [goliathBugFactory, dragonFactory, juggernautFactory, queenFactory]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'Clown':
                arr = [pawnFactory, cyborgFactory, antFactory, ghostFactory, swordsMen, pikeman, queenFactory]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'Ricar':
                arr = [bishopFactory, bootVesselFactory, executorFactory, queenBugFactory, spiderFactory]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'Pig':
                arr = [bishopFactory, bootVesselFactory, executorFactory, strongLadyBugFactory]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'Executor':
                arr = [knightFactory, bishopFactory, spiderFactory, strongLadyBugFactory, ricarFactory, pigFactory]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'Cyborg':
                arr = [pawnFactory, antFactory, ghostFactory, swordsMen, pikeman]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'Juggernaut':
                arr = [queenFactory, goliathBugFactory, dragonFactory]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'Bootvessel':
                arr = [knightFactory, bishopFactory, spiderFactory, ricarFactory, pigFactory]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        
        case 'Pikeman':
                arr = [pawnFactory, antFactory, cyborgFactory, ghostFactory, swordsMen]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'Swordsmen':
                arr = [pawnFactory, antFactory, cyborgFactory, ghostFactory, pikeman]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'Gargoyle':
                arr = [sleepingDragon]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'SleepingDragon':
                arr = [queenFactory, juggernautFactory, goliathBugFactory, dragonFactory, horseFactory]
                return arr[Math.floor(Math.random()*arr.length)]
            break;
        case 'Dragon':
            break;
        case 'Fencer':
                arr = [sleepingDragon]
                return arr[Math.floor(Math.random()*arr.length)]
            break;

        default:
                return false
            break;
        
    }


}

function getRandomPiece(pieces,color){
    let filteredPieces = pieces.filter((piece) => {
        return color === piece.color && !piece.icon.includes('Shroom.png') && !piece.icon.includes('King.png')
        && !piece.icon.includes('Hat.png') && !piece.icon.includes('PlagueDoctor.png')&& !piece.icon.includes('NorthernKing.png')
    })

    return filteredPieces[Math.floor(Math.random()*filteredPieces.length)];
}


function mongolianChess(state){
    pieces = state.pieces;
    board = state.board;
    pieces.length = 0;
    board.length = 0;
    buildModal([
        {type:'objectives', classes:"",text:`Whoever manages to step on the purple square and than step out of it wins the game.`}
     ])
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

    state.turn = 'white';

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
    let miniBoard = xyBoard(8,8,[]);

    let queenBug = queenBugFactory('white',4,4)
    lightBoardFE(queenBug,{board:miniBoard, pieces:[queenBug],turn:"white"},'lighted')
    buildModal([
        {type:'quote', classes:"",text:`There is an infestation here! There is no time to notify the others. <br/>
                                        <b>I have to save the village myself</b>.`,icon:"/blackKnight.png"},
        
        {type:'objectives', classes:"",text:`Leave no brood mothers on the board.`}
    ])

    buildPieceModal([
        {
            type:'piece',
            classes:"",
            board: miniBoard,
            icon:'blackQueenBug.png',
            pieceX:4,
            pieceY:4,
            description:`
                The brood mother can't move. Instead she spawns ants. <br/><br/> Ants move up to two blockable squares forward and promote to brood mothers when they reach the end of the board. </br> 
            `
        }
    ])
    state.specialOnMoveEffects = [
        function(state){
            if(state.pieces.length){
                let queenBug = state.pieces.find((piece) => {
                    return piece.icon.includes('QueenBug')
                })

                if(!queenBug){
                    state.won = 'black'
                    state.message='You won'
                    buildModal([
                        {type:'link', classes:"", text:'You won!',linkText:'Go to next level', link:`/hotseat?gameType=missionClassicBugsTwo&AIColor=white`}
                        
                    ])
                
                }

                let blackPiece = state.pieces.find((piece) => {
                    return piece.color === 'black';
                })

                if(!blackPiece){
                    state.won = 'white'
                    state.message='You lost'
                    buildModal([
                        {type:'link', classes:"", text:'You lost!',linkText:'Restart', link:`/hotseat?gameType=missionClassicBugsOne&AIColor=white`}
                        
                    ])
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
    // AIPower=5;

    buildModal([
        {type:'quote', classes:"",text:`My lord we are under attack. We might lose the battle. <br/><br/> We should evacuate you from here.`,icon:"/blackKnight.png"},
        {type:'objectives', text:`
            Get the prince to the end of the board or take all spiders. <br/><br/>
            Pawns are not promotable.
        `}
        
    ])

    let miniBord = xyBoard(8,8,[]);
    let spider = spiderFactory('white',4,4)

    lightBoardFE(spider,{board:miniBord, pieces:[spider],turn:"white"},'lighted')
    
    buildPieceModal([
        {
            type:'piece',
            classes:"",
            board: miniBord,
            icon:'blackSpider.png',
            pieceX:4,
            pieceY:4,
            description:`
                The spider can move both like a horse and like a king. </br> 
            `
        }
    ])
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

                    buildModal([
                        {type:'link', classes:"", text:'The prince is safe!',linkText:'Go to next level', link:`/hotseat?gameType=missionClassicBugsThree&AIColor=white`}
                        
                    ])
                }

                
            }
        }
    ]

    pieces.push(
        unpromotablePawn('black',4,1),
        unpromotablePawn('black',3,1),
        unpromotablePawn('black',2,1),
        unpromotablePawn('black',1,1),
        unpromotablePawn('black',0,1),

        bishopFactory('black',0,0),
        knightFactory('black', 1,0),
        kingFactory('black',2,0, {
            gameEndedEvent:function(colorWon){
                if(colorWon === 'white'){
                    buildModal([
                        {type:'link', text:"Defeat!!!", linkText:"Restart the mission", link:"/hotseat?gameType=missionClassicBugsFour&AIColor=white"}
                     ])
                }
            }
        }),
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
    pieces.length = 0;
    AIPower = 6;
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
                if(x%3 || (y === 7 && x == 3)|| (y === 0 && x == 6)|| (y === 4 && x === 3) || (y === 5 && x === 6)){
                    board.push({ light: false, x: x, y: y })
                }
        }
    }

    let miniBord = xyBoard(8,8,[]);
    let goliathBug = goliathBugFactory('white',4,4)

    lightBoardFE(goliathBug,{board:miniBord, pieces:[goliathBug],turn:"white"},'lighted')
    
    buildPieceModal([
        {
            type:'piece',
            classes:"",
            board: miniBord,
            icon:'blackGoliathBug.png',
            pieceX:4,
            pieceY:4,
            description:`
                The Goliath bug moves both like a king and a rook. </br> 
            `
        }
    ])

    buildModal([
        {type:'quote', classes:"",text:`The Shroom is at the end of the map. We need to take it even if we have to sacrifice ourselves. <br/><br/>Otherwise the insectoids willw in.`,icon:"/blackKnight.png"},
        {type:'objectives', text:`
            Get the immovable shroom. The Goliath Bug will attempt to sabotage you.
        `}
        
    ])

    state.specialOnMoveEffects = [
        function(state){
            let shrooms = state.pieces.filter((piece) => {
                return piece.icon.includes('whiteShroom.png')
            });

            let goliathBugs = state.pieces.filter((piece) => {
                return piece.icon.includes('whiteGoliathBug.png');
            })
            if(!shrooms.length || !goliathBugs.length){
                state.won = 'black';
                buildModal({type:'link', classes:"", text:'Mission accomplished!',linkText:'Go to next level', link:`/hotseat?gameType=missionClassicBugsFour&AIColor=white`})
            }

            let knights = state.pieces.filter((piece) => {
                return piece.icon.includes('blackKnight.png')
            })

            if(!knights.length){
                buildModal({type:'link', classes:"", text:'Mission failed',linkText:'Restart', link:`/hotseat?gameType=missionClassicBugsThree&AIColor=white`})

            }
            

        }
    ]



    pieces.push(
        goliathBugFactory('white',5,1),shroomFactory('white',7,7),
        knightFactory('black',1,0),knightFactory('black',2,6)

    )

}



function missionClassicBugsSix(state){
    pieces = state.pieces;
    board = state.board;
    pieces.length = 0;
    board.length = 0;
    xyBoard(8,8,board);



    pieces.push(
        pawnFactory('black',0,2),pawnFactory('black',1,2),pawnFactory('black',2,2),pawnFactory('black',3,2),
        pawnFactory('black',4,2),pawnFactory('black',5,2),pawnFactory('black',6,2),pawnFactory('black',7,2),pawnFactory('black',8,2),

        queenFactory('black',2,0),kingFactory('black',3,0), kingFactory('black',4,0), kingFactory('black',5,0),queenFactory('black',6,0),

        knightFactory('black',0,0),knightFactory('black',0,1),knightFactory('black',1,0),knightFactory('black',1,1),
        knightFactory('black',7,0),knightFactory('black',7,1),knightFactory('black',8,0),knightFactory('black',8,1),

        rookFactory('black',6,1),rookFactory('black',2,1),
        bishopFactory('black',3,1),bishopFactory('black',4,1),bishopFactory('black',5,1),


        antFactory('white',0,5),antFactory('white',1,5),antFactory('white',2,5),antFactory('white',3,5),
        antFactory('white',4,5),antFactory('white',5,5),antFactory('white',6,5),antFactory('white',7,5),antFactory('white',8,5),
        antFactory('white',0,6),antFactory('white',1,6),antFactory('white',2,6),antFactory('white',3,6),
        antFactory('white',4,6),antFactory('white',5,6),antFactory('white',6,6),antFactory('white',7,6),antFactory('white',8,6),
        ladyBugFactory('white',0,7),queenBugFactory('white',1,7),
        queenBugFactory('white',7,7),ladyBugFactory('white',8,7),
        queenBugFactory('white',2,7),queenBugFactory('white',6,7),
        goliathBugFactory('white',3,7),goliathBugFactory('white',4,7),goliathBugFactory('white',5,7),
        shroomFactory('white',3,8),shroomFactory('white',4,8),shroomFactory('white',5,8),

        spiderFactory('white',0,8),spiderFactory('white',1,8),spiderFactory('white',2,8),

        spiderFactory('white',6,8),spiderFactory('white',7,8),spiderFactory('white',8,8),
        )
}

function missionClassicBugsFive(parentState){
    pieces = parentState.pieces;
    board = parentState.board;
    pieces.length = 0;
    board.length = 0;
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
            if(!((y===5 && !(x==4 || x==3 || x==2 || x==5)) || (y===4 && !(x==4 || x==3 || x==2 || x==5)))){
                board.push({ light: false, x: x, y: y })
            }
        }
    }

    parentState.countDown = 18;

    buildModal([
        {type:'objectives', classes:"",text:`Survive 18 turns before the cavalry arrives and than take all the remaining enemies.`}
     ])
     parentState.specialOnMoveEffects = [
        function(state){
            if(state.turn === 'white'){
                state.countDown -=1;
            }
            state.message = state.countDown +" turns till the cavalry arrives"
            if(state.won === 'white'){
                buildModal([
                    {type:'link', text:"Defeat!!!", linkText:"Restart", link:"/hotseat?gameType=missionClassicBugsFive&AIColor=white"}
                 ])
            }

            if(state.countDown === 0){
                state.pieces = state.pieces.filter((piece) =>{
                    return piece.y !== 7
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

                let counter = 0;
                state.pieces.forEach((piece) => {

                    if(piece.icon.includes('Ladybug.png')){
                        counter++;
                        piece.value = 7.5;
                    }
                    else if(piece.icon.includes('Spider.png')){
                        counter++;
                        piece.value= 5.5;
                    }
                    else if(piece.icon.includes('Ant.png')){
                        counter++;
                        piece.value = 0.6;
                    }
                    else if(piece.icon.includes('GoliathBug.png')){
                        counter++;
                        piece.value = 7.5;
                    }
    
                })

                if(!counter){
                    buildModal([
                        {type:'link', text:"Victory!!!", linkText:"Go to next mission", link:"/hotseat?gameType=missionClassicBugsSix&AIColor=white"}
                     ])
                }
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

        kingFactory('black',4,0, {
            gameEndedEvent:function(colorWon){
                if(colorWon === 'white'){
                    buildModal([
                        {type:'link', text:"Defeat!!!", linkText:"Restart the mission", link:"/hotseat?gameType=missionClassicBugsFive&AIColor=white"}
                     ])
                }
            }
        }),

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



    buildModal([
        {type:'quote', classes:"",text:`Your majesties! The insectoids have found us unprepared. <br/><br/> We need to escape from here! `,icon:"/blackKing.png"},
        {type:'objectives', classes:"",text:`Reach the last row with your two kings. <br/><br/>Pawns cannot be  promoted.`}
     ])

     let miniBord = xyBoard(8,8,[]);
     let ladybug = strongLadyBugFactory('white',4,4)
     lightBoardFE(ladybug,{board:miniBord, pieces:[ladybug],turn:"white"},'lighted')
     buildPieceModal([
        {
            type:'piece',
            classes:"",
            board:miniBord ,
            icon:'blackLadyBug.png',
            pieceX:4,
            pieceY:4,
            description:`
                The lady bug moves one time horizontally or vertically and than threes times in each diagonal. <br/><br/>
                The movement is blockable and it's going to be stopped if any piece exist on the path.
            `
        }
    ])

    pieces.push(
        unpromotablePawn('black',3,4),
        unpromotablePawn('black',4,4),
        unpromotablePawn('black',5,4),
        unpromotablePawn('black',2,4),
        unpromotablePawn('black',3,2),
        unpromotablePawn('black',4,2),
        unpromotablePawn('black',5,2),
        unpromotablePawn('black',2,2),
        rookFactory('black',2,3),
        rookFactory('black',5,3),
        kingFactory('black',4,3, {
            gameEndedEvent:function(colorWon){
                if(colorWon === 'white'){
                    buildModal([
                        {type:'link', text:"Defeat!!!", linkText:"Restart the mission", link:"/hotseat?gameType=missionClassicBugsFour&AIColor=white"}
                     ])
                }
            }
        }),
        kingFactory('black',3,3, {
            gameEndedEvent:function(colorWon){
                if(colorWon === 'white'){
                    buildModal([
                        {type:'link', text:"Defeat!!!", linkText:"Restart the mission", link:"/hotseat?gameType=missionClassicBugsFour&AIColor=white"}
                     ])
                }
            }
        }),
    )

    pieces.push(
        strongLadyBugFactory('white',0,7),
        strongLadyBugFactory('white',7,7),
        strongLadyBugFactory('white',7,0),
        strongLadyBugFactory('white',0,0),
    )

}


function missionClassicMedievalSeven(state){
    pieces = state.pieces;
    pieces.length =0;
    board = state.board;
    board.length = 0;
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
            if( !(x === 4 && y === 4 || x === 3 && y === 3 || y === 3 && x === 4|| y === 4 && x === 3)){
                board.push({ light: false, x: x, y: y })
            }
        }
    }


    AIPower = 2;
    AICharacter = 'positionalOffensiveCharacter'
    buildModal([
        {type:'quote', classes:"",text:`The tree gods have crossed too many lines.</b> Peace is what we seek and peace is what we will get once we <b>KILL THEM</b>. `,icon:"/blackKing.png"},
        {type:'objectives', classes:"",text:`Take at least one of the magical hats and the forest will lose it's magic.`}
     ])

     let miniBord = xyBoard(8,8,[]);
     let hat = hatFactory('white',4,4)
     lightBoardFE(hat,{board:miniBord, pieces:[hat],turn:"white"},'lighted')
     buildPieceModal([
        {
            type:'piece',
            classes:"",
            board:miniBord ,
            icon:'blackHat.png',
            pieceX:4,
            pieceY:4,
            description:`
                The Hat is a lose condition piece.</br> You cannot "check" it but once you take it the forest gods lose the game.</br>
                The hat moves and takes like a rook and it can also move one diagonally without taking.
            `
        }
    ])

    pieces.push(
        ricarFactory('white',1,5),ricarFactory('white',2,5),ricarFactory('white',0,5),

        ricarFactory('white',5,5),ricarFactory('white',6,5),ricarFactory('white',7,5),

        hatFactory('white',7,7), pigFactory('white',6,7), pigFactory('white',5,7),

        hatFactory('white',0,7), pigFactory('white',1,7), pigFactory('white',2,7),

        clownFactory('white',3,7), clownFactory('white',4,7),

        horseFactory('white',3,5),        horseFactory('white',4,5),


        kingFactory('black',0,0), rookFactory('black',1,0), rookFactory('black',2,0),
        bishopFactory('black',5,0),bishopFactory('black',6,0), queenFactory('black',7,0),


        pawnFactory('black',0,2),pawnFactory('black',1,2),pawnFactory('black',2,2),
        pawnFactory('black',5,2),pawnFactory('black',6,2),pawnFactory('black',7,2),

        pawnFactory('black',0,1),pawnFactory('black',1,1),pawnFactory('black',2,1),
        pawnFactory('black',5,1),pawnFactory('black',6,1),pawnFactory('black',7,1),

        knightFactory('black',3,2),knightFactory('black',4,2)

    )
}



function missionClassicMedievalSix(state){
    pieces = state.pieces;
    pieces.length =0;
    board = state.board;
    board.length = 0;
    
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
            const shirinni = !(x==4 || x==3|| x==2 || x==5)
            const viso4inni = y ===0 || y ===1 || y === 2
            if(!((viso4inni && shirinni))){
                board.push({ light: false, x: x, y: y })
            }
        }
    }
    try{

        buildModal([
           {type:'quote', classes:"",text:`Sire, traitors have joined our enemy. <b>They ambushed us!</b>`,icon:"/blackRook.png"},
           {type:'quote', classes:"",text:`Destroy them all!!!`,icon:"/blackKing.png"},
           {type:'objectives', text:`Leave no enemy Knights or Crusaders on the field`},
        ])
    }catch(err){

    }
    pieces.push(
        pawnFactory('black',2,2),pawnFactory('black',3,2),pawnFactory('black',4,2),pawnFactory('black',5,2),
        knightFactory('black',2,1),knightFactory('black',3,1),knightFactory('black',4,1),knightFactory('black',5,1),
        bishopFactory('black',2,0),bishopFactory('black',3,0),queenFactory('black',4,0),kingFactory('black',5,0)
    )
    
    pieces.push(
        pawnFactory('white',1,4),pawnFactory('white',2,4),ghostFactory('white',3,4),ghostFactory('white',4,4),pawnFactory('white',5,4),pawnFactory('white',6,4),
        rookFactory('white',1,5),ricarFactory('white',2,5),knightFactory('white',3,5),knightFactory('white',4,5),ricarFactory('white',5,5),horseFactory('white',6,5),
    )

    state.specialOnMoveEffects = [
        function(state){
            let findHim = state.pieces.find((piece)=>{
                return piece.icon.includes('whiteRicar.png') || piece.icon.includes('whiteKnight.png'); 
            })

            if(!findHim){
                state.won = 'black';
                state.message='You won!'

                buildModal([
                    {type:'link', text:"Victory!!!", linkText:"Go to next mission", link:"/hotseat?gameType=missionClassicMedievalSeven&AIColor=white"}
                ])
            }
        }
    ]
}

function missionClassicMedievalFive(state){
    pieces = state.pieces;
    pieces.length =0;
    board = state.board;
    board.length = 0;
    state.turnsLeft = 30;
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
            board.push({ light: false, x: x, y: y })
        }
    }
    AIPower=5

    state.specialOnMoveEffects = [
        function(state){
            let findAllPieces = state.pieces.filter((piece) => {
                return piece.icon === 'whitePig.png' || piece.icon === 'blackBishop.png' || piece.icon === 'blackKnight.png'
            })

            if(findAllPieces.length < 5){
                state.won = 'white';
                buildModal([
                    {type:'link', text:"Defeat!!!", linkText:"Restart", link:"/hotseat?gameType=missionClassicMedievalFive&AIColor=white"}
                ])
            }

            let haveAllPigsFinished = state.pieces.filter((piece) => {
                return piece.icon === "whitePig.png" && piece.y === 0;
            })

            if(haveAllPigsFinished.length ===3){
                state.won = 'black';
                buildModal([
                    {type:'link', text:"Victory!!!", linkText:"Go to next mission", link:"/hotseat?gameType=missionClassicMedievalSix&AIColor=white"}
                ])
            }

            if(state.turn === 'white'){
                state.turnsLeft -=1;
            }

            if(state.turnsLeft > 0){
                state.message = state.turnsLeft+ ' turns left.'
            }
            else{
                state.message = "It's night time. We have to go back";
                state.won = 'white';
                blackSquareColor = '#2C3333';
                whiteSquareColor = '#CBE4DE';
                dangerSquareColor = '#E7907F';
                lightedSquareColor = '#0E8388';
                blockedSquareColor = '#CF6A4E';
                availableSquareColor = '#787F42';
                backgroundColor = '#2E4F4F';
                oldMoveSquareColor = '#D59148';
                buildModal([
                    {type:'link', text:"We were too late", linkText:"Restart", link:"/hotseat?gameType=missionClassicMedievalFive&AIColor=white"}
                ])
            }

        }
    ]
    try{
        let miniBord = xyBoard(8,8,[]);
        let pig = pigFactory('white',4,7)
        lightBoardFE(pig,{board:miniBord, pieces:[pig],turn:"white"},'lighted')
        buildModal([
            {type:'quote', classes:"reverse",text:`The animals have gone insane. We have to herd them back before we lose some..</b>`,icon:"/blackBishop.png"},
            {type:'quote', classes:"",text:`Why are they acting so strange? `,icon:"/blackKnight.png"},
            {type:'quote', classes:"reverse",text:`I have no idea but be very careful. There might be intruders.</b>`,icon:"/blackBishop.png"},
            {
                type:"objectives",
                text:`Herd the pigs to the end of the board without taking them. Scare them with your pieces and they will move.  <br/>
                Pigs protected by the crusader might ignore your threat too.
                
                </br></br>

                Scare multiple at once or non at all and the crusader might move instead, attempting to sabotage you. 
                
                </br></br>
                Don't lose a piece and herd the animals before night time.`
            }
        ])
        
        buildPieceModal([
            {
                type:'piece',
                classes:"",
                board:miniBord ,
                icon:'whitePig.png',
                pieceX:4,
                pieceY:7,
                description:`
                    The Pig can only move forward but it moves till the end of the line.
                `
            }
        ])
    }
    catch(err){

    }

    pieces.push(
        bishopFactory('black',7,0),knightFactory('black',7,6),

        ricarFactory('white',1,1),

        pigFactory('white',0,6),pigFactory('white',2,7),pigFactory('white',5,7)
        )
}

function missionClassicMedievalFour(state){
    xyBoard(5,5,state.board)
    AIPower = 5;
    state.pieces = [
        rookFactory('black',1,0),rookFactory('black',5,0),rookFactory('black',1,4),rookFactory('black',5,4),
        bishopFactory('black',2,2),
        ricarFactory('white',3,3)
    ]

    let miniBord = xyBoard(8,8,[]);
    let ricar = ricarFactory('white',4,4)
    lightBoardFE(ricar,{board:miniBord, pieces:[ricar],turn:"white"},'lighted')
    state.specialOnMoveEffects = [
        function(state){
            let whitePieces = state.pieces.filter((piece) => {
                return piece.color === 'white';
            })
            let blackPieces = state.pieces.filter((piece) => {
                return piece.color === 'black';
            })


            if(whitePieces < 1){
                state.won = 'black';
                state.message = "You won";
                buildModal(
                    [
                        {type:'link', text:"Victory!!!", linkText:"Go to the next mission", link:"/hotseat?gameType=missionClassicMedievalFive&AIColor=white"}
                    ]
                )
            }

            if(blackPieces.length < 5){
                state.won = 'white';
                state.message = "You lost"
                
                buildModal(
                    [
                        {type:'link', text:"Defeat!!!", linkText:"Repeat the mission", link:"/hotseat?gameType=missionClassicMedievalFour&AIColor=white"}
                    ]
                )
            }
        }
    ]

    buildModal([
        {type:'quote', classes:"",text:`Why are you standing against us brother?`,icon:"/blackRook.png"},
        {type:'quote', classes:"reverse",text:`You have desecrated the forests.`,icon:"/whiteRicar.png"},
        {type:'quote', classes:"",text:`So you betray your own?`,icon:"/blackRook.png"},
        {type:'quote', classes:"reverse",text:`I was never on your side to betray you.`,icon:"/whiteRicar.png"},
        {type:'objectives', text:"There should be no white pieces left on the board. <br/> Don't lose a piece."}
    ])
    buildPieceModal([
        {
            type:'piece',
            classes:"",
            board:miniBord ,
            icon:'whiteRicar.png',
            pieceX:4,
            pieceY:4,
            description:`
                The Crusader can jump through pieces like a knight. <br/><br/>

                If you take him and the square behind is free a ghost spawns there to avenge his comrade.
            `
        }
    ])
}

function missionClassicMedievalThree(state){
    pieces = state.pieces;
    pieces.length =0;
    board = state.board;
    board.length = 0;
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
            let checkOne = !(x === 3 && y === 3)
            let checkTwo = !(x === 3 && y === 4)
            let checkThree = !(x===4 && y === 4)
            let checkFour = !(x===2 && y === 5)
            let checkFive = !(x===1 && y ===5)
            let checkSix = !(x===1 && y ===6)
            let checkSeven = !(x===6 && y ===2)
            let checkEight = !(x===6 && y ===3)
            let checkNine = !(x===3 && y ===7)
            let checkTen = !(x===5 && y ===6)
            let checkEleven = !(x===7 && y ===5)
            let checkTwelve = !(x===0 && y ===3)

            let checks = checkOne && checkTwo && checkThree && checkFour && checkFive && checkSix && checkSeven
            && checkEight && checkNine && checkTen && checkEleven && checkTwelve
            if(checks){
                board.push({ light: false, x: x, y: y })
            }

        }
    }
    try{
        let miniBord = xyBoard(8,8,[]);
        let clown = clownFactory('white',4,4)
        let turnCounter = 0;
        lightBoardFE(clown,{board:miniBord, pieces:[clown],turn:"white"},'lighted')
        state.specialOnMoveEffects = [
            function(state){
                state.pieces.forEach((piece) => {
                    if(piece.icon === 'whiteClown.png'){
                        piece.value = 10;
                    }
                })

                blackSquareColor = '#2C3333';
                whiteSquareColor = '#CBE4DE';
                dangerSquareColor = '#E7907F';
                lightedSquareColor = '#0E8388';
                blockedSquareColor = '#CF6A4E';
                availableSquareColor = '#787F42';
                backgroundColor = '#2E4F4F';
                oldMoveSquareColor = '#D59148';
                let findOne = state.pieces.find((piece) => {
                    return piece.icon.includes('whiteClown.png')
                })
                state.message = 12 - turnCounter+' turns left until you lose'

                if(!findOne || state.won === 'black'){
                    state.message = 'You won'
                    state.won = 'black';
                    buildModal([
                        {type:'link', text:"Victory!!!", linkText:"Go to the next mission", link:"/hotseat?gameType=missionClassicMedievalFour&AIColor=white"}
                    ])
                }
                if(state.turn === 'white'){
                    turnCounter++;
                }
                if(turnCounter >= 12){
                    blackSquareColor = '#7D6650';
                    whiteSquareColor = '#F7DFDA';
                    dangerSquareColor = '#E7907F';
                    lightedSquareColor = '#B0A875';
                    blockedSquareColor = '#CF6A4E';
                    availableSquareColor = '#787F42';
                    backgroundColor = '#675442';
                    oldMoveSquareColor = '#D59148';
                    state.won = 'white'
                    state.message = 'You lost'

                    buildModal([
                        {type:'link', text:"Defeat!!!", linkText:"Repeat the mission", link:"/hotseat?gameType=missionClassicMedievalThree&AIColor=white"}
                    ])
                }


              
            }
        ]

        buildModal([
            {type:'quote', classes:"",text:`I will use the night to steal the Wood Gods potion and bring it to the king.</b>`,icon:"/blackRook.png"},
            {type:'objectives', text:"Take the immovable potion or all the clowns before the night is over."}

        ])
        buildPieceModal([
            {
                type:'piece',
                classes:"",
                board:miniBord ,
                icon:'whiteClown.png',
                pieceX:4,
                pieceY:4,
                description:`
                    The clown moves like a queen but it cannot take enemy pieces.</b>
                    He has the power to swap places with any other ally for the price of a turn.
                `
            }
        ])
    }
    catch(err){

    }

    pieces.push(
        rookFactory('black',2,6),
        clownFactory('white', 0, 2),
        clownFactory('white', 5, 5),
        clownFactory('white', 0, 6),
        clownFactory('white', 7, 7),
        kolbaFactory('white',7,0)
    )
}


function missionClassicMedievalTwo(state){
    pieces = state.pieces;
    pieces.length =0;
    board = state.board;
    board.length = 0;
    xyBoard(6,6,board);

    try{
        let miniBord = xyBoard(8,8,[]);
        let horse = horseFactory('white',4,4);

        lightBoardFE(horse,{board:miniBord, pieces:[horse],turn:"white"},'lighted')
        buildModal([
            {type:'quote', classes:"",text:`Today we are going to catch a <b>hornless unicorn</b>.`,icon:"/blackBishop.png"},
            {type:'quote', classes:"reverse",text:`You mean... like a horse?`,icon:"/blackPawn.png"},
            {type:'quote', classes:"",text:`No, you fool. Like an unicorn without a horn.`,icon:"/blackBishop.png"},
            {type:'objectives', classes:"",text:`Catch the unicorn. (Pawns can't be promoted without a king on the board)`},
        ])

        buildPieceModal([
            {
                type:'piece',
                classes:"",
                board:miniBord ,
                icon:'whiteHorse.png',
                pieceX:4,
                pieceY:4,
                description:`
                    The hornless unicorn can move horizontally, vertically and diagonally (like a queen) but only 3 squares in each direction.
                `
            }
        ])
    }
    catch(err){

    }

    state.specialOnMoveEffects = [ 
        function(state){
            let findWhitePiece = state.pieces.find((piece) => {
                return piece.color === 'white'
            })
            if(!findWhitePiece){
                state.won = 'black';
                buildModal([
                    {type:'link', text:"Victory!!!", linkText:"Go to the next mission", link:"/hotseat?gameType=missionClassicMedievalThree&AIColor=white"}
                ])
            }
        }
    ]
    pieces.push(
        unpromotablePawn('black',2,1),
        unpromotablePawn('black',3,1),
        unpromotablePawn('black',4,1),
        unpromotablePawn('black',5,2),
        unpromotablePawn('black',1,2),
        unpromotablePawn('black',2,0),
        unpromotablePawn('black',3,0),
        unpromotablePawn('black',4,0),
        unpromotablePawn('black',0,2),
        unpromotablePawn('black',6,2),
        unpromotablePawn('black',1,1),
        unpromotablePawn('black',5,1),

        bishopFactory('black',6,1),
        horseFactory('white',3,3)
    )
}

function missionClassicMedievalOne(state){
    pieces = state.pieces;
    pieces.length =0;
    board = state.board;
    board.length = 0;
    xyBoard(6,6,board);
    try{
        buildModal([
            {type:'quote', classes:"",text:`The forest is haunted. <br>Spending the night here will surely mean most of us will die.`,icon:"/blackBishop.png"},
            {type:'quote', classes:"reverse",text:`Can we not do it?`,icon:"/blackPawn.png"},
            {type:'quote', classes:"",text:`No. I really want to piss of the wood gods. <br> Don't worry about me. I will be save behind you.`,icon:"/blackBishop.png"},
            {type:'quote', classes:"reverse",text:`But who will take care of my cat?`,icon:"/blackPawn.png"},
            {type:'objectives', classes:"",text:`The night starts after you play your first move. Your bishop must survive till sunrise. (Pawns can't be promoted without a king on the board)`}
        ])
        let miniBord = xyBoard(8,8,[]);
        let ghost = ghostFactory('white',4,4)
        lightBoardFE(ghost,{board:miniBord, pieces:[ghost],turn:"white"},'lighted')
        buildPieceModal([
            {
                type:'piece',
                classes:"",
                board:miniBord ,
                icon:'whiteGhost.png',
                pieceX:4,
                pieceY:4,
                description:`
                    The Ghost can move to the two squares infront of it. It can jump through squares like a knight would.
                `
            }
        ])
    }
    catch(err){

    }

    state.countDown = 32;
    state.specialOnMoveEffects = [
        function(state){
            state.countDown-=1;

            if(state.countDown > 0){
                blackSquareColor = '#2C3333';
                whiteSquareColor = '#CBE4DE';
                dangerSquareColor = '#E7907F';
                lightedSquareColor = '#0E8388';
                blockedSquareColor = '#CF6A4E';
                availableSquareColor = '#787F42';
                backgroundColor = '#2E4F4F';
                oldMoveSquareColor = '#D59148';
                let line =  getRndInteger(0,6);
                if(findPieceByXY(state.pieces,line,6) === -1){
                    state.pieces.push(
                        ghostFactory('white',line,6)
                    )
                }
            }
            else{
                state.pieces = state.pieces.filter((piece) => {
                    return !piece.icon.includes('Ghost.png')
                })

                blackSquareColor = '#7D6650';
                whiteSquareColor = '#F7DFDA';
                dangerSquareColor = '#E7907F';
                lightedSquareColor = '#B0A875';
                blockedSquareColor = '#CF6A4E';
                availableSquareColor = '#787F42';
                backgroundColor = '#675442';
                oldMoveSquareColor = '#D59148';
                state.won = 'black';
                buildModal([
                    {type:'link', text:"Victory!!!", linkText:"Go to the next mission", link:"/hotseat?gameType=missionClassicMedievalTwo&AIColor=white"}
                ])
            }

            let bishop = state.pieces.find((piece)  => {
                return piece.icon.includes('Bishop.png')
            })

            if(bishop === undefined){
                state.won = 'white';
                buildModal([
                    {type:'link', text:"Defeat!!!", linkText:"Repeat the mission", link:"/hotseat?gameType=missionClassicMedievalOne&AIColor=white"}
                ])
            }
        }
    ]

    pieces.push(
        bishopFactory('black',3,0),
        unpromotablePawn('black',0,1),
        unpromotablePawn('black',1,1),
        unpromotablePawn('black',2,1),
        unpromotablePawn('black',3,1),
        unpromotablePawn('black',4,1),
        unpromotablePawn('black',5,1),
        unpromotablePawn('black',6,1),

        unpromotablePawn('black',0,0),
        unpromotablePawn('black',1,0),
        unpromotablePawn('black',2,0),
        unpromotablePawn('black',4,0),
        unpromotablePawn('black',5,0),
        unpromotablePawn('black',6,0)
    )
}


function missionClassicPromotersFive(state){
    let board = state.board;
    let pieces = state.pieces;
    board.length = 0;
    pieces.length = 0;
    board = xyBoard(7,7,board);
    //AIPower= -3;
    //AICharacter = 'offensiveCharacter'


    buildModal(
        [{type:'quote', text:`One of the false kings loyal to the usurper is trying to stage a coup at the capitol. <br/><br/>
                             The militia should stop him. 
        
        `,  icon:"blackPawn.png"},
         {type:'objectives',text:`
            Capture the enemy Northern King. <br/> If he moves two times he will promote all swordsmen and pikeman to knights.
         `}
        ]
    )

    let miniBord = xyBoard(8,8,[]);
    let wFencer = bishopFactory('white',4,4)

    AIPower = -4;
    

    lightBoardFE(wFencer,{board:miniBord, pieces:[wFencer],turn:"white"},'lighted')
    buildPieceModal([
        {
            type:'piece',
            classes:"",
            board:miniBord ,
            icon:'whiteFencer.png',
            pieceX:4,
            pieceY:4,
            description:`
                The fencer moves diagonally with speed depending on how many moves the Northern King have made. <br/>
                It can jump through pieces like a knight.
            `
        }
    ])

    state.specialOnMoveEffects = [
        function(state){
            let i = 4;
            let nKing = state.pieces.filter((piece) => {
                return piece.icon.includes('NorthernKing.png')
            })

            if(!nKing){
                buildModal([
                    {type:'link', text:"You Won!!!", linkText:"Go to the next adventure", link:"/hotseat?gameType=missionClassicPromotersFive&AIColor=white"}
                ])
            }
            else if(nKing.y === 0){
                buildModal([
                    {type:'link', text:"You Lost!!!", linkText:"Restart", link:"/hotseat?gameType=missionClassicPromotersFour&AIColor=white"}
                ])
            }

            while(i>=0){
                let winingPiece = state.pieces[findPieceByXY(state.pieces,i,4)]
                if(!(winingPiece != undefined && winingPiece.icon.includes('Pawn.png'))){
                    youWin = false;
                }
                i-=1;
            }
        }
    ]

    pieces.push(

        fencer('white',0,7),fencer('white',1,7),fencer('white',2,7),fencer('white',3,7),northernKing('white',7,7),

        pawnFactory('black',4,0),pawnFactory('black',5,0),pawnFactory('black',6,0),kingFactory('black',7,0),
        pawnFactory('black',4,1),pawnFactory('black',5,1),pawnFactory('black',6,1),pawnFactory('black',7,1),
        pawnFactory('black',4,2),pawnFactory('black',5,2),pawnFactory('black',6,2),pawnFactory('black',7,2)
    )
}

function missionClassicPromotersFour(state){
    let board = state.board;
    let pieces = state.pieces;
    board.length = 0;
    pieces.length = 0;
    board = xyBoard(4,6,board);
    //AIPower= -3;
    //AICharacter = 'offensiveCharacter'


    buildModal(
        [{type:'quote', text:`One of the false kings loyal to the usurper is trying to stage a coup at the capitol. <br/><br/>
                             The militia should stop him. 
        
        `,  icon:"blackPawn.png"},
         {type:'objectives',text:`
            Capture the enemy Northern King. <br/> If he moves two times he will promote all swordsmen and pikeman to knights.
         `}
        ]
    )

    let miniBord = xyBoard(8,8,[]);
    let nKing = northernKing('white',4,4)
    


    lightBoardFE(nKing,{board:miniBord, pieces:[nKing],turn:"white"},'lighted')
    buildPieceModal([
        {
            type:'piece',
            classes:"",
            board:miniBord ,
            icon:'whiteNorthernKing.png',
            pieceX:4,
            pieceY:4,
            description:`
                The northern king can only move  and take one forward. <br/>
                When he gets to certain rank (map dependant) he promotes all level 1 pieces to classic Knights. 
                </br>When he moves forward he makes the Fencer piece stronger. 
                </br>If he gets to the end of the board the promoters win. 
                <br/><br/>
                The Northern King is a lose condition piece. If you take him and there are no other Northern Kings or Archeologists the opponent loses.
            `
        }
    ])

    state.specialOnMoveEffects = [
        function(state){
            let i = 4;
            let nKing = state.pieces.filter((piece) => {
                return piece.icon.includes('NorthernKing.png')
            })

            if(!nKing){
                buildModal([
                    {type:'link', text:"You Won!!!", linkText:"Go to the next adventure", link:"/hotseat?gameType=missionClassicPromotersFive&AIColor=white"}
                ])
            }
            else if(nKing.y === 0){
                buildModal([
                    {type:'link', text:"You Lost!!!", linkText:"Restart", link:"/hotseat?gameType=missionClassicPromotersFour&AIColor=white"}
                ])
            }

            while(i>=0){
                let winingPiece = state.pieces[findPieceByXY(state.pieces,i,4)]
                if(!(winingPiece != undefined && winingPiece.icon.includes('Pawn.png'))){
                    youWin = false;
                }
                i-=1;
            }
        }
    ]

    pieces.push(

        pikeman('white',0,5),pikeman('white',1,5),northernKing('white',2,5, {yTrigger:3}),pikeman('white',3,5),pikeman('white',4,5),

        knightFactory('black',0,0),knightFactory('black',1,0),knightFactory('black',3,0),knightFactory('black',4,0)
    )
}

function test(state){

    let board = state.board;
    let pieces = state.pieces;
    board.length = 0;
    pieces.length = 0;

    board = xyBoard(5,7,board)

    pieces.push(
        juggernautFactory('black',2,3),bishopFactory('white',4,3),kingFactory('white',4,4),bishopFactory('white',2,4)
    )
}

function missionClassicPromotersThree(state){
    let board = state.board;
    let pieces = state.pieces;
    board.length = 0;
    pieces.length = 0;

    board = xyBoard(5,7,board)

    state.board.forEach((sq) => {
        if(sq.y === 4){
            sq.special = true;
        }
    })

    buildModal([
        {type:'quote', text:`If we don't kill  the rebelion quickly it might get worse. We need to be swift. 
        
        `,  icon:"blackPawn.png"},


        {type:'objectives', text:`
        Place a pawn on each of the special squares to pacify rebels. <br/>
        Your pawns can't be promoted and they get instantly spawned on the first row once the square is free.
        `}
    ])

    let miniBord = xyBoard(8,8,[]);
    let theShield = shield('white',4,4)
    lightBoardFE(theShield,{board:miniBord, pieces:[theShield],turn:"white"},'lighted')
    buildPieceModal([
        {
            type:'piece',
            classes:"",
            board:miniBord ,
            icon:'whiteShield.png',
            pieceX:4,
            pieceY:4,
            description:`
                The defender moves and takes fully to the left and right but only one up and bottom.
            `
        }
    ])
    state.countDown = 55;
    state.specialOnMoveEffects = [
        function(state){
            let i = 5;
            let youWin = true;
            
            if(state.turn === 'white' && state.countDown > 0){
                state.countDown -= 1;
                state.message= state.countDown + " turns to pacify the rebels"
            }
            else if(state.countDown === 0){
                buildModal([
                    {type:'link', text:"Defeat!!!", linkText:"Restart", link:"/hotseat?gameType=missionClassicPromotersThree&AIColor=white"}
                ])

                state.message = "The rebels inspired, a revolution. You lost."
            }


            while(i>=0){
                if(findPieceByXY(state.pieces,i,0) === -1){
                    state.pieces.push(
                        unpromotablePawn('black',i,0)
                    )
                }

                let winingPiece = state.pieces[findPieceByXY(state.pieces,i,4)]
                if(!(winingPiece != undefined && winingPiece.icon.includes('Pawn.png'))){
                    youWin = false;
                }
                i-=1;
            }
            if(youWin){
                state.won = 'black';
                state.message = "You won!"
                buildModal([
                    {type:'link', text:"You Won!!!", linkText:"Go to the next adventure", link:"/hotseat?gameType=missionClassicPromotersFour&AIColor=white"}
                ])
            }
        }
    ]

    pieces.push(
        shield('white',0,4)                                                                                                  ,shield('white',5,4),
        swordsMen('white',0,5),swordsMen('white',1,5),swordsMen('white',2,5),swordsMen('white',3,5),swordsMen('white',4,5),swordsMen('white',5,5),
        shield('white',0,6)                                                                                                  ,shield('white',5,6),
        pikeman('white',0,7),pikeman('white',1,7),pikeman('white',2,7),pikeman('white',3,7),pikeman('white',4,7)            ,pikeman('white',5,7),


        // pawnFactory('black',0,2),pawnFactory('black',1,2),pawnFactory('black',2,2),pawnFactory('black',3,2),pawnFactory('black',4,2),pawnFactory('black',5,2),
        // pawnFactory('black',0,1),pawnFactory('black',1,1),pawnFactory('black',2,1),pawnFactory('black',3,1),pawnFactory('black',4,1),pawnFactory('black',5,1),
        unpromotablePawn('black',0,0),unpromotablePawn('black',1,0),unpromotablePawn('black',2,0),unpromotablePawn('black',3,0),unpromotablePawn('black',4,0),unpromotablePawn('black',5,0),
    )
}

function missionClassicPromotersTwo(state){
    let board = state.board;
    let pieces = state.pieces;
    board.length = 0;
    pieces.length = 0;
    AIPower = -2;
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
            let shirini = x === 1 || x === 2 || x ===3
            let viso4inni = y === 3 || y === 4

            if(!(viso4inni && !shirini)){
                board.push({  x: x, y: y })
            }

        }
    } 

    let miniBord = xyBoard(8,8,[]);
    let ghost = pikeman('white',4,4)
    lightBoardFE(ghost,{board:miniBord, pieces:[ghost],turn:"white"},'lighted','blocked')

    buildModal([
        {type:'quote', text:`Surrender now usurper and your blood shall be spared.
        
        `,  icon:"blackRook.png"},
        {type:'quote', classes:'reverse', text:"You can't breach the gates. It's your blood your sparing.",  icon:"whiteKing.png"},

        {type:'objectives', text:`
            Mate the enemy king.
        `}
    ])
    buildPieceModal([
        {
            type:'piece',
            classes:"",
            board:miniBord ,
            icon:'whitePikeman.png',
            pieceX:4,
            pieceY:4,
            description:`
                The pikeman can move without taking, directly infront of him and to the left and right but it attacks the 3 squares 2 infront of him. <br/>
                Can attack : [y:2, x:-1], [y:2, x:0], [y:2, x:1] 
                <br/>
                Can move: [y:1,x:0], [y:0,x:1],[y:0,x:-1]
                
                <br/>
                (where x:0 y:0 is the position of the pikeman)

            `
        }
    ])
    
    board.push({
        y:3,
        x:7
    })
    pieces.push(
        pikeman('white',1,6),pikeman('white',2,6),pikeman('white',3,6),
        pikeman('white',1,5),pikeman('white',2,5),pikeman('white',3,5),
        swordsMen('white',1,3),swordsMen('white',2,3),swordsMen('white',3,3),
        swordsMen('white',1,4),swordsMen('white',2,4),swordsMen('white',3,4),
        kingFactory('white',0,7,{
            gameEndedEvent:function(colorWon){
                if(colorWon === 'black'){
                    buildModal([
                        {type:'link', text:"Victory!!!", linkText:"You Won!", link:"/hotseat?gameType=missionClassicPromotersThree&AIColor=white"}
                     ]) 
                }
            }
        }),


        rookFactory('black',7,0),rookFactory('black',6,0),knightFactory('black',0,0),knightFactory('black',2,0)
    )
    
    
}

function missionClassicPromotersOne (state){
    state.board = xyBoard(5,4,state.board)
    state.pieces = [];

    state.board.forEach((sq) => {
        if(sq.y === 2){
            sq.special = true;
        }
    })
    state.pieces.push(
        swordsMen('white',0,4) ,swordsMen('white',1,4), swordsMen('white',2,4),swordsMen('white',3,4), swordsMen('white',4,4),swordsMen('white',5,4),


        unpromotablePawn('black',0,0) ,unpromotablePawn('black',1,0), unpromotablePawn('black',2,0),unpromotablePawn('black',3,0), unpromotablePawn('black',4,0),unpromotablePawn('black',5,0),

    )
    buildModal([
        {type:'quote', text:`The King gave an order that anyone who fought in the Northern wars should leave their weapons and go back to the capitol.
                            </br> Come on men. Let's not turn this into a theater.
        
        `,  icon:"blackPawn.png"},
        {type:'quote', classes:'reverse', text:"The king should tell us this himself. It's his war we won with our blood.",  icon:"whiteSwordsmen.png"},
        {type:'quote', text:`The law states...

        `,  icon:"blackPawn.png"},
        {type:'quote', classes:'reverse', text:"Don't quote laws to men with swords.",  icon:"whiteSwordsmen.png"},

        {type:'objectives', text:`
        Place a pawn on each of the special squares to pacify the swordsmen. <br/>

        Pawns can't be promoted.
        `}
    ])

    let miniBord = xyBoard(8,8,[]);
    let sMen = swordsMen('white',4,4)
    lightBoardFE(sMen,{board:miniBord, pieces:[sMen],turn:"white"},'lighted')
    buildPieceModal([
        {
            type:'piece',
            classes:"",
            board:miniBord ,
            icon:'whiteSwordsmen.png',
            pieceX:4,
            pieceY:4,
            description:`
                The swordsmen can move and take on the three squares in front of him.
            `
        }
    ])
    state.specialOnMoveEffects = [
        function(state){
            let i = 5;
            let youWin = true;

            while(i>=0){
                if(findPieceByXY(state.pieces,i,0) === -1){
                    state.pieces.push(
                        unpromotablePawn('black',i,0)
                    )
                }

                if(findPieceByXY(state.pieces,i,4) === -1){
                    state.pieces.push(
                        swordsMen('white',i,4)
                    )
                }
                let winingPiece = state.pieces[findPieceByXY(state.pieces,i,2)]
                if(!(winingPiece != undefined && winingPiece.icon.includes('Pawn.png'))){
                    youWin = false;
                }
                i-=1;
            }
            if(youWin){
                state.won = 'black';
                buildModal([
                    {type:'link', text:"You Won!!!", linkText:"Go to the next adventure", link:"/hotseat?gameType=missionClassicPromotersTwo&AIColor=white"}
                ])
            }
        }
    ]
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
        missionClassicBugsFour:missionClassicBugsFour,
        missionClassicBugsFive:missionClassicBugsFive,
        missionClassicBugsSix:missionClassicBugsSix,
        test:test,
        morphingRaceChoiceChess:morphingRaceChoiceChess
    };
}
catch(err){

}