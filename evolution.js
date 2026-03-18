const RACES = ['classic', 'medieval', 'bug', 'promoters', 'cyborgs'];

let characters = [];
let generation = 0;
let isRunning = false;
let worker = null;
let workerTimeout = null;
let wakeLock = null;

async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock acquired to keep PC alive');
        }
    } catch (err) {
        console.error('Wake Lock error:', err);
    }
}

function init() {
    let saved = localStorage.getItem('chess_evolution_cache');
    if (saved) {
        try {
            let data = JSON.parse(saved);
            characters = data.characters || [];
            generation = data.generation || 0;
            
            // Migration for old characters
            characters.forEach(c => {
                if(c.depth === undefined) c.depth = 2;
                if(!c.race) c.race = RACES[Math.floor(Math.random() * RACES.length)];
                // Leave modifiers as undefined if they don't exist to not enforce them
            });
            
        } catch(e) {
            console.error("Could not parse saved data", e);
        }
    }
    
    if (characters.length < 10) {
        while (characters.length < 10) {
            characters.push(generateRandomCharacter());
        }
        saveData();
    }
    
    updateUI();
}

function generateRandomCharacter() {
    let char = {
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        race: RACES[Math.floor(Math.random() * RACES.length)],
        depth: Math.floor(Math.random() * 2) + 2, // 2 or 3 for rapid play
        algorithm: ['minimaxDeep', 'minimaxAlphaBeta'][Math.floor(Math.random() * 2)],
        score: 1000,
        gamesPlayed: 0
    };
    
    if (Math.random() > 0.2) char.posValueWeight = Math.random() * 0.5;
    if (Math.random() > 0.1) char.pieceValueWeight = 0.5 + Math.random() * 2;
    if (Math.random() > 0.3) char.kingTropismWeight = Math.random() * 0.5;
    if (Math.random() > 0.3) char.defendedWeight = Math.random() * 0.3;
    if (Math.random() > 0.4) {
        char.kingVulnAttackWeight = Math.random() * 2;
        char.kingVulnProxWeight = Math.random() * 0.5;
    }

    if (Math.random() > 0.7) {
        char.useRemoveAttacked = true;
        char.raRandomException = Math.random() * 0.5;
        if(Math.random() > 0.5) char.raExceptionPieceValue = true; // allow high value piece exception
        if(Math.random() > 0.5) char.raExceptionPieceValueSmaller = true;
    }
    if (Math.random() > 0.8) {
        char.useRemoveNonAttacking = true;
        char.rnaMaxPieceValue = Math.floor(Math.random() * 3) + 1;
        if(Math.random() > 0.5) char.rnaExceptionRandom = Math.random() * 0.5;
        if(Math.random() > 0.5) char.rnaExceptionPieceValue = true;
        if(Math.random() > 0.5) char.rnaExceptionPieceValueSmaller = true;
    }
    if (Math.random() > 0.9) {
        char.useRandomlyRemove = true;
        char.rrN = Math.floor(Math.random() * 4) + 2;
        if(Math.random() > 0.5) char.rrExceptionAttacked = true;
        if(Math.random() > 0.5) char.rrExceptionPieceValueSmaller = true;
        if(Math.random() > 0.5) char.rrExceptionRandom = Math.random() * 0.5;
    }
    if (Math.random() > 0.8) {
        char.useMaxMoves = true;
        char.mmMax = Math.floor(Math.random() * 3) + 1; // 1 to 3
        if(Math.random() > 0.5) char.mmExceptionAttacked = true;
    }
    if (Math.random() > 0.9) {
        char.useNthChance = true;
        char.nthChance = Math.random() * 0.5; // 0 to 50% chance
        if(Math.random() > 0.5) char.ncExceptionAttacked = true;
        if(Math.random() > 0.5) char.ncExceptionPieceValue = true;
    }
    if (Math.random() > 0.8) {
        char.useRemoveWellPositioned = true;
        char.rwpN = Math.floor(Math.random() * 5) + 2; // 2 to 6
        if(Math.random() > 0.5) char.rwpExceptionAttacked = true;
    }

    return char;
}

