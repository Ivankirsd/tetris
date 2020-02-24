import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {TetrisService} from './tetris.service';
import {BoardService} from './board.service';
import {Figure} from '../classes/figure';
import tetrisConstants from '../contants/tetrisConstants';
import {FigureService} from './figure.service';
import {FigureModel, PlayingArea} from '../models/types';
import {by} from "protractor";
import {take} from "rxjs/operators";

class MockBoardService extends BoardService {
  generatePlayingArea(): number[][] {
    return [[null], [null]];
  }

  flipFigure(playingArea: number[][], focusedFigure: Figure): boolean {
    return null;
  }

  moveFigureDown(playingArea: number[][], focusedFigure: Figure): boolean {
    return null;
  }

  moveFigureRight(playingArea: number[][], focusedFigure: Figure): boolean {
    return null;
  }

  moveFigureLeft(playingArea: number[][], focusedFigure: Figure): boolean {
    return null;
  }
}

class MockFigure extends Figure {
  dX = 6;
  dY = 4;
  figureModel = [
    [1, 1, null],
    [null, 1, 1],
  ];
  private flippedFigureModel: FigureModel = [
    [null, 1],
    [1, 1],
    [1, null],
  ];

  flip(): void {
    const figureModel = this.figureModel;
    this.figureModel = this.flippedFigureModel;
    this.flippedFigureModel = figureModel;
  }

  moveDown(): void {
  }

  moveRight(): void {
  }

  moveLeft(): void {
  }
}

class MockFigureService extends FigureService {
  generateRandomFigure(): Figure {
    return new MockFigure();
  }
}

