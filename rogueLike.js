
// Rogue Like Game Logic

// List of available piece factories for random generation
const availablePieceFactories = [
    // Classic
    'rogueLikePawnFactory', 'rookFactory', 'knightFactory', 'bishopFactory', 'queenFactory', 'simpleKingFactory',
    'ghostFactory', 'horseFactory', "swordsMen",  
    
    "pikeman", "juggernautFactory", "ricarFactory",
    "pigFactory", "shield", "executorFactory", 'roguelikeQueenbugFactory',
    "roguelikeAntFactory", "spiderFactory", 'goliathBugFactory', "bootvesselFactory"
    // Animals
    // 'horseFactory', 'pigFactory', 'ghostFactory', 'spiderFactory', 
    // 'ladyBugFactory', 'goliathBugFactory', 'antFactory',
    // // Medieval
    // 'pikeman', 'swordsMen', 'shield', 
    // // Machines
    // 'cyborgFactory', 'executorFactory', 'bootvesselFactory',
    // Cats
];

// List of pieces available in the market
const marketPieceFactories = [
    'rogueLikePawnFactory', 'rookFactory', 'knightFactory', 'bishopFactory', 'queenFactory',
    'ghostFactory',  "swordsMen", "pikeman", 
    "juggernautFactory", "ricarFactory",
     "shield", "executorFactory",  "bootvesselFactory"
];

const winnablePieceFactories = [
    'horseFactory','roguelikeQueenbugFactory',
    "roguelikeAntFactory", "spiderFactory", 'goliathBugFactory',"pigFactory",
];

const adjustedValues = [

    {name: 'ricarFactory', value: 3},
    {name: 'pigFactory', value: 1.5},
];

// Helper to get piece value
function getPieceValue(factoryName) {
    const adjusted = adjustedValues.find(p => p.name === factoryName);
    if(adjusted){
        return adjusted.value;
    }

    if (typeof window[factoryName] === 'function') {
        // Instantiate a dummy piece to check value
        try {
            const piece = window[factoryName]('white', 0, 0);
            return piece.value || 1;
        } catch (e) {
            console.error(`Error instantiating ${factoryName}:`, e);
            return 1;
        }
    }
    return 1;
}

// Global State
const rogueState = {
    level: 1,
    playerRoster: [], // Array of factory names
    enemyRoster: [],
    gameActive: false,
    gold: 0,
    food: 50, // Initial food
    shopOptions: [],
    showWinScreen: false // New flag to persist win screen
};

// --- Hotseat Game Setup (Copied/Adapted from hotseat.js) ---
const AIColor = 'black'; // AI is always Black
let AIPowerWhite = 3;
let AIPowerBlack = 3; // Can increase with level?

let aiPowers = {
    white: 3,
    black: 3
};

let squareLength;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function updateSquareLength() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // We need space for 8 squares + 1 extra for margins/padding as per original code
    // Original code used 8 squares for width calc, but canvas width was 9 squares.
    // To fit on screen, we must divide by 9.
    
    const availableWidth = width * 0.95; // 95% of screen width
    const availableHeight = height * 0.75; // 75% of screen height (leave room for UI)
    
    squareLength = Math.min(availableWidth / 9, availableHeight / 9);
    
    // Ensure integer to avoid blurry lines? Canvas handles floats but integers are sharper.
    squareLength = Math.floor(squareLength);
}

updateSquareLength();
window.addEventListener('resize', updateSquareLength);
const forfeitTextButton = document.getElementById('forfeitText');
let hotseatGame;
let mouseX;
let mouseY;
let w; // Web Worker
let hoveredPiece;
let boardWidth, boardHeight;

function updateGoldDisplay() {
    const goldValue = document.getElementById('goldValue');
    const foodValue = document.getElementById('foodValue');
    
    // Fallback if spans are missing
    const goldDisplay = document.getElementById('goldDisplay');
    const foodDisplay = document.getElementById('foodDisplay');

    if (goldValue) {
        goldValue.innerText = rogueState.gold || 0;
    } else if (goldDisplay) {
        goldDisplay.innerText = `Gold: ${rogueState.gold || 0}`;
    }

    if (foodValue) {
        foodValue.innerText = rogueState.food || 0;
    } else if (foodDisplay) {
        foodDisplay.innerText = `Food: ${rogueState.food || 0}`;
    }
}

// Initialize Game
function initRogueGame() {
    hotseatGame = getSinglePlayerGame();
    hotseatGame.join('white', 'white');
    hotseatGame.join('black', 'black');
    
    // Start Animation Loop
    // Use requestAnimationFrame for smooth animation
    requestAnimationFrame(aniLoop);
    
    // Show Main Menu instead of auto-loading
    showMainMenu();
}

function showMainMenu() {
    const modal = document.getElementById('mainMenuDialog');
    const btnLoad = document.getElementById('btnLoadGame');
    
    const savedState = localStorage.getItem('rogueState');
    if (savedState) {
        let level = '?';
        try {
            const parsed = JSON.parse(savedState);
            level = parsed.level || '?';
        } catch(e){}
        
        btnLoad.disabled = false;
        btnLoad.style.opacity = '1';
        btnLoad.style.cursor = 'pointer';
        btnLoad.innerText = "Continue Journey (Lvl " + level + ")";
        btnLoad.onclick = loadGame;
    } else {
        btnLoad.disabled = true;
        btnLoad.style.opacity = '0.5';
        btnLoad.style.cursor = 'not-allowed';
        btnLoad.innerText = "No Save Found";
    }
    
    // Ensure modal exists before showing
    if(modal) modal.showModal();
}

function loadGame() {
    const modal = document.getElementById('mainMenuDialog');
    if(modal) modal.close();
    
    const savedState = localStorage.getItem('rogueState');
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            Object.assign(rogueState, parsed);
            
            // Initialize Grand Map
            if (typeof grandMap !== 'undefined') {
                grandMap.init(rogueState.grandMap);
            }

            // Ensure gold and food is loaded
            rogueState.gold = parsed.gold || 0;
            rogueState.food = (typeof parsed.food === 'number') ? parsed.food : 20;
            updateGoldDisplay();
            
            // Restore level
            document.getElementById('levelDisplay').innerText = `Level: ${rogueState.level}`;
            
            // Check if shop was active
            if (rogueState.shopOptions && rogueState.shopOptions.length > 0) {
                 // Shop was open or pending
                 // We should reopen the shop
                 showShopModal(true); // Pass true to indicate restoring
            } else if (rogueState.showWinScreen) {
                 // Show win screen if it was active
                 // We need to recalculate gold earned for display? Or store it?
                 // Let's assume standard calculation or generic message.
                 // "Your army is victorious."
                 const goldEarned = Math.floor(10 + rogueState.level * 2); // Re-calc for display
                 const goldText = document.getElementById('goldEarnedText');
                 if(goldText) goldText.innerText = `+${goldEarned} Gold`;
                 
                 const modal = document.getElementById('gameWonDialog');
                 if(modal) modal.showModal();
                 
                 // Also restore board in background
                 if (rogueState.savedBoard && rogueState.savedBoard.pieces && rogueState.savedBoard.pieces.length > 0) {
                    restoreBoard(rogueState.savedBoard);
                 }
            } else if (rogueState.savedBoard && rogueState.savedBoard.pieces && rogueState.savedBoard.pieces.length > 0) {
                restoreBoard(rogueState.savedBoard);
                rogueState.gameActive = true;
            } else {
                // Re-setup board with saved rosters
                setupBoard();
                rogueState.gameActive = true;
            }

            // rogueState.gameActive = true; // Moved inside conditions
            
        } catch (e) {
            console.error("Failed to load save:", e);
            alert("Save file corrupted. Starting new game.");
            startNewGame();
        }
    }
}

function confirmNewGame() {
    const savedState = localStorage.getItem('rogueState');
    if (savedState) {
        if (confirm("Starting a new game will overwrite your existing save. Are you sure?")) {
            startNewGame();
        }
    } else {
        startNewGame();
    }
}

