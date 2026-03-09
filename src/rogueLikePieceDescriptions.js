
const pieceDescriptions = {
    // Classic
    "pawnFactory": {
        name: "Pawn",
        description: "Moves forward one square, attacks diagonally forward. First move can be two squares."
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
    "simpleKingFactory": {
        name: "King",
        description: `If enemy takes it YOU LOSE. Check mechanic does not exist. <br/> 
    Whoever takes moves his king to the other end of the board wins.`
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
