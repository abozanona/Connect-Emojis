console.log('Hello, gamers');
//❤️
class GameEngine {
    gameCanvas;
    ctx;
    rowsNumbers = 15;//Both must be equal
    colsNumbers = 15;//Both must be equal
    unionHolderId = 88;
    numberOfCreatures = 2 * this.colsNumbers;
    squaresFillColors = ['#FF0000', '#0000FF', '#FF7F00', '#2E2B5F', '#00FF00', '#8B00FF', '#FFFF00'];//Rainbiw colors
    levelDeficalty = 0;//Must choose a number between 3 & 7
    map = [];
    mapVisited = [];
    mapMovedPlaces = [];
    playerX = 0;
    playerY = 0;
    playerColorIndex = 0;
    //Player progress
    unions = 0;
    shits = 0;
    prevShits = 0;
    steps = 0;
    isGameOver = false;
    init() {
        this.map = [];
        this.resetVisited();
        this.playerX = 0;
        this.playerY = 0;
        this.playerColorIndex = 0;
        this.unions = 0;
        this.prevShits = 0;
        this.shits = 0;
        this.steps = 0;
        this.levelDeficalty++;
        this.gameCanvas = document.getElementById('gameCanvas');
        this.ctx = this.gameCanvas.getContext("2d");
        this.initKeyboardListners();
        this.updatePlayerProgress()
        this.isGameOver = false;
    }
    checkIfWinOrLose() {
        let isGameOver = true;
        let peoplePhases = this.getPeoplePhases();
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                if (this.isRealHolder(this.map[i][j].holder) && peoplePhases[this.map[i][j].holder].char != '💩') {
                    isGameOver = false;
                }
                else if (this.map[i][j].holder == this.unionHolderId) {
                    isGameOver = false;
                }
            }
        }
        this.isGameOver = isGameOver;
        if (isGameOver) {
            alert("This level has ended, Moving to the next level");
            this.nextLevel();
        }
    }
    nextLevel() {
        if (this.levelDeficalty >= this.squaresFillColors.length) {
            this.isGameOver = true;
            alert("Game levels are over.");
            return;
        }
        this.map = [];
        this.resetVisited();
        this.playerX = 0;
        this.playerY = 0;
        this.playerColorIndex = 0;
        // this.unions = 0;
        this.prevShits += this.shits;
        // this.shits = 0;
        // this.steps = 0;
        this.levelDeficalty++;
        this.gameCanvas = document.getElementById('gameCanvas');
        this.ctx = this.gameCanvas.getContext("2d");
        // this.initKeyboardListners();
        this.updatePlayerProgress();
        this.isGameOver = false;
        gameEngine.initMap();
        gameEngine.render();
    }
    updatePlayerProgress() {
        document.getElementById('unions').innerText = this.unions;
        document.getElementById('shits').innerText = this.shits + this.prevShits;
        document.getElementById('steps').innerText = this.steps;
        document.getElementById('level').innerText = this.levelDeficalty;
    }
    updatePlayerPosition(x, y) {
        if (x < 0 || y < 0 || x >= this.map.length || y >= this.map.length) {
            return;
        }
        if (this.map[x][y].holder != 0 && this.map[x][y].holder != this.unionHolderId) {
            return;
        }
        if (this.map[x][y].holder == this.unionHolderId) {
            this.unions++;
            this.map[x][y].holder = 0;
            this.decreaseSuffer([x, y]);
        }
        this.map[this.playerX][this.playerY].holder = 0;
        this.playerX = x;
        this.playerY = y;
        this.map[this.playerX][this.playerY].holder = 99;
        this.updatePlayerPositionColor();
        this.render();
        this.steps++;
        this.updatePlayerProgress();
        this.moveCharacters();
        this.shitCharacters();
        this.countShets();
        this.checkIfWinOrLose();
    }
    nextPlayerPositionColor() {
        this.playerColorIndex++;
        this.playerColorIndex %= this.levelDeficalty;
        this.updatePlayerPositionColor();
    }
    updatePlayerPositionColor() {
        this.map[this.playerX][this.playerY].color = this.squaresFillColors[this.playerColorIndex];
        this.render();
    }
    initKeyboardListners() {
        let _this = this;
        document.addEventListener("keydown", function (e) {
            if (_this.isGameOver) {
                return;
            }
            e = e || window.event;
            if (e.key == 'ArrowRight') {
                _this.updatePlayerPosition(_this.playerX + 1, _this.playerY);
            }
            else if (e.key == 'ArrowLeft') {
                _this.updatePlayerPosition(_this.playerX - 1, _this.playerY);
            }
            else if (e.key == 'ArrowUp') {
                _this.updatePlayerPosition(_this.playerX, _this.playerY - 1);
            }
            else if (e.key == 'ArrowDown') {
                _this.updatePlayerPosition(_this.playerX, _this.playerY + 1);
            }
            else if (e.key == ' ') {
                _this.nextPlayerPositionColor();
            }
        });
    }
    render() {
        let canvasWidth = this.gameCanvas.width;
        let canvasHeight = this.gameCanvas.height;
        let measureBase = Math.min(canvasWidth, canvasHeight);

        let widthSquaresNumber = measureBase / this.rowsNumbers;
        let heightSquaresNumber = measureBase / this.colsNumbers;
        let baseSquareNumber = Math.min(widthSquaresNumber, heightSquaresNumber);

        //Draw squares
        for (let i = 0; i < measureBase / baseSquareNumber; i++) {
            for (let j = 0; j < measureBase / baseSquareNumber; j++) {
                let xStartPoint = i * baseSquareNumber;
                let yStartPoint = j * baseSquareNumber;

                this.ctx.fillStyle = this.map[i][j].color;
                this.ctx.fillRect(xStartPoint, yStartPoint, baseSquareNumber, baseSquareNumber);

                if (this.isRealHolder(this.map[i][j].holder)) {
                    let char = this.getPeoplePhases()[this.map[i][j].holder].char;
                    this.ctx.font = "20px Georgia";
                    this.ctx.textAlign = "center";
                    this.ctx.textBaseline = "middle";
                    this.ctx.fillText(char, xStartPoint + (baseSquareNumber / 2), yStartPoint + (baseSquareNumber / 2));
                }
                else if (this.map[i][j].holder == 99) {
                    this.ctx.beginPath();
                    this.ctx.arc(xStartPoint + (baseSquareNumber / 2), yStartPoint + (baseSquareNumber / 2), baseSquareNumber / 2, 0, 2 * Math.PI, false);
                    this.ctx.fillStyle = this.squaresFillColors[this.playerColorIndex];
                    this.ctx.fill();
                    this.ctx.lineWidth = 3;
                    this.ctx.strokeStyle = '#00300';
                    this.ctx.stroke();
                }
                else if (this.map[i][j].holder == this.unionHolderId) {
                    let char = '💞';
                    this.ctx.font = "20px Georgia";
                    this.ctx.textAlign = "center";
                    this.ctx.textBaseline = "middle";
                    this.ctx.fillText(char, xStartPoint + (baseSquareNumber / 2), yStartPoint + (baseSquareNumber / 2));
                }
            }
        }
    }
    countShets() {
        let peoplePhases = this.getPeoplePhases();
        let shits = 0;
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                if (this.isRealHolder(this.map[i][j].holder) && peoplePhases[this.map[i][j].holder].char == '💩') {
                    shits++;
                }
            }
        }
        this.shits = shits;
    }
    resetVisited() {
        let size = Math.min(this.rowsNumbers, this.colsNumbers);
        this.mapVisited = [];
        for (let i = 0; i < size; i++) {
            this.mapVisited.push([]);
            for (let j = 0; j < size; j++) {
                this.mapVisited[i].push(false);
            }
        }
    }
    resetMovedPlaces() {
        let size = Math.min(this.rowsNumbers, this.colsNumbers);
        this.mapMovedPlaces = [];
        for (let i = 0; i < size; i++) {
            this.mapMovedPlaces.push([]);
            for (let j = 0; j < size; j++) {
                this.mapMovedPlaces[i].push(false);
            }
        }
    }
    initMap() {
        let size = Math.min(this.rowsNumbers, this.colsNumbers);
        this.map = [];
        for (let i = 0; i < size; i++) {
            this.map.push([]);
            for (let j = 0; j < size; j++) {
                this.map[i].push({
                    holder: 0,
                    color: this.getRandomDiscoColor(),
                });
            }
        }
        this.map[0][0].holder = 99;//Player
        let _numberOfCreatures = this.numberOfCreatures;
        while (_numberOfCreatures) {
            let x = Math.floor(Math.random() * this.map.length);
            let y = Math.floor(Math.random() * this.map.length);
            if (!this.map[x][y].holder) {
                this.map[x][y].holder = 1;
                _numberOfCreatures--;
            }
        }
    }
    getRandomDiscoColor() {
        let colorsNumber = Math.min(this.squaresFillColors.length, this.levelDeficalty);
        return this.squaresFillColors[Math.floor(Math.random() * colorsNumber)];
    }
    getPeoplePhases() {
        let arr = [];
        arr.push({ char: ' ' });
        for (let i = 0; i < 5; i++) {
            arr.push({ char: '🥰', });
        }
        for (let i = 0; i < 5; i++) {
            arr.push({ char: '😍', });
        }
        for (let i = 0; i < 4; i++) {
            arr.push({ char: '😘', });
        }
        for (let i = 0; i < 3; i++) {
            arr.push({ char: '🥺', });
        }
        for (let i = 0; i < 4; i++) {
            arr.push({ char: '😢', });
        }
        for (let i = 0; i < 1; i++) {
            arr.push({ char: '😭', });
        }
        for (let i = 0; i < 5; i++) {
            arr.push({ char: '🤒', });
        }
        for (let i = 0; i < 3; i++) {
            arr.push({ char: '😷', });
        }
        for (let i = 0; i < 2; i++) {
            arr.push({ char: '🤢', });
        }
        for (let i = 0; i < 1; i++) {
            arr.push({ char: '😡', });
        }
        for (let i = 0; i < 3; i++) {
            arr.push({ char: '🤬', });
        }
        for (let i = 0; i < 2; i++) {
            arr.push({ char: '😈', });
        }
        for (let i = 0; i < 4; i++) {
            arr.push({ char: '👹', changeColor: true });
        }
        for (let i = 0; i < 1; i++) {
            arr.push({ char: '💀' });
        }
        for (let i = 0; i < 3; i++) {
            arr.push({ char: '☠️', shitOthers: true });
        }
        for (let i = 0; i < 3; i++) {
            arr.push({ char: '💩', shitOthers: true });
        }
        return arr;
    }
    moveCharacters() {
        this.resetMovedPlaces();
        let peoplePhases = this.getPeoplePhases();
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                if (!this.mapMovedPlaces[i][j] && this.isRealHolder(this.map[i][j].holder) && !peoplePhases[this.map[i][j].holder].shitOthers) {
                    this.resetVisited();
                    this.mapVisited[i][j] = true;
                    let result = this.findShortestPath(this.map[i][j].color, [i, j]);
                    if (result.length) {
                        this.moveSingleCharacter([i, j], result[0]);
                    }
                }
            }
        }
    }
    moveSingleCharacter(location, direction) {
        let holderNumber = this.map[location[0]][location[1]].holder;
        this.map[location[0]][location[1]].holder = 0;
        let newX = location[0],
            newY = location[1];
        if (direction == 'East') {
            newX++;
        }
        else if (direction == 'West') {
            newX--;
        }
        else if (direction == 'North') {
            newY--;
        }
        else if (direction == "South") {
            newY++;
        }
        let peoplePhases = this.getPeoplePhases();
        if (this.isRealHolder(this.map[newX][newY].holder)) {
            if (peoplePhases[this.map[newX][newY].holder].shitOthers) {
                this.map[location[0]][location[1]].holder = this.map[newX][newY].holder;
            }
            else {
                this.map[newX][newY].holder = this.unionHolderId;
            }
        }
        else {
            this.map[newX][newY].holder = holderNumber;
        }
        this.mapMovedPlaces[location[0]][location[1]] = true;
        this.mapMovedPlaces[newX][newY] = true;
        this.render();
    }
    shitCharacters() {
        let peoplePhases = this.getPeoplePhases();
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                if (this.isRealHolder(this.map[i][j].holder) && this.map[i][j].holder < peoplePhases.length - 1) {
                    this.map[i][j].holder++;
                }
            }
        }
        this.render();
    }
    decreaseSuffer(location) {
        this.decreaseSufferV1(location);
        this.decreaseSufferV2();
        this.render();
    }
    decreaseSufferV1(location) {
        let peoplePhases = this.getPeoplePhases();
        for (let i = location[0] - 2; i <= location[0] + 2; i++) {
            for (let j = location[1] - 2; j <= location[1] + 2; j++) {
                this.changeSquareHolder([i, j], 1);
            }
        }
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                if (this.isRealHolder(this.map[i][j].holder) && this.map[i][j].holder < peoplePhases.length - 1) {
                    if (!peoplePhases[this.map[i][j].holder].shitOthers) {
                        this.map[i][j].holder -= 3;
                        if (this.map[i][j].holder <= 0) {
                            this.map[i][j].holder = 1;
                        }
                    }
                }
            }
        }
    }
    changeSquareHolder(location, holder) {
        let i = location[0], j = location[1];
        if (i < 0 || j < 0 || i >= this.map.length || j >= this.map.length) {
            return;
        }
        let peoplePhases = this.getPeoplePhases();
        if (this.isRealHolder(this.map[i][j].holder)
            && this.map[i][j].holder < peoplePhases.length - 1
            && !peoplePhases[this.map[i][j].holder].shitOthers) {
            this.map[i][j].holder = holder;
        }
    }
    decreaseSufferV2() {
        let peoplePhases = this.getPeoplePhases();
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                if (this.isRealHolder(this.map[i][j].holder) && this.map[i][j].holder < peoplePhases.length - 1) {
                    if (!peoplePhases[this.map[i][j].holder].shitOthers) {
                        this.map[i][j].holder -= 2;
                        if (this.map[i][j].holder <= 0) {
                            this.map[i][j].holder = 1;
                        }
                    }
                }
            }
        }
    }
    findShortestPath(color, startCoordinates) {
        var distanceFromLeft = startCoordinates[0];
        var distanceFromTop = startCoordinates[1];

        // Each "location" will store its coordinates
        // and the shortest path required to arrive there
        var location = {
            distanceFromLeft: distanceFromLeft,
            distanceFromTop: distanceFromTop,
            path: [],
            status: 'Start',
            color: color
        };

        var queue = [location];

        // Loop through the map searching for the goal
        while (queue.length > 0) {
            // Take the first location off the queue
            var currentLocation = queue.shift();

            var newLocation = this.exploreInDirection(currentLocation, 'North', color);
            if (newLocation.status === 'Goal') {
                return newLocation.path;
            } else if (newLocation.status === 'Valid') {
                let clr = this.map[newLocation.distanceFromLeft][newLocation.distanceFromTop].color;
                if (clr == color) {
                    queue.push(newLocation);
                }
            }

            var newLocation = this.exploreInDirection(currentLocation, 'East', color);
            if (newLocation.status === 'Goal') {
                return newLocation.path;
            } else if (newLocation.status === 'Valid') {
                let clr = this.map[newLocation.distanceFromLeft][newLocation.distanceFromTop].color;
                if (clr == color) {
                    queue.push(newLocation);
                }
            }

            var newLocation = this.exploreInDirection(currentLocation, 'South', color);
            if (newLocation.status === 'Goal') {
                return newLocation.path;
            } else if (newLocation.status === 'Valid') {
                let clr = this.map[newLocation.distanceFromLeft][newLocation.distanceFromTop].color;
                if (clr == color) {
                    queue.push(newLocation);
                }
            }

            var newLocation = this.exploreInDirection(currentLocation, 'West', color);
            if (newLocation.status === 'Goal') {
                return newLocation.path;
            } else if (newLocation.status === 'Valid') {
                let clr = this.map[newLocation.distanceFromLeft][newLocation.distanceFromTop].color;
                if (clr == color) {
                    queue.push(newLocation);
                }
            }
        }

        return [];
    }
    locationStatus(location, color) {
        var gridSize = this.map.length;
        var dfl = location.distanceFromLeft;
        var dft = location.distanceFromTop;

        if (location.distanceFromTop < 0 ||
            location.distanceFromTop >= gridSize ||
            location.distanceFromLeft < 0 ||
            location.distanceFromLeft >= gridSize ||
            location.color != color) {
            return 'InvalidX';
        };
        let peoplePhases = this.getPeoplePhases();
        if (this.map[dfl][dft].holder == 99) {
            return 'Invalid:Player position';
        } else if (this.mapVisited[dfl][dft]) {
            return 'Invalid:Visited';
        } else if (this.isRealHolder(this.map[dfl][dft].holder)
            && !peoplePhases[this.map[dfl][dft].holder].shitOthers
            && this.map[dfl][dft].color == color) {
            return 'Goal';
        } else {
            return 'Valid';
        }
    }
    isRealHolder(holder) {
        let peoplePhases = this.getPeoplePhases();
        return holder && holder != 0 && holder < peoplePhases.length;
    }
    exploreInDirection(currentLocation, direction, color) {
        var newPath = currentLocation.path.slice();//Make copy of array??
        newPath.push(direction);

        var dft = currentLocation.distanceFromLeft;
        var dfl = currentLocation.distanceFromTop;
        if (direction === 'North') {
            dfl -= 1;
        } else if (direction === 'East') {
            dft += 1;
        } else if (direction === 'South') {
            dfl += 1;
        } else if (direction === 'West') {
            dft -= 1;
        }
        var newLocation = {
            distanceFromLeft: dft,
            distanceFromTop: dfl,
            path: newPath,
            status: 'Unknown',
            color: color
        };
        newLocation.status = this.locationStatus(newLocation, color);

        // If this new location is valid, mark it as 'Visited'
        if (newLocation.status === 'Valid') {
            this.mapVisited[newLocation.distanceFromLeft][newLocation.distanceFromTop] = true;
        }

        return newLocation;
    }
}

let gameEngine = new GameEngine();
gameEngine.init();
gameEngine.initMap();
gameEngine.render();