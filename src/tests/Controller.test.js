// Controller.test.js

describe('Tests for Controller Module', function(){
    const {Player} = require('../model/Player.js');
    const {Ai} = require('../model/AI.js');
    const {Ship} = require('../model/Ship.js');
    const {Gameboard} = require('../model/Gameboard.js');
    const {Coordinate} = require('../model/Coordinate.js');
    const {Controller} = require('../controller/controller.js');

    // Controller instance for the tests
    let newController = new Controller();
    
    test('Create coordinate works properly', function(){
        let newCoordinate = newController.createCoordinate(1, 2);
        expect(newCoordinate.row).toEqual(1);
        expect(newCoordinate.column).toEqual(2);
    });

});