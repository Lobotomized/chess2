import { Piece, Square, State, Move } from "../types";
import { AiMove, minimaxAlphaBeta } from "./general";
import { FilterOptions } from "./filters";
import { MagnifierOptions } from "./magnifiers";
import { pawnFactory, knightFactory, bishopFactory, rookFactory, queenFactory, kingFactory } from "../pieces/classic";
import { ladyBugFactory, antFactory, spiderFactory, goliathBugFactory, queenbugFactory, newBrainBugFactory } from "../pieces/bugs";
import { pigFactory, ghostFactory, ricarFactory, horseFactory, dragonFactory, sleepingDragon } from "../pieces/animals";
import { electricCatFactory, fatCatFactory, longCatFactory, blindCatFactory, scaryCatFactory, cuteCatFactory } from "../pieces/cats";
import { swordsMen, pikeman, shield, fencer, kolbaFactory, gargoyleFactory, general, northernKing, plagueDoctor } from "../pieces/medieval";
import { bootvesselFactory, executorFactory, empoweredCrystalFactory, crystalFactory, juggernautFactory, cyborgFactory } from "../pieces/machines";
import { mongolianKnightFactory, weakPawn, unpromotablePawn, hatFactory, clownFactory, starMan } from "../pieces/misc";

let aiState: State = new State();

export function aiInitState(turnId: i32, wonId: i32): void {
    aiState = new State();
    aiState.turn = turnId == 0 ? "white" : "black";
    aiState.won = wonId == 0 ? "white" : (wonId == 1 ? "black" : "");
    aiState.pieces = [];
    aiState.board = [];
}

export function aiAddSquare(x: i32, y: i32, light: boolean, special: boolean): void {
    let sq = new Square(x, y);
    sq.light = light;
    sq.special = special;
    aiState.board.push(sq);
}

