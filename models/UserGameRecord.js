const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userGameRecordSchema = new Schema({
    gameRecordId: { type: String, unique: true },
    date: { type: Date, default: Date.now },
    mode: String,
    vsBot: Boolean,
    winner: String,
    moves: Array,
    whiteRace: String,
    blackRace: String,
    initialBoard: Array,
    initialPieces: Array,
    username: String,
    ipAddress: String
});

module.exports = mongoose.model('UserGameRecord', userGameRecordSchema);