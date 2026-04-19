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
    { name: "Nomad", description: "Movement costs no food.", apply: () => { RPGStats.foodLostOnMovement = 0; } },
    { name: "Bounty Hunter", description: "Earn 2 extra gold per win.", apply: () => { RPGStats.additionalGoldPerWin = 2; } },
    { name: "Scavenger", description: "Earn 6 extra food per win.", apply: () => { RPGStats.additionalFoodPerWin = 6; } },
    { name: "Logistics", description: "Diagonals added to movement freedom.", apply: () => { 
        RPGStats.movementFreedom.push(
            { name: "North-East", dx: 1, dy: -1 },
            { name: "North-West", dx: -1, dy: -1 },
            { name: "South-East", dx: 1, dy: 1 },
            { name: "South-West", dx: -1, dy: 1 }
        );
    } },
    { name: "Trader", description: "Shop prices reduced by 2.", apply: () => { RPGStats.shopDiscout = 2; } },
    { name: "Rich", description: "Start with 20 extra gold.", apply: () => { RPGStats.startingGold += 20; } },
    { name: "Inheritance", description: "Start with 50 extra food.", apply: () => { RPGStats.startingFood += 50; } },
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
