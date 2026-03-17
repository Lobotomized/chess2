
// Basic types for the Chess Engine

export class Move {
  type: string = "";
  x: i32 = 0;
  y: i32 = 0;
  impotent: boolean = false;
  friendlyPieces: boolean = false;
  repeat: boolean = false;
  limit: i32 = 0;
  offsetX: i32 = 0;
  offsetY: i32 = 0;
  missedSquareX: i32 = 0;
  missedSquareY: i32 = 0;
  offsetCountsAsBlock: boolean = false;
  
  // Constructor helper
  constructor(type: string, x: i32, y: i32) {
    this.type = type;
    this.x = x;
    this.y = y;
  }

  clone(): Move {
    let m = new Move(this.type, this.x, this.y);
    m.impotent = this.impotent;
    m.friendlyPieces = this.friendlyPieces;
    m.repeat = this.repeat;
    m.limit = this.limit;
    m.offsetX = this.offsetX;
    m.offsetY = this.offsetY;
    m.missedSquareX = this.missedSquareX;
    m.missedSquareY = this.missedSquareY;
    m.offsetCountsAsBlock = this.offsetCountsAsBlock;
    return m;
  }
}

export class Square {
  x: i32 = 0;
  y: i32 = 0;
  light: boolean = false;
  blocked: boolean = false;
  counted: boolean = false;
  special: boolean = false;
  allowedMove: boolean = false;
  
  constructor(x: i32, y: i32) {
    this.x = x;
    this.y = y;
  }

  clone(): Square {
    let s = new Square(this.x, this.y);
    s.light = this.light;
    s.blocked = this.blocked;
    s.counted = this.counted;
    s.special = this.special;
    s.allowedMove = this.allowedMove;
    return s;
  }
}

export class Piece {
  x: i32 = 0;
  y: i32 = 0;
  color: string = "";
  icon: string = "";
  moves: Move[] = [];
  weakMoves: Move[] = []; // Added weakMoves
  value: f32 = 0.0;
  posValue: f32 = 0.0;
  moved: boolean = false;
  enPassantMove: boolean = false;
  vulnerable: boolean = false;
  direction: string = ""; 
  yTrigger: i32 = -1; // Added yTrigger for NorthernKing

  constructor(color: string, x: i32, y: i32) {
    this.color = color;
    this.x = x;
    this.y = y;
  }

  clone(): Piece {
    let p = new Piece(this.color, this.x, this.y);
    p.icon = this.icon;
    p.value = this.value;
    p.posValue = this.posValue;
    p.moved = this.moved;
    p.enPassantMove = this.enPassantMove;
    p.vulnerable = this.vulnerable;
    p.direction = this.direction;
    p.yTrigger = this.yTrigger;
    for (let i = 0; i < this.moves.length; i++) {
        p.moves.push(this.moves[i].clone());
    }
    for (let i = 0; i < this.weakMoves.length; i++) {
        p.weakMoves.push(this.weakMoves[i].clone());
    }
    return p;
  }

  // Default implementations
  conditionalMoves(state: State): Move[] {
    return [];
  }

  // Lifecycle methods returning false means "do not cancel the move"
  afterPieceMove(state: State, move: Move, prevMove: Move): boolean {
      return true;
  }

  afterPlayerMove(state: State, move: Move, prevMove: Move): boolean {
    return false;
  }

  afterEnemyPlayerMove(state: State, move: Move): void {
  }

  afterThisPieceTaken(state: State): boolean {
    return false;
  }

  afterEnemyPieceTaken(enemyPiece: Piece, state: State): void {
    // do nothing
  }
  
  friendlyPieceInteraction(state: State, friendlyPiece: Piece | null, prevMove: Move): boolean {
      return false;
  }
}

export class State {
  turn: string = "white";
  white: string = "";
  black: string = "";
  whiteRace: string = "";
  blackRace: string = "";
  pieces: Piece[] = [];
  board: Square[] = [];
  pieceSelected: Piece | null = null;
  won: string = "";
  message: string = "";
  oldMove: Move | null = null; 
  whiteClock: i32 = 6000;
  blackClock: i32 = 6000;
  gameType: string = "";
  
  constructor() {
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        this.board.push(new Square(x, y));
      }
    }
  }

  clone(): State {
    let s = new State();
    s.turn = this.turn;
    s.white = this.white;
    s.black = this.black;
    s.whiteRace = this.whiteRace;
    s.blackRace = this.blackRace;
    s.won = this.won;
    s.message = this.message;
    s.whiteClock = this.whiteClock;
    s.blackClock = this.blackClock;
    s.gameType = this.gameType;
    
    if (this.oldMove) s.oldMove = this.oldMove!.clone();
    
    // Clear default board and copy
    s.board = [];
    for (let i = 0; i < this.board.length; i++) {
        s.board.push(this.board[i].clone());
    }
    
    s.pieces = [];
    for (let i = 0; i < this.pieces.length; i++) {
        s.pieces.push(this.pieces[i].clone());
    }
    
    if (this.pieceSelected) {
        // Find the corresponding piece in the new array to maintain reference
        let idx = -1;
        for(let i=0; i<this.pieces.length; i++) {
            if (this.pieces[i] == this.pieceSelected) {
                idx = i;
                break;
            }
        }
        if (idx != -1) s.pieceSelected = s.pieces[idx];
    }
    
    return s;
  }
}

export class PlayerMove {
    x: i32 = 0;
    y: i32 = 0;
    
    constructor(x: i32, y: i32) {
        this.x = x;
        this.y = y;
    }
}