function saveData() {
    localStorage.setItem('chess_evolution_cache', JSON.stringify({
        characters: characters,
        generation: generation
    }));
}

let selectedBotId = null;

function playAgainst(charId) {
    selectedBotId = charId;
    let modal = document.getElementById('raceSelectionModal');
    let select = document.getElementById('playerRaceSelect');
    
    select.innerHTML = '';
    RACES.forEach(r => {
        let opt = document.createElement('option');
        opt.value = r;
        opt.innerText = r.charAt(0).toUpperCase() + r.slice(1);
        select.appendChild(opt);
    });
    
    modal.style.display = 'flex';
}

function saveBotToDb(charId) {
    let char = characters.find(c => c.id === charId);
    if(!char) return;
    
    let name = prompt("Enter a name for this bot:", `Bot-${char.id}`);
    if(!name) return;
    
    char.name = name;
    
    fetch('/bots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(char)
    })
    .then(response => response.json())
    .then(data => {
        alert(`Bot ${name} saved to Hall of Fame!`);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to save bot.');
    });
}

function closeRaceModal() {
    document.getElementById('raceSelectionModal').style.display = 'none';
    selectedBotId = null;
}

function confirmPlay() {
    if(!selectedBotId) return;
    
    let char = characters.find(c => c.id === selectedBotId);
    if(!char) return;
    
    let playerRace = document.getElementById('playerRaceSelect').value;
    
    localStorage.setItem('chess_evolution_custom_ai', JSON.stringify(char));
    
    let url = `/hotseat?whiteRace=${playerRace}&blackRace=${char.race || 'classic'}&AIColor=black&AIPowerBlack=customEvolution&gameType=raceChoiceChess&starts=whiteStarts`;
    window.open(url, '_blank');
    
    closeRaceModal();
}

function toggleEvolution() {
    isRunning = !isRunning;
    document.getElementById('toggleBtn').innerText = isRunning ? 'Stop Evolution' : 'Start Evolution';
    if (isRunning) {
        requestWakeLock();
        runMatch();
    } else {
        if (wakeLock !== null) {
            wakeLock.release();
            wakeLock = null;
        }
        if (worker) {
            worker.terminate();
            worker = null;
        }
        if (workerTimeout) clearTimeout(workerTimeout);
        document.getElementById('status').innerText = 'Evolution stopped.';
    }
}

function runMatch() {
    if (!isRunning) return;
    
    let idx1 = Math.floor(Math.random() * characters.length);
    let idx2 = Math.floor(Math.random() * characters.length);
    while (idx1 === idx2) {
        idx2 = Math.floor(Math.random() * characters.length);
    }
    
    let charWhite = characters[idx1];
    let charBlack = characters[idx2];
    
    let whiteRace = charWhite.race || RACES[Math.floor(Math.random() * RACES.length)];
    let blackRace = charBlack.race || RACES[Math.floor(Math.random() * RACES.length)];
    
    document.getElementById('status').innerText = `Gen ${generation}: ${charWhite.id} (${whiteRace}) VS ${charBlack.id} (${blackRace}) ...`;
    
    worker = new Worker('evolutionWorker.js');
    worker.postMessage(JSONfn.stringify({
        charWhite: charWhite,
        charBlack: charBlack,
        whiteRace: whiteRace,
        blackRace: blackRace
    }));
    
    let thinkingColor = 'white';

    worker.onmessage = function(e) {
        let msg = JSONfn.parse(e.data);
        
        if (msg.type === 'thinking') {
            thinkingColor = msg.color;
            if (workerTimeout) clearTimeout(workerTimeout);
            
            // 60 seconds per move limit check from main thread
            workerTimeout = setTimeout(() => {
                if (worker) {
                    console.log(`Worker timeout! ${thinkingColor} took more than 60s.`);
                    worker.terminate();
                    worker = null;
                    
                    let result = {
                        winner: thinkingColor === 'white' ? 'black' : 'white',
                        turns: msg.turns || 0
                    };
                    handleMatchResult(charWhite, charBlack, result);
                }
            }, 60000);
            return;
        }
        
        if (msg.type === 'result') {
            if (workerTimeout) clearTimeout(workerTimeout);
            handleMatchResult(charWhite, charBlack, msg);
        }
    };
    
    worker.onerror = function(err) {
        console.error("Worker error: ", err.message);
        worker.terminate();
        worker = null;
        if (workerTimeout) clearTimeout(workerTimeout);
        if(isRunning) setTimeout(runMatch, 1000);
    };
}

