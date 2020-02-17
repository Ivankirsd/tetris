import {TestBed} from '@angular/core/testing';

import {BoardService} from './board.service';
import TETRIS_CONSTANTS from '../contants/tetrisConstants';
import {FigureModelWithPositions, PlayingArea} from '../models/types';
import {FigureService} from './figure.service';
import {Figure} from '../classes/figure';

describe('BoardService', () => {
  let boardService: BoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    boardService = TestBed.get(BoardService);
  });

  afterEach(() => {
    boardService = null;
  });

  it('should be created', () => {
    expect(boardService).toBeTruthy();
  });

  describe('when called generatePlayingArea()', () => {
    beforeEach(() => {
      boardService = TestBed.get(BoardService);
    });

    afterEach(() => {
      boardService = null;
    });

    it('should be returned array of arrays', () => {
      const playingArea: PlayingArea = boardService.generatePlayingArea();
      expect(Array.isArray(playingArea)).toBeTruthy();
      expect(Array.isArray(playingArea[0])).toBeTruthy();
    });

    it('playingArea should be created with default size if arguments do not pass', () => {
      const playingArea = boardService.generatePlayingArea();

      expect(playingArea.length).toBe(TETRIS_CONSTANTS.PLAYING_AREA_SYZE_Y);
      expect(playingArea[0].length).toBe(TETRIS_CONSTANTS.PLAYING_AREA_SYZE_X);
    });

    it('playingArea should be created with exact passed params size', () => {
      const sizeX = 3;
      const sizeY = 8;

      const playingArea = boardService.generatePlayingArea(sizeX, sizeY);
      expect(playingArea.length).toBe(sizeY);
      expect(playingArea[0].length).toBe(sizeX);
    });
  });

  describe('when called removeFullRowFromPlayingArea()', () => {
    beforeEach(() => {
      boardService = TestBed.get(BoardService);
    });

    afterEach(() => {
      boardService = null;
    });

    it('should throw an error whenever a playingArea is invalid', () => {

      expect(() => {
        boardService.removeFullRowFromPlayingArea(null, 0);
      }).toThrowError(/PlayingArea param is invalid/);
      expect(() => {
        boardService.removeFullRowFromPlayingArea(undefined, 0);
      }).toThrowError(/PlayingArea param is invalid/);
      expect(() => {
        boardService.removeFullRowFromPlayingArea([], 0);
      }).toThrowError(/PlayingArea param is invalid/);
      expect(() => {
        boardService.removeFullRowFromPlayingArea([null], 0);
      }).toThrowError(/PlayingArea param is invalid/);
      expect(() => {
        boardService.removeFullRowFromPlayingArea([[]], 0);
      }).toThrowError(/PlayingArea param is invalid/);
    });

    it('should throw an error whenever index is invalid', () => {
      const playingArea: PlayingArea = boardService.generatePlayingArea();

      expect(() => {
        boardService.removeFullRowFromPlayingArea(playingArea, -1);
      }).toThrowError(/Index is invalid/);

      expect(() => {
        boardService.removeFullRowFromPlayingArea(playingArea, NaN);
      }).toThrowError(/Index is invalid/);

      expect(() => {
        boardService.removeFullRowFromPlayingArea(playingArea, -Infinity);
      }).toThrowError(/Index is invalid/);

      expect(() => {
        boardService.removeFullRowFromPlayingArea(playingArea, +Infinity);
      }).toThrowError(/Index is invalid/);

      expect(() => {
        boardService.removeFullRowFromPlayingArea(playingArea, playingArea.length);
      }).toThrowError(/Index is invalid/);
    });

    it('should remove row by index', () => {
      const playingArea: PlayingArea = boardService.generatePlayingArea();
      const removedRowIndex = 8;
      const removedRow = playingArea[removedRowIndex];

      boardService.removeFullRowFromPlayingArea(playingArea, removedRowIndex);

      expect(playingArea.findIndex(row => row === removedRow)).toBe(-1);
    });

    it('playingArea size should not be changed', () => {
      const playingArea: PlayingArea = boardService.generatePlayingArea();
      const rowIndex = 0;
      const lengthBefore = playingArea.length;
      let lengthAfter: number;

      boardService.removeFullRowFromPlayingArea(playingArea, rowIndex);

      lengthAfter = playingArea.length;

      expect(lengthBefore).toBe(lengthAfter);
    });
  });

});