function startNewGame() {
    const modal = document.getElementById('mainMenuDialog');
    if(modal) modal.close();
    
    // Clear State
    localStorage.removeItem('rogueState');
    
    // Reset rogueState object
    rogueState.level = 1;
    rogueState.playerRoster = [];
    rogueState.enemyRoster = [];
    rogueState.gameActive = false;
    rogueState.gameOverSequenceStarted = false; // Reset
    rogueState.gold = 0;
    rogueState.food = 50;
    rogueState.shopOptions = [];
    rogueState.showWinScreen = false;
    rogueState.grandMap = undefined; // Reset grand map state
    
    updateGoldDisplay();
    document.getElementById('levelDisplay').innerText = "Level: 1";
    
    // Initialize Grand Map
    if (typeof grandMap !== 'undefined') {
        grandMap.init();
    }
    
    showStartModal();
}

function saveProgress() {
    // Ensure rogueState.gold and food is a number
    if (typeof rogueState.gold !== 'number') rogueState.gold = 0;
    if (typeof rogueState.food !== 'number') rogueState.food = 20;
    
    if(hotseatGame && hotseatGame.state) {
        rogueState.savedBoard = {
            pieces: hotseatGame.state.pieces.map(p => {
                // Determine factory name if possible, or save essential props
                // Since we don't store factoryName on piece, we rely on icon mapping or properties
                return {
                    icon: p.icon,
                    x: p.x,
                    y: p.y,
                    color: p.color,
                    moved: p.moved,
                    value: p.value,
                    // Save other properties that might be important
                    // E.g. specific counters for some pieces?
                };
            }),
            turn: hotseatGame.state.turn,
            won: hotseatGame.state.won,
            message: hotseatGame.state.message
        };
    }
    
    // Explicitly include gold and food in the object being saved
    
    // Save Grand Map State
    if (typeof grandMap !== 'undefined') {
        rogueState.grandMap = grandMap.getState();
    }

    localStorage.setItem('rogueState', JSON.stringify(rogueState));
}

function restoreBoard(savedBoard) {
    hotseatGame.state.pieces = [];
    hotseatGame.state.board = [];
    
    // Create Board Grid based on saved shape
    const shapeName = rogueState.boardShape || 'Standard';
    
    if (boardShapes[shapeName]) {
        boardShapes[shapeName](hotseatGame.state.board);
    } else {
        boardShapes['Standard'](hotseatGame.state.board);
    }

    // Restore Pieces
    savedBoard.pieces.forEach(pData => {
        const factory = findFactoryForIcon(pData.icon);
        if (factory) {
            const newPiece = factory(pData.color, pData.x, pData.y);
            newPiece.moved = pData.moved;
            newPiece.value = pData.value;
            // Ensure icon matches (e.g. if factory is generic)
            if (newPiece.icon !== pData.icon) {
                 // Warn? Or override?
                 // If it's a promoted piece (e.g. Queen from Pawn), factory might be 'rogueLikePawnFactory' if we guessed wrong?
                 // But findFactoryForIcon uses icon to find factory.
                 // So if icon is 'whiteQueen.png', it should find 'queenFactory'.
            }
            hotseatGame.state.pieces.push(newPiece);
        } else {
            console.warn("Could not find factory for piece:", pData.icon);
            // Fallback: create generic piece?
        }
    });

    hotseatGame.state.turn = savedBoard.turn || 'white';
    hotseatGame.state.won = savedBoard.won;
    hotseatGame.state.message = savedBoard.message;
    
    // Update Turn Display
    const turnDisplay = document.getElementById('turn');
    if(turnDisplay) {
        if(hotseatGame.state.turn === 'white') {
            turnDisplay.innerText = "Your Turn";
            turnDisplay.style.color = 'var(--selected)';
        } else {
            turnDisplay.innerText = "Enemy Turn";
            turnDisplay.style.color = '#ff6b6b';
            
            // If it's enemy turn, trigger AI
            if (!hotseatGame.state.won) {
                setTimeout(triggerAI, 1000); // Small delay for visual clarity
            }
        }
    }
}

function findFactoryForIcon(icon) {
    if (!window.iconToFactoryMap) {
        window.iconToFactoryMap = {};
        // Scan all available factories
        availablePieceFactories.forEach(fName => {
            if (typeof window[fName] === 'function') {
                try {
                    const p = window[fName]('white', 0, 0);
                    window.iconToFactoryMap[p.icon] = window[fName];
                    // Also map black version
                    const pBlack = window[fName]('black', 0, 0);
                    window.iconToFactoryMap[pBlack.icon] = window[fName];
                } catch(e) {}
            }
        });
        
        // Manual overrides for known issues or missing factories in the list
        // e.g. 'swordsMen' -> 'whiteSwordsmen.png' (capitalization might differ)
    }
    
    if (window.iconToFactoryMap[icon]) return window.iconToFactoryMap[icon];
    
    // Fuzzy search
    // icon: 'whitePikeman.png' -> 'pikeman'
    let cleanName = icon.replace('white', '').replace('black', '').replace('.png', '');
    // Try exact match in window
    if (typeof window[cleanName] === 'function') return window[cleanName];
    // Try lowercase first char
    let lowerFirst = cleanName.charAt(0).toLowerCase() + cleanName.slice(1);
    if (typeof window[lowerFirst] === 'function') return window[lowerFirst];
    // Try adding 'Factory'
    if (typeof window[lowerFirst + 'Factory'] === 'function') return window[lowerFirst + 'Factory'];
    if (typeof window[cleanName + 'Factory'] === 'function') return window[cleanName + 'Factory'];
    
    return null;
}

function clearProgress() {
    localStorage.removeItem('rogueState');
}

// Animation Loop
function aniLoop() {
    ani();
    requestAnimationFrame(aniLoop);
}

function ani() {
    if (!hotseatGame) return;
    // Use direct state reference to persist animation properties
    animate(hotseatGame.state);
}

// --- Army Generation ---

function generateRandomArmy(targetValue, includeKing = false) {
    const army = [];
    let currentValue = 0;
    
    if (includeKing) {
        // Prefer simpleKingFactory, fallback to kingFactory
        const kingName = typeof window['simpleKingFactory'] === 'function' ? 'simpleKingFactory' : 'kingFactory';
        army.push(kingName);
        // King value is high (1000) for AI logic, but for army generation cost it should be 0 or small.
        // We'll treat it as 0 cost since both sides get one.
        currentValue += 0;
    }
    
    // Safety break
    let iterations = 0;
    while (currentValue < targetValue && iterations < 100) {
        iterations++;
        const randomFactory = availablePieceFactories[Math.floor(Math.random() * availablePieceFactories.length)];
        const val = getPieceValue(randomFactory);
        
        // Add if it doesn't overshoot too much (allow +1 overshoot)
        if (currentValue + val <= targetValue + 1) {
            army.push(randomFactory);
            currentValue += val;
        }
    }
    
    return { army, value: currentValue };
}

// --- Seen Pieces Logic ---
const seenPieces = new Set();
function markPieceAsSeen(factoryName) {
    if (!seenPieces.has(factoryName)) {
        seenPieces.add(factoryName);
        // Show buildPieceModal for this piece
        showPieceDiscoveryModal(factoryName);
    }
}

