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
    constructor(player, enemy){
        this.player = player;
        this.enemy = enemy;

        this.phases = ["shipPlacement", "attacking"];
        this.currentPhase = this.phases[0];

        this.whoWon = null;
    }

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

        let playerAttackSucessful = this.#communicateAttackToAi(attackedCoordinate);
        if(!playerAttackSucessful){
            return false;
        }
        
        let playerWon = this.hasWin();

        if(playerWon){
            return this.whoWon;
        }

        let enemyAttackSuccessful = this.#communicateAttackToPlayer();
        if(!enemyAttackSuccessful){
            return false;
        }
        
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
        return isSuccessful;
    }

    handleShipPlacementPhase(coord1, coord2, shipInstance){
        this.currentPhase = this.phases[0];

        if(this.enemy.gameboard.shipTypeToShip.length!==5){
            this.#initializeAiShips();
        }
        
        this.#placePlayerShip(coord1, coord2, shipInstance);
        if(this.player.gameboard.shipTypeToShip.length===5){
            this.currentPhase = this.phases[1];
        }
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
}