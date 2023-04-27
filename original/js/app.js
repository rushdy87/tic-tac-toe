const App = {
  // All our selected HTML Elements
  $: {
    menu: document.querySelector('[data-id="menu"'),
    menuItems: document.querySelector('[data-id="menu-items"'),
    resetBtn: document.querySelector('[data-id="reset-btn"'),
    newRoundBtn: document.querySelector('[data-id="new-round-btn"'),
    squares: document.querySelectorAll('[data-id="square"'),
    modal: document.querySelector('[data-id="modal"'),
    modalContents: document.querySelector('[data-id="modal-contents"'),
    modalText: document.querySelector('[data-id="modal-text"'),
    modalBtn: document.querySelector('[data-id="modal-btn"'),
    turn: document.querySelector('[data-id="turn"'),
  },

  state: {
    moves: [],
  },

  getGameStatus(moves) {
    const player1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.squareId);
    const player2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.squareId);

    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    let winner = null;

    winningPatterns.forEach((pattern) => {
      const player1Wins = pattern.every((value) =>
        player1Moves.includes(value)
      );
      const player2Wins = pattern.every((value) =>
        player2Moves.includes(value)
      );

      if (player1Wins) winner = 1;
      if (player2Wins) winner = 2;
    });

    return {
      status:
        moves.length === 9 || winner !== null ? 'complete' : 'in-progress',
      winner,
    };
  },

  init() {
    App.registerEventListeners();
  },

  registerEventListeners() {
    // DONE
    App.$.menu.addEventListener('click', (event) => {
      App.$.menuItems.classList.toggle('hidden');
    });

    // TODO
    App.$.resetBtn.addEventListener('click', () => {
      console.log('Reset the game');
    });

    // TODO
    App.$.newRoundBtn.addEventListener('click', () => {
      console.log('Add a new Round');
    });

    // DONE
    App.$.modalBtn.addEventListener('click', (event) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => square.replaceChildren());
      App.$.modal.classList.add('hidden');
    });

    // TODO
    App.$.squares.forEach((square) => {
      square.addEventListener('click', (event) => {
        // Cheak if there is already play, if so, return early

        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };

        if (hasMove(+square.id)) return;

        const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);

        // Determine which player icon to add to the squre
        const currentPlayer =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(App.state.moves.at(-1).playerId);

        const nextPlayer = getOppositePlayer(currentPlayer);

        const squareIcon = document.createElement('i');
        const turnIcon = document.createElement('i');
        const turnLable = document.createElement('p');
        turnLable.innerText = `Player ${nextPlayer}, You are up`;

        if (currentPlayer === 1) {
          squareIcon.classList.add('fa-solid', 'fa-x', 'yellow');
          turnIcon.classList.add('fa-solid', 'fa-0', 'turquoise');
          turnLable.classList = 'turquoise';
        } else {
          squareIcon.classList.add('fa-solid', 'fa-o', 'turquoise');
          turnIcon.classList.add('fa-solid', 'fa-x', 'yellow');
          turnLable.classList = 'yellow';
        }

        App.$.turn.replaceChildren(turnIcon, turnLable);

        App.state.moves.push({ squareId: +square.id, playerId: currentPlayer });

        square.replaceChildren(squareIcon);

        // Cheak if there is a winer or tie game.

        const game = App.getGameStatus(App.state.moves);

        if (game.status === 'complete') {
          App.$.modal.classList.remove('hidden');
          let message;
          if (game.winner) {
            message = `Player ${game.winner} Win.`;
          } else {
            message = 'The Game is tie';
          }
          App.$.modalText.textContent = message;
        }
      });
    });
  },
};

window.addEventListener('load', App.init);
