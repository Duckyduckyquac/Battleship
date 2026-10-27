// Player.js

class Player{
    constructor(gameboard, name, score=0){
        this.gameboard=gameboard;
        this.name = name;
        this.score = score;
    }
    resetPlayerScore(){
        this.score = 0;
        return true;
    }
};

module.exports={Player};