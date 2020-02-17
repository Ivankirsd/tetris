import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {TetrisService} from './tetris.service';
import {BoardService} from './board.service';
import {Figure} from '../classes/figure';
import tetrisConstants from '../contants/tetrisConstants';
import {FigureService} from './figure.service';
import {filter, take} from 'rxjs/operators';

describe('TetrisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TetrisService = TestBed.get(TetrisService);
    expect(service).toBeTruthy();
  });
});

describe('TetrisService.startGame()', () => {
  let tetrisService: TetrisService;
  let boardService: BoardService;
  let figureService: FigureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TetrisService,
        BoardService,
        FigureService,
      ]
    });

    tetrisService = TestBed.get(TetrisService);
    boardService = TestBed.get(BoardService);
    figureService = TestBed.get(FigureService);
  });

  it('after startGame score should be "0"', done => {
    tetrisService.scoreSubject.next(1000);
    tetrisService.startGame();
    tetrisService.scoreSubject
      .pipe(
        take(1)
      )
      .subscribe(score => {
        expect(score).toBe(0);
        done();
      });
  });

  it('should be generated Figures', () => {
    const generateRandomFigureSpy = spyOn(figureService, 'generateRandomFigure');
    tetrisService.startGame();

    expect(generateRandomFigureSpy).toHaveBeenCalled();

    tetrisService.pauseGame();
  });

  it('After startGame figuresArray should be created', fakeAsync(() => {
    tetrisService.startGame();

    expect(tetrisService.figuresArraySubject.getValue).toBeTruthy();

    tetrisService.pauseGame();
  }));

  it('figuresArray should be Array', fakeAsync(() => {
    tetrisService.startGame();

    expect(
      Array.isArray(tetrisService.figuresArraySubject.getValue())
    ).toBeTruthy();

    tetrisService.pauseGame();
  }));

  it('figuresArray should have just Figures', fakeAsync(() => {
    tetrisService.startGame();

    tetrisService.figuresArraySubject.getValue().forEach(figure => {
      expect(figure instanceof Figure).toBe(true);
    });

    tetrisService.pauseGame();
  }));

  it('figuresArray length should be 3', fakeAsync(() => {
    tetrisService.startGame();

    expect(tetrisService.figuresArraySubject.getValue().length).toBe(3);

    tetrisService.pauseGame();
  }));

  it('after startGame Figure should move by itself', fakeAsync(() => {
    tetrisService.startGame();
    const moveFigureDownSpy = spyOn(boardService, 'moveFigureDown');
    tick(3000);

    expect(moveFigureDownSpy).toHaveBeenCalled();

    tetrisService.pauseGame();
  }));

  it(`before first startGame gameStatus should be "${tetrisConstants.GAME_STATUSES.START}"`, () => {
    expect(tetrisService.gameStatusSubject.getValue()).toBe(tetrisConstants.GAME_STATUSES.START);
  });

  it(`after startGame gameStatus should be "${tetrisConstants.GAME_STATUSES.PLAY}"`, fakeAsync(() => {
    tetrisService.startGame();

    expect(tetrisService.gameStatusSubject.getValue()).toBe(tetrisConstants.GAME_STATUSES.PLAY);

    tetrisService.pauseGame();
  }));

  it('after startGame should generate new playingArea', () => {
    const generatePlayingAreaSpy = spyOn(boardService, 'generatePlayingArea');

    expect(generatePlayingAreaSpy).toHaveBeenCalledTimes(0);

    tetrisService.startGame();

    expect(generatePlayingAreaSpy).toHaveBeenCalledTimes(1);

    tetrisService.pauseGame();
  });
});

describe('TetrisService.pauseGame()', () => {
  let tetrisService: TetrisService;
  let boardService: BoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TetrisService,
        BoardService,
      ]
    });

    tetrisService = TestBed.get(TetrisService);
    boardService = TestBed.get(BoardService);
  });

  it(`gameStatus should be "${tetrisConstants.GAME_STATUSES.PAUSE}" if game on pause`, () => {
    tetrisService.startGame();
    tetrisService.pauseGame();

    expect(
      tetrisService.gameStatusSubject.getValue()
    ).toBe(tetrisConstants.GAME_STATUSES.PAUSE);
  });

  it('figure should not move by itself', fakeAsync(() => {
    tetrisService.startGame();
    tetrisService.pauseGame();

    const moveFigureDownSpy = spyOn(boardService, 'moveFigureDown');
    tick(3000);

    expect(moveFigureDownSpy).toHaveBeenCalledTimes(0);
  }));

});

