const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Map = require('./models/map'); // Import the Map model
app.use('/boardGeneration.js', express.static('./boardGeneration.js'))
app.use('/pieceDefinitions.js', express.static('./pieceDefinitions.js'))
app.use('/helperFunctions.js', express.static('./helperFunctions.js'))
app.use('/moveMethods.js', express.static('./moveMethods.js'))
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const newG = require('./globby').newIOServerV2;
const {miniChess, randomChess,  catchTheDragon, mongolianChess, classicChess, raceChess, raceChoiceChess, test,morphingRaceChoiceChess} = require('./boardGeneration.js')
const { selectPiece, playerMove, checkTurn, changeTurn, closeLights } = require('./moveMethods.js')
const pieceDefinitions = require('./pieceDefinitions.js');
const {kingFactory, hatFactory, shroomFactory, northernKing, empoweredCrystalFactory,blindCatFactory} = pieceDefinitions;

const iconToFactoryMap = {};
Object.keys(pieceDefinitions).forEach(key => {
    const factory = pieceDefinitions[key];
    if(typeof factory === 'function'){
        try {
            const piece = factory('white', 0, 0);
            if(piece && piece.icon){
                let iconName = piece.icon.replace('white', '').replace('.png', '');
                iconToFactoryMap[iconName] = factory;
            }
        } catch (e) {}
    }
});
const {lightBoardFE, checkRemi, getColorPieces} = require('./helperFunctions.js');
app.use('/static', express.static('public'))
app.use('/src', express.static('src'))



mongoose.connect('mongodb+srv://Lobotomy:Micasmu4ka@cluster0.tippd.mongodb.net/chess2')
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});



// app.use('/pieceDefinitions.js, express.static('pieces'))
// app.use('/boardGeneration.js', express.static('boardGeneration.js'))