describe('BoardService.canSetFigureToPlayingArea()', () => {
  let boardService: BoardService;
  let figureService: FigureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FigureService
      ]
    });
    boardService = TestBed.get(BoardService);
    figureService = TestBed.get(FigureService);
  });

  it('should return false with invalid PlayingArea param', () => {
    const figure = figureService.generateRandomFigure();
    const figureModel = figure.getFigureModel();

    expect(
      boardService.canSetFigureToPlayingArea(null, 0, 0, figureModel)
    ).toBeFalsy();
    expect(
      boardService.canSetFigureToPlayingArea(undefined, 0, 0, figureModel)
    ).toBeFalsy();
    expect(
      boardService.canSetFigureToPlayingArea([], 0, 0, figureModel)
    ).toBeFalsy();
    expect(
      boardService.canSetFigureToPlayingArea([null], 0, 0, figureModel)
    ).toBeFalsy();
    expect(
      boardService.canSetFigureToPlayingArea([[]], 0, 0, figureModel)
    ).toBeFalsy();
  });

  it('should return false with invalid positions param', () => {
    const playingArea: PlayingArea = boardService.generatePlayingArea();
    const figure = figureService.generateRandomFigure();
    const figureModel = figure.getFigureModel();

    expect(
      boardService.canSetFigureToPlayingArea(playingArea, NaN, 0, figureModel)
    ).toBeFalsy();
    expect(
      boardService.canSetFigureToPlayingArea(playingArea, -Infinity, 0, figureModel)
    ).toBeFalsy();
    expect(
      boardService.canSetFigureToPlayingArea(playingArea, +Infinity, 0, figureModel)
    ).toBeFalsy();

    expect(
      boardService.canSetFigureToPlayingArea(playingArea, 0, NaN, figureModel)
    ).toBeFalsy();
    expect(
      boardService.canSetFigureToPlayingArea(playingArea, 0, -Infinity, figureModel)
    ).toBeFalsy();
    expect(
      boardService.canSetFigureToPlayingArea(playingArea, 0, +Infinity, figureModel)
    ).toBeFalsy();
  });

  it('should return false with invalid figureModel param', () => {
    const playingArea: PlayingArea = boardService.generatePlayingArea();

    expect(
      boardService.canSetFigureToPlayingArea(playingArea, 0, 0, null)
    ).toBeFalsy();
    expect(
      boardService.canSetFigureToPlayingArea(playingArea, 0, 0, undefined)
    ).toBeFalsy();
    expect(
      boardService.canSetFigureToPlayingArea(playingArea, 0, 0, [])
    ).toBeFalsy();
    expect(
      boardService.canSetFigureToPlayingArea(playingArea, 0, 0, [null])
    ).toBeFalsy();
    expect(
      boardService.canSetFigureToPlayingArea(playingArea, 0, 0, [[], []])
    ).toBeFalsy();
  });

  it('should return true if figure can set to playingArea', () => {
    const playingArea: PlayingArea = boardService.generatePlayingArea();
    const figure = figureService.generateRandomFigure();
    const positionX = 5;
    const positionY = 5;

    expect(boardService.canSetFigureToPlayingArea(playingArea, positionX, positionY, figure.getFigureModel())
    ).toBe(true);

  });

  it('should return false if figure can not set to playingArea', () => {
    const playingArea: PlayingArea = boardService.generatePlayingArea();
    const figure = figureService.generateRandomFigure();
    const positionX = 5;
    const positionY = 5;
    playingArea[positionX][positionY] = 1;

    expect(boardService.canSetFigureToPlayingArea(playingArea, positionX, positionY, figure.getFigureModel()))
      .toBe(false);
  });

  it('should return false if figure positions outside of playingArea, except top position (position Y < 0)', () => {
    const playingArea: PlayingArea = boardService.generatePlayingArea();
    const figure = figureService.generateRandomFigure();

    const sizeX = TETRIS_CONSTANTS.PLAYING_AREA_SYZE_X;
    const sizeY = TETRIS_CONSTANTS.PLAYING_AREA_SYZE_Y;
    const middleX = Math.floor(sizeX / 2);
    const middleY = Math.floor(sizeY / 2);
    const positions = [
      [-1, middleY],
      [sizeX, middleY],
      // [middleX, -1],
      [middleX, sizeY],
    ];

    positions.forEach(position => {
      expect(boardService.canSetFigureToPlayingArea(playingArea, position[0], position[1], figure.getFigureModel())
      ).toBe(false);
    });
  });
});

