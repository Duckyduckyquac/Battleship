// Utility.test.js
let {Utility} = require('./model/utility.js');

describe('Test for the Utility Module', function(){
    let utility = new Utility();
    describe('Test for the Range Function', function(){
        test('Function works properly when starting number is 0', function(){
            let testRange = utility.range(0,2);
            expect(testRange).toEqual([0,1,2]);
        });
        test('Function works properly when starting number is 1',function(){
            let testRange = utility.range(1,2);
            expect(testRange).toEqual([1,2]);
        });
        test('Function works properly when the starting and ending number is the same', function(){
            let testRange = utility.range(1,1);
            expect(testRange).toEqual([1]);
        });
    });
    describe('Test for the randomBoardCoordinate Function',function(){
        test('Function works properly',function(){
            let generatedNumber = utility.randomBoardCoordinate(1,10);
            expect(generatedNumber).toBeGreaterThanOrEqual(1);
            expect(generatedNumber).toBeLessThanOrEqual(10);
        });
    });
    describe('Test for populateBoardCoordinateList',function(){
        let boardList = utility.populateBoardCoordinateList();
        expect(boardList.length).toEqual(100);
        expect(JSON.parse(boardList[49]).row).toBeGreaterThanOrEqual(1);
        expect(JSON.parse(boardList[49]).row).toBeLessThanOrEqual(10);
        expect(JSON.parse(boardList[49]).column).toBeGreaterThanOrEqual(1);
        expect(JSON.parse(boardList[49]).column).toBeLessThanOrEqual(10);
    });
})