import {Injectable} from '@angular/core';
import TETRIS_CONSTANTS from '../contants/tetrisConstants';
import {BoardService} from './board.service';
import {FigureService} from './figure.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {GameStatus, PlayingArea} from '../models/types';
import {Figure} from '../classes/figure';


@Injectable({
  providedIn: 'root'
})
export class TetrisService {
  private playingAreaSyzeX: number;
  private playingAreaSyzeY: number;
  private playingArea: PlayingArea;
  private focusedFigure: Figure;
  private intervalId: number;
  private globalCheckIsRunning: boolean;

  public scoreSubject: BehaviorSubject<number>;
  public figuresArraySubject: BehaviorSubject<Figure[]>;
  public playingAreaWithFigureSubject: Subject<[PlayingArea, Figure]>;
  public gameStatusSubject: BehaviorSubject<GameStatus>;


  constructor(
    private boardService: BoardService,
    private figureService: FigureService
  ) {
    this.playingAreaSyzeX = TETRIS_CONSTANTS.PLAYING_AREA_SYZE_X;
    this.playingAreaSyzeY = TETRIS_CONSTANTS.PLAYING_AREA_SYZE_Y;
    this.playingArea = null;
    this.focusedFigure = null;
    this.globalCheckIsRunning = false;

    this.scoreSubject = new BehaviorSubject<number>(0);
    this.figuresArraySubject = new BehaviorSubject<Figure[]>([]);
    this.playingAreaWithFigureSubject = new Subject<[PlayingArea, Figure]>();
    this.gameStatusSubject = new BehaviorSubject<GameStatus>(TETRIS_CONSTANTS.GAME_STATUSES.START);
  }

  startGame(): void {
    this.playingArea = this.boardService.generatePlayingArea(this.playingAreaSyzeX, this.playingAreaSyzeY);
    this.generateFigures();

    this.playingAreaWithFigureSubject.next([this.playingArea, this.focusedFigure]);
    this.scoreSubject.next(0);
    this.startInterval();
    this.gameStatusSubject.next(TETRIS_CONSTANTS.GAME_STATUSES.PLAY);
  }

  pauseGame(): void {
    this.gameStatusSubject.next(TETRIS_CONSTANTS.GAME_STATUSES.PAUSE);
    this.clearInterval();
  }

  stopGame(): void {
    this.gameStatusSubject.next(TETRIS_CONSTANTS.GAME_STATUSES.END);
    this.clearInterval();
  }

  continueGame(): void {
    this.gameStatusSubject.next(TETRIS_CONSTANTS.GAME_STATUSES.PLAY);
    this.startInterval();
  }

  globalCheck(): void {
    this.globalCheckIsRunning = true;

    if (!this.focusedFigure) {
      this.checkScore();
      this.generateFigures();

      if (
        !this.boardService.canSetFigureToPlayingArea(
          this.playingArea,
          this.focusedFigure.dX,
          this.focusedFigure.dY,
          this.focusedFigure.getFigureModel()
        )
      ) {
        this.stopGame();
      }
    }

    this.playingAreaWithFigureSubject.next([this.playingArea, this.focusedFigure]);
    this.globalCheckIsRunning = false;
  }

  generateFigures(): void {
    const maxFiguresArrayLength = 4;
    let figuresArray: Figure[] = this.figuresArraySubject.getValue();

    while (figuresArray.length < maxFiguresArrayLength) {
      figuresArray.push(this.figureService.generateRandomFigure());
    }

    [this.focusedFigure, ...figuresArray] = figuresArray;

    this.figuresArraySubject.next(figuresArray);
  }

  checkScore(): void {
    let scoreLocal = 0;

    this.playingArea.forEach((row, i) => {
      if (row.every((cell) => cell !== null)) {
        scoreLocal += 100;

        this.boardService.removeFullRowFromPlayingArea(this.playingArea, i);
      }
    });
    if (scoreLocal > 0) {
      this.scoreSubject.next(this.scoreSubject.getValue() + scoreLocal);
    }
  }

  moveFigureByPressedKey(key: string = null) {
    if (key === null || this.gameStatusSubject.getValue() !== TETRIS_CONSTANTS.GAME_STATUSES.PLAY) {
      return;
    }

    switch (key) {
      case 'ArrowUp': {
        if (this.boardService.flipFigure(this.playingArea, this.focusedFigure)) {
          this.playingAreaWithFigureSubject.next([this.playingArea, this.focusedFigure]);
        }
        break;
      }
      case 'ArrowDown': {
        this.moveFigureDown();
        break;
      }
      case 'ArrowLeft': {
        if (this.boardService.moveFigureLeft(this.playingArea, this.focusedFigure)) {
          this.playingAreaWithFigureSubject.next([this.playingArea, this.focusedFigure]);
        }
        break;
      }
      case 'ArrowRight': {
        if (this.boardService.moveFigureRight(this.playingArea, this.focusedFigure)) {
          this.playingAreaWithFigureSubject.next([this.playingArea, this.focusedFigure]);
        }
        break;
      }
    }
  }

  moveFigureDown(): void {
    if (!this.globalCheckIsRunning) {
      if (!this.boardService.moveFigureDown(this.playingArea, this.focusedFigure)) {
        this.focusedFigure = null;
      }
      this.globalCheck();
    }
  }

  startInterval(): void {
    this.intervalId = window.setInterval(() => {
      this.moveFigureDown();
    }, 1000);
  }

  clearInterval(): void {
    window.clearInterval(this.intervalId);
    this.intervalId = null;
  }
}
