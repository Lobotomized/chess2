const forcedAlgorithms = [
    {
        name: 'ladderMateTwoRooks',
        checkCondition: function(state, color) { 
            
            let myPieces = state.pieces.filter(p => p.color === color);
            let enemyPieces = state.pieces.filter(p => p.color !== color);
            
            if (myPieces.length !== 2 || enemyPieces.length !== 1) return false;
            
            let myRooks = myPieces.filter(p => p.icon.includes('Rook'));
            let enemyKing = enemyPieces.filter(p => p.icon.includes('King'));
            console.log9('here?')
            return  (enemyKing.length === 1 && myRooks.length === 2);
        },
        execute: function(state, color, depth, removedTurns, mags, filters) { 
            console.log('and here?')
            // Use alpha-beta move generator to get all legal moves
            let moves = generateMovesFromPiecesAlphaBeta(state, color, filters);
            if (!moves || moves.length === 0) return null;
            
            let myPieces = state.pieces.filter(p => p.color === color);
            let oldEnemyKing = state.pieces.find(p => p.color !== color && p.icon.includes('King'));
            
            let targetY = oldEnemyKing.y < 4 ? 0 : 7;
            let pushDirection = targetY === 0 ? -1 : 1;
            
            let bestMove = moves[0];
            let bestScore = -Infinity;
            
            for (let m of moves) {
                if (m.won === color) return m; // Immediate checkmate
                if (m.won) continue; // Skip moves that draw or lose
                
                let newMyPieces = m.pieces.filter(p => p.color === color);
                let newEnemyPieces = m.pieces.filter(p => p.color !== color);
                
                let newMyRooks = newMyPieces.filter(p => p.icon.includes('Rook'));
                let newEnemyKing = newEnemyPieces.find(p => p.icon.includes('King'));
                
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
                
                // Tiebreaker 2: keep rooks close to the action on Y
                let distY = Math.abs(newMyRooks[0].y - newEnemyKing.y) + Math.abs(newMyRooks[1].y - newEnemyKing.y);
                score -= distY;
                
                // Discourage moving the King unless necessary
                let pieceMoved = myPieces[m.pieceCounter];
                if (pieceMoved && pieceMoved.icon.includes('King')) {
                    score -= 500;
                }
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = m;
                }
            }
            
            return bestMove;
        }
    }
];