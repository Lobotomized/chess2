const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    customPieces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CustomPiece'
    }]
});

module.exports = mongoose.model('User', userSchema);
