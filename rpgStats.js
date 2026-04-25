const RPGStats = {
    // Movement costs
    foodLostOnMovement: 6,
    additionalGoldPerWin:0,
    additionalFoodPerWin:0,
    additionalExperiencePerWin:0,
    maxNumberOfPiecesToOwn:8,
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
    tacticsLevel: 0,
    scoutingLevel: 0,
    summonerLevel: 0,
};

const RPGSKILLS = [
    { 
        name: "Scouting", 
        maxLevel: 3,
        getDescription: (level) => level === 1 ? "You can see enemy pieces on the map." : level === 2 ? "You can see what options the shops have." : "You can see the square terrain (woods, fountains, etc.).",
        apply: (level) => { RPGStats.scoutingLevel = level; } 
    },
    { 
        name: "Nomad", 
        maxLevel: 3,
        getDescription: (level) => {
            let cost;
            if (level === 1) {
                cost = '3';
            } else if (level === 2) {
                cost = '1';
            } else {
                cost = '0';
            }
            return `Movement costs ${cost} food.`;
        },
        apply: (level) => {
            if (level === 1) {
                RPGStats.foodLostOnMovement = 3;
            } else if (level === 2) {
                RPGStats.foodLostOnMovement = 1;
            } else {
                RPGStats.foodLostOnMovement = 0;
            }
        }
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
        name: "Leadership", 
        maxLevel: 3,
        getDescription: (level) => `Allows you to have ${level === 1 ? '12' : level === 2 ? '18' : '24'} pieces in your reserve + army.`,
        apply: (level) => { 
            if (level === 1) {
                RPGStats.maxNumberOfPiecesToOwn = 12;
            } else if (level === 2) {
                RPGStats.maxNumberOfPiecesToOwn = 18;
            } else if (level >= 3) {
                RPGStats.maxNumberOfPiecesToOwn = 24;
            }
        } 
    },
    { 
        name: "Tactics", 
        maxLevel: 3,
        getDescription: (level) => {
            if (level === 1) return "The King can be freely placed anywhere in the backline.";
            if (level === 2) return "You can place pieces anywhere in the backline without frontline protection.";
            return "You can freely swap frontline and backline units.";
        },
        apply: (level) => { 
            RPGStats.tacticsLevel = level;
            RPGStats.kingLockedToRight = false;
        } 
    },
    { 
        name: "Learning", 
        maxLevel: 3,
        getDescription: (level) => `Gain +${level * 2} experience for every battle.`,
        apply: (level) => { RPGStats.additionalExperiencePerWin = level * 2; } 
    },
    { 
        name: "Summoner", 
        maxLevel: 3,
        getDescription: (level) => {
            if (level === 1) return "Summons a Weak Star Man on a random empty spot in your two rows at the start of battle.";
            if (level === 2) return "Summons a Mid Star Man on a random empty spot in your two rows at the start of battle.";
            return "Summons an Expert Star Man on a random empty spot in your two rows at the start of battle.";
        },
        apply: (level) => { RPGStats.summonerLevel = level; } 
    },
];

function resetRPGStats() {
    RPGStats.foodLostOnMovement = 6;
    RPGStats.additionalGoldPerWin = 0;
    RPGStats.additionalFoodPerWin = 0;
    RPGStats.additionalExperiencePerWin = 0;
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
    RPGStats.tacticsLevel = 0;
    RPGStats.maxNumberOfPiecesToOwn = 8;
    RPGStats.scoutingLevel = 0;
    RPGStats.summonerLevel = 0;
}

function applyRPGSkill(skillName) {
    resetRPGStats(); // Reset before applying to avoid duplicate effects
    const skill = RPGSKILLS.find(s => s.name === skillName);
    if (skill) {
        skill.apply(1); // Default to level 1 for backward compatibility when not passing level
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
