const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameHistorySchema = new Schema({
    whiteId: String,
    blackId: String,
    whiteRace: String,
    blackRace: String,
    winner: String,
    turns: Number,
    date: { type: Date, default: Date.now },
    moves: Array, // Store the sequence of moves for replay
    initialPieces: String, // Store the initial board setup
    isHallOfFame: Boolean // True if this game was manually fought in the Hall of Fame
});

module.exports = mongoose.model('GameHistory', gameHistorySchema);