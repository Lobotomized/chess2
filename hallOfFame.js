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
    fetch(`/api/bots/mode/${currentHofMode}?t=${Date.now()}`)
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
        tr.style.cursor = 'pointer';
        tr.onclick = (e) => {
            if(e.target.tagName !== 'BUTTON') showDetails(c.id || c._id);
        };

        const getAlgShort = (alg) => {
            if(alg === 'minimaxDeep') return 'Deep';
            if(alg === 'minimaxAlphaBetaBudget') return 'ABB';
            if(alg === 'minimaxQuiescence') return 'Q';
            if(alg === 'proofNumberSearch') return 'PNS';
            if(alg === 'bestFirstSearch') return 'BFS';
            if(alg === 'principalVariationSearch') return 'PVS';
            return 'AB';
        };

        let algStr = getAlgShort(c.algorithm);
        
        if (c.altAlgorithm && (!c.phases || c.phases.length === 0)) {
            c.phases = [{threshold: c.altPieceThreshold || 10, algorithm: c.altAlgorithm}];
        }
        
        if (c.phases && c.phases.length > 0) {
            let sortedPhases = [...c.phases].sort((a,b) => b.threshold - a.threshold);
            let phaseStrs = sortedPhases.map(p => `${getAlgShort(p.algorithm)}<=${p.threshold}`);
            algStr += ` <br><i style="font-size:0.85em">(${phaseStrs.join(', ')})</i>`;
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
    
    localStorage.setItem('chess_evolution_custom_ai_black', JSON.stringify(char));
    localStorage.removeItem('chess_evolution_custom_ai_white');
    
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

function showDetails(charId) {
    let c = bots.find(char => (char.id || char._id) === charId);
    if (!c) return;

    document.getElementById('modalTitle').innerText = `Bot: ${c.name || c.id || c._id}`;
    let body = document.getElementById('modalBody');
    
    let filtersHtml = '';
    
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

window.onload = init;
