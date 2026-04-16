const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Map = require('./models/map'); // Import the Map model
const Bot = require('./models/bot'); // Import the Bot model
const GameHistory = require('./models/gameHistory'); // Import the GameHistory model
const UserGameRecord = require('./models/UserGameRecord');
const User = require('./models/user');
const CustomPiece = require('./models/customPiece');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads', 'custom-pieces');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'user-' + (req.user ? req.user.id : 'anon') + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 500 * 1024 } // 500KB limit
});

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here'; // Fallback for dev

app.use(express.json({ limit: '50mb' })); // Allow JSON body parsing with large limit
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/boardGeneration.js', express.static('./boardGeneration.js'))
app.use('/pieceDefinitions.js', express.static('./pieceDefinitions.js'))
app.use('/customEffects.js', express.static('./customEffects.js'))
app.use('/pieces', express.static('./pieces'))
app.use('/helperFunctions.js', express.static('./helperFunctions.js'))
app.use('/moveMethods.js', express.static('./moveMethods.js'))
app.use('/rogueLike.js', express.static('./rogueLike.js'))
app.use('/rogueLikeDifficulties.js', express.static('./rogueLikeDifficulties.js'))
app.use('/rogueLikeDetails.js', express.static('./rogueLikeDetails.js'))
app.use('/grandMap.js', express.static('./grandMap.js'))
app.use('/mapVisuals.js', express.static('./mapVisuals.js'))
app.use('/evolution.html', express.static('./evolution.html'))
app.use('/evolution.js', express.static('./evolution.js'))
app.use('/evolutionWorker.js', express.static('./evolutionWorker.js'))
app.use('/hallOfFame.html', express.static('./hallOfFame.html'))
app.use('/hallOfFame.js', express.static('./hallOfFame.js'))
app.use('/replay.html', express.static('./replay.html'))
app.use('/replay.js', express.static('./replay.js'))

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
app.use('/static', express.static('public', { maxAge: '1d' }))
app.use('/src', express.static('src', { maxAge: '1d' }))



mongoose.connect('mongodb+srv://Lobotomy:Micasmu4ka@cluster0.tippd.mongodb.net/chess2')
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});



// app.use('/pieceDefinitions.js, express.static('pieces'))
// app.use('/boardGeneration.js', express.static('boardGeneration.js'))


app.get('/match-opponent/:botId', async (req, res) => {
    try {
        const botId = req.params.botId;
        const query = mongoose.Types.ObjectId.isValid(botId) 
            ? { $or: [{ id: botId }, { _id: botId }] }
            : { id: botId };
        const bot = await Bot.findOne(query);
        if (bot) {
            res.json(bot);
        } else {
            res.status(404).send("Opponent not found");
        }
    } catch (e) {
        res.status(500).send("Error");
    }
});

app.get('/bots', async (req, res) => {
    try {
        const bots = await Bot.find().sort({ score: -1 }).limit(100);
        res.json(bots);
    } catch (err) {
        res.status(500).send(err);
    }
});

let fakeBotGames = [];

const realisticGameNames = [
    "Chess 2 JOIN",
    "Races Chess",
    "Chess2",
    "play me",
    "new game",
    "chess two game",
    "fast game",
    "1v1",
    "test",
    "anyone?",
    "Chess 2",
    "let's play",
    "join up",
    "good players only",
    "noobs welcome",
    "casual",
    "quick match",
    "fun times",
    "chess time",
    "epic battle"
];

async function generateFakeBotGames() {
    try {
        const bots = await Bot.find().sort({ score: -1 }).limit(100);
        if(bots && bots.length > 0) {
            const currentCount = fakeBotGames.length;
            const targetCount = Math.floor(Math.random() * 4) + 2; // Target 2 to 5 games
            
            if (currentCount < targetCount) {
                let added = false;
                for(let i=0; i < (targetCount - currentCount); i++){
                    const randomBot = bots[Math.floor(Math.random() * bots.length)];
                    const randomName = realisticGameNames[Math.floor(Math.random() * realisticGameNames.length)];
                    fakeBotGames.push({
                        roomId: `match_${randomBot.id}_${randomName.replace(/ /g, '_')}_${Date.now()}_${i}`,
                        displayName: randomName,
                        mode: 'Chess 2',
                        players: [{}] // 1 player visually
                    });
                    added = true;
                }
                if (added && io) {
                    io.emit('rooms', [...lobby.games, ...fakeBotGames]);
                }
            } else if (currentCount > targetCount) {
                // Occasionally remove a fake game if we have too many, simulating someone joining it
                if (Math.random() > 0.5) {
                    fakeBotGames.pop();
                    if (io) {
                        io.emit('rooms', [...lobby.games, ...fakeBotGames]);
                    }
                }
            }
        }
    } catch(err) {
        console.error("Error generating fake bot games", err);
    }
}

