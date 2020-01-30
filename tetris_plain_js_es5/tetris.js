var Tetris = (function() {
    'use strict';

    // WORK WITH TETRIS CONSTRUCTOR -----
    function Tetris() {
        this.score = 0
        this.scoreWasChanged = false;

        this.playingAreaSyzeX = 12;
        this.playingAreaSyzeY = 20;
        this.playingArea = null; 

        this.figuresArray = [];  // max length 4 
        this.focusedFigure = null;

        this.addEventListeners();

        this.gameStatus = 'start' // start, play, pause, end

        this.globalCheckIsRunning = false;
    }


    // WORK WITH GAME EVENTS -----
    Tetris.prototype.startGame = function() {
        this.generatePlayingArea();
        TeplateModule.renderPlayingAreaTemplate(this.playingArea);
        
        this.score = 0
        TeplateModule.updateScore(this.score);

        this.generateFigures();
        this.viewFigure();

        this.hideMenu();

        this.intervalId = window.setInterval(this.moveFigureDown.bind(this), 1000);
        
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
        this.gameStatus = 'play';
        this.hideMenu();

        this.intervalId = window.setInterval(this.moveFigureDown.bind(this), 1000);
    }

    Tetris.prototype.viewMenu = function() {
        TeplateModule.viewMenu(this.gameStatus, this.score);
    }

    Tetris.prototype.hideMenu = function() {
        TeplateModule.hideMenu();
    }

    Tetris.prototype.globalCheck = function() {
        this.globalCheckIsRunning = true;

        if(!this.focusedFigure) {
            this.checkScore();
            
            this.generateFigures();
            if(!this.canSetFigureToPlayingArea(this.focusedFigure.dX, this.focusedFigure.dY, this.focusedFigure.getFigure())) {
                this.stopGame();
            } 
        }

        if(this.scoreWasChanged) {
            TeplateModule.updateScore(this.score);

            TeplateModule.renderPlayingAreaTemplate(this.playingArea);

            this.scoreWasChanged = false;
        }
        this.globalCheckIsRunning = false;
    }

    // WORK WITH GAME FIGURE -----
    Tetris.prototype.generateFigures = function() {
        while (this.figuresArray.length < 4) {
            this.figuresArray.push( FigureModule.generateRandomFigure() )
        }

        this.focusedFigure = this.figuresArray.shift();
        
        TeplateModule.renderFiguresArrayTemplate(this.figuresArray);
    }

    Tetris.prototype.viewFigure = function () {
        TeplateModule.viewFigure(this.focusedFigure.getFigurePosition(), this.playingArea);
    }

    Tetris.prototype.hideFigure = function() {
        TeplateModule.hideFigure(this.focusedFigure.getFigurePosition(), this.playingArea);
    }

    Tetris.prototype.canSetFigureToPlayingArea = function(positionX, positionY, figure) {
        var midX = Math.floor(figure[0].length / 2);
        var midY =  Math.floor(figure.length / 2);

        for (var i = 0; i < figure.length; i++) {
            for (var j = 0; j < figure[i].length; j++) {
                if (i + positionY - midY < 0) {continue;}
                if (figure[i][j] !== null && (
                    (i + positionY - midY < 0) ||
                    (i + positionY - midY > this.playingArea.length - 1) ||
                    (j + positionX - midX < 0) ||
                    (j + positionX - midX > this.playingArea[0].length - 1) ||
                    (this.playingArea[i + positionY - midY][j + positionX - midX] !== null)
                )
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    Tetris.prototype.setFigureToPlayingArea = function() {
        var fig = this.focusedFigure.getFigurePosition();

        for (var i = 0; i < fig.length; i++) {
            for (var j = 0; j < fig[i].length; j++) {

                if(fig[i][j] && fig[i][j][0] < 0) {
                    continue;
                }
            
                if(fig[i][j] !== null) {
                    this.playingArea[
                        fig[i][j][0]
                    ][
                        fig[i][j][1]
                    ] = 1;
                }
            }
        }
    }

    // WORK WITH PLAYING AREA -----
    Tetris.prototype.generatePlayingArea = function() {
        this.playingArea = [];

        for(var i = 0; i < this.playingAreaSyzeY; i++) {
            var row = [];
            for (var j = 0; j < this.playingAreaSyzeX; j++) {
                row.push(null);
            }
            this.playingArea.push(row);
            row = null;
        }
    }

    Tetris.prototype.removeFullRowFromPlayingArea = function(index) {
        this.playingArea.splice(index, 1);
        var newRow = [];
        for (var i = 0; i < this.playingArea[0].length; i++) {
            newRow.push(null);
        }
        this.playingArea.unshift(newRow);
    }

    // WORK WITH SCORE -----
    Tetris.prototype.checkScore = function() {

        for (var i = 0; i < this.playingArea.length; i++) {

            var full = true;
            for (var j = 0; j < this.playingArea[i].length; j++) {
                if(!this.playingArea[i][j]) {
                    full = false;
                    break;
                }
            }
            if(full) {
                this.score += 100;
                this.scoreWasChanged = true;

                this.removeFullRowFromPlayingArea(i);
            }
        }
    }

    // WORK WITH EVENTS ------
    Tetris.prototype.addEventListeners = function() {
        TeplateModule.addEventListeners({
            checkPressedKey: this.checkPressedKey.bind(this),
            startGame: this.startGame.bind(this),
            continueGame: this.continueGame.bind(this),
            pauseGame: this.pauseGame.bind(this)
        });
    }

    Tetris.prototype.checkPressedKey = function(event) {
        switch(event.key) {
            case 'ArrowUp': {
                this.flipFigure();
                break;
            }
            case 'ArrowDown': {
                this.moveFigureDown();
                break;
            }
            case 'ArrowLeft': {
                this.moveFigureLeft();
                break;
            }
            case 'ArrowRight': {
                this.moveFigureRight();
                break;
            }
        }
    }

    Tetris.prototype.flipFigure = function() {
        this.hideFigure();

        var oldFig = this.focusedFigure.getFigure();
        this.focusedFigure.flip();
        var fig = this.focusedFigure.getFigure();

        if (!this.canSetFigureToPlayingArea(this.focusedFigure.dX, this.focusedFigure.dY, fig)) {
            var midX = Math.floor(fig[0].length / 2);

            for (var i = 1; i < midX + 1; i++) {
                if(this.canSetFigureToPlayingArea(this.focusedFigure.dX - midX + i - 1, this.focusedFigure.dY, fig)) {
                    this.focusedFigure.dX -=i;
                    this.viewFigure();
                    return;
                }
                if(this.canSetFigureToPlayingArea(this.focusedFigure.dX + i, this.focusedFigure.dY, fig)) {
                    this.focusedFigure.dX +=i;
                    this.viewFigure();
                    return;
                }
            }
            this.focusedFigure.setFigure(oldFig)
        }
        this.viewFigure();
    }
    
    Tetris.prototype.moveFigureDown = function() {
        if(!this.globalCheckIsRunning) {
            if(this.canSetFigureToPlayingArea(this.focusedFigure.dX, this.focusedFigure.dY + 1, this.focusedFigure.getFigure())) {
                this.hideFigure();
                this.focusedFigure.moveDown();
                this.viewFigure();
            } else {
                this.setFigureToPlayingArea();
                this.focusedFigure = null;
            }
            this.globalCheck();
        }
    }

    Tetris.prototype.moveFigureLeft = function() {
        if(this.canSetFigureToPlayingArea(this.focusedFigure.dX - 1, this.focusedFigure.dY, this.focusedFigure.getFigure())) {
            this.hideFigure();
            this.focusedFigure.moveLeft();
            this.viewFigure();
        }
    }
    Tetris.prototype.moveFigureRight = function() {
        if(this.canSetFigureToPlayingArea(this.focusedFigure.dX + 1, this.focusedFigure.dY, this.focusedFigure.getFigure())) {
            this.hideFigure();
            this.focusedFigure.moveRight();
            this.viewFigure();
        }
    }
    // END WORK WITH TETRIS CLASS -----

    return Tetris;
})()