describe('BoardService.flipFigure()', () => {
  let boardService: BoardService;
  let figureService: FigureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FigureService
      ]
    });
    boardService = TestBed.get(BoardService);
    figureService = TestBed.get(FigureService);
  });

  it('should return false with invalid PlayingArea param', () => {
    const figure = figureService.generateRandomFigure();

    expect(
      boardService.flipFigure(null, figure)
    ).toBe(false);
    expect(
      boardService.flipFigure(undefined, figure)
    ).toBe(false);
    expect(
      boardService.flipFigure([], figure)
    ).toBe(false);
    expect(
      boardService.flipFigure([null], figure)
    ).toBe(false);
    expect(
      boardService.flipFigure([[]], figure)
    ).toBe(false);
  });

  it('should return false with invalid Figure param', () => {
    const playingArea: PlayingArea = boardService.generatePlayingArea();

    expect(
      boardService.flipFigure(playingArea, null)
    ).toBe(false);
    expect(
      boardService.flipFigure(playingArea, undefined)
    ).toBe(false);
    expect(
      boardService.flipFigure(playingArea, {} as Figure)
    ).toBe(false);
  });

  it('should return true if figure can be flipped', () => {
    const playingArea: PlayingArea = boardService.generatePlayingArea();
    const figure = figureService.generateRandomFigure();

    expect(
      boardService.flipFigure(playingArea, figure)
    ).toBe(true);
  });

  it('should return false if figure can not be flipped', () => {
    const playingArea: PlayingArea = [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1]
    ];
    const figure = figureService.generateRandomFigure();

    expect(
      boardService.flipFigure(playingArea, figure)
    ).toBe(false);
  });
});

