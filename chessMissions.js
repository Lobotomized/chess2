const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const newG = require('./globby').newIOServerV2;
const {miniChess, randomChess,  catchTheDragon, mongolianChess, classicChess, raceChess, raceChoiceChess} = require('./boardGeneration')
const { selectPiece, playerMove, checkTurn, changeTurn, lightBoard, closeLights, pickARace } = require('./selectAndMovemethods')
const {kingFactory, hatFactory, shroomFactory} = require('./pieceDefinitions')
app.use('/static', express.static('public'))
app.use('/src', express.static('src'))




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
                }

            if(state.whiteRace && state.blackRace){
                state.turn = 'white'
                raceChoiceChess(state.pieces,state.board,state.whiteRace,state.blackRace)
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
                    changeTurn(state)
                    for (let i = state.pieces.length - 1; i >= 0; i--) {
                        if(state.pieces[i].color ==  state.turn){
                            if (state.pieces[i].afterEnemyPlayerMove) {
                                state.pieces[i].afterEnemyPlayerMove(state, playerMove)
                            }
                        }
                    }
                }
                else {
                    closeLights(state.board);
                    state.pieceSelected = undefined;
                }
            }
            else {
                selectPiece(move, state)
                if (state.pieceSelected) {
                    lightBoard(state.pieceSelected, state)
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

        if (!state.white) {
            state.white = playerRef;
        }
        else if (!state.black) {
            state.black = playerRef;
            if(roomData.mode == 'minichess'){
                state.gameType = 'minichess'
                miniChess(state.pieces, state.board);
            }
            else if(roomData.mode == 'randomchess'){
                state.gameType = 'randomchess'
                randomChess(state.pieces,state.board)
            }
            else if(roomData.mode == 'catchthedragon'){
                state.gameType = 'catchthedragon'
                catchTheDragon(state.pieces,state.board)
            }
            else if(roomData.mode == 'mongolianChess'){
                state.gameType = 'mongolianChess'
                mongolianChess(state.pieces,state.board)
            }
            else if(roomData.mode == 'classicChess'){
                state.gameType = 'classiChess'
                classicChess(state.pieces,state.board)
            }
            else if(roomData.mode == 'raceChess'){
                state.gameType = 'raceChess'
                raceChess(state.pieces,state.board)
            }
            else if(roomData.mode == 'raceChoiceChess'){
                state.pieces.length = 0;
                state.board.length = 0;
                for (let x = 0; x <= 7; x++) {
                    for (let y = 0; y <= 7; y++) {
                            state.board.push({ light: false, x: x, y: y })
                    }
                }

                state.pieces.push(kingFactory('white',1,1), hatFactory('white',1,2), shroomFactory('white', 1, 3))
                state.gameType = 'raceChoiceChess'
                state.turn = 'menu'
            }
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

app.get('/hotseat', function(req,res){
    return res.status(200).sendFile(__dirname + '/hotseat.html');
})


http.listen(3000, function () {
    console.log('listening on *:3000');
});