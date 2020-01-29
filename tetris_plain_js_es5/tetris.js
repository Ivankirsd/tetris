

// WORK WITH TETRIS CLASS -----
function Tetris() {
    this.score = 0
    this.scoreWasChanged = false;

    this.plaingAreaSyzeX = 12;
    this.plaingAreaSyzeY = 20;
    this.plaingArea = null; 

    this.figuresArray = [];  // max length 4 
    this.focusedFigure = null;

    this.addEventListeners();

    this.gameStatus = 'start' // start play, pause, end

    this.globalCheckIsRunning = false;
}



// WORK WITH GAME EVENTS -----
Tetris.prototype.startGame = function() {
    this.generatePlaingArea();
    this.renderPlaingAreaTemplate();
    
    this.score = 0
    this.updateScore();

    this.generateFigures();
    this.viewFigure();

    this.hideMenu();

    this.intervalId = window.setInterval(this.onMoveDown.bind(this), 1000);
    
    this.gameStatus = 'play';
}

Tetris.prototype.pauseGame = function() {
    this.gameStatus = 'pause';
    this.viewMenu();
    
    window.clearInterval(this.intervalId);
    this.intervalId = null;
}

Tetris.prototype.stopGame = function() {
    this.gameStatus = 'end';
    this.viewMenu();

    window.clearInterval(this.intervalId);
    this.intervalId = null;
}

Tetris.prototype.continueGame = function() {
    this.gameStatus = 'play'
    this.hideMenu();

    this.intervalId = window.setInterval(this.onMoveDown.bind(this), 1000);
}

Tetris.prototype.viewMenu = function() {
    document.getElementById('start-stop-modal').style = 'display: flex';
 
    if (this.gameStatus === 'start') {
        document.getElementById('score-result').innerText = '';
        document.getElementById('continue-btn-container').style = 'display: none !important'
    }
    if (this.gameStatus === 'pause') {
        document.getElementById('score-result').innerText = 'Score ' + this.score;
        document.getElementById('continue-btn-container').style = 'display: flex !important'

    }
    if (this.gameStatus === 'end') {
        document.getElementById('score-result').innerHTML = '<div>Game over!</div><div>Your score is ' + this.score + '</div>'
        document.getElementById('continue-btn-container').style = 'display: none !important'
    }
}
Tetris.prototype.hideMenu = function() {
    document.getElementById('start-stop-modal').style = 'display: none';
}

Tetris.prototype.globalCheck = function() {
    this.globalCheckIsRunning = true;

    if(!this.focusedFigure) {
        this.checkScore();
        
        this.generateFigures();
        if(!this.canSetFigureToPlaingArea(this.focusedFigure.dX, this.focusedFigure.dY, this.focusedFigure.getFigure())) {
            this.stopGame();
        } 
    }

    if(this.scoreWasChanged) {
        this.updateScore();
        this.renderPlaingAreaTemplate();
        this.scoreWasChanged = false;
    }

    this.globalCheckIsRunning = false;

}

// WORK WITH GAME FIGURE -----
Tetris.prototype.generateFigures = function() {

    while (this.figuresArray.length < 4) {
        var fig = generateRandomFigure();
        var startFlip = random(0, 3);

        for (var i = 0; i < startFlip; i++) {
            fig.flip();   
        }
        this.figuresArray.push( fig )
    }

    this.focusedFigure = this.figuresArray.shift();
    
    this.renderFiguresArrayTemplate();
}

Tetris.prototype.viewFigure = function () {
    var fig = this.focusedFigure.getFigurePosition();
    
    for (var i = 0; i < fig.length; i++) {
        for (var j = 0; j < fig[i].length; j++) {
            if (fig[i][j] &&
                fig[i][j][0] > -1 &&
                fig[i][j][1] > -1 &&
                fig[i][j][1] < this.plaingArea[0].length) {
                var cell = document.getElementById( fig[i][j][0] + '_' + fig[i][j][1]);
                cell.classList.add('active');
            }
        }
    }
}
Tetris.prototype.hideFigure = function() {
    var fig = this.focusedFigure.getFigurePosition();

    for (var i = 0; i < fig.length; i++) {
        for (var j = 0; j < fig[i].length; j++) {

            if (fig[i][j] &&
                fig[i][j][0] > -1 &&
                fig[i][j][1] > -1 &&
                fig[i][j][1] < this.plaingArea[0].length) {
                var cell = document.getElementById( fig[i][j][0] + '_' + fig[i][j][1]);
                cell.classList.remove('active');
            }
        }
    }
}
Tetris.prototype.canSetFigureToPlaingArea = function(positionX, positionY, figure) {
    var midX = Math.floor(figure[0].length / 2);
    var midY =  Math.floor(figure.length / 2);

    for (var i = 0; i < figure.length; i++) {
        for (var j = 0; j < figure[i].length; j++) {
            if (i + positionY - midY < 0) {continue;}
            if (figure[i][j] !== null && (
                (i + positionY - midY < 0) ||
                (i + positionY - midY > this.plaingArea.length - 1) ||
                (j + positionX - midX < 0) ||
                (j + positionX - midX > this.plaingArea[0].length - 1) ||
                (this.plaingArea[i + positionY - midY][j + positionX - midX] !== null)
            )
            ) {
                return false;
            }
        }
    }
    return true;
}
Tetris.prototype.setFigureToPlaingArea = function() {
    var fig = this.focusedFigure.getFigurePosition();

    for (var i = 0; i < fig.length; i++) {
        for (var j = 0; j < fig[i].length; j++) {

            if(fig[i][j] && fig[i][j][0] < 0) {
                continue;
            }
            if(fig[i][j] !== null) {
                this.plaingArea[
                    fig[i][j][0]
                ][
                    fig[i][j][1]
                ] = 1;
            }
        }
    }
}
Tetris.prototype.renderFiguresArrayTemplate = function() {
    var figuresRef = document.getElementById('figures');

    var result = [];

    for (var f = 0; f < this.figuresArray.length; f++) {
        result.push('<div class="figure">');

        var fig = this.figuresArray[f].getFigure();
        
        for (var i = 0; i < fig.length; i++) {
            result.push('<div class="row">')
            for (var j = 0; j < fig[i].length; j++) {
                result.push('<div class="cell '+ (fig[i][j] ? 'active' : '') +'"></div>')
            }
            result.push('</div>')            
        }
        result.push('</div>');
    }

    figuresRef.innerHTML = result.join('');
}

