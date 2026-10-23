class View{
    constructor(){
        this.mainContainer = document.querySelector("#main-container");
        this.displaySection = document.querySelector("#main-display-section");
        this.mainFooter = document.querySelector("#main-footer");

        // Main container listener
        this.mainContainer.addEventListener('click',function(){

        });
        // Display section listener
        this.displaySection.addEventListener('click', function(){

        });
        // main footer listener
        this.mainFooter.addEventListener('click', function(){

        });

    }

    showPlayerCreationScreen(){
        let playerCreationScreen = `
            <div class = "player-creation-screen">
                <div class = "input-wrapper player-creation-screen__input-wrapper">
                    <span class = "input-description player-creation-screen__input-description">In-Game Name</span>
                    <input id = "name-input">
                </div>

                <div class = "input-wrapper player-creation-screen__input-wrapper">
                    <button class="input-wrapper__button">Start Game</button>
                </div>
            </div>
        `;

        this.displaySection.innerHTML=playerCreationScreen
    }

    showGameboardScreen(baseSquares, occupiedSquares, attackedSquares){
        // The parameters would be passed by the controller
        // The format for the first two parameters are flat 
        // arrays of coordinate objects;

        // For attackedSquares, it would be an object with keys for the
        // coordinate and the boolean value if it is hit or missed

        let stringifiedOccupiedSquares = occupiedSquares
        .map((square)=>{
            return JSON.stringify(square);
        });

        // ----- Generating the gridSquares -----
        let gridSquares = ``;
        for(let square of baseSquares){
            // This is a square of baseSquares
            // The next checks would determine the other classes it should have
            let cell = `
            <div class = "gameboard-grid__square"
            data-row="${square.row}" data-column = "${square.column}"
            >

            </div>
            `;
            // Check 1: square is in attacked squares
            if(JSON.stringify(square) in attackedSquares){
                // Check 1.1: square was hit
                if(attackedSquares[JSON.stringify(square)]===true){
                    cell = `
                    <div class = "gameboard-grid__square gameboard-grid__square--hit"
                    data-row="${square.row}" data-column = "${square.column}"
                    >

                    </div>
                    `;
                }
                // Check 2.2: Square was a missed hit
                else if(attackedSquares[JSON.stringify(square)]===false){
                    cell = `
                    <div class = "gameboard-grid__square gameboard-grid__square--missed"
                    data-row="${square.row}" data-column = "${square.column}"
                    >

                    </div>
                    `;
                }
            }
            
            // Check 2: square was not hit, but occupied
            else if(stringifiedOccupiedSquares.includes(JSON.stringify(square))){
                cell = `
                <div class = "gameboard-grid__square gameboard-grid__square--occupied"
                data-row="${square.row}" data-column = "${square.column}"
                >

                </div>
                `;
            }
            // After all of this, append it to gridSquares
            gridSquares+=cell;
        }
        // ----- Creating the actual gameboardGrid -----
        let gameboardGrid = `
        <div class="gameboard-screen__gameboard-grid">
            ${gridSquares}
        </div>
        `;

        // ----- Defining the gameboardScreen -----
        let gameboardScreen = `
            <div class = "gameboard-screen">
                ${gameboardGrid}
            </div>
        `;

        this.displaySection.innerHTML=gameboardScreen;
    }
}

module.exports={View};