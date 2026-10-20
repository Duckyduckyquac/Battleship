// Model.test.js
// This will involve tests for the model portion of the program

const { experiments } = require('webpack');

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

        test('Gameboard is initialized properly', function(){
            let newBoard = new Gameboard();
            expect(newBoard.occupiedSquares).toEqual({});
            expect(newBoard.shipTypeToShip).toEqual({});
            expect(newBoard.attackedSquares).toEqual({});
            expect(newBoard.allSunk()).toEqual(false);
        })

        test('Horizontal ship placement works properly', function(){
            let newBoard = new Gameboard();
            let coord1 = new Coordinate(1, 1);
            let coord2 = new Coordinate(1, 2);
            let newShip = new Ship(5);

            // Places the ship horizontally
            let shipPlaced = newBoard.placeShip(coord1,coord2,newShip);

            expect(shipPlaced).toBe(true);
            expect(newBoard.shipTypeToShip).toEqual({"5":newShip});
            expect(newBoard.occupiedSquares).toEqual({"5":[[1,1],[1,2]]});
            
        })
        test('Vertical ship placement works properly', function(){
            let newBoard = new Gameboard();
            let coord1 = new Coordinate(1, 1);
            let coord2 = new Coordinate(2, 1);
            let newShip = new Ship(5);

            // Places the ship vertically
            let shipPlaced = newBoard.placeShip(coord1,coord2,newShip);

            expect(shipPlaced).toBe(true);
            expect(newBoard.shipTypeToShip).toEqual({"5":newShip});
            expect(newBoard.occupiedSquares).toEqual({"5":[[1,1],[2,1]]});
        })
        test('placeShip() returns false for diagonal squares', function(){
            let newBoard = new Gameboard();
            let coord1 = new Coordinate(1, 1);
            let coord2 = new Coordinate(2, 2);
            let newShip = new Ship(5);

            // Places the ship diagonally
            let shipPlaced = newBoard.placeShip(coord1,coord2,newShip);

            expect(shipPlaced).toBe(false);
            expect(newBoard.shipTypeToShip).toEqual({});
            expect(newBoard.occupiedSquares).toEqual({});
        })
        test('placeShip() returns false for same square selection', function(){
            let newBoard = new Gameboard();
            let coord1 = new Coordinate(1, 1);
            let coord2 = new Coordinate(1, 1);
            let newShip = new Ship(5);

            // Places the ship in the same square
            let shipPlaced = newBoard.placeShip(coord1,coord2,newShip);

            expect(shipPlaced).toBe(false);
            expect(newBoard.shipTypeToShip).toEqual({});
            expect(newBoard.occupiedSquares).toEqual({});
        })
        test('placeShip() returns false for invalid lengths', function(){
            let newBoard = new Gameboard();
            let coord1 = new Coordinate(1, 1);
            let coord2 = new Coordinate(1, 2);
            // This ship will have a length of 5
            let newShip = new Ship(1);

            // Places the ship horizontally
            let shipPlaced = newBoard.placeShip(coord1,coord2,newShip);

            expect(shipPlaced).toBe(false);
            expect(newBoard.shipTypeToShip).toEqual({});
            expect(newBoard.occupiedSquares).toEqual({});
        });
        test('placeShip() returns false for when trying to place on squares \
            that are already occupied', function(){
            let newBoard = new Gameboard();
            let coord1 = new Coordinate(1, 1);
            let coord2 = new Coordinate(1, 2);
            // This ship will have a length of 2
            let spaceTaker = new Ship(5);

            // Places the ship horizontally
            let spaceTakerPlaced = newBoard.placeShip(coord1,coord2,spaceTaker);

            coord1= new Coordinate(1,1);
            coord2 = new Coordinate(3,1);
            // This ship will have a length of 3
            let testingShip = new Ship(4)
            let testingShipPlaced = newBoard.placeShip(coord1,coord2,testingShip);

            expect(spaceTakerPlaced).toBe(true);
            expect(testingShipPlaced).toBe(false);

            expect(newBoard.shipTypeToShip).toEqual({"5":spaceTaker});
            expect(newBoard.occupiedSquares).toEqual({"5":[[1,1],[1,2]]});
        });
        test('receiveAttack works properly on occupied squares', function(){
            let newBoard = new Gameboard();
            let coord1 = new Coordinate(1, 1);
            let coord2 = new Coordinate(1, 2);
            // This ship will have a length of 2
            let spaceTaker = new Ship(5);

            // Places the ship horizontally
            let spaceTakerPlaced = newBoard.placeShip(coord1,coord2,spaceTaker);

            // Part of spaceTaker resides in coord1
            let attackValid = newBoard.receiveAttack(coord1);
            expect(attackValid).toEqual(true);
            expect(spaceTaker.numOfHit).toEqual(1);
            expect(newBoard.attackedSquares).toEqual({'[1,1]':true});

            // Now try attacking again
            attackValid = newBoard.receiveAttack(coord1);
            // It shouldn't register a hit since the square has been hit before
            expect(attackValid).toEqual(false);
            expect(spaceTaker.numOfHit).toEqual(1);
            expect(newBoard.attackedSquares).toEqual({'[1,1]':true});
        });
        test('receiveAttack works properly on unoccupied squares',function(){
            let newBoard = new Gameboard();
            let coord1 = new Coordinate(1, 1);
            let coord2 = new Coordinate(1, 2);
            // This ship will have a length of 2
            let spaceTaker = new Ship(5);

            // Places the ship horizontally
            let spaceTakerPlaced = newBoard.placeShip(coord1,coord2,spaceTaker);

            let dummyCoord = new Coordinate(1,4);
            let attackValid = newBoard.receiveAttack(dummyCoord);

            expect(attackValid).toEqual(false)

            expect(spaceTaker.numOfHit).toEqual(0);
            expect(newBoard.attackedSquares).toEqual({'[1,4]':false});
        })
        test('allSunk works properly even when there are squares \
                that are already occupied', function(){
                let newBoard = new Gameboard();
                let coord1 = new Coordinate(1, 1);
                let coord2 = new Coordinate(1, 2);
                // This ship will have a length of 2
                let spaceTaker = new Ship(5);

                // Places the ship horizontally
                let spaceTakerPlaced = newBoard.placeShip(coord1,coord2,spaceTaker);

                newBoard.receiveAttack(coord1);
                newBoard.receiveAttack(coord2);

                expect(newBoard.allSunk()).toEqual(true);
        });
    });

});