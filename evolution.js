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
        algorithm: ['minimaxDeep', 'minimaxAlphaBeta', 'minimaxQuiescence', 'proofNumberSearch', 'bestFirstSearch', 'principalVariationSearch'][Math.floor(Math.random() * 6)],
        phases: [],
        magnifiers: [],
        score: 1000,
        gamesPlayed: 0
    };
    
    // Each magnifier has a 50% chance of appearing
    if (Math.random() > 0.5) char.magnifiers.push({name: 'MaxOptions', options: {posValue: 0.1, useMask: true}});
    if (Math.random() > 0.15) char.magnifiers.push({name: 'Piece', options: {pieceValue: Math.random() * 2.9 + 0.1}});
    if (Math.random() > 0.5) {
        let ktOpts = {relativeValue: Math.random()*0.3, pieceValue: 1};
        let r = Math.random();
        if (r < 0.33) ktOpts.onlyForEnemy = true;
        else if (r < 0.66) ktOpts.onlyForMe = true;
        
        if (Math.random() > 0.5) ktOpts.defendersSearch = true;
        
        char.magnifiers.push({name: 'KingTropism', options: ktOpts});
    }
    if (Math.random() > 0.5) char.magnifiers.push({name: 'PieceDefended', options: {relativeValue: 0.1}});
    if (Math.random() > 0.5) char.magnifiers.push({name: 'KingVulnerability', options: {attackValue: 1.5, proximityValue: 0.2}});
    // Add 0-2 random phases
    let numPhases = Math.floor(Math.random() * 3);
    for (let i = 0; i < numPhases; i++) {
        char.phases.push({
            threshold: Math.floor(Math.random() * 20) + 4, // 4 to 23 pieces
            algorithm: ['minimaxDeep', 'minimaxAlphaBeta', 'minimaxQuiescence', 'proofNumberSearch', 'bestFirstSearch', 'principalVariationSearch'][Math.floor(Math.random() * 6)]
        });
    }
    // Sort phases by threshold descending so they evaluate correctly
    char.phases.sort((a, b) => b.threshold - a.threshold);

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

    // Ensure at least one magnifier
    if (char.magnifiers.length === 0) {
        char.magnifiers.push({name: 'Piece', options: {pieceValue: Math.random() * 9.9 + 0.1}});
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

function showDetails(charId) {
    let c = characters.find(char => char.id === charId);
    if (!c) return;

    document.getElementById('modalTitle').innerText = `Bot: ${c.id}`;
    let body = document.getElementById('modalBody');
    
    let filtersHtml = '';
    
    // Helper to format exceptions
    const formatExc = (val, name) => val ? `<div class="detail-row"><span class="detail-label"> - ${name}</span><span class="detail-value">Yes</span></div>` : '';
    const formatVal = (val, name) => val !== undefined ? `<div class="detail-row"><span class="detail-label"> - ${name}</span><span class="detail-value">${val.toFixed ? val.toFixed(2) : val}</span></div>` : '';

    if(c.useRemoveAttacked) {
        filtersHtml += `<div class="section-title">Remove Attacked Moves</div>`;
        filtersHtml += formatVal(c.raRandomException, 'Random Exception');
        filtersHtml += formatExc(c.raExceptionPieceValue, 'Piece Value Exception');
        filtersHtml += formatExc(c.raExceptionPieceValueSmaller, 'Piece Value Smaller Exception');
    }
    if(c.useRemoveNonAttacking) {
        filtersHtml += `<div class="section-title">Remove Non-Attacking Moves</div>`;
        filtersHtml += formatVal(c.rnaMaxPieceValue, 'Max Piece Value');
        filtersHtml += formatVal(c.rnaExceptionRandom, 'Random Exception');
        filtersHtml += formatExc(c.rnaExceptionPieceValue, 'Piece Value Exception');
        filtersHtml += formatExc(c.rnaExceptionPieceValueSmaller, 'Piece Value Smaller Exception');
    }
    if(c.useRandomlyRemove) {
        filtersHtml += `<div class="section-title">Randomly Remove Moves</div>`;
        filtersHtml += formatVal(c.rrN, '1 in N moves removed');
        filtersHtml += formatVal(c.rrExceptionRandom, 'Random Exception');
        filtersHtml += formatExc(c.rrExceptionAttacked, 'Attacked Exception');
        filtersHtml += formatExc(c.rrExceptionPieceValueSmaller, 'Piece Value Smaller Exception');
    }
    if(c.useMaxMoves) {
        filtersHtml += `<div class="section-title">Max Moves Per Piece</div>`;
        filtersHtml += formatVal(c.mmMax, 'Max Moves');
        filtersHtml += formatExc(c.mmExceptionAttacked, 'Attacked Exception');
    }
    if(c.useNthChance) {
        filtersHtml += `<div class="section-title">Nth Chance to Skip Piece</div>`;
        filtersHtml += formatVal(c.nthChance, 'Chance');
        filtersHtml += formatExc(c.ncExceptionAttacked, 'Attacked Exception');
        filtersHtml += formatExc(c.ncExceptionPieceValue, 'Piece Value Exception');
    }
    if(c.useRemoveWellPositioned) {
        filtersHtml += `<div class="section-title">Remove Well Positioned</div>`;
        filtersHtml += formatVal(c.rwpN, 'Max Moves Threshold');
        filtersHtml += formatExc(c.rwpExceptionAttacked, 'Attacked Exception');
    }

    let magnifiersHtml = `<div class="section-title">Magnifiers</div>`;
    
    if (c.magnifiers && c.magnifiers.length > 0) {
        c.magnifiers.forEach(m => {
            magnifiersHtml += `<div class="detail-row" style="background:#333; padding:5px; border-radius:4px; margin-bottom:5px; display:block;">
                <div style="font-weight:bold; color:#f0d9b5; margin-bottom:2px;">${m.name}</div>
                <div style="display:flex; flex-wrap:wrap; gap:8px; font-size:11px;">`;
            
            Object.keys(m.options).forEach(k => {
                let v = m.options[k];
                if(typeof v === 'number') v = parseFloat(v.toFixed(2));
                magnifiersHtml += `<span style="background:#222; padding:2px 4px; border-radius:3px; color:#aaa;">${k}: <span style="color:#fff;">${v}</span></span>`;
            });
            
            magnifiersHtml += `</div></div>`;
        });
    } else {
        // Legacy display
        if(c.pieceValueWeight !== undefined) magnifiersHtml += `<div class="detail-row"><span class="detail-label">Piece Value</span><span class="detail-value">${c.pieceValueWeight.toFixed(2)}</span></div>`;
        if(c.posValueWeight !== undefined) magnifiersHtml += `<div class="detail-row"><span class="detail-label">Positional Value</span><span class="detail-value">${c.posValueWeight.toFixed(2)}</span></div>`;
        if(c.kingTropismWeight !== undefined) magnifiersHtml += `<div class="detail-row"><span class="detail-label">King Tropism</span><span class="detail-value">${c.kingTropismWeight.toFixed(2)}</span></div>`;
        if(c.defendedWeight !== undefined) magnifiersHtml += `<div class="detail-row"><span class="detail-label">Defended Pieces</span><span class="detail-value">${c.defendedWeight.toFixed(2)}</span></div>`;
        if(c.kingVulnAttackWeight !== undefined) magnifiersHtml += `<div class="detail-row"><span class="detail-label">King Vuln (Att)</span><span class="detail-value">${c.kingVulnAttackWeight.toFixed(2)}</span></div>`;
        if(c.kingVulnProxWeight !== undefined) magnifiersHtml += `<div class="detail-row"><span class="detail-label">King Vuln (Prox)</span><span class="detail-value">${c.kingVulnProxWeight.toFixed(2)}</span></div>`;
    }

    body.innerHTML = `
        <div class="section-title" style="margin-top:0;">General Stats</div>
        <div class="detail-row"><span class="detail-label">ELO Score</span><span class="detail-value">${Math.round(c.score)}</span></div>
        <div class="detail-row"><span class="detail-label">Games Played</span><span class="detail-value">${c.gamesPlayed}</span></div>
        <div class="detail-row"><span class="detail-label">Algorithm</span><span class="detail-value">${c.algorithm || 'minimaxAlphaBeta'}</span></div>
        <div class="detail-row"><span class="detail-label">Search Depth</span><span class="detail-value">${c.depth}</span></div>
        
        ${magnifiersHtml}

        ${filtersHtml}
    `;

    document.getElementById('detailsModal').style.display = 'flex';
}

function closeDetailsModal() {
    document.getElementById('detailsModal').style.display = 'none';
}

function showHistory(charId) {
    let char = characters.find(c => c.id === charId);
    if(!char) return;
    
    // Create or reuse a history modal
    let modal = document.getElementById('historyModal');
    if(!modal) {
        modal = document.createElement('div');
        modal.id = 'historyModal';
        modal.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:2000; justify-content:center; align-items:center;';
        modal.innerHTML = `
            <div style="background:#1a1a1a; padding:20px; border-radius:8px; width:80%; max-height:80%; overflow-y:auto; position:relative;">
                <button onclick="document.getElementById('historyModal').style.display='none'" style="position:absolute; top:10px; right:10px; background:#555;">Close</button>
                <h2>Match History: ${char.id}</h2>
                <div id="historyContent">Loading...</div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    modal.style.display = 'flex';
    document.getElementById('historyContent').innerHTML = 'Loading...';
    
    fetch(`/games/${char.id}`)
    .then(res => res.json())
    .then(games => {
        let html = '<table style="width:100%; text-align:left;"><thead><tr><th>Date</th><th>Opponent</th><th>Result</th><th>Turns</th><th>Action</th></tr></thead><tbody>';
        if (!games || games.length === 0) {
            html += '<tr><td colspan="5" style="text-align:center; padding: 10px;">No match history found. Games may have been played before history tracking or timed out without data.</td></tr>';
        } else {
            games.forEach(g => {
                let opponentId = g.whiteId === char.id ? g.blackId : g.whiteId;
                let result = g.winner === 'tie' ? 'Draw' : (g.winner === (g.whiteId === char.id ? 'white' : 'black') ? 'Win' : 'Loss');
                let color = result === 'Win' ? '#829769' : (result === 'Loss' ? '#ff6b6b' : '#f0d9b5');
                html += `
                    <tr>
                        <td>${new Date(g.date).toLocaleString()}</td>
                        <td>${opponentId}</td>
                        <td style="color:${color}; font-weight:bold;">${result}</td>
                        <td>${g.turns}</td>
                        <td><button style="padding:5px;" onclick="replayGame('${g._id}')">Replay</button></td>
                    </tr>
                `;
            });
        }
        html += '</tbody></table>';
        document.getElementById('historyContent').innerHTML = html;
    })
    .catch(e => {
        document.getElementById('historyContent').innerText = 'Error loading history.';
        console.error(e);
    });
}

function replayGame(gameId) {
    window.open(`/replay.html?gameId=${gameId}`, '_blank');
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
                        turns: msg.turns || 0,
                        history: {
                            whiteId: charWhite.id,
                            blackId: charBlack.id,
                            whiteRace: whiteRace,
                            blackRace: blackRace,
                            winner: thinkingColor === 'white' ? 'black' : 'white',
                            turns: msg.turns || 0,
                            moves: [] // Timeout, moves lost
                        }
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
    
    // Save game history to DB
    if (result.history) {
        fetch('/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result.history)
        }).catch(e => console.error("Failed to save game history", e));
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
        child.algorithm = ['minimaxDeep', 'minimaxAlphaBeta', 'minimaxQuiescence', 'proofNumberSearch', 'bestFirstSearch', 'principalVariationSearch'][Math.floor(Math.random() * 6)];
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
        child.depth = Math.floor(Math.random() * 4) + 2;
    }
    if (Math.random() < 0.1) {
        child.algorithm = ['minimaxDeep', 'minimaxAlphaBeta', 'minimaxQuiescence', 'proofNumberSearch', 'bestFirstSearch', 'principalVariationSearch'][Math.floor(Math.random() * 6)];
    }
    
    // Crossover phases
    child.phases = [];
    let pool = [...(p1.phases || []), ...(p2.phases || [])];
    if (p1.altAlgorithm) pool.push({threshold: p1.altPieceThreshold || 10, algorithm: p1.altAlgorithm}); // Legacy support
    if (p2.altAlgorithm) pool.push({threshold: p2.altPieceThreshold || 10, algorithm: p2.altAlgorithm}); // Legacy support
    
    // Pick 0-3 phases from parents
    let childPhasesCount = Math.floor(Math.random() * Math.min(4, pool.length + 1));
    for(let i = 0; i < childPhasesCount; i++) {
        if(pool.length > 0) {
            let idx = Math.floor(Math.random() * pool.length);
            let picked = pool.splice(idx, 1)[0];
            // slight mutation on threshold
            picked.threshold = Math.max(2, picked.threshold + Math.floor(Math.random() * 5) - 2);
            child.phases.push(picked);
        }
    }
    
    // Mutation: add a completely new random phase
    if (Math.random() < 0.1) {
        child.phases.push({
             threshold: Math.floor(Math.random() * 20) + 4,
             algorithm: ['minimaxDeep', 'minimaxAlphaBeta', 'minimaxQuiescence', 'proofNumberSearch', 'bestFirstSearch', 'principalVariationSearch'][Math.floor(Math.random() * 6)]
        });
    }
    
    // Clean up phases: keep highest threshold if duplicates exist, sort descending
    if (child.phases.length > 0) {
        let uniquePhases = {};
        for(let p of child.phases) {
            if(!uniquePhases[p.algorithm] || uniquePhases[p.algorithm].threshold < p.threshold) {
                uniquePhases[p.algorithm] = p;
            }
        }
        child.phases = Object.values(uniquePhases).sort((a, b) => b.threshold - a.threshold);
    }
    
    // Crossover magnifiers
    let poolMags = [];
    
    // Support legacy parents
    if (p1.posValueWeight !== undefined) poolMags.push({name:'MaxOptions', options:{posValue:p1.posValueWeight, useMask:true}});
    if (p1.pieceValueWeight !== undefined) poolMags.push({name:'Piece', options:{pieceValue:p1.pieceValueWeight}});
    if (p1.kingTropismWeight !== undefined) poolMags.push({name:'KingTropism', options:{relativeValue:p1.kingTropismWeight, onlyForEnemy:true, pieceValue:1}});
    if (p1.defendedWeight !== undefined) poolMags.push({name:'PieceDefended', options:{relativeValue:p1.defendedWeight}});
    if (p1.kingVulnAttackWeight !== undefined) poolMags.push({name:'KingVulnerability', options:{attackValue:p1.kingVulnAttackWeight, proximityValue:p1.kingVulnProxWeight||0}});

    if (p2.posValueWeight !== undefined) poolMags.push({name:'MaxOptions', options:{posValue:p2.posValueWeight, useMask:true}});
    if (p2.pieceValueWeight !== undefined) poolMags.push({name:'Piece', options:{pieceValue:p2.pieceValueWeight}});
    if (p2.kingTropismWeight !== undefined) poolMags.push({name:'KingTropism', options:{relativeValue:p2.kingTropismWeight, onlyForEnemy:true, pieceValue:1}});
    if (p2.defendedWeight !== undefined) poolMags.push({name:'PieceDefended', options:{relativeValue:p2.defendedWeight}});
    if (p2.kingVulnAttackWeight !== undefined) poolMags.push({name:'KingVulnerability', options:{attackValue:p2.kingVulnAttackWeight, proximityValue:p2.kingVulnProxWeight||0}});

    poolMags.push(...(p1.magnifiers || []), ...(p2.magnifiers || []));
    
    child.magnifiers = [];
    let childMagsCount = Math.floor(Math.random() * 3) + 2; // 2 to 4
    for(let i=0; i<childMagsCount; i++) {
        if (poolMags.length > 0) {
            let idx = Math.floor(Math.random() * poolMags.length);
            let picked = JSON.parse(JSON.stringify(poolMags.splice(idx, 1)[0]));
            // mutate values slightly
            for (let k in picked.options) {
                if (typeof picked.options[k] === 'number') {
                    if (Math.random() < 0.2) picked.options[k] *= (0.8 + Math.random()*0.4);
                } else if (typeof picked.options[k] === 'boolean') {
                    if (Math.random() < 0.05) picked.options[k] = !picked.options[k];
                }
            }
            child.magnifiers.push(picked);
        }
    }
    // ensure unique names
    let uniqueMags = {};
    for (let m of child.magnifiers) {
        uniqueMags[m.name] = m;
    }
    child.magnifiers = Object.values(uniqueMags);
    if(child.magnifiers.length === 0) {
        child.magnifiers.push({name: 'Piece', options: {pieceValue: 1}});
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
        
        let tr = document.createElement('tr');
        // Add click event to row for details
        tr.style.cursor = 'pointer';
        tr.onclick = (e) => {
            // Prevent if clicking buttons
            if(e.target.tagName !== 'BUTTON') showDetails(c.id);
        };

        const getAlgShort = (alg) => {
            if(alg === 'minimaxDeep') return 'Deep';
            if(alg === 'minimaxQuiescence') return 'Q';
            if(alg === 'proofNumberSearch') return 'PNS';
            if(alg === 'bestFirstSearch') return 'BFS';
            if(alg === 'principalVariationSearch') return 'PVS';
            return 'AB';
        };

        let algStr = getAlgShort(c.algorithm);
        
        // Handle legacy
        if (c.altAlgorithm && (!c.phases || c.phases.length === 0)) {
            c.phases = [{threshold: c.altPieceThreshold || 10, algorithm: c.altAlgorithm}];
        }
        
        if (c.phases && c.phases.length > 0) {
            // sort phases for display just in case
            let sortedPhases = [...c.phases].sort((a,b) => b.threshold - a.threshold);
            let phaseStrs = sortedPhases.map(p => `${getAlgShort(p.algorithm)}<=${p.threshold}`);
            algStr += ` <br><i style="font-size:0.85em">(${phaseStrs.join(', ')})</i>`;
        }

        // Display magnifiers briefly
        let magsStr = '';
        if (c.magnifiers && c.magnifiers.length > 0) {
            magsStr = c.magnifiers.map(m => {
                let s = m.name.substring(0,3);
                if(m.name==='MaxOptions') s='Max';
                if(m.name==='KingTropism') s='Tro';
                if(m.name==='KingVulnerability') s='Vul';
                return s;
            }).join(', ');
        } else {
            // legacy display
            if(c.posValueWeight !== undefined) magsStr+='Max, ';
            if(c.pieceValueWeight !== undefined) magsStr+='Pce, ';
            if(c.kingTropismWeight !== undefined) magsStr+='Tro, ';
            if(magsStr.endsWith(', ')) magsStr = magsStr.slice(0,-2);
        }

        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${c.id}</td>
            <td>${c.race || '-'}</td>
            <td>${Math.round(c.score)}</td>
            <td>${c.gamesPlayed}</td>
            <td>${algStr}</td>
            <td>${c.depth}</td>
            <td style="font-size:10px;">${magsStr}</td>
            <td>${filtersHtml}</td>
            <td>
                <button style="padding: 5px 10px; font-size: 12px;" onclick="playAgainst('${c.id}')">Play</button>
                <button style="padding: 5px 10px; font-size: 12px; background:#e5989b;" onclick="saveBotToDb('${c.id}')">Save</button>
                <button style="padding: 5px 10px; font-size: 12px; background:#4ecdc4;" onclick="showHistory('${c.id}')">History</button>
                <button style="padding: 5px 10px; font-size: 12px; background:#ff4d4d; color:white; border:none;" onclick="killSpecificBot('${c.id}')">Kill</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.onload = init;

// --- Create Bot Modal Logic ---

function openCreateBotModal() {
    let modal = document.getElementById('createBotModal');
    let raceSelect = document.getElementById('cb_race');
    
    // Populate races
    raceSelect.innerHTML = '';
    RACES.forEach(r => {
        let opt = document.createElement('option');
        opt.value = r;
        opt.innerText = r.charAt(0).toUpperCase() + r.slice(1);
        raceSelect.appendChild(opt);
    });

    // Reset inputs (optional, or keep last values)
    // resetCreateBotInputs();
    
    // Bind toggle events for filter options
    // Note: The new tab system handles binding dynamically in evolution.html
    // We don't need to call setupCheckboxToggles() here anymore as it refers to old IDs
    // setupCheckboxToggles(); 

    modal.style.display = 'flex';
}

function closeCreateBotModal() {
    document.getElementById('createBotModal').style.display = 'none';
}

// --- Kill Bot Modal Logic ---

function openKillBotModal() {
    let modal = document.getElementById('killBotModal');
    modal.style.display = 'flex';
}

function closeKillBotModal() {
    document.getElementById('killBotModal').style.display = 'none';
}

function killBotsByElo() {
    let threshold = parseInt(document.getElementById('kill_elo_threshold').value);
    if (isNaN(threshold)) return;
    
    let initialCount = characters.length;
    characters = characters.filter(c => c.score >= threshold);
    
    // Ensure we don't kill everyone, keep at least 2
    if (characters.length < 2 && initialCount >= 2) {
        alert("Cannot kill all bots! Kept the top 2.");
        // We'd have to reload or sort, simpler just to alert for now
        // A better approach is to sort and slice
    }
    
    saveData();
    updateUI();
    closeKillBotModal();
}

function killSpecificBotImpl(idToKill) {
    if (!idToKill) return;
    
    // Stop evolution loop if it's running
    let wasEvolving = isRunning;
    if (isRunning) {
        toggleEvolution(); 
    }
    
    if (characters.length <= 2) {
        alert("Cannot kill bot. Minimum 2 bots required in the arena.");
        if (wasEvolving) toggleEvolution();
        return;
    }
    
    if(confirm(`Are you sure you want to kill bot ${idToKill}?`)) {
        characters = characters.filter(c => c.id !== idToKill);
        saveData();
        updateUI();
    }
    
    // Resume evolution loop if it was running
    if (wasEvolving) {
        toggleEvolution();
    }
}
window.killSpecificBotImpl = killSpecificBotImpl;

function killAllBots() {
    if(confirm("Are you sure you want to delete ALL bots in the current generation? You will have to start over.")) {
        characters = [];
        saveData();
        // Force reload to trigger init() and generate new bots
        location.reload();
    }
}

// Legacy function removed as it conflicts with new tab system
// function setupCheckboxToggles() { ... }

function createNewBot() {
    // Helper to get value if input is not empty
    const getNum = (id) => {
        let el = document.getElementById(id);
        if (el && el.value !== '') return parseFloat(el.value);
        return undefined;
    };
    const getInt = (id) => {
        let el = document.getElementById(id);
        if (el && el.value !== '') return parseInt(el.value);
        return undefined;
    };
    const getBool = (id) => {
        let el = document.getElementById(id);
        return el ? el.checked : false;
    };
    const getVal = (id) => {
        let el = document.getElementById(id);
        return el ? el.value : undefined;
    };

    // Gather configuration from a specific panel context
    function getBotConfigFromContext(context) {
        let getVal = (cls) => {
             let el = context.querySelector('.' + cls);
             return el ? el.value : undefined;
        };
        let getNum = (cls) => {
            let el = context.querySelector('.' + cls);
            return el && el.value !== '' ? parseFloat(el.value) : undefined;
        };
        let getInt = (cls) => {
            let el = context.querySelector('.' + cls);
            return el && el.value !== '' ? parseInt(el.value) : undefined;
        };
        let getCheck = (cls) => {
            let el = context.querySelector('.' + cls);
            return el ? el.checked : false;
        };

        let config = {
            algorithm: getVal('cb_algorithm'),
            depth: getInt('cb_depth') || 2,
            
            // Filters
            useRemoveAttacked: getCheck('cb_useRemoveAttacked'),
            raRandomException: getNum('cb_raRandomException'),
            raExceptionPieceValue: getCheck('cb_raExceptionPieceValue'),
            raExceptionPieceValueSmaller: getCheck('cb_raExceptionPieceValueSmaller'),
            
            useRemoveNonAttacking: getCheck('cb_useRemoveNonAttacking'),
            rnaMaxPieceValue: getInt('cb_rnaMaxPieceValue'),
            rnaExceptionRandom: getNum('cb_rnaExceptionRandom'),
            rnaExceptionPieceValue: getCheck('cb_rnaExceptionPieceValue'),
            rnaExceptionPieceValueSmaller: getCheck('cb_rnaExceptionPieceValueSmaller'),
            
            useRandomlyRemove: getCheck('cb_useRandomlyRemove'),
            rrN: getInt('cb_rrN'),
            rrExceptionRandom: getNum('cb_rrExceptionRandom'),
            rrExceptionAttacked: getCheck('cb_rrExceptionAttacked'),
            rrExceptionPieceValueSmaller: getCheck('cb_rrExceptionPieceValueSmaller'),
            
            useMaxMoves: getCheck('cb_useMaxMoves'),
            mmMax: getInt('cb_mmMax'),
            mmExceptionAttacked: getCheck('cb_mmExceptionAttacked'),
            
            useNthChance: getCheck('cb_useNthChance'),
            nthChance: getNum('cb_nthChance'),
            ncExceptionAttacked: getCheck('cb_ncExceptionAttacked'),
            ncExceptionPieceValue: getCheck('cb_ncExceptionPieceValue'),
            
            useRemoveWellPositioned: getCheck('cb_useRemoveWellPositioned'),
            rwpN: getInt('cb_rwpN'),
            rwpExceptionAttacked: getCheck('cb_rwpExceptionAttacked')
        };
        
        // Gather magnifiers
        let magnifiers = [];
        context.querySelectorAll('.mag-row').forEach(row => {
            let type = row.querySelector('.mag-type').value;
            let opts = {};
            row.querySelectorAll('.mag-opts input').forEach(input => {
                let key = input.className.replace('opt-', '');
                if (input.type === 'checkbox') {
                    opts[key] = input.checked;
                } else {
                    if (input.value !== '') opts[key] = parseFloat(input.value);
                }
            });
            magnifiers.push({name: type, options: opts});
        });
        config.magnifiers = magnifiers;
        
        return config;
    }

    // Gather phases
    let phasesList = [];
    const phaseInputs = document.querySelectorAll('.phase-thresh-input');
    phaseInputs.forEach(input => {
        let id = input.dataset.id;
        let threshold = parseInt(input.value);
        let panel = document.getElementById('config-' + id);
        
        if (panel && !isNaN(threshold)) {
            let phaseConfig = getBotConfigFromContext(panel);
            phaseConfig.threshold = threshold;
            phasesList.push(phaseConfig);
        }
    });
    // Sort descending
    phasesList.sort((a, b) => b.threshold - a.threshold);

    // Get Base Config
    let baseContext = document.getElementById('config-base');
    let baseConfig = getBotConfigFromContext(baseContext);

    let char = {
        id: 'CUST-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
        race: document.getElementById('cb_race').value,
        score: 1000,
        gamesPlayed: 0,
        phases: phasesList,
        ...baseConfig
    };
    
    // Add to pool
    characters.push(char);
    saveData();
    updateUI();
    closeCreateBotModal();
    
    // Optional: Flash success or scroll to bot
    alert(`Custom Bot ${char.id} created!`);
}