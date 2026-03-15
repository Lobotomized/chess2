// Rogue Like Details - Procedural Generation for Trees and Bushes

function drawTree(ctx, tx, ty, squareLength) {
    ctx.save();
    // Deterministic random numbers based on position
    const seed = (tx * 1337) + (ty * 7331);
    const rand1 = Math.abs(Math.sin(seed));
    const rand2 = Math.abs(Math.cos(seed * 0.5));
    const rand3 = Math.abs(Math.sin(seed * 2));
    
    const cx = tx * squareLength + squareLength/2 + (rand1 - 0.5) * squareLength * 0.2;
    const cy = ty * squareLength + squareLength/2 + (rand2 - 0.5) * squareLength * 0.1;
    
    // Scale variation (0.8 to 1.2)
    const scale = 0.85 + rand3 * 0.35;
    const size = squareLength * scale;
    
    // Color variation
    const hueShift = (rand1 - 0.5) * 20; // +/- 10 degrees
    const foliageBase = `hsl(${140 + hueShift}, 50%, 25%)`; // #1e592f approx base
    const foliageHigh = `hsl(${140 + hueShift}, 50%, 40%)`; // #2d8a46 approx base
    const foliageDark = `hsl(${140 + hueShift}, 50%, 15%)`; 

    // Draw ground patch (varied)
    ctx.fillStyle = `hsl(${80 + hueShift/2}, 40%, 25%)`; 
    ctx.beginPath();
    ctx.ellipse(cx, cy + size*0.35, size*0.4, size*0.25, 0, 0, Math.PI*2);
    ctx.fill();

    // Draw Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(cx + size*0.1, cy + size*0.4, size*0.3, size*0.1, 0, 0, Math.PI*2);
    ctx.fill();

    // Trunk - tapered
    const trunkWidthBottom = size*0.18;
    const trunkWidthTop = size*0.1;
    const trunkHeight = size*0.5;
    
    ctx.fillStyle = '#5d4037'; 
    ctx.beginPath();
    ctx.moveTo(cx - trunkWidthBottom/2, cy + size*0.35); // Bottom Left
    ctx.lineTo(cx + trunkWidthBottom/2, cy + size*0.35); // Bottom Right
    ctx.lineTo(cx + trunkWidthTop/2, cy - size*0.1);     // Top Right
    ctx.lineTo(cx - trunkWidthTop/2, cy - size*0.1);     // Top Left
    ctx.fill();
    
    // Trunk details
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(cx - trunkWidthBottom/4, cy + size*0.1, trunkWidthBottom/2, size*0.2);

    // Foliage - Randomized layers (3 to 4)
    const layers = 3 + Math.floor(rand2 * 1.9); 
    
    for (let i = 0; i < layers; i++) {
        const layerY = cy - size*0.1 - (i * size*0.25);
        const layerWidth = size*0.4 - (i * size*0.08);
        const layerHeight = size*0.35;
        
        // Shadow/Dark part
        ctx.fillStyle = foliageDark;
        ctx.beginPath();
        ctx.moveTo(cx, layerY - layerHeight);
        ctx.lineTo(cx + layerWidth, layerY + layerHeight*0.2);
        ctx.lineTo(cx - layerWidth, layerY + layerHeight*0.2);
        ctx.fill();

        // Main part
        ctx.fillStyle = foliageBase;
        ctx.beginPath();
        ctx.moveTo(cx, layerY - layerHeight);
        ctx.lineTo(cx + layerWidth*0.9, layerY + layerHeight*0.1);
        ctx.lineTo(cx - layerWidth*0.9, layerY + layerHeight*0.1);
        ctx.fill();

        // Highlight (Left side source)
        ctx.fillStyle = foliageHigh;
        ctx.beginPath();
        ctx.moveTo(cx, layerY - layerHeight);
        ctx.lineTo(cx - layerWidth*0.3, layerY);
        ctx.lineTo(cx - layerWidth*0.9, layerY + layerHeight*0.1);
        ctx.fill();
    }
    
    // Maybe a flower or mushroom?
    if (rand1 > 0.8) {
        // Draw a small red mushroom
        const mx = cx + size*0.25;
        const my = cy + size*0.35;
        
        ctx.fillStyle = '#eeeeee'; // Stalk
        ctx.fillRect(mx-2, my-5, 4, 6);
        
        ctx.fillStyle = '#e53935'; // Cap
        ctx.beginPath();
        ctx.arc(mx, my-5, 5, Math.PI, 0);
        ctx.fill();
        
        // Dots
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(mx-2, my-7, 1, 0, Math.PI*2);
        ctx.arc(mx+2, my-6, 1, 0, Math.PI*2);
        ctx.fill();
    }
}