// WORK WITH PLAING AREA -----
Tetris.prototype.generatePlaingArea = function() {
    this.plaingArea = [];
    for(var i = 0; i < this.plaingAreaSyzeY; i++) {
        var row = [];
        for (var j = 0; j < this.plaingAreaSyzeX; j++) {
            row.push(null);
        }
        this.plaingArea.push(row);
        row = null;
    }
}
Tetris.prototype.renderPlaingAreaTemplate = function() {
    if(!this.plaingAreaRef) {
        this.plaingAreaRef = document.getElementById('plaing-area');
    }

    var innerHTML = '';
    for (var i = 0; i < this.plaingArea.length; i++) {
        innerHTML += '<div class="row">'
        for (var j = 0; j < this.plaingArea[0].length; j++) {
            innerHTML += '<div id="'+ i + '_'+ j +'" class="cell ' + (this.plaingArea[i][j] ? 'active' : '') + '"></div>'
        }
        innerHTML += '</div>'
        
    }
    this.plaingAreaRef.innerHTML = innerHTML;
}
Tetris.prototype.removeFullRowFromPlaingArea = function(index) {
    this.plaingArea.splice(index, 1);
    var newRow = [];
    for (let i = 0; i < this.plaingArea[0].length; i++) {
        newRow.push(null);
    }
    this.plaingArea.unshift(newRow);
} 

// WORK WITH SCORE -----
Tetris.prototype.checkScore = function() {


    for (var i = 0; i < this.plaingArea.length; i++) {

        var full = true;
        for (var j = 0; j < this.plaingArea[i].length; j++) {
            if(!this.plaingArea[i][j]) {
                full = false;
                break;
            }
        }
        if(full) {
            this.score += 100;
            this.scoreWasChanged = true;

            this.removeFullRowFromPlaingArea(i);
        }
        
    }

}
Tetris.prototype.updateScore = function() {
    document.getElementById('score').innerText = 'Score: ' + this.score;
}

// WORK WITH EVENTS ------

Tetris.prototype.addEventListeners = function() {

    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.getElementById('start-btn').addEventListener('click', this.startGame.bind(this));
    document.getElementById('continue-btn').addEventListener('click', this.continueGame.bind(this));
    document.getElementById('pause-btn').addEventListener('click', this.pauseGame.bind(this));
}

Tetris.prototype.onKeyDown = function(event) {
    switch(event.key) {
        case 'ArrowUp': {
            this.onFlip();
            break;
        }
        case 'ArrowDown': {
            this.onMoveDown();
            break;
        }
        case 'ArrowLeft': {
            this.onMoveLeft();
            break;
        }
        case 'ArrowRight': {
            this.onMoveRight();
            break;}
    }
}
Tetris.prototype.onMoveRight = function() {
    if(this.canSetFigureToPlaingArea(this.focusedFigure.dX + 1, this.focusedFigure.dY, this.focusedFigure.getFigure())) {
        this.hideFigure();
        this.focusedFigure.moveRight();
        this.viewFigure();
    }
    
}
Tetris.prototype.onMoveLeft = function() {
    
    if(this.canSetFigureToPlaingArea(this.focusedFigure.dX - 1, this.focusedFigure.dY, this.focusedFigure.getFigure())) {
        this.hideFigure();
        this.focusedFigure.moveLeft();
        this.viewFigure();

    }
}
Tetris.prototype.onFlip = function() {
    // debugger
    this.hideFigure();

    var oldFig = this.focusedFigure.getFigure();
    this.focusedFigure.flip();
    var fig = this.focusedFigure.getFigure();

    if (!this.canSetFigureToPlaingArea(this.focusedFigure.dX, this.focusedFigure.dY, fig)) {
        var midX = Math.floor(fig[0].length / 2);

        for (var i = 1; i < midX + 1; i++) {
            if(this.canSetFigureToPlaingArea(this.focusedFigure.dX - midX + i - 1, this.focusedFigure.dY, fig)) {
                this.focusedFigure.dX -=i;
                this.viewFigure();
                return;
            }
            if(this.canSetFigureToPlaingArea(this.focusedFigure.dX + i, this.focusedFigure.dY, fig)) {
                this.focusedFigure.dX +=i;
                this.viewFigure();
                return;
            }
            
        }
        this.focusedFigure.setFigure(oldFig)

    }
    this.viewFigure();

}
Tetris.prototype.onMoveDown = function() {

    if(!this.globalCheckIsRunning) {
        if(this.canSetFigureToPlaingArea(this.focusedFigure.dX, this.focusedFigure.dY + 1, this.focusedFigure.getFigure())) {
            this.hideFigure();
            this.focusedFigure.moveDown();
            this.viewFigure();
        } else {
            this.setFigureToPlaingArea();
            this.focusedFigure = null;
        }
        this.globalCheck();
    }
}

