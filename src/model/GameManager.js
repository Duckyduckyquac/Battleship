const {Player} = require('../model/Player.js');
const {Ai} = require('../model/AI.js');
const {Ship} = require('../model/Ship.js');
const {Gameboard} = require('../model/Gameboard.js');
const {Coordinate} = require('../model/Coordinate.js');

class GameManager{
    /**
     * 
     * @param {Player} player 
     * @param {Ai} enemy 
     */
    constructor(){
        this.player = null;
        this.enemy = null;

        this.phases = ["shipPlacement", "attacking"];
        this.currentPhase = this.phases[0];

        this.whoWon = null;
    }

    /**
     * 
     * @param {String} playerName 
     */
    createPlayer(playerName){
        let newGameboard = new Gameboard();
        let newPlayer = new Player(newGameboard, playerName);
        this.player = newPlayer;
    }

    /**
     * 
     * @param {String} enemyName 
     */
    createEnemy(enemyName){
        let newGameboard = new Gameboard();
        let newEnemy = new Ai(newGameboard, enemyName);
        this.enemy = newEnemy;
    }
    /**
     * 
     * @param {Number} shipType 
     */

    hasWin(){
        let playerGameboard = this.player.gameboard;
        let enemyGameboard = this.enemy.gameboard;

        if(playerGameboard.allSunk()){
            this.whoWon = this.enemy;
            return true;
        }
        else if(enemyGameboard.allSunk()){
            this.whoWon = this.player;
            return true;
        }
        return false;
    }
    
    /**
     * 
     * @param {Coordinate} attackedCoordinate 
     * @returns {Player}
     * @returns {Ai}
     * @returns {boolean} 
     */
    handleAttackingPhase(attackedCoordinate){
        // Player is always the first one who attacks
        if(this.currentPhase!==this.phases[1]){
            return false;
        }

        let playerAttackValid = this.#communicateAttackToAi(attackedCoordinate);

        if(playerAttackValid === null){
            return false;
        }

        let playerWon = this.hasWin();

        if(playerWon){
            return this.whoWon;
        }

        let enemyAttackSuccessful = this.#communicateAttackToPlayer();
        
        let enemyWon = this.hasWin();

        if(enemyWon){
            return this.whoWon;
        }

        // if no one wins, but every execution was succesful, return true
        return true;
    }

    #communicateAttackToAi(attackedCoordinate){
        let isSucessful = this.enemy.gameboard.receiveAttack(attackedCoordinate);
        return isSucessful
    }

    #communicateAttackToPlayer(){
        let attackedCoordinate = this.enemy.generateAttackCoordinate();
        let isSuccessful = this.player.gameboard.receiveAttack(attackedCoordinate);
        this.enemy.registerPreviousAttackResult(attackedCoordinate, isSuccessful);
        return isSuccessful;
    }

    /**
     * 
     * @param {Coordinate} coord1 
     * @param {Coordinate} coord2 
     * @param {Number} shipTypeToPlace
     */
    handleShipPlacementPhase(coord1, coord2, shipTypeToPlace){
        this.currentPhase = this.phases[0];

        if(Object.keys(this.enemy.gameboard.shipTypeToShip).length!==5){
            this.#initializeAiShips();
        }
        let shipInstance = new Ship(shipTypeToPlace);
        let placementSuccessful = this.#placePlayerShip(coord1, coord2, shipInstance);
        if(Object.keys(this.player.gameboard.shipTypeToShip).length===5){
            this.currentPhase = this.phases[1];
        }
        return placementSuccessful;
    }

    #initializeAiShips(){
        if(this.enemy.gameboard.shipTypeToShip.length===5){
            return false;
        }
        let isSucessful = this.enemy.randomlyPlaceShips();
        return isSucessful;
    }

    #placePlayerShip(coord1, coord2, shipInstance){
        let isSucessful = this.player.gameboard.placeShip(coord1, coord2, shipInstance);
        return isSucessful;
    }

    newGame(){
        if(this.player===null||this.enemy===null){
            return false;
        }
        this.player = null;
        this.enemy = null;
    }

    resetGame(){
        if(this.player===null||this.enemy===null){
            return false;
        }
        this.player.resetPlayerScore();

        this.enemy.resetPlayerScore();
        this.enemy.resetAiAttackingInformation();

        this.player.gameboard.resetGameboard();
        this.enemy.gameboard.resetGameboard();
    }
}

module.exports = {GameManager};