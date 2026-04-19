const RPGStats = {
    // Movement costs
    foodLostOnMovement: 0,
    additionalGoldPerWin:0,
    additionalFoodPerWin:0,
    movemetFreedom: [
            { name: "North", dx: 0, dy: -1 },
            { name: "South", dx: 0, dy: 1 },
            { name: "East", dx: 1, dy: 0 },
            { name: "West", dx: -1, dy: 0 }
        ],
    shopDiscout: 0
    // More stats can be added here in the future
};
