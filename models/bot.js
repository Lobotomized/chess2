const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const botSchema = new Schema({
    id: String,
    name: String,
    race: String,
    score: Number,
    gamesPlayed: Number,
    depth: Number,
    algorithm: String,
    posValueWeight: Number,
    pieceValueWeight: Number,
    kingTropismWeight: Number,
    defendedWeight: Number,
    kingVulnAttackWeight: Number,
    kingVulnProxWeight: Number,
    
    // Filters
    useRemoveAttacked: Boolean,
    raRandomException: Number,
    raExceptionPieceValue: Boolean,
    raExceptionPieceValueSmaller: Boolean,
    
    useRemoveNonAttacking: Boolean,
    rnaMaxPieceValue: Number,
    rnaExceptionRandom: Number,
    rnaExceptionPieceValue: Boolean,
    rnaExceptionPieceValueSmaller: Boolean,
    
    useRandomlyRemove: Boolean,
    rrN: Number,
    rrExceptionAttacked: Boolean,
    rrExceptionPieceValueSmaller: Boolean,
    rrExceptionRandom: Number,
    
    useMaxMoves: Boolean,
    mmMax: Number,
    mmExceptionAttacked: Boolean,
    
    useNthChance: Boolean,
    nthChance: Number,
    ncExceptionAttacked: Boolean,
    ncExceptionPieceValue: Boolean,
    
    useRemoveWellPositioned: Boolean,
    rwpN: Number,
    rwpExceptionAttacked: Boolean,

    mode: { type: String, default: 'normal' },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bot', botSchema);