function handleMatchResult(charWhite, charBlack, result) {
    charWhite.gamesPlayed++;
    charBlack.gamesPlayed++;
    
    let k = 32;
    let expectedWhite = 1 / (1 + Math.pow(10, (charBlack.score - charWhite.score) / 400));
    let expectedBlack = 1 / (1 + Math.pow(10, (charWhite.score - charBlack.score) / 400));
    
    let actualWhite = result.winner === 'white' ? 1 : (result.winner === 'tie' ? 0.5 : 0);
    let actualBlack = result.winner === 'black' ? 1 : (result.winner === 'tie' ? 0.5 : 0);
    
    charWhite.score += k * (actualWhite - expectedWhite);
    charBlack.score += k * (actualBlack - expectedBlack);

    // Kill bots that fall below 980 ELO and replace them with completely new random bots
    let killed = false;
    for (let i = characters.length - 1; i >= 0; i--) {
        if (characters[i].score < 980) {
            console.log(`Bot ${characters[i].id} fell below 980 ELO and was eliminated!`);
            characters.splice(i, 1);
            characters.push(generateRandomCharacter());
            killed = true;
        }
    }
    
    let totalGames = characters.reduce((sum, c) => sum + c.gamesPlayed, 0);
    if (totalGames % 20 === 0 && totalGames > 0 && !killed) {
        evolve();
    }
    
    saveData();
    updateUI();
    
    if (worker) {
        worker.terminate();
        worker = null;
    }
    
    if (isRunning) setTimeout(runMatch, 100);
}

function evolve() {
    generation++;
    characters.sort((a, b) => b.score - a.score);
    characters.pop();
    characters.pop();
    
    let parent1 = characters[0];
    let parent2 = characters[1];
    
    characters.push(crossover(parent1, parent2));
    characters.push(crossover(parent2, parent1));
    
    document.getElementById('status').innerText = `Evolution occurred! Gen ${generation} begins.`;
}

