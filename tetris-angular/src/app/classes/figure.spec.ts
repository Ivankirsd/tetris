import {Figure, Figure1} from "./figure";

describe('Figure class', () => {
  let figure: Figure;
  beforeEach(() => {
    figure = new Figure();
  });
  afterEach(() => {
    figure = null;
  });

  describe('when called moveLeft()', () => {
    it('dX should decrease  by 1', () => {
      const dXBefore = figure.dX;
      figure.moveLeft();

      expect(figure.dX).toBe(dXBefore - 1);
    });
  });

  describe('when called moveRight()', () => {
    it('dX should increase by 1', () => {
      const dXBefore = figure.dX;
      figure.moveRight();

      expect(figure.dX).toBe(dXBefore + 1);
    });
  });

  describe('when called moveDown()', () => {
    it('dY should increase by 1', () => {
      const dYBefore = figure.dY;
      figure.moveDown();

      expect(figure.dY).toBe(dYBefore + 1);
    });
  });

  describe('when called flip()', () => {
    it('figureModel should be flipped', () => {

      const figureModelBeforeFlip = [
        [null, 1, null],
        [1, 1, 1],
      ];

      const figureModelAfterFlip = [
        [1, null],
        [1, 1],
        [1, null],
      ];

      figure.setFigureModel(figureModelBeforeFlip);
      figure.flip();

      figure.getFigureModel().forEach((row, i) => {
        row.forEach((cell, j) => {
          expect(cell).toBe(figureModelAfterFlip[i][j]);
        });
      });
    });
  });
});
