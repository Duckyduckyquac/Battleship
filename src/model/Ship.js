class Ship{
    constructor(shipType){
        this.typeToLengthMapping = {
            "1":5,
            "2":4,
            "3":3,
            "4":3,
            "5":2
        }

        this.shipType = shipType;

        this.shipLength = this.typeToLength(shipType);
        this.numOfHit = 0;
        this.sunk = this.isSunk();

        
    }
    hit(){
        if(this.shipLength!==this.numOfHit){
            this.numOfHit+=1;
        }
    }
    isSunk(){
       if(this.shipLength===this.numOfHit){
        return true;
       } 
       else{
        return false;
       }
    }
    typeToLength(shipType){
        let validShipTypes = [1,2,3,4,5];
        if(validShipTypes.includes(shipType)===true){
            let shipTypeString = JSON.stringify(shipType);
            return this.typeToLengthMapping[shipTypeString];
        }
        else{
            return false;
        }
    }
}

module.exports = {Ship};