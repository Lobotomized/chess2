const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
    name:String,
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    squares: [{
        light:Boolean,
        x:Number,
        y:Number
    }], // Array of squares
    pieces: [{
        color:{
            type:String,
            enum:['white','black'],
            default:'white'
        },
        // factory:String,
        pieceType:String,
        x:Number,
        y:Number,
        isCustom:Boolean,
        customDef:{
            type: mongoose.Schema.Types.Mixed
        }
    }]
});

module.exports = mongoose.model('Map', mapSchema);