// Gameboard.js
// contains the model representation of board
let {Utility} = require('../utilities/Utility.js');
let {Coordinate}=require('./Coordinate.js');
let utility = new Utility();

class Gameboard{
    constructor(){
        // The format for this object would be:
        // shipType string: [ coordinate1 object,.... coordinate2 object]
        // 
        this.occupiedSquares = {};

        // The format for this object would be:
        // shipType: shipObject
        this.shipTypeToShip = {};

        // would contain the coordinates that were already attacked
        // so that it cannot be attacked again
        // Format is: [coordinateObjectString]: wasValidHit
        this.attackedSquares = {};
    }

    placeShip(coord1, coord2, shipInstance){
        let row1 = coord1.row;
        let column1 = coord1.column;
        let row2 = coord2.row;
        let column2 = coord2.column;

        // Check 1: if they are not diagonally placed
        if((row1!=row2)&&(column1!=column2)){
            // If neither the rows nor columns match, it means 
            // that they're placed diagonally
            return false;
        }
        // Check 2: If the same square is inputted two times
        else if((row1==row2)&&(column1==column2)){
            return false;
        }
        // Check 3: inclusive distance between squares (horizontal)
        else if(row1==row2){
            // This means that computing the distance does not require
            // computing for the row
            let columnMinuend = Math.max(column1, column2);
            let columnSubtrahend = Math.min(column1,column2);
            let distance = (columnMinuend-columnSubtrahend)+1;
            if(distance == shipInstance.shipLength){
                // place the ship
                let currentShipIdentifier = JSON.stringify(shipInstance.shipType);
                let currentShipSquares = [];
                // invalidSquares would contain all coordinate object lists of occupiedSquares
                // Therefore, it still needs to be looped through
                let invalidSquares = Object.values(this.occupiedSquares);
                for(let num of utility.range(columnSubtrahend,columnMinuend)){
                    // Since we already know that the rows are equal, we only need to update
                    // the column value for each of the coordinate pairs we will make.

                    // Furthermore, we also need to check if none of the squares
                    // are already occupied. If they are, we must return false

                    let newCoordinate = [row1, num];
                    for(let coordinateList of invalidSquares){
                        for(let coordinateObject of coordinateList){
                            if((newCoordinate[0]===coordinateObject.row)&&
                               (newCoordinate[1]===coordinateObject.column)){
                                return false;
                               }
                        }
                    }
                    // If it passes, turn the newCoordinate into an object
                    newCoordinate = new Coordinate(newCoordinate[0],newCoordinate[1]);
                    currentShipSquares.push(newCoordinate);
                }

                this.occupiedSquares[currentShipIdentifier]=currentShipSquares;
                this.shipTypeToShip[currentShipIdentifier]=shipInstance;
                return true;
            }
            else {
                return false;
            }
        }
        // Check 3: inclusive distance between squares (vertical)
        else if(column1 == column2){
            // This means that computing the distance does not require
            // computing for the column
            let rowMinuend = Math.max(row1,row2);
            let rowSubtrahend = Math.min(row1,row2);
            let distance = rowMinuend-rowSubtrahend+1;
            if(distance == shipInstance.shipLength){
                // place the ship
                let currentShipIdentifier = JSON.stringify(shipInstance.shipType);
                let currentShipSquares = [];
                // invalidSquares would contain all coordinate object lists of occupiedSquares
                // Therefore, it still needs to be looped through
                let invalidSquares = Object.values(this.occupiedSquares);

                for(let num of utility.range(rowSubtrahend,rowMinuend)){
                    // Since we already know that the columns are equal, we only need to update
                    // the row value for each of the coordinate pairs we will make.

                    // Furthermore, we also need to check if none of the squares
                    // are already occupied. If they are, we must return false

                    let newCoordinate = [num, column1];
                    for(let coordinateList of invalidSquares){
                        for(let coordinateObject of coordinateList){
                            if((newCoordinate[0]===coordinateObject.row)&&
                               (newCoordinate[1]===coordinateObject.column)){
                                return false;
                               }
                        }
                    }
                    // If it passes, turn the newCoordinate into an object
                    newCoordinate = new Coordinate(newCoordinate[0], newCoordinate[1]);
                    currentShipSquares.push(newCoordinate);
                }
                this.occupiedSquares[currentShipIdentifier]=currentShipSquares;
                this.shipTypeToShip[currentShipIdentifier]=shipInstance;
                return true;
            }
            else{
                return false;
            }
        }
    }

    receiveAttack(attackedCoordinate){
        let row = attackedCoordinate.row;
        let column = attackedCoordinate.column;
        let target = [row, column];
        let validHit = false;

        let key = JSON.stringify(new Coordinate(row, column));

        if(key in this.attackedSquares){
            return null;
        }

        let attackedShipType = "";

        // Step 2: See which ship got hit, if any got hit
        for(let shipType of Object.keys(this.occupiedSquares)){
            let shipTypeValue = this.occupiedSquares[shipType];
            let stop = false;
            // we then loop through the value of the current key
            for(let coordinateObject of shipTypeValue){
                // if any of the coordinates match, we set validHit to true
                // and also say that the key is attacked.
                if((coordinateObject.row===target[0])&&
                   (coordinateObject.column===target[1])){
                    attackedShipType = shipType;
                    validHit=true; // validHit means a ship got hit
                    stop = true;
                    break;
                   }
            }
            if(stop===true){
                break;
            }
        }
        // Step 3: Log the attacked coordinate
        this.attackedSquares[key]=validHit;

        // Step 4: Send the damage to the ship
        if(validHit===true){
            let targetedShip = this.shipTypeToShip[attackedShipType];
            if(targetedShip.isSunk()===false){
                targetedShip.hit();
            }
            return true;
        }
        else if(validHit===false){
            return false; //If there was no ship hit, return false
        }
    }

    allSunk(){
        let numOfSunkShips = 0;
        if(Object.values(this.shipTypeToShip).length>0){
            for(let ship of Object.values(this.shipTypeToShip)){
                let allSunkBool = true;
                if(ship.isSunk()===true){
                    numOfSunkShips+=1;
                }
            }
            if(numOfSunkShips === Object.values(this.shipTypeToShip).length){
                return true
            }
        }
        return false;
    }
    isValidSquare(coordinate){
        let row = coordinate.row;
        let column = coordinate.column;
        
        // Define the bounds of the board
        let minRow = 1; 
        let maxRow = 10;
        let minColumn = 1;
        let maxColumn = 10;

        if((row<minRow)||(row>maxRow)||(column<minColumn)||(column>maxColumn)){
            return false;
        }
        else{
            return true;
        }
    }
    resetGameboard(){
        this.occupiedSquares = {};
        this.shipTypeToShip = {};
        this.attackedSquares = {};
        return true;
    }
}

module.exports = {Gameboard};