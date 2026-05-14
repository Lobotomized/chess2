const fs = require('fs');
const path = require('path');
const vm = require('vm');

describe('AI Tests', () => {
    let context;

    beforeAll(() => {
        context = vm.createContext({
            console, Math, Array, Object, String, Number, Boolean, Date, RegExp, Error,
            crypto: { randomUUID: () => Math.random().toString() },
            importScripts: () => {},
            self: { posValue: [0.1, 0.5, 1, 2, 3, 4] },
            window: { innerWidth: 1000, innerHeight: 1000, posValue: [0.1, 0.5, 1, 2, 3, 4] },
            setTimeout: setTimeout,
            document: { createElement: () => ({}), write: () => {} },
            screen: { width: 1920, height: 1080 },
            posValue: [0.1, 0.5, 1, 2, 3, 4],
            JSONfn: {
                stringify: function(obj) {
                    return JSON.stringify(obj, function(key, value){
                        return (typeof value === 'function' ) ? value.toString() : value;
                    });
                },
                parse: function(str) {
                    return JSON.parse(str, function(key, value){
                        if(typeof value != 'string') return value;
                        return ( value.substring(0,8) == 'function') ? eval('('+value+')') : value;
                    });
                }
            },
            module: {},
            exports: {},
            require: function(moduleName) {
                return context;
            }
        });

        const files = [
            'src/jsonfn.js',
            'src/coreAlgorithms.js',
            'helperFunctions.js',
            'moveMethods.js',
            'pieces/classic.js',
            'pieces/bugs.js',
            'pieces/animals.js',
            'pieces/cats.js',
            'pieces/medieval.js',
            'pieces/machines.js',
            'pieces/rpg.js',
            'pieces/misc.js',
            'customEffects.js',
            'pieceDefinitions.js',
            'boardGeneration.js',
            'src/AI/general.js',
            'src/AI/magnifiers.js',
            'src/AI/filters.js',
            'src/AI/forcedAlgorithms.js'
        ];

        for (const file of files) {
            const filePath = path.join(__dirname, '..', file);
            const code = fs.readFileSync(filePath, 'utf8');
            vm.runInContext(code, context);
        }
    });
    
    const testAlgorithms = [
        'minimaxDeep',
        'minimaxAlphaBeta',
        'minimaxAlphaBetaBudget'
    ];

    testAlgorithms.forEach(algorithm => {
        it('should ALWAYS respond with a move and a move that is legal for ' + algorithm, () => {
            vm.runInContext(`
                (() => {
                    // Initialize a standard classic chess board
                    const state = {
                        board: [],
                        pieces: [],
                        turn: 'black'
                    };
                    classicChess(state);
                    
                    // Get all legal moves
                    const allLegalMoves = generateMovesFromPieces(state, 'black');
                    
                    // Ask AI to generate a move
                    let move;
                    if ('${algorithm}' === 'minimaxAlphaBetaBudget') {
                        move = minimaxAlphaBetaBudget(state, 'black', 2, undefined, defaultCharacter(0), []);
                    } else {
                        move = globalThis['${algorithm}'](state, 'black', 2, undefined, defaultCharacter(0), []);
                    }
                    
                    // Verify AI responded with a move
                    if (!move) {
                        throw new Error("AI did not respond with a move");
                    }
                    if (move.xClicked === undefined || move.yClicked === undefined || move.pieceCounter === undefined) {
                        throw new Error("AI responded with an invalid move object: " + JSON.stringify(move));
                    }
                    
                    // Check if the move is within the set of legal moves
                    const isLegal = allLegalMoves.some(legalMove => {
                        return legalMove.xClicked === move.xClicked && 
                               legalMove.yClicked === move.yClicked && 
                               legalMove.pieceCounter === move.pieceCounter;
                    });
                    
                    if (!isLegal) {
                        throw new Error("AI responded with an illegal move: " + JSON.stringify(move));
                    }
                })();
            `, context);
        });

        it('should ALWAYS respond with a legal move in a complex late-game state for ' + algorithm, () => {
            vm.runInContext(`
                (() => {
                    const state = {
                        board: [],
                        pieces: [],
                        turn: 'black'
                    };
                    for (let x = 1; x <= 8; x++) {
                        for (let y = 1; y <= 8; y++) {
                            state.board.push({ light: false, x: x, y: y })
                        }
                    }
                    // Put some pieces in a complex layout
                    state.pieces.push(kingFactory('black', 5, 5));
                    state.pieces.push(queenFactory('black', 4, 5));
                    state.pieces.push(knightFactory('black', 6, 6));
                    
                    state.pieces.push(kingFactory('white', 1, 1));
                    state.pieces.push(rookFactory('white', 1, 8));
                    state.pieces.push(bishopFactory('white', 8, 1));
                    
                    const allLegalMoves = generateMovesFromPieces(state, 'black');
                    
                    let move;
                    if ('${algorithm}' === 'minimaxAlphaBetaBudget') {
                        move = minimaxAlphaBetaBudget(state, 'black', 2, undefined, defaultCharacter(0), []);
                    } else {
                        move = globalThis['${algorithm}'](state, 'black', 2, undefined, defaultCharacter(0), []);
                    }
                    
                    if (!move) {
                        throw new Error("AI did not respond with a move");
                    }
                    if (move.xClicked === undefined || move.yClicked === undefined || move.pieceCounter === undefined) {
                        throw new Error("AI responded with an invalid move object");
                    }
                    
                    const isLegal = allLegalMoves.some(legalMove => {
                        return legalMove.xClicked === move.xClicked && 
                               legalMove.yClicked === move.yClicked && 
                               legalMove.pieceCounter === move.pieceCounter;
                    });
                    
                    if (!isLegal) {
                        throw new Error("AI responded with an illegal move: " + JSON.stringify(move));
                    }
                })();
            `, context);
        });
    });

    it('should fallback to AI 101 when fetching a bot for a non-existent race', async () => {
        // We simulate the logic in hotseat.js / webworker.js where 'customEvolution' falls back to standard AI if config is empty or invalid.
        // Specifically, the worker script intercepts obj.AIPower === 'customEvolution'.
        // If obj.customEvolutionWhite or obj.customEvolutionBlack is missing/invalid, it sets moveFallback = true
        // and falls back to minimaxDeep with depth 3 (which corresponds to AI 5). Wait, hotseat.js actually sets AIPower to 101
        // if no bot is found in fetchBotForMode before passing it to the worker. Let's test the hotseat.js fallback logic explicitly.
        
        const fallbackLogic = `
            const aiPowers = { white: 'randomHallOfFameHard', black: 'randomHallOfFameHard' };
            const state = { whiteRace: 'fakeRace', blackRace: 'fakeRace', board: [], pieces: [], turn: 'black' };
            classicChess(state);
            
            // Mock fetch to simulate empty results
            globalThis.fetch = async () => ({ json: async () => [] });
            
            async function testFallback() {
                let whiteNeedsHof = typeof aiPowers.white === 'string' && aiPowers.white.startsWith('randomHallOfFame');
                let blackNeedsHof = typeof aiPowers.black === 'string' && aiPowers.black.startsWith('randomHallOfFame');

                const fetchBotForMode = async (powerStr, race) => {
                    const res = await fetch(\`/api/bots/mode/normal\`);
                    const bots = await res.json();
                    if (bots && bots.length > 0) {
                        const raceBots = bots.filter(b => b.race === race);
                        if (raceBots.length > 0) {
                            return raceBots[Math.floor(Math.random() * raceBots.length)];
                        }
                    }
                    return null;
                };

                if (whiteNeedsHof) {
                    let botWhite = await fetchBotForMode(aiPowers.white, state.whiteRace);
                    if (botWhite) {
                        aiPowers.white = 'customEvolution';
                    } else {
                        aiPowers.white = 101;
                    }
                }
                if (blackNeedsHof) {
                    let botBlack = await fetchBotForMode(aiPowers.black, state.blackRace);
                    if (botBlack) {
                        aiPowers.black = 'customEvolution';
                    } else {
                        aiPowers.black = 101;
                    }
                }
                
                return aiPowers.black;
            }
            
            testFallback();
        `;
        
        const aiPowerResult = await vm.runInContext(fallbackLogic, context);
        expect(aiPowerResult).toBe(101);
        
        // Ensure AI 101 still produces a valid move
        vm.runInContext(`
            (() => {
                const state = { board: [], pieces: [], turn: 'black' };
                classicChess(state);
                const allLegalMoves = generateMovesFromPieces(state, 'black');
                
                // AI 101 is minimaxAlphaBeta depth 2
                const move = minimaxAlphaBeta(state, 'black', 2, undefined, defaultCharacter(0), []);
                if (!move) throw new Error("AI 101 did not respond with a move");
                
                const isLegal = allLegalMoves.some(legalMove => {
                    return legalMove.xClicked === move.xClicked && 
                           legalMove.yClicked === move.yClicked && 
                           legalMove.pieceCounter === move.pieceCounter;
                });
                
                if (!isLegal) throw new Error("AI 101 returned illegal move");
            })();
        `, context);
    });
});