function showArmyInfo(army) {
    // Show all unique pieces in the army in one modal (or sequence)
    // The user requested "a series of modals you can click through"
    // So we will show them one by one.
    
    
    // We'll define a recursive function to show them in sequence
    const uniqueFactories = [...new Set(army)];
    let currentIndex = 0;
    
    // Disable clicks on options while info modal is open
    const startDialog = document.getElementById('startDialog');
    const rewardDialog = document.getElementById('rewardDialog');
    if(startDialog) startDialog.style.pointerEvents = 'none';
    if(rewardDialog) rewardDialog.style.pointerEvents = 'none';
    
    function showNext() {
        if (currentIndex >= uniqueFactories.length) {
            // End of sequence
            const modalDiv = document.querySelector('.pieceModal');
            
            // Re-enable clicks
            if(startDialog) startDialog.style.pointerEvents = 'auto';
            if(rewardDialog) rewardDialog.style.pointerEvents = 'auto';
            
            if (modalDiv) {
                if (modalDiv.tagName === 'DIALOG' && typeof modalDiv.close === 'function') {
                    modalDiv.close();
                } else {
                    modalDiv.style.display = 'none';
                }
                modalDiv.innerHTML = '';
            }
            return;
        }
        
        const factoryName = uniqueFactories[currentIndex];
        currentIndex++;
        
        if (typeof window[factoryName] === 'function') {
            const dummyPiece = window[factoryName]('white', 3, 3);
            
            // Get description from the new descriptions file if available, otherwise fallback
            let description = "A new unit has been discovered.";
            let displayName = factoryName.replace('Factory','');

            if (window.pieceDescriptions && window.pieceDescriptions[factoryName]) {
                const descEntry = window.pieceDescriptions[factoryName];
                if (typeof descEntry === 'object' && descEntry.description) {
                     description = descEntry.description;
                     displayName = descEntry.name || displayName;
                } else {
                     description = descEntry;
                }
            } else if (dummyPiece.description) {
                description = dummyPiece.description;
            }
            
            const miniBoard = [];
            for(let x=0; x<7; x++){
                for(let y=0; y<7; y++){
                    miniBoard.push({x, y, light:false});
                }
            }
            
            const tempState = {
                board: miniBoard,
                pieces: [dummyPiece],
                turn:"white"
            };
            lightBoardFE(dummyPiece, tempState, 'lighted','blocked');
            
            const isLast = currentIndex >= uniqueFactories.length;
            const btnText = isLast ? "Close" : "Next Piece";
            
            buildPieceModal(hotseatGame.state, [{
                type: 'piece',
                board: miniBoard,
                icon: dummyPiece.icon,
                pieceX: 3,
                pieceY: 3,
                description: `<b>${displayName}</b><br>${description}<br><br><button id="nextPieceBtn" style="padding:5px 10px; cursor:pointer;">${btnText}</button>`
            }]);
            
            // Attach listener
            setTimeout(() => {
                const btn = document.getElementById('nextPieceBtn');
                if (btn) {
                    btn.onclick = (e) => {
                        e.stopPropagation();
                        showNext();
                    };
                }
                
                // Add listener to the modal container to re-enable clicks if closed via backdrop
                const modalDiv = document.querySelector('.pieceModal');
                if(modalDiv) {
                    const originalOnclick = modalDiv.onclick;
                    modalDiv.onclick = function(e) {
                         if (originalOnclick) originalOnclick.call(this, e);
                         // Check if it's closed (hidden or closed dialog)
                         if (this.style.display === 'none' || (this.tagName === 'DIALOG' && !this.open)) {
                             if(startDialog) startDialog.style.pointerEvents = 'auto';
                             if(rewardDialog) rewardDialog.style.pointerEvents = 'auto';
                             
                             // Clear modal content when closed to prevent ghosting
                             this.innerHTML = '';
                         }
                    }
                }
            }, 0);
        } else {
            showNext(); // Skip invalid
        }
    }
    
    showNext();
}

function showEnemyInfo() {
    if (rogueState.enemyRoster && rogueState.enemyRoster.length > 0) {
        showArmyInfo(rogueState.enemyRoster);
    }
}

function showPieceDiscoveryModal(factoryName) {
    if (typeof window[factoryName] !== 'function') return;

    // Create a mini-board state for buildPieceModal
    // buildPieceModal expects: state, pieceArray
    // pieceArray: [{ type:'piece', board:..., icon:..., pieceX:..., pieceY:..., description:... }]
    
    // We need to construct a dummy piece to get its properties
    const dummyPiece = window[factoryName]('white', 3, 3); // Place in center of 7x7 mini board
    const icon = dummyPiece.icon.replace('white', 'black'); // Show black version usually? or white? prompt says "rogueLike that you see for the first time in the Options menu". Maybe just show the icon.
    // Actually, buildPieceModal usually shows a specific piece on a mini board.
    
    // Let's create a mini board
    const miniBoard = [];
    for(let x=0; x<7; x++){
        for(let y=0; y<7; y++){
            miniBoard.push({x, y, light:false});
        }
    }
    
    // Light up moves
    const tempState = {
        board: miniBoard,
        pieces: [dummyPiece],
        turn:"white"
    };
    lightBoardFE(dummyPiece, tempState, 'lighted','blocked');
    
    // Description - We might not have descriptions for all pieces automatically.
    // If we want descriptions, we'd need a map or property on the factory/piece.
    // For now, let's just show "New Piece Discovered!"
    
    // Get description from the new descriptions file if available, otherwise fallback
    let description = "A new unit has been discovered.";
    let displayName = factoryName.replace('Factory','');

    if (window.pieceDescriptions && window.pieceDescriptions[factoryName]) {
        const descEntry = window.pieceDescriptions[factoryName];
        if (typeof descEntry === 'object' && descEntry.description) {
             description = descEntry.description;
             displayName = descEntry.name || displayName;
        } else {
             description = descEntry;
        }
    } else if (dummyPiece.description) {
        description = dummyPiece.description;
    }

    // Use buildPieceModal from boardGeneration.js? 
    // Wait, buildPieceModal injects HTML into .pieceModal div and shows it.
    // We need to ensure that function is available or replicate it.
    // It is in boardGeneration.js which is loaded.
    if (typeof buildPieceModal === 'function') {
        // Close any existing modals first?
        const existingModal = document.querySelector('.pieceModal');
        if(existingModal) existingModal.innerHTML = '';

        buildPieceModal(hotseatGame.state, [{
            type: 'piece',
            board: miniBoard,
            icon: dummyPiece.icon,
            pieceX: 3,
            pieceY: 3,
            description: `<b>${displayName}</b><br>${description}`
        }]);
    }
}