describe('BoardService.moveFigureDown()', () => {
  let boardService: BoardService;
  let figureService: FigureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FigureService
      ]
    });
    boardService = TestBed.get(BoardService);
    figureService = TestBed.get(FigureService);
  });

  it('should cause error with invalid PlayingArea param', () => {
    const figure = figureService.generateRandomFigure();

    expect(
      () => boardService.moveFigureDown(null, figure)
    ).toThrowError(/PlayingArea param is invalid/);
    expect(
      () => boardService.moveFigureDown(undefined, figure)
    ).toThrowError(/PlayingArea param is invalid/);
    expect(
      () => boardService.moveFigureDown([], figure)
    ).toThrowError(/PlayingArea param is invalid/);
    expect(
      () => boardService.moveFigureDown([null], figure)
    ).toThrowError(/PlayingArea param is invalid/);
    expect(
      () => boardService.moveFigureDown([[]], figure)
    ).toThrowError(/PlayingArea param is invalid/);
  });

  it('should cause error with invalid Figure param', () => {
    const playingArea: PlayingArea = boardService.generatePlayingArea();

    expect(
      () => boardService.moveFigureDown(playingArea, null)
    ).toThrowError(/Figure param is invalid/);
    expect(
      () => boardService.moveFigureDown(playingArea, undefined)
    ).toThrowError(/Figure param is invalid/);
    expect(
      () => boardService.moveFigureDown(playingArea, {} as Figure)
    ).toThrowError(/Figure param is invalid/);
  });

  it('should return true if moving down is successful', () => {
    const playingArea: PlayingArea = boardService.generatePlayingArea();
    const figure = figureService.generateRandomFigure();

    expect(
      boardService.moveFigureDown(playingArea, figure)
    ).toBe(true);
  });

  it('positionY should be increased by 1 if moving down is successful', () => {
    const playingArea: PlayingArea = boardService.generatePlayingArea();
    const figure = figureService.generateRandomFigure();
    const positionYBefore = figure.dY;

    boardService.moveFigureDown(playingArea, figure);
    const positionYAfter = figure.dY;

    expect(positionYAfter - positionYBefore).toBe(1);
  });

  it('positionY should not be changed if moving down is unsuccessful', () => {
    const playingArea: PlayingArea = [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1]
    ];
    const figure = figureService.generateRandomFigure();
    const positionYBefore = figure.dY;

    boardService.moveFigureDown(playingArea, figure);
    const positionYAfter = figure.dY;

    expect(positionYAfter).toBe(positionYBefore);
  });

  it('should return false if figure can not be moved down', () => {
    const playingArea: PlayingArea = [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1]
    ];
    const figure = figureService.generateRandomFigure();

    expect(
      boardService.moveFigureDown(playingArea, figure)
    ).toBe(false);
  });

  it('Figure should be set on playingArea if it can not be moved down', () => {
    const playingArea: PlayingArea = boardService.generatePlayingArea(12, 2);
    const figure = figureService.generateRandomFigure();

    figure.setFigureModel([
      [1, 1],
      [1, 1]
    ]);
    figure.dY = 1;
    const figureModelWithPositions: FigureModelWithPositions = figure.getFigurePosition();

    figureModelWithPositions.forEach(row => {
      row.forEach(cell => {
        if (cell) {
          expect(playingArea[cell[0]][cell[1]]).toBeNull();
        }
      });
    });

    if (boardService.moveFigureDown(playingArea, figure)) {
      figureModelWithPositions.forEach(row => {
        row.forEach(cell => {
          expect(playingArea[cell[0]][cell[1]]).toBeNull();
        });
      });
    } else {
      figureModelWithPositions.forEach(row => {
        row.forEach(cell => {
          if (cell) {
            expect(playingArea[cell[0]][cell[1]]).not.toBeNull();
          }
        });
      });
    }

  });
});

describe('BoardService.moveFigureLeft()', () => {
  let boardService: BoardService;
  let figureService: FigureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FigureService
      ]
    });
    boardService = TestBed.get(BoardService);
    figureService = TestBed.get(FigureService);
  });

  it('should cause error with invalid PlayingArea param', () => {
    const figure = figureService.generateRandomFigure();

    expect(
      () => boardService.moveFigureLeft(null, figure)
    ).toThrowError(/PlayingArea param is invalid/);
    expect(
      () => boardService.moveFigureLeft(undefined, figure)
    ).toThrowError(/PlayingArea param is invalid/);
    expect(
      () => boardService.moveFigureLeft([], figure)
    ).toThrowError(/PlayingArea param is invalid/);
    expect(
      () => boardService.moveFigureLeft([null], figure)
    ).toThrowError(/PlayingArea param is invalid/);
    expect(
      () => boardService.moveFigureLeft([[]], figure)
    ).toThrowError(/PlayingArea param is invalid/);
  });

  it('should cause error with invalid Figure param', () => {
    const playingArea: PlayingArea = boardService.generatePlayingArea();

    expect(
      () => boardService.moveFigureLeft(playingArea, null)
    ).toThrowError(/Figure param is invalid/);
    expect(
      () => boardService.moveFigureLeft(playingArea, undefined)
    ).toThrowError(/Figure param is invalid/);
    expect(
      () => boardService.moveFigureLeft(playingArea, {} as Figure)
    ).toThrowError(/Figure param is invalid/);
  });

  it('should return true if moving left is successful', () => {
    const playingArea: PlayingArea = boardService.generatePlayingArea();
    const figure = figureService.generateRandomFigure();

    expect(boardService.moveFigureLeft(playingArea, figure)).toBe(true);
  });

  it('positionX should be decreased by 1 if moving left is successful', () => {
    const playingArea: PlayingArea = boardService.generatePlayingArea();
    const figure = figureService.generateRandomFigure();
    const positionXBefore = figure.dX;

    boardService.moveFigureLeft(playingArea, figure);
    const positionXAfter = figure.dX;

    expect(positionXAfter - positionXBefore).toBe(-1);
  });

  it('positionX should not be changed if moving left is unsuccessful', () => {
    const playingArea: PlayingArea = [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1]
    ];
    const figure = figureService.generateRandomFigure();
    const positionXBefore = figure.dX;

    boardService.moveFigureLeft(playingArea, figure);
    const positionXAfter = figure.dX;

    expect(positionXAfter).toBe(positionXBefore);
  });

  it('should return false if figure can not be moved left', () => {
    const playingArea: PlayingArea = [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1]
    ];
    const figure = figureService.generateRandomFigure();

    expect(
      boardService.moveFigureLeft(playingArea, figure)
    ).toBe(false);
  });
});

