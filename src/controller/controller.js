const {Player} = require('../model/Player.js');
const {Ai} = require('../model/AI.js');
const {Ship} = require('../model/Ship.js');
const {Gameboard} = require('../model/Gameboard.js');
const {Coordinate} = require('../model/Coordinate.js');

class Controller{
    constructor(){
        
    }
    
    createCoordinate(row, column){
        let newCoordinate = new Coordinate(row, column);
        return newCoordinate;
    }

    createGameboard(){
        let newGameboard = new Gameboard();
        return newGameboard;
    }

    createShipForPlayer(shipType){
        let newShip = new Ship(shipType);
        return newShip;
    }

    createPlayer(gameboard, name, score=0){
        let newPlayer = new Player(gameboard, name, score);
        return newPlayer;
    }
    
    createAi(gameboard, name, score){
        let newAi = new Ai (gameboard, name, score);
        return newAi;
    }

    communicatePlayerShipPlacement(coord1, coord2, shipInstance, gameboard){
        let isSuccessful = gameboard.placeShip(coord1, coord2, shipInstance);
        return isSuccessful;
    }

    communicateAiShipPlacement(enemyAi){
        let isSuccessful = enemyAi.randomlyPlaceShips();
        return isSuccessful;
    }

    communicateAttackedSquareToAi(attackedCoordinate, enemyGameboard, enemyAi){

        if(enemyGameboard.allSunk()){
            return false; // returning false means it's unsuccessful
        }
        
        let isSuccessful = enemyGameboard.receiveAttack(attackedCoordinate);

        enemyAi.hasPreviousShipHit = isSuccessful
        
        return isSuccessful;
    }

    /**
     * 
     * @param {Ai} AiInstance 
     * @param {Gameboard} playerGameboard 
     * @returns {boolean}
     */
    communicateAttackedSquareToPlayer(AiInstance, playerGameboard){
        if(playerGameboard.allSunk()){
            return false;
        }

        let coordinateToAttack = AiInstance.generateAttackCoordinate();
        let isSuccessful = playerGameboard.receiveAttack(coordinateToAttack);

        AiInstance.hasPreviousShipHit = isSuccessful;

        return isSuccessful;
    }
}

module.exports = {Controller};