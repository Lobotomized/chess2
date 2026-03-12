
// Rogue Like Difficulty Configuration
// Each difficulty defines the enemy army value and potential reward cap.
// The values are flat (not multiplied by level).

const difficulties = [
    { name: "Peasant Revolt", enemyValue: 3, rewardCap: 8, description: "A very small group of weaklings." },
    { name: "Local Militia", enemyValue: 5, rewardCap: 12, description: "Poorly trained but armed." },
    { name: "Scouting Party", enemyValue: 8, rewardCap: 16, description: "A reconnaissance squad." },
    { name: "Bandit Camp", enemyValue: 12, rewardCap: 20, description: "Outlaws looking for trouble." },
    { name: "Guarded Outpost", enemyValue: 16, rewardCap: 24, description: "Lightly fortified position." },
    { name: "Mercenary Band", enemyValue: 20, rewardCap: 28, description: "Soldiers for hire." },
    { name: "Border Patrol", enemyValue: 25, rewardCap: 32, description: "Official army detachment." },
    { name: "Raiding Party", enemyValue: 30, rewardCap: 36, description: "Aggressive attackers." },
    { name: "Fortified Tower", enemyValue: 35, rewardCap: 40, description: "Defensive structure." },
    { name: "Knight's Retinue", enemyValue: 40, rewardCap: 44, description: "Elite bodyguards." },
    { name: "Vanguard Force", enemyValue: 45, rewardCap: 48, description: "The front line of the main army." },
    { name: "Siege Breakers", enemyValue: 50, rewardCap: 52, description: "Heavy hitters." },
    { name: "Royal Guard", enemyValue: 55, rewardCap: 56, description: "The King's personal protection." },
    { name: "Elite Battalion", enemyValue: 60, rewardCap: 60, description: "Veterans of many wars." },
    { name: "General's Command", enemyValue: 65, rewardCap: 64, description: "High value targets." },
    { name: "Warlord's Horde", enemyValue: 70, rewardCap: 68, description: "A massive chaotic force." },
    { name: "Dark Ritual", enemyValue: 80, rewardCap: 72, description: "Something unnatural." },
    { name: "Shadow of death", enemyValue: 90, rewardCap: 76, description: "A dark and foreboding place." },
    { name: "Last Stand", enemyValue: 100, rewardCap: 80, description: "Do or die." },
    { name: "The End", enemyValue: 120, rewardCap: 100, description: "Impossible odds." }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = difficulties;
} else {
    window.difficulties = difficulties;
}
