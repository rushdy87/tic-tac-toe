import type { Player } from './types';
import Store from './store.js';
import View from './view.js';

// Our players "config" - defines icons, colors, name, etc.
const players: Player[] = [
  {
    id: 1,
    name: 'Player 1',
    iconClass: 'fa-x',
    colorClass: 'turquoise',
  },
  {
    id: 2,
    name: 'Player 2',
    iconClass: 'fa-o',
    colorClass: 'yellow',
  },
];

//
function init() {
  const view = new View();
  const store = new Store('ttt-storge-key', players);

  // Current tab state changes.
  store.addEventListener('stateChange', () => {
    view.render(store.game, store.stats);
  });

  // Different tab state changes.
  window.addEventListener('storage', () => {
    console.log('State changed from another tap');
    view.render(store.game, store.stats);
  });

  // The first load of the document.
  view.render(store.game, store.stats);

  view.bindGameResetEvent((event) => {
    store.reset();
  });

  view.bindNewRoundEvent((event) => {
    store.newRound();
  });

  view.bindPlayerMoveEvent((square) => {
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) {
      return;
    }

    // Advance to the next state by pushing the move to the moves array
    store.playerMove(+square.id);
  });
}

window.addEventListener('load', init);
