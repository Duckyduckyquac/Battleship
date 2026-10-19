// Model.test.js
// This will involve tests for the model portion of the program

describe('Test for the model modules', function(){
    describe('Test for the Ship Module', function(){
        let {Ship} = require('./model/Ship.js');
        test('Creating a ship with shipType 1 makes the shipLength 5, and initializes numOfHit to be 0', function(){
            // Create the new ship instance with shipType 1
            let newShip = new Ship(1);
            expect(newShip.shipLength).toEqual(5);
            expect(newShip.numOfHit).toEqual(0);
        });
        test('Verify that the hit() method increases numOfHit by 1', function(){
            // Create the new ship instance with shipType 1
            let newShip = new Ship(1);
            newShip.hit()
            expect(newShip.numOfHit).toEqual(1);
        });
        test('Verify that the hit() method does not increase numOfHit if ship is already sunk', function(){
            // Create the new ship instance with shipType 5
            let newShip = new Ship(5);
            newShip.hit()
            newShip.hit()
            // After that, the ship would be sunk
            newShip.hit()
            expect(newShip.numOfHit).toEqual(2);
        });
        test('Verify that the isSunk method returns true when ship is sunk', function(){
            // Create the new ship instance with shipType 5
            let newShip = new Ship(5);
            newShip.hit();
            newShip.hit();
            // After that, the ship should be sunk
            expect(newShip.isSunk()).toEqual(true);
        });
        test('Verify that the isSunk method returns false when ship is not sunk', function(){
            // Create the new ship instance with shipType 5
            let newShip = new Ship(5);
            newShip.hit();
            expect(newShip.isSunk()).toEqual(false);
        });
    });

    describe('Test for the Coordinate Module', function(){
        let {Coordinate} = require('./model/Coordinate.js');
        test('Check if row and column are initialized properly upon creation', function(){
            let newCoordinate = new Coordinate(1,2);
            expect(newCoordinate.row).toEqual(1);
            expect(newCoordinate.column).toEqual(2);
        });        
    });

    describe('Test for GameBoard Module', function(){
        let { Gameboard } = require('./model/Gameboard.js');
        let { Ship } = require('./model/Ship.js');
        let {Coordinate} = require('./model/Coordinate.js');

        test()
    });
});