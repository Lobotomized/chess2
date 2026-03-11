
// Rogue Like Game Logic

// List of available piece factories for random generation
const availablePieceFactories = [
    // Classic
    'rogueLikePawnFactory', 'rookFactory', 'knightFactory', 'bishopFactory', 'queenFactory', 'simpleKingFactory',
    'ghostFactory', 'horseFactory', "swordsMen", 
    // Animals
    // 'horseFactory', 'pigFactory', 'ghostFactory', 'spiderFactory', 
    // 'ladyBugFactory', 'goliathBugFactory', 'antFactory',
    // // Medieval
    // 'pikeman', 'swordsMen', 'shield', 
    // // Machines
    // 'cyborgFactory', 'executorFactory', 'bootvesselFactory',
    // Cats
];

// Helper to get piece value
function getPieceValue(factoryName) {
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
    gameActive: false
};

// --- Hotseat Game Setup (Copied/Adapted from hotseat.js) ---
const AIColor = 'black'; // AI is always Black
let AIPowerWhite = 3;
let AIPowerBlack = 3; // Can increase with level?

let aiPowers = {
    white: 3,
    black: 3
};

let squareLength = screen.width < screen.height ? parseInt(screen.width / 8) : parseInt(screen.height / 12);
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const forfeitTextButton = document.getElementById('forfeitText');
let hotseatGame;
let mouseX;
let mouseY;
let w; // Web Worker
let hoveredPiece;
let boardWidth, boardHeight;

// Initialize Game
function initRogueGame() {
    hotseatGame = getSinglePlayerGame();
    hotseatGame.join('white', 'white');
    hotseatGame.join('black', 'black');
    
    // Start Animation Loop
    // Use requestAnimationFrame for smooth animation
    requestAnimationFrame(aniLoop);
    
    // Check for saved game
    const savedState = localStorage.getItem('rogueState');
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            Object.assign(rogueState, parsed);
            
            // Restore level
            document.getElementById('levelDisplay').innerText = `Level: ${rogueState.level}`;
            
            // Re-setup board with saved rosters
            setupBoard();
            rogueState.gameActive = true;
            hotseatGame.state.turn = 'white'; // Reset turn to player on load for simplicity
            hotseatGame.state.won = null;
            hotseatGame.state.message = 'Game Restored';
            
        } catch (e) {
            console.error("Failed to load save:", e);
            showStartModal();
        }
    } else {
        // Show Start Modal
        showStartModal();
    }
}

function saveProgress() {
    localStorage.setItem('rogueState', JSON.stringify(rogueState));
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
                pieces: [dummyPiece]
            };
            lightBoardFE(dummyPiece, tempState, 'lighted');
            
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
        pieces: [dummyPiece]
    };
    lightBoardFE(dummyPiece, tempState, 'lighted');
    
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
    const frontLineFactories = ['rogueLikePawnFactory', 'swordsMen','ghostFactory'];
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
    
    const missionTypes = ['Easy', 'Dangerous', 'Impossible'];
    const options = [];
    
    // Generate 3 random mission types
    const selectedTypes = [];
    for(let i=0; i<3; i++) {
        selectedTypes.push(missionTypes[Math.floor(Math.random() * missionTypes.length)]);
    }
    
    selectedTypes.forEach(type => {
        let rewardCap = 3;
        if(type === 'Dangerous') rewardCap = 8;
        if(type === 'Impossible') rewardCap = 12;
        
        let army = [];
        let value = 0;
        
        if (allowedFactories.length > 0) {
            // Custom generateRandomArmy using allowedFactories
             let currentValue = 0;
             let iterations = 0;
             // Calculate target reward value
             const targetValue = Math.max(1, rewardCap - Math.random() * 2);
             
             while (currentValue < targetValue && iterations < 100) {
                iterations++;
                const randomFactory = allowedFactories[Math.floor(Math.random() * allowedFactories.length)];
                const val = getPieceValue(randomFactory);
                
                if (currentValue + val <= targetValue + 1) {
                    army.push(randomFactory);
                    currentValue += val;
                }
            }
            value = currentValue;
        } else {
            // Army full, no reward
            value = 0;
        }
        
        options.push({
            type: type,
            army: army,
            value: value
        });
    });
    
    return options;
}

// --- Level Management ---

