
const pieceDescriptions = {
    // Classic
    "pawnFactory": "Pawn: Moves forward one square, attacks diagonally forward. First move can be two squares.",
    "rookFactory": "Rook: Moves any number of squares horizontally or vertically.",
    "knightFactory": "Knight: Moves in an L-shape (2 squares one way, 1 square perpendicular). Can jump over other pieces.",
    "bishopFactory": "Bishop: Moves any number of squares diagonally.",
    "queenFactory": "Queen: The most powerful piece. Moves any number of squares horizontally, vertically, or diagonally.",
    "simpleKingFactory": `If enemy takes it YOU LOSE. Check mechanic does not exist. <br/> 
    Whoever takes moves his king to the other end of the board wins.` ,
};

// Expose for browser
if (typeof window !== 'undefined') {
    window.pieceDescriptions = pieceDescriptions;
}

// Expose for Node
if (typeof module !== 'undefined') {
    module.exports = pieceDescriptions;
}
