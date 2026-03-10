
const pieceDescriptions = {
    // Classic
    "pawnFactory": {
        name: "Pawn",
        description: "Moves forward one square, attacks diagonally forward. First move can be two squares. If it get's to the end it turns into a Queen."
    },
    "rookFactory": {
        name: "Rook",
        description: "Moves any number of squares horizontally or vertically."
    },
    "knightFactory": {
        name: "Knight",
        description: "Moves in an L-shape (2 squares one way, 1 square perpendicular). Can jump over other pieces."
    },
    "bishopFactory": {
        name: "Bishop",
        description: "Moves any number of squares diagonally."
    },
    "queenFactory": {
        name: "Queen",
        description: "The most powerful piece. Moves any number of squares horizontally, vertically, or diagonally."
    },
    "ghostFactory": {
        name: "Ghost",
        description: "The Ghost can move and take one or two squares ahead and it can jump THROUGH pieces."
    },
    "horseFactory": {
        name: "Hornless Unicorn",
        description: "It can move in any direction (like a queen) but only by 3 squares."
    },
    "swordsMen":{
        name: "Swordsman",
        description: "It can move one square diagonally and infront of it."
    },

    "simpleKingFactory": {
        name: "King",
        description: `If enemy takes it YOU LOSE. Check mechanic does not exist. <br/> 
    Whoever takes moves his king to the other end of the board wins.`
    },
    "clownRoguelikeFactory": {
        name: "The Joker",
        description: `It can move like a Queen but it cannot take enemy pieces. Instead of that it can spend it's turn to swap places with another piece.
            <br/>
            <br/>
            It cannot swap with the King.
        `
    },
};

// Expose for browser
if (typeof window !== 'undefined') {
    window.pieceDescriptions = pieceDescriptions;
}

// Expose for Node
if (typeof module !== 'undefined') {
    module.exports = pieceDescriptions;
}
