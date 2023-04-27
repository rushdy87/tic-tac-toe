const App = {
  // All our selected HTML Elements
  $: {
    menu: document.querySelector('.menu'),
    menuItems: document.querySelector('.items'),
  },

  init() {
    App.$.menu.addEventListener('click', (event) => {
      App.$.menuItems.classList.toggle('hidden');
    });
  },
};

window.addEventListener('load', App.init);