function generateRewardOptions() {
    // Mission Types: Easy, Dangerous, Impossible
    // Easy: Enemy = 5 + Level*2, Reward <= 3
    // Dangerous: Enemy = 5 + Level*3, Reward <= 6
    // Impossible: Enemy = 8 + Level*4, Reward <= 9
    
    // Check player roster limits
    // Need to access frontLineFactories from setupBoard? 
    // It's local to setupBoard. I should move it to global or duplicate it.
    const frontLineFactories = ['rogueLikePawnFactory', 'swordsMen','ghostFactory', 'pikeman', 'roguelikeAntFactory', 'roguelikeQueenbugFactory'];
    let frontCount = 0;
    let backCount = 0;
    rogueState.playerRoster.forEach(u => {
        if(frontLineFactories.includes(u)) frontCount++;
        else backCount++;
    });
    
    const maxFront = 8;
    const maxBack = 8;
    
    let allowedFactories = [...availablePieceFactories];
    
    if (frontCount >= maxFront) {
        allowedFactories = allowedFactories.filter(f => !frontLineFactories.includes(f));
    }
    
    if (backCount >= maxBack) {
        allowedFactories = allowedFactories.filter(f => frontLineFactories.includes(f));
    }
    
    // If both full, allowedFactories will be empty (intersection of !front and front is empty)
    // Actually:
    // If front full: exclude front.
    // If back full: exclude back.
    // If both full: exclude both -> empty.
    
    const options = [];
    
    if(window.difficulties) {
        if (typeof grandMap !== 'undefined') {
             // Grand Map Logic
        const moves = grandMap.getAvailableMoves();
        
        moves.forEach(move => {
            const node = move.node;
            
            // Handle Market
            if (node.board === 'Market') {
                options.push({
                    type: "Visit Market",
                    direction: move.direction,
                    node: node,
                    description: "A safe place to buy units.",
                    rewardCap: 0,
                    enemyValue: 0,
                    difficultyIndex: -1, // Sort first?
                    boardShape: 'Market',
                    army: [],
                    rewardType: 'none'
                });
                return;
            }
            
            // Ensure army is pre-generated for accurate power display
            ensureNodeArmy(node);

            const diff = node.difficulty || { name: "Unknown", description: "Unknown Region" };

            const option = {
                type: `${move.direction}: ${diff.name}`,
                direction: move.direction,
                node: node,
                description: diff.description,
                rewardCap: node.rewardCap,
                enemyValue: node.actualEnemyValue || node.enemyPower, // Use actual value
                difficultyIndex: window.difficulties.indexOf(diff),
                boardShape: node.board || 'Standard',
                army: node.army // Pass army to option
            };
            
            if (node.board === 'Woods') option.description += " (Woods Map)";
            if (node.board === 'Fountain') option.description += " (Fountain Map)";

            options.push(option);
        });
    } else {
        // Fallback: Select 3 random difficulties based on level
        let baseIndex = rogueState.level;
        
        let d1 = Math.min(baseIndex, window.difficulties.length - 1);
        let d2 = Math.min(baseIndex + 1, window.difficulties.length - 1);
        let d3 = Math.min(baseIndex + 2, window.difficulties.length - 1);
        
        const maxIdx = window.difficulties.length - 1;
        
        if (baseIndex >= maxIdx) {
            d1 = maxIdx;
            d2 = maxIdx;
            d3 = maxIdx;
            if (maxIdx >= 2) {
                d1 = maxIdx - 2;
                d2 = maxIdx - 1;
                d3 = maxIdx;
            }
        } else if (baseIndex >= maxIdx - 1) {
                if (maxIdx >= 2) {
                    d1 = maxIdx - 2;
                    d2 = maxIdx - 1;
                    d3 = maxIdx;
                }
        }
        
        const diffs = [window.difficulties[d1], window.difficulties[d2], window.difficulties[d3]];
        const uniqueDiffs = [...new Set(diffs.filter(d => d !== undefined))];
        
        uniqueDiffs.forEach(diff => {
            // Generate army immediately
            const { army, value } = generateRandomArmy(diff.enemyValue, true);
            
            const option = {
                type: diff.name,
                description: diff.description,
                rewardCap: diff.rewardCap,
                enemyValue: value, // Use actual value
                difficultyIndex: window.difficulties.indexOf(diff),
                army: army // Store generated army
            };

            const mapChance = Math.random();
            if (mapChance < 0.1) {
                option.boardShape = 'Woods';
                option.description += " (Woods Map)";
            } else if (mapChance < 0.2) {
                option.boardShape = 'Fountain';
                option.description += " (Fountain Map)";
            } else {
                option.boardShape = 'Standard';
            }

            options.push(option);
        });
    }
        
        // Sort by difficulty index
        options.sort((a,b) => a.difficultyIndex - b.difficultyIndex);
        
        // Randomly assign piece rewards
        options.forEach(opt => {
            // 30% chance for a piece reward
            if (Math.random() < 0.3) {
                const maxPieceValue = opt.enemyValue / 2;
                
                // Use winnablePieceFactories if available, otherwise fallback
                const sourceList = (typeof winnablePieceFactories !== 'undefined' && winnablePieceFactories.length > 0) 
                                   ? winnablePieceFactories 
                                   : availablePieceFactories;
                                   
                const eligiblePieces = sourceList.filter(f => {
                    return getPieceValue(f) <= maxPieceValue && getPieceValue(f) >= maxPieceValue - 3;
                });
                
                if (eligiblePieces.length > 0) {
                    const randomPiece = eligiblePieces[Math.floor(Math.random() * eligiblePieces.length)];
                    opt.rewardType = 'piece';
                    opt.rewardContent = randomPiece;
                    opt.rewardValue = getPieceValue(randomPiece); // Store value for reference
                    
                    // Piece Food Reward: "If the reward type is a piece all the difference between the rewardValue and the randomPiece should be spent on food. The food should be 10*piece value missed"
                    // Assume rewardValue is based on opt.rewardCap (which is in Gold usually, or "Value Points").
                    // If enemyValue ~ 30, maxPieceValue ~ 15.
                    // rewardCap ~ 36.
                    // Piece Value ~ 15.
                    // Difference = rewardCap - PieceValue? Or maxPieceValue - PieceValue?
                    // User says: "difference between the rewardValue and the randomPiece".
                    // I'll assume rewardValue here means the 'rewardCap' (total budget).
                    
                    const budget = opt.rewardCap;
                    const pieceVal = getPieceValue(randomPiece);
                    const diff = Math.max(0, budget - pieceVal);
                    opt.foodReward = Math.floor(diff * 5);
                    
                } else {
                    opt.rewardType = 'gold';
                    opt.rewardContent = opt.rewardCap;
                    // Will calculate split later or now?
                    // Let's do it now.
                    // "Food/gold should be in random proportions for every mission."
                    // 2 food = 1 gold.
                    
                    const budget = opt.rewardCap;
                    // Random split: 10% to 90% gold?
                    const goldRatio = 0.1 + Math.random() * 0.8;
                    const goldAmount = Math.floor(budget * goldRatio);
                    const remainingBudget = budget - goldAmount;
                    const foodAmount = Math.floor(remainingBudget * 2);
                    
                    opt.rewardContent = goldAmount; // Gold amount
                    opt.foodReward = foodAmount;
                }
            } else {
                opt.rewardType = 'gold';
                // Same logic for Gold Split
                const budget = opt.rewardCap;
                const goldRatio = 0.1 + Math.random() * 0.8;
                const goldAmount = Math.floor(budget * goldRatio);
                const remainingBudget = budget - goldAmount;
                const foodAmount = Math.floor(remainingBudget * 2);
                
                opt.rewardContent = goldAmount;
                opt.foodReward = foodAmount;
            }
        });
        
    } else {
        // Fallback
        const defaultCap = 10 + rogueState.level * 2;
        const goldRatio = 0.5;
        const goldAmount = Math.floor(defaultCap * goldRatio);
        const foodAmount = Math.floor((defaultCap - goldAmount) * 2);
        
        options.push({
            type: 'Standard Battle', 
            enemyValue: 5 + rogueState.level * 2,
            rewardType: 'gold',
            rewardContent: goldAmount,
            foodReward: foodAmount,
            rewardCap: defaultCap
        });
    }
    
    // We don't generate reward armies anymore, just missions.
    return options;
}

// --- Level Management ---

function ensureNodeArmy(node) {
    if (!node.army) {
        const { army, value } = generateRandomArmy(node.enemyPower, true);
        node.army = army;
        node.actualEnemyValue = value;
    }
}

function startLevel(level, difficultyOption) {
    const overlay = document.getElementById('deathOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
    }
    rogueState.level = level;
    rogueState.mapSeed = Math.random() * 10000;
    rogueState.shopOptions = []; // Clear shop options to prevent reopening shop on refresh
    rogueState.showWinScreen = false; // Ensure win screen is cleared
    rogueState.gameOverSequenceStarted = false; // Reset flag for new level
    updateGoldDisplay();

    // Check if it's a market visit
    if (difficultyOption && difficultyOption.boardShape === 'Market') {
        // Move on map
        if (difficultyOption.node && typeof grandMap !== 'undefined') {
            grandMap.moveTo(difficultyOption.node.x, difficultyOption.node.y);
        }
        
        // Save state (position updated)
        saveProgress();
        
        // Show Shop
        showShopModal();
        return;
    }
    
    let difficultyName = 'Unknown';
    let enemyValue = 5;
    let rewardCap = 0;
    let boardShape = 'Standard';

    if (difficultyOption && typeof difficultyOption === 'object') {
        difficultyName = difficultyOption.type || 'Custom';
        enemyValue = difficultyOption.enemyValue || (5 + level * 2);
        rewardCap = difficultyOption.rewardCap || (10 + level * 2);
        boardShape = difficultyOption.boardShape || 'Standard';
        
        // Pass through reward type/content
        rogueState.currentRewardType = difficultyOption.rewardType || 'gold';
        rogueState.currentRewardContent = difficultyOption.rewardContent || rewardCap;
        rogueState.currentFoodReward = difficultyOption.foodReward || 0;

        // Grand Map Movement
        if (difficultyOption.node && typeof grandMap !== 'undefined') {
            grandMap.moveTo(difficultyOption.node.x, difficultyOption.node.y);
        }
        
    } else if (typeof difficultyOption === 'string') {
        difficultyName = difficultyOption;
        
        // Try to find the difficulty in the list
        const found = window.difficulties ? window.difficulties.find(d => d.name === difficultyOption) : null;
        if (found) {
            enemyValue = found.enemyValue;
            rewardCap = found.rewardCap;
            boardShape = found.boardShape || 'Standard';
        } else {
            enemyValue = 5 + level * 2;
            rewardCap = 10 + level * 2;
        }
        
        rogueState.currentRewardType = 'gold';
        rogueState.currentRewardContent = rewardCap;
        // Fallback food for string call?
        // 50% split assumption
        const goldAmt = Math.floor(rewardCap * 0.5);
        rogueState.currentRewardContent = goldAmt;
        rogueState.currentFoodReward = (rewardCap - goldAmt) * 2;
        
    } else {
        // Fallback or Initial Start
        if (window.difficulties && window.difficulties[0]) {
            difficultyName = window.difficulties[0].name;
            enemyValue = window.difficulties[0].enemyValue;
            rewardCap = window.difficulties[0].rewardCap;
            boardShape = window.difficulties[0].boardShape || 'Standard';
        } else {
             rewardCap = 10 + level * 2;
        }
        
        rogueState.currentRewardType = 'gold';
        const goldAmt = Math.floor(rewardCap * 0.5);
        rogueState.currentRewardContent = goldAmt;
        rogueState.currentFoodReward = (rewardCap - goldAmt) * 2;
    }

    rogueState.currentReward = rewardCap; // Keep for legacy or display?


    document.getElementById('levelDisplay').innerText = `Level: ${level}`;
    if (boardShape !== 'Standard') {
        document.getElementById('levelDisplay').innerText += ` [${boardShape}]`;
    }
    
    let enemyArmy;
    if (difficultyOption && difficultyOption.army) {
        // Use pre-generated army
        enemyArmy = difficultyOption.army;
        // If it was a node, update the node's cleared status later? No, that's done in win condition.
    } else if (difficultyOption && difficultyOption.node && difficultyOption.node.army) {
         enemyArmy = difficultyOption.node.army;
    } else {
        // Fallback generation
        const result = generateRandomArmy(enemyValue, true);
        enemyArmy = result.army;
    }
    
    rogueState.enemyRoster = enemyArmy;
    rogueState.boardShape = boardShape;

    if (boardShape === 'Fountain') {
        if (difficultyOption && difficultyOption.node && typeof difficultyOption.node.fountainX !== 'undefined') {
            rogueState.fountainX = difficultyOption.node.fountainX;
        } else if (difficultyOption && typeof difficultyOption.fountainX !== 'undefined') {
            rogueState.fountainX = difficultyOption.fountainX;
        } else {
             // Fallback for non-map or legacy
             rogueState.fountainX = Math.floor(Math.random() * 7);
        }
    }
    
    // Setup Board
    setupBoard(boardShape);
    
    // Reset Game State
    hotseatGame.state.turn = 'white';
    hotseatGame.state.won = null;
    hotseatGame.state.message = '';
    
    // Update Turn UI
    const turnDisplay = document.getElementById('turn');
    if(turnDisplay) {
        turnDisplay.innerText = "Your Turn";
        turnDisplay.style.color = 'var(--selected)';
    }
    
    rogueState.gameActive = true;

    // Save state after setup to ensure new board is saved
    saveProgress();
}

