const App = {
  // All our selected HTML Elements
  $: {
    menu: document.querySelector('[data-id="menu"'),
    menuItems: document.querySelector('[data-id="menu-items"'),
    resetBtn: document.querySelector('[data-id="reset-btn"'),
    newRoundBtn: document.querySelector('[data-id="new-round-btn"'),
  },

  init() {
    App.$.menu.addEventListener('click', (event) => {
      App.$.menuItems.classList.toggle('hidden');
    });

    App.$.resetBtn.addEventListener('click', () => {
      console.log('Reset the game');
    });

    App.$.newRoundBtn.addEventListener('click', () => {
      console.log('Add a new Round');
    });
  },
};

window.addEventListener('load', App.init);
