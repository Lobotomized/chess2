const RACES = ['classic', 'medieval', 'bug', 'promoters', 'cyborgs'];
let bots = [];
let selectedBotId = null;
let currentHofMode = 'normal';

function init() {
    let savedMode = localStorage.getItem('chess_hof_mode') || 'normal';
    currentHofMode = savedMode;
    let modeSelect = document.getElementById('hofModeSelect');
    if (modeSelect) modeSelect.value = currentHofMode;

    loadBots();
}

function changeHofMode(mode) {
    currentHofMode = mode;
    localStorage.setItem('chess_hof_mode', mode);
    loadBots();
}

function loadBots() {
    fetch(`/api/bots/mode/${currentHofMode}`)
    .then(res => res.json())
    .then(data => {
        bots = data;
        updateUI();
    })
    .catch(err => console.error(err));
}

function updateUI() {
    let tbody = document.getElementById('hof-list');
    tbody.innerHTML = '';
    
    bots.forEach(c => {
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
        let algStr = c.algorithm === 'minimaxDeep' ? 'Deep' : (c.algorithm === 'minimaxAlphaBetaBudget' ? 'ABB' : (c.algorithm === 'minimaxQuiescence' ? 'Q' : (c.algorithm === 'proofNumberSearch' ? 'PNS' : (c.algorithm === 'bestFirstSearch' ? 'BFS' : 'AB'))));
        if (c.altAlgorithm) {
            let altAlgStr = c.altAlgorithm === 'minimaxDeep' ? 'Deep' : (c.altAlgorithm === 'minimaxAlphaBetaBudget' ? 'ABB' : (c.altAlgorithm === 'minimaxQuiescence' ? 'Q' : (c.altAlgorithm === 'proofNumberSearch' ? 'PNS' : (c.altAlgorithm === 'bestFirstSearch' ? 'BFS' : 'AB'))));
            algStr += ` <i>(${altAlgStr}<=${c.altPieceThreshold || 10})</i>`;
        }

        tr.innerHTML = `
            <td>${c.name || 'Unnamed'}</td>
            <td>${c.id}</td>
            <td>${c.race || '-'}</td>
            <td>${Math.round(c.score)}</td>
            <td>${c.gamesPlayed}</td>
            <td>${algStr}</td>
            <td>${c.depth}</td>
            <td>${filtersHtml}</td>
        <td>
            <button style="padding: 5px 10px; font-size: 12px;" onclick="playAgainst('${c.id || c._id}')">Play</button>
            <button style="padding: 5px 10px; font-size: 12px; background-color: #e74c3c;" onclick="deleteBot('${c._id || c.id}')">Delete</button>
        </td>
    `;
    tbody.appendChild(tr);
    });
}

async function deleteBot(charId) {
    if(await showConfirm('Are you sure you want to delete this bot from the Hall of Fame?')) {
        fetch('/api/bots/' + charId, {
            method: 'DELETE'
        })
        .then(res => {
            if(res.ok) {
                loadBots(); // Refresh the list
            } else if(res.status === 404) {
                showAlert('Endpoint not found or bot not found. Did you restart the node server?');
            } else {
                showAlert('Failed to delete bot. Server responded with: ' + res.status);
            }
        })
        .catch(err => {
            console.error(err);
            showAlert('Error connecting to server. Did you restart the node server?');
        });
    }
}

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

function closeRaceModal() {
    document.getElementById('raceSelectionModal').style.display = 'none';
    selectedBotId = null;
}

function confirmPlay() {
    if(!selectedBotId) return;
    
    // In Hall of Fame, we look up from the fetched bots array, NOT the evolution 'characters' array
    let char = bots.find(c => c.id === selectedBotId);
    if(!char) return;
    
    let playerRace = document.getElementById('playerRaceSelect').value;
    
    localStorage.setItem('chess_evolution_custom_ai', JSON.stringify(char));
    
    let url = `/hotseat?whiteRace=${playerRace}&blackRace=${char.race || 'classic'}&AIColor=black&AIPowerBlack=customEvolution&gameType=raceChoiceChess&starts=whiteStarts`;
    window.open(url, '_blank');
    
    closeRaceModal();
}

function openHofFightModal() {
    let whiteSelect = document.getElementById('whiteBotSelect');
    let blackSelect = document.getElementById('blackBotSelect');
    whiteSelect.innerHTML = '';
    blackSelect.innerHTML = '';
    
    bots.forEach(b => {
        let name = b.name ? `${b.name} (${b.id})` : b.id;
        let opt1 = document.createElement('option');
        opt1.value = b.id;
        opt1.innerText = name;
        whiteSelect.appendChild(opt1);
        
        let opt2 = document.createElement('option');
        opt2.value = b.id;
        opt2.innerText = name;
        blackSelect.appendChild(opt2);
    });
    
    document.getElementById('fightStatus').innerText = '';
    document.getElementById('startFightBtn').style.display = 'block';
    document.getElementById('watchFightBtn').style.display = 'block';
    document.getElementById('hofFightModal').style.display = 'flex';
}

function closeHofFightModal() {
    document.getElementById('hofFightModal').style.display = 'none';
}