// Board Shapes
const boardShapes = {
    'Standard': (board) => {
        for (let x = 0; x <= 7; x++) {
            for (let y = 0; y <= 7; y++) {
                board.push({ light: false, x: x, y: y });
            }
        }
    },
    'Woods': (board) => {
        for (let x = 0; x <= 7; x++) {
            for (let y = 0; y <= 7; y++) {
                // Zig-zag missing squares in the middle: y=5 and y=4 alternate
                if ((y === 4 && x % 2 === 1) || (y === 3 && x % 2 === 0)) {
                    continue;
                }
                board.push({ light: false, x: x, y: y });
            }
        }
    },
    'Fountain': (board) => {
        const fx = (rogueState.fountainX !== undefined) ? rogueState.fountainX : 3;
        for (let x = 0; x <= 7; x++) {
            for (let y = 0; y <= 7; y++) {
                // 4 squares in the center are missing
                if ((x === fx || x === fx + 1) && (y === 3 || y === 4)) {
                    continue;
                }
                board.push({ light: false, x: x, y: y });
            }
        }
    }
};

function setupBoard(shapeName = 'Standard') {
    hotseatGame.state.pieces = [];
    hotseatGame.state.board = [];
    
    // Create Board Grid based on shape
    if (boardShapes[shapeName]) {
        boardShapes[shapeName](hotseatGame.state.board);
    } else {
        boardShapes['Standard'](hotseatGame.state.board);
    }
    
    // Helper to split army
    // "Infront" means closer to the enemy.
    const frontLineFactories = ['rogueLikePawnFactory', 'swordsMen','ghostFactory', 'pikeman', 'roguelikeAntFactory', 'roguelikeQueenbugFactory'];
    
    const splitArmy = (roster) => {
        const front = roster.filter(u => frontLineFactories.includes(u));
        const back = roster.filter(u => !frontLineFactories.includes(u));
        return { front, back };
    };

    function countFrontBack(roster) {
        let front = 0;
        let back = 0;
        roster.forEach(u => {
            if(frontLineFactories.includes(u)) front++;
            else back++;
        });
        return {front, back};
    }

    // Place Player Army (White)
    // Front Line: Row 6 (Pawns)
    // Back Line: Row 7 (Rest)
    const playerSplit = splitArmy(rogueState.playerRoster);
    placeArmy(playerSplit.front, 'white', [6]); 
    placeArmy(playerSplit.back, 'white', [7]); 
    
    // Place Enemy Army (Black)
    // Front Line: Row 1 (Pawns)
    // Back Line: Row 0 (Rest)
    const enemySplit = splitArmy(rogueState.enemyRoster);
    placeArmy(enemySplit.front, 'black', [1]);
    placeArmy(enemySplit.back, 'black', [0]);
}

function placeArmy(roster, color, rows) {
    // Simple placement strategy: Fill rows from left to right
    let currentRowIndex = rows.length - 1; // Start from bottom-most allowed row for white?
    if (color === 'black') currentRowIndex = 0; // Start from top for black
    
    let x = 0;
    let y = rows[currentRowIndex];
    
    // Helper to check if square exists
    const isValidSquare = (bx, by) => {
        // Use global findSquareByXY if available, otherwise simple check
        if (typeof findSquareByXY === 'function') {
            return findSquareByXY(hotseatGame.state.board, bx, by) !== undefined;
        }
        return hotseatGame.state.board.some(sq => sq.x === bx && sq.y === by);
    };

    // Helper to advance position
    const advance = () => {
        x++;
        if (x > 7) {
            x = 0;
            // Move to next row
            if (color === 'white') {
                currentRowIndex--;
                if (currentRowIndex < 0) return false; // End of rows
                y = rows[currentRowIndex];
            } else {
                currentRowIndex++;
                if (currentRowIndex >= rows.length) return false; // End of rows
                y = rows[currentRowIndex];
            }
        }
        return true;
    };

    roster.forEach(factoryName => {
        // Find next valid square
        // Safety break to prevent infinite loop if board is weirdly empty
        let attempts = 0;
        while (!isValidSquare(x, y) && attempts < 100) {
            if (!advance()) return; // No more rows
            attempts++;
        }
        
        if (attempts >= 100) return; // Should not happen

        if (typeof window[factoryName] === 'function') {
            const piece = window[factoryName](color, x, y);
            
            hotseatGame.state.pieces.push(piece);
            
            // Advance position for next unit
            advance();
        }
    });
}

// --- UI / Modals ---

function showStartModal() {
    const modal = document.getElementById('startDialog');
    const container = document.getElementById('startOptions');
    container.innerHTML = '';
    
    // Generate 4 starting armies (Value 5-7)
    for (let i = 0; i < 4; i++) {
        const { army, value } = generateRandomArmy(6, true);
        
        // Removed markPieceAsSeen(name) call to stop auto-popup

        const div = document.createElement('div');
        div.className = 'army-option';
        // div.innerHTML = `<h3>Option ${i+1}</h3><p>Value: ${value.toFixed(1)}</p>`;
        
        // Info Button
        const infoBtn = document.createElement('button');
        infoBtn.innerText = 'Info';
        infoBtn.style.marginBottom = '5px';
        infoBtn.onclick = (e) => {
            e.stopPropagation();
            showArmyInfo(army);
        };
        div.appendChild(infoBtn);

        const preview = document.createElement('div');
        preview.className = 'army-preview';
        army.forEach(name => {
            // Create temp piece to get icon
            if (typeof window[name] === 'function') {
                const p = window[name]('white', 0, 0);
                const img = document.createElement('img');
                img.src = `/static/${p.icon}`;
                img.title = name; // Tooltip
                img.onclick = (e) => {
                    e.stopPropagation(); // Prevent selecting the army
                    showPieceDiscoveryModal(name);
                };
                preview.appendChild(img);
                
                // Mark as seen if we want to track it, but here we allow clicking to see info
            }
        });
        div.appendChild(preview);
        
        div.onclick = () => {
            rogueState.playerRoster = army;
            modal.close();
            // Start level 1 with the easiest difficulty
            const difficulty = window.difficulties ? window.difficulties[0] : { enemyValue: 3 };
            startLevel(1, difficulty);
        };
        
        container.appendChild(div);
    }
    
    modal.showModal();
    
    // Show Current Coordinates if available
    if (typeof grandMap !== 'undefined') {
        const coords = grandMap.getState();
        const header = modal.querySelector('h2');
        if (header) {
            header.innerText = `Choose Your Next Mission (Position: ${coords.currentX}, ${coords.currentY})`;
        }
    }
}