function startLevel(level, difficultyType = 'Easy') {
    rogueState.level = level;
    document.getElementById('levelDisplay').innerText = `Level: ${level} (${difficultyType})`;
    
    // Generate Enemy Army based on difficulty
    // Easy: 5 + Level*2
    // Dangerous: 5 + Level*3
    // Impossible: 8 + Level*4
    
    let targetEnemyValue = 5 + level * 2;
    if (difficultyType === 'Dangerous') targetEnemyValue = 8 + level * 3;
    if (difficultyType === 'Impossible') targetEnemyValue = 12 + level * 4;
    
    // Adjust for player strength? 
    // The previous formula was: PlayerValue - 2 + (level - 1)
    // The user instruction overrides this with specific formulas.
    // "If you take 'Easy Mission' the enemy should have army of value 5 + the level *2"
    // This seems to ignore player strength, which is interesting for a rogue-like (you can outscale or fall behind).
    
    const { army: enemyArmy } = generateRandomArmy(targetEnemyValue, true);
    rogueState.enemyRoster = enemyArmy;
    
    // Save state
    saveProgress();
    
    // Setup Board
    setupBoard();
    
    // Reset Game State
    hotseatGame.state.turn = 'white';
    hotseatGame.state.won = null;
    hotseatGame.state.message = '';
    
    // Update Turn UI
    const turnDisplay = document.getElementById('turn');
    if(turnDisplay) {
        turnDisplay.innerText = "Your Turn";
        turnDisplay.style.color = 'var(--board-light)';
    }
    
    rogueState.gameActive = true;
}

function setupBoard() {
    hotseatGame.state.pieces = [];
    hotseatGame.state.board = [];
    
    // Create Board Grid
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 7; y++) {
            hotseatGame.state.board.push({ light: false, x: x, y: y });
        }
    }
    
    // Helper to split army
    // "Infront" means closer to the enemy.
    const frontLineFactories = ['rogueLikePawnFactory', 'swordsMen','ghostFactory'];
    
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
    let placedCount = 0;
    const maxPieces = rows.length * 8;
    
    roster.forEach(factoryName => {
        if (placedCount >= maxPieces) {
             // Stop placing if board area is full
             return;
        }

        if (typeof window[factoryName] === 'function') {
            const piece = window[factoryName](color, x, y);
            
            
            hotseatGame.state.pieces.push(piece);
            placedCount++;
            
            // Advance position
            x++;
            if (x > 7) {
                x = 0;
                // Move to next row
                if (color === 'white') {
                    currentRowIndex--;
                    if (currentRowIndex < 0) {
                         // Should not happen due to maxPieces check, but safety break
                         currentRowIndex = rows.length - 1; 
                    }
                } else {
                    currentRowIndex++;
                    if (currentRowIndex >= rows.length) {
                        currentRowIndex = 0;
                    }
                }
                y = rows[currentRowIndex];
            }
        }
    });
}

// --- UI / Modals ---

function showStartModal() {
    const modal = document.getElementById('startDialog');
    const container = document.getElementById('startOptions');
    container.innerHTML = '';
    
    // Generate 3 starting armies (Value 5-7)
    for (let i = 0; i < 3; i++) {
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
            startLevel(1);
        };
        
        container.appendChild(div);
    }
    
    modal.showModal();
}

function showRewardModal() {
    const modal = document.getElementById('rewardDialog');
    const container = document.getElementById('rewardOptions');
    container.innerHTML = '';
    
    const rewards = generateRewardOptions();
    
    rewards.forEach((option, i) => {
        // Removed markPieceAsSeen to stop auto-popup
        const army = option.army;
        const type = option.type;
        const val = option.value;

        const div = document.createElement('div');
        div.className = 'army-option';
        // const val = army.reduce((acc, name) => acc + getPieceValue(name), 0);
        div.innerHTML = `<h3>${type} Mission</h3><p>Reward Value: ${val.toFixed(1)}</p>`;
        
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
            if (typeof window[name] === 'function') {
                const p = window[name]('white', 0, 0);
                const img = document.createElement('img');
                img.src = `/static/${p.icon}`;
                img.title = name;
                img.onclick = (e) => {
                    e.stopPropagation();
                    showPieceDiscoveryModal(name);
                };
                preview.appendChild(img);
            }
        });
        div.appendChild(preview);
        
        div.onclick = () => {
            rogueState.playerRoster.push(...army);
            modal.close();
            saveProgress();
            startLevel(rogueState.level + 1, type);
        };
        
        container.appendChild(div);
    });
    
    modal.showModal();
}