describe('TetrisService', () => {
  let tetrisService: TetrisService;
  let boardService: BoardService;
  let figureService: FigureService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TetrisService,
      // BoardService,
      // FigureService,
      {provide: FigureService, useClass: MockFigureService},
      {provide: BoardService, useClass: MockBoardService},
    ],
  }));

  it('should be created', () => {
    const service: TetrisService = TestBed.get(TetrisService);
    expect(service).toBeTruthy();
  });

  describe('when game before first launch', () => {
    it(`gameStatus should be "${tetrisConstants.GAME_STATUSES.START}"`, () => {
      tetrisService = TestBed.get(TetrisService);

      expect(tetrisService.gameStatusSubject.getValue()).toBe(tetrisConstants.GAME_STATUSES.START);
    });
  });

  describe('when called startGame()', () => {
    beforeEach(() => {
      tetrisService = TestBed.get(TetrisService);
      boardService = TestBed.get(BoardService);
      figureService = TestBed.get(FigureService);
    });

    afterEach(() => {
      tetrisService = null;
      boardService = null;
      figureService = null;
    });

    it('score should be "0"', fakeAsync(() => {
      tetrisService.scoreSubject.next(1000);
      tetrisService.startGame();

      const score = tetrisService.scoreSubject.getValue();
      expect(score).toBe(0);
      tetrisService.pauseGame();
    }));

    it(`gameStatus should be "${tetrisConstants.GAME_STATUSES.PLAY}"`, fakeAsync(() => {
      tetrisService.startGame();

      expect(tetrisService.gameStatusSubject.getValue()).toBe(tetrisConstants.GAME_STATUSES.PLAY);

      tetrisService.pauseGame();
    }));

    it('should be called boardService.generatePlayingArea()', () => {
      const generatePlayingAreaSpy = spyOn(boardService, 'generatePlayingArea');

      expect(generatePlayingAreaSpy).toHaveBeenCalledTimes(0);

      tetrisService.startGame();

      expect(generatePlayingAreaSpy).toHaveBeenCalledTimes(1);

      tetrisService.pauseGame();
    });

    it('should be called figureService.generateRandomFigure()', fakeAsync(() => {
      const generateRandomFigureSpy = spyOn(figureService, 'generateRandomFigure');
      tetrisService.startGame();

      expect(generateRandomFigureSpy).toHaveBeenCalledTimes(4);

      tetrisService.pauseGame();
    }));

    it('focusedFigure should move by itself', fakeAsync(() => {
      tetrisService.startGame();
      const moveFigureDownSpy = spyOn(boardService, 'moveFigureDown');
      tick(3000);

      expect(moveFigureDownSpy).toHaveBeenCalled();

      tetrisService.pauseGame();
    }));

    describe('figuresArray', () => {
      beforeEach(() => {
        tetrisService.startGame();
      });
      afterEach(() => {
        tetrisService.pauseGame();
      });

      it('should be Array', fakeAsync(() => {
        expect(
          Array.isArray(tetrisService.figuresArraySubject.getValue())
        ).toBeTruthy();
      }));

      it('length should be 3', fakeAsync(() => {
        expect(tetrisService.figuresArraySubject.getValue().length).toBe(3);
      }));

      it('should have Figures', fakeAsync(() => {
        tetrisService.figuresArraySubject.getValue().forEach(figure => {
          expect(figure instanceof Figure).toBe(true);
        });
      }));
    });
  });

  describe('when called pauseGame()', () => {

    beforeEach(() => {
      tetrisService = TestBed.get(TetrisService);
      boardService = TestBed.get(BoardService);

      tetrisService.startGame();
      tetrisService.pauseGame();
    });

    afterEach(() => {
      tetrisService = null;
      boardService = null;
    });

    it(`gameStatus should be "${tetrisConstants.GAME_STATUSES.PAUSE}"`, () => {
      expect(
        tetrisService.gameStatusSubject.getValue()
      ).toBe(tetrisConstants.GAME_STATUSES.PAUSE);
    });

    it('focusedFigure should not move by itself', fakeAsync(() => {
      const moveFigureDownSpy = spyOn(boardService, 'moveFigureDown');
      tick(3000);

      expect(moveFigureDownSpy).not.toHaveBeenCalled();
    }));
  });

  describe('when called continueGame()', () => {
    beforeEach(() => {
      tetrisService = TestBed.get(TetrisService);
      boardService = TestBed.get(BoardService);
    });

    afterEach(() => {
      tetrisService = null;
      boardService = null;
    });

    it(`gameStatus should be "${tetrisConstants.GAME_STATUSES.PLAY}"`, fakeAsync(() => {
      tetrisService.startGame();
      tetrisService.pauseGame();
      tetrisService.continueGame();

      expect(tetrisService.gameStatusSubject.getValue()).toBe(tetrisConstants.GAME_STATUSES.PLAY);

      tetrisService.pauseGame();
    }));

    it('figure should move by itself', fakeAsync(() => {
      tetrisService.startGame();
      tetrisService.pauseGame();
      tetrisService.continueGame();
      const moveFigureDownSpy = spyOn(boardService, 'moveFigureDown');
      tick(4000);

      expect(moveFigureDownSpy).toHaveBeenCalled();

      tetrisService.pauseGame();
    }));
  });

  describe('when called moveFigureByPressedKey()', () => {

    beforeEach(() => {
      tetrisService = TestBed.get(TetrisService);
      boardService = TestBed.get(BoardService);

    });

    afterEach(() => {
      tetrisService = null;
      boardService = null;
    });

    it('should return false if key is invalid', () => {
      tetrisService.gameStatusSubject.next(tetrisConstants.GAME_STATUSES.SATRT);

      expect(tetrisService.moveFigureByPressedKey(null)).toBe(false);
      expect(tetrisService.moveFigureByPressedKey(undefined)).toBe(false);
    });

    it(`should return false if game status is not "${tetrisConstants.GAME_STATUSES.PLAY}"`, () => {

      tetrisService.gameStatusSubject.next(tetrisConstants.GAME_STATUSES.START);
      expect(tetrisService.moveFigureByPressedKey('ArrowUp')).toBe(false);

      tetrisService.gameStatusSubject.next(tetrisConstants.GAME_STATUSES.PAUSE);
      expect(tetrisService.moveFigureByPressedKey('ArrowUp')).toBe(false);

      tetrisService.gameStatusSubject.next(tetrisConstants.GAME_STATUSES.END);
      expect(tetrisService.moveFigureByPressedKey('ArrowUp')).toBe(false);
    });

    it(
      'figure should not be moved if key is not equal "ArrowUp" or "ArrowDown" or "ArrowLeft" or "ArrowRight"',
      fakeAsync(() => {

        const flipFigureSpy = spyOn(boardService, 'flipFigure');
        const moveFigureDownSpy = spyOn(boardService, 'moveFigureDown');
        const moveFigureLeftSpy = spyOn(boardService, 'moveFigureLeft');
        const moveFigureRightSpy = spyOn(boardService, 'moveFigureRight');

        tetrisService.startGame();

        const playingAreaWithFigureSubjectSpy = spyOn(tetrisService.playingAreaWithFigureSubject, 'next');

        tetrisService.moveFigureByPressedKey('8');
        tetrisService.moveFigureByPressedKey('6');
        tetrisService.moveFigureByPressedKey(' ');
        tetrisService.moveFigureByPressedKey('Escape');

        expect(flipFigureSpy).toHaveBeenCalledTimes(0);
        expect(moveFigureDownSpy).toHaveBeenCalledTimes(0);
        expect(moveFigureLeftSpy).toHaveBeenCalledTimes(0);
        expect(moveFigureRightSpy).toHaveBeenCalledTimes(0);

        expect(playingAreaWithFigureSubjectSpy).not.toHaveBeenCalled();

        playingAreaWithFigureSubjectSpy.calls.reset();
        tetrisService.pauseGame();
      }));

    describe('figure', () => {
      let playingAreaWithFigureSubjectSpy;

      beforeEach(() => {
        tetrisService.startGame();
      });

      afterEach(() => {
        playingAreaWithFigureSubjectSpy.calls.reset();
        tetrisService.pauseGame();
      });

      it('should be flipped if key is "ArrowUp"', () => {
        const flipFigureSpy = spyOn(boardService, 'flipFigure').and.returnValue(true);
        playingAreaWithFigureSubjectSpy = spyOn(tetrisService.playingAreaWithFigureSubject, 'next');

        tetrisService.moveFigureByPressedKey('ArrowUp');

        expect(flipFigureSpy).toHaveBeenCalledTimes(1);
        expect(playingAreaWithFigureSubjectSpy).toHaveBeenCalledTimes(1);
      });

      it('should be moved down if key is "ArrowDown"', () => {
        playingAreaWithFigureSubjectSpy = spyOn(tetrisService.playingAreaWithFigureSubject, 'next');
        const moveFigureDownSpy = spyOn(boardService, 'moveFigureDown').and.returnValue(true);

        tetrisService.moveFigureByPressedKey('ArrowDown');

        expect(moveFigureDownSpy).toHaveBeenCalledTimes(1);
        expect(playingAreaWithFigureSubjectSpy).toHaveBeenCalledTimes(1);

      });

      it('should be moved left if key is "ArrowLeft"', () => {
        playingAreaWithFigureSubjectSpy = spyOn(tetrisService.playingAreaWithFigureSubject, 'next');
        const moveFigureLeftSpy = spyOn(boardService, 'moveFigureLeft').and.returnValue(true);

        tetrisService.moveFigureByPressedKey('ArrowLeft');

        expect(moveFigureLeftSpy).toHaveBeenCalledTimes(1);
        expect(playingAreaWithFigureSubjectSpy).toHaveBeenCalledTimes(1);

      });

      it('should be moved right if key is "ArrowRight"', () => {
        playingAreaWithFigureSubjectSpy = spyOn(tetrisService.playingAreaWithFigureSubject, 'next');
        const moveFigureRightSpy = spyOn(boardService, 'moveFigureRight').and.returnValue(true);

        tetrisService.moveFigureByPressedKey('ArrowRight');

        expect(moveFigureRightSpy).toHaveBeenCalledTimes(1);
        expect(playingAreaWithFigureSubjectSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when figure can not set to playingArea', () => {

    beforeEach(() => {
      tetrisService = TestBed.get(TetrisService);
      boardService = TestBed.get(BoardService);
    });

    afterEach(() => {
      tetrisService = null;
      boardService = null;
    });

    it(`game status should be set to "${tetrisConstants.GAME_STATUSES.END}"`, fakeAsync(() => {
      const playingAreaFake = [
        [null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ];
      spyOn(boardService, 'generatePlayingArea').and.returnValue(playingAreaFake);

      tetrisService.startGame();

      tick(2000);

      expect(tetrisService.gameStatusSubject.getValue()).toBe(tetrisConstants.GAME_STATUSES.END);
    }));
  });

  describe('when playingArea have full rows', () => {
    let playingAreaFake: PlayingArea;
    beforeEach(() => {
      tetrisService = TestBed.get(TetrisService);
      boardService = TestBed.get(BoardService);

      playingAreaFake = [
        [null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ];
      spyOn(boardService, 'generatePlayingArea').and.returnValue(playingAreaFake);
    });
    afterEach(() => {
      tetrisService = null;
      boardService = null;
      playingAreaFake = null;
    });

    it('full rows should be remove', fakeAsync(() => {
      tetrisService.startGame();

      tetrisService.playingAreaWithFigureSubject
        .pipe(
          take(1)
        )
        .subscribe(([playingArea, figure]) => {
          playingArea.forEach(row => {
            const playingAreaRowIsFull = row.every(cell => !!cell);
            expect(playingAreaRowIsFull).toBe(false);
          });
        });

      tick(1500);
      tetrisService.pauseGame();
    }));

    it('score should be changed ', fakeAsync(() => {
      tetrisService.startGame();
      tick(1500);

      expect(tetrisService.scoreSubject.getValue()).toBeGreaterThan(0);

      tetrisService.pauseGame();
    }));
  });
});