function showShopModal(restore = false) {
    // Reset overlay
    const overlay = document.getElementById('deathOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
    }
    
    // Clear win screen flag since we moved to shop
    rogueState.showWinScreen = false;
    // Don't save yet, we save when generating/restoring shop options below

    const modal = document.getElementById('shopDialog');
    const container = document.getElementById('shopOptions');
    container.innerHTML = '';
    
    const goldDisplay = document.getElementById('playerGold');
    if (goldDisplay) goldDisplay.innerText = rogueState.gold;

    // Use existing shop options if restoring, else generate new
    let shopItems = [];
    if (restore && rogueState.shopOptions && rogueState.shopOptions.length > 0) {
        shopItems = rogueState.shopOptions;
    } else {
        // Generate 6 random units to buy (as requested)
        for(let i=0; i<6; i++) {
            const randomFactory = marketPieceFactories[Math.floor(Math.random() * marketPieceFactories.length)];
            const val = getPieceValue(randomFactory);
            const cost =  Math.floor(val * 5);
            shopItems.push({factory: randomFactory, cost: cost, value: val, bought: false});
        }
        rogueState.shopOptions = shopItems;
        saveProgress();
    }

    const updateAllButtons = () => {
        const buttons = container.querySelectorAll('.buy-btn');
        buttons.forEach(btn => {
            const index = btn.dataset.index;
            const item = shopItems[index];
            if (item.bought) return; // Already bought state handled

            if (rogueState.gold < item.cost) {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            } else {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            }
        });
    };

    shopItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'army-option';
        
        let icon = '';
        if (typeof window[item.factory] === 'function') {
             const p = window[item.factory]('white', 0, 0);
             icon = `<img src="/static/${p.icon}" style="width:50px;height:50px;display:block;margin:0 auto 10px;cursor:help" title="Click for info">`;
             
             // Add click handler to icon for info
             setTimeout(() => {
                 const img = div.querySelector('img');
                 if(img) {
                     img.onclick = (e) => {
                         e.stopPropagation();
                         showPieceDiscoveryModal(item.factory);
                     };
                 }
             }, 0);
        }
        
        div.innerHTML = `
            ${icon}
            <h3>${item.factory.replace('Factory','').replace('rogueLike','')}</h3>
            <p>Power: ${item.value}</p>
            <p style="color:#e5b53e;font-weight:bold;">Cost: ${item.cost} 🪙</p>
        `;
        
        // Info Button
        const infoBtn = document.createElement('button');
        infoBtn.innerText = 'Info';
        infoBtn.style.width = '100%';
        infoBtn.style.marginBottom = '5px';
        infoBtn.style.fontSize = '12px';
        infoBtn.onclick = (e) => {
            e.stopPropagation();
            showPieceDiscoveryModal(item.factory);
        };
        div.appendChild(infoBtn);

        // Buy Button
        const buyBtn = document.createElement('button');
        buyBtn.innerText = item.bought ? 'Bought' : 'Buy';
        buyBtn.className = 'buy-btn';
        buyBtn.dataset.index = index;
        buyBtn.style.width = '100%';
        
        if (item.bought) {
            buyBtn.disabled = true;
            div.style.opacity = '0.5';
        }
        
        buyBtn.onclick = (e) => {
            e.stopPropagation();
            if (rogueState.gold >= item.cost && !item.bought) {
                rogueState.gold -= item.cost;
                rogueState.playerRoster.push(item.factory);
                item.bought = true;
                
                if (document.getElementById('playerGold')) {
                    document.getElementById('playerGold').innerText = rogueState.gold;
                }
                updateGoldDisplay();
                saveProgress();
                
                // Update UI
                buyBtn.innerText = 'Bought';
                buyBtn.disabled = true;
                div.style.opacity = '0.5';
                
                // Refresh all buttons
                updateAllButtons();
            }
        };
        
        div.appendChild(buyBtn);
        container.appendChild(div);
    });
    
    // Initial update
    updateAllButtons();

    modal.showModal();
}

function showRewardModal() {
    const modal = document.getElementById('rewardDialog');
    const container = document.getElementById('rewardOptions');
    container.innerHTML = '';
    
    // Show Current Coordinates if available
    if (typeof grandMap !== 'undefined') {
        const coords = grandMap.getState();
        const header = modal.querySelector('h2');
        if (header) {
            header.innerText = `Choose Your Next Mission (Position: ${coords.currentX}, ${coords.currentY})`;
        }
    }
    
    const rewards = generateRewardOptions();
    
    rewards.forEach((option, i) => {
        const army = option.army;
        const val = option.value;

        const div = document.createElement('div');
        div.className = 'army-option';
        
        if (option.boardShape === 'Woods') {
            div.classList.add('woods-option');
        } else if (option.boardShape === 'Fountain') {
            div.classList.add('fountain-option');
        } else if (option.boardShape === 'Market') {
            // Market styling
            div.style.background = 'linear-gradient(135deg, #fff9c4 0%, #ffecb3 100%)';
            div.style.borderColor = '#ffa000';
            div.innerHTML = `<h3>${option.type}</h3>
                             <p style="font-size:14px;">${option.description || ''}</p>
                             <div style="text-align:center; font-size: 40px; margin: 10px 0;">🛒</div>
                             <p style="text-align:center;">Safe Zone</p>`;
                             
            div.onclick = () => {
                 modal.close();
                 saveProgress();
                 // Market counts as a level/stage visit
                 startLevel(rogueState.level + 1, option);
             };
             container.appendChild(div);
             return; // Skip standard rendering
        }
        
        let rewardText = "";
        let rewardIcon = "";

        if (option.rewardType === 'piece') {
            const pieceFactory = option.rewardContent;
            let iconSrc = "";
            if (typeof window[pieceFactory] === 'function') {
                 const p = window[pieceFactory]('white', 0, 0);
                 iconSrc = `/static/${p.icon}`;
            }
            
            // Just the icon, clickable
            // We need to attach the click handler after inserting HTML
            rewardText = `<div class="reward-icon-container" style="cursor:help; display:inline-block; vertical-align:middle;">
                             <img src="${iconSrc}" class="reward-icon" data-factory="${pieceFactory}" style="width:40px; height:40px; filter:drop-shadow(2px 2px 2px rgba(0,0,0,0.3)); transition:transform 0.2s;">
                          </div>`;
            
            if (option.foodReward > 0) {
                 rewardText += ` + ${option.foodReward} 🍖`;
            }
        } else {
            rewardText = `${option.rewardContent || '?'} 🪙`;
            if (option.foodReward > 0) {
                 rewardText += ` + ${option.foodReward} 🍖`;
            }
        }
        
        div.innerHTML = `<h3>${option.type}</h3>
                         <p style="font-size:14px;">${option.description || ''}</p>
                         <p>Enemy Power: ${option.enemyValue || '?'}</p>
                         <div style="display:flex; align-items:center; justify-content:center; gap:10px;">
                            <span>Reward:</span>
                            ${rewardText}
                         </div>`;
        
        // Add click listener for the reward icon
        if (option.rewardType === 'piece') {
            setTimeout(() => {
                const img = div.querySelector('.reward-icon');
                if(img) {
                    img.onclick = (e) => {
                        e.stopPropagation(); // Prevent starting the level
                        showPieceDiscoveryModal(option.rewardContent);
                    };
                    img.onmouseenter = () => img.style.transform = 'scale(1.2)';
                    img.onmouseleave = () => img.style.transform = 'scale(1)';
                }
            }, 0);
        }
        
        // Info Button
        // Removed as per request "Also I want the "Info" button removed from the battle options"
        /*
        const infoBtn = document.createElement('button');
        infoBtn.innerText = 'Info';
        infoBtn.style.marginBottom = '5px';
        infoBtn.onclick = (e) => {
            e.stopPropagation();
            showArmyInfo(army);
        };
        div.appendChild(infoBtn);
        */
        
        div.onclick = () => {
            // rogueState.pendingReward = army; // No longer needed
            modal.close();
            saveProgress();
            startLevel(rogueState.level + 1, option);
        };
        
        container.appendChild(div);
    });
    
    modal.showModal();
}

