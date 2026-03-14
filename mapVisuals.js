// Map Visuals Logic
// Handles the rendering and interaction of the Grand Map Modal

// --- Map Modal ---
function showMapModal() {
    if (typeof grandMap === 'undefined') return;
    
    const modal = document.getElementById('mapDialog');
    const grid = document.getElementById('mapGrid');
    const container = document.getElementById('mapContainer');
    
    // Clear existing
    grid.innerHTML = '';
    
    // Set grid columns
    const mapWidth = grandMap.width || 10;
    grid.style.gridTemplateColumns = `repeat(${mapWidth}, 50px)`;
    
    // Populate
    if (grandMap.map) {
        grandMap.map.forEach(row => {
            row.forEach(node => {
                const cell = document.createElement('div');
                cell.className = 'map-cell';
                
                // Classes based on state
                if (node.x === grandMap.currentX && node.y === grandMap.currentY) {
                    cell.classList.add('current');
                }
                if (node.cleared) {
                    cell.classList.add('cleared');
                }
                
                if (node.board === 'Woods') cell.classList.add('woods');
                else if (node.board === 'Fountain') cell.classList.add('fountain');
                else if (node.board === 'Market') cell.classList.add('market');
                else cell.classList.add('standard');
                
                // Content Logic
                let icon = ''; 
                
                // Difficulty Icons Mapping
                const diffName = node.difficulty ? node.difficulty.name : '';
                let specialIcon = '';
                
                if (node.board === 'Market') specialIcon = '🛒';
                else if (diffName.includes('Bandit')) specialIcon = '⛺';
                else if (diffName.includes('Camp')) specialIcon = '⛺';
                else if (diffName.includes('Tower')) specialIcon = '🗼';
                else if (diffName.includes('Guard')) specialIcon = '🛡️';
                else if (diffName.includes('King') || diffName.includes('Royal')) specialIcon = '👑';
                else if (diffName.includes('Warlord')) specialIcon = '👹';
                else if (diffName.includes('Ritual') || diffName.includes('Shadow') || diffName.includes('End')) specialIcon = '💀';
                
                // Status Overrides
                if (node.x === grandMap.currentX && node.y === grandMap.currentY) {
                    icon = '♟️'; // Player
                } else if (node.cleared) {
                     icon = '🏳️'; // Cleared/Conquered
                } else {
                     // Un-cleared nodes
                     icon = specialIcon || '⚔️';
                }
                
                // Tooltip
                const desc = node.difficulty ? node.difficulty.description : '';
                cell.title = `${node.board} Region\nDifficulty: ${diffName} (Power: ${node.enemyPower})\nReward Cap: ${node.rewardCap}\n${desc}`;

                cell.innerHTML = `<span class="map-cell-icon">${icon}</span>
                                  <span class="map-cell-level">Lv${node.enemyPower || '?'}</span>`;
                                  
                grid.appendChild(cell);
            });
        });
    }
    
    modal.showModal();
    
    // Drag to scroll logic
    let isDown = false;
    let startX, startY, scrollLeft, scrollTop;

    const startDrag = (e) => {
        isDown = true;
        container.classList.add('active');
        // Get correct coordinate (Touch vs Mouse)
        const pageX = e.touches ? e.touches[0].pageX : e.pageX;
        const pageY = e.touches ? e.touches[0].pageY : e.pageY;
        
        startX = pageX - container.offsetLeft;
        startY = pageY - container.offsetTop;
        scrollLeft = container.scrollLeft;
        scrollTop = container.scrollTop;
    };
    
    const stopDrag = () => {
        isDown = false;
        container.classList.remove('active');
    };
    
    const moveDrag = (e) => {
        if (!isDown) return;
        e.preventDefault();
        
        const pageX = e.touches ? e.touches[0].pageX : e.pageX;
        const pageY = e.touches ? e.touches[0].pageY : e.pageY;
        
        const x = pageX - container.offsetLeft;
        const y = pageY - container.offsetTop;
        const walkX = (x - startX) * 1.5; // scroll-speed
        const walkY = (y - startY) * 1.5;
        container.scrollLeft = scrollLeft - walkX;
        container.scrollTop = scrollTop - walkY;
    };

    // Mouse Events
    container.onmousedown = startDrag;
    container.onmouseleave = stopDrag;
    container.onmouseup = stopDrag;
    container.onmousemove = moveDrag;
    
    // Touch Events
    container.ontouchstart = startDrag;
    container.ontouchend = stopDrag;
    container.ontouchmove = moveDrag;
}

// Make sure it is globally available
window.showMapModal = showMapModal;
