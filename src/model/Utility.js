const {Coordinate} = require('./Coordinate.js');
class Utility{

    range(start, stop){
        if(start<0||stop<0){
            throw new Error("The first number must be a positive number");
        }
        else if(start>stop){
            throw new Error("The first number must be less than the second number");
        }
        else if(typeof stop != 'number' || typeof start != 'number'){
            throw new Error("Both inputs must be integers");
        }
        let resultRange = [];
        while(start<=stop){
            resultRange.push(start);
            start += 1;
        }
        return resultRange
    }
    randomBoardCoordinate(min,max){
        if(min>max){
            throw new Error("Min must be less than max");
        }
        let randomCoordinate = Math.floor(Math.random()*(max-min+1))+min;
        return randomCoordinate;
    }

    populateBoardCoordinateList(){
        // This would contain a list of coordinateObjects
        let boardList = [];
        for(let i = 1; i<=10 ;i++){
            for(let j = 1; j<= 10; j++){
                let newCoordinate = new Coordinate(i, j);
                let coordString = JSON.stringify(newCoordinate);
                boardList.push(coordString);
            }
        }
        return boardList;
    }
}

module.exports= {Utility};