// END WORK WITH TETRIS CLASS -----




// WORK WITH FIGURES ---------
function Figure() {
    // [null, 1,  1  ]
    // [ 1,   1, null]  

    this.dX = 6;
    this.dY = 0;
}
Figure.prototype.getFigure = function() {
    return this.figure;
};
Figure.prototype.setFigure = function(figure) {
    this.figure = figure;
};
Figure.prototype.getFigurePosition = function() {
    var midX = Math.floor(this.figure[0].length / 2);
    var midY =  Math.floor(this.figure.length / 2);

    var fig = [];
    for (var i = 0; i < this.figure.length; i++) {
        var row = []
        for (var j = 0; j < this.figure[i].length; j++) {
            if (this.figure[i][j]) {
                row.push([
                    i - midY + this.dY,
                    j - midX + this.dX
                ]);
            } else {
                row.push(null);
            }
        }        
        fig.push(row);
        row = null;
    }

    return fig;
};

Figure.prototype.moveLeft = function(){
    this.dX--;
}
Figure.prototype.moveRight = function(){
    this.dX++;
}

Figure.prototype.moveDown = function(){
    this.dY++;
}

Figure.prototype.flip = function(){
    var fig = [];

    for (var i = 0; i < this.figure.length; i++) {
        for (var j = 0; j < this.figure[i].length; j++) {

            if (i === 0) {
                fig.push([ 
                    this.figure[this.figure.length - 1 - i][j] !== null ?
                    1 :
                    null
                ]);
            } else {
                fig[j].push(
                    this.figure[this.figure.length - 1 - i][j] !== null ? 1 : null
                );
            }
        }        
    }

    this.figure = fig;
}


function Figure1() {

    this.figure = [
        [1, 1, null],
        [null,1,1]
    ]
    Figure.call(this);
}
Figure1.prototype = Object.create(Figure.prototype);
Figure1.prototype.constructor = Figure1;


function Figure2() {

    this.figure = [
        [null, 1, 1],
        [1,1, null]
    ];
    Figure.call(this);
}
Figure2.prototype = Object.create(Figure.prototype);
Figure2.prototype.constructor = Figure2;

function Figure3() {
    this.figure = [
        [1, 1, 1],
        [null, 1 , null]
    ];
    Figure.call(this);
}
Figure3.prototype = Object.create(Figure.prototype);
Figure3.prototype.constructor = Figure3;


function Figure4() {
    this.figure = [
        [1, 1],
        [1, 1]
    ];
    Figure.call(this);
}
Figure4.prototype = Object.create(Figure.prototype);
Figure4.prototype.constructor = Figure4;

function Figure5() {
    this.figure = [
        [1, 1, 1, 1]
    ];
    Figure.call(this);
}
Figure5.prototype = Object.create(Figure.prototype);
Figure5.prototype.constructor = Figure5;

function Figure6() {
    this.figure = [
        [1, 1, 1],
        [1,null, null]
    ];
    Figure.call(this);
}
Figure6.prototype = Object.create(Figure.prototype);
Figure6.prototype.constructor = Figure6;

function Figure7() {
    this.figure = [
        [1, 1, 1],
        [null,null, 1]
    ];
    Figure.call(this);
}
Figure7.prototype = Object.create(Figure.prototype);
Figure7.prototype.constructor = Figure7;

// END WORK WITH FIGURES -----


window.addEventListener('load', function () {
    var tetris = new Tetris();
});


function generateRandomFigure(){
    var min = 1;
    var max = 7;
    var number = random(min, max);

    switch(number) {
        case 1: {
            return new Figure1();
        }
        case 2: {
            return new Figure2();
        }
        case 3: {
            return new Figure3();
        }
        case 4: {
            return new Figure4();
        }
        case 5: {
            return new Figure5();
        }
        case 6: {
            return new Figure6();
        }
        case 7: {
            return new Figure7();
        }
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}