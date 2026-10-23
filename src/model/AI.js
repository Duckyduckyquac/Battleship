// ai.js

const {Player} = require('./Player.js');
const {Utility} = require('./utility.js');
const {Coordinate} = require('./Coordinate.js');
const {Ship} = require('./Ship.js');

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
        // Update availableSquares based on unavailableSquares
        this.availableSquares = this.availableSquares.filter(function(string){
                if(this.unavailableSquares.includes(string)){
                    return false;
                }
                return true;
            },this);
        // Case 1: There are no more available squares
        if(this.availableSquares.length<1){
            return false;
        }
        // Case 2: There was no previous ship hit (resort to random selection)
        else if(this.hasPreviousShipHit===false){
            let randomIndex = this.utility.randomBoardCoordinate(0,this.availableSquares.length-1);
            let candidateCoordString = this.availableSquares[randomIndex];
            let candidateCoord = JSON.parse(candidateCoordString);
            // Candidate coord would be a Coordinate Object

            this.availableSquares.splice(randomIndex, 1);
            this.unavailableSquares.push(candidateCoordString);
            return new Coordinate(candidateCoord.row, candidateCoord.column);
        }
        // Case 3: There was a previous ship hit and there is no currentAdjacentSquares
        else if((this.hasPreviousShipHit===true)&&(this.currentAdjacentSquares.length<1)){
            /* 
                If there was a previous ship hit that was indicated by the controller, 
                retrieve the most recent square from unavailable squares.
                This is because this is the square that previously hit a ship
            */
            /* 
                This has to be a separate case since the computer should ignore previousShipHits
                When it has a squares in the currentAdjacentSquares queue
            */
            
            // This would be a coordinate object
            let pivotSquare = JSON.parse(this.unavailableSquares[this.unavailableSquares.length-1]);

            // compute the adjacent squares
            let adjacentSquares = [];

            /* 
                The adjacent squares in this case would be found by doing +- 1 to row and column,
                which would result to a total of 4 adjacent squares
            */
           let offsettedLeft = new Coordinate (pivotSquare.row,pivotSquare.column-1);
           let offsettedRight = new Coordinate (pivotSquare.row,pivotSquare.column+1);
           let offsettedUp = new Coordinate (pivotSquare.row+1,pivotSquare.column);
           let offsettedDown = new Coordinate (pivotSquare.row-1,pivotSquare.column);

           adjacentSquares.push(offsettedLeft, offsettedRight, offsettedUp, offsettedDown);

            /* 
                We now need to check if all of these coordinates are valid
                and turn them into strings using JSON.stringify()
            */
            adjacentSquares = adjacentSquares                                  
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

            // Check if the adjacentSquares are empty

            if(adjacentSquares.length>0){
                this.currentAdjacentSquares = (adjacentSquares.length>1) ? adjacentSquares.slice(1) : [];
                this.unavailableSquares.push(adjacentSquares[0]);
                let returnableCoordinate = JSON.parse(adjacentSquares[0]);

                return new Coordinate(returnableCoordinate.row,returnableCoordinate.column);
            }
            // If it is empty, fallback to random selection and reset relevant object variables
            else if(adjacentSquares.length===0){
                this.currentAdjacentSquares = [];
                this.hasPreviousShipHit=false;
                return this.generateAttackCoordinate();
            }
        }
        // Case 4: There are squares in the currentAdjacentSquares queue
        else if(this.currentAdjacentSquares.length>0){
            // Main goal: consume until empty
            let consumedSquare = this.currentAdjacentSquares[0] // Stringified Coordinate Object
            this.unavailableSquares.push(consumedSquare);
            this.currentAdjacentSquares.splice(0,1); // remove from queue after consumption
            
            // After consumption, check if the queue is empty
            if(this.currentAdjacentSquares.length<1){
                // if empty, reset relevant object variables
                this.hasPreviousShipHit=false;
            }

            let returnableCoordinate = JSON.parse(consumedSquare);
            return new Coordinate(returnableCoordinate.row, returnableCoordinate.column);
        }
    };

    randomlyPlaceShips(){
        let currentShipType = 1;
        let availableSquares = this.utility.populateBoardCoordinateList();
        let shipOrientation = ["horizontal", "vertical"];
        if(this.gameboard.allSunk()){
            return false;
        }
        while(Object.keys(this.gameboard.occupiedSquares).length < 5){
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

            let newShip = new Ship(currentShipType);
            let newShipLength = newShip.typeToLengthMapping[JSON.stringify(currentShipType)];

            // After this, we pick a starting and ending coordinate
            let startCoordinate = JSON.parse(availableSquares[this.utility.randomBoardCoordinate(0,availableSquares.length-1)]);
            let endCoordinate = new Coordinate(1,1);
            let currentOrientation = shipOrientation[this.utility.randomBoardCoordinate(0, shipOrientation.length-1)];
            let offset = newShipLength -1;
            if(currentOrientation === "horizontal"){
                endCoordinate = new Coordinate(startCoordinate.row, startCoordinate.column+offset);
            }
            else if(currentOrientation === "vertical"){
                endCoordinate = new Coordinate(startCoordinate.row+offset, startCoordinate.column);
            }

            // We check if the endCoordinate is valid.
            // We do not check for the startCoordinate since we already know that
            // it is valid
            if(this.gameboard.isValidSquare(endCoordinate)&&(!boardOccupiedSquares.includes(JSON.stringify(endCoordinate)))){
                let isSuccessful = this.gameboard.placeShip(startCoordinate,endCoordinate, newShip);
                if(isSuccessful){
                    currentShipType+=1;
                }
                else if(!isSuccessful){
                    continue;
                }
           }
        }
        return true;
    }
}

module.exports = {Ai};