function watchHofFight() {
    let wId = document.getElementById('whiteBotSelect').value;
    let bId = document.getElementById('blackBotSelect').value;
    
    let wBot = bots.find(b => b.id === wId);
    let bBot = bots.find(b => b.id === bId);
    
    if(!wBot || !bBot) return;
    
    localStorage.setItem('chess_evolution_custom_ai_white', JSON.stringify(wBot));
    localStorage.setItem('chess_evolution_custom_ai_black', JSON.stringify(bBot));
    
    let url = `/hotseat?whiteRace=${wBot.race || 'classic'}&blackRace=${bBot.race || 'classic'}&AIColor=all&AIPowerWhite=customEvolution&AIPowerBlack=customEvolution&gameType=raceChoiceChess&starts=whiteStarts`;
    window.open(url, '_blank');
}

function startHofFight() {
    let wId = document.getElementById('whiteBotSelect').value;
    let bId = document.getElementById('blackBotSelect').value;
    
    let wBot = bots.find(b => b.id === wId);
    let bBot = bots.find(b => b.id === bId);
    
    if(!wBot || !bBot) return;
    
    document.getElementById('fightStatus').innerText = 'Fighting... please wait.';
    document.getElementById('startFightBtn').style.display = 'none';
    document.getElementById('watchFightBtn').style.display = 'none';
    
    let worker = new Worker('evolutionWorker.js');
    
    let workerTimeout = null;
    let thinkingColor = 'white';

    const MODE_TIMEOUTS = {
        'super_fast': 5000,
        'fast': 15000,
        'normal': 60000,
        'slow': 120000
    };

    worker.postMessage(JSONfn.stringify({
        charWhite: wBot,
        charBlack: bBot,
        whiteRace: wBot.race || 'classic',
        blackRace: bBot.race || 'classic'
    }));
    
    worker.onmessage = function(e) {
        let msg = JSONfn.parse(e.data);

        if (msg.type === 'thinking') {
            thinkingColor = msg.color;
            let currentMoves = msg.moves || [];
            if (workerTimeout) clearTimeout(workerTimeout);
            
            let currentTimeout = MODE_TIMEOUTS[currentHofMode] || 60000;
            workerTimeout = setTimeout(() => {
                if (worker) {
                    worker.terminate();
                    
                    let result = {
                        winner: thinkingColor === 'white' ? 'black' : 'white',
                        turns: msg.turns || 0,
                        history: {
                            whiteId: wBot.id,
                            blackId: bBot.id,
                            whiteRace: wBot.race || 'classic',
                            blackRace: bBot.race || 'classic',
                            winner: thinkingColor === 'white' ? 'black' : 'white',
                            turns: msg.turns || 0,
                            moves: currentMoves
                        }
                    };
                    handleHofResult(result, wBot, bBot);
                }
            }, currentTimeout);
            return;
        }

        if (msg.type === 'result') {
            if (workerTimeout) clearTimeout(workerTimeout);
            worker.terminate();
            handleHofResult(msg, wBot, bBot);
        }
    };
    
    worker.onerror = function(err) {
        if (workerTimeout) clearTimeout(workerTimeout);
        document.getElementById('fightStatus').innerText = 'Error during fight!';
        worker.terminate();
    };
}

function handleHofResult(result, wBot, bBot) {
    if (result.history) {
        result.history.isHallOfFame = true; // Flag as HoF match
        
        fetch('/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result.history)
        }).then(res => res.json()).then(savedGame => {
            let wName = wBot.name || wBot.id;
            let bName = bBot.name || bBot.id;
            let winText = result.winner === 'tie' ? 'It was a tie!' : (result.winner === 'white' ? `${wName} (White) won!` : `${bName} (Black) won!`);
            
            document.getElementById('fightStatus').innerHTML = `
                ${winText} in ${result.turns} turns.<br><br>
                <button onclick="window.open('/replay.html?gameId=${savedGame._id}', '_blank')" style="background:#829769; padding:5px 10px; font-size:14px;">Watch Replay</button>
            `;
        }).catch(err => {
            document.getElementById('fightStatus').innerText = 'Fight finished, but failed to save history.';
        });
    }
}

function showHofHistory() {
    let modal = document.getElementById('historyModal');
    modal.style.display = 'flex';
    document.getElementById('historyContent').innerHTML = 'Loading...';
    
    fetch('/hof-games')
    .then(res => res.json())
    .then(games => {
        let html = '<table style="width:100%; text-align:left;"><thead><tr><th>Date</th><th>White (Race)</th><th>Black (Race)</th><th>Result</th><th>Turns</th><th>Action</th></tr></thead><tbody>';
        if (!games || games.length === 0) {
            html += '<tr><td colspan="6" style="text-align:center; padding: 10px;">No Hall of Fame match history found.</td></tr>';
        } else {
            games.forEach(g => {
                let result = g.winner === 'tie' ? 'Draw' : (g.winner === 'white' ? 'White Win' : 'Black Win');
                let color = g.winner === 'tie' ? '#f0d9b5' : (g.winner === 'white' ? '#e0e0e0' : '#888888');
                let wRace = g.whiteRace ? `(${g.whiteRace})` : '';
                let bRace = g.blackRace ? `(${g.blackRace})` : '';
                html += `
                    <tr>
                        <td>${new Date(g.date).toLocaleString()}</td>
                        <td>${g.whiteId} ${wRace}</td>
                        <td>${g.blackId} ${bRace}</td>
                        <td style="color:${color}; font-weight:bold;">${result}</td>
                        <td>${g.turns}</td>
                        <td><button style="padding:5px;" onclick="window.open('/replay.html?gameId=${g._id}', '_blank')">Replay</button></td>
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

window.onload = init;