// Generate initially and maintain continuously
setTimeout(generateFakeBotGames, 2000);
setInterval(generateFakeBotGames, 15000); // Check and adjust every 15 seconds

app.get('/ping', (req, res) => {
    res.status(200).send("pong");
});

app.post('/join-match', (req, res) => {
    const roomId = req.body.roomId;
    if (!roomId) return res.status(400).send("No roomId");
    
    const index = fakeBotGames.findIndex(g => g.roomId === roomId);
    if (index !== -1) {
        fakeBotGames.splice(index, 1);
        io.emit('rooms', [...lobby.games, ...fakeBotGames]);
        
        // Add a new one after a few seconds to replace the taken one quickly
        setTimeout(generateFakeBotGames, Math.floor(Math.random() * 5000) + 3000);
    }
    res.status(200).send("OK");
});

app.post('/bots', async (req, res) => {
    try {
        const bot = new Bot(req.body);
        await bot.save();
        res.status(201).json(bot);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/bots/:botId', async (req, res) => {
    try {
        const botId = req.params.botId;
        const query = mongoose.Types.ObjectId.isValid(botId) 
            ? { $or: [{ id: botId }, { _id: botId }] }
            : { id: botId };
            
        const deletedBot = await Bot.findOneAndDelete(query);
        if (!deletedBot) {
            return res.status(404).send({ message: 'Bot not found' });
        }
        res.status(200).send({ message: 'Bot deleted successfully' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).send(err);
    }
});

app.post('/games', async (req, res) => {
    try {
        const game = new GameHistory(req.body);
        await game.save();
        res.status(201).json(game);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/games', async (req, res) => {
    try {
        const games = await GameHistory.find().sort({ date: -1 }).limit(100);
        res.json(games);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/hof-games', async (req, res) => {
    try {
        const games = await GameHistory.find({ isHallOfFame: true }).sort({ date: -1 }).limit(100);
        res.json(games);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/games/:botId', async (req, res) => {
    try {
        const games = await GameHistory.find({ 
            $or: [
                { whiteId: req.params.botId },
                { blackId: req.params.botId }
            ] 
        }).sort({ date: -1 }).limit(50);
        res.json(games);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/game/:gameId', async (req, res) => {
    try {
        const game = await GameHistory.findById(req.params.gameId);
        res.json(game);
    } catch (err) {
        res.status(500).send(err);
    }
});

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
        started:false,
        recordMoves: true,
        gameRecordId: require('crypto').randomUUID ? require('crypto').randomUUID() : Date.now() + '_' + Math.random(),
        gameMetadata: {
            mode: 'multiplayer',
            vsBot: false // Will be updated in joinBot if a bot joins
        }
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
                    if(state.specialOnMoveEffects && state.specialOnMoveEffects.length){
                        state.specialOnMoveEffects.forEach((winCondition) => {
                            winCondition(state);
                        })
                    }
                    changeTurn(state)
                    if(!state.won && checkRemi(state)){
                        state.won = 'tie'
                        if(state.specialOnDrawEffects){
                            state.specialOnDrawEffects.forEach((effect) => {
                                effect(state);
                            })
                        }
                        return;
                    }
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
        io.emit('rooms', [...lobby.games, ...fakeBotGames]);
        if(state.white == playerRef){
            state.won = 'black'
        }
        else{
            state.won = 'white'
        }
    },
    connectFunction: function (state, playerRef, roomData, socketId) {
        // If a bot joins, update the metadata
        if (socketId && socketId.toString().includes('thisisabot')) {
            if (state.gameMetadata) state.gameMetadata.vsBot = true;
        }

        io.emit('rooms', [...lobby.games, ...fakeBotGames]);
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
            else if(roomData.mode == 'randomchess' || roomData.mode == 'randomChess'){
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
                state.pieces.push(kingFactory('white',1,1), hatFactory('white',1,2), shroomFactory('white', 1, 3), northernKing('white',1,4), empoweredCrystalFactory('white',1,5))
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
                state.pieces.push(kingFactory('white',1,1), hatFactory('white',1,2), shroomFactory('white', 1, 3), northernKing('white',1,4), empoweredCrystalFactory('white',1,5))
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

io.on('connection', (socket) => {
    socket.on('roomUpdateNeeded', () => {
        io.emit('rooms', [...lobby.games, ...fakeBotGames]);
    });
});

app.get('/', function (req, res) {

    return res.status(200).sendFile(__dirname + '/mainMenu.html');
});

app.get('/single-player', function(req,res){
    return res.status(200).sendFile(__dirname + '/singlePlayerMenu.html');
});

app.get('/lobby', function(req,res){
    return res.status(200).sendFile(__dirname + '/lobby.html');
});

app.get('/allgames', function(req,res){
    return res.status(200).json([...lobby.games, ...fakeBotGames]);
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

app.get('/gameRecorder.js', function(req,res){
    return res.status(200).sendFile(__dirname + '/gameRecorder.js');
})

app.get('/rogueLike.html', function(req,res){
    return res.status(200).sendFile(__dirname + '/rogueLike.html');
})

app.get('/create-board', function(req,res){
    return res.status(200).sendFile(__dirname + '/boardEditorUpgraded.html');
})

app.get('/create-board-upgraded', function(req,res){
    return res.status(200).sendFile(__dirname + '/boardEditorUpgraded.html');
})

app.get('/taenadmin', function(req,res){
    return res.status(200).sendFile(__dirname + '/adminDashboard.html');
})

// POST endpoint to record games
app.post('/api/record-games', async (req, res) => {
    try {
        const games = req.body.games;
        if (!games || !Array.isArray(games)) {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        for (const game of games) {
            // Upsert to prevent duplicates
            await UserGameRecord.updateOne(
                { gameRecordId: game.id },
                {
                    gameRecordId: game.id,
                    date: game.date,
                    mode: game.metadata.mode,
                    vsBot: game.metadata.vsBot,
                    winner: game.winner,
                    moves: game.moves,
                    whiteRace: game.whiteRace,
                    blackRace: game.blackRace,
                    initialBoard: game.initialBoard,
                    initialPieces: game.initialPieces
                },
                { upsert: true }
            );
        }

        res.status(200).json({ message: 'Games recorded successfully' });
    } catch (error) {
        console.error('Error saving recorded games:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET endpoint to retrieve all recorded games
app.get('/api/all-recorded-games', async (req, res) => {
    try {
        const games = await UserGameRecord.find({}).sort({ date: -1 });
        res.status(200).json(games);
    } catch (error) {
        console.error('Error fetching recorded games:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST endpoint to create a map
app.use(express.json()); // Middleware to parse JSON body


// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ error: 'Access denied, token missing' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

app.post('/api/upload-image-pair', authenticateToken, (req, res) => {
    const uploadPair = upload.fields([
        { name: 'whiteImage', maxCount: 1 },
        { name: 'blackImage', maxCount: 1 }
    ]);
    
    uploadPair(req, res, function (err) {
        // Helper function to clean up any files that were uploaded before an error occurred
        const cleanupFiles = () => {
            if (req.files) {
                if (req.files['whiteImage'] && req.files['whiteImage'][0]) {
                    fs.unlink(req.files['whiteImage'][0].path, (e) => { if (e) console.error(e); });
                }
                if (req.files['blackImage'] && req.files['blackImage'][0]) {
                    fs.unlink(req.files['blackImage'][0].path, (e) => { if (e) console.error(e); });
                }
            }
        };

        if (err instanceof multer.MulterError) {
            cleanupFiles();
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File size cannot exceed 500KB.' });
            }
            return res.status(400).json({ error: err.message });
        } else if (err) {
            cleanupFiles();
            return res.status(400).json({ error: err.message });
        }
        
        if (!req.files || !req.files['whiteImage'] || !req.files['blackImage']) {
            cleanupFiles();
            return res.status(400).json({ error: 'Both white and black image files are required' });
        }
        
        const whiteImageUrl = `/uploads/custom-pieces/${req.files['whiteImage'][0].filename}`;
        const blackImageUrl = `/uploads/custom-pieces/${req.files['blackImage'][0].filename}`;
        
        res.status(200).json({ whiteImageUrl, blackImageUrl });
    });
});

app.get('/api/user-images', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const userUploadsDir = path.join(__dirname, 'uploads', 'custom-pieces');
    
    fs.readdir(userUploadsDir, (err, files) => {
        if (err) {
            // If the directory doesn't exist yet, return an empty array
            if (err.code === 'ENOENT') {
                return res.status(200).json([]);
            }
            return res.status(500).json({ error: 'Could not read directory' });
        }
        
        // Filter for files belonging to this user based on the prefix defined in multer
        const userFiles = files.filter(file => file.startsWith(`user-${userId}-`));
        
        // Sort by creation time (descending) by extracting timestamp from filename, 
        // or by file stat if needed. The filename contains Date.now()
        userFiles.sort((a, b) => {
            const timeA = parseInt(a.split('-')[2]);
            const timeB = parseInt(b.split('-')[2]);
            return timeB - timeA;
        });

        const imageUrls = userFiles.map(file => `/uploads/custom-pieces/${file}`);
        res.status(200).json(imageUrls);
    });
});

app.delete('/api/delete-image-pair', authenticateToken, (req, res) => {
    const { whiteImageUrl, blackImageUrl } = req.body;
    if (!whiteImageUrl || !blackImageUrl) {
        return res.status(400).json({ error: 'Both image URLs are required' });
    }

    const userId = req.user.id;
    
    // Ensure the paths belong to the current user to prevent arbitrary file deletion
    const whiteFilename = path.basename(whiteImageUrl);
    const blackFilename = path.basename(blackImageUrl);
    
    if (!whiteFilename.startsWith(`user-${userId}-`) || !blackFilename.startsWith(`user-${userId}-`)) {
        return res.status(403).json({ error: 'Unauthorized to delete these images' });
    }

    const whitePath = path.join(__dirname, 'uploads', 'custom-pieces', whiteFilename);
    const blackPath = path.join(__dirname, 'uploads', 'custom-pieces', blackFilename);

    let deletedCount = 0;
    let errorOccurred = false;

    const checkDone = () => {
        if (deletedCount === 2 || errorOccurred) return;
        if (deletedCount === 2) {
            res.status(200).json({ message: 'Images deleted successfully' });
        }
    };

    fs.unlink(whitePath, (err) => {
        if (err && err.code !== 'ENOENT') {
            errorOccurred = true;
            return res.status(500).json({ error: 'Failed to delete white image' });
        }
        deletedCount++;
        if (deletedCount === 2 && !errorOccurred) res.status(200).json({ message: 'Images deleted successfully' });
    });

    fs.unlink(blackPath, (err) => {
        if (err && err.code !== 'ENOENT') {
            errorOccurred = true;
            return res.status(500).json({ error: 'Failed to delete black image' });
        }
        deletedCount++;
        if (deletedCount === 2 && !errorOccurred) res.status(200).json({ message: 'Images deleted successfully' });
    });
});

app.post('/api/swap-image-pair', authenticateToken, (req, res) => {
    const { whiteImageUrl, blackImageUrl } = req.body;
    
    if (!whiteImageUrl || !blackImageUrl) {
        return res.status(400).json({ error: 'Both image URLs are required' });
    }

    const userId = req.user.id;
    const whiteFilename = path.basename(whiteImageUrl);
    const blackFilename = path.basename(blackImageUrl);
    
    if (!whiteFilename.startsWith(`user-${userId}-`) || !blackFilename.startsWith(`user-${userId}-`)) {
        return res.status(403).json({ error: 'Unauthorized to swap these images' });
    }

    const whitePath = path.join(__dirname, 'uploads', 'custom-pieces', whiteFilename);
    const blackPath = path.join(__dirname, 'uploads', 'custom-pieces', blackFilename);
    const tempPath = path.join(__dirname, 'uploads', 'custom-pieces', `temp-${Date.now()}-${whiteFilename}`);

    try {
        if (!fs.existsSync(whitePath) || !fs.existsSync(blackPath)) {
            return res.status(404).json({ error: 'One or both images not found on server' });
        }
        
        // Swap the files
        fs.renameSync(whitePath, tempPath);
        fs.renameSync(blackPath, whitePath);
        fs.renameSync(tempPath, blackPath);
        
        res.status(200).json({ message: 'Images swapped successfully' });
    } catch (err) {
        console.error('Swap error:', err);
        res.status(500).json({ error: 'Failed to swap images' });
    }
});


// Auth routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, username, password, repeatPassword } = req.body;
        if (!email || !username || !password || !repeatPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (password !== repeatPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: { $regex: new RegExp(`^${username}$`, 'i') } }
            ]
        });

        if (existingUser) {
            if (existingUser.email === email.toLowerCase()) {
                return res.status(400).json({ error: 'Email already in use' });
            }
            return res.status(400).json({ error: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, username, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
        res.status(201).json({ token, email: user.email, username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
        res.status(200).json({ token, email: user.email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/custom-pieces', authenticateToken, async (req, res) => {
    try {
        let user = await User.findById(req.user.id).populate('customPieces');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user.customPieces || []);
    } catch (err) {
        if (err.name === 'CastError') {
            // Handle migration: user has literal objects instead of ObjectIds
            try {
                const db = mongoose.connection.db;
                const rawUser = await db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(req.user.id) });
                if (rawUser && Array.isArray(rawUser.customPieces)) {
                    const pieceObjectIds = [];
                    for (const p of rawUser.customPieces) {
                        if (!p || !p.id) continue;
                        const pieceData = { ...p, authorId: req.user.id };
                        delete pieceData._id;
                        delete pieceData.__v;
                        const updatedPiece = await CustomPiece.findOneAndUpdate(
                            { id: p.id, authorId: req.user.id },
                            pieceData,
                            { upsert: true, new: true, setDefaultsOnInsert: true }
                        );
                        pieceObjectIds.push(updatedPiece._id);
                    }
                    // Update user with ObjectIds
                    await db.collection('users').updateOne(
                        { _id: new mongoose.Types.ObjectId(req.user.id) },
                        { $set: { customPieces: pieceObjectIds } }
                    );
                    
                    // Fetch again
                    const migratedUser = await User.findById(req.user.id).populate('customPieces');
                    return res.status(200).json(migratedUser.customPieces || []);
                }
            } catch (migrationErr) {
                console.error("Migration error:", migrationErr);
            }
            return res.status(200).json([]);
        }
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/custom-pieces', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        const incomingPieces = req.body;
        if (!Array.isArray(incomingPieces)) {
            return res.status(400).json({ error: 'Expected an array of pieces' });
        }

        const pieceObjectIds = [];
        for (const p of incomingPieces) {
            if (!p.id) continue;
            const pieceData = { ...p, authorId: req.user.id };
            delete pieceData._id;
            delete pieceData.__v;

            const updatedPiece = await CustomPiece.findOneAndUpdate(
                { id: p.id, authorId: req.user.id },
                pieceData,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            pieceObjectIds.push(updatedPiece._id);
        }
        
        // Remove pieces that are no longer in the list for this user
        await CustomPiece.deleteMany({
            authorId: req.user.id,
            _id: { $nin: pieceObjectIds }
        });

        user.customPieces = pieceObjectIds;
        await user.save({ validateBeforeSave: false }); // Bypass validation for old missing fields
        
        const populatedUser = await User.findById(req.user.id).populate('customPieces');
        res.status(200).json(populatedUser.customPieces || []);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'Please refresh the page to complete piece migration.' });
        }
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/custom-pieces/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        const pieceToDelete = await CustomPiece.findOne({ id: req.params.id, authorId: req.user.id });
        if (pieceToDelete) {
            await CustomPiece.deleteOne({ _id: pieceToDelete._id });
            
            // Because user.customPieces might contain objects if not migrated, we filter defensively
            user.customPieces = user.customPieces.filter(ref => {
                if (!ref) return false;
                const refStr = ref._id ? ref._id.toString() : ref.toString();
                return refStr !== pieceToDelete._id.toString();
            });
            await user.save({ validateBeforeSave: false });
        }
        
        res.status(200).json({ message: 'Piece deleted successfully' });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'Please refresh the page to complete piece migration.' });
        }
        res.status(500).json({ error: err.message });
    }
});

app.post('/maps', authenticateToken, async (req, res) => {
    try {
        const mapData = { ...req.body, authorId: req.user.id };
        const newMap = new Map(mapData);
        const savedMap = await newMap.save();
        res.status(201).json(savedMap);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/maps/:id', authenticateToken, async (req, res) => {
    try {
        const map = await Map.findOne({ _id: req.params.id, authorId: req.user.id });
        if (!map) return res.status(404).json({ error: "Map not found" });
        return res.status(200).json(map);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/maps/:id', authenticateToken, async (req, res) => {
    try {
        const map = await Map.findOneAndUpdate(
            { _id: req.params.id, authorId: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!map) {
            return res.status(404).json({ error: "Map not found or you don't have permission" });
        }

        res.status(200).json(map);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/maps/:id', authenticateToken, async (req, res) => {
    try {
        const map = await Map.findOneAndDelete({ _id: req.params.id, authorId: req.user.id });
        if (!map) return res.status(404).json({ error: "Map not found or you don't have permission" });
        res.status(200).json({ message: "Map deleted successfully" });
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

app.get('/maps', authenticateToken, async (req, res) => {
    try {
      const pageSize = parseInt(req.query.pageSize) || 10;
      const pageNumber = parseInt(req.query.page) || 1;
  
      const options = {
        skip: pageSize * (pageNumber - 1),
        limit: pageSize,
      };
  
      const query = { authorId: req.user.id };
      const mapCount = await Map.countDocuments(query);
      const maps = await Map.find(query, null, options);
  
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
        return generateMovesFromPieces(state,color,filters,enemy)
     }
     return movesAndPieces
 }
