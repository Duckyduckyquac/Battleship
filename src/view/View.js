class View{
    constructor(){
        this.mainContainer = document.querySelector("#main-container");
        this.displaySection = document.querySelector("#main-display-section");
        this.mainFooter = document.querySelector("#main-footer");

        this.shipTypeToPlace = null;
        this.selectedShipPlacementSquare = null;

        // Main container listener
        this.mainContainer.addEventListener('click',function(event){

            // ----- Header Operations -----
            if(event.target.closest('#main-header')){
                event.preventDefault();

                if(event.target.closest(".header__button-group")!=null){
                    this.handleHeaderButtonGroup(event);
                }   

            }

            // ----- Main section operations -----
            else if(event.target.closest('#main-display-section')){
                event.preventDefault();
                
                if(event.target.closest(".player-creation-screen")!=null){
                    this.handlePlayerCreationScreen(event);
                }

                else if(event.target.closest(".gameboard-screen")!=null){
                    this.handleGameboardScreen(event);
                }
            }

        }.bind(this));
    }

    showPlayerCreationScreen(){
        let playerCreationScreen = `
            <div class = "player-creation-screen">
                <div class = "input-wrapper player-creation-screen__input-wrapper">
                    <span class = "input-description player-creation-screen__input-description">In-Game Name</span>
                    <input id = "name-input">
                </div>

                <div class = "input-wrapper player-creation-screen__input-wrapper">
                    <button class="standard-button input-wrapper__standard-button">Start Game</button>
                </div>
            </div>
        `;

        this.displaySection.innerHTML=playerCreationScreen
    }

    // ----- Gameboard Viewing -----

    /**
     * @typedef {Object} Coordinate
     * @property {number} row
     * @property {number} column
     */

    /**
     * @typedef {Object} parsedBoardInformationForView
     * @property {Array<Coordinate>} baseSquares: contains all default squares
     * @property {Array<String>} [occupiedSquares] : Optional parameter only used for player
     * @property {Object.<string,boolean>} attackedSquares : Map of hit squares and if they were hit/miss
     */

    /**
     * Shows the gameBoardScreen by using the following parameters passed by entryPoint
     * @param {parsedBoardInformationForView} playerBoard : The player gameboard data containing the previous datatypes
     * @param {parsedBoardInformationForView} enemyBoard : The enemy gameboard data containing the previous datatypes   
     */

    showGameboardScreen(playerBoard, enemyBoard){
        let playerGrid = this.#generateGrid(playerBoard, "player");
        let enemyGrid = this.#generateGrid(enemyBoard, "enemy");
        let shipTypeSelectionPanel = this.#generateShipTypeSelectionPanel();

        
        let gameboardScreen = `
            <div class = "gameboard-screen">
                <div>
                    <span>Enemy Board</span>
                    ${enemyGrid}
                </div>
                <div>
                    <span>Player Board</span>
                    ${playerGrid}
                </div>
                ${shipTypeSelectionPanel}
            </div>
        `;

        this.displaySection.innerHTML=gameboardScreen;
    }
    
    #generateShipTypeSelectionPanel(){
        let typePanels = this.#generateTypePanels();

        let shipTypeSelectionPanel = `
        <div class="ship-type-selection-panel gameboard-screen__ship-type-selection-panel">
            <span>Choose the Ship Type to Place</span>
            ${typePanels}
        </div>
        `;
        return shipTypeSelectionPanel;
    }
    #generateTypePanels(){
        let shipTypes = [1,2,3,4,5];
        let lengthMapping = [5, 4, 3, 3, 2]
        let typePanels = ``;
        for(let i=0 ; i<= shipTypes.length-1; i++){
            let currentPanel = `
            <div class="standard-button type-panel ship-type-selection-panel__type-panel" data-shiptype="${shipTypes[i]}">
                 ${shipTypes[i]} | Length ${lengthMapping[i]}
            </div>
            `;

            if(this.shipTypeToPlace == shipTypes[i]){
                currentPanel = 
                `<div class="standard-button type-panel ship-type-selection-panel__type-panel 
                ship-type-selection-panel__type-panel--selected" data-shiptype = "${shipTypes[i]}">
                    ${shipTypes[i]} | Length ${lengthMapping[i]}
                </div>
                `;
            }
            typePanels+= currentPanel;
        }
        return typePanels;
    }
    #generateGrid(board, gridType){
        if(gridType!="player"&&gridType!="enemy"){
            throw new Error("gridType must be a string of either 'player' or 'enemy'");
        }
        switch(gridType){
            case "player":
                let stringifiedOccupiedSquares = board.occupiedSquares

                let playerGridSquares = this.#generateGridSquares(board, gridType, stringifiedOccupiedSquares);

                let playerGrid = `
                <div class="grid gameboard-screen__${gridType}-grid">
                    ${playerGridSquares}
                </div>
                `;
                return playerGrid;
            case "enemy":
                let enemyGridSquares = this.#generateGridSquares(board, gridType);

                let enemyGrid = `
                <div class="grid gameboard-screen__${gridType}-grid">
                    ${enemyGridSquares}
                </div>
                `;
                return enemyGrid;
        }
    }
    #generateGridSquares(board, gridSquareType, stringifiedOccupiedSquares=null){
        let gridSquares = ``;
        for(let square of board.baseSquares){
            // This is a square of baseSquares
            // The next checks would determine the other classes it should have
            let cell = `
            <div class = "square ${gridSquareType}-grid__square"
            data-row="${square.row}" data-column = "${square.column}"
            >

            </div>
            `;
            // Check 1: square is in attacked squares
            if(JSON.stringify(square) in board.attackedSquares){
                // Check 1.1: square was hit
                if(board.attackedSquares[JSON.stringify(square)]===true){
                    cell = `
                    <div class = "square ${gridSquareType}-grid__square ${gridSquareType}-grid__square--hit"
                    data-row="${square.row}" data-column = "${square.column}"
                    >

                    </div>
                    `;
                }
                // Check 2.2: Square was a missed hit
                else if(board.attackedSquares[JSON.stringify(square)]===false){
                    cell = `
                    <div class = "square ${gridSquareType}-grid__square ${gridSquareType}-grid__square--missed"
                    data-row="${square.row}" data-column = "${square.column}"
                    >

                    </div>
                    `;
                }
            }
            else if(stringifiedOccupiedSquares===null){
                gridSquares+=cell; 
                continue;
            }
            
            // Check 2: square was not hit, but occupied (This is only for players)
            else if(stringifiedOccupiedSquares.includes(JSON.stringify(square))){
                cell = `
                <div class = "square ${gridSquareType}-grid__square ${gridSquareType}-grid__square--occupied"
                data-row="${square.row}" data-column = "${square.column}"
                >

                </div>
                `;
            }
            // After all of this, append it to gridSquares
            gridSquares+=cell;
        }
        return gridSquares;
    }

    /**
     * 
     * @param {Player, Ai} playerInstance 
     */
    showWinningScreen(playerInstance){
        let winningScreen = `
        <div class = "gameboard-screen__winning-screen">
            <span>${playerInstance.name} won the game!</span>
        </div>
        `;

        this.displaySection.innerHTML=winningScreen;
    }

    // ============================================================
    // Binding communication callback
    // ============================================================ 

    bindRequestCommunication(controllerCallback){
        this.onRequest = controllerCallback;
    }

    // ============================================================
    // UI helper methods
    // ============================================================
    handleHeaderButtonGroup(event){
        if(event.target.closest(".button-group__standard-button")==null){return};

                let targetedButton = event.target.closest(".button-group__standard-button");
                if(targetedButton.id==="new-game-button"){
                    let wrappedRequest = this.#wrapRequest("newGame");
                    this.onRequest(wrappedRequest);
                }

                else if (targetedButton.id === "reset-game-button"){
                    let wrappedRequest = this.#wrapRequest("resetGame");
                    this.onRequest(wrappedRequest);
                }

                else if (targetedButton.id === "see-board-button"){
                    let wrappedRequest = this.#wrapRequest("showGameboardScreen");
                    this.onRequest(wrappedRequest);
                }
    }

    handlePlayerCreationScreen(event){
        if(event.target.closest(".input-wrapper__standard-button")==null){return};
            let playerName = event.target.closest('.player-creation-screen').querySelector("#name-input").value;

            let wrappedRequest = this.#wrapRequest("createPlayerAndEnemy", [playerName]);
            this.onRequest(wrappedRequest);
    }

    handleGameboardScreen(event){
        // Case 1: The event came from the enemy gameboard representation
        // This means that an attack is occuring
        if(event.target.closest(".gameboard-screen__enemy-grid")!=null){
            if(event.target.closest(".enemy-grid__square")==null){
                return;
            }
            let targetedSquare = event.target.closest(".enemy-grid__square");
            let row = Number(targetedSquare.dataset.row);
            let column = Number(targetedSquare.dataset.column);

            let coordinatePayload = {
                "row": row,
                "column": column
            };

            let wrappedRequest = this.#wrapRequest("attackAiEnemy", [coordinatePayload]);
            this.onRequest(wrappedRequest);
        }
        // Case 2: The event came from the player gameboard representation
        // This means that a player is placing ships
        else if(event.target.closest(".gameboard-screen__player-grid")!=null){
            if(event.target.closest(".player-grid__square")==null){
                return;
            }
            if(this.selectedShipPlacementSquare==null){
                this.selectedShipPlacementSquare = event.target.closest(".player-grid__square");                
            }
            else if(this.selectedShipPlacementSquare!=null){
                let previousTargetedSquare = this.selectedShipPlacementSquare;
                let currentTargetedSquare = event.target.closest(".player-grid__square");

                let previousData = {
                    "row": Number(previousTargetedSquare.dataset.row),
                    "column": Number(previousTargetedSquare.dataset.column)
                };

                let currentData = {
                    "row": Number(currentTargetedSquare.dataset.row),
                    "column": Number(currentTargetedSquare.dataset.column)
                }

                this.selectedShipPlacementSquare=null;

                let wrappedRequest = this.#wrapRequest("placeShip", [previousData, currentData, this.shipTypeToPlace]);
                this.onRequest(wrappedRequest);
            }
        }
        // Case 3: The event came from the ship type selection panel
        // This means that the user is selecting a shipType to place
        else if(event.target.closest(".gameboard-screen__ship-type-selection-panel")){
            if(event.target.closest(".ship-type-selection-panel__type-panel")==null){
                return;
            }
            let targetedPanel = event.target.closest(".ship-type-selection-panel__type-panel");
            this.shipTypeToPlace = Number(targetedPanel.dataset.shiptype);
            let wrappedRequest = this.#wrapRequest("changeShipTypeSelection");
            this.onRequest(wrappedRequest)
        }
    }

    #wrapRequest(request, parameters=[]){
        let wrappedRequest = {
            "request": request,
            "parameters": parameters
        };       
        return wrappedRequest;
    }
}

module.exports={View};