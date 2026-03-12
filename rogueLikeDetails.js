// Rogue Like Details - Procedural Generation for Trees and Bushes

function drawTree(ctx, tx, ty, squareLength) {
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

function drawBush(ctx, tx, ty, squareLength) {
     // 1. Stable Randomness based on position
     const seed = (tx * 1337) + (ty * 7331);
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

if (typeof window !== 'undefined') {
    window.drawTree = drawTree;
    window.drawBush = drawBush;
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = { drawTree, drawBush };
}