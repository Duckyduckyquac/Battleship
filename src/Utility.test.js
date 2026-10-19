// Utility.test.js
let {Utility} = require('./model/utility.js');

describe('Test for the Utility Module', function(){
    describe('Test for the Range Function', function(){
        test('Function works properly when starting number is 0', function(){
            let utility = new Utility();
            let testRange = utility.range(0,2);
            expect(testRange).toEqual([0,1,2]);
        });
        test('Function works properly when starting number is 1',function(){
            let utility = new Utility();
            let testRange = utility.range(1,2);
            expect(testRange).toEqual([1,2]);
        });
        test('Function works properly when the starting and ending number is the same', function(){
            let utility = new Utility();
            let testRange = utility.range(1,1);
            expect(testRange).toEqual([1]);
        })
    })
})