let lobby = newG({properties:{
    baseState: {
        //Starting State
        gameType:'classic',
        board: [],
        pieceSelected: undefined,
        turn: 'white',
        white: undefined,
        black: undefined,
        whiteRace:undefined,
        blackRace: undefined,
        whiteClock: 6000,
        blackClock: 6000,
        pieces: [],
        won: undefined,
        message:'',
        started:false
    },
    moveFunction: function (player, move, state) {

        if(state.turn == 'menu'){

                if(player.ref == state.white){
                    if(move.x == 1  && move.y == 1){
                        state.whiteRace = 'classic'
                    }
                    else if(move.x === 1 && move.y ==2){
                        state.whiteRace = 'medieval'
                    }
                    else if(move.x === 1 && move.y ==3){
                        state.whiteRace = 'bug'
                    }
                    else if(move.x === 1 && move.y ==4){
                        state.whiteRace = 'promoters'
                    }
                    else if(move.x === 1 && move.y ==5){
                        state.whiteRace = 'cyborgs'
                    }
                    // else if(move.x === 1 && move.y ==6){
                    //     state.whiteRace = 'cat'
                    // }
                }
                else if(player.ref == state.black){
                    if(move.x  == 1 && move.y == 1){
                        state.blackRace = 'classic'
                    }
                    else if(move.x == 1 && move.y == 2){
                        state.blackRace = 'medieval'
                    }
                    else if(move.x === 1 && move.y ==3){
                        state.blackRace = 'bug'
                    }
                    else if(move.x === 1 && move.y ==4){
                        state.blackRace = 'promoters'
                    }
                    else if(move.x === 1 && move.y ==5){
                        state.blackRace = 'cyborgs'
                    }
                    // else if(move.x === 1 && move.y ==6){
                    //     state.blackRace = 'cat'
                    // }
                }

            if(state.whiteRace && state.blackRace){
                state.turn = 'white'
                if(state.gameType === 'morphingRaceChoiceChess'){
                    morphingRaceChoiceChess(state,state.whiteRace,state.blackRace)

                }else{
                    raceChoiceChess(state,state.whiteRace,state.blackRace)
                }
            }
        }   
        else{
            const cont = checkTurn(state, player.ref);
            if (!cont) {
                return
            }
            if(state.on){
                return;
            }
            if (state.pieceSelected) {
                if (playerMove(move, state)) {
                    if(checkRemi(state)){
                        state.won = 'tie'
                        return;
                    }
                    for (let i = state.pieces.length - 1; i >= 0; i--) {
                        if(state.pieces[i].color ==  state.turn){
                            if (state.pieces[i].afterEnemyPlayerMove) {
                                state.pieces[i].afterEnemyPlayerMove(state, playerMove)
                            }
                        }
                    }
                    if(state.specialOnMoveEffects && state.specialOnMoveEffects.length){
                        state.specialOnMoveEffects.forEach((winCondition) => {
                            winCondition(state);
                        })
                    }
                    changeTurn(state)

                }
                else {
                    closeLights(state.board);
                    state.pieceSelected = undefined;
                }
            }
            else {
                selectPiece(move, state)
                if (state.pieceSelected) {
                    lightBoardFE(state.pieceSelected, state)
                }
            }
        }
    },
    maxPlayers: 2, // Number of Players you want in a single game

    startBlockerFunction: function (minPlayers, maxPlayers, currentPlayers, state) {
        if (currentPlayers.length >= minPlayers) {
            return undefined;
        }
        else if(state.won){
            return state
        }
        else {
            return { message: "Waiting for opponent" };
        }
    },
    statePresenter: function (copyState, playerRef) {
        let search = {x:undefined,y:undefined}
        copyState.playerRef = playerRef;
        if(!copyState.blackRace || !copyState.whiteRace){
            if(copyState.black == playerRef){
                if(copyState.blackRace == 'medieval'){
                    search.x = 1;
                    search.y = 2;
                }
                else if(copyState.blackRace == 'classic'){
                    search.x = 1;
                    search.y = 1;
                }
                else if(copyState.blackRace == 'bug'){
                    search.x = 1;
                    search.y = 3;
                }
                else if(copyState.blackRace == 'promoters'){
                    search.x = 1;
                    search.y = 4;
                }
                else if(copyState.blackRace == 'cyborgs'){
                    search.x = 1;
                    search.y = 5;
                }
                // else if(copyState.blackRace == 'cat'){
                //     search.x = 1;
                //     search.y = 6;
                // }
            }
            else{
                if(copyState.whiteRace == 'medieval'){
                    search.x = 1;
                    search.y = 2;
                }
                else if(copyState.whiteRace == 'classic'){
                    search.x = 1;
                    search.y = 1;
                }
                else if(copyState.whiteRace == 'bug'){
                    search.x = 1;
                    search.y = 3;
                }
                else if(copyState.whiteRace == 'promoters'){
                    search.x = 1;
                    search.y = 4;
                }
                else if(copyState.whiteRace == 'cyborgs'){
                    search.x = 1;
                    search.y = 5;
                }
                // else if(copyState.whiteRace == 'cat'){
                //     search.x = 1;
                //     search.y = 6;
                // }
            }

        }
        copyState.board.forEach((sq) => {
            if(sq.x == search.x && sq.y == search.y){
                sq.light = true;
            }
        })
        if (checkTurn(copyState, playerRef)) {
            copyState.yourTurn = true;

            return copyState
        }

        copyState.yourTurn = false;
        return copyState;

    },
    timeFunction: function (state) {
        
        if(state.gameType == 'raceChoiceChess'){
            if(state.blackRace && state.whiteRace){
                if (state.turn == 'white') {
                    state.whiteClock -= 1;
                    if (state.whiteClock < 0) {
                        state.won = 'black'
                    }
                    return
                }
        
                state.blackClock -= 1;
                if (state.blackClock < 0) {
                    state.won = 'white'
                }
                return
            }
        }
        else{
            if (state.turn == 'white') {
                state.whiteClock -= 1;
                if (state.whiteClock < 0) {
                    state.won = 'black'
                }
                return
            }
    
            state.blackClock -= 1;
            if (state.blackClock < 0) {
                state.won = 'white'
            }
            return
        }
    },
    joinBlockerFunction: function (minPlayers, maxPlayers, currentPlayers, state) {
        //Return true if you want to allow join and false if you don't want to
        if (currentPlayers.length < minPlayers) {
            return true;
        }
        return false;
    },
    exitFunction: function(state,playerRef){
        io.emit(lobby.games)
        if(state.white == playerRef){
            state.won = 'black'
        }
        else{
            state.won = 'white'
        }
    },
    connectFunction: function (state, playerRef,roomData) {
        io.emit(lobby.games)
        if(!roomData.mode){
            roomData.mode = 'raceChoiceChess'
        }
        if(!state.board.length){
            if(roomData.mode == 'minichess'){
                state.gameType = 'minichess'
                state.pieces =[];
                state.board = [];
                miniChess(state);
            }
            else if(roomData.mode == 'randomchess'){
                state.gameType = 'randomchess'
                randomChess(state.pieces,state.board)
            }
            else if(roomData.mode == 'catchthedragon'){
                state.gameType = 'catchthedragon'
                catchTheDragon(state)
            }
            else if(roomData.mode == 'mongolianChess'){
                state.gameType = 'mongolianChess'
                mongolianChess(state)
            }
            else if(roomData.mode == 'classicChess'){
                state.gameType = 'classiChess'
                classicChess(state)
            }
            else if(roomData.mode === 'test'){
                state.gameType = 'test';
                test(state);
            }
            else if(roomData.mode == 'raceChess'){
                state.gameType = 'raceChess'
                raceChess(state)
            }
            else if(roomData.mode == 'raceChoiceChess'){
                state.pieces.length = 0;
                state.board.length = 0;
                for (let x = 0; x <= 7; x++) {
                    for (let y = 0; y <= 7; y++) {
                            state.board.push({ light: false, x: x, y: y })
                    }
                }
                state.pieces.push(kingFactory('white',1,1), hatFactory('white',1,2), shroomFactory('white', 1, 3), northernKing('white',1,4), empoweredCrystalFactory('white',1,5),blindCatFactory('white',1,6))
                state.gameType = 'raceChoiceChess'
                state.turn = 'menu'
            }
            else if(roomData.mode == 'morphingRaceChoiceChess'){
                state.pieces.length = 0;
                state.board.length = 0;
                for (let x = 0; x <= 7; x++) {
                    for (let y = 0; y <= 7; y++) {
                            state.board.push({ light: false, x: x, y: y })
                    }
                }
                state.pieces.push(kingFactory('white',1,1), hatFactory('white',1,2), shroomFactory('white', 1, 3), northernKing('white',1,4), empoweredCrystalFactory('white',1,5),blindCatFactory('white',1,6))
                state.gameType = 'morphingRaceChoiceChess'
                state.turn = 'menu'
            }
        }
        if (!state.white) {
            state.white = playerRef;
        }
        else if (!state.black) {
            state.black = playerRef;
        }
    },
    rooms:true,
    delay: 100
},
io:io,
rooms:true})