export function aiAddPiece(iconId: i32, colorId: i32, x: i32, y: i32, value: f32, moved: boolean): void {
    let p: Piece | null = null;
    let color = colorId == 0 ? "white" : "black";
    let icon = "";
    
    switch (iconId) {
        case 0: p = pawnFactory(color, x, y); icon = color + "Pawn.png"; break;
        case 1: p = knightFactory(color, x, y); icon = color + "Knight.png"; break;
        case 2: p = bishopFactory(color, x, y); icon = color + "Bishop.png"; break;
        case 3: p = rookFactory(color, x, y); icon = color + "Rook.png"; break;
        case 4: p = queenFactory(color, x, y); icon = color + "Queen.png"; break;
        case 5: p = kingFactory(color, x, y); icon = color + "King.png"; break;
        case 6: p = ladyBugFactory(color, x, y); icon = color + "LadyBug.png"; break;
        case 7: p = antFactory(color, x, y, color == 'white' ? 'up' : 'down'); icon = color + "Ant.png"; break;
        case 8: p = spiderFactory(color, x, y); icon = color + "Spider.png"; break;
        case 9: p = goliathBugFactory(color, x, y); icon = color + "GoliathBug.png"; break;
        case 10: p = queenbugFactory(color, x, y); icon = color + "QueenBug.png"; break;
        case 11: p = newBrainBugFactory(color, x, y); icon = color + "BrainBug.png"; break;
        case 12: p = pigFactory(color, x, y); icon = color + "Pig.png"; break;
        case 13: p = ghostFactory(color, x, y); icon = color + "Ghost.png"; break;
        case 14: p = ricarFactory(color, x, y); icon = color + "Ricar.png"; break;
        case 15: p = horseFactory(color, x, y); icon = color + "Horse.png"; break;
        case 16: p = dragonFactory(color, x, y); icon = color + "Dragon.png"; break;
        case 17: p = sleepingDragon(color, x, y); icon = color + "SleepingDragon.png"; break;
        case 18: p = electricCatFactory(color, x, y); icon = color + "ElectricCat.png"; break;
        case 19: p = fatCatFactory(color, x, y); icon = color + "FatCat.png"; break;
        case 20: p = longCatFactory(color, x, y); icon = color + "LongCat.png"; break;
        case 21: p = blindCatFactory(color, x, y); icon = color + "BlindCat.png"; break;
        case 22: p = scaryCatFactory(color, x, y); icon = color + "ScaryCat.png"; break;
        case 23: p = cuteCatFactory(color, x, y); icon = color + "CuteCat.png"; break;
        case 24: p = swordsMen(color, x, y); icon = color + "Swordsmen.png"; break;
        case 25: p = pikeman(color, x, y); icon = color + "Pikeman.png"; break;
        case 26: p = shield(color, x, y); icon = color + "Shield.png"; break;
        case 27: p = fencer(color, x, y); icon = color + "Fencer.png"; break;
        case 28: p = kolbaFactory(color, x, y); icon = color + "Kolba.png"; break;
        case 29: p = gargoyleFactory(color, x, y); icon = color + "Gargoyle.png"; break;
        case 30: p = general(color, x, y); icon = color + "General.png"; break;
        case 31: p = northernKing(color, x, y); icon = color + "northernKing.png"; break;
        case 32: p = plagueDoctor(color, x, y); icon = color + "plagueDoctor.png"; break;
        case 33: p = bootvesselFactory(color, x, y); icon = color + "Bootvessel.png"; break;
        case 34: p = executorFactory(color, x, y); icon = color + "Executor.png"; break;
        case 35: p = empoweredCrystalFactory(color, x, y); icon = color + "CrystalEmpowered.png"; break;
        case 36: p = crystalFactory(color, x, y); icon = color + "Crystal.png"; break;
        case 37: p = juggernautFactory(color, x, y); icon = color + "Juggernaut.png"; break;
        case 38: p = cyborgFactory(color, x, y); icon = color + "Cyborg.png"; break;
        case 39: p = mongolianKnightFactory(color, x, y); icon = color + "mongolianKnight.png"; break;
        case 40: p = weakPawn(color, x, y); icon = color + "weakPawn.png"; break;
        case 41: p = unpromotablePawn(color, x, y); icon = color + "unpromotablePawn.png"; break;
        case 42: p = hatFactory(color, x, y); icon = color + "Hat.png"; break;
        case 43: p = clownFactory(color, x, y); icon = color + "Clown.png"; break;
        case 44: p = starMan(color, x, y); icon = color + "StarMan.png"; break;
    }
    
    if (p != null) {
        p.value = value;
        p.moved = moved;
        p.icon = icon;
        aiState.pieces.push(p);
    } else {
        // Fallback for missing pieces to avoid crash
        let fallback = pawnFactory(color, x, y);
        fallback.icon = icon;
        fallback.value = value;
        fallback.moved = moved;
        aiState.pieces.push(fallback);
    }
}

export function aiGetBestMove(depth: i32, colorId: i32): i32 {
    let color = colorId == 0 ? "white" : "black";

    let magnifiers: MagnifierOptions[] = [];
    let defaultMag1 = new MagnifierOptions();
    defaultMag1.type = "evaluationMagnifierMaxOptions";
    defaultMag1.posValue = 0.1;
    
    let defaultMag2 = new MagnifierOptions();
    defaultMag2.type = "evaluationMagnifierPiece";
    defaultMag2.pieceValue = 1.5;
    
    magnifiers.push(defaultMag1);
    magnifiers.push(defaultMag2);
    
    let filters: FilterOptions[] = [];
    
    let bestMove = minimaxAlphaBeta(aiState, color, depth, magnifiers, filters);
    if (bestMove == null) {
        console.log("bestMove is null");
    } else {
        console.log("bestMove found: pc=" + bestMove.pieceCounter.toString() + " x=" + bestMove.xClicked.toString() + " y=" + bestMove.yClicked.toString());
    }
    if (bestMove != null) {
        // Pack the result into i32: 
        // byte 3: pieceCounter
        // byte 2: xClicked
        // byte 1: yClicked
        let pc = bestMove.pieceCounter & 0xFF;
        let x = bestMove.xClicked & 0xFF;
        let y = bestMove.yClicked & 0xFF;
        return (pc << 16) | (x << 8) | y;
    }
    
    return -1;
}
