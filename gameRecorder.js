(function() {
    let recordedGames = JSON.parse(localStorage.getItem('chess2_recorded_games') || '[]');
    let alreadyRecordedIds = JSON.parse(localStorage.getItem('chess2_already_recorded_ids') || '[]');

    function checkAndRecord() {
        let currentState = null;
        if (typeof state !== 'undefined' && state && state.won) {
            currentState = state;
        } else if (typeof hotseatGame !== 'undefined' && hotseatGame && hotseatGame.state && hotseatGame.state.won) {
            currentState = hotseatGame.state;
        }

        if (currentState && currentState.won && currentState.recordMoves) {
            if (!currentState.gameRecordId) {
                currentState.gameRecordId = Date.now() + '_' + Math.random();
            }
            
            if (!alreadyRecordedIds.includes(currentState.gameRecordId)) {
                alreadyRecordedIds.push(currentState.gameRecordId);
                localStorage.setItem('chess2_already_recorded_ids', JSON.stringify(alreadyRecordedIds));
                recordGame(currentState);
            }
        }
    }

    function recordGame(gameState) {
        if (!gameState.moveHistory || gameState.moveHistory.length === 0) return;

        const record = {
            id: gameState.gameRecordId,
            date: new Date().toISOString(),
            metadata: gameState.gameMetadata || { mode: 'unknown', vsBot: false },
            whiteRace: gameState.whiteRace || 'classic',
            blackRace: gameState.blackRace || 'classic',
            moves: gameState.moveHistory,
            winner: gameState.won
        };

        // For roguelike or special modes, we might need to capture the starting pieces
        if (gameState.initialPieces && gameState.initialPieces.length > 0) {
            record.initialPieces = gameState.initialPieces;
        }
        if (gameState.initialBoard && gameState.initialBoard.length > 0) {
            record.initialBoard = gameState.initialBoard;
        }

        recordedGames.push(record);
        localStorage.setItem('chess2_recorded_games', JSON.stringify(recordedGames));
        syncGames();
    }

    function syncGames() {
        if (recordedGames.length === 0) return;
        if (!navigator.onLine) return;

        fetch('/api/record-games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ games: recordedGames })
        })
        .then(res => {
            if (res.ok) {
                recordedGames = [];
                localStorage.setItem('chess2_recorded_games', '[]');
                console.log('Successfully synced game records to server.');
            }
        })
        .catch(err => console.error('Failed to sync games:', err));
    }

    // Check periodically if a game has ended
    setInterval(checkAndRecord, 1000);

    // Try to sync on load and when coming online
    window.addEventListener('online', syncGames);
    setTimeout(syncGames, 2000);
})();