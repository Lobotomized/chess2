
// Grand Map System
// Manages the 2D grid of battles

const grandMap = {
    // State
    currentX: 0,
    currentY: 0,
    map: [], // 2D Array
    width: 30,
    height: 30,
    
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
                this.width = 30;
                this.height = 30;
                this.generateMap();
            }
        } else if (savedState && savedState.map) {
            this.currentX = savedState.currentX || 0;
            this.currentY = savedState.currentY || 0;
            this.map = savedState.map;
            this.width = savedState.width || 30;
            this.height = savedState.height || 30;
        } else {
            this.currentX = 0;
            this.currentY = 0;
            this.width = 30;
            this.height = 30;
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
            height: this.height
        };
    },

    // Generate the full map
    generateMap() {
        this.map = [];
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
        // Pseudo-random number generator based on coordinates
        const getDeterministicRandom = (modifier = 0) => {
             const v = Math.sin(x * 129898 + y * 78233 + modifier) * 43758.5453123;
             return v - Math.floor(v);
        };

        // Determine board type
        // Adjust probabilities: Standard (40%), Woods (30%), Fountain (20%), Market (10%)
        const boards = ['Standard', 'Woods', 'Fountain', 'Market'];
        let board = 'Standard';
        const rand = getDeterministicRandom(1);
        if (rand < 0.4) board = 'Standard';
        else if (rand < 0.7) board = 'Woods';
        else if (rand < 0.9) board = 'Fountain';
        else board = 'Market';
        
        // Determine Difficulty based on distance from 0,0
        // Use Manhattan distance as a base for difficulty scaling
        const distance = Math.abs(x) + Math.abs(y);
        
        // Calculate an "effective level" based on distance
        const effectiveLevel = Math.max(1, distance);

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
            // Pick a difficulty roughly appropriate for the distance
            let index = Math.min(difficulties.length - 1, Math.floor((effectiveLevel - 1) / 2));
            
            // Add variance based on coordinate hash
            const variance = getDeterministicRandom(2);
            if (variance > 0.7 && index < difficulties.length - 1) {
                index++;
            } else if (variance < 0.2 && index > 0) {
                index--;
            }
            
            difficultyProfile = difficulties[index];
        }

        const node = {
            x: x,
            y: y,
            enemyPower: difficultyProfile.enemyValue,
            board: board,
            cleared: false,
            rewardCap: difficultyProfile.rewardCap,
            difficulty: difficultyProfile // Keep reference for details
        };
        
        if (board === 'Fountain') {
            const fVal = getDeterministicRandom(3); 
            node.fountainX = Math.floor(fVal * 7); // 0 to 6
        }

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