function drawBush(ctx, tx, ty, squareLength, mapSeed) {
     // 1. Stable Randomness based on position
     const seed = (tx * mapSeed) + (ty * mapSeed);
     const rand = (offset) => {
         // Use a more chaotic pseudo-random function to avoid patterns
         const x = Math.sin(seed + offset) * 10000;
         return x - Math.floor(x);
     };
     
     // Position
     const cx = tx * squareLength + squareLength / 2;
     const cy = ty * squareLength + squareLength / 2;
     const size = squareLength;

     // Time for animation
     const time = Date.now() / 1000;
     
     // Wind parameters
     const windSpeed = 1.5;
     const windMagnitude = size * 0.05;
     // Main sway depends on time and position
     const swayBase = Math.sin(time * windSpeed + seed) * windMagnitude;
     // "Breath" pulsation for alive feel
     const breath = 1 + Math.sin(time * 0.7 + seed) * 0.02;

     // Color Palette Generation (More varied)
     // Random base hue for each bush
     const hueBase = 90 + (rand(1) - 0.5) * 60; // 60 to 120 (Yellow-Green to Blue-Green)
     const saturation = 40 + rand(2) * 30; // 40-70%
     const lightness = 25 + rand(3) * 15; // 25-40%
     
     const colorDark = `hsl(${hueBase}, ${saturation}%, ${lightness - 10}%)`;
     const colorMid = `hsl(${hueBase}, ${saturation}%, ${lightness}%)`;
     const colorLight = `hsl(${hueBase + 5}, ${saturation}%, ${lightness + 15}%)`;
     const colorHighlight = `hsl(${hueBase + 10}, ${saturation}%, ${lightness + 25}%)`;

     // Shadow (Ground)
     ctx.fillStyle = 'rgba(0,0,0,0.25)';
     ctx.beginPath();
     ctx.ellipse(cx, cy + size * 0.42, size * 0.45, size * 0.15, 0, 0, Math.PI * 2);
     ctx.fill();

     // Helper: Draw a cluster of leaves (a "lobe")
     const drawLeafCluster = (x, y, radius, color, swayFactor) => {
         const currentSway = swayBase * swayFactor;
         const drawX = x + currentSway;
         const drawY = y;
         
         ctx.fillStyle = color;
         ctx.beginPath();
         // Use breath to pulse size slightly
         ctx.arc(drawX, drawY, radius * breath, 0, Math.PI * 2);
         ctx.fill();
         
         // Add texture/detail inside the lobe
         if (radius > size * 0.1) {
              ctx.fillStyle = 'rgba(255,255,255,0.1)';
              const details = 2 + Math.floor(rand(x) * 3);
              for(let k=0; k<details; k++) {
                  const ang = (k/details)*Math.PI*2 + rand(x+k);
                  const d = radius * 0.5 * rand(x+k+1);
                  const rDetail = radius * 0.2 * rand(x+k+2);
                  ctx.beginPath();
                  ctx.arc(drawX + Math.cos(ang)*d, drawY + Math.sin(ang)*d, rDetail, 0, Math.PI*2);
                  ctx.fill();
              }
         }
     };

     // Generate Bush Structure
     const numLobes = 8 + Math.floor(rand(4) * 8); // 8 to 16 lobes
     
     // Layer 1: Dark Background (Larger, lower, less sway)
     for(let i=0; i<numLobes; i++) {
         const angle = (i / numLobes) * Math.PI * 2 + rand(5 + i);
         const dist = size * 0.3;
         const lx = cx + Math.cos(angle) * dist;
         const ly = cy + Math.sin(angle) * dist * 0.6 + size*0.1; // Squashed vertically
         const r = size * (0.15 + rand(i+10)*0.15);
         
         drawLeafCluster(lx, ly, r, colorDark, 0.3); 
     }

     // Layer 2: Mid Body
     for(let i=0; i<numLobes; i++) {
         const angle = (i / numLobes) * Math.PI * 2 + rand(20 + i);
         const dist = size * 0.2;
         const lx = cx + Math.cos(angle) * dist;
         const ly = cy + Math.sin(angle) * dist * 0.8 - size*0.05;
         const r = size * (0.15 + rand(i+30)*0.12);
         
         // Sway increases with height (negative Y relative to center)
         const heightFactor = Math.max(0, (1 - (ly - cy)/size)); 
         drawLeafCluster(lx, ly, r, colorMid, 0.6 * heightFactor);
     }

     // Layer 3: Highlights (Top/Front)
     const numHighlights = Math.floor(numLobes * 0.7);
     for(let i=0; i<numHighlights; i++) {
         const angle = (i / numHighlights) * Math.PI * 2 + rand(40 + i);
         const dist = size * 0.15;
         const lx = cx + Math.cos(angle) * dist;
         const ly = cy + Math.sin(angle) * dist * 0.8 - size*0.15; // Higher up
         const r = size * (0.1 + rand(i+50)*0.1);
         
         const heightFactor = Math.max(0, (1 - (ly - cy)/size)); 
         drawLeafCluster(lx, ly, r, colorLight, 1.0 * heightFactor);
         
         // Extra shiny highlight
         if (rand(i+100) > 0.6) {
              drawLeafCluster(lx - r*0.3, ly - r*0.3, r*0.5, colorHighlight, 1.0 * heightFactor);
         }
     }

     // Details: Berries or Flowers
     const detailType = rand(60);
     if (detailType > 0.5) {
         const isFlower = detailType > 0.8;
         const detailColor = isFlower ? 
             (rand(61)>0.5 ? '#fff176' : '#e1bee7') : // Yellow or Purple flowers
             (rand(62)>0.5 ? '#e53935' : '#8e24aa'); // Red or Purple berries
             
         const numDetails = 5 + Math.floor(rand(70) * 10);
         
         for(let i=0; i<numDetails; i++) {
             // Random positions within the bush radius
             const r = size * 0.35 * Math.sqrt(rand(i+200));
             const theta = rand(i+300) * 2 * Math.PI;
             
             const dx = cx + r * Math.cos(theta);
             const dy = cy + r * Math.sin(theta) - size*0.1; 
             
             const sway = swayBase * Math.max(0, (1 - (dy - cy)/size));
             
             ctx.fillStyle = detailColor;
             ctx.beginPath();
             if (isFlower) {
                  ctx.arc(dx + sway, dy, size*0.04, 0, Math.PI*2);
                  ctx.fill();
                  ctx.fillStyle = 'white';
                  ctx.beginPath();
                  ctx.arc(dx + sway, dy, size*0.015, 0, Math.PI*2);
                  ctx.fill();
             } else {
                 // Berries
                 ctx.arc(dx + sway, dy, size*0.03, 0, Math.PI*2);
                 ctx.fill();
                 // Shine
                 ctx.fillStyle = 'rgba(255,255,255,0.6)';
                 ctx.beginPath();
                 ctx.arc(dx + sway - size*0.01, dy - size*0.01, size*0.01, 0, Math.PI*2);
                 ctx.fill();
             }
         }
     }
     
     // Ground Details (Grass blades around the base)
     const numGrass = 5 + Math.floor(rand(80) * 8);
     ctx.strokeStyle = `hsl(${hueBase}, ${saturation}%, ${lightness-5}%)`;
     ctx.lineWidth = 2;
     for(let i=0; i<numGrass; i++) {
         const gx = cx + (rand(i+90) - 0.5) * size * 0.9;
         const gy = cy + size*0.35 + (rand(i+91) - 0.5) * size * 0.1;
         
         ctx.beginPath();
         ctx.moveTo(gx, gy);
         // Curve the grass slightly with the wind
         ctx.quadraticCurveTo(
             gx + swayBase, 
             gy - size*0.1, 
             gx + (rand(i+92)-0.5)*10 + swayBase*1.5, 
             gy - size*0.15
         );
         ctx.stroke();
     }
}