app.get('/', function (req, res) {

    return res.status(200).sendFile(__dirname + '/lobby.html');
});

app.get('/allgames', function(req,res){
    return res.status(200).json(lobby.games);
})

app.get('/play', function(req,res){
    return res.status(200).sendFile(__dirname + '/chessMissions.html');
})

app.get('/customMaps', function(req,res){
    return res.status(200).sendFile(__dirname + '/customMaps.html');
})

app.get('/hotseat-menu', function(req,res){
    return res.status(200).sendFile(__dirname + '/hotseat-menu.html');
})

app.get('/campaign', function(req,res){
    return res.status(200).sendFile(__dirname + '/campaign.html');
})

app.get('/pieces', function(req,res){
    return res.status(200).sendFile(__dirname + '/pieces.html');
})

app.get('/hotseat', function(req,res){
    return res.status(200).sendFile(__dirname + '/hotseat.html');
})

app.get('/create-board', function(req,res){
    return res.status(200).sendFile(__dirname + '/boardEditor.html');
})

// POST endpoint to create a map
app.use(express.json()); // Middleware to parse JSON body


app.post('/maps', async (req, res) => {
    try {
        const newMap = new Map(req.body);
        const savedMap = await newMap.save();
        res.status(201).json(savedMap);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/maps/:id', async (req, res) => {
    Map.findById(req.params.id).then((map) => {
        return res.status(200).json(map);
    }).catch(() => {
        console.log(error)
        res.status(500).json({ error: error.message });
    })
});

app.put('/maps/:id', async (req, res) => {
    try {
        // Find the existing map document by the provided ID
        const map = await Map.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Return the updated map
        runValidators: true, // Apply schema validation
        });

        if (!map) {
        return res.status(404).json({ error: "Map not found" });
        }

        res.status(200).json(map);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/gameTester', function(req,res){
    const state = req.body.state;
    const pieceAt = req.body.pieceAt;
    const piece = state.pieces.find((piece) => {
        return piece.x == pieceAt.x && piece.y == pieceAt.y
    })
    state.pieceSelected = piece;
    
    const theMove = req.body.playerMove;
    state.pieces.forEach((piece) => {
        if(!piece.icon) return;
        
        let iconName = piece.icon.replace('.png','');
        const color = piece.color;
        if(iconName.startsWith(color)){
            iconName = iconName.substring(color.length);
        }
        
        const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);
        const baseName = lowerFirst(iconName);
        
        let factory = pieceDefinitions[baseName + 'Factory'];
        if(!factory){
            factory = pieceDefinitions[baseName];
        }
        if(!factory){
            factory = iconToFactoryMap[iconName];
        }
        
        if(factory){
            const freshPiece = factory(piece.color, piece.x, piece.y, piece.options);
            
            const hooks = [
                'afterThisPieceTaken',
                'afterThisPieceMoves',
                'afterPieceMove',
                'conditionalMoves',
                'friendlyPieceInteraction',
                'afterEnemyPieceTaken',
                'afterPlayerMove',
                'afterEnemyPlayerMove'
            ];
            
            hooks.forEach(hook => {
                if(freshPiece[hook]){
                    piece[hook] = freshPiece[hook];
          (theMove, '  ')      }
            });
        }
    })
    if(playerMove(theMove,state,true, undefined, 'allowedMove')){
        state.turn = state.turn == 'white' ? 'black' : 'white'
    }
 
    return res.status(200).json({state:state, moves:generateMovesFromPieces(state,state.turn,[])})
})