// --- Win Condition Helper ---
function checkWinCondition(state) {

    if (state.won) return; // Already won

    const currentTurn = state.turn;
    const opponent = currentTurn === 'white' ? 'black' : 'white';
    
    // Check if current player has no moves (Stalemate or Checkmate)
    // checkRemi returns true if NO moves are available for the current turn player
    // But helperFunctions.js checkRemi might be buggy or simple.
    // Let's rely on it for "no moves".
    if (checkRemi(state)) {
        // No moves left.
        // Check if King is under attack
        const king = state.pieces.find(p => (p.icon.includes('King') || p.icon.includes('king')) && p.color === currentTurn);
        let isCheck = false;
        
        if (king) {
            // Use helper's isPositionAttacked
            if (isPositionAttacked(state, currentTurn, king.x, king.y)) {
                isCheck = true;
            }
        }
        
        if (isCheck) {
            // Checkmate: Opponent wins
            state.won = opponent;
            state.message = `Checkmate! ${opponent.charAt(0).toUpperCase() + opponent.slice(1)} wins!`;
        } else {
            // Stalemate
            state.won = 'tie';
            state.message = "Stalemate!";
        }
    }
}

function checkGameOver(state) {
    checkWinCondition(state);
    
    if (state.won) {
        rogueState.gameActive = false;
        if (state.won === 'white') {
            // Player Won
            setTimeout(showRewardModal, 1000);
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
        } else {
             // Tie - maybe restart level?
             alert("Draw! Restarting level...");
             startLevel(rogueState.level);
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

    hotseatGame.move('white', { x, y });
    
    // Update Turn Display
    const turnDisplay = document.getElementById('turn');
    if(turnDisplay) {
        if(state.turn === 'white') {
            turnDisplay.innerText = "Your Turn";
            turnDisplay.style.color = 'var(--board-light)';
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

function triggerAI() {
    if (!w) w = new Worker("src/webworker.js");
    const state = hotseatGame.state;
    
    // Shuffle pieces slightly for randomness? (From hotseat.js)
    // state.pieces = state.pieces.sort((a, b) => 0.5 - Math.random());
    
    w.postMessage(JSONfn.stringify({
        state: state,
        color: 'black',
        AIPower: 103 // Fixed power or scaled? Prompt said "Level*2" for army value, maybe AI power stays constant or increases?
    }));

    w.onmessage = function(event) {
        let move = JSONfn.parse(event.data);
        AIMove(move.pieceCounter, move.xClicked, move.yClicked, 'black');
        
        // Update Turn Display
        const turnDisplay = document.getElementById('turn');
        if(turnDisplay) {
            if(hotseatGame.state.turn === 'white') {
                turnDisplay.innerText = "Your Turn";
                turnDisplay.style.color = 'var(--board-light)';
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
    document.body.style.background = backgroundColor; // from variables.js

    // Draw Board
    state.board.forEach((sq) => {
        let y = sq.y;
        let x = sq.x;
        let orderFirst = (y % 2 === 0); // Logic fix: y%2!=0 was orderFirst=false in hotseat.js
        
        // hotseat.js logic:
        // if(y%2 != 0){ orderFirst = false; }
        
        let isBlack = false;
        if(y % 2 !== 0) { // Odd row
             if(x % 2 === 0) isBlack = true;
        } else { // Even row
             if(x % 2 !== 0) isBlack = true;
        }
        
        // Simplified drawing
        if (!sq.light && !sq.special && !sq.red && !sq.grey) {
            if (isBlack) drawBlackSquare(x * squareLength, y * squareLength, squareLength);
            else drawWhiteSquare(x * squareLength, y * squareLength, squareLength);
            
            if(state.pieceSelected && x === state.pieceSelected.x && y === state.pieceSelected.y){
                drawColoredSquare(x*squareLength, y*squareLength, availableSquareColor, squareLength);
            }
        }
        else if (sq.light) drawLightedSquare(x * squareLength, y * squareLength, squareLength);
        else if(sq.red) drawColoredSquare(x*squareLength, y * squareLength, dangerSquareColor, squareLength);
        else if(sq.grey) drawColoredSquare(x*squareLength, y * squareLength, blockedSquareColor, squareLength);
        else if(sq.special){
                drawColoredSquare(x*squareLength, y * squareLength, specialSquareColor, squareLength)
            }
        })
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
        turnText.style.color = state.turn === 'white' ? "var(--board-light)" : "var(--board-dark)";
    }
}