function crossover(p1, p2) {
    let child = {
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        race: Math.random() > 0.5 ? p1.race : p2.race,
        depth: Math.random() > 0.5 ? p1.depth : p2.depth,
        algorithm: Math.random() > 0.5 ? p1.algorithm : p2.algorithm,
        score: 1000,
        gamesPlayed: 0
    };

    if (!child.race) child.race = RACES[Math.floor(Math.random() * RACES.length)];

    // Make sure old characters getting crossed over receive an algorithm if missing
    if (!child.algorithm) {
        child.algorithm = ['minimaxDeep', 'minimaxAlphaBeta'][Math.floor(Math.random() * 2)];
    }

    if (p1.posValueWeight !== undefined || p2.posValueWeight !== undefined) {
        let w1 = p1.posValueWeight !== undefined ? p1.posValueWeight : 0;
        let w2 = p2.posValueWeight !== undefined ? p2.posValueWeight : 0;
        child.posValueWeight = Math.max(0, (w1 + w2) / 2 + (Math.random() * 0.1 - 0.05));
    }
    if (p1.pieceValueWeight !== undefined || p2.pieceValueWeight !== undefined) {
        let w1 = p1.pieceValueWeight !== undefined ? p1.pieceValueWeight : 1;
        let w2 = p2.pieceValueWeight !== undefined ? p2.pieceValueWeight : 1;
        child.pieceValueWeight = Math.max(0, (w1 + w2) / 2 + (Math.random() * 0.2 - 0.1));
    }
    if (p1.kingTropismWeight !== undefined || p2.kingTropismWeight !== undefined) {
        let w1 = p1.kingTropismWeight !== undefined ? p1.kingTropismWeight : 0;
        let w2 = p2.kingTropismWeight !== undefined ? p2.kingTropismWeight : 0;
        child.kingTropismWeight = Math.max(0, (w1 + w2) / 2 + (Math.random() * 0.1 - 0.05));
    }
    if (p1.defendedWeight !== undefined || p2.defendedWeight !== undefined) {
        let w1 = p1.defendedWeight !== undefined ? p1.defendedWeight : 0;
        let w2 = p2.defendedWeight !== undefined ? p2.defendedWeight : 0;
        child.defendedWeight = Math.max(0, (w1 + w2) / 2 + (Math.random() * 0.1 - 0.05));
    }
    if (p1.kingVulnAttackWeight !== undefined || p2.kingVulnAttackWeight !== undefined) {
        let w1 = p1.kingVulnAttackWeight !== undefined ? p1.kingVulnAttackWeight : 0;
        let w2 = p2.kingVulnAttackWeight !== undefined ? p2.kingVulnAttackWeight : 0;
        child.kingVulnAttackWeight = Math.max(0, (w1 + w2) / 2 + (Math.random() * 0.5 - 0.25));
        
        let p_w1 = p1.kingVulnProxWeight !== undefined ? p1.kingVulnProxWeight : 0;
        let p_w2 = p2.kingVulnProxWeight !== undefined ? p2.kingVulnProxWeight : 0;
        child.kingVulnProxWeight = Math.max(0, (p_w1 + p_w2) / 2 + (Math.random() * 0.1 - 0.05));
    }

    child.useRemoveAttacked = Math.random() > 0.5 ? p1.useRemoveAttacked : p2.useRemoveAttacked;
    if (child.useRemoveAttacked) {
        let e1 = p1.raRandomException !== undefined ? p1.raRandomException : 0.1;
        let e2 = p2.raRandomException !== undefined ? p2.raRandomException : 0.1;
        child.raRandomException = Math.max(0, Math.min(1, (e1 + e2) / 2 + (Math.random() * 0.1 - 0.05)));
        child.raExceptionPieceValue = Math.random() > 0.5 ? p1.raExceptionPieceValue : p2.raExceptionPieceValue;
        child.raExceptionPieceValueSmaller = Math.random() > 0.5 ? p1.raExceptionPieceValueSmaller : p2.raExceptionPieceValueSmaller;
    }

    child.useRemoveNonAttacking = Math.random() > 0.5 ? p1.useRemoveNonAttacking : p2.useRemoveNonAttacking;
    if (child.useRemoveNonAttacking) {
        let m1 = p1.rnaMaxPieceValue !== undefined ? p1.rnaMaxPieceValue : 2;
        let m2 = p2.rnaMaxPieceValue !== undefined ? p2.rnaMaxPieceValue : 2;
        child.rnaMaxPieceValue = Math.max(1, Math.round((m1 + m2) / 2 + (Math.random() * 2 - 1)));
        
        if (p1.rnaExceptionRandom !== undefined || p2.rnaExceptionRandom !== undefined) {
            let e1 = p1.rnaExceptionRandom !== undefined ? p1.rnaExceptionRandom : 0.1;
            let e2 = p2.rnaExceptionRandom !== undefined ? p2.rnaExceptionRandom : 0.1;
            child.rnaExceptionRandom = Math.max(0, Math.min(1, (e1 + e2) / 2 + (Math.random() * 0.1 - 0.05)));
        }
        child.rnaExceptionPieceValue = Math.random() > 0.5 ? p1.rnaExceptionPieceValue : p2.rnaExceptionPieceValue;
        child.rnaExceptionPieceValueSmaller = Math.random() > 0.5 ? p1.rnaExceptionPieceValueSmaller : p2.rnaExceptionPieceValueSmaller;
    }

    child.useRandomlyRemove = Math.random() > 0.5 ? p1.useRandomlyRemove : p2.useRandomlyRemove;
    if (child.useRandomlyRemove) {
        let n1 = p1.rrN !== undefined ? p1.rrN : 2;
        let n2 = p2.rrN !== undefined ? p2.rrN : 2;
        child.rrN = Math.max(1, Math.round((n1 + n2) / 2 + (Math.random() * 2 - 1)));
        child.rrExceptionAttacked = Math.random() > 0.5 ? p1.rrExceptionAttacked : p2.rrExceptionAttacked;
        child.rrExceptionPieceValueSmaller = Math.random() > 0.5 ? p1.rrExceptionPieceValueSmaller : p2.rrExceptionPieceValueSmaller;
        
        if (p1.rrExceptionRandom !== undefined || p2.rrExceptionRandom !== undefined) {
            let e1 = p1.rrExceptionRandom !== undefined ? p1.rrExceptionRandom : 0.1;
            let e2 = p2.rrExceptionRandom !== undefined ? p2.rrExceptionRandom : 0.1;
            child.rrExceptionRandom = Math.max(0, Math.min(1, (e1 + e2) / 2 + (Math.random() * 0.1 - 0.05)));
        }
    }

    child.useMaxMoves = Math.random() > 0.5 ? p1.useMaxMoves : p2.useMaxMoves;
    if (child.useMaxMoves) {
        let m1 = p1.mmMax !== undefined ? p1.mmMax : 2;
        let m2 = p2.mmMax !== undefined ? p2.mmMax : 2;
        child.mmMax = Math.max(1, Math.round((m1 + m2) / 2 + (Math.random() * 2 - 1)));
        child.mmExceptionAttacked = Math.random() > 0.5 ? p1.mmExceptionAttacked : p2.mmExceptionAttacked;
    }

    child.useNthChance = Math.random() > 0.5 ? p1.useNthChance : p2.useNthChance;
    if (child.useNthChance) {
        let c1 = p1.nthChance !== undefined ? p1.nthChance : 0.1;
        let c2 = p2.nthChance !== undefined ? p2.nthChance : 0.1;
        child.nthChance = Math.max(0, Math.min(1, (c1 + c2) / 2 + (Math.random() * 0.1 - 0.05)));
        child.ncExceptionAttacked = Math.random() > 0.5 ? p1.ncExceptionAttacked : p2.ncExceptionAttacked;
        child.ncExceptionPieceValue = Math.random() > 0.5 ? p1.ncExceptionPieceValue : p2.ncExceptionPieceValue;
    }

    child.useRemoveWellPositioned = Math.random() > 0.5 ? p1.useRemoveWellPositioned : p2.useRemoveWellPositioned;
    if (child.useRemoveWellPositioned) {
        let n1 = p1.rwpN !== undefined ? p1.rwpN : 3;
        let n2 = p2.rwpN !== undefined ? p2.rwpN : 3;
        child.rwpN = Math.max(1, Math.round((n1 + n2) / 2 + (Math.random() * 2 - 1)));
        child.rwpExceptionAttacked = Math.random() > 0.5 ? p1.rwpExceptionAttacked : p2.rwpExceptionAttacked;
    }

    if (Math.random() < 0.1) {
        child.depth = Math.floor(Math.random() * 2) + 2;
    }
    if (Math.random() < 0.1) {
        child.algorithm = ['minimaxDeep', 'minimaxAlphaBeta'][Math.floor(Math.random() * 2)];
    }
    if (Math.random() < 0.1) {
        child.race = RACES[Math.floor(Math.random() * RACES.length)];
    }
    
    // Mutation: randomly drop modifiers
    if (Math.random() < 0.05) delete child.posValueWeight;
    if (Math.random() < 0.05) delete child.kingTropismWeight;
    if (Math.random() < 0.05) delete child.defendedWeight;
    if (Math.random() < 0.05) { delete child.kingVulnAttackWeight; delete child.kingVulnProxWeight; }
    if (Math.random() < 0.05) child.useRemoveAttacked = false;

    return child;
}

