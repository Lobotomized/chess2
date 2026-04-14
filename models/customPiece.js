const mongoose = require('mongoose');

const customPieceSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String
    },
    value: {
        type: Number,
        default: 3
    },
    posValue: {
        type: Number,
        default: 2
    },
    imageName: {
        type: String
    },
    moves: {
        type: mongoose.Schema.Types.Mixed
    },
    specialMoves: {
        type: mongoose.Schema.Types.Mixed
    }
}, { strict: false });

module.exports = mongoose.model('CustomPiece', customPieceSchema);
