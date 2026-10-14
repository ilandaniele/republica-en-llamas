import type { GameState } from '@republica/game-engine';

export function StatBoxes({ gameState, isWin }: { gameState: GameState; isWin: boolean }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-3 px-6 py-4">
        <div className="pixel-border p-2 text-center" style={{ background: '#e8e4d0' }}>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '6px',
              color: '#666',
              marginBottom: '4px',
            }}
          >
            TURNOS
          </div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px', color: '#222' }}>
            {gameState.turn}/50
          </div>
        </div>
        <div className="pixel-border p-2 text-center" style={{ background: '#e8e4d0' }}>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '6px',
              color: '#666',
              marginBottom: '4px',
            }}
          >
            SCORE
          </div>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '10px',
              color: isWin ? '#2a6e00' : '#8b0000',
            }}
          >
            {gameState.score.toLocaleString()}
          </div>
        </div>
        <div className="pixel-border p-2 text-center" style={{ background: '#e8e4d0' }}>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '6px',
              color: '#666',
              marginBottom: '4px',
            }}
          >
            INF FINAL
          </div>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '10px',
              color: gameState.economic.inflation > 30 ? '#8b0000' : '#2a6e00',
            }}
          >
            {gameState.economic.inflation.toFixed(0)}%
          </div>
        </div>
      </div>
    </>
  );
}