function updateUI() {
    let displayChars = [...characters].sort((a, b) => b.score - a.score);
    
    let tbody = document.getElementById('leaderboard');
    tbody.innerHTML = '';
    displayChars.forEach((c, i) => {
        let filtersHtml = '';
        if(c.useRemoveAttacked) {
            let excStr = `exc:${c.raRandomException !== undefined ? c.raRandomException.toFixed(2) : '0.10'}`;
            if(c.raExceptionPieceValue) excStr += `,pV`;
            if(c.raExceptionPieceValueSmaller) excStr += `,pVS`;
            filtersHtml += `<span class="filter-tag filter-ra" title="Remove Attacked">RA (${excStr})</span>`;
        }
        if(c.useRemoveNonAttacking) {
            let excStr = `maxV:${c.rnaMaxPieceValue || 2}`;
            if(c.rnaExceptionRandom) excStr += `,rnd`;
            if(c.rnaExceptionPieceValue) excStr += `,pV`;
            if(c.rnaExceptionPieceValueSmaller) excStr += `,pVS`;
            filtersHtml += `<span class="filter-tag filter-rna" title="Remove Non-Attacking">RNA (${excStr})</span>`;
        }
        if(c.useRandomlyRemove) {
            let excStr = `n:${c.rrN || 2}`;
            if(c.rrExceptionAttacked) excStr += `,att`;
            if(c.rrExceptionPieceValueSmaller) excStr += `,pVS`;
            if(c.rrExceptionRandom) excStr += `,rnd`;
            filtersHtml += `<span class="filter-tag filter-rr" title="Random Remove">RR (${excStr})</span>`;
        }
        if(c.useMaxMoves) {
            let excStr = `max:${c.mmMax || 2}`;
            if(c.mmExceptionAttacked) excStr += `,att`;
            filtersHtml += `<span class="filter-tag" style="background-color: #f7a072;" title="Max Moves">MM (${excStr})</span>`;
        }
        if(c.useNthChance) {
            let excStr = `${c.nthChance !== undefined ? c.nthChance.toFixed(2) : '0.10'}`;
            if(c.ncExceptionAttacked) excStr += `,att`;
            if(c.ncExceptionPieceValue) excStr += `,pV`;
            filtersHtml += `<span class="filter-tag" style="background-color: #b5838d;" title="Nth Chance to Remove">NC (${excStr})</span>`;
        }
        if(c.useRemoveWellPositioned) {
            let excStr = `n:${c.rwpN || 3}`;
            if(c.rwpExceptionAttacked) excStr += `,att`;
            filtersHtml += `<span class="filter-tag" style="background-color: #e5989b;" title="Remove Well Positioned">RWP (${excStr})</span>`;
        }
        
        let kvStr = '-';
        if (c.kingVulnAttackWeight !== undefined) {
            kvStr = `${c.kingVulnAttackWeight.toFixed(2)}/${c.kingVulnProxWeight.toFixed(2)}`;
        }
        
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${c.id}</td>
            <td>${c.race || '-'}</td>
            <td>${Math.round(c.score)}</td>
            <td>${c.gamesPlayed}</td>
            <td>${c.algorithm === 'minimaxDeep' ? 'Deep' : 'AB'}</td>
            <td>${c.depth}</td>
            <td>${c.pieceValueWeight !== undefined ? c.pieceValueWeight.toFixed(2) : '-'}</td>
            <td>${c.posValueWeight !== undefined ? c.posValueWeight.toFixed(2) : '-'}</td>
            <td>${c.kingTropismWeight !== undefined ? c.kingTropismWeight.toFixed(2) : '-'}</td>
            <td>${c.defendedWeight !== undefined ? c.defendedWeight.toFixed(2) : '-'}</td>
            <td>${kvStr}</td>
            <td>${filtersHtml}</td>
            <td>
                <button style="padding: 5px 10px; font-size: 12px;" onclick="playAgainst('${c.id}')">Play</button>
                <button style="padding: 5px 10px; font-size: 12px; background:#e5989b;" onclick="saveBotToDb('${c.id}')">Save</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.onload = init;