// --- Win Condition Helper ---
function checkWinCondition(state) {

    if (state.won) return; // Already won

    // Check if King Captured (Regicide)
    const whiteKing = state.pieces.find(p => (p.icon.includes('King') || p.icon.includes('king') || p.icon.includes('SimpleKing')) && p.color === 'white');
    const blackKing = state.pieces.find(p => (p.icon.includes('King') || p.icon.includes('king') || p.icon.includes('SimpleKing')) && p.color === 'black');
    
    if (!whiteKing) {
        state.won = 'black';
        state.message = "White King Fallen!";
        return;
    }

    if (rogueState.food <= 0) {
        state.won = 'black';
        state.message = "Starvation!";
        return;
    }
    
    if (!blackKing) {
        state.won = 'white';
        state.message = "Black King Fallen!";
        return;
    }
}

function checkGameOver(state) {
    if (rogueState.gameOverSequenceStarted) return; // Prevent multiple executions

    checkWinCondition(state);
    
    if (state.won) {
        rogueState.gameActive = false;
        rogueState.gameOverSequenceStarted = true; // Mark as started

        if (state.won === 'white') {
            // Player Won
            // Fade to black
            const overlay = document.getElementById('deathOverlay');
            if (overlay) {
                overlay.style.opacity = '1';
                // Ensure it's on top of everything except modals
                overlay.style.zIndex = '900'; 
            }
            
            let winText = "Victory!";
            
            try {
                // Earn Gold or Piece
                let foodEarned = rogueState.currentFoodReward || 0;
                
                if (rogueState.currentRewardType === 'piece') {
                    const pieceFactory = rogueState.currentRewardContent;
                    if (pieceFactory) {
                        rogueState.playerRoster.push(pieceFactory);
                        
                        // Show what piece was won
                        let pieceName = pieceFactory.replace('Factory','').replace('rogueLike','');
                        winText = `Won Unit: ${pieceName}`;
                    } else {
                        winText = "Won a new unit!";
                    }
                    
                    // Food for piece reward was calculated in generateRewardOptions and stored in currentFoodReward
                    if (foodEarned > 0) {
                         winText += ` + ${foodEarned} 🍖`;
                    }
                    
                } else {
                    // Gold comes from currentRewardContent
                    const goldEarned = rogueState.currentRewardContent || 0;
                    rogueState.gold = (rogueState.gold || 0) + goldEarned;
                    winText = `+${goldEarned} 🪙`;
                    if (foodEarned > 0) {
                         winText += ` + ${foodEarned} 🍖`;
                    }
                }
                
                rogueState.food = (rogueState.food || 0) + foodEarned;
                updateGoldDisplay();
                
                // Clear pending rewards (shop replaces direct rewards)
                rogueState.pendingReward = []; 
                
                // Mark win screen as active
                rogueState.showWinScreen = true;
                
                saveProgress();
            } catch (e) {
                console.error("Error processing reward:", e);
                winText = "Victory!";
            }

            const goldText = document.getElementById('goldEarnedText');
            if(goldText) goldText.innerText = winText;

            setTimeout(() => {
                const modal = document.getElementById('gameWonDialog');
                if(modal) modal.showModal();
            }, 2000);
            
        } else if (state.won === 'black') {
            // Player Lost
            clearProgress(); // Wipe save on death  
            
            // Fade to black
            const overlay = document.getElementById('deathOverlay');
            if (overlay) {
                overlay.style.opacity = '1';
            }
            
            setTimeout(() => {
                const modal = document.getElementById('gameOverDialog');
                modal.showModal();
                if (overlay) {
                     // Ensure overlay stays but is behind modal
                     overlay.style.zIndex = '900'; // Keep it high but below modal if possible
                     // Dialogs are in top layer, so they should be above z-index 900
                }
            }, 2000);
        } 
    }
}


// --- Interaction / Game Loop (Adapted) ---

const AIProps = {
    state: undefined,
    color: 'white',
    hotseatGame: undefined
};

function AIMove(pieceIndex, xClicked, yClicked, color) {
    const state = hotseatGame.state;
    // Fix: pieceIndex logic in hotseat was color-relative in some versions, absolute in others.
    // The optimized AI sends absolute index usually.
    // But helperFunctions might expect filtered array.
    
    // In optimized AI, we might just need to find the piece.
    // Let's assume the worker sends correct data.
    
    // Re-selecting logic from hotseat.js:
    const myPieces = hotseatGame.state.pieces.filter(p => p.color === color);
    // If pieceIndex is from the filtered list:
    if (myPieces[pieceIndex]) {
        const actualPiece = myPieces[pieceIndex];
        selectPiece({x: actualPiece.x, y: actualPiece.y}, state);
        hotseatGame.move(state.turn, { x: xClicked, y: yClicked });
    } else {
        console.error("AI tried to move invalid piece index", pieceIndex);
    }
    
    checkGameOver(hotseatGame.state);
}

// Event Listeners
canvas.addEventListener('click', (e) => {
    if (!rogueState.gameActive) return;
    if (hotseatGame.state.turn !== 'white') return; // Player is White
    
    const state = hotseatGame.state;
    if(!w){
        w = new Worker("src/webworker.js");
    }

    var element = canvas, offsetX = 0, offsetY = 0;
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }

    const mx = e.pageX - offsetX;
    const my = e.pageY - offsetY;
    const x = parseInt(mx / squareLength);
    const y = parseInt(my / squareLength);

    const previousTurn = hotseatGame.state.turn;
    hotseatGame.move('white', { x, y });
    const currentTurn = hotseatGame.state.turn;
    
    // Consume Food only when a move is completed (turn changes)
    if (previousTurn === 'white' && currentTurn === 'black') {
        if (rogueState.food > 0) {
            rogueState.food--; // Decrement by 1 as per user request
        } else {
            // Starvation handled in checkGameOver
        }
    }
    updateGoldDisplay();

    // Save progress after player move
    saveProgress();
    
    // Update Turn Display
    const turnDisplay = document.getElementById('turn');
    if(turnDisplay) {
        if(state.turn === 'white') {
            turnDisplay.innerText = "Your Turn";
            turnDisplay.style.color = 'var(--selected)';
        } else {
            turnDisplay.innerText = "Enemy Turn";
            turnDisplay.style.color = '#ff6b6b';
        }
    }
    
    checkGameOver(state);
    
    // If turn switched to Black, trigger AI
    if (state.turn === 'black' && !state.won) {
        triggerAI();
    }
});

function triggerAI(color) {
    if(!color) color = 'black';
    if (!w) w = new Worker("src/webworker.js");
    const state = hotseatGame.state;
    
    // Shuffle pieces slightly for randomness? (From hotseat.js)
    // state.pieces = state.pieces.sort((a, b) => 0.5 - Math.random());
    
    w.postMessage(JSONfn.stringify({
        state: state,
        color: color,
        AIPower: 105 // Fixed power or scaled? Prompt said "Level*2" for army value, maybe AI power stays constant or increases?
    }));

    w.onmessage = function(event) {
        let move = JSONfn.parse(event.data);
        AIMove(move.pieceCounter, move.xClicked, move.yClicked, 'black');
        
        // Save progress after AI move
        saveProgress();
        
        // Update Turn Display
        const turnDisplay = document.getElementById('turn');
        if(turnDisplay) {
            if(hotseatGame.state.turn === 'white') {
                turnDisplay.innerText = "Your Turn";
                turnDisplay.style.color = 'var(--selected)';
            } else {
                turnDisplay.innerText = "Enemy Turn";
                turnDisplay.style.color = '#ff6b6b';
            }
        }
        
        // Check game over again after AI move
        checkGameOver(hotseatGame.state);
    };
}


