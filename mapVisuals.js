// Map Visuals Logic
// Handles the rendering and interaction of the Grand Map Modal


// --- Map Modal ---
function showMapModal() {
    // Clear the game canvas so we don't see a "ghost" game behind the modal
    const canvas = document.getElementById('canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (typeof grandMap === 'undefined') return;
    
    const modal = document.getElementById('mapDialog');
    if (!modal) return;
    
    const grid = document.getElementById('mapGrid');
    const container = document.getElementById('mapContainer');
    
    // Clear existing
    grid.innerHTML = '';
    
    // Update Resource Displays
    const foodDisplay = document.getElementById('mapFoodDisplay');
    if (foodDisplay && typeof rpgState !== 'undefined') {
        foodDisplay.innerText = rpgState.food;
    }
    const goldDisplay = document.getElementById('mapGoldDisplay');
    if (goldDisplay && typeof rpgState !== 'undefined') {
        goldDisplay.innerText = rpgState.gold || 0;
    }
    const kingLevelDisplay = document.getElementById('mapKingLevelDisplay');
    if (kingLevelDisplay && typeof rpgState !== 'undefined') {
        kingLevelDisplay.innerText = rpgState.kingLevel || 1;
        // Add tooltip for active skills
        if (rpgState.activeSkills && rpgState.activeSkills.length > 0) {
            kingLevelDisplay.parentElement.title = "Active Skills: " + rpgState.activeSkills.map(s => {
                const sName = typeof s === 'string' ? s : s.name;
                const sLevel = typeof s === 'string' ? 1 : s.level;
                return `${sName} (Lvl ${sLevel})`;
            }).join(', ');
            kingLevelDisplay.parentElement.style.cursor = 'help';
        }
    }
    const kingExpDisplay = document.getElementById('mapKingExpDisplay');
    const kingNextExpDisplay = document.getElementById('mapKingNextExpDisplay');
    if (kingExpDisplay && typeof rpgState !== 'undefined') {
        kingExpDisplay.innerText = Math.floor(rpgState.kingExp || 0);
    }
    if (kingNextExpDisplay && typeof rpgState !== 'undefined' && typeof KING_EXP_THRESHOLDS !== 'undefined') {
        const nextThreshold = rpgState.kingLevel < 7 ? KING_EXP_THRESHOLDS[rpgState.kingLevel] : 'Max';
        kingNextExpDisplay.innerText = nextThreshold;
    }
    
    // Inject or Update Styles
    let style = document.getElementById('mapVisualsStyles');
    if (!style) {
        style = document.createElement('style');
        style.id = 'mapVisualsStyles';
        document.head.appendChild(style);
    }
    
    style.innerHTML = `
        .map-cell {
            width: 240px;
            height: 240px;
            border: 1px solid #4e342e;
            background-color: #d7ccc8;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            transition: all 0.4s ease-out;
            border-radius: 0px;
            overflow: hidden;
            box-shadow: 
                0 15px 25px rgba(0,0,0,0.4), 
                inset 0 0 50px rgba(0,0,0,0.1),
                inset 0 2px 0 rgba(255,255,255,0.4);
            margin: 0px;
            padding: 0px;
            box-sizing: border-box;
        }
        
        /* The Fire Effect Container */
        .map-cell .fire-container {
            position: absolute;
            top: 25px; /* Shift to top right */
            right: 25px; /* Shift to top right */
            width: 40px; /* Make the container much smaller */
            height: 40px;
            pointer-events: none;
            z-index: 5;
            opacity: 0;
            transition: opacity 0.3s ease-in;
            mix-blend-mode: screen;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* Base Glow */
        .map-cell .fire-container::before {
            content: '';
            position: absolute;
            width: 0px;
            height: 0px;
            background: radial-gradient(circle, rgba(255, 140, 0, 0.7) 0%, rgba(255, 69, 0, 0.4) 30%, rgba(139, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0) 80%);
            border-radius: 50%;
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 0 20px 10px rgba(255, 69, 0, 0.4);
        }

        /* Inner intense flame / SVG Filter Fire */
        .map-cell .fire-container::after {
            content: '';
            position: absolute;
            width: 0px;
            height: 0px;
            /* Create a complex gradient that mimics flames */
            background: 
                radial-gradient(ellipse at 50% 100%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 200, 50, 0.8) 20%, rgba(255, 100, 0, 0.6) 40%, rgba(200, 0, 0, 0.4) 60%, transparent 80%),
                radial-gradient(circle at 40% 80%, rgba(255, 150, 0, 0.5) 0%, transparent 40%),
                radial-gradient(circle at 60% 70%, rgba(255, 100, 0, 0.5) 0%, transparent 40%);
            border-radius: 50% 50% 20% 20% / 60% 60% 30% 30%;
            transition: all 0.4s ease-out;
            transform-origin: bottom center;
            /* We will use a CSS filter to create a wavy distortion for the fire */
            filter: blur(1px) contrast(2);
        }

        .map-cell:hover {
            filter: brightness(1.1) saturate(1.15);
            box-shadow: 
                0 0 0 2px rgba(255, 140, 0, 0.6),
                0 8px 15px rgba(0,0,0,0.5), 
                inset 0 0 50px rgba(255, 69, 0, 0.3);
            z-index: 10;
            border-color: rgba(255, 140, 0, 0.9);
        }

        .map-cell:hover .fire-container {
            opacity: 1;
        }

        .map-cell:hover .fire-container::before {
            width: 60px; /* Scaled down glow */
            height: 60px;
            animation: fireGlow 1.5s infinite alternate ease-in-out;
        }

        .map-cell:hover .fire-container::after {
            width: 25px; /* Scaled down flame */
            height: 40px; 
            margin-top: -5px; 
            animation: realFire 0.8s infinite alternate ease-in-out;
        }
        
        @keyframes fireGlow {
            0% { transform: scale(0.95); opacity: 0.6; filter: hue-rotate(-5deg); }
            50% { transform: scale(1.02); opacity: 0.8; filter: hue-rotate(2deg); }
            100% { transform: scale(0.98); opacity: 0.7; filter: hue-rotate(-2deg); }
        }

        @keyframes realFire {
            0% { 
                transform: scale(0.9) scaleY(0.9) skewX(-2deg); 
                opacity: 0.85; 
                background-position: 0% 0%;
            }
            33% {
                transform: scale(1.0) scaleY(1.05) skewX(3deg); 
                opacity: 0.95; 
            }
            66% {
                transform: scale(0.95) scaleY(0.95) skewX(-1deg); 
                opacity: 0.9; 
            }
            100% { 
                transform: scale(1.05) scaleY(1.1) skewX(2deg); 
                opacity: 1; 
                background-position: 5% 5%;
            }
        }
        
        .map-cell.current {
            border-color: #ffd700;
            box-shadow: 0 0 30px #ffd700, inset 0 0 20px #ffd700;
            animation: pulse 2s infinite;
            z-index: 50;
            border-width: 1px;
        }
        .map-cell.current:hover {
            filter: brightness(1.4) saturate(1.6);
            box-shadow: 
                0 0 0 4px #ff8c00,
                0 0 50px rgba(255, 140, 0, 0.8),
                inset 0 0 50px rgba(255, 140, 0, 0.6);
        }
        
        /* Texture Overlay for all cells */
        .map-cell::before {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E");
            opacity: 0.4;
            pointer-events: none;
            z-index: 1;
            mix-blend-mode: overlay;
        }

        /* Prevent image dragging */
        .map-cell img {
            pointer-events: none;
            user-select: none;
            -webkit-user-drag: none;
        }

        .map-cell.cleared {
            filter: sepia(0.8) grayscale(0.4) brightness(0.9);
        }
        .map-cell.cleared::after {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 24px;
            font-weight: 900;
            color: rgba(139, 0, 0, 0.6);
            pointer-events: none;
            padding: 10px 20px;
            border-radius: 8px;
            z-index: 20;
            letter-spacing: 2px;
            text-transform: uppercase;
            box-shadow: 0 0 10px rgba(139,0,0,0.2);
        }

        /* --- Terrain Themes --- */

        /* WOODS: Ultra-Detailed Realistic Forest */
        .map-cell.woods { 
            background-color: #0d3d0d;
            border-color: #0a2d0a;
            box-shadow: inset 0 0 60px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.3);
        }

        /* FOUNTAIN: Magical water ripples */
        .map-cell.fountain { 
            background-color: #0277bd;
            border-color: #01579b;
        }

        /* DESERT: Hot dunes with grain */
        .map-cell.desert { 
            background-color: #f9a825;
            border-color: #bf360c;
        }

        /* MARKET: Luxurious paved/tiled floor */
        .map-cell.market { 
            background-color: #6a1b9a; 
            border-color: #4a148c;
            background-image: 
                conic-gradient(from 0deg at 50% 50%, rgba(0,0,0,0.2) 0deg, transparent 60deg, rgba(0,0,0,0.2) 120deg, transparent 180deg, rgba(0,0,0,0.2) 240deg, transparent 300deg, rgba(0,0,0,0.2) 360deg),
                radial-gradient(circle at 50% 50%, #8e24aa 0%, #4a148c 100%);
        }
        
        /* --- Region Styles (Applied when not a special terrain) --- */
        
        .map-cell:not(.woods):not(.fountain):not(.desert):not(.market)[data-region="Classic"] {
            background-color: #8d6e63;
            background-image: repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0,0,0,0.1) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0,0,0,0.1) 20px);
            border-color: #5d4037;
        }
        
        .map-cell:not(.woods):not(.fountain):not(.desert):not(.market)[data-region="Medieval"] {
            background-color: #78909c;
            background-image: 
                linear-gradient(45deg, #607d8b 25%, transparent 25%, transparent 75%, #607d8b 75%, #607d8b),
                linear-gradient(45deg, #607d8b 25%, transparent 25%, transparent 75%, #607d8b 75%, #607d8b);
            background-size: 20px 20px;
            background-position: 0 0, 10px 10px;
            border-color: #37474f;
        }
        
        .map-cell:not(.woods):not(.fountain):not(.desert):not(.market)[data-region="Insect"] {
            background-color: #558b2f;
            background-image: radial-gradient(#33691e 15%, transparent 16%), radial-gradient(#33691e 15%, transparent 16%);
            background-size: 20px 20px;
            background-position: 0 0, 10px 10px;
            border-color: #1b5e20;
        }

        .map-cell:not(.woods):not(.fountain):not(.desert):not(.market)[data-region="Cyborgs"] {
            background-color: #455a64;
            background-image: 
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 10px 10px;
            border-color: #263238;
            box-shadow: inset 0 0 20px #000;
        }

        .map-cell:not(.woods):not(.fountain):not(.desert):not(.market)[data-region="Promoters"] {
            background-color: #c62828;
            background-image: 
                radial-gradient(circle at 50% 50%, #b71c1c 0%, #8b0000 100%);
            border-color: #b71c1c;
            border-style: ridge;
        }

        @keyframes pulse {
             0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7); }
             70% { box-shadow: 0 0 0 20px rgba(255, 215, 0, 0); }
             100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
         }
         
         @keyframes pulseKing {
             0% { transform: scale(1); filter: drop-shadow(0 0 10px gold); }
             50% { transform: scale(1.1); filter: drop-shadow(0 0 20px gold); }
             100% { transform: scale(1); filter: drop-shadow(0 0 10px gold); }
         }
     `;
    
    // Set grid columns
     const mapWidth = grandMap.width || 10;
     grid.style.gridTemplateColumns = `repeat(${mapWidth}, 240px)`;
     grid.style.gap = '0px';
     grid.style.padding = '0px';
    
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
                
                if (node.board === 'Woods') {
                    cell.classList.add('woods');
                    const num = (node.x * 31 + node.y * 17) % 4 + 1;
                    cell.style.backgroundImage = `url("/static/bigMap/forest${num}.png")`;
                    cell.style.backgroundSize = 'cover';
                    cell.style.backgroundPosition = 'center';
                }
                else if (node.board === 'Fountain') {
                    cell.classList.add('fountain');
                    cell.style.backgroundImage = `url("/static/bigMap/lake1.png")`;
                    cell.style.backgroundSize = 'cover';
                    cell.style.backgroundPosition = 'center';
                }
                else if (node.board === 'Desert') {
                    cell.classList.add('desert');
                    const num = (node.x * 31 + node.y * 17) % 4 + 1;
                    cell.style.backgroundImage = `url("/static/bigMap/desert${num}.png")`;
                    cell.style.backgroundSize = 'cover';
                    cell.style.backgroundPosition = 'center';
                }
                else if (node.board === 'Market') cell.classList.add('market');
                else {
                    cell.classList.add('standard');
                    cell.style.backgroundImage = `url("/static/bigMap/plains1.png")`;
                    cell.style.backgroundSize = 'cover';
                    cell.style.backgroundPosition = 'center';
                }
                
                // Determine Region if missing
                let region = node.region;
                if (!region) {
                    if (node.x < 3) region = 'Classic';
                    else if (node.x < 6) region = 'Medieval';
                    else if (node.x < 9) region = 'Insect';
                    else if (node.x < 12) region = 'Cyborgs';
                    else region = 'Promoters';
                    node.region = region; // Ensure it is saved back to the node object for older saves
                }
                
                cell.setAttribute('data-region', region);

                // Region Icons
                const regionIcons = {
                    'Classic': 'blackPawn.png',
                    'Medieval': 'blackGhost.png',
                    'Insect': 'blackAnt.png',
                    'Cyborgs': 'blackCyborg.png',
                    'Promoters': 'blackSwordsmen.png'
                };
                
                // Use global folderSrc if available, else default to 'lg'
                // Check if folderSrc is defined, otherwise check window width
                let fSrc = 'lg';
                if (typeof folderSrc !== 'undefined') fSrc = folderSrc;
                else if (window.innerWidth < 700) fSrc = 'sm';

                const regionIconName = regionIcons[region] || 'blackPawn.png';
                // Try to find correct path. Since we saw /static/ in loadImages.js, we use that.
                // However, LS showed public folder. Server likely maps /static to public.
                const iconPath = `/static/${fSrc}/${regionIconName}`;
                
                // Top Right Region Indicator
                const regionIndicatorHtml = `
                    <div style="position:absolute; top: 8px; right: 8px; width: 32px; height: 32px; background: rgba(255,255,255,0.7); border: 2px solid rgba(0,0,0,0.3); border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.5); z-index: 20;">
                        <img src="${iconPath}" style="width: 80%; height: 80%; object-fit: contain; filter: drop-shadow(1px 1px 1px black);" title="${region} Territory">
                    </div>
                `;

                // Difficulty Icons Mapping
                const diffName = node.difficulty ? node.difficulty.name : '';
                let specialIcon = '';
                
                if (node.board === 'Market') specialIcon = '🛒';
                // We prioritize region images over generic difficulty icons, but keep Boss/Special markers if needed.
                // For now, let's use the region image as the base for all combat nodes.
                // Maybe overlay a "Crown" for bosses?
                
                let isBoss = diffName.includes('King') || diffName.includes('Royal') || diffName.includes('Warlord') || diffName.includes('End');

                // Status Overrides
                let isCurrent = node.x === grandMap.currentX && node.y === grandMap.currentY;
                
                if (isCurrent) {
                    // Player Position - Show King!
                    icon = `<img src="/static/lg/whiteKing.png" style="width:90%; height:90%; object-fit:contain; filter: drop-shadow(0 0 10px gold); animation: pulseKing 2s infinite;">`;
                } else if (node.cleared) {
                     icon = '🏳️'; // Cleared/Conquered
                } else if (node.board === 'Market') {
                     icon = '🛒';
                } else {
                     // Combat Node
                     // Use Image
                     icon = `<img src="${iconPath}" style="width:80%; height:80%; object-fit:contain; filter: drop-shadow(1px 1px 2px black);">`;
                     
                     // Add boss marker if needed
                     if (isBoss) {
                         icon += `<span style="position:absolute; top:-5px; right:-5px; font-size:12px;">👑</span>`;
                     }
                }
                
                // Tooltip
                const desc = node.difficulty ? node.difficulty.description : '';
                cell.title = `${region} Region\nDifficulty: ${diffName} (Power: ${node.enemyPower})\nReward Cap: ${node.rewardCap}\n${desc}`;

                let contentHtml = `<div class="fire-container"></div>
                <div style="position:relative; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:space-between; padding: 10px; z-index: 2;">`;
                
                // Main Icon
                if (isCurrent) {
                    // Player: Keep centered and prominent
                    contentHtml += `<div class="map-cell-icon" style="flex-grow:1; display:flex; align-items:center; justify-content:center; width:100%; filter: drop-shadow(0 5px 5px rgba(0,0,0,0.5)); transform: scale(1.0);">${icon}</div>`;
                }
                
                // Rewards Display
                let rewardsHtml = '';
                if (!node.cleared && node.rewards && node.board !== 'Market') {
                     const r = node.rewards;
                     let parts = [];
                     const rosterFull = typeof rpgState !== 'undefined' && rpgState.playerRoster && rpgState.playerRoster.length >= 24;
                     const hasPiece = r.pieces && r.pieces.length > 0;
                     
                     if (hasPiece && !rosterFull) {
                         // Only piece reward is given, don't show gold
                     } else if (r.gold > 0) {
                         parts.push(`<span title="Gold" style="display:flex; align-items:center;">💰${r.gold}</span>`);
                     }
                     
                     if (hasPiece && !rosterFull) {
                         // Check for specific piece
                         if (r.specificPiece && typeof window[r.specificPiece] === 'function') {
                             // Create temp piece to get icon
                             try {
                                 const p = window[r.specificPiece]('white', 0, 0);
                                 const iconUrl = `/static/${p.icon}`;
                                 
                                 parts.push(`
                                    <span class="reward-unit-icon" data-factory="${r.specificPiece}" title="Unit Reward: ${p.name || 'Unit'}" style="cursor:help; display:inline-flex; align-items:center; background: rgba(255,255,255,0.2); border-radius: 4px; padding: 2px;">
                                        <img src="${iconUrl}" style="width:24px; height:24px; margin-right:2px; vertical-align:middle; filter: drop-shadow(1px 1px 2px black);">
                                        <span style="font-size:12px; background:#222; color:#ffd700; border:1px solid #ffd700; border-radius:50%; width:16px; height:16px; display:inline-flex; align-items:center; justify-content:center; margin-left:2px; font-weight:900;">i</span>
                                    </span>
                                 `);
                             } catch(e) {
                                 parts.push(`<span title="Units">♟️${r.pieces.length}</span>`);
                             }
                         } else {
                             parts.push(`<span title="Units">♟️${r.pieces.length}</span>`);
                         }
                     }
                     
                     if (parts.length > 0) {
                         rewardsHtml = `<div class="map-cell-rewards" style="display: flex; gap: 10px; font-size: 16px; font-weight:bold; color: #fff; text-shadow: 2px 2px 2px #000; background: rgba(0,0,0,0.75); padding: 4px 8px; border-radius: 8px; margin-bottom: 6px; pointer-events: auto; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 2px 4px rgba(0,0,0,0.5);">${parts.join('')}</div>`;
                     }
                }

                // Level / Power Indicator (Badge) - Hide if current? Or show?
                // Maybe hide level if it's the player, or show "YOU"
                if (isCurrent) {
                     contentHtml += `<div class="map-cell-level" style="visibility:hidden;">YOU</div>`;
                } else {
                     // Use margin-top: auto to ensure it stays at the bottom even when icon is absolute
                     contentHtml += `
                     <div style="margin-top:auto; display:flex; flex-direction:column; align-items:center; width:100%; pointer-events:none;">
                        ${rewardsHtml}
                     </div>`;
                }
                
                contentHtml += `</div>${regionIndicatorHtml}`;

                cell.innerHTML = contentHtml;
                                  
                grid.appendChild(cell);

                // Click Handler for Cell (Popup)
                cell.onclick = (e) => {
                    // Ignore clicks on info buttons
                    if (e.target.closest('.reward-unit-icon')) return;
                    
                    if (isCurrent) {
                        // Close the map modal if it's open
                        const mapDialog = document.getElementById('mapDialog');
                        if (mapDialog) mapDialog.close();
                        
                        // Open the Reorder Army modal
                        if (typeof showReorderModal === 'function' && typeof rpgState !== 'undefined') {
                            // Pass a callback that just re-opens the map dialog
                            showReorderModal(rpgState.playerRoster, () => {
                                const mDialog = document.getElementById('mapDialog');
                                if (mDialog) mDialog.showModal();
                            }, true); // The `true` parameter forces the button text to be "Confirm Army"
                        } else {
                            console.warn("Reorder army function or state not available.");
                        }
                    } else {
                        showMapCellPopup(node, grandMap);
                    }
                };
            });
        });
        
        // Add click handlers for reward icons (delegation or direct)
        // Since we are rebuilding the grid, we can just select all .reward-unit-icon
        setTimeout(() => {
             const unitIcons = grid.querySelectorAll('.reward-unit-icon');
             unitIcons.forEach(icon => {
                 icon.onclick = (e) => {
                     e.stopPropagation(); // Don't trigger map movement
                     const factory = icon.getAttribute('data-factory');
                     if (factory && typeof showPieceDiscoveryModal === 'function') {
                         showPieceDiscoveryModal(factory);
                     } else {
                         console.warn("showPieceDiscoveryModal not found or factory invalid");
                     }
                 };
             });
        }, 0);
    }
    
    modal.showModal();
    
    // Center scroll on current node
    setTimeout(() => {
        const currentCell = grid.querySelector('.current');
        if (currentCell && container) {
            const scrollX = currentCell.offsetLeft - (container.clientWidth / 2) + (currentCell.offsetWidth / 2);
            const scrollY = currentCell.offsetTop - (container.clientHeight / 2) + (currentCell.offsetHeight / 2);
            
            container.scrollTo({
                left: scrollX,
                top: scrollY,
                behavior: 'smooth'
            });
        }
    }, 50);

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

