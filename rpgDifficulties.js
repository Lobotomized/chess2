
// RPG Difficulty Configuration
// Each difficulty defines the enemy army value and potential reward cap.
// The values are flat (not multiplied by level).

const difficulties = [
    { name: "Peasant Revolt", enemyValue: 3, rewardCap: 2, description: "A very small group of weaklings." },
    { name: "Local Militia", enemyValue: 4, rewardCap: 3, description: "Poorly trained but armed." },
    { name: "Scouting Party", enemyValue: 6, rewardCap: 4, description: "A reconnaissance squad." },
    { name: "Bandit Camp", enemyValue: 9, rewardCap: 5, description: "Outlaws looking for trouble." },
    { name: "Guarded Outpost", enemyValue: 12, rewardCap: 6, description: "Lightly fortified position." },
    { name: "Mercenary Band", enemyValue: 15, rewardCap: 7, description: "Soldiers for hire." },
    { name: "Border Patrol", enemyValue: 19, rewardCap: 8, description: "Official army detachment." },
    { name: "Raiding Party", enemyValue: 22, rewardCap: 9, description: "Aggressive attackers." },
    { name: "Fortified Tower", enemyValue: 26, rewardCap: 10, description: "Defensive structure." },
    { name: "Knight's Retinue", enemyValue: 30, rewardCap: 11, description: "Elite bodyguards." },
    { name: "Vanguard Force", enemyValue: 34, rewardCap: 12, description: "The front line of the main army." },
    { name: "Siege Breakers", enemyValue: 37, rewardCap: 13, description: "Heavy hitters." },
    { name: "Royal Guard", enemyValue: 41, rewardCap: 14, description: "The King's personal protection." },
    { name: "Elite Battalion", enemyValue: 45, rewardCap: 15, description: "Veterans of many wars." },
    { name: "General's Command", enemyValue: 49, rewardCap: 16, description: "High value targets." },
    { name: "Warlord's Horde", enemyValue: 52, rewardCap: 17, description: "A massive chaotic force." },
    { name: "Dark Ritual", enemyValue: 60, rewardCap: 18, description: "Something unnatural." },
    { name: "Shadow of death", enemyValue: 67, rewardCap: 19, description: "A dark and foreboding place." },
    { name: "Last Stand", enemyValue: 75, rewardCap: 20, description: "Do or die." },
    { name: "The End", enemyValue: 90, rewardCap: 25, description: "Impossible odds." }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = difficulties;
} else {
    window.difficulties = difficulties;
}
