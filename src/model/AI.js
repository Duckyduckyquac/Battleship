// ai.js

const {Player} = require('./Player.js');
const {Utility} = require('../utilities/Utility.js');
const {Coordinate} = require('./Coordinate.js');
const {Ship} = require('./Ship.js');

/**
 * @param {GameBoard} gameboard
 * @param {String} name
 * @param {Number} score
 */
class Ai extends Player{
    constructor(gameboard,name,score=0){
        super(gameboard,name,score);

        this.utility = new Utility();
        this.availableSquares = this.utility.populateBoardCoordinateList(); // Type: Stringified Coordinate Object
        this.unavailableSquares = []; // Type: Stringified Coordinate Object
        this.currentAdjacentSquares = []; // Type: Stringified Coordinate Object
        this.hasPreviousShipHit = false;
    }


    generateAttackCoordinate(){
        this.#updatePlayerAvailableSquares();

        if(this.availableSquares.length<1){
            return false;
        }

        else if(!this.hasPreviousShipHit){
           return this.#randomlySelectCoordinate();
        }

        else if((this.hasPreviousShipHit)&&(this.currentAdjacentSquares.length<1)){
           return this.#generateAdjacentSquares();
        }

        else if(this.currentAdjacentSquares.length>0){
            return this.#consumeAdjacentSquareQueue();
        }
    }

    #updatePlayerAvailableSquares(){
        this.availableSquares = this.availableSquares.filter(function(string){
                if(this.unavailableSquares.includes(string)){
                    return false;
                }
                return true;
            },this);
    }

    #randomlySelectCoordinate(){
    let randomIndex = this.utility.randomBoardCoordinate(0,this.availableSquares.length-1);
        let candidateCoordString = this.availableSquares[randomIndex];
        let candidateCoord = JSON.parse(candidateCoordString);
        // Candidate coord would be a Coordinate Object

        this.availableSquares.splice(randomIndex, 1);
        this.unavailableSquares.push(candidateCoordString);
        return new Coordinate(candidateCoord.row, candidateCoord.column);
    }

     #generateAdjacentSquares(){
        let mostRecentUnavailableSquare = JSON.parse(this.unavailableSquares[this.unavailableSquares.length-1]);
        let pivotSquare = mostRecentUnavailableSquare;

        let adjacentSquares = [];

        let offsettedLeft = new Coordinate (pivotSquare.row,pivotSquare.column-1);
        let offsettedRight = new Coordinate (pivotSquare.row,pivotSquare.column+1);
        let offsettedUp = new Coordinate (pivotSquare.row+1,pivotSquare.column);
        let offsettedDown = new Coordinate (pivotSquare.row-1,pivotSquare.column);

        adjacentSquares.push(offsettedLeft, offsettedRight, offsettedUp, offsettedDown);

        adjacentSquares = this.#validateAndStringifyAdjacentSquares(adjacentSquares);

        // Check if the adjacentSquares are empty
        if(adjacentSquares.length===0){
            this.currentAdjacentSquares = [];
            return this.#randomlySelectCoordinate();
        }
      
        this.currentAdjacentSquares = (adjacentSquares.length>1) ? adjacentSquares.slice(1) : [];
        let firstAdjacentSquare = adjacentSquares[0];
        this.unavailableSquares.push(firstAdjacentSquare);
        
        let objectifiedSquare = JSON.parse(firstAdjacentSquare);
        return new Coordinate(objectifiedSquare.row, objectifiedSquare.column);
    }

    #validateAndStringifyAdjacentSquares(adjacentSquares){
        let processedArray = adjacentSquares                                  
        .filter(function(coordinateObject){
            let coordinateObjectString = JSON.stringify(coordinateObject);
            if (this.unavailableSquares.includes(coordinateObjectString)||
                !this.gameboard.isValidSquare(coordinateObject)){
                    return false;
            }
            return true;
        }, this)

        .map(function(coordinateObject){
            let coordinateObjectString = JSON.stringify(coordinateObject);
            return coordinateObjectString;
        },this);

        return processedArray;
    }

    #consumeAdjacentSquareQueue(){
        if(this.currentAdjacentSquares.length<1){
            return false;
        }

        let consumedSquare = this.currentAdjacentSquares[0]
        this.unavailableSquares.push(consumedSquare);
        this.currentAdjacentSquares.splice(0,1);

        if(this.currentAdjacentSquares.length===0){
            this.hasPreviousShipHit=false;
        }
        
        let returnableCoordinate = JSON.parse(consumedSquare);
        return new Coordinate(returnableCoordinate.row, returnableCoordinate.column);
    }

    randomlyPlaceShips(){
        if(this.gameboard.allSunk()){
            return false;
        }

        let currentShipType = 1;
        let availableSquares = this.utility.populateBoardCoordinateList();
        let boardOccupiedSquares = null;


        while(currentShipType <= 5){
            [availableSquares, boardOccupiedSquares] = this.#updateAiAvailableSquares(availableSquares);

            let newShip = new Ship(currentShipType);
            let newShipLength = newShip.typeToLengthMapping[JSON.stringify(currentShipType)];

            // After this, we pick a starting and ending coordinate
            let [startCoordinate, endCoordinate] = this.#chooseStartingAndEndingPlacingCoordinate(availableSquares, newShipLength);

            // We check if the endCoordinate is valid.
            let endCoordinateIsValid = this.#isValidEndCoordinate(endCoordinate, boardOccupiedSquares);
            
            if(!endCoordinateIsValid){
                continue;
            }

            let isPlacementSuccesful = this.gameboard.placeShip(startCoordinate, endCoordinate, newShip);

            if(!isPlacementSuccesful){
                continue;
            }
            currentShipType += 1;
        }

        return true;
    }

    #updateAiAvailableSquares(availableSquares){
        let boardOccupiedSquares = Object.values(this.gameboard.occupiedSquares)
           .flatMap(function(squareList){
            return squareList;
           },this)
           .map(function(square){
            return JSON.stringify(square);
           },this);

        availableSquares = availableSquares.filter(function(square){
            return (boardOccupiedSquares.includes(square))? false: true;
        },this);

        return [availableSquares, boardOccupiedSquares];
    }

    #chooseStartingAndEndingPlacingCoordinate(availableSquares, newShipLength){
        const shipOrientationArray = ["horizontal", "vertical"];

        let startCoordinate = JSON.parse(availableSquares[this.utility.randomBoardCoordinate(0,availableSquares.length-1)]);
        let endCoordinate = new Coordinate(1,1);

        let currentOrientation = shipOrientationArray[this.utility.randomBoardCoordinate(0, shipOrientationArray.length-1)];
        let offset = newShipLength -1 ;

        switch(currentOrientation){
            case "horizontal":
                endCoordinate = new Coordinate(startCoordinate.row, startCoordinate.column+offset);
                break;
            case "vertical":
                endCoordinate = new Coordinate(startCoordinate.row+offset, startCoordinate.column);
                break;
        }

        return [startCoordinate, endCoordinate];
    }

    #isValidEndCoordinate(endCoordinate, boardOccupiedSquares){
        if(this.gameboard.isValidSquare(endCoordinate)&&(!boardOccupiedSquares.includes(JSON.stringify(endCoordinate)))){
            return true;
        }
        return false;
    }

    resetAiAttackingInformation(){
        this.availableSquares = this.utility.populateBoardCoordinateList(); 
        this.unavailableSquares = []; 
        this.currentAdjacentSquares = []; 

        return true;
    }
}

module.exports = {Ai};