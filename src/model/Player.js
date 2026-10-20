// Player.js
// This will contain the model representation of a player. 
// To begin, a player must have a gameBoard, and a boolean 
// of whether it is a real player or an AI

class Player{
    // gameboard is a gameboard instance. This is simply an abstract class that will be extended by human and AI
    constructor(gameboard, name){
        this.name = name;
        this.gameboard=gameboard;
    }
}
