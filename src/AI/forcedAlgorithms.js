function isKing(p) {
    if (p.icon && p.icon.includes('King')) return true;
    if (p.icon && p.icon.includes('Crystal')) return true;
    if (!p.value || p.value <= 500) return false;
    
    if (!p.moves) return true;
    if (p.moves.length > 8) return false;
    for (let m of p.moves) {
        if (m.repeat) return false;
        let mx = m.x || 0;
        let my = m.y || 0;
        if (Math.abs(mx) > 1 || Math.abs(my) > 1) return false;
        if (m.limit && m.limit > 1) return false;
    }
    return true;
}

function isRook(p) {
    if (p.icon && p.icon.includes('Rook')) return true;
    if (!p.moves) return false;
    
    let hasUp = false;
    let hasDown = false;
    let hasLeft = false;
    let hasRight = false;
    
    for (let m of p.moves) {
        if (m.repeat && (!m.limit || m.limit >= 7) && !m.impotent) {
            if (m.x === 0 && m.y === -1) hasUp = true;
            if (m.x === 0 && m.y === 1) hasDown = true;
            if (m.x === -1 && m.y === 0) hasLeft = true;
            if (m.x === 1 && m.y === 0) hasRight = true;
        }
    }
    
    return hasUp && hasDown && hasLeft && hasRight;
}

function isQueen(p) {
    if (p.icon && p.icon.includes('Queen')) return true;
    if (!p.moves) return false;
    
    let hasUp = false, hasDown = false, hasLeft = false, hasRight = false;
    let hasUpRight = false, hasUpLeft = false, hasDownRight = false, hasDownLeft = false;
    
    for (let m of p.moves) {
        if (m.repeat && (!m.limit || m.limit >= 7) && !m.impotent) {
            if (m.x === 0 && m.y === -1) hasUp = true;
            if (m.x === 0 && m.y === 1) hasDown = true;
            if (m.x === -1 && m.y === 0) hasLeft = true;
            if (m.x === 1 && m.y === 0) hasRight = true;
            if (m.x === 1 && m.y === -1) hasUpRight = true;
            if (m.x === -1 && m.y === -1) hasUpLeft = true;
            if (m.x === 1 && m.y === 1) hasDownRight = true;
            if (m.x === -1 && m.y === 1) hasDownLeft = true;
        }
    }
    
    return hasUp && hasDown && hasLeft && hasRight && hasUpRight && hasUpLeft && hasDownRight && hasDownLeft;
}

const forcedAlgorithms = [
    {
        name: 'ladderMateTwoRooks',
        checkCondition: function(state, color) { 
            let myPieces = state.pieces.filter(p => p.color === color);
            let enemyPieces = state.pieces.filter(p => p.color !== color);
            
            let myRooks = myPieces.filter(p => isRook(p));
            let enemyKing = enemyPieces.filter(p => isKing(p));
            
            if (myRooks.length < 2 || enemyKing.length !== 1) return false;
            
            let r1 = myRooks[0];
            let r2 = myRooks[1];
            let k = enemyKing[0];
            
            let targetY = k.y < 4 ? 0 : 7;
            
            let minY = Math.min(r1.y, r2.y, k.y, targetY);
            let maxY = Math.max(r1.y, r2.y, k.y, targetY);
            let minX = Math.min(r1.x, r2.x, k.x);
            let maxX = Math.max(r1.x, r2.x, k.x);
            
            let otherPieces = state.pieces.filter(p => p !== r1 && p !== r2 && p !== k);
            
            let isBlocked = otherPieces.some(p => 
                p.x >= minX && p.x <= maxX && 
                p.y >= minY && p.y <= maxY
            );
            
            return !isBlocked;
        },
        execute: function(state, color, depth, removedTurns, mags, filters) { 
            // Use alpha-beta move generator to get all legal moves
            let moves = generateMovesFromPiecesAlphaBeta(state, color, filters);
            if (!moves || moves.length === 0) return null;
            
            let myPieces = state.pieces.filter(p => p.color === color);
            let oldEnemyKing = state.pieces.find(p => p.color !== color && isKing(p));
            
            let targetY = oldEnemyKing.y < 4 ? 0 : 7;
            let pushDirection = targetY === 0 ? -1 : 1;
            
            let bestMove = moves[0];
            let bestScore = -Infinity;
            
            for (let m of moves) {
                if (m.won === color) return m; // Immediate checkmate
                if (m.won) continue; // Skip moves that draw or lose
                
                let newMyPieces = m.pieces.filter(p => p.color === color);
                let newEnemyPieces = m.pieces.filter(p => p.color !== color);
                
                let newMyRooks = newMyPieces.filter(p => isRook(p));
                let newEnemyKing = newEnemyPieces.find(p => isKing(p));
                
                if (!newEnemyKing || newMyRooks.length < 2) continue;
                
                let wallY = newEnemyKing.y - pushDirection;
                let checkY = newEnemyKing.y;
                
                let score = 0;
                
                // Penalty if any rook is under attack by the king (distance <= 1)
                let isRook1Attacked = Math.abs(newMyRooks[0].x - newEnemyKing.x) <= 1 && Math.abs(newMyRooks[0].y - newEnemyKing.y) <= 1;
                let isRook2Attacked = Math.abs(newMyRooks[1].x - newEnemyKing.x) <= 1 && Math.abs(newMyRooks[1].y - newEnemyKing.y) <= 1;
                if (isRook1Attacked) score -= 10000;
                if (isRook2Attacked) score -= 10000;
                
                // Reward rooks being on different X files to avoid blocking
                if (newMyRooks[0].x !== newMyRooks[1].x) score += 1000;
                
                // Evaluate formation cost (how many Y-steps away from perfect wall+check formation)
                let costFormation1 = Math.abs(newMyRooks[0].y - wallY) + Math.abs(newMyRooks[1].y - checkY);
                let costFormation2 = Math.abs(newMyRooks[1].y - wallY) + Math.abs(newMyRooks[0].y - checkY);
                let bestFormationCost = Math.min(costFormation1, costFormation2);
                
                // Heavily penalize being out of formation, smoothly pulling them into position
                score -= bestFormationCost * 500;
                
                // Reward forming the wall
                let hasWall = (newMyRooks[0].y === wallY || newMyRooks[1].y === wallY);
                if (hasWall) score += 5000;
                
                // Reward delivering check (best if wall is already present)
                let hasCheck = (newMyRooks[0].y === checkY || newMyRooks[1].y === checkY);
                if (hasWall && hasCheck) score += 4000; 
                else if (hasCheck) score += 2000; 
                
                // Tiebreaker 1: maximize distance from King on X axis to stay safe
                let distX = Math.abs(newMyRooks[0].x - newEnemyKing.x) + Math.abs(newMyRooks[1].x - newEnemyKing.x);
                score += distX * 10;
                
                // Discourage moving the King unless necessary
                let pieceMoved = myPieces[m.pieceCounter];
                if (pieceMoved && isKing(pieceMoved)) {
                    score -= 500;
                }
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = m;
                }
            }
            
            return bestMove;
        }
    },
];
