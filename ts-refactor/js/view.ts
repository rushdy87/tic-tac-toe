import type { Move, Player } from "./types";
import type Store from "./store";

class View {

  $: Record<string, Element> = {};
  $$: Record<string, NodeListOf<Element>> = {};

  constructor() {
    this.$.menu = this.#qs('[data-id="menu"');
    this.$.menuBtn = this.#qs('[data-id="menu-btn"]');
    this.$.menuItems = this.#qs('[data-id="menu-items"');
    this.$.resetBtn = this.#qs('[data-id="reset-btn"');
    this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"');
    this.$.modal = this.#qs('[data-id="modal"');
    this.$.modalContents = this.#qs('[data-id="modal-contents"');
    this.$.modalText = this.#qs('[data-id="modal-text"');
    this.$.modalBtn = this.#qs('[data-id="modal-btn"');
    this.$.turn = this.#qs('[data-id="turn"');
    this.$.p1Wins = this.#qs('[data-id="p1-wins"');
    this.$.ties = this.#qs('[data-id="ties"');
    this.$.p2Wins = this.#qs('[data-id="p2-wins"');
    this.$.grid = this.#qs('[data-id="grid"]');

    this.$$.squares = this.#qsAll('[data-id="square"');

    /**
     * UI-only event listeners
     *
     * These are listeners that do not mutate state and therefore
     * can be contained within View entirely.
     */

    this.$.menuBtn.addEventListener('click', (event) => {
      this.#toggleMenue();
    });
  }

  /**
   * Events that are handled by the "Controller" in app.js
   * ----------------------------------------------------------
   */

  bindGameResetEvent(handler: EventListener) {
    this.$.resetBtn.addEventListener('click', handler);
    this.$.modalBtn.addEventListener('click', handler);
  }

  bindNewRoundEvent(handler: EventListener) {
    this.$.newRoundBtn.addEventListener('click', handler);
  }

  bindPlayerMoveEvent(handler: EventListener) {
    this.#delegate(this.$.grid, '[data-id="square"]', 'click', handler);
  }

  render(game: Store['game'], stats: Store['stats']) {
    const { playerWithStats, ties } = stats;
    const {
      moves,
      currentPlayer,
      status: { isComplete, winner },
    } = game;

    this.#closeAll();
    this.#clearMoves();
    this.#updateScorebord(
      playerWithStats[0].wins,
      playerWithStats[1].wins,
      ties
    );
    this.#initializeMoves(moves);

    if (isComplete) {
      this.#openModal(winner ? `${winner.name} wines` : 'Tie');
      return;
    }
    this.#setTurnIndicator(currentPlayer);
  }

  /**
   * All methods below ⬇️ are private utility methods used for updating the UI
   * -----------------------------------------------------------------------------
   */

  #updateScorebord(p1Wins: number, p2Wins: number, ties: number) {
    this.$.p1Wins.textContent = `${p1Wins} Wins`;
    this.$.p2Wins.textContent = `${p2Wins} Wins`;
    this.$.ties.textContent = `${ties} Ties`;
  }

  #openModal(message: string) {
    this.$.modal.classList.remove('hidden');
    this.$.modalText.textContent = message;
  }

  #closeAll() {
    this.#closeModal();
    this.#closeMenu();
  }

  #clearMoves() {
    this.$$.squares.forEach((square) => square.replaceChildren());
  }

  #initializeMoves(moves: Move[]) {
    this.$$.squares.forEach((square) => {
      const existingMoves = moves.find((move) => move.squareId === +square.id);
      if (existingMoves) {
        this.#handlePlayerMove(square, existingMoves.player);
      }
    });
  }

  #closeModal() {
    this.$.modal.classList.add('hidden');
  }

  #closeMenu() {
    this.$.menuItems.classList.add('hidden');
    this.$.menuBtn.classList.remove('border');

    const icon = this.#qs('i', this.$.menuBtn);

    icon.classList.add('fa-chevron-down');
    icon.classList.remove('fa-chevron-up');
  }

  #toggleMenue() {
    this.$.menuItems.classList.toggle('hidden');
    this.$.menuBtn.classList.toggle('border');

    const icon = this.#qs('i', this.$.menuBtn);

    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
  }

  #handlePlayerMove(squareEl: Element, player: Player) {
    const icon = document.createElement('i');
    icon.classList.add('fa-solid', player.iconClass, player.colorClass);
    squareEl.replaceChildren(icon);
  }

  #setTurnIndicator(player: Player) {
    const icon = document.createElement('i');
    const label = document.createElement('p');

    icon.classList.add('fa-solid', player.colorClass, player.iconClass);

    label.classList.add(player.colorClass);
    label.innerText = `${player.name}, you're up!`;

    this.$.turn.replaceChildren(icon, label);
  }

  #qs(selector: string, parent?: Element) {
    const element = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);

    if (!element) {
      throw new Error(`Could not find element with ${selector}`);
    }
    return element;
  }

  #qsAll(selector: string) {
    const elementsList = document.querySelectorAll(selector);

    if (!elementsList) {
      throw new Error(`Could not find elements with ${selector}`);
    }
    return elementsList;
  }

  /**
   * Rather than registering event listeners on every child element in our Tic Tac Toe grid, we can
   * listen to the grid container and derive which square was clicked using the matches() function.
   *
   * @param {*} el the "container" element you want to listen for events on
   * @param {*} selector the "child" elements within the "container" you want to handle events for
   * @param {*} eventKey the event type you are listening for (e.g. "click" event)
   * @param {*} handler the callback function that is executed when the specified event is triggered on the specified children
   */
  #delegate(
    el: Element,
    selector: string,
    eventKey: string,
    handler: (el: Element) => void
  ) {
    el.addEventListener(eventKey, (event) => {

      if (!(event.target instanceof Element)) {
        throw new Error('Event target not found!');
      }

      if (event.target.matches(selector)) {
        handler(event.target);
      }
    });
  }
}

export default View;
