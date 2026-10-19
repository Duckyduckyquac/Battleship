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
}

module.exports= {Utility};