describe('TetrisService.continueGame()', () => {
  let tetrisService: TetrisService;
  let boardService: BoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TetrisService,
        BoardService,
      ]
    });

    tetrisService = TestBed.get(TetrisService);
    boardService = TestBed.get(BoardService);
  });

  it(`After continued game gameStatus should be "${tetrisConstants.GAME_STATUSES.PLAY}"`, () => {
    tetrisService.startGame();
    tetrisService.pauseGame();
    tetrisService.continueGame();

    expect(
      tetrisService.gameStatusSubject.getValue()
    ).toBe(tetrisConstants.GAME_STATUSES.PLAY);
  });

  it('After continueGame Figure should move by itself', fakeAsync(() => {
    tetrisService.startGame();
    tetrisService.pauseGame();
    tetrisService.continueGame();

    const moveFigureDownSpy = spyOn(boardService, 'moveFigureDown');
    tick(3000);

    expect(moveFigureDownSpy).toHaveBeenCalled();

    tetrisService.pauseGame();
  }));
});

describe('TetrisService.moveFigureByPressedKey()', () => {
  let tetrisService: TetrisService;
  let boardService: BoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TetrisService,
        BoardService,
      ]
    });

    tetrisService = TestBed.get(TetrisService);
    boardService = TestBed.get(BoardService);
  });

  it('should return false if key is invalid', () => {
    tetrisService.startGame();
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

  it('should not move figure if key not equal "ArrowUp" or "ArrowDown" or "ArrowLeft" or "ArrowRight"',
    () => {
      const flipFigureSpy = spyOn(boardService, 'flipFigure');
      const moveFigureDownSpy = spyOn(boardService, 'moveFigureDown');
      const moveFigureLeftSpy = spyOn(boardService, 'moveFigureLeft');
      const moveFigureRightSpy = spyOn(boardService, 'moveFigureRight');

      tetrisService.startGame();
      tetrisService.moveFigureByPressedKey('8');
      tetrisService.moveFigureByPressedKey('6');
      tetrisService.moveFigureByPressedKey(' ');
      tetrisService.moveFigureByPressedKey('Escape');

      expect(flipFigureSpy).toHaveBeenCalledTimes(0);
      expect(moveFigureDownSpy).toHaveBeenCalledTimes(0);
      expect(moveFigureLeftSpy).toHaveBeenCalledTimes(0);
      expect(moveFigureRightSpy).toHaveBeenCalledTimes(0);

      tetrisService.pauseGame();
    }
  );

  it('Figure should be flipped if key is "ArrowUp"', () => {
    const flipFigureSpy = spyOn(boardService, 'flipFigure');

    tetrisService.startGame();
    tetrisService.moveFigureByPressedKey('ArrowUp');

    expect(flipFigureSpy).toHaveBeenCalledTimes(1);
    tetrisService.pauseGame();
  });

  it('Figure should be moved down if key is "ArrowDown"', () => {
    const moveFigureDownSpy = spyOn(boardService, 'moveFigureDown');
    tetrisService.startGame();
    tetrisService.moveFigureByPressedKey('ArrowDown');

    expect(moveFigureDownSpy).toHaveBeenCalledTimes(1);
    tetrisService.pauseGame();
  });

  it('Figure should be moved left if key is "ArrowLeft"', () => {
    const moveFigureLeftSpy = spyOn(boardService, 'moveFigureLeft');
    tetrisService.startGame();
    tetrisService.moveFigureByPressedKey('ArrowLeft');

    expect(moveFigureLeftSpy).toHaveBeenCalledTimes(1);

    tetrisService.pauseGame();
  });

  it('Figure should be moved right if key is "ArrowRight"', () => {
    const moveFigureRightSpy = spyOn(boardService, 'moveFigureRight');
    tetrisService.startGame();
    tetrisService.moveFigureByPressedKey('ArrowRight');

    expect(moveFigureRightSpy).toHaveBeenCalledTimes(1);

    tetrisService.pauseGame();
  });
});

describe('TetrisService end game', () => {
  let tetrisService: TetrisService;
  let boardService: BoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TetrisService,
        BoardService,
        FigureService,
      ]
    });

    tetrisService = TestBed.get(TetrisService);
    boardService = TestBed.get(BoardService);
  });

  it(`game status should be set to "${
    tetrisConstants.GAME_STATUSES.END}" if figure can not set to playing area`, fakeAsync(
    () => {
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
    }
  ));

});
