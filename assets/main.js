console.log('Hello, gamers');
//❤️
class GameEngine {
    gameCanvas;
    ctx;
    rowsNumbers = 15;//Both must be equal
    colsNumbers = 15;//Both must be equal
    numberOfCreatures = 2 * this.colsNumbers;
    numberOfCreatures = 2;
    squaresFillColors = ['#FF0000', '#0000FF', '#FF7F00', '#2E2B5F', '#00FF00', '#8B00FF', '#FFFF00'];//Rainbiw colors
    levelDeficalty = 1;//Must choose a number between 3 & 7
    map = [];
    mapVisited = [];
    playerX = 0;
    playerY = 0;
    playerColorIndex = 0;
    //Player progress
    unions = 0;
    shits = 0;
    steps = 0;
    init() {
        this.map = [];
        this.resetVisited();
        this.playerX = 0;
        this.playerY = 0;
        this.playerColorIndex = 0;
        this.unions = 0;
        this.shits = 0;
        this.steps = 0;
        this.gameCanvas = document.getElementById('gameCanvas');
        this.ctx = this.gameCanvas.getContext("2d");
        this.initKeyboardListners();
        this.updatePlayerProgress()
    }
    updatePlayerProgress(){
        document.getElementById('unions').innerText = this.unions;
        document.getElementById('shits').innerText = this.shits;
        document.getElementById('steps').innerText = this.steps;
    }
    updatePlayerPosition(x, y) {
        if (x < 0 || y < 0 || x > this.map.length || y > this.map.length) {
            return;
        }
        if (this.map[x][y].holder != 0) {
            return;
        }
        this.map[this.playerX][this.playerY].holder = 0;
        this.playerX = x;
        this.playerY = y;
        this.map[this.playerX][this.playerY].holder = 99;
        this.updatePlayerPositionColor();
        this.render();
        this.steps++;
        this.updatePlayerProgress();
    }
    nextPlayerPositionColor() {
        this.playerColorIndex++;
        this.playerColorIndex %= this.levelDeficalty;
        this.updatePlayerPositionColor();
    }
    updatePlayerPositionColor(){
        this.map[this.playerX][this.playerY].color = this.squaresFillColors[this.playerColorIndex];
        this.render();
    }
    initKeyboardListners() {
        let _this = this;
        document.addEventListener("keydown", function (e) {
            e = e || window.event;
            if (e.key == 'ArrowRight') {
                _this.updatePlayerPosition(_this.playerX, _this.playerY + 1);
            }
            else if (e.key == 'ArrowLeft') {
                _this.updatePlayerPosition(_this.playerX, _this.playerY - 1);
            }
            else if (e.key == 'ArrowUp') {
                _this.updatePlayerPosition(_this.playerX - 1, _this.playerY);
            }
            else if (e.key == 'ArrowDown') {
                _this.updatePlayerPosition(_this.playerX + 1, _this.playerY);
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
                let xStartPoint = j * baseSquareNumber;
                let yStartPoint = i * baseSquareNumber;

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
            }
        }
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
        return [
            { char: ' ' },
            { char: '🥰', },
            { char: '🥰', },
            { char: '😍', },
            { char: '😘', },
            { char: '🥺', },
            { char: '😢', },
            { char: '😭', },
            { char: '🤒', },
            { char: '😷', },
            { char: '🤢', },
            { char: '😡', },
            { char: '🤬', },
            { char: '😈', },
            { char: '👹', changeColor: true },
            { char: '👹', changeColor: true },
            { char: '👹', changeColor: true },
            { char: '👹', changeColor: true },
            { char: '💀', },
            { char: '☠️', shitOthers: true },
            { char: '☠️', shitOthers: true },
            { char: '☠️', shitOthers: true },
            { char: '💩', shitOthers: true },
        ];
    }
    moveCharacters() {
        let peoplePhases = this.getPeoplePhases();
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                if (this.isRealHolder(this.map[i][j].holder) && !peoplePhases[this.map[i][j].holder].shitOthers) {
                    console.log(this.map[i][j]);
                    this.resetVisited();
                    this.mapVisited[i][j] = true;
                    console.log('Final result', this.findShortestPath(this.map[i][j].color, [i, j]));
                    return;
                }
            }
        }
    }
    // gotothe(a, b) {
    //     var x = this.mex + a,
    //         y = this.mey + b;
    //     if (this.map[x] && this.map[x][y] && !(this.map[x][y] instanceof block)) {
    //         this.mex = x;
    //         this.mey = y;
    //         this.palyerMove(x, y);
    //     }
    // }
    // palyerMove(x, y) {
    //     if (this.map[x][y] instanceof coin) {
    //         this.map[x][y] = new grass();
    //         this.coins++;
    //         this.coinsInMap--;
    //         console.log('coins++;');
    //     }
    // }
    findShortestPath(color, startCoordinates) {
        console.log('color', 'startCoordinates')
        console.log(color, startCoordinates)
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
            console.log('queue', queue.map(x => x));
            // Take the first location off the queue
            var currentLocation = queue.shift();
            console.log("Stanging on", currentLocation.distanceFromLeft, currentLocation.distanceFromTop);

            var newLocation = this.exploreInDirection(currentLocation, 'West', color);
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

            var newLocation = this.exploreInDirection(currentLocation, 'East', color);
            if (newLocation.status === 'Goal') {
                return newLocation.path;
            } else if (newLocation.status === 'Valid') {
                let clr = this.map[newLocation.distanceFromLeft][newLocation.distanceFromTop].color;
                if (clr == color) {
                    queue.push(newLocation);
                }
            }

            var newLocation = this.exploreInDirection(currentLocation, 'North', color);
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

        console.log('checking', dfl, dft);

        if (location.distanceFromTop < 0 ||
            location.distanceFromTop >= gridSize ||
            location.distanceFromLeft < 0 ||
            location.distanceFromLeft >= gridSize ||
            location.color != color) {
            console.log('Result', 'InvalidX');
            return 'InvalidX';
        };
        let peoplePhases = this.getPeoplePhases();
        if (this.map[dfl][dft].holder == 99) {
            console.log('Result', 'Invalid:Player position');
            return 'Invalid:Player position';
        } else if (this.mapVisited[dfl][dft]) {
            console.log('Result', 'Invalid:Visited');
            return 'Invalid:Visited';
        } else if (this.isRealHolder(this.map[dfl][dft].holder) && !peoplePhases[this.map[dfl][dft].holder].shitOthers) {
            console.log('Result', 'Goal');
            return 'Goal';
        } else {
            console.log('Result', 'Valid');
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
        if (direction === 'West') {
            dfl -= 1;
        } else if (direction === 'South') {
            dft += 1;
        } else if (direction === 'East') {
            dfl += 1;
        } else if (direction === 'North') {
            dft -= 1;
        }
        console.log('dft', 'dfl');
        console.log(dft, dfl);
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
            this.mapVisited[newLocation.distanceFromTop][newLocation.distanceFromLeft] = true;
        }

        return newLocation;
    }
}

let gameEngine = new GameEngine();
gameEngine.init();
gameEngine.initMap();
gameEngine.render();