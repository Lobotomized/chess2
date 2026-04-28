
// RPG Game Logic

// List of available piece factories for random generation
const loseConditionFactories = [
    // Classic
    'simpleKingFactory',
];

const cyborgsFactories = [
     "juggernautFactory", 
     "executorFactory", 
     "bootvesselFactory",
     "cyborgFactory"
]

const pomotersFactories = [
    "shield","swordsMen","pikeman", "dragonFactory",
]

const medievalFactories = [
    'horseFactory', 'pigFactory',"clownFactory", "ghostFactory", "ricarFactory"
]

const insectFactories = [
    "rpgAntFactory", "spiderFactory", 'goliathbugFactory', "rpgQueenbugFactory", "strongladybugFactory", "brainbugFactory"
]

const classicPieceFactories = [
    'rpgPawnFactory', 'rookFactory', 'knightFactory', 'bishopFactory', 'queenFactory', 
]

// List of pieces available in the market
const marketPieceFactories = [
    'rpgPawnFactory', 'rookFactory', 'knightFactory', 'bishopFactory', 'queenFactory',
    'ghostFactory',  "swordsMen", "pikeman", 
    "juggernautFactory", "ricarFactory",
     "shield", "executorFactory",  "bootvesselFactory", "clownFactory"
];

const winnablePieceFactories = [
    'horseFactory','rpgQueenbugFactory',
    "rpgAntFactory", "spiderFactory", 'goliathbugFactory',"pigFactory", "strongladybugFactory","dragonFactory"
];

const availablePieceFactories = [
    ...classicPieceFactories,
    ...medievalFactories,
    ...insectFactories,
    ...cyborgsFactories,
    ...pomotersFactories,
]

const regionFactories = {
    'Classic': classicPieceFactories,
    'Medieval': medievalFactories,
    'Insect': insectFactories,
    'Cyborgs': cyborgsFactories,
    'Promoters': pomotersFactories
};

const frontLineFactories = ['rpgPawnFactory', 'swordsMen','ghostFactory', 'pikeman', 'rpgAntFactory', 'rpgQueenbugFactory'];

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

const KING_EXP_THRESHOLDS = [0, 10, 30, 60, 100, 150, 210, 280, 360, 450, 550, 660 ]; // levels 1 to 12

// Global State
const rpgState = {
    level: 1,
    maxKingLevel: 12,
    kingLevel: 1,
    kingExp: 0,
    playerRoster: [], // Array of factory names
    enemyRoster: [],
    gameActive: false,
    gold: 0,
    food: 100, // Initial food
    shopOptions: [],
    showWinScreen: false, // New flag to persist win screen
    boardHistory: [] // Track board states for attrition warfare
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
    const enemyFoodValue = document.getElementById('enemyFoodValue');
    
    // Fallback if spans are missing
    const goldDisplay = document.getElementById('goldDisplay');
    const foodDisplay = document.getElementById('foodDisplay');
    const enemyFoodDisplay = document.getElementById('enemyFoodDisplay');

    if (goldValue) {
        goldValue.innerText = rpgState.gold || 0;
    } else if (goldDisplay) {
        goldDisplay.innerText = `Gold: ${rpgState.gold || 0}`;
    }

    if (foodValue) {
        foodValue.innerText = rpgState.food || 0;
    } else if (foodDisplay) {
        foodDisplay.innerText = `${rpgState.food || 0}`;
    }

    if (enemyFoodDisplay) {
        if (rpgState.gameActive) {
            enemyFoodDisplay.style.display = 'block';
            if (enemyFoodValue) {
                enemyFoodValue.innerText = rpgState.currentFoodReward || 0;
            } else {
                enemyFoodDisplay.innerText = `${rpgState.currentFoodReward || 0}`;
            }
        } else {
            enemyFoodDisplay.style.display = 'none';
        }
    }
}

// Initialize Game
function initRpgGame() {
    // Fetch Hall of Fame bots to use against the player
    fetch('/bots')
        .then(res => res.json())
        .then(data => {
            rpgState.hofBots = data;
            console.log("Loaded Hall of Fame bots:", data.length);
        })
        .catch(err => console.error("Failed to load Hall of Fame bots:", err));

    // Bind cancel events to dialogs so Escape key behaves correctly
    const mapDialog = document.getElementById('mapDialog');
    if (mapDialog) {
        mapDialog.addEventListener('cancel', (e) => {
            e.preventDefault(); // Prevent closing the map
        });
    }

    const winDialog = document.getElementById('gameWonDialog');
    if (winDialog) {
        winDialog.addEventListener('cancel', (e) => {
            e.preventDefault();
            closeWinScreen(); // Close and route to map
        });
    }

    const shopDialog = document.getElementById('shopDialog');
    if (shopDialog) {
        shopDialog.addEventListener('cancel', (e) => {
            e.preventDefault();
            shopDialog.close();
            if (typeof showMapModal === 'function') showMapModal();
        });
    }

    hotseatGame = getSinglePlayerGame();
    hotseatGame.join('white', 'white');
    hotseatGame.join('black', 'black');
    hotseatGame.state.recordMoves = true;
    
    // Start Animation Loop
    // Use requestAnimationFrame for smooth animation
    requestAnimationFrame(aniLoop);
    
    // Handle custom maps via URL params
    const urlParams = new URLSearchParams(window.location.search);
    const customMapId = urlParams.get('customMapId');
    const isNew = urlParams.get('new') === 'true';
    const isLoad = urlParams.get('load') === 'true';
    let currentSaveSlot = urlParams.get('slot');
    window.currentSaveSource = urlParams.get('source');
    window.initialDifficulty = urlParams.get('difficulty');
    window.initialArmyType = urlParams.get('armyType');
    
    if (isNew) {
        currentSaveSlot = 'save_' + Date.now();
    }
    
    // Clean URL to prevent infinite new games on refresh, but keep slot
    const slotQuery = currentSaveSlot ? `?slot=${currentSaveSlot}` : '';
    window.history.replaceState({}, document.title, window.location.pathname + slotQuery);
    
    // Store current slot globally so saveProgress can access it
    window.currentSaveSlot = currentSaveSlot;

    if (isLoad) {
        loadGame();
    } else if (customMapId) {
        loadCustomGrandMap(customMapId);
    } else if (isNew) {
        startNewGame();
    } else {
        // Show Main Menu instead of auto-loading if accessed directly
        window.location.href = '/rpg-menu';
    }
}

async function loadCustomGrandMap(mapId) {
    try {
        const headers = window.Auth ? window.Auth.getAuthHeaders() : {};
        const response = await fetch(`/maps/${mapId}`, { headers });
        if (!response.ok) throw new Error("Failed to load map");
        
        const mapData = await response.json();
        
        if (mapData.isGrandMap && mapData.grandMapDef) {
            // Temporarily store the definition in grandMap system
            grandMap.predefinedMaps[mapData.name] = mapData.grandMapDef;
            grandMap.predefinedMaps[mapData.name].isCustom = true;
            
            // Start a new game with this map
            startNewGameWithMap(mapData.name);
        } else {
            showAlert("This is not a valid Grand Map template.");
            showMainMenu();
        }
    } catch (e) {
        console.error(e);
        showAlert("Failed to load custom map.");
        showMainMenu();
    }
}

function applyDifficultySettings() {
    let diff = window.initialDifficulty || rpgState.difficultyLevel || 'normal';
    let armyType = window.initialArmyType || rpgState.armyType || 'mixed';
    
    rpgState.difficultyLevel = diff;
    rpgState.armyType = armyType;
    rpgState.permadeath = false;
    
    if (diff === 'easy') {
        RPGStats.startingGold = 10;
        RPGStats.startingFood = 100;
    } else if (diff === 'normal') {
        RPGStats.startingGold = 0;
        RPGStats.startingFood = 100;
    } else if (diff === 'hard') {
        RPGStats.startingGold = 0;
        RPGStats.startingFood = 50;
    } else if (diff === 'impossible') {
        RPGStats.startingGold = 0;
        RPGStats.startingFood = 100;
        rpgState.permadeath = true;
    }
}

function startNewGameWithMap(mapName) {
    const modal = document.getElementById('mainMenuDialog');
    if(modal) modal.close();
    
    // Reset RPGStats to default
    if (typeof resetRPGStats === 'function') resetRPGStats();
    applyDifficultySettings();
    
    // Reset rpgState object
    rpgState.level = 1;
    rpgState.kingLevel = 1;
    rpgState.kingExp = 0;
    rpgState.playerRoster = [];
    rpgState.enemyRoster = [];
    rpgState.gameActive = false;
    rpgState.gameOverSequenceStarted = false;
    rpgState.activeSkill = null;
    rpgState.activeSkills = [];
    rpgState.pendingSkillSelections = 0;
    rpgState.gold = RPGStats.startingGold;
    rpgState.food = RPGStats.startingFood;
    rpgState.shopOptions = [];
    rpgState.showWinScreen = false;
    rpgState.boardHistory = [];
    
    // Set map info so it saves correctly
    rpgState.grandMap = { predefinedMap: mapName };
    
    updateGoldDisplay();
    document.getElementById('levelDisplay').innerText = "Level: 1";
    
    // Initialize Grand Map with the predefined map
    if (typeof grandMap !== 'undefined') {
        grandMap.init(rpgState.grandMap);
    }
    
    saveProgress();
    showStartModal();
}

function showMainMenu() {
    window.location.href = '/rpg-menu';
}

