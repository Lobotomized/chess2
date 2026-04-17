
// Grand Map System
// Manages the 2D grid of battles

const grandMap = {
    // State
    currentX: 0,
    currentY: 0,
    map: [], // 2D Array
    width: 12,
    height: 12,
    
    // Predefined Map configurations
    predefinedMaps: {
        "The Crossing": {
            width: 5,
            height: 5,
            description: "A small 5x5 map for quick testing.",
            startX: 2,
            startY: 2,
            nodes: [
                { x: 2, y: 2, board: 'Standard', enemyPower: 0, cleared: true, rewardCap: 0 },
                { x: 2, y: 1, board: 'Woods', enemyPower: 5, rewardCap: 10 },
                { x: 2, y: 3, board: 'Fountain', enemyPower: 5, rewardCap: 10 },
                { x: 1, y: 2, board: 'Standard', enemyPower: 5, rewardCap: 10 },
                { x: 3, y: 2, board: 'Standard', enemyPower: 5, rewardCap: 10 },
                // Corners
                { x: 0, y: 0, board: 'Fountain', enemyPower: 20, rewardCap: 50 },
                { x: 4, y: 0, board: 'Woods', enemyPower: 20, rewardCap: 50 },
                { x: 0, y: 4, board: 'Woods', enemyPower: 20, rewardCap: 50 },
                { x: 4, y: 4, board: 'Fountain', enemyPower: 20, rewardCap: 50 },
            ]
        }
    },

    // Initialize or load state
    init(savedState) {
        if (savedState && savedState.predefinedMap) {
            if (!this.loadPredefined(savedState.predefinedMap)) {
                // Fallback if not found
                this.currentX = 0;
                this.currentY = 0;
                this.width = 15;
                this.height = 15;
                this.generateMap();
            }
        } else if (savedState && savedState.map) {
            this.currentX = savedState.currentX || 0;
            this.currentY = savedState.currentY || 0;
            this.map = savedState.map;
            this.width = savedState.width || 15;
            this.height = savedState.height || 15;
            this.seed = savedState.seed || Math.random() * 10000;
            this.generateCenters();
        } else {
            this.currentX = 0;
            this.currentY = 0;
            this.width = 15;
            this.height = 15;
            this.generateMap();
        }
    },

    // Load a predefined map by name
    loadPredefined(mapName) {
        const pMap = this.predefinedMaps[mapName];
        if (!pMap) {
            console.warn(`Predefined map "${mapName}" not found.`);
            return false;
        }

        this.width = pMap.width;
        this.height = pMap.height;
        this.currentX = pMap.startX !== undefined ? pMap.startX : 0;
        this.currentY = pMap.startY !== undefined ? pMap.startY : 0;
        
        // Reset map
        this.map = [];
        this.seed = Math.random() * 10000; // Give predefined maps a seed for generation
        this.generateCenters();
        
        // Fill with default generated nodes first (as background/filler)
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                row.push(this.generateNode(x, y));
            }
            this.map.push(row);
        }

        // Overlay predefined nodes
        if (pMap.nodes) {
            pMap.nodes.forEach(nodeDef => {
                if (this.map[nodeDef.y] && this.map[nodeDef.y][nodeDef.x]) {
                    // Merge predefined properties into the node
                    // We need to be careful not to overwrite the object reference if possible, or just replace properties
                    const targetNode = this.map[nodeDef.y][nodeDef.x];
                    
                    Object.assign(targetNode, nodeDef);
                    
                    // If difficulty details are missing but enemyPower is set, we might want to fake the difficulty profile
                    if (nodeDef.enemyPower !== undefined && !nodeDef.difficulty) {
                        targetNode.difficulty = {
                            enemyValue: nodeDef.enemyPower,
                            rewardCap: nodeDef.rewardCap || 10,
                            name: "Predefined",
                            description: "Fixed Encounter"
                        };
                    }
                }
            });
        }
        
        return true;
    },

    // Save state helper
    getState() {
        return {
            currentX: this.currentX,
            currentY: this.currentY,
            map: this.map,
            width: this.width,
            height: this.height,
            seed: this.seed
        };
    },

    generateCenters() {
        this.centers = [];
        const regionNames = ['Classic', 'Medieval', 'Insect', 'Cyborgs', 'Promoters'];
        // Use deterministic random based on seed for centers
        // Calculate number of centers based on map size to aim for 4-8 squares per territory
        const numCenters = Math.floor((this.width * this.height) / 6);
        for (let i = 0; i < numCenters; i++) {
            const cx = (Math.sin(this.seed + i * 123) * 0.5 + 0.5) * this.width;
            const cy = (Math.cos(this.seed + i * 321) * 0.5 + 0.5) * this.height;
            const region = regionNames[Math.floor((Math.sin(this.seed + i * 777) * 0.5 + 0.5) * regionNames.length)];
            this.centers.push({ x: cx, y: cy, name: region });
        }
    },

    // Generate the full map
    generateMap() {
        this.map = [];
        this.seed = Math.random() * 10000;
        
        this.generateCenters();

        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                row.push(this.generateNode(x, y));
            }
            this.map.push(row);
        }
        // Ensure start node is cleared
        if (this.map[0][0]) {
            this.map[0][0].cleared = true;
            this.map[0][0].enemyPower = 0;
        }
    },

    // Generate a node for a specific coordinate
    generateNode(x, y) {
        // Pseudo-random number generator based on coordinates and seed
        const getDeterministicRandom = (modifier = 0) => {
             const seed = this.seed || 0;
             const v = Math.sin(x * 129898 + y * 78233 + seed + modifier) * 43758.5453123;
             return Math.abs(v - Math.floor(v));
        };
        
        // 1. Determine Region FIRST to influence difficulty and board type
        // Use Perlin-like noise or Distance-based Voronoi for organic shapes
        // Use the dynamically generated centers from generateMap()
        const centers = this.centers || [
            { name: 'Classic', x: 3, y: 3 },
            { name: 'Medieval', x: 12, y: 3 },
            { name: 'Insect', x: 3, y: 12 },
            { name: 'Cyborgs', x: 12, y: 12 },
            { name: 'Promoters', x: 7, y: 7 } // Middle
        ];
        
        // Add some noise to the distance check to make borders jagged
        // Noise based on x, y
        const noise = (getDeterministicRandom(5) * 2) - 1; // -1 to 1 variance
        
        let minDistance = Infinity;
        let region = 'Classic';
        
        centers.forEach(center => {
            // Euclidean distance with noise
            const d = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2)) + noise;
            if (d < minDistance) {
                minDistance = d;
                region = center.name;
            }
        });

        // Determine board type
        // Adjust probabilities: Standard (35%), Woods (25%), Fountain (20%), Desert (10%), Market (10%)
        const boards = ['Standard', 'Woods', 'Fountain', 'Desert', 'Market'];
        let board = 'Standard';
        const rand = getDeterministicRandom(1);
        if (rand < 0.35) board = 'Standard';
        else if (rand < 0.60) board = 'Woods';
        else if (rand < 0.80) board = 'Fountain';
        else if (rand < 0.90) board = 'Desert';
        else board = 'Market';
        
        // Determine Difficulty based on distance from 0,0
        const distance = Math.abs(x) + Math.abs(y);

        const difficulties = window.difficulties || [];
        let difficultyProfile = { enemyValue: 5, rewardCap: 10, name: "Unknown", description: "Unknown Region" };
        
        if (board === 'Market') {
            difficultyProfile = { 
                enemyValue: 0, 
                rewardCap: 0, 
                name: "Marketplace", 
                description: "A safe haven to hire mercenaries." 
            };
        } else if (difficulties.length > 0) {
            // Randomize difficulty with a spread based on distance
            // Near the start, keep difficulties low. Farther away, increase the max and min possible difficulties.
            const maxIndex = Math.min(difficulties.length - 1, Math.floor(distance / 1.5) + 2);
            const minIndex = Math.max(0, Math.floor(distance / 3) - 1);
            
            const randomFactor = getDeterministicRandom(2);
            let index = Math.floor(minIndex + randomFactor * (maxIndex - minIndex + 1));
            
            if (index > difficulties.length - 1) index = difficulties.length - 1;
            if (index < 0) index = 0;
            
            difficultyProfile = difficulties[index];
        }

        const node = {
            x: x,
            y: y,
            enemyPower: difficultyProfile.enemyValue,
            board: board,
            cleared: false,
            rewardCap: difficultyProfile.rewardCap,
            difficulty: difficultyProfile, // Keep reference for details
            region: region
        };
        
        if (board === 'Fountain') {
            const fVal = getDeterministicRandom(3); 
            node.fountainX = Math.floor(fVal * 7); // 0 to 6
        }

        // Generate Rewards
        const rewards = {
            gold: 0,
            food: 0,
            pieces: []
        };
        
        // Gold based on enemy power/difficulty
        // Base: 10, plus up to 50% variance
        const goldBase = (difficultyProfile.enemyValue || 1);
        rewards.gold = goldBase
        
        // Food mechanics
        // Generate enemyFood based on gold reward and some randomness
        let baseGold = rewards.gold || 10;
        let baseFood = Math.floor(baseGold * 0.8) + 5;
        node.enemyFood = baseFood + Math.floor(getDeterministicRandom(8) * (baseFood * 0.5));
        
        // Pieces - small chance
        // Market always has a unit (Mercenary)
        let pieceChance = 0.1;
        if (board === 'Market') pieceChance = 1.0;
        
        if (getDeterministicRandom(9) < pieceChance) {
             rewards.pieces.push("Unit");
             
             // Pre-generate the specific unit to ensure consistency
             const maxPieceValue = difficultyProfile.enemyValue / 2;
             const sourceList = (typeof winnablePieceFactories !== 'undefined' && winnablePieceFactories.length > 0) 
                               ? winnablePieceFactories 
                               : (typeof availablePieceFactories !== 'undefined' ? availablePieceFactories : ['pawnFactory']);
                               
             // Helper to get piece value if not available globally yet (fallback)
             const getVal = (f) => {
                 if (typeof getPieceValue === 'function') return getPieceValue(f);
                 return 5; // Default low value
             };

             const eligiblePieces = sourceList.filter(f => {
                 const v = getVal(f);
                 return v <= maxPieceValue && v >= Math.max(0, maxPieceValue - 5);
             });
             
             let selectedFactory = 'pawnFactory';
             if (eligiblePieces.length > 0) {
                 const randIndex = Math.floor(getDeterministicRandom(10) * eligiblePieces.length);
                 selectedFactory = eligiblePieces[randIndex];
             } else if (sourceList.length > 0) {
                 // Fallback to any random low value piece
                 const randIndex = Math.floor(getDeterministicRandom(11) * sourceList.length);
                 selectedFactory = sourceList[randIndex];
             }
             
             rewards.specificPiece = selectedFactory;
        }
        
        node.rewards = rewards;

        return node;
    },

    // Get available moves (North, South, East, West)
    getAvailableMoves() {
        const directions = [
            { name: "North", dx: 0, dy: -1 },
            { name: "South", dx: 0, dy: 1 },
            { name: "East", dx: 1, dy: 0 },
            { name: "West", dx: -1, dy: 0 }
        ];

        const moves = [];
        directions.forEach(dir => {
            const nx = this.currentX + dir.dx;
            const ny = this.currentY + dir.dy;
            
            // Check bounds
            if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                moves.push({
                    direction: dir.name,
                    x: nx,
                    y: ny,
                    node: this.map[ny][nx]
                });
            }
        });
        return moves;
    },

    moveTo(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.currentX = x;
            this.currentY = y;
            return this.map[y][x];
        }
        return null;
    }
};

// Export for usage
if (typeof window !== 'undefined') {
    window.grandMap = grandMap;
}
if (typeof module !== 'undefined') {
    module.exports = grandMap;
}
