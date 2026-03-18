const RACES = ['classic', 'medieval', 'bug', 'promoters', 'cyborgs'];
let bots = [];
let selectedBotId = null;

function init() {
    fetch('/bots')
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
        tr.innerHTML = `
            <td>${c.name || 'Unnamed'}</td>
            <td>${c.id}</td>
            <td>${c.race || '-'}</td>
            <td>${Math.round(c.score)}</td>
            <td>${c.gamesPlayed}</td>
            <td>${c.algorithm === 'minimaxDeep' ? 'Deep' : 'AB'}</td>
            <td>${c.depth}</td>
            <td>${filtersHtml}</td>
            <td>
                <button style="padding: 5px 10px; font-size: 12px;" onclick="playAgainst('${c.id}')">Play</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
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

window.onload = init;