function showMapCellPopup(node, grandMap) {
    // Remove existing popup if any
    const existing = document.getElementById('mapCellPopup');
    if (existing) existing.remove();

    // Ensure the node has its army and actual enemy value generated before we display its stats
    if (typeof ensureNodeArmy === 'function' && node.board !== 'Market' && !node.cleared) {
        ensureNodeArmy(node);
    }

    const popup = document.createElement('dialog');
    popup.id = 'mapCellPopup';
    popup.style.cssText = `
        padding: 20px;
        border: 4px solid #5d4037;
        border-radius: 8px;
        background: #fdf6e3;
        color: #4e342e;
        box-shadow: 0 0 20px rgba(0,0,0,0.8);
        text-align: center;
        min-width: 300px;
        z-index: 1000;
        font-family: 'Georgia', serif;
    `;
    
    // Check if move is valid
    const dxRaw = node.x - grandMap.currentX;
    const dyRaw = node.y - grandMap.currentY;
    const dx = Math.abs(dxRaw);
    const dy = Math.abs(dyRaw);
    const isAdjacent = RPGStats.movementFreedom.some(dir => dir.dx === dxRaw && dir.dy === dyRaw);
    const isCurrent = (dx === 0 && dy === 0);
    
    // Title
    const diffName = node.difficulty ? node.difficulty.name : 'Unknown';
    const region = node.region || 'Unknown Region';
    
    let content = `
        <h2 style="margin-top:0; color:#5d4037; border-bottom: 2px solid #5d4037; padding-bottom: 5px;">${region}</h2>
        <h3 style="margin:10px 0; color: #8b4513;">${diffName}</h3>
        <p style="font-size: 14px; font-style: italic;">${node.difficulty ? node.difficulty.description : ''}</p>
        <div style="margin-top:20px; display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
    `;
    
    // Actions
    if (isCurrent) {
        content += `<p style="color:#8bc34a; width: 100%;">You are here.</p>`;
    } else if (node.cleared) {
        const canAttack = isAdjacent;
        const btnStyle = `padding: 10px 20px; font-weight:bold; cursor:pointer; border:2px solid #4e342e; border-radius:4px; margin-bottom: 5px; font-family: 'Georgia', serif;`;
        
        if (canAttack) {
             content += `<button id="popupMoveBtn" style="${btnStyle} background:#e0e0e0; color:#424242;">🚶 Move Here</button>`;
        } else {
             content += `<button disabled style="${btnStyle} background:#f5f5f5; color:#9e9e9e; cursor:not-allowed;">🚶 Move Here (Too Far)</button>`;
        }
        content += `<p style="color:#aaa; width: 100%; margin-top:5px; margin-bottom:0;">Area Cleared.</p>`;
    } else {
        // Attack Button
        const canAttack = isAdjacent;
        const btnStyle = `padding: 10px 20px; font-weight:bold; cursor:pointer; border:2px solid #4e342e; border-radius:4px; margin-bottom: 5px; font-family: 'Georgia', serif;`;
        
        if (node.board === 'Market') {
             if (canAttack) {
                 content += `<button id="popupAttackBtn" style="${btnStyle} background:#ffe082; color:#ff6f00;">🛒 Enter Market</button>`;
             } else {
                 content += `<button disabled style="${btnStyle} background:#d7ccc8; color:#8d6e63; cursor:not-allowed;">🛒 Enter Market (Too Far)</button>`;
             }
        } else {
             if (canAttack) {
                 content += `<button id="popupAttackBtn" style="${btnStyle} background:#ffcdd2; color:#c62828; border-color:#c62828;">⚔️ Attack</button>`;
             } else {
                 content += `<button disabled style="${btnStyle} background:#d7ccc8; color:#8d6e63; cursor:not-allowed;">⚔️ Attack (Too Far)</button>`;
             }
        }
    }
    
    // Info Button (Rewards)
    const infoBtnStyle = `padding: 10px 20px; font-weight:bold; cursor:pointer; border:2px solid #4e342e; border-radius:4px; margin-bottom: 5px; font-family: 'Georgia', serif;`;
    if (node.board === 'Market') {
         content += `<button id="popupInfoBtn" style="${infoBtnStyle} background:#fff9c4; color:#f57f17;">ℹ️ Market Info</button>`;
    } else {
         content += `<button id="popupInfoBtn" style="${infoBtnStyle} background:#e1f5fe; color:#0277bd;">ℹ️ Rewards Info</button>`;
         content += `<button id="popupEnemyBtn" style="${infoBtnStyle} background:#f3e5f5; color:#7b1fa2;">👁️ Scout Enemies</button>`;
    }
    
    content += `</div>
        <div style="margin-top:15px; padding-top:15px; border-top: 1px solid rgba(93, 64, 55, 0.3);">
            <button id="popupCloseBtn" style="padding: 8px 16px; background:#e6d5ac; border:2px solid #5d4037; color:#4e342e; border-radius:4px; cursor:pointer; font-weight:bold; font-family: 'Georgia', serif;">Close</button>
        </div>
    `;
    
    popup.innerHTML = content;
    document.body.appendChild(popup);
    popup.showModal();
    
    // Handlers
    const closeBtn = document.getElementById('popupCloseBtn');
    closeBtn.onclick = () => popup.close();
    
    const attackBtn = document.getElementById('popupAttackBtn');
    if (attackBtn) {
        attackBtn.onclick = () => {
            popup.close();
            // Trigger Movement/Attack logic
            if (typeof startLevel !== 'undefined' && typeof rpgState !== 'undefined') {
                rpgState.food -= RPGStats.foodLostOnMovement;
                if (typeof updateGoldDisplay === 'function') updateGoldDisplay();

                const option = {
                    type: `${diffName}`,
                    node: node,
                    description: node.difficulty.description,
                    rewardCap: node.rewardCap,
                    enemyValue: node.actualEnemyValue || node.enemyPower,
                    boardShape: node.board || 'Standard',
                    army: node.army,
                    region: node.region, // Pass the region to startLevel
                    difficultyIndex: 0
                };
                
                 if (node.board === 'Market') {
                     option.rewardType = 'none';
                 } else {
                     const rosterFull = rpgState.playerRoster.length >= 24;
                     if (node.rewards) {
                         const r = node.rewards;
                         const hasPiece = r.pieces && r.pieces.length > 0;
                         if (hasPiece && !rosterFull) {
                              option.rewardType = 'piece';
                              option.rewardContent = r.specificPiece;
                              if (typeof getPieceValue === 'function') {
                                  option.rewardValue = getPieceValue(r.specificPiece);
                              }
                              option.enemyFood = node.enemyFood;
                         } else {
                              option.rewardType = 'gold';
                              option.rewardContent = r.gold;
                              option.enemyFood = node.enemyFood;
                         }
                     } else {
                         option.rewardType = 'gold';
                         option.rewardContent = node.rewardCap;
                         const fallbackMinFood = Math.max(15, Math.floor(node.rewardCap * 0.8) + 5);
                         option.enemyFood = node.enemyFood || (fallbackMinFood + Math.floor(Math.random() * fallbackMinFood));
                     }
                 }
                
                const mapDialog = document.getElementById('mapDialog');
                if(mapDialog) mapDialog.close();
                
                if(typeof saveProgress === 'function') saveProgress();
                
                grandMap.moveTo(node.x, node.y);
                
                startLevel(rpgState.level + 1, option);
            } else {
                showAlert("Cannot start battle: Game state not found.");
            }
        };
    }
    
    const moveBtn = document.getElementById('popupMoveBtn');
    if (moveBtn) {
        moveBtn.onclick = () => {
            popup.close();
            if (typeof rpgState !== 'undefined') {
                rpgState.food -= RPGStats.foodLostOnMovement;
                if (typeof updateGoldDisplay === 'function') updateGoldDisplay();
                
                grandMap.moveTo(node.x, node.y);
                
                const mapDialog = document.getElementById('mapDialog');
                if(mapDialog) mapDialog.close();
                
                if(typeof saveProgress === 'function') saveProgress();
                
                if (rpgState.food <= 0) {
                    if (typeof clearProgress === 'function') clearProgress();
                    const overlay = document.getElementById('deathOverlay');
                    if (overlay) {
                        overlay.style.opacity = '1';
                        overlay.style.zIndex = '900';
                    }
                    setTimeout(() => {
                        const gameOverModal = document.getElementById('gameOverDialog');
                        if (gameOverModal) {
                            const gameOverText = gameOverModal.querySelector('p');
                            if (gameOverText) {
                                gameOverText.innerText = "Your food is over";
                            }
                            gameOverModal.showModal();
                        }
                    }, 1000);
                } else {
                    if (typeof showMapModal === 'function') {
                        showMapModal();
                    }
                }
            }
        };
    }
    
    const infoBtn = document.getElementById('popupInfoBtn');
    infoBtn.onclick = () => {
        let rewardsText = `<p>No rewards info available.</p>`;
        
        if (node.board === 'Market') {
            rewardsText = `
                <div style="text-align:left; background:rgba(230, 213, 172, 0.5); padding:15px; border-radius:4px; border: 1px solid rgba(93, 64, 55, 0.3);">
                    <p style="margin-top:0;">This is a <strong>Mercenary Market</strong>.</p>
                    <p>You can spend your Gold 💰 here to hire new units for your army.</p>
                    <p style="margin-bottom:0;">It is a safe zone (no battle).</p>
                </div>
            `;
        } else if (node.rewards) {
            const r = node.rewards;
            const rosterFull = typeof rpgState !== 'undefined' && rpgState.playerRoster && rpgState.playerRoster.length >= 24;
            const hasPiece = r.pieces && r.pieces.length > 0;
            
            rewardsText = `
                <div style="text-align:left; background:rgba(230, 213, 172, 0.5); padding:15px; border-radius:4px; border: 1px solid rgba(93, 64, 55, 0.3);">
            `;
            
            if (hasPiece && !rosterFull) {
                 rewardsText += `<p style="margin-top:0;"><strong>Unit:</strong> ${r.specificPiece ? r.specificPiece.replace('Factory','') : 'Unknown'} ♟️</p>`;
            } else {
                 rewardsText += `<p style="margin-top:0;"><strong>Gold:</strong> ${r.gold} 💰</p>`;
                 if (hasPiece) {
                     // If roster is full, they still see the unit they missed or it just falls back to gold?
                     // Actually, if roster is full, they get gold instead. Let's just show Gold.
                 }
            }
            rewardsText += `</div>`;
        }
        
        popup.innerHTML = `
            <h3 style="color:${node.board === 'Market' ? '#f57f17' : '#0277bd'}; border-bottom: 2px solid ${node.board === 'Market' ? '#f57f17' : '#0277bd'}; padding-bottom: 5px;">${node.board === 'Market' ? 'Market Information' : 'Reward Information'}</h3>
            ${rewardsText}
            <div style="margin-top:15px; padding-top:15px; border-top: 1px solid rgba(93, 64, 55, 0.3);">
                <button onclick="document.getElementById('mapCellPopup').remove()" style="padding: 8px 16px; background:#e6d5ac; border:2px solid #5d4037; color:#4e342e; border-radius:4px; cursor:pointer; font-weight:bold; font-family: 'Georgia', serif;">Close</button>
            </div>
        `;
    };
    
    const enemyBtn = document.getElementById('popupEnemyBtn');
    if (enemyBtn) {
        enemyBtn.onclick = () => {
            let enemiesHtml = `<div style="text-align:left; background:rgba(230, 213, 172, 0.5); padding:15px; border-radius:4px; border: 1px solid rgba(93, 64, 55, 0.3); max-height:300px; overflow-y:auto; display:flex; flex-wrap:wrap; gap:10px; justify-content:center;">`;
            
            // If the node doesn't have an army generated yet, generate it temporarily for preview
            let previewArmy = node.army;
            if (!previewArmy || previewArmy.length === 0) {
                if (typeof generateRandomArmy === 'function') {
                    const result = generateRandomArmy(node.enemyPower || 5, true, node.region);
                    if (result && result.army) {
                        previewArmy = result.army;
                    }
                }
            }

            if (previewArmy && previewArmy.length > 0) {
                previewArmy.forEach(piece => {
                    // Try to get icon
                    let iconUrl = '';
                    try {
                        const p = window[piece]('black', 0, 0);
                        if (p && p.icon) {
                            iconUrl = `/static/${p.icon}`;
                        }
                    } catch(e) {
                        console.warn('Could not load piece for enemy preview:', piece);
                    }
                    
                    const name = piece.replace('Factory', '');
                    if (iconUrl) {
                        enemiesHtml += `
                            <div style="display:flex; flex-direction:column; align-items:center; background:#fdf6e3; padding:5px; border-radius:4px; width:70px; border: 1px solid rgba(93, 64, 55, 0.2); box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <img src="${iconUrl}" style="width:40px; height:40px; object-fit:contain; filter:drop-shadow(1px 1px 2px rgba(0,0,0,0.3));">
                                <span style="font-size:10px; text-align:center; word-break:break-all; color:#4e342e; font-weight:bold; margin-top:2px;">${name}</span>
                            </div>
                        `;
                    } else {
                        enemiesHtml += `
                            <div style="display:flex; flex-direction:column; align-items:center; background:#fdf6e3; padding:5px; border-radius:4px; width:70px; border: 1px solid rgba(93, 64, 55, 0.2); box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <span style="font-size:24px; filter:drop-shadow(1px 1px 2px rgba(0,0,0,0.3));">♟️</span>
                                <span style="font-size:10px; text-align:center; word-break:break-all; color:#4e342e; font-weight:bold; margin-top:2px;">${name}</span>
                            </div>
                        `;
                    }
                });
            } else {
                enemiesHtml += `<p style="color:#4e342e;">No enemy info available.</p>`;
            }
            enemiesHtml += `</div>`;
            
            popup.innerHTML = `
                <h3 style="color:#7b1fa2; border-bottom: 2px solid #7b1fa2; padding-bottom: 5px;">Enemy Army</h3>
                ${enemiesHtml}
                <div style="margin-top:15px; padding-top:15px; border-top: 1px solid rgba(93, 64, 55, 0.3);">
                    <button onclick="document.getElementById('mapCellPopup').remove()" style="padding: 8px 16px; background:#e6d5ac; border:2px solid #5d4037; color:#4e342e; border-radius:4px; cursor:pointer; font-weight:bold; font-family: 'Georgia', serif;">Close</button>
                </div>
            `;
        };
    }
}

// Make sure it is globally available
window.showMapModal = showMapModal;
