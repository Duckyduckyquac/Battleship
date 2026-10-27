// index.js
// This will serve as the entrypoint of all other classes

const {View} = require('./view/View.js');

const {Controller} = require('./controller/controller.js');

const {Ai} = require('./model/AI.js');
const {Coordinate} = require('./model/Coordinate.js');
const {Gameboard} = require('./model/Gameboard.js');
const {Player} = require('./model/Player.js');
const {Ship} = require('./model/Ship.js');

// Bind the request processor callback to the view

// ----- model -----
let currentPlayer = null;
let currentPlayerBoard = null;
let currentPlayerShip = null;

let currentAi = null;
let currentAiBoard = null;
let currentAiShip = null;

// ------ view -----
let currentView = new View();

// ------ controller -----
let currentController = new Controller();

currentView.bindRequestCommunication(processRequest);
function processRequest(wrappedRequest){

    let currentRequest = wrappedRequest["request"];
    let currentParameters = wrappedRequest["parameters"];

    if(currentRequest===null||currentRequest===undefined){
        throw new Error("Request in wrappedRequest must not be null");
    }

    switch(currentRequest){
        case "resetGame":
            return processResetGame(currentParameters);
        case "createPlayer":
            return processCreatePlayer(currentParameters);
        case "attackAiEnemy":
            return processAttackAiEnemy(currentParameters);
        case "placeShip":
            return processPlaceShip(currentParameters);
    }
}
function processResetGame(parameters){

}

function processCreatePlayer(parameters){

}

function processAttackAiEnemy(parameters){

}

function processPlaceShip(parameters){

}
