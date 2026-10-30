let {Utility} = require('./Utility.js');
let {Coordinate} = require('../model/Coordinate.js');
let utility = new Utility();
class BoardInformationForViewModule {
    constructor(gameboard){
        this.baseSquares = this.convertBaseSquaresToObject(utility.populateBoardCoordinateList());
        this.occupiedSquares = this.parseGameboardOccupiedSquares(gameboard);
        this.attackedSquares = gameboard.attackedSquares;
    }

    convertBaseSquaresToObject(baseSquares){
        baseSquares = baseSquares.map(function(square){
            let currentSquare = JSON.parse(square);
            currentSquare = new Coordinate(currentSquare.row, currentSquare.column);
            return currentSquare
        },this);
        return baseSquares;
    }

    parseGameboardOccupiedSquares(gameboard){
        let unprocessedOccupiedSquares = gameboard.occupiedSquares;
        let occupiedSquaresCoordinate = Object.values(unprocessedOccupiedSquares);
        let flattenedStringifiedOccupiedSquares = occupiedSquaresCoordinate.flatMap(function(squareArray){
            return squareArray;
        }, this)
        .map(function(square){
            return JSON.stringify(square);
        },this);
        return flattenedStringifiedOccupiedSquares;
    }
}

module.exports = {BoardInformationForViewModule};