// index.js
// This will serve as the entrypoint of all other classes

require('./index.css');

 const {Controller} = require('./controller/Controller.js');

 let currentController = new Controller();
 currentController.currentView.showPlayerCreationScreen();