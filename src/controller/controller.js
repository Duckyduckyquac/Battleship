class Controller{
    constructor(){
        
    }
    communicateShipPlacement(coord1, coord2, shipInstance, gameboard){
        let isSuccessful = gameboard.placeShip(coord1, coord2, shipInstance);
        return (isSuccessful)? true:false;
    }

    communicateAttackedSquareToAi(attackedCoordinate, enemyGameboard, enemyAi){
        // Case 1: All ships are already sunk
        if(enemyGameboard.allSunk()){
            return false; // returning false means it's unsuccessful
        }
        
        // Case 2: not every ship is sunk
        // In this case, we pass the coordinate onto the enemyGameboard
        let isSuccessful = enemyGameboard.receiveAttack(attackedCoordinate);

        enemyAi.hasPreviousShipHit = (isSuccessful)? true:false;
        
        return (isSuccessful)? true : false;
    }

    communicateAttackedSquareToPlayer(attackedCoordinate, playerGameboard, player){
        // Case 1: All player ships are already sunk
        if(playerGameboard.allSunk()){
            return false; 
        }

        // Case 2: not every ship is sunk
        // In this case, we pass the coordinate onto the playerGameboard
        let isSuccessful = enemyGameboard.receiveAttack(attackedCoordinate);
        return (isSuccessful)? true : false;
    }
}

module.exports = {Controller};