app.get('/maps', async (req, res) => {
    try {
      const pageSize = parseInt(req.query.pageSize) || 10;
      const pageNumber = parseInt(req.query.page) || 1;
  
      const options = {
        skip: pageSize * (pageNumber - 1),
        limit: pageSize,
      };
  
      const mapCount = await Map.countDocuments();
      const maps = await Map.find({}, null, options);
  
      res.status(200).json({
        maps,
        pageSize,
        pageNumber,
        pageCount: Math.ceil(mapCount / pageSize),
        totalMapCount: mapCount,
      });
    } catch (error) {
      console.error('Error fetching maps: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }); 

http.listen(8080, function () {
    console.log('listening on *:8080');
});


 function generateMovesFromPieces(state,color, filters,enemy){
    if(!filters){
        filters = [];
    }
     const movesAndPieces = []
     let piecesCounter = 0;
     const myPieces = getColorPieces(state.pieces,color) 
     

     while(myPieces.length > piecesCounter){
         let movesCounter = 0;
         let piece = myPieces[piecesCounter]
         lightBoardFE(piece,{pieces:state.pieces, board:state.board,turn:state.turn},'allowedMove',undefined,true)
         let allowedMoves = state.board.filter((square) => {
             return square.allowedMove;
         })
         filters.forEach((filter) => {
            if(!enemy || filter.allowEnemy){
                allowedMoves = filter.method({
                    state,allowedMoves,myPieces,piecesCounter,piece,color,...filter.options
                })
            }
         })
         while(allowedMoves.length > movesCounter){
             const newPieces = JSONfn.parse(JSONfn.stringify(state.pieces))
             let newMyPieces = getColorPieces(newPieces, color)
             piece = newMyPieces[piecesCounter];
            let pieceAt  = {x:piece.x, y:piece.y}
            
             const square = allowedMoves[movesCounter]
             playerMove({x:square.x, y:square.y},{board:state.board, pieces:newPieces, pieceSelected:piece , turn:color},true, undefined, 'allowedMove')
 
            
             if( square && square.allowedMove){
                 movesAndPieces.push({pieceAt:pieceAt, xClicked:square.x, yClicked:square.y})
             }
             movesCounter++
         }
         piecesCounter++
     }
     if(movesAndPieces.length  === 0 && filters && filters.length > 0){
        return generateMovesFromPieces(state,color)
     }
     return movesAndPieces
 }
