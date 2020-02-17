import {TestBed} from '@angular/core/testing';

import {FigureService} from './figure.service';
import {Figure} from '../classes/figure';

describe('FigureService', () => {

  let figureService: FigureService;

  beforeEach(() => {
    figureService = new FigureService();
  });

  it('should be created', () => {
    expect(figureService).toBeTruthy();
  });
});

describe('FigureService.generateRandomFigure()', () => {

  let figureService: FigureService;

  beforeEach(() => {
    figureService = new FigureService();
  });

  it('should be return some object', () => {
    const figure: Figure = figureService.generateRandomFigure();

    expect(figure).toBeTruthy();
  });

  it('should be return Figure Object', () => {
    const figure: Figure = figureService.generateRandomFigure();
    expect(figure instanceof Figure).toBeTruthy();
  });
});
