const {View} = require('../view/View.js');
const {Coordinate} = require('../model/Coordinate.js');
const {GameManager} = require('../model/GameManager.js');
const {BoardInformationForViewModule} = require('../utilities/ViewBoardInformation.js');

class Controller{
    constructor(){
       this.currentView = new View(); 

       this.currentGameManager = new GameManager();


       // ----- Binding processRequest to receive requests from View -----
       this.currentView.bindRequestCommunication(this.processRequest.bind(this));
    }
    
    processRequest(wrappedRequest){

        let currentRequest = wrappedRequest["request"];
        let currentParameters = wrappedRequest["parameters"];

        if(currentRequest===null||currentRequest===undefined){
            throw new Error("Request in wrappedRequest must not be null");
        }

        switch(currentRequest){
            case "resetGame":
                return this.#processResetGame();
            case "newGame":
                return this.#processNewGame();
            case "showGameboardScreen":
                return this.#processShowGameboardScreen();
            case "createPlayerAndEnemy":
                return this.#processCreatePlayerAndEnemy(currentParameters);
            case "attackAiEnemy":
                return this.#processAttackAiEnemy(currentParameters);
            case "placeShip":
                return this.#processPlaceShip(currentParameters);
            case "changeShipTypeSelection":
                return this.#processChangeShipTypeSelection();
        }
    }

    #checkIfEnemyAndPlayerExists(){
        if(this.currentGameManager.player===null||this.currentGameManager.enemy===null){
            return false;
        }
        return true;
    }

    #processResetGame(){
        let shouldContinue = this.#checkIfEnemyAndPlayerExists();
        if(!shouldContinue){
            return false;
        }
        this.currentGameManager.resetGame();
        this.#processShowGameboardScreen();
        return true;
    }

    #processNewGame(){
        this.currentView.showPlayerCreationScreen();
        let shouldInvokeNewGame = this.#checkIfEnemyAndPlayerExists();
        if(!shouldInvokeNewGame){
            return false;
        }
        this.currentGameManager.newGame();
        return true;
    }

    #processShowGameboardScreen(){
        let shouldContinue = this.#checkIfEnemyAndPlayerExists();
        if(!shouldContinue){
            return false;
        }

        let playerInformation = new BoardInformationForViewModule
                                (this.currentGameManager.player.gameboard);

        let enemyInformation = new BoardInformationForViewModule
                               (this.currentGameManager.enemy.gameboard);
        
        this.currentView.showGameboardScreen(playerInformation, enemyInformation);
        
        return true;
    }

    #processCreatePlayerAndEnemy(parameters){
        let playerName = parameters[0];
        this.currentGameManager.createPlayer(playerName);

        let enemyName = "bot";
        this.currentGameManager.createEnemy(enemyName);
        this.#processShowGameboardScreen();
        return true;    
    }

    #processAttackAiEnemy(parameters){
        let shouldContinue = this.#checkIfEnemyAndPlayerExists();
        if(!shouldContinue){
            return false;
        }

        let coordinatePayload = parameters[0];
        coordinatePayload = new Coordinate(coordinatePayload.row, coordinatePayload.column);
        let result = this.currentGameManager.handleAttackingPhase(coordinatePayload);

        if(typeof result === "boolean"){
            this.#processShowGameboardScreen();
            return result;
        }
        
        this.currentView.showWinningScreen(result);
    }

    #processPlaceShip(parameters){
        let shouldContinue = this.#checkIfEnemyAndPlayerExists();
        if(!shouldContinue){
            return false;
        }

        let [coord1, coord2, shipTypeToPlace] = parameters;
        console.log("Attempting placement with:", { coord1, coord2, shipTypeToPlace });

        let placementSuccessful = this.currentGameManager.handleShipPlacementPhase(coord1, coord2, shipTypeToPlace);
        console.log("Placement result:", placementSuccessful);
        
        this.#processShowGameboardScreen();
        return placementSuccessful;
    }

    #processChangeShipTypeSelection(){
        this.#processShowGameboardScreen();
        return true;
    }

}

module.exports = {Controller};