async function loadGame() {
    const modal = document.getElementById('mainMenuDialog');
    if(modal) modal.close();
    
    const saveKey = window.currentSaveSlot ? `rpgState_${window.currentSaveSlot}` : 'rpgState';
    const slotId = window.currentSaveSlot || 'default';
    let savedState = null;
    
    const token = typeof Auth !== 'undefined' ? Auth.getToken() : null;
    if (token && window.currentSaveSource !== 'local') {
        try {
            const res = await fetch(`/api/rpg-save/${slotId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.saveData) {
                    savedState = JSON.stringify(data.saveData);
                }
            }
        } catch (e) {
            console.error("Failed to load from DB, trying local storage:", e);
        }
    }
    
    if (!savedState && window.currentSaveSource !== 'db') {
        savedState = localStorage.getItem(saveKey);
    }
    
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            Object.assign(rpgState, parsed);
            
            // Reapply skill if it exists
            if (rpgState.activeSkills && Array.isArray(rpgState.activeSkills)) {
                // Backward compatibility fix for string arrays to object arrays
                rpgState.activeSkills = rpgState.activeSkills.map(skill => {
                    if (typeof skill === 'string') {
                        return { name: skill, level: 1 };
                    }
                    return skill;
                });
                applyAllRPGSkills();
            } else if (rpgState.activeSkill) {
                // backward compatibility
                rpgState.activeSkills = [{name: rpgState.activeSkill, level: 1}];
                applyAllRPGSkills();
            }
            
            // Initialize Grand Map
            if (typeof grandMap !== 'undefined') {
                grandMap.init(rpgState.grandMap);
            }

            // Ensure gold and food is loaded
            rpgState.gold = parsed.gold || 0;
            rpgState.food = (typeof parsed.food === 'number') ? parsed.food : 20;
            updateGoldDisplay();
            
            // Restore level
            document.getElementById('levelDisplay').innerText = `Level: ${rpgState.level}`;
            
            // Restore King leveling info
            rpgState.kingLevel = parsed.kingLevel || 1;
            rpgState.kingExp = Math.round(parsed.kingExp || 0);
            
            // Check if shop was active
            if (rpgState.shopOptions && rpgState.shopOptions.length > 0) {
                 // Shop was open or pending
                 // We should reopen the shop
                 showShopModal(true); // Pass true to indicate restoring
            } else if (parsed.showWinScreen && !parsed.gameActive) {
                 // Show win screen if it was active AND game is not active
                 const goldEarned = rpgState.currentRewardContent || 0 + RPGStats.additionalGoldPerWin; // Re-calc for display
                 const goldText = document.getElementById('goldEarnedText');
                 if(goldText) {
                     if (rpgState.currentRewardType === 'piece') {
                         const pieceName = rpgState.currentRewardContent ? window.pieceDescriptions[rpgState.currentRewardContent]?.name || 'Unit' : 'Unit';
                         goldText.innerText = `Won Unit: ${pieceName}`;
                         if (rpgState.currentFoodReward > 0) goldText.innerText += ` + ${rpgState.currentFoodReward} 🍖`;
                     } else {
                         goldText.innerText = `+${goldEarned} 🪙`;
                         if (rpgState.currentFoodReward > 0) goldText.innerText += ` + ${rpgState.currentFoodReward} 🍖`;
                     }
                 }
                 
                 const modal = document.getElementById('gameWonDialog');
                 if(modal) modal.showModal();
                 
                 // Also restore board in background
                 if (rpgState.savedBoard && rpgState.savedBoard.pieces && rpgState.savedBoard.pieces.length > 0) {
                    restoreBoard(rpgState.savedBoard);
                 }
            } else if (rpgState.savedBoard && rpgState.savedBoard.pieces && rpgState.savedBoard.pieces.length > 0 && parsed.gameActive) {
                restoreBoard(rpgState.savedBoard);
                // rpgState.gameActive is already true
            } else {
                // Not in battle, check for pending skill selections or show map
                if (rpgState.pendingSkillSelections && rpgState.pendingSkillSelections > 0) {
                    showSkillSelectionModal();
                } else if (typeof showMapModal === 'function') {
                    showMapModal();
                } else {
                    const mapDialog = document.getElementById('mapDialog');
                    if (mapDialog) mapDialog.showModal();
                }
                
                // Clear any stray win screen flags
                rpgState.showWinScreen = false;
                
                // Set gameActive to false since we're just on the map
                rpgState.gameActive = false;
            }

            // rpgState.gameActive = true; // Moved inside conditions
            
        } catch (e) {
            console.error("Failed to load save:", e);
            showNotification("Save file corrupted. Starting new game.", "error");
            startNewGame();
        }
    }
}

function confirmNewGame() {
    // Check dropdown map selection
    const mapSelect = document.getElementById('rpgMapSelect');
    const selectedMapId = mapSelect ? mapSelect.value : 'random';
    
    // Redirect to menu instead, menu handles new game
    window.location.href = '/rpg-menu';
}

function startNewGame() {
    const modal = document.getElementById('mainMenuDialog');
    if(modal) modal.close();
    
    // Reset RPGStats to default
    if (typeof resetRPGStats === 'function') resetRPGStats();
    applyDifficultySettings();
    
    // Reset rpgState object
    rpgState.level = 1;
    rpgState.kingLevel = 1;
    rpgState.kingExp = 0;
    rpgState.playerRoster = [];
    rpgState.enemyRoster = [];
    rpgState.gameActive = false;
    rpgState.gameOverSequenceStarted = false; // Reset
    rpgState.activeSkill = null; // Clear skill backward compatibility
    rpgState.activeSkills = [];
    rpgState.pendingSkillSelections = 0;
    rpgState.gold = RPGStats.startingGold;
    rpgState.food = RPGStats.startingFood;
    rpgState.shopOptions = [];
    rpgState.showWinScreen = false;
    rpgState.grandMap = undefined; // Reset grand map state
    rpgState.boardHistory = [];
    
    updateGoldDisplay();
    document.getElementById('levelDisplay').innerText = "Level: 1";
    
    // Initialize Grand Map
    if (typeof grandMap !== 'undefined') {
        grandMap.init();
    }
    
    saveProgress();
    showStartModal();
}

async function saveProgress() {
    // Ensure rpgState.gold and food is a number
    if (typeof rpgState.gold !== 'number') rpgState.gold = 0;
    if (typeof rpgState.food !== 'number') rpgState.food = 20;
    
    if(hotseatGame && hotseatGame.state) {
        rpgState.savedBoard = {
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
            message: hotseatGame.state.message,
            moveHistory: hotseatGame.state.moveHistory,
            initialPieces: hotseatGame.state.initialPieces,
            initialBoard: hotseatGame.state.initialBoard
        };
    } else if (!rpgState.gameActive) {
        // If game is not active, ensure we don't save a broken board state
        rpgState.savedBoard = null;
    }
    
    // Explicitly include gold and food in the object being saved
    
    // Save Grand Map State
    if (typeof grandMap !== 'undefined') {
        rpgState.grandMap = grandMap.getState();
    }

    const saveKey = window.currentSaveSlot ? `rpgState_${window.currentSaveSlot}` : 'rpgState';
    const slotId = window.currentSaveSlot || 'default';
    
    // Check if logged in
    const token = typeof Auth !== 'undefined' ? Auth.getToken() : null;
    if (token) {
        try {
            await fetch('/api/rpg-save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ slotId, saveData: rpgState })
            });
        } catch (e) {
            console.error("Failed to save to DB, falling back to local storage:", e);
            localStorage.setItem(saveKey, JSON.stringify(rpgState));
            updateLocalSavesList();
        }
    } else {
        localStorage.setItem(saveKey, JSON.stringify(rpgState));
        updateLocalSavesList();
    }
}

function updateLocalSavesList() {
    if (window.currentSaveSlot) {
        let savesList = JSON.parse(localStorage.getItem('rpgSavesList') || '[]');
        if (!savesList.includes(window.currentSaveSlot)) {
            savesList.push(window.currentSaveSlot);
            localStorage.setItem('rpgSavesList', JSON.stringify(savesList));
        }
    }
}

function restoreBoard(savedBoard) {
    hotseatGame.state.pieces = [];
    hotseatGame.state.board = [];
    
    // Create Board Grid based on saved shape
    const shapeName = rpgState.boardShape || 'Standard';
    
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
                 // If it's a promoted piece (e.g. Queen from Pawn), factory might be 'rpgPawnFactory' if we guessed wrong?
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
    hotseatGame.state.moveHistory = savedBoard.moveHistory || undefined;
    hotseatGame.state.initialPieces = savedBoard.initialPieces || undefined;
    hotseatGame.state.initialBoard = savedBoard.initialBoard || undefined;
    
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
    
    updateGoldDisplay();
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

async function clearProgress() {
    const saveKey = window.currentSaveSlot ? `rpgState_${window.currentSaveSlot}` : 'rpgState';
    const slotId = window.currentSaveSlot || 'default';
    
    const token = typeof Auth !== 'undefined' ? Auth.getToken() : null;
    if (token) {
        try {
            await fetch(`/api/rpg-save/${slotId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) {
            console.error("Failed to delete from DB:", e);
        }
    }
    
    localStorage.removeItem(saveKey);
    
    if (window.currentSaveSlot) {
        let savesList = JSON.parse(localStorage.getItem('rpgSavesList') || '[]');
        savesList = savesList.filter(s => s !== window.currentSaveSlot);
        localStorage.setItem('rpgSavesList', JSON.stringify(savesList));
    }
}

// Animation Loop
function aniLoop() {
    ani();
    requestAnimationFrame(aniLoop);
}

function ani() {
    if (!hotseatGame || (typeof rpgState !== 'undefined' && !rpgState.gameActive && !rpgState.gameOverSequenceStarted)) {
        // Clear canvas if we are skipping animation to prevent ghost images
        const canvas = document.getElementById('canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        return;
    }
    // Use direct state reference to persist animation properties
    animate(hotseatGame.state);
}

// --- Army Generation ---

function generateRandomArmy(targetValue, includeKing = false, region = 'Classic', forceEqualFrontBack = false, allowOneNonClassicType = false) {
    const army = [];
    let currentValue = 0;
    
    // Determine factories for this region
    let regionList = availablePieceFactories;
    if (region && regionFactories[region]) {
        regionList = [...regionFactories[region]];
    }
    else if (!region){
        let allFactories = Object.values(regionFactories).flat();
        regionList = allFactories;
    }


    if (allowOneNonClassicType) {
        const nonClassic = availablePieceFactories.filter(f => !regionList.includes(f) && !loseConditionFactories.includes(f));
        if (nonClassic.length > 0) {
            const randomNonClassic = nonClassic[Math.floor(Math.random() * nonClassic.length)];
            regionList.push(randomNonClassic);
        }
    }

    if (includeKing) {
        // Prefer simpleKingFactory, fallback to kingFactory
        const kingName = typeof window['simpleKingFactory'] === 'function' ? 'simpleKingFactory' : 'kingFactory';
        army.push(kingName);
        // King value is high (1000) for AI logic, but for army generation cost it should be 0 or small.
        // We'll treat it as 0 cost since both sides get one.
        currentValue += 0;
    }

    // Determine Frontline for this region
    let regionFrontline = frontLineFactories.filter(f => regionList.includes(f));
    
    // Fallback if no frontline found (e.g. Cyborgs)
    if (regionFrontline.length === 0) {
        regionFrontline = ['rpgPawnFactory']; 
    }

    // Create a list of available factories that are strictly backline pieces
    const backlineFactories = regionList.filter(f => !frontLineFactories.includes(f));

    if (forceEqualFrontBack) {
        let frontCount = 0;
        let backCount = includeKing ? 1 : 0;
        let iterations = 0;
        
        // Add frontline to match king if needed
        while (frontCount < backCount && frontCount < 8) {
            const randomFrontline = regionFrontline[Math.floor(Math.random() * regionFrontline.length)];
            army.push(randomFrontline);
            currentValue += getPieceValue(randomFrontline);
            frontCount++;
        }

        while (currentValue < targetValue && iterations < 100) {
            iterations++;
            if (frontCount >= 8 || backCount >= 8) break;

            const randomFrontline = regionFrontline[Math.floor(Math.random() * regionFrontline.length)];
            const frontVal = getPieceValue(randomFrontline);
            
            if (backlineFactories.length === 0) break;
            const randomBackline = backlineFactories[Math.floor(Math.random() * backlineFactories.length)];
            const backVal = getPieceValue(randomBackline);
            
            // Allow adding pairs until combined value hits target
            // E.g., if target is 9, we stop when currentValue + frontVal + backVal exceeds 9
            if (currentValue + frontVal + backVal <= targetValue) {
                army.push(randomFrontline);
                army.push(randomBackline);
                currentValue += frontVal + backVal;
                frontCount++;
                backCount++;
            } else if (iterations > 50) {
                break; // Stop if we can't afford a pair after many tries
            }
        }
    } else {
        let iterations = 0;
        let backlineCount = includeKing ? 1 : 0;
        let frontlineCount = 0;
        
        while (currentValue < targetValue && iterations < 200) {
            iterations++;
            
            if (frontlineCount >= 8 && backlineCount >= 8) {
                break; // Maximum army size reached (16 pieces)
            }
            
            let tryFrontline = false;
            if (frontlineCount < 8 && backlineCount < 8) {
                tryFrontline = Math.random() > 0.5 || backlineFactories.length === 0;
            } else if (frontlineCount < 8) {
                tryFrontline = true;
            } else {
                tryFrontline = false;
            }
            
            if (tryFrontline) {
                const randomFrontline = regionFrontline[Math.floor(Math.random() * regionFrontline.length)];
                const val = getPieceValue(randomFrontline);
                if (currentValue + val <= targetValue + 1 || iterations > 100) {
                    army.push(randomFrontline);
                    currentValue += val;
                    frontlineCount++;
                }
            } else {
                const randomFactory = backlineFactories[Math.floor(Math.random() * backlineFactories.length)];
                const val = getPieceValue(randomFactory);
                if (currentValue + val <= targetValue + 1 || iterations > 100) {
                    army.push(randomFactory);
                    currentValue += val;
                    backlineCount++;
                }
            }
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
    
    // Extract factory names if army contains custom objects
    const factoryNames = army.map(item => typeof item === 'object' && item !== null ? item.factory : item).filter(Boolean);
    
    // We'll define a recursive function to show them in sequence
    const uniqueFactories = [...new Set(factoryNames)];
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
    if (rpgState.enemyRoster && rpgState.enemyRoster.length > 0) {
        showArmyInfo(rpgState.enemyRoster);
    }
}

function showMyArmyInfo() {
    if (rpgState.playerRoster && rpgState.playerRoster.length > 0) {
        showArmyInfo(rpgState.playerRoster.filter(p => p !== null));
    }
}

function showPieceDiscoveryModal(factoryName) {
    if (typeof window[factoryName] !== 'function') return;

    // Create a mini-board state for buildPieceModal
    // buildPieceModal expects: state, pieceArray
    // pieceArray: [{ type:'piece', board:..., icon:..., pieceX:..., pieceY:..., description:... }]
    
    // We need to construct a dummy piece to get its properties
    const dummyPiece = window[factoryName]('white', 3, 3); // Place in center of 7x7 mini board
    const icon = dummyPiece.icon.replace('white', 'black'); // Show black version usually? or white? prompt says "rpg that you see for the first time in the Options menu". Maybe just show the icon.
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
    let frontCount = 0;
    let backCount = 0;
    rpgState.playerRoster.forEach(u => {
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

            // Handle Inn
            if (node.board === 'Inn') {
                options.push({
                    type: "Rest at Inn",
                    direction: move.direction,
                    node: node,
                    description: "Rest and recover food.",
                    rewardCap: 0,
                    enemyValue: node.enemyPower,
                    difficultyIndex: -1,
                    boardShape: 'Inn',
                    army: [],
                    rewardType: 'none'
                });
                return;
            }
            
            // Ensure army is pre-generated for accurate power display
            if (node.board !== 'Mountain' && node.board !== 'Library' && node.board !== 'Inn') {
                ensureNodeArmy(node);
            }

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
                army: node.army, // Pass army to option
                region: node.region // Pass region for army generation
            };
            
            if (node.board === 'Woods') option.description += " (Woods Map)";
            if (node.board === 'Fountain') option.description += " (Fountain Map)";

            options.push(option);
        });
    } else {
        // Fallback: Select 3 random difficulties based on level
        let baseIndex = rpgState.level;
        
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
        const rosterFull = rpgState.playerRoster.length >= RPGStats.maxNumberOfPiecesToOwn; // 8 Front + 8 Back + 8 Reserve
        options.forEach(opt => {
            
            // Priority: Use Node Rewards if available (Consistency with Grand Map)
            if (opt.node && opt.node.rewards) {
                 const r = opt.node.rewards;
                 const hasPiece = r.pieces && r.pieces.length > 0;
                 
                 if (hasPiece && !rosterFull) {
                      opt.rewardType = 'piece';
                      
                      if (r.specificPiece) {
                          opt.rewardContent = r.specificPiece;
                      } else {
                          // Generate and Save specific piece to node so it stays consistent
                          const maxPieceValue = opt.enemyValue / 2;
                          const sourceList = (typeof winnablePieceFactories !== 'undefined' && winnablePieceFactories.length > 0) 
                                           ? winnablePieceFactories 
                                           : availablePieceFactories;
                                           
                          const eligiblePieces = sourceList.filter(f => {
                                return getPieceValue(f) <= maxPieceValue && getPieceValue(f) >= maxPieceValue - 3;
                          });
                          
                          if (eligiblePieces.length > 0) {
                               const randomPiece = eligiblePieces[Math.floor(Math.random() * eligiblePieces.length)];
                               opt.rewardContent = randomPiece;
                               r.specificPiece = randomPiece; // Save to node
                          } else {
                               // Fallback if no eligible piece
                               opt.rewardType = 'gold';
                               opt.rewardContent = r.gold;
                          }
                      }
                      
                      if (opt.rewardType === 'piece') {
                           opt.enemyFood = opt.node.enemyFood;
                           opt.rewardValue = getPieceValue(opt.rewardContent);
                      } else {
                           opt.enemyFood = opt.node.enemyFood;
                      }
                      
                 } else {
                      // Gold Reward
                      opt.rewardType = 'gold';
                      opt.rewardContent = r.gold;
                      opt.enemyFood = opt.node.enemyFood;
                 }
                 return; // Done with this option
            }

            // 30% chance for a piece reward
            if (Math.random() < 0.3 && !rosterFull) {
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
                    const minFood = Math.max(15, Math.floor(diff * 5)) * 2;
                    opt.enemyFood = minFood + Math.floor(Math.random() * minFood);
                    
                } else {
                    opt.rewardType = 'gold';
                    const budget = opt.rewardCap;
                    opt.rewardContent = budget; // Gold is full budget
                    const minFood = (Math.max(15, Math.floor(budget * 0.8) + 5)) * 2;
                    opt.enemyFood = minFood + Math.floor(Math.random() * minFood);
                }
            } else {
                opt.rewardType = 'gold';
                const budget = opt.rewardCap;
                opt.rewardContent = budget;
                const minFood = (Math.max(15, Math.floor(budget * 0.8) + 5)) * 2;
                opt.enemyFood = minFood + Math.floor(Math.random() * minFood);
            }
        });
        
    } else {
        // Fallback
        const defaultCap = Math.round(2.5 + rpgState.level * 0.5);
        const goldAmount = defaultCap;
        const minFood = (Math.max(15, Math.floor(goldAmount * 0.8) + 5)) * 2;
        
        options.push({
            type: 'Standard Battle', 
            enemyValue: Math.round(1.5 + rpgState.level * 0.5),
            rewardType: 'gold',
            rewardContent: goldAmount,
            enemyFood: minFood + Math.floor(Math.random() * minFood),
            rewardCap: defaultCap
        });
    }
    
    // We don't generate reward armies anymore, just missions.
    return options;
}

// --- Level Management ---

function ensureNodeArmy(node) {
    if (!node.army && node.board !== 'Mountain' && node.board !== 'Library' && node.board !== 'Market' && node.board !== 'Inn') {
        const { army, value } = generateRandomArmy(node.enemyPower, true, node.region);
        node.army = army;
        node.actualEnemyValue = value;
    }
}

function startLevel(level, difficultyOption) {
    const overlay = document.getElementById('deathOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
    }
    rpgState.level = level;
    rpgState.mapSeed = (difficultyOption && difficultyOption.node && difficultyOption.node.mapSeed !== undefined) ? difficultyOption.node.mapSeed : Math.random() * 10000;
    rpgState.shopOptions = []; // Clear shop options to prevent reopening shop on refresh
    rpgState.showWinScreen = false; // Ensure win screen is cleared
    rpgState.gameOverSequenceStarted = false; // Reset flag for new level
    rpgState.boardHistory = []; // Reset board history
    rpgState.divinationUsed = false; // Reset divination skill usage per battle
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
    let region = 'Classic';

    if (difficultyOption && typeof difficultyOption === 'object') {
        difficultyName = difficultyOption.type || 'Custom';
        enemyValue = difficultyOption.enemyValue || Math.round(1.5 + level * 0.5);
        rewardCap = difficultyOption.rewardCap || Math.round(2.5 + level * 0.5);
        boardShape = difficultyOption.boardShape || 'Standard';
        region = difficultyOption.region || 'Classic';
        
        // Pass through reward type/content
        rpgState.currentRewardType = difficultyOption.rewardType || 'gold';
        rpgState.currentRewardContent = difficultyOption.rewardContent || rewardCap;
        const fallbackMinFood = (Math.max(15, Math.floor((difficultyOption.rewardContent || rewardCap) * 0.8) + 5)) * 2;
        rpgState.currentFoodReward = difficultyOption.enemyFood || (fallbackMinFood + Math.floor(Math.random() * fallbackMinFood));

        // Grand Map Movement
        if (difficultyOption.node && typeof grandMap !== 'undefined') {
            grandMap.moveTo(difficultyOption.node.x, difficultyOption.node.y);
        }
        
    } else if (typeof difficultyOption === 'string') {
        difficultyName = difficultyOption;
        
        // Try to find the difficulty in the list
        const found = window.difficulties ? window.difficulties.find(d => d.name === difficultyOption) : null;
        console.log(found)
        if (found) {
            enemyValue = found.enemyValue;
            rewardCap = found.rewardCap;
            boardShape = found.boardShape || 'Standard';
        } else {
            enemyValue = Math.round(1.5 + level * 0.5);
            rewardCap = Math.round(2.5 + level * 0.5);
        }
        
        rpgState.currentRewardType = 'gold';
        rpgState.currentRewardContent = rewardCap;
        // Fallback food for string call
        const stringFallbackMinFood = (Math.max(15, Math.floor(rewardCap * 0.8) + 5)) * 2;
        rpgState.currentFoodReward = stringFallbackMinFood + Math.floor(Math.random() * stringFallbackMinFood);
        
    } else {
        // Fallback or Initial Start
        if (window.difficulties && window.difficulties[0]) {
            difficultyName = window.difficulties[0].name;
            enemyValue = window.difficulties[0].enemyValue;
            rewardCap = window.difficulties[0].rewardCap;
            boardShape = window.difficulties[0].boardShape || 'Standard';
        } else {
             rewardCap = Math.round(2.5 + level * 0.5);
        }
        
        rpgState.currentRewardType = 'gold';
        rpgState.currentRewardContent = rewardCap;
        const initialFallbackMinFood = (Math.max(15, Math.floor(rewardCap * 0.8) + 5)) * 2;
        rpgState.currentFoodReward = initialFallbackMinFood + Math.floor(Math.random() * initialFallbackMinFood);
    }

    rpgState.currentReward = rewardCap; // Keep for legacy or display?


    document.getElementById('levelDisplay').innerText = `Level: ${level}`;
    if (boardShape !== 'Standard') {
        document.getElementById('levelDisplay').innerText += ` [${boardShape}]`;
    }
    
    let enemyArmy;
    if (difficultyOption && difficultyOption.node && difficultyOption.node.customArmy) {
        // Use custom placed army
        enemyArmy = difficultyOption.node.customArmy;
    } else if (difficultyOption && difficultyOption.army) {
        // Use pre-generated army
        enemyArmy = difficultyOption.army;
        // If it was a node, update the node's cleared status later? No, that's done in win condition.
    } else if (difficultyOption && difficultyOption.node && difficultyOption.node.army) {
         enemyArmy = difficultyOption.node.army;
    } else {
        // Fallback generation
        const result = generateRandomArmy(enemyValue, true, region);
        enemyArmy = result.army;
    }
    
    rpgState.enemyRoster = enemyArmy;
    rpgState.boardShape = boardShape;
    rpgState.enemyRegion = region;

    if (boardShape === 'Fountain') {
        if (difficultyOption && difficultyOption.node && typeof difficultyOption.node.fountainX !== 'undefined') {
            rpgState.fountainX = difficultyOption.node.fountainX;
            rpgState.fountainY = difficultyOption.node.fountainY;
        } else if (difficultyOption && typeof difficultyOption.fountainX !== 'undefined') {
            rpgState.fountainX = difficultyOption.fountainX;
            rpgState.fountainY = difficultyOption.fountainY;
        } else {
             // Fallback for non-map or legacy
             rpgState.fountainX = Math.floor(Math.random() * 7);
             rpgState.fountainY = Math.floor(Math.random() * 7);
        }
    }
    
    if (boardShape === 'Woods') {
        if (difficultyOption && difficultyOption.node && difficultyOption.node.customTrees) {
            rpgState.customTrees = difficultyOption.node.customTrees;
        } else if (difficultyOption && difficultyOption.customTrees) {
            rpgState.customTrees = difficultyOption.customTrees;
        } else {
            rpgState.customTrees = null;
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
    
    rpgState.gameActive = true;
    updateGoldDisplay();

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
        let bushes = [];
        if (rpgState.customTrees) {
            bushes = rpgState.customTrees;
        } else {
            // Use mapSeed to determine pattern
            const seed = rpgState.mapSeed || Math.random();
            
            // Define candidate squares for bushes (rows 2, 3, 4, 5)
            const candidateSquares = [];
            for (let x = 0; x <= 7; x++) {
                for (let y = 2; y <= 5; y++) {
                    candidateSquares.push({ x, y });
                }
            }

            // Deterministic shuffle using seed
            let currentSeed = seed;
            const seededRandom = () => {
                const x = Math.sin(currentSeed++) * 10000;
                return x - Math.floor(x);
            };

            // Fisher-Yates shuffle
            for (let i = candidateSquares.length - 1; i > 0; i--) {
                const j = Math.floor(seededRandom() * (i + 1));
                [candidateSquares[i], candidateSquares[j]] = [candidateSquares[j], candidateSquares[i]];
            }

            // Pick first 6 as bushes
            bushes = candidateSquares.slice(0, 6);
        }
        
        for (let x = 0; x <= 7; x++) {
            for (let y = 0; y <= 7; y++) {
                // Check if this square is a bush
                const isBush = bushes.some(b => b.x === x && b.y === y);
                if (!isBush) {
                    board.push({ light: false, x: x, y: y });
                }
            }
        }
    },
    'Fountain': (board) => {
        const fx = (rpgState.fountainX !== undefined) ? rpgState.fountainX : 3;
        const fy = (rpgState.fountainY !== undefined) ? rpgState.fountainY : 3;
        
        for (let x = 0; x <= 7; x++) {
            for (let y = 0; y <= 7; y++) {
                // 4 squares are missing
                if ((x === fx || x === fx + 1) && (y === fy || y === fy + 1)) {
                    continue;
                }
                board.push({ light: false, x: x, y: y });
            }
        }
    },
    'Desert': (board) => {
        for (let x = 0; x <= 8; x++) {
            for (let y = 0; y <= 7; y++) {
                board.push({ light: false, x: x, y: y });
            }
        }
    }
};

function setupBoard(shapeName = 'Standard') {
    hotseatGame.state.pieces = [];
    hotseatGame.state.board = [];
    hotseatGame.state.moveHistory = undefined;
    hotseatGame.state.initialPieces = undefined;
    hotseatGame.state.initialBoard = undefined;
    
    // Create Board Grid based on shape
    if (boardShapes[shapeName]) {
        boardShapes[shapeName](hotseatGame.state.board);
    } else {
        boardShapes['Standard'](hotseatGame.state.board);
    }

    // Determine board dimensions
    let maxX = 7;
    let maxY = 7;
    if (hotseatGame.state.board.length > 0) {
        hotseatGame.state.board.forEach(sq => {
            if (sq.x > maxX) maxX = sq.x;
            if (sq.y > maxY) maxY = sq.y;
        });
    }
    
    // Helper to split army
    // "Infront" means closer to the enemy.
    
    const splitArmy = (roster, isPlayer = false) => {
        // If the roster has nulls (from reordering), preserve them in their respective lines
        // For simplicity in standard logic, we usually don't have nulls until after reorder
        // But if we do, we need to handle them.
        
        // However, if the roster is perfectly 16 long (8 front, 8 back), we can just split it by index
        if (isPlayer && (roster.length >= 16 || roster.includes(null))) {
            return {
                front: roster.slice(0, 8),
                back: roster.slice(8, 16)
            };
        }
        
        const front = roster.filter(u => u && frontLineFactories.includes(u));
        const back = roster.filter(u => u && !frontLineFactories.includes(u));
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
    // Front Line: Row maxY - 1 (Pawns)
    // Back Line: Row maxY (Rest)
    const playerSplit = splitArmy(rpgState.playerRoster, true);
    placeArmy(playerSplit.front, 'white', [maxY - 1], maxX); 
    placeArmy(playerSplit.back, 'white', [maxY], maxX); 
    
    // Place Enemy Army (Black)
    if (rpgState.enemyRoster && rpgState.enemyRoster.length > 0 && typeof rpgState.enemyRoster[0] === 'object') {
        // Custom Manual Placement
        for (const pData of rpgState.enemyRoster) {
            if (pData.factory && typeof window[pData.factory] === 'function') {
                const isValidSquare = hotseatGame.state.board.some(sq => sq.x === pData.x && sq.y === pData.y);
                if (isValidSquare) {
                    const piece = window[pData.factory]('black', pData.x, pData.y);
                    hotseatGame.state.pieces.push(piece);
                }
            }
        }
    } else {
        // Standard random generation split
        // Front Line: Row 1 (Pawns)
        // Back Line: Row 0 (Rest)
        const enemySplit = splitArmy(rpgState.enemyRoster, false);
        placeArmy(enemySplit.front, 'black', [1], maxX);
        
        // Randomize backline (King and elite units)
        // Ensure King is not lost if roster exceeds available squares
        const availableSlots = maxX + 1;
        let backline = enemySplit.back;

        // Separate King
        const kings = backline.filter(u => u && u.toLowerCase().includes('king'));
        const others = backline.filter(u => u && !u.toLowerCase().includes('king'));

        // If total exceeds slots, prioritize Kings and trim others
        if (kings.length + others.length > availableSlots) {
            // Keep all kings, trim others
            const allowedOthersCount = Math.max(0, availableSlots - kings.length);
            // Randomly select which others to keep
            for (let i = others.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [others[i], others[j]] = [others[j], others[i]];
            }
            others.splice(allowedOthersCount);
        }

        // Combine
        backline = [...kings, ...others];

        // Shuffle
        for (let i = backline.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [backline[i], backline[j]] = [backline[j], backline[i]];
        }
        
        placeArmy(backline, 'black', [0], maxX);
    }

    // --- Summoner Skill Logic ---
    if (RPGStats.summonerLevel > 0) {
        const emptySquares = [];
        const playerRows = [maxY - 1, maxY];
        
        hotseatGame.state.board.forEach(sq => {
            if (playerRows.includes(sq.y)) {
                const isOccupied = hotseatGame.state.pieces.some(p => p.x === sq.x && p.y === sq.y);
                if (!isOccupied) {
                    emptySquares.push(sq);
                }
            }
        });

        if (emptySquares.length > 0) {
            const randomSq = emptySquares[Math.floor(Math.random() * emptySquares.length)];
            
            let factoryName = 'starManWeakFactory';
            if (RPGStats.summonerLevel === 2) {
                factoryName = 'starManMidFactory';
            } else if (RPGStats.summonerLevel >= 3) {
                factoryName = 'starManExpertFactory';
            }

            if (typeof window[factoryName] === 'function') {
                const summonedPiece = window[factoryName]('white', randomSq.x, randomSq.y);
                hotseatGame.state.pieces.push(summonedPiece);
            }
        }
    }
}

function placeArmy(roster, color, rows, maxX = 7) {
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
        if (x > maxX) {
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

    for (const factoryName of roster) {
        // Find next valid square
        // Safety break to prevent infinite loop if board is weirdly empty
        let attempts = 0;
        while (!isValidSquare(x, y) && attempts < 100) {
            if (!advance()) return; // No more rows
            attempts++;
        }
        
        if (attempts >= 100) return; // Should not happen

        if (factoryName && typeof window[factoryName] === 'function') {
            const piece = window[factoryName](color, x, y);
            piece.factory = factoryName; // Tag piece with its factory for permadeath tracking
            
            hotseatGame.state.pieces.push(piece);
        }
        
        // Advance position for next unit even if it was an empty slot (null)
        if (!advance()) return;
    }
}

// --- UI / Modals ---

function showStartModal() {
    const modal = document.getElementById('startDialog');
    const container = document.getElementById('startOptions');
    container.innerHTML = '';
    
 
    for (let i = 0; i < 4; i++) {
        // Increase initial targetValue slightly so it can actually afford 8 frontline pieces + some backline, 
        // or just let it be 20 and it'll mostly just be frontline pieces.
        // 50% chance to allow a non-classic piece type in the army generation
        const allowNonClassic = Math.random() > 0.5;
        
        let army;
        if (rpgState.armyType === 'classic') {
            army = generateRandomArmy(9, true, 'Classic', true, allowNonClassic).army;
        } else {
            army = generateRandomArmy(9, true, null, true, allowNonClassic).army;
        }
        
        // Pick a random skill for this army
        const randomSkill = RPGSKILLS[Math.floor(Math.random() * RPGSKILLS.length)];

        // Removed markPieceAsSeen(name) call to stop auto-popup

        const div = document.createElement('div');
        div.className = 'army-option';
        // div.innerHTML = `<h3>Option ${i+1}</h3><p>Value: ${value.toFixed(1)}</p>`;
        
        const skillDiv = document.createElement('div');
        skillDiv.style.marginBottom = '10px';
        skillDiv.style.padding = '5px';
        skillDiv.style.background = 'rgba(255, 255, 255, 0.1)';
        skillDiv.style.borderRadius = '5px';
        const desc = randomSkill.getDescription ? randomSkill.getDescription(1) : randomSkill.description;
        skillDiv.innerHTML = `<strong>King's Skill: ${randomSkill.name}</strong><br><span style="font-size: 0.9em;">${desc}</span>`;
        div.appendChild(skillDiv);

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
            rpgState.playerRoster = army;
            rpgState.activeSkills = [{name: randomSkill.name, level: 1}]; // Save the skill
            applyAllRPGSkills(); // Apply the skill effect
            // We need to ensure gold and food are updated if the skill changed starting values
            rpgState.gold = RPGStats.startingGold;
            rpgState.food = RPGStats.startingFood;
            
            // Handle instant rewards that should only apply once when selected
            if (randomSkill.name === "Rich") {
                rpgState.gold += 10;
            } else if (randomSkill.name === "Inheritance") {
                rpgState.food += 30;
            }

            updateGoldDisplay();
            
            modal.close();
            showReorderModal(army, () => {
                // Start level 1 with the easiest difficulty
                const difficulty = window.difficulties ? window.difficulties[0] : { enemyValue: 3 };
                startLevel(1, difficulty);
            });
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

function toggleHeroSkills() {
    const list = document.getElementById('heroSkillList');
    if (list) {
        list.style.display = list.style.display === 'none' ? 'block' : 'none';
    }
}

function showReorderModal(army, onConfirm, forceConfirmText = false) {
    const modal = document.getElementById('reorderDialog');
    const frontContainer = document.getElementById('reorderFrontline');
    const backContainer = document.getElementById('reorderBackline');
    const reserveContainer = document.getElementById('reorderReserve');
    const confirmBtn = document.getElementById('confirmReorderBtn');
    const deleteBtn = document.getElementById('deleteReserveBtn');

    // Update Hero UI
    const heroIcon = document.getElementById('heroIcon');
    const heroLevelBadge = document.getElementById('heroLevelBadge');
    const heroSkillList = document.getElementById('heroSkillList');
    
    if (heroIcon && heroLevelBadge && heroSkillList) {
        let kingFactoryName = army.find(u => u && u.toLowerCase().includes('king'));
        if (kingFactoryName && typeof window[kingFactoryName] === 'function') {
            const kingPiece = window[kingFactoryName]('white', 0, 0);
            heroIcon.src = `/static/${kingPiece.icon}`;
        } else {
            heroIcon.src = '/static/whiteKing.png';
        }
        
        heroLevelBadge.innerText = rpgState.kingLevel || 1;
        
        if (rpgState.activeSkills && rpgState.activeSkills.length > 0) {
            heroSkillList.innerHTML = '<strong>Active Skills:</strong><ul style="margin: 5px 0 0 15px; padding: 0;">' + 
                rpgState.activeSkills.map(s => {
                    const sName = typeof s === 'string' ? s : s.name;
                    const sLevel = typeof s === 'string' ? 1 : s.level;
                    const skillDef = RPGSKILLS.find(r => r.name === sName);
                    const desc = skillDef && skillDef.getDescription ? skillDef.getDescription(sLevel) : (skillDef ? skillDef.description : '');
                    return `<li><b>${sName} (Lvl ${sLevel})</b>: ${desc}</li>`;
                }).join('') + '</ul>';
        } else {
            heroSkillList.innerHTML = '<em>No active skills.</em>';
        }
        heroSkillList.style.display = 'none'; // hide by default
    }

    if(confirmBtn) {
        if (forceConfirmText) {
            confirmBtn.innerText = "Confirm Army";
        } else {
            confirmBtn.innerText = onConfirm ? "Begin Journey" : "Confirm Army";
        }
    }
    
    frontContainer.innerHTML = '';
    backContainer.innerHTML = '';
    if(reserveContainer) reserveContainer.innerHTML = '';
    
    let frontPieces, backPieces, reservePieces;
    
    // Check if army looks like a formatted roster (length >= 16 or contains nulls)
    const isFormatted = army.length >= 16 || army.includes(null);
    
    if (isFormatted) {
        frontPieces = army.slice(0, 8);
        backPieces = army.slice(8, 16);
        reservePieces = army.slice(16);
    } else {
        // Legacy or fresh generation fallback
        frontPieces = army.filter(u => u && frontLineFactories.includes(u));
        backPieces = army.filter(u => u && !frontLineFactories.includes(u));
        reservePieces = [];
    }

    // Pad with nulls up to 8 for front and back
    // Pad with nulls up to 8 for front and back
    while(frontPieces.length < 8) frontPieces.push(null);
    while(backPieces.length < 8) backPieces.push(null);

    let maxFrontline = 0;
    army.forEach(u => {
        if (u && frontLineFactories.includes(u)) {
            maxFrontline++;
        }
    });

    let activeFrontline = 0;
    let kingIndexTarget = 0;

    function recalculateLayout() {
        activeFrontline = 0;
        frontPieces.forEach(u => {
            if (u && frontLineFactories.includes(u)) {
                activeFrontline++;
            }
        });

        kingIndexTarget = Math.max(0, activeFrontline - 1);

        // Find King anywhere in the roster and move to target if needed
        let kingPiece = null;
        let kingOldIndex = -1;

        if (RPGStats.kingLockedToRight && RPGStats.tacticsLevel < 1) {
            // Remove King from wherever it is
            [frontPieces, backPieces, reservePieces].forEach(arr => {
                for (let i = arr.length - 1; i >= 0; i--) {
                    if (arr[i] && arr[i].toLowerCase().includes('king')) {
                        kingPiece = arr.splice(i, 1)[0];
                        if (arr === backPieces) {
                            kingOldIndex = i;
                        }
                        if (arr === reservePieces) {
                            // splice already removed it, no null padding needed for reserve
                        } else {
                            // for front/back, keep length at 8 by inserting null
                            arr.splice(i, 0, null);
                        }
                    }
                }
            });
        }

        // Any backline piece without a frontline piece protecting it gets moved to reserve
        for (let i = 0; i < 8; i++) {
            if (backPieces[i] !== null && (!frontPieces[i] || !frontLineFactories.includes(frontPieces[i]))) {
                if (RPGStats.tacticsLevel < 2) {
                    reservePieces.push(backPieces[i]);
                    backPieces[i] = null;
                }
            }
        }

        // Compact columns to the left
        if (RPGStats.tacticsLevel < 2) {
            let newFront = [];
            let newBack = [];
            for (let i = 0; i < 8; i++) {
                if (frontPieces[i] !== null || backPieces[i] !== null) {
                    newFront.push(frontPieces[i]);
                    newBack.push(backPieces[i]);
                }
            }
            while (newFront.length < 8) newFront.push(null);
            while (newBack.length < 8) newBack.push(null);
            frontPieces = newFront;
            backPieces = newBack;
        }

        // Place King at kingIndexTarget
        if (RPGStats.kingLockedToRight && RPGStats.tacticsLevel < 1 && kingPiece) {
            if (backPieces[kingIndexTarget]) {
                if (kingOldIndex !== -1 && kingOldIndex < 8 && backPieces[kingOldIndex] === null) {
                    backPieces[kingOldIndex] = backPieces[kingIndexTarget];
                } else {
                    reservePieces.push(backPieces[kingIndexTarget]);
                }
            }
            backPieces[kingIndexTarget] = kingPiece;
        }

        // Move any pieces in disabled slots to the reserve
        // Note: We use maxFrontline for slot availability, not activeFrontline
        for (let i = 0; i < 8; i++) {
            if (RPGStats.kingLockedToRight && RPGStats.tacticsLevel < 1) {
                if (i !== kingIndexTarget && i >= Math.max(0, maxFrontline - 1) && backPieces[i]) {
                    reservePieces.push(backPieces[i]);
                    backPieces[i] = null;
                }
            } else {
                if (RPGStats.tacticsLevel < 2 && i >= maxFrontline && backPieces[i]) {
                    reservePieces.push(backPieces[i]);
                    backPieces[i] = null;
                }
            }
            if (RPGStats.tacticsLevel < 2 && i >= maxFrontline && frontPieces[i]) {
                reservePieces.push(frontPieces[i]);
                frontPieces[i] = null;
            }
        }
        
        // Clean up nulls from reservePieces
        for (let i = reservePieces.length - 1; i >= 0; i--) {
            if (reservePieces[i] === null) reservePieces.splice(i, 1);
        }

        // Update army size display
        const sizeDisplay = document.getElementById('armySizeDisplay');
        if (sizeDisplay) {
            const currentCount = frontPieces.filter(u => u !== null).length + 
                                 backPieces.filter(u => u !== null).length + 
                                 reservePieces.length;
            const maxCount = RPGStats.maxNumberOfPiecesToOwn;
            sizeDisplay.innerText = `(${currentCount}/${maxCount} Pieces)`;
            
            if (currentCount >= maxCount) {
                sizeDisplay.style.color = 'var(--threat)';
            } else {
                sizeDisplay.style.color = 'var(--piece-black)';
            }
        }
    }

    // Initial calculation
    recalculateLayout();

    let selectedElement = null;
    let draggedElement = null; // To keep track of the dragged item

    function renderPieces(container, piecesArray, isReserve = false) {
        container.innerHTML = '';
        piecesArray.forEach((factoryName, index) => {
            const isBackline = container === backContainer;
            const isFrontline = container === frontContainer;
            const isKing = factoryName && factoryName.toLowerCase().includes('king');
            const disableKingDrag = RPGStats.kingLockedToRight && isKing && RPGStats.tacticsLevel < 1;
            
            // Check if slot is disabled
            let isDisabled = false;
            if (RPGStats.tacticsLevel < 2) {
                if (isFrontline && index >= maxFrontline) {
                    isDisabled = true;
                }
                if (isBackline) {
                    if (RPGStats.kingLockedToRight && RPGStats.tacticsLevel < 1) {
                        if (index === kingIndexTarget) {
                            isDisabled = false; // King's slot
                        } else if (index >= Math.max(0, maxFrontline - 1)) {
                            isDisabled = true; // Only maxFrontline - 1 slots available for other backline pieces
                        }
                    } else {
                        if (index >= maxFrontline) {
                            isDisabled = true; // Same availability as frontline slots
                        }
                    }
                }
            }

            const div = document.createElement('div');
            div.className = 'reorder-piece';
            div.style.width = '60px';
            div.style.height = '60px';
            div.style.border = '2px dashed var(--board-dark)';
            div.style.borderRadius = '8px';
            div.style.display = 'flex';
            div.style.justifyContent = 'center';
            div.style.alignItems = 'center';
            div.style.cursor = (isDisabled || disableKingDrag) ? 'not-allowed' : 'pointer';
            div.style.background = factoryName ? 'var(--board-light)' : 'rgba(0,0,0,0.1)';
            if (isDisabled) div.style.background = 'rgba(255, 0, 0, 0.1)';
            div.style.transition = 'all 0.2s';
            div.style.position = 'relative'; // For potential badges
            
            if (factoryName && !isDisabled && !disableKingDrag) {
                div.draggable = true;
            }
            
            if (factoryName && typeof window[factoryName] === 'function') {
                div.style.border = '2px solid var(--board-dark)';
                const p = window[factoryName]('white', 0, 0);
                const img = document.createElement('img');
                img.src = `/static/${p.icon}`;
                img.style.width = '50px';
                img.style.height = '50px';
                img.title = factoryName;
                img.draggable = false; // Prevent image dragging to allow div dragging
                if (isDisabled || disableKingDrag) img.style.opacity = '0.7';
                div.appendChild(img);
            }
            
            // Drag & Drop Events
            div.ondragstart = (e) => {
                if (!factoryName || isDisabled || disableKingDrag) {
                    e.preventDefault();
                    return;
                }
                draggedElement = { div, container, index, piecesArray, isReserve };
                e.dataTransfer.effectAllowed = 'move';
                // Slight delay to allow the drag image to be captured before we modify the element
                setTimeout(() => {
                    div.style.opacity = '0.5';
                }, 0);
            };
            
            div.ondragover = (e) => {
                e.preventDefault(); // Necessary to allow dropping
                e.dataTransfer.dropEffect = 'move';
                div.style.transform = 'scale(1.05)';
            };
            
            div.ondragleave = () => {
                div.style.transform = 'scale(1)';
            };
            
            div.ondragend = () => {
                div.style.opacity = '1';
                div.style.transform = 'scale(1)';
                draggedElement = null;
            };
            
            div.ondrop = (e) => {
                e.preventDefault();
                div.style.transform = 'scale(1)';
                
                if (!draggedElement || isDisabled || disableKingDrag) return;
                
                const sourceArray = draggedElement.piecesArray;
                const sourceIndex = draggedElement.index;
                const targetArray = piecesArray;
                const targetIndex = index;
                
                // Hide delete button
                if(deleteBtn) deleteBtn.style.display = 'none';
                
                if (sourceArray === targetArray && sourceIndex === targetIndex) {
                    return;
                }

                // Simulate Swap to check validity
                let simFront = [...frontPieces];
                let simBack = [...backPieces];
                
                if (sourceArray === frontPieces && targetArray === frontPieces) {
                    simFront[sourceIndex] = targetArray[targetIndex];
                    simFront[targetIndex] = sourceArray[sourceIndex];
                } else if (sourceArray === frontPieces && targetArray === backPieces) {
                    simFront[sourceIndex] = targetArray[targetIndex];
                    simBack[targetIndex] = sourceArray[sourceIndex];
                } else if (sourceArray === backPieces && targetArray === frontPieces) {
                    simBack[sourceIndex] = targetArray[targetIndex];
                    simFront[targetIndex] = sourceArray[sourceIndex];
                } else if (sourceArray === frontPieces) {
                    simFront[sourceIndex] = targetArray[targetIndex];
                } else if (targetArray === frontPieces) {
                    simFront[targetIndex] = sourceArray[sourceIndex];
                } else if (sourceArray === backPieces) {
                    simBack[sourceIndex] = targetArray[targetIndex];
                } else if (targetArray === backPieces) {
                    simBack[targetIndex] = sourceArray[sourceIndex];
                }

                // Validation: Cannot place backline piece on the frontline
                if (RPGStats.tacticsLevel < 3) {
                    let invalidFrontline = false;
                    for (let i = 0; i < 8; i++) {
                        if (simFront[i] !== null && !frontLineFactories.includes(simFront[i])) {
                            invalidFrontline = true;
                            break;
                        }
                    }
                    if (invalidFrontline) {
                        showNotification("Cannot place a backline piece on the frontline.", "error");
                        return;
                    }
                }

                // Validation: Cannot remove frontline piece if a backline piece is directly behind it
                if (RPGStats.tacticsLevel < 2) {
                    let exposed = false;
                    for (let i = 0; i < 8; i++) {
                        if (simBack[i] !== null && (!simFront[i] || !frontLineFactories.includes(simFront[i]))) {
                            exposed = true;
                            break;
                        }
                    }
                    if (exposed) {
                        showNotification("Cannot remove frontline piece while a backline piece is behind it.", "error");
                        return;
                    }
                }

                // Perform Swap
                const temp = sourceArray[sourceIndex];
                sourceArray[sourceIndex] = targetArray[targetIndex];
                targetArray[targetIndex] = temp;
                
                // Post-Action Cleanup
                for(let i=reservePieces.length-1; i>=0; i--) {
                    if (reservePieces[i] === null) reservePieces.splice(i, 1);
                }
                
                recalculateLayout();
                
                selectedElement = null;
                draggedElement = null;
                renderPieces(frontContainer, frontPieces, false);
                renderPieces(backContainer, backPieces, false);
                renderPieces(reserveContainer, reservePieces, true);
            };

            div.onclick = () => {
                if (isDisabled || disableKingDrag) return;

                if (selectedElement === null) {
                    if (!factoryName) return; // Don't select empty slots as the first click
                    
                    selectedElement = { div, container, index, piecesArray, isReserve };
                    div.style.borderColor = 'var(--selected)';
                    div.style.boxShadow = '0 0 10px var(--selected)';
                    
                    // Show delete button if in reserve
                    if (isReserve && deleteBtn) {
                        deleteBtn.style.display = 'inline-block';
                        deleteBtn.onclick = (e) => {
                            e.stopPropagation();
                            // Delete piece
                            piecesArray.splice(index, 1);
                            // Deselect
                            selectedElement = null;
                            deleteBtn.style.display = 'none';
                            
                            // Re-open modal to recalculate King position and disabled slots
                            modal.close();
                            const newRoster = [...frontPieces, ...backPieces, ...reservePieces];
                            showReorderModal(newRoster, onConfirm, forceConfirmText);
                        };
                    } else if (deleteBtn) {
                        deleteBtn.style.display = 'none';
                    }
                    
                } else {
                    // Action Phase
                    const sourceArray = selectedElement.piecesArray;
                    const sourceIndex = selectedElement.index;
                    const targetArray = piecesArray;
                    const targetIndex = index;
                    
                    // Hide delete button
                    if(deleteBtn) deleteBtn.style.display = 'none';
                    
                    // Check if clicking the same item (Deselect)
                    if (sourceArray === targetArray && sourceIndex === targetIndex) {
                        selectedElement.div.style.borderColor = 'var(--board-dark)';
                        selectedElement.div.style.boxShadow = 'none';
                        selectedElement = null;
                        return;
                    }

                    // Simulate Swap to check validity
                    let simFront = [...frontPieces];
                    let simBack = [...backPieces];
                    
                    if (sourceArray === frontPieces && targetArray === frontPieces) {
                        simFront[sourceIndex] = targetArray[targetIndex];
                        simFront[targetIndex] = sourceArray[sourceIndex];
                    } else if (sourceArray === frontPieces && targetArray === backPieces) {
                        simFront[sourceIndex] = targetArray[targetIndex];
                        simBack[targetIndex] = sourceArray[sourceIndex];
                    } else if (sourceArray === backPieces && targetArray === frontPieces) {
                        simBack[sourceIndex] = targetArray[targetIndex];
                        simFront[targetIndex] = sourceArray[sourceIndex];
                    } else if (sourceArray === frontPieces) {
                        simFront[sourceIndex] = targetArray[targetIndex];
                    } else if (targetArray === frontPieces) {
                        simFront[targetIndex] = sourceArray[sourceIndex];
                    } else if (sourceArray === backPieces) {
                        simBack[sourceIndex] = targetArray[targetIndex];
                    } else if (targetArray === backPieces) {
                        simBack[targetIndex] = sourceArray[sourceIndex];
                    }

                // Validation: Cannot place backline piece on the frontline
                let invalidFrontline = false;
                for (let i = 0; i < 8; i++) {
                    if (simFront[i] !== null && !frontLineFactories.includes(simFront[i])) {
                        invalidFrontline = true;
                        break;
                    }
                }
                if (invalidFrontline) {
                    showNotification("Cannot place a backline piece on the frontline.", "error");
                    return;
                }

                // Validation: Cannot remove frontline piece if a backline piece is directly behind it
                let exposed = false;
                for (let i = 0; i < 8; i++) {
                    if (simBack[i] !== null && (!simFront[i] || !frontLineFactories.includes(simFront[i]))) {
                        exposed = true;
                        break;
                    }
                }
                if (exposed) {
                    showNotification("Cannot remove frontline piece while a backline piece is behind it.", "error");
                    return;
                }

                    // Perform Swap
                    const temp = sourceArray[sourceIndex];
                    sourceArray[sourceIndex] = targetArray[targetIndex];
                    targetArray[targetIndex] = temp;
                    
                    // Post-Action Cleanup
                    
                    // Filter nulls from Reserve (in case we swapped a null into it)
                    for(let i=reservePieces.length-1; i>=0; i--) {
                        if (reservePieces[i] === null) reservePieces.splice(i, 1);
                    }
                    
                    recalculateLayout();
                    
                    // Re-Render All
                    selectedElement = null;
                    renderPieces(frontContainer, frontPieces, false);
                    renderPieces(backContainer, backPieces, false);
                    renderPieces(reserveContainer, reservePieces, true);
                }
            };
            
            container.appendChild(div);
        });
        
        // If Reserve, add an "Empty Slot" to allow un-equipping (moving from board to reserve)
        if (isReserve) {
            const div = document.createElement('div');
            div.className = 'reorder-piece';
            div.style.width = '60px';
            div.style.height = '60px';
            div.style.border = '2px dashed var(--board-dark)';
            div.style.borderRadius = '8px';
            div.style.display = 'flex';
            div.style.justifyContent = 'center';
            div.style.alignItems = 'center';
            div.style.cursor = 'pointer';
            div.style.background = 'rgba(0,0,0,0.05)';
            div.innerHTML = '<span style="font-size:24px; color:var(--board-dark); opacity:0.5;">+</span>';
            
            div.ondragover = (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                div.style.transform = 'scale(1.05)';
            };
            
            div.ondragleave = () => {
                div.style.transform = 'scale(1)';
            };
            
            div.ondrop = (e) => {
                e.preventDefault();
                div.style.transform = 'scale(1)';
                
                if (draggedElement && !draggedElement.isReserve) {
                    const sourceArray = draggedElement.piecesArray;
                    const sourceIndex = draggedElement.index;
                    
                    // Simulate Unequip to check validity
                    let simFront = [...frontPieces];
                    let simBack = [...backPieces];
                    
                    if (sourceArray === frontPieces) {
                        simFront[sourceIndex] = null;
                    } else if (sourceArray === backPieces) {
                        simBack[sourceIndex] = null;
                    }

                    // Validation: Cannot remove frontline piece if a backline piece is directly behind it
                    if (RPGStats.tacticsLevel < 2) {
                        let exposed = false;
                        for (let i = 0; i < 8; i++) {
                            if (simBack[i] !== null && (!simFront[i] || !frontLineFactories.includes(simFront[i]))) {
                                exposed = true;
                                break;
                            }
                        }
                        if (exposed) {
                            showNotification("Cannot remove frontline piece while a backline piece is behind it.", "error");
                            return;
                        }
                    }
                    
                    const piece = sourceArray[sourceIndex];
                    if (piece) {
                        reservePieces.push(piece);
                        sourceArray[sourceIndex] = null;
                    }
                    
                    recalculateLayout();
                    
                    draggedElement = null;
                    selectedElement = null;
                    if(deleteBtn) deleteBtn.style.display = 'none';
                    renderPieces(frontContainer, frontPieces, false);
                    renderPieces(backContainer, backPieces, false);
                    renderPieces(reserveContainer, reservePieces, true);
                }
            };

            div.onclick = () => {
                if (selectedElement && !selectedElement.isReserve) {
                    // Moving from Board to Reserve (Unequip)
                    const sourceArray = selectedElement.piecesArray;
                    const sourceIndex = selectedElement.index;
                    
                    // Simulate Unequip to check validity
                    let simFront = [...frontPieces];
                    let simBack = [...backPieces];
                    
                    if (sourceArray === frontPieces) {
                        simFront[sourceIndex] = null;
                    } else if (sourceArray === backPieces) {
                        simBack[sourceIndex] = null;
                    }

                    // Validation: Cannot remove frontline piece if a backline piece is directly behind it
                    if (RPGStats.tacticsLevel < 2) {
                        let exposed = false;
                        for (let i = 0; i < 8; i++) {
                            if (simBack[i] !== null && (!simFront[i] || !frontLineFactories.includes(simFront[i]))) {
                                exposed = true;
                                break;
                            }
                        }
                        if (exposed) {
                            showNotification("Cannot remove frontline piece while a backline piece is behind it.", "error");
                            return;
                        }
                    }
                    
                    // Move piece to reserve
                    const piece = sourceArray[sourceIndex];
                    if (piece) {
                        reservePieces.push(piece);
                        sourceArray[sourceIndex] = null; // Clear board slot
                    }
                    
                    recalculateLayout();
                    
                    // Deselect and Render
                    selectedElement = null;
                    if(deleteBtn) deleteBtn.style.display = 'none';
                    renderPieces(frontContainer, frontPieces, false);
                    renderPieces(backContainer, backPieces, false);
                    renderPieces(reserveContainer, reservePieces, true);
                }
            };
            
            container.appendChild(div);
        }
    }

    renderPieces(frontContainer, frontPieces, false);
    renderPieces(backContainer, backPieces, false);
    if(reserveContainer) renderPieces(reserveContainer, reservePieces, true);

    confirmBtn.onclick = () => {
        // Validation: Ensure King is in the roster (Front or Back)
        const frontHasKing = frontPieces.some(p => p === 'simpleKingFactory' || p === 'kingFactory');
        const backHasKing = backPieces.some(p => p === 'simpleKingFactory' || p === 'kingFactory');
        
        if (!frontHasKing && !backHasKing) {
            showNotification("The King must be in the active army (Frontline or Backline)!", "error");
            return;
        }

        // Validation: Frontline must be a straight line without holes (unless Tactics >= 2)
        if (RPGStats.tacticsLevel < 2) {
            const requiredFrontline = Math.min(8, maxFrontline);
            for (let i = 0; i < requiredFrontline; i++) {
                if (!frontPieces[i]) {
                    showNotification("Frontline cannot have empty slots or holes! Please fill all active frontline slots.", "error");
                    return;
                }
            }
        }

        if (RPGStats.tacticsLevel < 3) {
            for (let i = 0; i < 8; i++) {
                if (frontPieces[i] && !frontLineFactories.includes(frontPieces[i])) {
                    showNotification("Only frontline units can be placed in the frontline!", "error");
                    return;
                }
            }
        }

        // Reconstruct the roster: Front (8) + Back (8) + Reserve (...)
        rpgState.playerRoster = [...frontPieces, ...backPieces, ...reservePieces];
        modal.close();
        if (onConfirm) onConfirm();
    };

    modal.showModal();
}

function showShopModal(restore = false) {
    // Reset overlay
    const overlay = document.getElementById('deathOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
    }
    
    // Clear win screen flag since we moved to shop
    rpgState.showWinScreen = false;
    // Don't save yet, we save when generating/restoring shop options below

    const modal = document.getElementById('shopDialog');
    const container = document.getElementById('shopOptions');
    container.innerHTML = '';
    
    const goldDisplay = document.getElementById('playerGold');
    if (goldDisplay) goldDisplay.innerText = rpgState.gold;

    // Use existing shop options if restoring, else generate new
    let shopItems = [];
    let currentNode = null;

    if (typeof grandMap !== 'undefined' && grandMap.map && grandMap.map[grandMap.currentY] && grandMap.map[grandMap.currentY][grandMap.currentX]) {
        currentNode = grandMap.map[grandMap.currentY][grandMap.currentX];
    }

    if (restore && rpgState.shopOptions && rpgState.shopOptions.length > 0) {
        shopItems = rpgState.shopOptions;
    } else if (currentNode && currentNode.shopItems && currentNode.shopItems.length > 0) {
        // Use permanently saved shop items for this specific node
        shopItems = currentNode.shopItems;
        rpgState.shopOptions = shopItems;
    } else {
        // Determine available factories based on region
        let factories = marketPieceFactories; // Default fallback
        if (currentNode && currentNode.region && regionFactories[currentNode.region]) {
             factories = regionFactories[currentNode.region];
        }

        // Generate 6 random units to buy (as requested)
        for(let i=0; i<6; i++) {
            if (Math.random() < 0.25) { // 25% chance for food
                let goldCost = Math.floor(Math.random() * 10) + 2; // 2 to 11 gold
                const foodAmount = goldCost * 5;
                goldCost -= RPGStats.shopDiscout;
                if(goldCost < 0) goldCost = 0;
                shopItems.push({ type: 'food', cost: goldCost, amount: foodAmount, bought: false });
            } else {
                const randomFactory = factories[Math.floor(Math.random() * factories.length)];
                const val = getPieceValue(randomFactory);
                let cost =  Math.floor(val * 5) - RPGStats.shopDiscout;
                if(cost < 0) cost = 0;
                shopItems.push({ type: 'unit', factory: randomFactory, cost: cost, value: val, bought: false });
            }
        }
        rpgState.shopOptions = shopItems;
        if (currentNode) {
            currentNode.shopItems = shopItems; // Save to map node permanently
        }
        saveProgress();
    }

    const updateAllButtons = () => {
        const buttons = container.querySelectorAll('.buy-btn');
        
        // Exclude null padding slots when counting the roster length
        const currentCount = rpgState.playerRoster.filter(u => u !== null).length;
        const rosterFull = currentCount >= RPGStats.maxNumberOfPiecesToOwn; 

        buttons.forEach(btn => {
            const index = btn.dataset.index;
            const item = shopItems[index];
            if (item.bought) return; // Already bought state handled

            if (item.type !== 'food') {
                if (rosterFull) {
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                    btn.style.cursor = 'not-allowed';
                    btn.innerText = "Reserve Full";
                    return;
                }
            }

            if (rpgState.gold < item.cost) {
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
        const isFood = item.type === 'food';
        
        if (isFood) {
            icon = `<div style="font-size: 50px; line-height: 50px; text-align: center; margin-bottom: 10px;">🍖</div>`;
            div.innerHTML = `
                ${icon}
                <h3>Rations</h3>
                <p>Amount: ${item.amount} 🍖</p>
                <p style="color:#e5b53e;font-weight:bold;">Cost: ${item.cost} 🪙</p>
            `;
        } else {
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
                <h3>${item.factory.replace('Factory','').replace('rpg','')}</h3>
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
        }

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
            if (isFood) {
                if (rpgState.gold >= item.cost && !item.bought) {
                    rpgState.gold -= item.cost;
                    rpgState.food += item.amount;
                    item.bought = true;
                    
                    if (document.getElementById('playerGold')) {
                        document.getElementById('playerGold').innerText = rpgState.gold;
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
            } else {
                if (rpgState.gold >= item.cost && !item.bought && rpgState.playerRoster.length < 24) {
                    rpgState.gold -= item.cost;
                    rpgState.playerRoster.push(item.factory);
                    item.bought = true;
                    
                    if (document.getElementById('playerGold')) {
                        document.getElementById('playerGold').innerText = rpgState.gold;
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
            }
        };
        
        div.appendChild(buyBtn);
        container.appendChild(div);
    });
    
    // Initial update
    updateAllButtons();
    
    if (!modal.open) {
        modal.showModal();
    }
}

function showSkillSelectionModal() {
    const modal = document.getElementById('skillSelectionDialog');
    const container = document.getElementById('skillOptions');
    if (!modal || !container) return;
    
    container.innerHTML = '';
    
    // Filter out fully leveled skills
    let availableSkills = RPGSKILLS.filter(s => {
        const existing = rpgState.activeSkills.find(active => (typeof active === 'string' ? active : active.name) === s.name);
        if (!existing) return true;
        const currentLevel = typeof existing === 'string' ? 1 : existing.level;
        return s.maxLevel && currentLevel < s.maxLevel;
    });
    
    // Pick 3 random skills, or fewer if less than 3 available
    let choices = [];
    while (choices.length < 3 && availableSkills.length > 0) {
        const idx = Math.floor(Math.random() * availableSkills.length);
        choices.push(availableSkills[idx]);
        availableSkills.splice(idx, 1); // remove picked skill
    }
    
    if (choices.length === 0) {
        // No skills left to pick
        rpgState.pendingSkillSelections = 0;
        showMapModal();
        return;
    }
    
    choices.forEach(skill => {
        const div = document.createElement('div');
        div.className = 'army-option'; // reuse styling
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.justifyContent = 'center';
        div.style.alignItems = 'center';
        
        // Find existing skill to determine level
        const existingSkillObj = rpgState.activeSkills.find(s => (typeof s === 'string' ? s : s.name) === skill.name);
        const currentLevel = existingSkillObj ? (typeof existingSkillObj === 'string' ? 1 : existingSkillObj.level) : 0;
        const nextLevel = currentLevel + 1;

        const skillDiv = document.createElement('div');
        skillDiv.style.marginBottom = '10px';
        skillDiv.style.padding = '15px';
        skillDiv.style.background = 'rgba(255, 255, 255, 0.1)';
        skillDiv.style.borderRadius = '8px';
        
        const desc = skill.getDescription ? skill.getDescription(nextLevel) : skill.description;
        skillDiv.innerHTML = `<strong>${skill.name} ${skill.maxLevel > 1 ? `(Lvl ${nextLevel})` : ''}</strong><br><br><span style="font-size: 0.9em;">${desc}</span>`;
        div.appendChild(skillDiv);
        
        div.onclick = () => {
            if (existingSkillObj) {
                if (typeof existingSkillObj === 'string') {
                    // Replace string with object
                    const idx = rpgState.activeSkills.indexOf(existingSkillObj);
                    rpgState.activeSkills[idx] = { name: skill.name, level: nextLevel };
                } else {
                    existingSkillObj.level = nextLevel;
                }
            } else {
                rpgState.activeSkills.push({ name: skill.name, level: 1 });
            }
            
            // Handle instant rewards that should only apply once when selected
            if (skill.name === "Rich") {
                rpgState.gold += (nextLevel * 10);
                updateGoldDisplay();
            } else if (skill.name === "Inheritance") {
                const foodReward = nextLevel === 1 ? 30 : nextLevel === 2 ? 50 : 80;
                rpgState.food += foodReward;
                updateGoldDisplay();
            }

            applyAllRPGSkills();
            rpgState.pendingSkillSelections--;
            modal.close();
            saveProgress();
            
            if (rpgState.pendingSkillSelections > 0) {
                showSkillSelectionModal();
            } else {
                if (typeof showMapModal === 'function') {
                    showMapModal();
                }
            }
        };
        
        container.appendChild(div);
    });
    
    modal.showModal();
}

function showRewardModal() {
    // Check if we need to show reorder screen first (e.g. after winning a unit to reserve)
    if (rpgState.pendingReorder) {
        rpgState.pendingReorder = false;
        showReorderModal(rpgState.playerRoster, () => {
            showRewardModal();
        });
        return;
    }

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
                 startLevel(rpgState.level + 1, option);
             };
             container.appendChild(div);
             return; // Skip standard rendering
        } else if (option.boardShape === 'Inn') {
            // Inn styling
            div.style.background = 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)';
            div.style.borderColor = '#fb8c00';
            div.innerHTML = `<h3>${option.type}</h3>
                             <p style="font-size:14px;">${option.description || ''}</p>
                             <div style="text-align:center; font-size: 40px; margin: 10px 0;">🏨</div>
                             <p style="text-align:center;">+${option.enemyValue} Food</p>`;
                             
            div.onclick = () => {
                 modal.close();
                 rpgState.food += option.enemyValue;
                 option.node.cleared = true;
                 option.node.enemyPower = 0;
                 if (typeof updateGoldDisplay === 'function') updateGoldDisplay();
                 saveProgress();
                 
                 if (typeof showNotification === 'function') {
                     showNotification(`Gained ${option.enemyValue} Food!`, 'success');
                 }
                 
                 // Show map or next options
                 if (typeof showMapModal === 'function') {
                     showMapModal();
                 } else {
                     showRewardModal();
                 }
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
                 rewardText += ` (Max ${option.foodReward} 🍖)`;
            }
        } else {
            rewardText = `${option.rewardContent || '?'} 🪙`;
            if (option.foodReward > 0) {
                 rewardText += ` (Max ${option.foodReward} 🍖)`;
            }
        }
        
        div.innerHTML = `<h3>${option.type}</h3>
                         <p style="font-size:14px;">${option.description || ''}</p>
                         <p>Enemy Power: ${Math.floor(option.enemyValue) || '?'}</p>
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
            // rpgState.pendingReward = army; // No longer needed
            modal.close();
            saveProgress();
            startLevel(rpgState.level + 1, option);
        };
        
        container.appendChild(div);
    });
    
    modal.showModal();
}

// --- Win Condition Helper ---
function gainKingExperience(exp) {
    if (typeof rpgState === 'undefined') return;
    
    rpgState.kingExp += Math.round(exp);
    rpgState.kingExp = Math.round(rpgState.kingExp);
    
    while (rpgState.kingLevel < rpgState.maxKingLevel && rpgState.kingExp >= KING_EXP_THRESHOLDS[rpgState.kingLevel]) {
        rpgState.kingLevel++;
        rpgState.pendingSkillSelections = (rpgState.pendingSkillSelections || 0) + 1;
        console.log(`King leveled up to ${rpgState.kingLevel}!`);
    }
}

// Ensure the function is accessible globally
if (typeof window !== 'undefined') {
    window.gainKingExperience = gainKingExperience;
}

function checkWinCondition(state) {
    if(state.won === 'tie') {
        if(state.turn === 'black'){
            state.won = 'white';
            state.message = "Black king was trapped!";
        }
        else{
            state.won = 'black';
            state.message = "White king was trapped!";
        }
    }
    if (state.won) return; // Already won

    // Check if King Captured (Regicide)
    const whiteKing = state.pieces.find(p => (p.icon.includes('King') || p.icon.includes('king') || p.icon.includes('SimpleKing')) && p.color === 'white');
    const blackKing = state.pieces.find(p => (p.icon.includes('King') || p.icon.includes('king') || p.icon.includes('SimpleKing')) && p.color === 'black');
    
    // Check if all pieces except King are gone
    const whiteOtherPieces = state.pieces.filter(p => p.color === 'white' && p !== whiteKing);
    const blackOtherPieces = state.pieces.filter(p => p.color === 'black' && p !== blackKing);

    if (!whiteKing) {
        state.won = 'black';
        state.message = "White King Fallen!";
        return;
    }

    if (!blackKing) {
        state.won = 'white';
        state.message = "Black King Fallen!";
        return;
    }
    
    if (whiteOtherPieces.length === 0) {
        state.won = 'black';
        state.message = "Army Annihilated!";
        return;
    }
    
    if (blackOtherPieces.length === 0) {
        state.won = 'white';
        state.message = "Enemy Army Annihilated!";
        return;
    }

    if (rpgState.food <= 0) {
        state.won = 'black';
        state.message = "Starvation!";
        return;
    }
    
    if (rpgState.currentFoodReward <= 0 && rpgState.gameActive) {
        state.won = 'white';
        state.message = "Enemy Starvation!";
        return;
    }
}

function getBoardStateString(state) {
    if (!state || !state.pieces) return '';
    const piecesStr = state.pieces.map(p => `${p.icon},${p.x},${p.y},${p.color}`).sort().join('|');
    return piecesStr + '|' + state.turn;
}

function checkGameOver(state) {
    if (rpgState.gameOverSequenceStarted) return; // Prevent multiple executions

    // Threefold repetition / Attrition Warfare check
    if (!rpgState.boardHistory) rpgState.boardHistory = [];
    const currentStateStr = getBoardStateString(state);
    
    // Only record if the state actually changed (e.g. a turn progressed)
    // Consecutive identical states mean the player just clicked/selected without completing a move.
    if (rpgState.boardHistory.length === 0 || rpgState.boardHistory[rpgState.boardHistory.length - 1] !== currentStateStr) {
        rpgState.boardHistory.push(currentStateStr);
        
        const occurrences = rpgState.boardHistory.filter(s => s === currentStateStr).length;
        if (occurrences >= 3) {
            // Use the existing confirmation modal to ask the user
            const dialog = document.getElementById('confirmationDialog');
            if (dialog) {
                document.getElementById('confirmTitle').innerText = "Attrition Warfare";
                document.getElementById('confirmMessage').innerText = "The exact same board state has occurred 3 times. Would you like to trigger Attrition Warfare? Both sides will lose food.";
                
                const btnYes = document.getElementById('btnConfirmYes');
                const btnNo = document.getElementById('btnConfirmNo');
                
                // Clear old listeners
                const newYes = btnYes.cloneNode(true);
                btnYes.parentNode.replaceChild(newYes, btnYes);
                const newNo = btnNo.cloneNode(true);
                btnNo.parentNode.replaceChild(newNo, btnNo);
                
                newYes.onclick = () => {
                    const minFood = Math.min(rpgState.food, rpgState.currentFoodReward);
                    rpgState.food -= minFood;
                    rpgState.currentFoodReward -= minFood;
                    rpgState.boardHistory = []; // Reset to avoid multiple triggers
                    updateGoldDisplay();
                    showNotification("Attrition Warfare triggered! Both sides lost food.", "alert");
                    dialog.close();
                    checkWinCondition(state);
                    checkGameEndSequence(state);
                };
                
                newNo.onclick = () => {
                    rpgState.boardHistory = []; // Reset so it doesn't immediately prompt again next click
                    dialog.close();
                };
                
                dialog.showModal();
                return; // Stop standard checkWinCondition execution until user decides
            } else {
                // Fallback if modal is missing
                const minFood = Math.min(rpgState.food, rpgState.currentFoodReward);
                rpgState.food -= minFood;
                rpgState.currentFoodReward -= minFood;
                rpgState.boardHistory = [];
                updateGoldDisplay();
                showNotification("Attrition Warfare! Both sides lose food due to repetition.", "alert");
            }
        }
    }

    checkWinCondition(state);
    checkGameEndSequence(state);
}

function checkGameEndSequence(state) {
    if (state.won) {
        rpgState.gameActive = false;
        rpgState.gameOverSequenceStarted = true; // Mark as started

        if (state.won === 'white') {
            // Player Won
            
            if (rpgState.permadeath) {
                // Track surviving pieces by their factory names
                const survivingWhitePieces = state.pieces.filter(p => p.color === 'white');
                const survivingFactories = survivingWhitePieces.map(p => p.factory).filter(f => f);
                
                const newRoster = [];
                for (let i = 0; i < rpgState.playerRoster.length; i++) {
                    const factoryName = rpgState.playerRoster[i];
                    if (!factoryName) {
                        newRoster.push(null);
                        continue;
                    }
                    
                    // Only check deployed pieces (first 16 slots: 8 front, 8 back)
                    if (i < 16) {
                        const survivedIndex = survivingFactories.indexOf(factoryName);
                        if (survivedIndex !== -1) {
                            newRoster.push(factoryName);
                            survivingFactories.splice(survivedIndex, 1); // remove one instance
                        } else {
                            // Piece died, don't keep it
                            newRoster.push(null);
                        }
                    } else {
                        // Reserve pieces were not deployed, so they didn't die
                        newRoster.push(factoryName);
                    }
                }
                rpgState.playerRoster = newRoster;
            }
            
            // Check if it's the final boss node
            let isFinalBoss = false;
            if (typeof grandMap !== 'undefined') {
                const currentNode = grandMap.map[grandMap.currentY][grandMap.currentX];
                if (currentNode) {
                    currentNode.cleared = true;
                    if (currentNode.difficulty && currentNode.difficulty.name === "Final Boss") {
                        isFinalBoss = true;
                    }
                }
            }
            
            if (isFinalBoss) {
                setTimeout(() => {
                    const overlay = document.getElementById('deathOverlay');
                    if (overlay) {
                        overlay.style.opacity = '1';
                        overlay.style.zIndex = '900'; 
                    }
                    setTimeout(() => {
                        const modal = document.getElementById('gameCompleteDialog');
                        if (modal) modal.showModal();
                        clearProgress();
                    }, 2000);
                }, 2000);
                return;
            }

            let winText = state.message === "Enemy Starvation!" ? "Enemy Starved!" : (state.message === "Enemy Army Annihilated!" ? "Army Annihilated!" : "Victory!");
            
            try {
                // Earn King Experience
                let enemyExp = 0;
                if (rpgState.enemyRoster && rpgState.enemyRoster.length > 0) {
                    rpgState.enemyRoster.forEach(piece => {
                        let pieceName = typeof piece === 'object' && piece !== null ? piece.factory : piece;
                        if (pieceName) {
                            // Exclude the king from experience calculation
                            if (pieceName !== 'kingFactory' && pieceName !== 'medievalKingFactory' && pieceName !== 'bugKingFactory' && pieceName !== 'promotersKingFactory' && !pieceName.toLowerCase().includes('king')) {
                                enemyExp += getPieceValue(pieceName);
                            }
                        }
                    });
                } else if (rpgState.currentEnemyValue) {
                    enemyExp = rpgState.currentEnemyValue;
                } else {
                    enemyExp = Math.round(1.5 + rpgState.level * 0.5);
                }

                // Add experience and check level up
                let totalExp = Math.round(enemyExp) + (RPGStats.additionalExperiencePerWin || 0);
                gainKingExperience(totalExp);

                // Earn Gold or Piece
                let foodEarned = (rpgState.currentFoodReward || 0) + RPGStats.additionalFoodPerWin;
                
                if (rpgState.currentRewardType === 'piece') {
                    const pieceFactory = rpgState.currentRewardContent;
                    if (pieceFactory) {
                        // Check if frontline is full (8 pieces) and new unit is frontline
                        // Count existing frontline units (ignoring nulls)
                        const currentFrontCount = rpgState.playerRoster.filter(u => u && frontLineFactories.includes(u)).length;
                        const isFrontlineUnit = frontLineFactories.includes(pieceFactory);
                        
                        if (currentFrontCount >= 8 && isFrontlineUnit) {
                            // Auto-place in reserve and trigger reorder
                            
                            // We must ensure the roster is formatted (8 Front + 8 Back + Reserve) to force reserve placement
                            // Filter out existing units by type to "compact" them and remove holes
                            let front = rpgState.playerRoster.filter(u => u && frontLineFactories.includes(u));
                            let back = rpgState.playerRoster.filter(u => u && !frontLineFactories.includes(u));
                            
                            // Pad to 8
                            while(front.length < 8) front.push(null);
                            while(back.length < 8) back.push(null);
                            
                            // Any extra frontline units (shouldn't be possible if we just checked < 8, but if > 8 existed...)
                            // If front.length > 8, we have a problem. 
                            // But we just filtered. If currentFrontCount >= 8, front has >= 8 items.
                            // We should take first 8 as front, rest as reserve?
                            // Actually, if we have 8, we add 1 -> 9.
                            
                            // Correct logic:
                            // Take all frontline units.
                            // Take all backline units.
                            // New unit is frontline.
                            
                            // Re-distribute:
                            // Front = first 8 frontline units.
                            // Back = first 8 backline units.
                            // Reserve = remaining frontline + remaining backline + new unit?
                            // Or just put new unit in reserve?
                            
                            // Let's stick to the request: "automatically be placed and reserve".
                            
                            // If we have > 8 frontline, the extras are already effectively in reserve or just not placed.
                            // We want to ensure the new one goes to reserve.
                            
                            // If front has 8 items.
                            // We add pieceFactory to reserve.
                            
                            const reserve = [];
                            // If there were existing reserves? 
                            // The current logic of "filter all front, filter all back" effectively destroys existing "Reserve" distinction if it wasn't based on type.
                            // But `rpgState.playerRoster` is just a list.
                            // If I have 9 pawns. 8 are front, 1 is back/reserve?
                            // `placeArmy` puts them in rows.
                            
                            // Let's assume standard behavior:
                            // Roster = [8 Front, 8 Back, ...Reserve]
                            // If formatted, we should preserve it?
                            
                            if (rpgState.playerRoster.length >= 16 || rpgState.playerRoster.includes(null)) {
                                // Already formatted.
                                // Just push to end (Reserve).
                                rpgState.playerRoster.push(pieceFactory);
                            } else {
                                // Not formatted. Format it now.
                                // Use the same logic as above.
                                let f = rpgState.playerRoster.filter(u => u && frontLineFactories.includes(u));
                                let b = rpgState.playerRoster.filter(u => u && !frontLineFactories.includes(u));
                                
                                // Slice to ensure max 8 in main slots
                                const safeFront = f.slice(0, 8);
                                const safeBack = b.slice(0, 8);
                                
                                const overflowFront = f.slice(8);
                                const overflowBack = b.slice(8);
                                
                                while(safeFront.length < 8) safeFront.push(null);
                                while(safeBack.length < 8) safeBack.push(null);
                                
                                const newReserve = [...overflowFront, ...overflowBack, pieceFactory];
                                
                                rpgState.playerRoster = [...safeFront, ...safeBack, ...newReserve];
                            }

                            rpgState.pendingReorder = true;
                            
                            const pieceName = window.pieceDescriptions[pieceFactory].name;
                            console.log(window.pieceDescriptions)
                            winText = `Won Unit: ${pieceName} (Placed in Reserve)`;
                            
                        } else {
                            rpgState.playerRoster.push(pieceFactory);
                            
                            // Show what piece was won
                            const pieceName = window.pieceDescriptions[pieceFactory].name;
                            winText = `Won Unit: ${pieceName}`;
                        }
                    } else {
                        winText = "Won a new unit!";
                    }
                    
                    // Food for piece reward was calculated in generateRewardOptions and stored in currentFoodReward
                    if (foodEarned > 0) {
                         winText += ` + ${foodEarned} 🍖`;
                    }
                    
                } else {
                    // Gold comes from currentRewardContent
                    const goldEarned = (rpgState.currentRewardContent || 0) + RPGStats.additionalGoldPerWin;
                    rpgState.gold = (rpgState.gold || 0) + goldEarned;
                    winText = `+${goldEarned} 🪙`;
                    if (foodEarned > 0) {
                         winText += ` + ${foodEarned} 🍖`;
                    }
                }
                
                rpgState.food = (rpgState.food || 0) + foodEarned;
                updateGoldDisplay();
                
                // Clear pending rewards (shop replaces direct rewards)
                rpgState.pendingReward = []; 
                
                // Mark win screen as active
                rpgState.showWinScreen = true;
                
                saveProgress();
            } catch (e) {
                console.error("Error processing reward:", e);
                winText = "Victory!";
            }

            const goldText = document.getElementById('goldEarnedText');
            if(goldText) goldText.innerText = winText;

            setTimeout(() => {
                // Fade to black
                const overlay = document.getElementById('deathOverlay');
                if (overlay) {
                    overlay.style.opacity = '1';
                    // Ensure it's on top of everything except modals
                    overlay.style.zIndex = '900'; 
                }

                setTimeout(() => {
                    const modal = document.getElementById('gameWonDialog');
                    if(modal) modal.showModal();
                }, 2000);
            }, 2000); // 2 second delay to see the final board
            
        } else if (state.won === 'black') {
            // Player Lost
            clearProgress(); // Wipe save on death  
            
            setTimeout(() => {
                // Fade to black
                const overlay = document.getElementById('deathOverlay');
                if (overlay) {
                    overlay.style.opacity = '1';
                }
                
                setTimeout(() => {
                    const modal = document.getElementById('gameOverDialog');
                    if (modal) {
                        const gameOverText = modal.querySelector('p');
                        if (gameOverText) {
                            if (state.message === "Starvation!") {
                                gameOverText.innerText = "Your food is over";
                            } else if (state.message === "Army Annihilated!") {
                                gameOverText.innerText = "Your army was annihilated.";
                            } else {
                                gameOverText.innerText = "Your King has fallen.";
                            }
                        }
                        modal.showModal();
                    }
                    if (overlay) {
                         // Ensure overlay stays but is behind modal
                         overlay.style.zIndex = '900'; // Keep it high but below modal if possible
                         // Dialogs are in top layer, so they should be above z-index 900
                    }
                }, 2000);
            }, 2000); // 2 second delay to see the final board
        } 
    }
}

function closeWinScreen() {
    const modal = document.getElementById('gameWonDialog');
    if (modal) modal.close();
    rpgState.showWinScreen = false;
    saveProgress();
    
    if (rpgState.pendingSkillSelections && rpgState.pendingSkillSelections > 0) {
        showSkillSelectionModal();
    } else if (typeof showMapModal === 'function') {
        showMapModal();
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
    if (!rpgState.gameActive) return;
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
        if (rpgState.food > 0) {
            rpgState.food--; // Decrement by 1 as per user request
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
    
    let aiPower = 105;
    let customEvolutionBlackStr = undefined;
    
    if (rpgState.hofBots && rpgState.hofBots.length > 0) {
        // Map region to race string
        let regionToRace = {
            'Classic': 'classic',
            'Medieval': 'medieval',
            'Insect': 'bug',
            'Promoters': 'promoters',
            'Cyborgs': 'cyborgs'
        };
        let enemyRace = regionToRace[rpgState.enemyRegion] || 'classic';
        
        let raceBots = rpgState.hofBots.filter(b => b.race === enemyRace);
        if (raceBots.length > 0) {
            let randomIndex = Math.floor(Math.random() * raceBots.length);
            let randomBot = raceBots[randomIndex];
            aiPower = 'customEvolution';
            customEvolutionBlackStr = JSON.stringify(randomBot);
        }
    }

    w.postMessage(JSONfn.stringify({
        state: state,
        color: color,
        AIPower: aiPower,
        customEvolutionBlack: customEvolutionBlackStr
    }));

    w.onmessage = function(event) {
        let move = JSONfn.parse(event.data);
        AIMove(move.pieceCounter, move.xClicked, move.yClicked, 'black');
        
        // Enemy wastes food each turn
        if (rpgState.currentFoodReward > 0) {
            rpgState.currentFoodReward--;
        }
        
        // Save progress after AI move
        if (!hotseatGame.state.won) {
            saveProgress();
        }
        
        updateGoldDisplay();
        
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
    
    initRpgGame();
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
    if (rpgState.boardShape === 'Woods') {
        // Deep forest green gradient for woods theme
        document.body.style.background = 'radial-gradient(circle, #556b2f 0%, #1a2f16 100%)';
    } else if (rpgState.boardShape === 'Fountain') {
        // Watery blue gradient for fountain theme
        document.body.style.background = 'radial-gradient(circle, #4fc3f7 0%, #01579b 100%)';
    } else if (rpgState.boardShape === 'Desert') {
        // Sandy gradient for desert theme
        document.body.style.background = 'radial-gradient(circle, #f4a460 0%, #8b4513 100%)';
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
        
        if (rpgState.boardShape === 'Woods') {
            currentWhiteColor = '#8fbc8f'; // DarkSeaGreen
            currentBlackColor = '#556b2f'; // DarkOliveGreen
        } else if (rpgState.boardShape === 'Fountain') {
            currentWhiteColor = '#b3e5fc'; // Light Blue
            currentBlackColor = '#0288d1'; // Dark Blue
        } else if (rpgState.boardShape === 'Desert') {
            currentWhiteColor = '#ffdead'; // NavajoWhite
            currentBlackColor = '#cd853f'; // Peru
        }
        
        // Simplified drawing
        if (!sq.light && !sq.special && !sq.red && !sq.grey) {
            if (isBlack) drawColoredSquare(x * squareLength, y * squareLength, currentBlackColor, squareLength);
            else drawColoredSquare(x * squareLength, y * squareLength, currentWhiteColor, squareLength);
            
            if(state.pieceSelected && x === state.pieceSelected.x && y === state.pieceSelected.y){
                if (rpgState.boardShape === 'Fountain') {
                    // Darker blue for selected piece in fountain map
                    drawColoredSquare(x*squareLength, y*squareLength, 'rgba(1, 87, 155, 0.7)', squareLength);
                } else {
                    drawColoredSquare(x*squareLength, y*squareLength, availableSquareColor, squareLength);
                }
            }
        }
        else if (sq.light) {
            if (rpgState.boardShape === 'Fountain') {
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
    if (rpgState.boardShape === 'Woods') {
        // Draw internal void bushes
        for(let tx=0; tx<8; tx++){
            for(let ty=0; ty<8; ty++){
                const exists = state.board.find(s => s.x === tx && s.y === ty);
                if(!exists){
                    if (typeof drawBush === 'function') {
                        drawBush(ctx, tx, ty, squareLength, rpgState.mapSeed);
                    }
                }
            }
        }
    } else if (rpgState.boardShape === 'Fountain') {
         // Draw large fountain in the center (covering 4 squares)
         if (typeof drawFountain === 'function') {
             const fx = (rpgState.fountainX !== undefined) ? rpgState.fountainX : 3;
             const fy = (rpgState.fountainY !== undefined) ? rpgState.fountainY : 3;
             // Calculate center of the 2x2 area
             // If fx=0, it covers x=0 and x=1. Center is 1.0? 
             // drawFountain expects tx, ty.
             // Original call: drawFountain(ctx, fx + 0.5, 3.5, ...);
             // Center of x=0 and x=1 is 1 * squareLength / 2 ? No.
             // If x=0, cx = 0 + 0.5 = 0.5 squares.
             // If x=1, cx = 1 + 0.5 = 1.5 squares.
             // Center of 2x2 block starting at x,y is (x+1) * squareLength.
             // Wait, drawFountain logic:
             // const cx = tx * squareLength + squareLength / 2;
             // So tx is expected to be in grid units.
             // If we pass fx + 0.5, cx = (fx + 0.5) * sq + sq/2 = fx*sq + sq/2 + sq/2 = (fx+1)*sq.
             // This is indeed the border between fx and fx+1. Correct.
             drawFountain(ctx, fx + 0.5, fy + 0.5, squareLength, rpgState.mapSeed, 1);
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

    if (typeof renderMoveHistory === 'function') {
        renderMoveHistory(state);
    }
    
    // Status Text
    const turnText = document.getElementById('turn');
    if (turnText) {
        turnText.innerText = state.turn === 'white' ? "Your Turn" : "Enemy Turn";
        // Always use same color for consistency, or ensure same style
        turnText.style.color = state.turn === 'white' ? "var(--selected)" : "#ff6b6b";
    }
}

// --- Notification Helpers ---

function showNotification(message, type = 'info') {
    // For errors and important alerts, use the modal dialog
    // This ensures visibility even over other modals (like the army reorder screen)
    if (type === 'error' || type === 'alert') {
        const dialog = document.getElementById('alertDialog');
        const msg = document.getElementById('alertMessage');
        const title = document.getElementById('alertTitle');
        
        if (dialog && msg) {
            msg.innerText = message;
            if(title) {
                // Set title based on type or context
                title.innerText = type === 'error' ? 'Warning' : 'Notice';
                // Style title for error
                title.style.color = type === 'error' ? 'var(--threat)' : 'var(--piece-black)';
                title.style.borderBottomColor = type === 'error' ? 'var(--threat)' : 'var(--board-dark)';
            }
            dialog.showModal();
            return;
        }
    }

    // Toast Notification (for success/info)
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    if (type === 'error') toast.classList.add('error');
    if (type === 'success') toast.classList.add('success');
    
    // Icon based on type
    let icon = '📜';
    if (type === 'error') icon = '⚠️';
    if (type === 'success') icon = '✅';

    toast.innerHTML = `<div style="font-size: 24px;">${icon}</div><div>${message}</div>`;
    
    container.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.5s ease-in forwards';
        setTimeout(() => {
            if(toast.parentNode) toast.parentNode.removeChild(toast);
        }, 500);
    }, 3000);
}

function showConfirmation(message, onYes) {
    const dialog = document.getElementById('confirmationDialog');
    const title = document.getElementById('confirmTitle');
    const msg = document.getElementById('confirmMessage');
    const btnYes = document.getElementById('btnConfirmYes');
    const btnNo = document.getElementById('btnConfirmNo');

    if (!dialog || !title || !msg || !btnYes) return;

    title.innerText = "Confirm Action"; // Default title
    msg.innerText = message;

    // Remove old listeners to prevent stacking
    const newYes = btnYes.cloneNode(true);
    btnYes.parentNode.replaceChild(newYes, btnYes);
    
    newYes.onclick = () => {
        dialog.close();
        if (onYes) onYes();
    };
    
    dialog.showModal();
}
