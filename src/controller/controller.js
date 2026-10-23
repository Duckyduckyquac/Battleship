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
        // Case 1: All ships are already sunk
        if(enemyGameboard.allSunk()){
            return false; // returning false means it's unsuccessful
        }
        
        // Case 2: not every ship is sunk
        // In this case, we pass the coordinate onto the enemyGameboard
        let isSuccessful = enemyGameboard.receiveAttack(attackedCoordinate);

        enemyAi.hasPreviousShipHit = isSuccessful
        
        return isSuccessful;
    }

    communicateAttackedSquareToPlayer(attackedCoordinate, playerGameboard, player){
        // Case 1: All player ships are already sunk
        if(playerGameboard.allSunk()){
            return false; 
        }

        // Case 2: not every ship is sunk
        // In this case, we pass the coordinate onto the playerGameboard
        let isSuccessful = playerGameboard.receiveAttack(attackedCoordinate);
        return isSuccessful
    }
}

module.exports = {Controller};