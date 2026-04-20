const RPGStats = {
    // Movement costs
    foodLostOnMovement: 4,
    additionalGoldPerWin:0,
    additionalFoodPerWin:0,
    movementFreedom: [
            { name: "North", dx: 0, dy: -1 },
            { name: "South", dx: 0, dy: 1 },
            { name: "East", dx: 1, dy: 0 },
            { name: "West", dx: -1, dy: 0 }
        ],
    shopDiscout: 0,
    startingGold: 0,
    startingFood: 100,
    kingLockedToRight: true,
};

const RPGSKILLS = [
    { 
        name: "Nomad", 
        maxLevel: 3,
        getDescription: (level) => `Movement costs ${level === 1 ? '3' : level === 2 ? '2' : '0'} food.`,
        apply: (level) => { RPGStats.foodLostOnMovement = level === 1 ? 3 : level === 2 ? 2 : 0; } 
    },
    { 
        name: "Bounty Hunter", 
        maxLevel: 3,
        getDescription: (level) => `Earn ${level} extra gold per win.`,
        apply: (level) => { RPGStats.additionalGoldPerWin = level; } 
    },
    { 
        name: "Scavenger", 
        maxLevel: 3,
        getDescription: (level) => `Earn ${level * 3} extra food per win.`,
        apply: (level) => { RPGStats.additionalFoodPerWin = level * 3; } 
    },
    { 
        name: "Logistics", 
        maxLevel: 3,
        getDescription: (level) => level === 1 ? "Diagonals added to movement freedom." : level === 2 ? "Adds 2-square straight jumps to movement." : "Adds 2-square diagonal jumps to movement.",
        apply: (level) => { 
            if (level >= 1) {
                RPGStats.movementFreedom.push(
                    { name: "North-East", dx: 1, dy: -1 },
                    { name: "North-West", dx: -1, dy: -1 },
                    { name: "South-East", dx: 1, dy: 1 },
                    { name: "South-West", dx: -1, dy: 1 }
                );
            }
            if (level >= 2) {
                RPGStats.movementFreedom.push(
                    { name: "North 2", dx: 0, dy: -2 },
                    { name: "South 2", dx: 0, dy: 2 },
                    { name: "East 2", dx: 2, dy: 0 },
                    { name: "West 2", dx: -2, dy: 0 }
                );
            }
            if (level >= 3) {
                RPGStats.movementFreedom.push(
                    { name: "North-East 2", dx: 2, dy: -2 },
                    { name: "North-West 2", dx: -2, dy: -2 },
                    { name: "South-East 2", dx: 2, dy: 2 },
                    { name: "South-West 2", dx: -2, dy: 2 }
                );
            }
        } 
    },
    { 
        name: "Trader", 
        maxLevel: 3,
        getDescription: (level) => `Shop prices reduced by ${level}.`,
        apply: (level) => { RPGStats.shopDiscout = level; } 
    },
    { 
        name: "Rich", 
        maxLevel: 3,
        getDescription: (level) => `Gain ${level * 10} extra gold.`,
        apply: (level) => { /* Applied instantly in rpg.js */ } 
    },
    { 
        name: "Inheritance", 
        maxLevel: 3,
        getDescription: (level) => `Gain ${level === 1 ? '30' : level === 2 ? '50' : '80'} extra food.`,
        apply: (level) => { /* Applied instantly in rpg.js */ } 
    },
    { 
        name: "Tactics", 
        maxLevel: 1,
        getDescription: (level) => "The King can be freely placed anywhere in the backline.",
        apply: (level) => { RPGStats.kingLockedToRight = false; } 
    },
];

function resetRPGStats() {
    RPGStats.foodLostOnMovement = 4;
    RPGStats.additionalGoldPerWin = 0;
    RPGStats.additionalFoodPerWin = 0;
    RPGStats.movementFreedom = [
        { name: "North", dx: 0, dy: -1 },
        { name: "South", dx: 0, dy: 1 },
        { name: "East", dx: 1, dy: 0 },
        { name: "West", dx: -1, dy: 0 }
    ];
    RPGStats.shopDiscout = 0;
    RPGStats.startingGold = 0;
    RPGStats.startingFood = 100;
    RPGStats.kingLockedToRight = true;
}

function applyRPGSkill(skillName) {
    resetRPGStats(); // Reset before applying to avoid duplicate effects
    const skill = RPGSKILLS.find(s => s.name === skillName);
    if (skill) {
        skill.apply();
    }
}

function applyAllRPGSkills() {
    resetRPGStats();
    if (typeof rpgState !== 'undefined' && rpgState.activeSkills && Array.isArray(rpgState.activeSkills)) {
        rpgState.activeSkills.forEach(skillObj => {
            // Backward compatibility: if skillObj is just a string, treat it as level 1
            const isString = typeof skillObj === 'string';
            const skillName = isString ? skillObj : skillObj.name;
            const skillLevel = isString ? 1 : skillObj.level;
            
            const skill = RPGSKILLS.find(s => s.name === skillName);
            if (skill) {
                skill.apply(skillLevel);
            }
        });
    } else if (typeof rpgState !== 'undefined' && rpgState.activeSkill) {
        const skill = RPGSKILLS.find(s => s.name === rpgState.activeSkill);
        if (skill) {
            skill.apply(1);
        }
    }
}