function drawFountain(ctx, tx, ty, squareLength, mapSeed, scale = 1) {
    const size = squareLength * scale;
    const cx = tx * squareLength + squareLength / 2; // Center X
    const cy = ty * squareLength + squareLength / 2; // Center Y
    const time = Date.now() / 1000;

    // Stable Randomness based on mapSeed
    const seed = (tx * mapSeed) + (ty * mapSeed) + 12345;
    const rand = (offset) => {
        const x = Math.sin(seed + offset) * 10000;
        return x - Math.floor(x);
    };

    // Color Variations based on seed
    const hueShift = (rand(1) - 0.5) * 60; // +/- 30 degrees (Blue to Teal/Purple)
    const waterDeep = `hsl(${200 + hueShift}, 90%, 20%)`; // Default #0277bd is ~200, 97%, 37%
    const waterMid = `hsl(${200 + hueShift}, 85%, 40%)`;
    const waterLight = `hsl(${200 + hueShift}, 80%, 60%)`;
    
    // Clip to the 4 central squares (Max allowed area is 2*squareLength)
    const maxContainerSize = squareLength * 2;
    
    ctx.save();
    ctx.beginPath();
    // Clip to exactly the 2x2 area
    ctx.rect(cx - maxContainerSize/2, cy - maxContainerSize/2, maxContainerSize, maxContainerSize);
    ctx.clip();

    // 1. Water Background (The Pond)
    // Create a subtle gradient for depth
    const grad = ctx.createRadialGradient(cx, cy, size * 0.2, cx, cy, size * 0.8);
    grad.addColorStop(0, waterDeep);
    grad.addColorStop(0.7, waterMid);
    grad.addColorStop(1, waterLight);
    
    ctx.fillStyle = grad;
    ctx.fillRect(cx - maxContainerSize/2, cy - maxContainerSize/2, maxContainerSize, maxContainerSize);

    // 2. Subtle Water Caustics / Texture
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    const causticsSpeed = 0.1 + rand(2) * 0.2; // 0.1 to 0.3
    for(let i=0; i<5; i++) {
        const t = (time * causticsSpeed + i/5) % 1;
        const r = size * (0.2 + t * 0.6);
        
        ctx.beginPath();
        // Wobbly circles
        for(let a=0; a<=Math.PI*2; a+=0.1) {
            const rWobble = r + Math.sin(a*(4 + Math.floor(rand(3)*3)) + time + i)*size*(0.01 + rand(4)*0.02);
            const x = cx + Math.cos(a) * rWobble;
            const y = cy + Math.sin(a) * rWobble;
            if(a===0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    ctx.restore();

    // 3. Fish Animation
    
    // Initialize Fish State if needed
    const pondKey = `${tx}_${ty}_${mapSeed}`; // include mapSeed to refresh on new map
    if (!window.pondFishState) window.pondFishState = {};
    if (!window.pondFishState[pondKey]) {
        window.pondFishState[pondKey] = {
            fish: [],
            lastTime: time
        };
    }
    
    const pondState = window.pondFishState[pondKey];
    const dt = time - pondState.lastTime;
    pondState.lastTime = time;
    
    // Fish Configuration
    const numFish = 4 + Math.floor(rand(5) * 8); // 4 to 11 fish
    const spawnMargin = maxContainerSize * 0.6; // Spawn well outside
    const killMargin = maxContainerSize * 0.6; 

    // Helper: Generate Random Fish
    const createFish = (forceEdge = true, index) => {
        // Use time for spawn randomness, but rand for stable appearance
        const angle = Math.random() * Math.PI * 2;
        const startDist = forceEdge ? spawnMargin : (Math.random() * spawnMargin);
        
        // Start position
        const startX = Math.cos(angle) * startDist;
        const startY = Math.sin(angle) * startDist;
        
        // Target position (roughly opposite side with variance)
        const targetAngle = angle + Math.PI + (Math.random() - 0.5); 
        const targetX = Math.cos(targetAngle) * spawnMargin;
        const targetY = Math.sin(targetAngle) * spawnMargin;
        
        // Velocity
        const speed = size * (0.05 + rand(6 + index)*0.1 + Math.random() * 0.1); // Speed relative to size
        const dx = targetX - startX;
        const dy = targetY - startY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const vx = (dx / dist) * speed;
        const vy = (dy / dist) * speed;
        
        // Appearance (stable per fish index based on seed)
        const fishHue = rand(7 + index) * 360;
        const sat = 50 + rand(8 + index) * 50;
        const light = 40 + rand(9 + index) * 30;
        
        return {
            x: startX,
            y: startY,
            vx: vx,
            vy: vy,
            angle: Math.atan2(vy, vx),
            colorBody: `hsl(${fishHue}, ${sat}%, ${light}%)`,
            colorTail: `hsl(${fishHue}, ${sat}%, ${light - 10}%)`,
            colorFin: `hsl(${fishHue}, ${sat}%, ${light + 10}%)`,
            size: size * (0.04 + rand(10 + index) * 0.05), // Random size
            widthRatio: 0.25 + rand(11 + index) * 0.35, // Chubby or thin
            tailType: Math.floor(rand(12 + index) * 3), // 0: Triangle, 1: Forked, 2: Rounded
            finType: Math.floor(rand(13 + index) * 2),
            wagSpeed: 8 + rand(14 + index) * 12,
            phase: Math.random() * Math.PI * 2,
            id: index
        };
    };

    // Maintain population
    while (pondState.fish.length < numFish) {
        pondState.fish.push(createFish(false, pondState.fish.length));
    }

    // Update and Draw Fish
    pondState.fish.forEach((fish, index) => {
        // Update Position
        const safeDt = Math.min(dt, 0.1); 
        fish.x += fish.vx * safeDt;
        fish.y += fish.vy * safeDt;
        
        // Check bounds
        const distSq = fish.x*fish.x + fish.y*fish.y;
        if (distSq > killMargin*killMargin) {
            pondState.fish[index] = createFish(true, fish.id);
            return;
        }
        
        // Draw Fish
        const fx = cx + fish.x;
        const fy = cy + fish.y;
        
        ctx.save();
        ctx.translate(fx, fy);
        ctx.rotate(fish.angle + Math.PI); 
        ctx.rotate(Math.PI); 
        
        const fLen = fish.size;
        const fWid = fLen * fish.widthRatio;
        
        // Tail Wag
        const wag = Math.sin(time * fish.wagSpeed + fish.phase) * 0.2;
        
        // Draw Tail
        ctx.save();
        ctx.translate(-fLen*0.4, 0); 
        ctx.rotate(wag);
        ctx.fillStyle = fish.colorTail;
        ctx.beginPath();
        if (fish.tailType === 0) { // Triangle
            ctx.moveTo(0, 0);
            ctx.lineTo(-fLen*0.4, -fWid);
            ctx.lineTo(-fLen*0.4, fWid);
        } else if (fish.tailType === 1) { // Forked
            ctx.moveTo(0, 0);
            ctx.lineTo(-fLen*0.5, -fWid*1.2);
            ctx.lineTo(-fLen*0.3, 0);
            ctx.lineTo(-fLen*0.5, fWid*1.2);
        } else { // Rounded fan
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(-fLen*0.5, -fWid, -fLen*0.5, 0);
            ctx.quadraticCurveTo(-fLen*0.5, fWid, 0, 0);
        }
        ctx.fill();
        ctx.restore();
        
        // Draw Body
        ctx.fillStyle = fish.colorBody;
        ctx.beginPath();
        ctx.ellipse(0, 0, fLen*0.6, fWid, 0, 0, Math.PI*2);
        ctx.fill();
        
        // Fins
        ctx.fillStyle = fish.colorFin;
        ctx.save();
        ctx.translate(0, 0);
        ctx.rotate(-Math.PI/4 + wag*0.5);
        ctx.beginPath();
        ctx.ellipse(0, fWid, fLen*0.2, fWid*0.5, 0.5, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(0, -fWid, fLen*0.2, fWid*0.5, -0.5, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
        
        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(fLen*0.3, -fWid*0.4, fLen*0.1, 0, Math.PI*2);
        ctx.arc(fLen*0.3, fWid*0.4, fLen*0.1, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(fLen*0.32, -fWid*0.4, fLen*0.04, 0, Math.PI*2);
        ctx.arc(fLen*0.32, fWid*0.4, fLen*0.04, 0, Math.PI*2);
        ctx.fill();

        ctx.restore();
        
        // Ripple trail
        if (Math.random() > 0.95) {
             ctx.strokeStyle = 'rgba(255,255,255,0.15)';
             ctx.lineWidth = 1;
             ctx.beginPath();
             ctx.arc(fx, fy, fLen*0.4, 0, Math.PI*2);
             ctx.stroke();
        }
    });

    // 4. Lily Pads / Floating Debris (Optional detail)
    const drawLilyPad = (lx, ly, lSize, rot) => {
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(rot);
        ctx.fillStyle = '#4caf50';
        ctx.beginPath();
        ctx.arc(0, 0, lSize, 0.2, Math.PI * 2 - 0.2);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.strokeStyle = '#388e3c';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0,0); ctx.lineTo(lSize, 0);
        ctx.stroke();
        
        // Add a flower occasionally
        if (lSize > size*0.05 && rand(lx+ly) > 0.5) {
            ctx.fillStyle = (rand(lx) > 0.5) ? '#f48fb1' : '#fff59d'; // Pink or Yellow
            for(let f=0; f<5; f++) {
                ctx.beginPath();
                ctx.ellipse(Math.cos(f*Math.PI*2/5)*lSize*0.3, Math.sin(f*Math.PI*2/5)*lSize*0.3, lSize*0.2, lSize*0.1, f*Math.PI*2/5, 0, Math.PI*2);
                ctx.fill();
            }
            ctx.fillStyle = '#ffb300';
            ctx.beginPath();
            ctx.arc(0, 0, lSize*0.15, 0, Math.PI*2);
            ctx.fill();
        }
        
        ctx.restore();
    };

    // Stable lily pads positions
    const numPads = 2 + Math.floor(rand(15) * 5); // 2 to 6 lily pads
    for(let p=0; p<numPads; p++) {
        const pAngle = rand(16 + p) * Math.PI * 2;
        const pDist = size * (0.1 + rand(17 + p) * 0.3);
        const lx = cx + Math.cos(pAngle) * pDist;
        const ly = cy + Math.sin(pAngle) * pDist;
        const lSize = size * (0.04 + rand(18 + p) * 0.05);
        const lRot = rand(19 + p) * Math.PI * 2 + Math.sin(time*0.5 + p)*0.1; // Slow rotation wobble
        
        drawLilyPad(lx, ly, lSize, lRot);
    }

    // Restore clipping
    ctx.restore();
}

if (typeof window !== 'undefined') {
    window.drawTree = drawTree;
    window.drawBush = drawBush;
    window.drawFountain = drawFountain;
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = { drawTree, drawBush, drawFountain };
}