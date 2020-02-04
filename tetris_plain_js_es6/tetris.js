import { generateRandomFigure } from './figure.js';
import menuService from './menuService.js'
import boardService from './boardService.js';
import TETRIS_CONSTANTS from '/tetrisConstants.js';

export class Tetris {
    constructor() {
        this.score = 0
        this.scoreWasChanged = false;

        this.playingAreaSyzeX = TETRIS_CONSTANTS.PLAYING_AREA_SYZE_X;
        this.playingAreaSyzeY = TETRIS_CONSTANTS.PLAYING_AREA_SYZE_Y;
        this.playingArea = null; 

        this.figuresArray = [];  // max length 4 
        this.focusedFigure = null;

        this.addEventListeners();

        this.gameStatus = TETRIS_CONSTANTS.GAME_STATUSES.START;
        this.globalCheckIsRunning = false;
    }


    startGame() {
    
        this.playingArea = boardService.generatePlayingArea();
        boardService.renderPlayingAreaTemplate(this.playingArea);
        
        this.score = 0
        boardService.updateScore();

        this.generateFigures();
        boardService.viewFigure(this.playingArea, this.focusedFigure.getFigurePosition());

        menuService.hideMenu()

        this.startInterval();    
            
        this.gameStatus = TETRIS_CONSTANTS.GAME_STATUSES.PLAY;
    }

    pauseGame() {
        this.gameStatus = TETRIS_CONSTANTS.GAME_STATUSES.PAUSE;
        menuService.viewMenu(this.gameStatus, this.score);
        this.clearInterval();
    }

    stopGame() {
        this.gameStatus = TETRIS_CONSTANTS.GAME_STATUSES.END;
        menuService.viewMenu(this.gameStatus, this.score)
        this.clearInterval();
    }

    continueGame() {
        this.gameStatus = TETRIS_CONSTANTS.GAME_STATUSES.PLAY;
        menuService.hideMenu()
        this.startInterval();
    }

    globalCheck() {
        this.globalCheckIsRunning = true;

        if(!this.focusedFigure) {
            this.checkScore();
            
            this.generateFigures();
            if(!boardService.canSetFigureToPlayingArea(this.playingArea, this.focusedFigure.dX, this.focusedFigure.dY, this.focusedFigure.getFigure())) {
                this.stopGame();
            } 
        }

        if(this.scoreWasChanged) {
            boardService.updateScore(this.score);

            boardService.renderPlayingAreaTemplate(this.playingArea);

            this.scoreWasChanged = false;
        }
        this.globalCheckIsRunning = false;
    }

    generateFigures() {
        const maxFiguresArrayLength = 4;

        while (this.figuresArray.length < maxFiguresArrayLength) {
            this.figuresArray.push( generateRandomFigure() )
        }

        [this.focusedFigure, ...this.figuresArray] = this.figuresArray

        boardService.renderFiguresArrayTemplate(this.figuresArray);
    }

    checkScore() {
        this.playingArea.forEach((row, i) => {
            if(row.every((cell) => cell !== null)) {
                this.score += 100;
                this.scoreWasChanged = true;

                boardService.removeFullRowFromPlayingArea(this.playingArea, i);
            }
        });
    }

    addEventListeners() {
        document.addEventListener('keydown', (event) => {
            this.checkPressedKey(event);
        });

        menuService.addEventListeners({
            startGame: (event) => this.startGame(event),
            continueGame: (event) => this.continueGame(event),
        });

        boardService.addEventListeners({
            pauseGame: (event) => this.pauseGame(event)
        });
    }

    checkPressedKey({key = null}) {

        if(key === null || this.gameStatus !== TETRIS_CONSTANTS.GAME_STATUSES.PLAY) {
            return;
        }

        switch(key) {
            case 'ArrowUp': {
                boardService.flipFigure(this.playingArea, this.focusedFigure);
                break;
            }
            case 'ArrowDown': {
                this.moveFigureDown();
                break;
            }
            case 'ArrowLeft': {
                boardService.moveFigureLeft(this.playingArea, this.focusedFigure);
                break;
            }
            case 'ArrowRight': {
                boardService.moveFigureRight(this.playingArea, this.focusedFigure)
                break;
            }
        }
    }

    moveFigureDown() {
        if (!this.globalCheckIsRunning) {
            if(!boardService.moveFigureDown(this.playingArea, this.focusedFigure)) {
                this.focusedFigure = null;
            }
            this.globalCheck();
        }
    }

    startInterval() {
        this.intervalId = window.setInterval(() => {this.moveFigureDown()}, 1000);
    }
    clearInterval() {
        window.clearInterval(this.intervalId);
        this.intervalId = null;
    }
}
