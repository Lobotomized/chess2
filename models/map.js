const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
    name:String,
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
        y:Number
    }]
});

module.exports = mongoose.model('Map', mapSchema);