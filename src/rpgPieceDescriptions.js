
const pieceDescriptions = {
    // Classic
    "rpgPawnFactory": {
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
        description: `If enemy takes it YOU LOSE. Check mechanic does not exist.`
    },
    "clownFactory": {
        name: "The Joker",
        description: `It can move like a Queen but it cannot take enemy pieces. Instead of that it can spend it's turn to swap places with another piece.
        `
    },
    "pikeman":{
        name: "Pikeman",
        description: `
                        The pikeman can move without taking, directly infront of him and to the left and right but it attacks the 3 squares 2 infront of him. <br/>
                Can attack : [y:2, x:-1], [y:2, x:0], [y:2, x:1] 
                <br/>
                Can move: [y:1,x:0], [y:0,x:1],[y:0,x:-1]
                
                <br/>
                (where x:0 y:0 is the position of the pikeman)
        `
    },
    "juggernautFactory":{
        name: "Juggernaut",
        description: `
            The Juggernaut can move three times by one square horizontally or vertically. If it takesa piece it stops. <br/>
            It can also swap places with all friendly pieces around it.
        `
    },
    "executorFactory":{
        name: "Executor",
        description: `
            The Executor moves horizontally and vertically till the end of the board, missing every second square. <br/>
            It still can be blocked if there is something on it's path.  <br/><br/>
            It can also swap places with all friendly pieces around it.
        `
    },
    "ricarFactory":{
        name: "Ricar",
        description: `
                The Crusader can jump through pieces like a knight. <br/><br/>

                If you take him and the square behind is free a ghost spawns there to avenge his comrade.
        `
    },
    "pigFactory":{
        name: "Pig",
        description: `
            The Pig can move as much as it wants but only infront of it and until it is blocked.
        `
    },
    "shield":{
        name: "Shield",
        description: `

                The defender can move and take horizontally with infinit speed and one vertically.
            
        `
    },
    "antFactory":{
        name: "Ant",
        description: `
            The ant is the basic piece of the insectoids. <br>
            It can move and take two forward (until it is blocked). If it gets to the last square it promotes itself to a Bug Queen.
        `
    },
    "spiderFactory":{
        name: "Spider",
        description: `
            It moves like classic King + classic Knight
        `
    },
    "goliathBugFactory":{
        name: "Goliath Bug",
        description: `
            The Goliath Bug can move like a classic King + classic Rook
        `
    },
    "bootvesselFactory":{
        name: "Bootvessel",
        description: `
            The Bootvessel moves diagonally till the end of the board, missing every second square. <br/>
            It still can be blocked if there is something on it's path.  <br/><br/>
            It can also swap places with all friendly pieces around it.
        `
    },
    "rpgQueenbugFactory":{
        name: "Queenbug",
        description: `
            The Queenbug can't move. But it can spawn ants infront, behind or to the left or right of it.
        `
    },
    "rpgAntFactory":{
        name: "Ant",
        description: `
            The ant moves and takes two blockable squares forward. If it gets to the last square it promotes itself to a Bug Queen.
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
