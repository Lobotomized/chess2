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
            transition: all 0.2s ease-out;
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
        .map-cell:hover {
            filter: brightness(1.2) saturate(1.3);
            /* Keep base shadow + add gold ring. Remove z-index popping or keep it low. */
            box-shadow: 
                0 0 0 3px #ffd700,
                0 15px 25px rgba(0,0,0,0.4), 
                inset 0 0 50px rgba(0,0,0,0.1),
                inset 0 2px 0 rgba(255,255,255,0.4);
            z-index: 10;
            border-color: #ffd700;
        }
        .map-cell.current {
            border-color: #ffd700;
            box-shadow: 0 0 30px #ffd700, inset 0 0 20px #ffd700;
            animation: pulse 2s infinite;
            z-index: 50;
            border-width: 1px;
        }
        .map-cell.current:hover {
            filter: brightness(1.3) saturate(1.5);
            box-shadow: 
                0 0 0 4px #ffd700,
                0 0 40px #ffd700,
                inset 0 0 40px #ffd700;
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
            /* Ultra-detailed SVG forest with multiple layers, realistic tree shapes, undergrowth, and natural lighting */
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Cdefs%3E%3C!-- Complex radial gradients for different tree types --%3E%3CradialGradient id='oakCanopy' cx='45%25' cy='35%25' r='65%25'%3E%3Cstop offset='0%25' stop-color='%23a8e4a0'/%3E%3Cstop offset='25%25' stop-color='%2378c878'/%3E%3Cstop offset='50%25' stop-color='%234a7c4a'/%3E%3Cstop offset='75%25' stop-color='%232d5a2d'/%3E%3Cstop offset='100%25' stop-color='%231b3e1b'/%3E%3C/radialGradient%3E%3CradialGradient id='pineCanopy' cx='50%25' cy='30%25' r='70%25'%3E%3Cstop offset='0%25' stop-color='%2388c878'/%3E%3Cstop offset='30%25' stop-color='%2356a556'/%3E%3Cstop offset='60%25' stop-color='%233d7c3d'/%3E%3Cstop offset='100%25' stop-color='%231a4a1a'/%3E%3C/radialGradient%3E%3CradialGradient id='birchCanopy' cx='40%25' cy='40%25' r='60%25'%3E%3Cstop offset='0%25' stop-color='%23b8e8b0'/%3E%3Cstop offset='40%25' stop-color='%2390c090'/%3E%3Cstop offset='100%25' stop-color='%234a6c4a'/%3E%3C/radialGradient%3E%3ClinearGradient id='treeTrunk' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23a67c52'/%3E%3Cstop offset='50%25' stop-color='%237a5a3a'/%3E%3Cstop offset='100%25' stop-color='%235a3a1a'/%3E%3C/linearGradient%3E%3CradialGradient id='forestFloor' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stop-color='%233a5a3a'/%3E%3Cstop offset='100%25' stop-color='%231a3a1a'/%3E%3C/radialGradient%3E%3C!-- Enhanced shadow filter --%3E%3Cfilter id='forestShadow' x='-30%25' y='-30%25' width='160%25' height='160%25'%3E%3CfeDropShadow dx='6' dy='8' stdDeviation='4' flood-color='%23000' flood-opacity='0.5'/%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3C/filter%3E%3Cfilter id='softBlur'%3E%3CfeGaussianBlur stdDeviation='0.5'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23forestFloor)'/%3E%3Cg filter='url(%23forestShadow)'%3E%3C!-- Background Layer: Distant trees --%3E%3Cpath d='M30 25 C25 15, 35 5, 40 15 C45 5, 55 15, 50 25 C55 35, 45 45, 40 35 C35 45, 25 35, 30 25 Z' fill='%232a4a2a' opacity='0.6'/%3E%3Cpath d='M80 20 C75 10, 85 0, 90 10 C95 0, 105 10, 100 20 C105 30, 95 40, 90 30 C85 40, 75 30, 80 20 Z' fill='%232a4a2a' opacity='0.5'/%3E%3Cpath d='M160 15 C155 5, 165 -5, 170 5 C175 -5, 185 5, 180 15 C185 25, 175 35, 170 25 C165 35, 155 25, 160 15 Z' fill='%232a4a2a' opacity='0.4'/%3E%3C!-- Mid Layer: Large Oak trees with detailed canopies --%3E%3Cpath d='M60 60 C50 40, 70 20, 80 40 C90 20, 110 40, 100 60 C110 80, 90 100, 80 80 C70 100, 50 80, 60 60 Z' fill='url(%23oakCanopy)'/%3E%3Crect x='75' y='80' width='8' height='25' fill='url(%23treeTrunk)' rx='2'/%3E%3Cpath d='M140 55 C130 35, 150 15, 160 35 C170 15, 190 35, 180 55 C190 75, 170 95, 160 75 C150 95, 130 75, 140 55 Z' fill='url(%23oakCanopy)' opacity='0.9'/%3E%3Crect x='155' y='75' width='8' height='25' fill='url(%23treeTrunk)' rx='2'/%3E%3Cpath d='M200 65 C190 45, 210 25, 220 45 C230 25, 250 45, 240 65 C250 85, 230 105, 220 85 C210 105, 190 85, 200 65 Z' fill='url(%23oakCanopy)' opacity='0.8'/%3E%3Crect x='215' y='85' width='8' height='25' fill='url(%23treeTrunk)' rx='2'/%3E%3C!-- Pine Layer: Tall conifers with triangular shapes --%3E%3Cpath d='M40 30 L35 15 L45 15 L50 30 L55 50 L25 50 Z' fill='url(%23pineCanopy)'/%3E%3Crect x='37' y='50' width='6' height='20' fill='url(%23treeTrunk)' rx='1'/%3E%3Cpath d='M120 25 L115 5 L125 5 L130 25 L135 55 L105 55 Z' fill='url(%23pineCanopy)' opacity='0.9'/%3E%3Crect x='117' y='55' width='6' height='25' fill='url(%23treeTrunk)' rx='1'/%3E%3Cpath d='M25 85 L20 60 L30 60 L35 85 L40 120 L10 120 Z' fill='url(%23pineCanopy)' opacity='0.8'/%3E%3Crect x='22' y='120' width='6' height='20' fill='url(%23treeTrunk)' rx='1'/%3E%3Cpath d='M170 90 L165 65 L175 65 L180 90 L185 125 L155 125 Z' fill='url(%23pineCanopy)' opacity='0.7'/%3E%3Crect x='167' y='125' width='6' height='20' fill='url(%23treeTrunk)' rx='1'/%3E%3C!-- Birch Layer: White bark trees --%3E%3Cpath d='M95 70 C90 50, 100 30, 105 50 C110 30, 120 50, 115 70 C120 90, 110 110, 105 90 C100 110, 90 90, 95 70 Z' fill='url(%23birchCanopy)' opacity='0.8'/%3E%3Crect x='102' y='90' width='6' height='20' fill='%23f5f5f5' rx='1'/%3E%3Crect x='103' y='92' width='2' height='16' fill='%23333' rx='0.5'/%3E%3Cpath d='M185 75 C180 55, 190 35, 195 55 C200 35, 210 55, 205 75 C210 95, 200 115, 195 95 C190 115, 180 95, 185 75 Z' fill='url(%23birchCanopy)' opacity='0.7'/%3E%3Crect x='192' y='95' width='6' height='20' fill='%23f5f5f5' rx='1'/%3E%3Crect x='193' y='97' width='2' height='16' fill='%23333' rx='0.5'/%3E%3C!-- Undergrowth Layer: Bushes and small plants --%3E%3Ccircle cx='35' cy='135' r='8' fill='%234a7c4a' opacity='0.8'/%3E%3Ccircle cx='55' cy='140' r='6' fill='%23568c56' opacity='0.7'/%3E%3Ccircle cx='75' cy='145' r='7' fill='%234a7c4a' opacity='0.8'/%3E%3Ccircle cx='125' cy='150' r='9' fill='%23568c56' opacity='0.7'/%3E%3Ccircle cx='145' cy='135' r='5' fill='%234a7c4a' opacity='0.8'/%3E%3Ccircle cx='165' cy='145' r='8' fill='%23568c56' opacity='0.7'/%3E%3Ccircle cx='195' cy='140' r='6' fill='%234a7c4a' opacity='0.8'/%3E%3Ccircle cx='215' cy='150' r='7' fill='%23568c56' opacity='0.7'/%3E%3C!-- Forest Floor Details: Fallen leaves and small plants --%3E%3Cpath d='M20 160 C18 158, 22 156, 24 158 C26 156, 30 158, 28 160 C30 162, 26 164, 24 162 C22 164, 18 162, 20 160 Z' fill='%23d4a574' opacity='0.6'/%3E%3Cpath d='M45 165 C43 163, 47 161, 49 163 C51 161, 55 163, 53 165 C55 167, 51 169, 49 167 C47 169, 43 167, 45 165 Z' fill='%23c49464' opacity='0.5'/%3E%3Cpath d='M85 170 C83 168, 87 166, 89 168 C91 166, 95 168, 93 170 C95 172, 91 174, 89 172 C87 174, 83 172, 85 170 Z' fill='%23d4a574' opacity='0.6'/%3E%3Cpath d='M105 175 C103 173, 107 171, 109 173 C111 171, 115 173, 113 175 C115 177, 111 179, 109 177 C107 179, 103 177, 105 175 Z' fill='%23c49464' opacity='0.5'/%3E%3Cpath d='M135 180 C133 178, 137 176, 139 178 C141 176, 145 178, 143 180 C145 182, 141 184, 139 182 C137 184, 133 182, 135 180 Z' fill='%23d4a574' opacity='0.6'/%3E%3Cpath d='M165 185 C163 183, 167 181, 169 183 C171 181, 175 183, 173 185 C175 187, 171 189, 169 187 C167 189, 163 187, 165 185 Z' fill='%23c49464' opacity='0.5'/%3E%3Cpath d='M195 190 C193 188, 197 186, 199 188 C201 186, 205 188, 203 190 C205 192, 201 194, 199 192 C197 194, 193 192, 195 190 Z' fill='%23d4a574' opacity='0.6'/%3E%3Cpath d='M220 195 C218 193, 222 191, 224 193 C226 191, 230 193, 228 195 C230 197, 226 199, 224 197 C222 199, 218 197, 220 195 Z' fill='%23c49464' opacity='0.5'/%3E%3C!-- Additional scattered trees for density --%3E%3Cpath d='M15 100 C12 85, 18 70, 22 85 C26 70, 32 85, 28 100 C32 115, 26 130, 22 115 C18 130, 12 115, 15 100 Z' fill='%233a5a3a' opacity='0.4'/%3E%3Cpath d='M110 200 C107 185, 113 170, 117 185 C121 170, 127 185, 123 200 C127 215, 121 230, 117 215 C113 230, 107 215, 110 200 Z' fill='%233a5a3a' opacity='0.3'/%3E%3Cpath d='M230 110 C227 95, 233 80, 237 95 C241 80, 247 95, 243 110 C247 125, 241 140, 237 125 C233 140, 227 125, 230 110 Z' fill='%233a5a3a' opacity='0.35'/%3E%3C/g%3E%3C/svg%3E");
            background-size: 240px 240px;
              box-shadow: inset 0 0 60px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.3);
        }

        /* FOUNTAIN: Magical water ripples */
        .map-cell.fountain { 
            background-color: #0277bd;
            border-color: #01579b;
            background-image: 
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 10%),
                repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0, rgba(255,255,255,0.1) 5px, transparent 10px, transparent 20px),
                linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%);
        }

        /* DESERT: Hot dunes with grain */
        .map-cell.desert { 
            background-color: #f9a825;
            border-color: #bf360c;
            background-image: 
                repeating-linear-gradient(135deg, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 2px, transparent 4px, transparent 10px),
                radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.4) 0%, transparent 20%),
                linear-gradient(to bottom right, #fdd835, #f9a825, #ef6c00);
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
                
                if (node.board === 'Woods') cell.classList.add('woods');
                else if (node.board === 'Fountain') cell.classList.add('fountain');
                else if (node.board === 'Desert') cell.classList.add('desert');
                else if (node.board === 'Market') cell.classList.add('market');
                else cell.classList.add('standard');
                
                // Determine Region if missing
                let region = node.region;
                if (!region) {
                    if (node.x < 3) region = 'Classic';
                    else if (node.x < 6) region = 'Medieval';
                    else if (node.x < 9) region = 'Insect';
                    else if (node.x < 12) region = 'Cyborgs';
                    else region = 'Promoters';
                }
                
                cell.setAttribute('data-region', region);

                // Region Icons
                const regionIcons = {
                    'Classic': 'blackPawn.png',
                    'Medieval': 'blackGhost.png',
                    'Insect': 'blackAnt.png',
                    'Cyborgs': 'blackCyborg.png',
                    'Promoters': 'blackPikeman.png'
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

                let contentHtml = `<div style="position:relative; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:space-between; padding: 10px; z-index: 2;">`;
                
                // Main Icon
                if (isCurrent) {
                    // Player: Keep centered and prominent
                    contentHtml += `<div class="map-cell-icon" style="flex-grow:1; display:flex; align-items:center; justify-content:center; width:100%; filter: drop-shadow(0 5px 5px rgba(0,0,0,0.5)); transform: scale(1.0);">${icon}</div>`;
                } else {
                    // Others (Race/Enemies): Small, Top-Right Corner
                    contentHtml += `<div class="map-cell-icon" style="position:absolute; top:8px; right:8px; width:60px; height:60px; display:flex; align-items:center; justify-content:center; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.6)); z-index:10; font-size:30px;">${icon}</div>`;
                }
                
                // Level / Power Indicator (Badge) - Hide if current? Or show?
                // Maybe hide level if it's the player, or show "YOU"
                if (isCurrent) {
                     contentHtml += `<div class="map-cell-level" style="visibility:hidden;">YOU</div>`;
                } else {
                     // Use margin-top: auto to ensure it stays at the bottom even when icon is absolute
                     contentHtml += `<div class="map-cell-level" style="font-size:14px; font-weight:bold; background:linear-gradient(180deg, #444, #222); color:#ffd700; padding:4px 12px; border-radius:12px; margin-top:auto; border: 1px solid #666; box-shadow: 0 2px 4px rgba(0,0,0,0.4);">Lv ${node.enemyPower || '?'}</div>`;
                }
                
                contentHtml += `</div>`;

                cell.innerHTML = contentHtml;
                                  
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
