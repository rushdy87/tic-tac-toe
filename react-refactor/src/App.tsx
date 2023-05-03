import classNames from 'classnames';
import { Footer, Menu, Modal } from './components';
import { GameState, Player } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { driveGame, driveStats } from './utils';
import './App.css';

const App = () => {
  const [state, setState] = useLocalStorage<GameState>('game-state-key', {
    currentGameMoves: [],
    history: {
      currentRoundGames: [],
      allGames: [],
    },
  });

  const game = driveGame(state);
  const stats = driveStats(state);

  const resetGame = (isNewRound: boolean) => {
    setState((prev) => {
      const stateClone = structuredClone(prev);

      if (game.status.isComplete) {
        const { moves, status } = game;
        stateClone.history.currentRoundGames.push({ moves, status });
      }

      stateClone.currentGameMoves = [];

      if (isNewRound) {
        stateClone.history.allGames.push(
          ...stateClone.history.currentRoundGames
        );
        stateClone.history.currentRoundGames = [];
      }
      return stateClone;
    });
  };

  const handlePlayerMove = (squareId: number, player: Player) => {
    setState((prev) => {
      const stateClone = structuredClone(prev);
      stateClone.currentGameMoves.push({
        squareId,
        player,
      });

      return stateClone;
    });
  };

  return (
    <>
      <main>
        <div className="grid">
          <div className={classNames('turn', game.currentPlayer.colorClass)}>
            <i
              className={classNames('fa-solid', game.currentPlayer.iconClass)}
            ></i>
            <p>{game.currentPlayer.name} you're up!</p>
          </div>

          <Menu onAction={(action) => resetGame(action === 'new-round')} />

          {/* <!-- Game board --> */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((squareId) => {
            const existingMove = game.moves.find(
              (move) => move.squareId === squareId
            );

            return (
              <div
                key={squareId}
                className="square shadow"
                onClick={() => {
                  if (existingMove) return;
                  handlePlayerMove(squareId, game.currentPlayer);
                }}
              >
                {existingMove && (
                  <i
                    className={classNames(
                      'fa-solid',
                      existingMove.player.colorClass,
                      existingMove.player.iconClass
                    )}
                  ></i>
                )}
              </div>
            );
          })}

          {/* <!-- Scoreboard --> */}
          <div
            className="score shadow"
            style={{ backgroundColor: 'var(--turquoise)' }}
          >
            <p>Player 1</p>
            <span>{stats.playerWithStats[0].wins} Wins</span>
          </div>
          <div
            className="score shadow"
            style={{ backgroundColor: 'var(--light-gray)' }}
          >
            <p>Ties</p>
            <span>{stats.ties}</span>
          </div>
          <div
            className="score shadow"
            style={{ backgroundColor: 'var(--yellow)' }}
          >
            <p>Player 2</p>
            <span>{stats.playerWithStats[1].wins} Wins</span>
          </div>
        </div>
      </main>

      <Footer />
      {game.status.isComplete && (
        <Modal
          message={
            game.status.winner ? `${game.status.winner.name} Wins` : 'Tie!'
          }
          onClick={() => resetGame(false)}
        />
      )}
    </>
  );
};

export default App;
