
// Mock setup
const maxX = 7;
const availableSlots = maxX + 1;

// Test cases
const testCases = [
    {
        name: "Standard case (King + 7 others)",
        roster: ["simpleKingFactory", "rookFactory", "knightFactory", "bishopFactory", "queenFactory", "ghostFactory", "swordsMen", "pikeman"]
    },
    {
        name: "Excess units (King + 10 others)",
        roster: ["simpleKingFactory", "rookFactory", "knightFactory", "bishopFactory", "queenFactory", "ghostFactory", "swordsMen", "pikeman", "juggernautFactory", "ricarFactory", "pigFactory"]
    },
    {
        name: "No King (Should handle gracefully)",
        roster: ["rookFactory", "knightFactory", "bishopFactory", "queenFactory", "ghostFactory", "swordsMen", "pikeman"]
    },
    {
        name: "Only King",
        roster: ["simpleKingFactory"]
    },
    {
        name: "Multiple Kings (Should keep all if possible)",
        roster: ["simpleKingFactory", "kingFactory", "northernKing", "rookFactory", "knightFactory", "bishopFactory", "queenFactory", "ghostFactory", "swordsMen"]
    }
];

testCases.forEach(test => {
    console.log(`\nTesting: ${test.name}`);
    let backline = [...test.roster];
    
    // Logic from rogueLike.js
    const kings = backline.filter(u => u && u.toLowerCase().includes('king'));
    const others = backline.filter(u => u && !u.toLowerCase().includes('king'));

    if (kings.length + others.length > availableSlots) {
        const allowedOthersCount = Math.max(0, availableSlots - kings.length);
        
        // Randomly select which others to keep
        for (let i = others.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [others[i], others[j]] = [others[j], others[i]];
        }
        
        console.log(`Trimming others from ${others.length} to ${allowedOthersCount}`);
        others.splice(allowedOthersCount);
    }

    backline = [...kings, ...others];

    // Shuffle
    for (let i = backline.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [backline[i], backline[j]] = [backline[j], backline[i]];
    }
    
    console.log("Resulting backline:", backline);
    console.log("Length:", backline.length);
    console.log("Has King:", backline.some(u => u.toLowerCase().includes('king')));
    
    if (backline.length > availableSlots) {
        console.error("FAIL: Exceeded available slots!");
    }
    
    if (test.roster.some(u => u.toLowerCase().includes('king')) && !backline.some(u => u.toLowerCase().includes('king'))) {
        console.error("FAIL: King was lost!");
    }
});