canvas.addEventListener('mousemove', (e) => {
    let {x, y} = getMousePos(canvas,e);
    if(!hotseatGame || !hotseatGame.state || !hotseatGame.state.pieces){
        return;
    }
    hoveredPiece = pieceFromXY(parseInt(x / squareLength), parseInt(y / squareLength), hotseatGame.state.pieces);
});

// Wait for assets then start
const waitForImages = async () => {
    if (document.readyState !== 'complete') {
         await new Promise(resolve => window.addEventListener('load', resolve));
    }
    if(window.imagesLoaded){
        await window.imagesLoaded;
    }
    
    // Initialize
    const loadingScreen = document.getElementById('loadingScreen');
    if(loadingScreen) loadingScreen.style.display = 'none';
    
    initRogueGame();
};

waitForImages();

// --- Drawing Helpers (copied from hotseat.js mostly) ---
// I need `animate`, `drawPiece`, `drawSquare` etc.
// Since `hotseat.js` is not a module, I can't import them easily unless I expose them globally or copy them.
// `hotseat.js` defined `animate` globally? No, `let ani`.
// But `drawPiece`, `drawBlackSquare` are likely in `helperFunctions.js` or defined in `hotseat.js`?
// Let's check `hotseat.js` again.
// It uses `drawBlackSquare` etc. but I didn't see their definition in `hotseat.js`.
// They must be in `helperFunctions.js` or `loadImages.js`?
// Checking `LS`: `loadImages.js` is in `src/`. `helperFunctions.js` is in root.
// I'll assume they are global.

function animate(secretState){
    // ... Copying the animate function logic from hotseat.js ...
    // Since I can't import `animate` from `hotseat.js`, I must redefine it.
    
    canvas.width = squareLength * 8 + squareLength; // Default 8x8
    canvas.height = squareLength * 8 + squareLength;
    
    const state = secretState;
    if(hoveredPiece){
        // Clear threat highlights
        closeLights(state.board, 'red');
        closeLights(state.board, 'grey');
        
        if(hoveredPiece.color != hotseatGame.state.turn && hotseatGame.state.turn != undefined){
            lightBoardFE(hoveredPiece,state,'red','grey')
        }
    } else {
        closeLights(state.board, 'red');
        closeLights(state.board, 'grey');
    }

    // Background
    if (rogueState.boardShape === 'Woods') {
        // Deep forest green gradient for woods theme
        document.body.style.background = 'radial-gradient(circle, #556b2f 0%, #1a2f16 100%)';
    } else if (rogueState.boardShape === 'Fountain') {
        // Watery blue gradient for fountain theme
        document.body.style.background = 'radial-gradient(circle, #4fc3f7 0%, #01579b 100%)';
    } else {
        document.body.style.background = backgroundColor; // from variables.js
    }

    // Draw Board
    state.board.forEach((sq) => {
        let y = sq.y;
        let x = sq.x;
        let orderFirst = (y % 2 === 0); 
        
        let isBlack = false;
        if(y % 2 !== 0) { // Odd row
             if(x % 2 === 0) isBlack = true;
        } else { // Even row
             if(x % 2 !== 0) isBlack = true;
        }
        
        // Custom  for Woods
        let currentWhiteColor = whiteSquareColor;
        let currentBlackColor = blackSquareColor;
        
        if (rogueState.boardShape === 'Woods') {
            currentWhiteColor = '#8fbc8f'; // DarkSeaGreen
            currentBlackColor = '#556b2f'; // DarkOliveGreen
        } else if (rogueState.boardShape === 'Fountain') {
            currentWhiteColor = '#b3e5fc'; // Light Blue
            currentBlackColor = '#0288d1'; // Dark Blue
        }
        
        // Simplified drawing
        if (!sq.light && !sq.special && !sq.red && !sq.grey) {
            if (isBlack) drawColoredSquare(x * squareLength, y * squareLength, currentBlackColor, squareLength);
            else drawColoredSquare(x * squareLength, y * squareLength, currentWhiteColor, squareLength);
            
            if(state.pieceSelected && x === state.pieceSelected.x && y === state.pieceSelected.y){
                if (rogueState.boardShape === 'Fountain') {
                    // Darker blue for selected piece in fountain map
                    drawColoredSquare(x*squareLength, y*squareLength, 'rgba(1, 87, 155, 0.7)', squareLength);
                } else {
                    drawColoredSquare(x*squareLength, y*squareLength, availableSquareColor, squareLength);
                }
            }
        }
        else if (sq.light) {
            if (rogueState.boardShape === 'Fountain') {
                // Watery blue highlight
                drawColoredSquare(x * squareLength, y * squareLength, 'rgba(79, 195, 247, 0.8)', squareLength);
            } else {
                drawLightedSquare(x * squareLength, y * squareLength, squareLength);
            }
        }
        else if(sq.red) drawColoredSquare(x*squareLength, y * squareLength, dangerSquareColor, squareLength);
        else if(sq.grey) drawColoredSquare(x*squareLength, y * squareLength, blockedSquareColor, squareLength);
        else if(sq.special){
                drawColoredSquare(x*squareLength, y * squareLength, specialSquareColor, squareLength)
            }
    });

    // Draw Trees in Empty Spaces for Woods Map
    if (rogueState.boardShape === 'Woods') {
        // Draw internal void bushes
        for(let tx=0; tx<8; tx++){
            for(let ty=0; ty<8; ty++){
                const exists = state.board.find(s => s.x === tx && s.y === ty);
                if(!exists){
                    if (typeof drawBush === 'function') {
                        drawBush(ctx, tx, ty, squareLength, rogueState.mapSeed);
                    }
                }
            }
        }
    } else if (rogueState.boardShape === 'Fountain') {
         // Draw large fountain in the center (covering 4 squares)
         if (typeof drawFountain === 'function') {
             const fx = (rogueState.fountainX !== undefined) ? rogueState.fountainX : 3;
             drawFountain(ctx, fx + 0.5, 3.5, squareLength, rogueState.mapSeed, 1);
         }
     }

    if(state.oldMove){
            const oldSquare = findSquareByXY(state.board,state.oldMove.oldX, state.oldMove.oldY);
            const newSquare = findSquareByXY(state.board,state.oldMove.currentX, state.oldMove.currentY);

            if(hotseatGame.state.turn === 'black'){
                if(oldSquare && !oldSquare.light){
                    drawColoredSquare(state.oldMove.oldX*squareLength, state.oldMove.oldY*squareLength,oldMoveSquareColor, squareLength)
                }
                if(newSquare && !newSquare.light){
                    drawColoredSquare(state.oldMove.currentX*squareLength, state.oldMove.currentY*squareLength,oldMoveSquareColor, squareLength)
                }
            }
            else if(hotseatGame.state.turn === 'white'){

                if(oldSquare && !oldSquare.light){
                    drawColoredSquare(state.oldMove.oldX*squareLength, state.oldMove.oldY*squareLength,oldMoveSquareColor, squareLength)
                }
                if(newSquare && !newSquare.light){
                    drawColoredSquare(state.oldMove.currentX*squareLength, state.oldMove.currentY*squareLength,oldMoveSquareColor, squareLength)
                }
            }

        }

    // Draw Pieces
    state.pieces.forEach((piece) => {
        // Animation logic
        if (typeof piece.currentX === 'undefined') {
            piece.currentX = piece.x;
            piece.currentY = piece.y;
        }
        
        // Interpolate towards target (0.1 speed)
        const speed = 0.1;
        piece.currentX += (piece.x - piece.currentX) * speed;
        piece.currentY += (piece.y - piece.currentY) * speed;
        
        // Snap if close enough
        if (Math.abs(piece.x - piece.currentX) < 0.01) piece.currentX = piece.x;
        if (Math.abs(piece.y - piece.currentY) < 0.01) piece.currentY = piece.y;
        
        drawPiece(piece.currentX, piece.currentY, piece.icon, squareLength);
    });
    
    // Status Text
    const turnText = document.getElementById('turn');
    if (turnText) {
        turnText.innerText = state.turn === 'white' ? "Your Turn" : "Enemy Turn";
        // Always use same color for consistency, or ensure same style
        turnText.style.color = state.turn === 'white' ? "var(--selected)" : "#ff6b6b";
    }
}