describe('BoardService.moveFigureRight()', () => {
  let boardService: BoardService;
  let figureService: FigureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FigureService
      ]
    });
    boardService = TestBed.get(BoardService);
    figureService = TestBed.get(FigureService);
  });

  it('should cause error with invalid PlayingArea param', () => {
    const figure = figureService.generateRandomFigure();

    expect(
      () => boardService.moveFigureRight(null, figure)
    ).toThrowError(/PlayingArea param is invalid/);
    expect(
      () => boardService.moveFigureRight(undefined, figure)
    ).toThrowError(/PlayingArea param is invalid/);
    expect(
      () => boardService.moveFigureRight([], figure)
    ).toThrowError(/PlayingArea param is invalid/);
    expect(
      () => boardService.moveFigureRight([null], figure)
    ).toThrowError(/PlayingArea param is invalid/);
    expect(
      () => boardService.moveFigureRight([[]], figure)
    ).toThrowError(/PlayingArea param is invalid/);
  });

  it('should cause error with invalid Figure param', () => {
    const playingArea: PlayingArea = boardService.generatePlayingArea();

    expect(
      () => boardService.moveFigureRight(playingArea, null)
    ).toThrowError(/Figure param is invalid/);
    expect(
      () => boardService.moveFigureRight(playingArea, undefined)
    ).toThrowError(/Figure param is invalid/);
    expect(
      () => boardService.moveFigureRight(playingArea, {} as Figure)
    ).toThrowError(/Figure param is invalid/);
  });

  it('should return true if moving right is successful', () => {
    const playingArea: PlayingArea = boardService.generatePlayingArea();
    const figure = figureService.generateRandomFigure();

    expect(boardService.moveFigureRight(playingArea, figure)).toBe(true);
  });

  it('positionX should be increased by 1 if moving right is successful', () => {
    const playingArea: PlayingArea = boardService.generatePlayingArea();
    const figure = figureService.generateRandomFigure();
    const positionXBefore = figure.dX;

    boardService.moveFigureRight(playingArea, figure);
    const positionXAfter = figure.dX;

    expect(positionXAfter - positionXBefore).toBe(1);
  });

  it('positionX should not be changed if moving right is unsuccessful', () => {
    const playingArea: PlayingArea = [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1]
    ];
    const figure = figureService.generateRandomFigure();
    const positionXBefore = figure.dX;

    boardService.moveFigureRight(playingArea, figure);
    const positionXAfter = figure.dX;

    expect(positionXAfter).toBe(positionXBefore);
  });

  it('should return false if figure can not be moved right', () => {
    const playingArea: PlayingArea = [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1]
    ];
    const figure = figureService.generateRandomFigure();

    expect(
      boardService.moveFigureRight(playingArea, figure)
    ).toBe(false);
  });
});
