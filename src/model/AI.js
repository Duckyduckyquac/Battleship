// ai.js

const {Player} = require('./Player.js');
const {Utility} = require('./utility.js');

class Ai extends Player{
    constructor(gameboard,name,score=0){
        super(gameboard,name,score);

        this.utility = new Utility();
        this.availableSquares = this.utility.populateBoardCoordinateList(); // Type: String
        this.unavailableSquares = []; // Type: String
        this.currentAdjacentSquares = []; // Type: Coordinates
        this.currentPivotSquare = []; // Type: 1 coordinate
        this.hasPreviousShipHit = false;
    }

    generateAttackCoordinate(){
        this.availableSquares = this.availableSquares.filter(function(square){
                if(this.unavailableSquares.includes(square)){
                    return false;
                }
                return true;
            },this);
        // Case 1: There are no more available squares
        if(this.availableSquares.length<1){
            return false;
        }
        // Case 2: There was no previous ship hit
        else if(this.hasPreviousShipHit===false){
            let randomIndex = this.utility.randomBoardCoordinate(0,this.availableSquares.length-1);

            let candidateCoord = JSON.parse(this.availableSquares[randomIndex]);

            let candidateCoordString = JSON.stringify(candidateCoord);

            this.availableSquares.splice(randomIndex, 1);
            this.unavailableSquares.push(candidateCoordString);
            return candidateCoord;
        }
        // Case 3: There was a previous ship hit and there is no currentPivotSquare
        else if((this.hasPreviousShipHit===true)&&(this.currentPivotSquare.length<1)){
            /* 
                If there was, a previous ship hit that was indicated by the controller, 
                retrieve the most recent square from unavailable squares.
                This is because this is the square that previously hit a ship
            */
            let pivotSquare = JSON.parse(this.unavailableSquares[this.unavailableSquares.length-1]);

            this.currentPivotSquare = pivotSquare;

            // compute the adjacent squares
            let adjacentSquares = [];

            /* 
                The adjacent squares in this case would be found by doing +- 1 to row and column,
                which would result to a total of 4 adjacent squares
            */
           let offsettedLeft = [pivotSquare[0],pivotSquare[1]-1];
           let offsettedRight = [pivotSquare[0],pivotSquare[1]+1];
           let offsettedUp = [pivotSquare[0]+1,pivotSquare[1]];
           let offsettedDown = [pivotSquare[0]-1,pivotSquare[1]];

           adjacentSquares.push(offsettedLeft, offsettedRight, offsettedUp, offsettedDown);

            // We now need to check if all of these coordinates are valid:
            adjacentSquares = adjacentSquares
                                          
            .filter(function(coordinate){
                let coordinateString = JSON.stringify(coordinate);
                let coordinateObject = {"row":coordinate[0], "column":coordinate[1]};
                if (this.unavailableSquares.includes(coordinateString)===true||
                    this.gameboard.isValidSquare(coordinateObject)===false){
                        return false;
                }
                return true;
            }, this);

            // Check if the adjacentSquares are empty

            if(adjacentSquares.length>0){
                this.currentAdjacentSquares = (adjacentSquares.length>1) ? adjacentSquares.slice(1) : [];
                this.unavailableSquares.push(JSON.stringify(adjacentSquares[0]));
                return adjacentSquares[0];
            }
            // If it is empty, fallback to random selection and reset relevant object variables
            else if(adjacentSquares.length===0){
                this.currentAdjacentSquares = [];
                this.currentPivotSquare = [];
                this.hasPreviousShipHit=false;
                return this.generateAttackCoordinate();
            }
        }
        // Case 4: There are squares in the currentAdjacentSquares queue
        else if(this.currentAdjacentSquares.length>0){
            // Main goal, consume until empty
            let consumedSquare = this.currentAdjacentSquares[0]
            this.unavailableSquares.push(JSON.stringify(consumedSquare));
            this.currentAdjacentSquares.splice(0,1);
            // After consumption, check if the queue is empty
            if(this.currentAdjacentSquares.length<1){
                // if empty, reset relevant object variables
                this.hasPreviousShipHit=false;
                this.currentPivotSquare=[];
            }
            return consumedSquare;
        }
    }
}

module.exports = {Ai};